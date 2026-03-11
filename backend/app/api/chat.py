"""Chat API endpoint."""

import json
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from openai import OpenAIError
from pydantic import BaseModel, Field

from app.middleware.rate_limit import RATE_LIMIT_RULE, limiter
from app.services.openai_service import OpenAIService, get_openai_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["chat"])

# Maximum characters allowed in a chat message (keep in sync with frontend)
MAX_MESSAGE_LENGTH = 500


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""

    class ChatMessage(BaseModel):
        """Chat message for conversation history."""

        role: str = Field(
            description="Message role: user or assistant",
            pattern="^(user|assistant)$",
        )
        content: str = Field(min_length=1, max_length=MAX_MESSAGE_LENGTH, description="Message content")

    message: Annotated[
        str,
        Field(
            min_length=1,
            max_length=MAX_MESSAGE_LENGTH,
            description="User message to send to the chatbot",
        ),
    ]
    history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=10,
        description="Recent conversation history (user and assistant messages, max 10)",
    )


class ErrorResponse(BaseModel):
    """Error response model."""

    error: str
    detail: str | None = None


async def generate_sse_stream(
    service: OpenAIService,
    message: str,
    history: list[ChatRequest.ChatMessage],
    max_completion_tokens: int,
) -> StreamingResponse:
    """
    Generate Server-Sent Events stream for chat response.

    Args:
        service: OpenAI service instance.
        message: User message.

    Yields:
        SSE formatted content chunks.
    """

    async def event_generator():
        try:
            async for chunk in service.create_chat_stream(
                message,
                [{"role": item.role, "content": item.content} for item in history],
                max_completion_tokens=max_completion_tokens,
            ):
                data = json.dumps({"content": chunk})
                yield f"data: {data}\n\n"
            yield "data: [DONE]\n\n"
        except OpenAIError:
            error_data = json.dumps({"error": "Failed to generate response"})
            yield f"data: {error_data}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.post(
    "/chat",
    response_class=StreamingResponse,
    responses={
        200: {"description": "Streaming chat response"},
        400: {"model": ErrorResponse, "description": "Invalid request"},
        429: {"model": ErrorResponse, "description": "Rate limit exceeded"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
@limiter.limit(RATE_LIMIT_RULE)
async def chat(
    request: Request,
    chat_request: ChatRequest,
    service: Annotated[OpenAIService, Depends(get_openai_service)],
) -> StreamingResponse:
    """
    Send a message to the chatbot and receive a streaming response.

    The chatbot will respond with information about Quality Assurance.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(
        "[CHAT] IP %s - chars=%d history_items=%d",
        client_ip,
        len(chat_request.message),
        len(chat_request.history),
    )

    history_payload = [{"role": item.role, "content": item.content} for item in chat_request.history]
    try:
        max_completion_tokens = service.calculate_completion_token_budget(
            chat_request.message,
            history_payload,
        )
    except ValueError as exc:
        logger.warning("[CHAT] IP %s rejected by token budget: %s", client_ip, str(exc))
        raise HTTPException(
            status_code=400,
            detail="Message exceeds token budget. Shorten the message or clear conversation history.",
        ) from exc

    return await generate_sse_stream(
        service,
        chat_request.message,
        chat_request.history,
        max_completion_tokens,
    )

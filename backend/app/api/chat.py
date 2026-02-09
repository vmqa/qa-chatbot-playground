"""Chat API endpoint."""

import json
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from openai import OpenAIError
from pydantic import BaseModel, Field

from app.middleware.rate_limit import limiter
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
        content: str = Field(min_length=1, description="Message content")

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
        description="Recent conversation history (user and assistant messages)",
    )


class ErrorResponse(BaseModel):
    """Error response model."""

    error: str
    detail: str | None = None


async def generate_sse_stream(
    service: OpenAIService, message: str, history: list[ChatRequest.ChatMessage]
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
@limiter.limit("20/hour")
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
    logger.info(f"[CHAT] IP {client_ip} - Message: {chat_request.message[:50]}...")
    return await generate_sse_stream(service, chat_request.message, chat_request.history)

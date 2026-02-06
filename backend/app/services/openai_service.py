"""OpenAI service for chat completions."""

from collections.abc import AsyncGenerator

from openai import AsyncOpenAI

from app.config import get_settings
from app.prompts.system_prompt import SYSTEM_PROMPT


class OpenAIService:
    """Service for interacting with OpenAI API."""

    def __init__(self) -> None:
        """Initialize the OpenAI client."""
        settings = get_settings()
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        self._model = "gpt-4o-mini"
        self._max_tokens = 500

    async def create_chat_stream(
        self, message: str, history: list[dict[str, str]] | None = None
    ) -> AsyncGenerator[str, None]:
        """
        Create a streaming chat completion.

        Args:
            message: The user's message.

        Yields:
            Content chunks from the streaming response.

        Raises:
            OpenAIError: If the API request fails.
        """
        history_messages = history or []
        stream = await self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *history_messages,
                {"role": "user", "content": message},
            ],
            max_tokens=self._max_tokens,
            stream=True,
        )

        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content


def get_openai_service() -> OpenAIService:
    """Get OpenAI service instance."""
    return OpenAIService()

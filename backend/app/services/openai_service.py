"""OpenAI service for chat completions."""

from collections.abc import AsyncGenerator
from math import ceil

try:
    import tiktoken
except ImportError:  # pragma: no cover - fallback is covered by runtime behavior
    tiktoken = None

from openai import AsyncOpenAI

from app.config import get_settings
from app.prompts.system_prompt import SYSTEM_PROMPT


class OpenAIService:
    """Service for interacting with OpenAI API."""

    def __init__(self) -> None:
        """Initialize the OpenAI client."""
        settings = get_settings()
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        self._model = settings.openai_model
        self._max_completion_tokens = settings.openai_max_tokens
        self._max_input_tokens = settings.openai_max_input_tokens
        self._max_total_tokens = settings.openai_max_total_tokens
        self._encoder = self._build_encoder(settings.openai_model)

    @staticmethod
    def _build_encoder(model: str):
        """Build token encoder for the selected model, with a safe fallback."""
        if tiktoken is None:
            return None

        try:
            return tiktoken.encoding_for_model(model)
        except KeyError:
            return tiktoken.get_encoding("cl100k_base")

    def _count_text_tokens(self, text: str) -> int:
        """Estimate or count tokens for a string."""
        if self._encoder is None:
            return max(1, ceil(len(text) / 4))
        return len(self._encoder.encode(text))

    def _count_messages_tokens(self, messages: list[dict[str, str]]) -> int:
        """Count approximate chat-completion prompt tokens including message overhead."""
        tokens = 2
        for message in messages:
            tokens += 4
            tokens += self._count_text_tokens(message.get("content", ""))
            role = message.get("role", "")
            if role:
                tokens += self._count_text_tokens(role)
        return tokens

    def calculate_completion_token_budget(
        self, message: str, history: list[dict[str, str]] | None = None
    ) -> int:
        """Calculate the allowed completion tokens for a request or raise on budget overflow."""
        history_messages = history or []
        request_messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            *history_messages,
            {"role": "user", "content": message},
        ]

        prompt_tokens = self._count_messages_tokens(request_messages)
        if prompt_tokens > self._max_input_tokens:
            raise ValueError("Input exceeds configured prompt token budget")

        available_completion_tokens = self._max_total_tokens - prompt_tokens
        max_completion_tokens = min(self._max_completion_tokens, available_completion_tokens)

        if max_completion_tokens < 64:
            raise ValueError("Conversation is too long to answer safely")

        return max_completion_tokens

    async def create_chat_stream(
        self,
        message: str,
        history: list[dict[str, str]] | None = None,
        max_completion_tokens: int | None = None,
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
        completion_tokens = (
            max_completion_tokens
            if max_completion_tokens is not None
            else self.calculate_completion_token_budget(message, history_messages)
        )

        stream = await self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *history_messages,
                {"role": "user", "content": message},
            ],
            max_tokens=completion_tokens,
            stream=True,
        )

        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content


def get_openai_service() -> OpenAIService:
    """Get OpenAI service instance."""
    return OpenAIService()

"""In-memory token budget service for per-IP daily limits."""

from datetime import datetime, timezone
from threading import Lock

from app.config import get_settings


class TokenBudgetService:
    """Tracks estimated token usage per IP for the current UTC day."""

    def __init__(self, daily_limit: int, enabled: bool = True) -> None:
        self._daily_limit = daily_limit
        self._enabled = enabled
        self._lock = Lock()
        self._usage_by_ip: dict[str, int] = {}
        self._current_day = self._utc_day()

    @staticmethod
    def _utc_day() -> str:
        return datetime.now(timezone.utc).date().isoformat()

    def _rotate_day_if_needed(self) -> None:
        today = self._utc_day()
        if today != self._current_day:
            self._usage_by_ip.clear()
            self._current_day = today

    def try_consume(self, ip: str, estimated_tokens: int) -> bool:
        """Consume estimated tokens for an IP if daily budget allows it."""
        if not self._enabled or estimated_tokens <= 0:
            return True

        with self._lock:
            self._rotate_day_if_needed()
            used_tokens = self._usage_by_ip.get(ip, 0)
            if used_tokens + estimated_tokens > self._daily_limit:
                return False

            self._usage_by_ip[ip] = used_tokens + estimated_tokens
            return True


_token_budget_service: TokenBudgetService | None = None


def get_token_budget_service() -> TokenBudgetService:
    """Get singleton token budget service instance."""
    global _token_budget_service
    if _token_budget_service is None:
        settings = get_settings()
        _token_budget_service = TokenBudgetService(
            daily_limit=settings.ip_daily_token_limit,
            enabled=settings.enable_ip_daily_token_limit,
        )
    return _token_budget_service

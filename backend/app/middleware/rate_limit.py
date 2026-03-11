"""Rate limiting middleware using slowapi."""

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import get_settings

settings = get_settings()
RATE_LIMIT_RULE = f"{settings.rate_limit_requests}/{settings.rate_limit_window}seconds"

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[RATE_LIMIT_RULE],
)

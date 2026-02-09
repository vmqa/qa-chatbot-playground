"""Test configuration for Ask Marco API tests."""

from app.api.chat import MAX_MESSAGE_LENGTH as MAX_MESSAGE_LENGTH  # noqa: F401

# Expected response markers for portfolio chatbot
PORTFOLIO_MARKERS = [
    "qa",
    "quality",
    "testing",
    "playwright",
    "automation",
    "marco",
]

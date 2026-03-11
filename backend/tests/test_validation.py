"""
Validation tests for chat endpoint.

These tests verify that FastAPI/Pydantic validation rejects invalid payloads
before they reach the endpoint handler (no OpenAI API calls are made).

Run with: pytest tests/test_validation.py -v
"""

import pytest
from fastapi.testclient import TestClient

from app.api.chat import get_openai_service
from app.main import app


@pytest.mark.parametrize(
    "payload",
    [
        {"message": ""},
        {"msg": "Hello"},
        {},
        {"message": None},
    ],
)
def test_chat_rejects_invalid_payloads(test_client: TestClient, payload: dict):
    """Chat should reject invalid payloads with 422 status."""
    response = test_client.post("/api/chat", json=payload)
    assert response.status_code == 422


def test_chat_rejects_excessive_token_budget_payload(test_client: TestClient):
    """Chat should reject requests that exceed configured token budget before OpenAI call."""
    class BudgetFailService:
        def calculate_completion_token_budget(self, message: str, history: list[dict[str, str]]) -> int:
            raise ValueError("Input exceeds configured prompt token budget")

        async def create_chat_stream(self, message: str, history: list[dict[str, str]], max_completion_tokens: int):
            if False:
                yield ""

    app.dependency_overrides[get_openai_service] = lambda: BudgetFailService()
    try:
        response = test_client.post("/api/chat", json={"message": "short question"})
        assert response.status_code == 400
    finally:
        app.dependency_overrides.clear()

"""
Validation tests for chat endpoint.

These tests verify that FastAPI/Pydantic validation rejects invalid payloads
before they reach the endpoint handler (no OpenAI API calls are made).

Run with: pytest tests/test_validation.py -v
"""

import pytest
from app.api.chat import get_openai_service
from app.main import app
from app.services.token_budget_service import get_token_budget_service
from fastapi.testclient import TestClient


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
        def plan_request_token_usage(
            self, message: str, history: list[dict[str, str]]
        ) -> tuple[int, int]:
            raise ValueError("Input exceeds configured prompt token budget")

        async def create_chat_stream(
            self, message: str, history: list[dict[str, str]], max_completion_tokens: int
        ):
            if False:
                yield ""

    app.dependency_overrides[get_openai_service] = lambda: BudgetFailService()
    try:
        response = test_client.post("/api/chat", json={"message": "short question"})
        assert response.status_code == 400
    finally:
        app.dependency_overrides.clear()


def test_chat_rejects_when_ip_daily_token_budget_exceeded(test_client: TestClient):
    """Chat should reject requests when the per-IP daily token budget is exhausted."""

    class TokenPlanService:
        def plan_request_token_usage(
            self, message: str, history: list[dict[str, str]]
        ) -> tuple[int, int]:
            return 100, 200

        async def create_chat_stream(
            self, message: str, history: list[dict[str, str]], max_completion_tokens: int
        ):
            if False:
                yield ""

    class DenyBudgetService:
        def try_consume(self, ip: str, estimated_tokens: int) -> bool:
            return False

    app.dependency_overrides[get_openai_service] = lambda: TokenPlanService()
    app.dependency_overrides[get_token_budget_service] = lambda: DenyBudgetService()
    try:
        response = test_client.post("/api/chat", json={"message": "hello"})
        assert response.status_code == 429
    finally:
        app.dependency_overrides.clear()

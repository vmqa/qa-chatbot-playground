"""
Validation tests for chat endpoint.

These tests verify that FastAPI/Pydantic validation rejects invalid payloads
before they reach the endpoint handler (no OpenAI API calls are made).

Run with: pytest tests/test_validation.py -v
"""

import pytest
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

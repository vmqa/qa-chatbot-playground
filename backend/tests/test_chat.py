"""
Integration tests for chat endpoint.

These tests verify the chat endpoint functionality with real OpenAI API calls.

Run with: pytest tests/test_chat.py -v
"""

import pytest
from fastapi.testclient import TestClient

from tests.config import MAX_MESSAGE_LENGTH, PORTFOLIO_MARKERS
from tests.helpers import (
    ask_question,
    ask_question_with_history,
    assert_contains_text,
    assert_not_contains_text,
    assert_portfolio_response,
    get_response_text,
    history_from_turn,
)


@pytest.mark.monitoring
def test_chat_returns_portfolio_content(test_client: TestClient):
    """Chat should return relevant portfolio content about QA experience."""
    response = ask_question(test_client, "Hi")

    assert response.status_code == 200
    assert response.headers["content-type"] == "text/event-stream; charset=utf-8"

    message = get_response_text(response)
    assert_portfolio_response(message, PORTFOLIO_MARKERS)


@pytest.mark.regression
def test_chat_validates_message_length(test_client: TestClient):
    """Chat should enforce max message length."""
    max_valid = "x" * MAX_MESSAGE_LENGTH
    response = ask_question(test_client, max_valid)
    assert response.status_code == 200

    over_limit = "x" * (MAX_MESSAGE_LENGTH + 1)
    response = ask_question(test_client, over_limit)
    assert response.status_code == 422


@pytest.mark.regression
def test_chat_redirects_offtopic_questions(test_client: TestClient):
    """Chat should politely decline off-topic questions."""
    response = ask_question(test_client, "What is the capital of France?")

    assert response.status_code == 200

    message = get_response_text(response)
    message_lower = message.lower()

    # Should NOT contain the answer to the off-topic question
    assert "paris" not in message_lower, "Should not answer off-topic geography question"

    # Should indicate it's outside scope or redirect to QA topics
    decline_indicators = [
        "outside my",
        "not about",
        "focus on",
        "ask about my",
        "instead",
        "can't help with that",
    ]

    has_decline = any(indicator in message_lower for indicator in decline_indicators)
    assert has_decline, f"Response should decline off-topic question. Got: {message}"


@pytest.mark.regression
def test_chat_handles_recent_experience_follow_up(test_client: TestClient):
    """Chat should use history to answer follow-up experience questions."""
    first_question = (
        "What tool was developed first Playwright, Cypress or Selenium? Answer with one word only"
    )
    first_response = ask_question(test_client, first_question)
    assert first_response.status_code == 200

    first_text = get_response_text(first_response)
    assert_contains_text(first_text, "Selenium")
    assert_not_contains_text(first_text, "Cypress")

    history = history_from_turn(first_question, first_text)
    second_question = "And what was developed next? Answer with one word only"
    second_response = ask_question_with_history(test_client, second_question, history)
    assert second_response.status_code == 200

    second_text = get_response_text(second_response)
    assert_contains_text(second_text, "Cypress")
    assert_not_contains_text(second_text, "Playwright")

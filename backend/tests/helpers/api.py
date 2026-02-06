"""API helper functions for testing."""

import json
from typing import Any

from fastapi.testclient import TestClient


def ask_question(test_client: TestClient, question: str):
    """
    Send a question to the chat endpoint.

    Args:
        test_client: FastAPI test client.
        question: Question to ask.

    Returns:
        Response object from the chat endpoint.
    """
    return test_client.post("/api/chat", json={"message": question})


def ask_question_with_history(
    test_client: TestClient, question: str, history: list[dict[str, str]]
):
    """
    Send a question to the chat endpoint with conversation history.

    Args:
        test_client: FastAPI test client.
        question: Question to ask.
        history: Prior conversation messages.

    Returns:
        Response object from the chat endpoint.
    """
    return test_client.post(
        "/api/chat", json={"message": question, "history": history}
    )


def history_from_turn(user_message: str, assistant_message: str) -> list[dict[str, str]]:
    """
    Build minimal history from a single user/assistant turn.

    Args:
        user_message: The prior user message.
        assistant_message: The prior assistant response.

    Returns:
        List of history message dicts.
    """
    return [
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": assistant_message},
    ]


def get_response_text(response) -> str:
    """
    Extract full response text from SSE streaming response.

    Args:
        response: Response object with SSE stream.

    Returns:
        Complete response text reconstructed from stream chunks.
    """
    events = _parse_sse_stream(response.text)
    chunks = [event.get("content", "") for event in events if "content" in event]
    return "".join(chunks)


def _parse_sse_stream(stream_data: str) -> list[dict[str, Any]]:
    """
    Parse Server-Sent Events stream data.

    Args:
        stream_data: Raw SSE stream string.

    Returns:
        List of parsed event data dictionaries.
    """
    events = []
    lines = stream_data.strip().split("\n")

    for line in lines:
        if line.startswith("data: "):
            data_str = line[6:]  # Remove "data: " prefix
            if data_str == "[DONE]":
                events.append({"done": True})
            else:
                try:
                    data = json.loads(data_str)
                    events.append(data)
                except json.JSONDecodeError:
                    continue

    return events

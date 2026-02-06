"""Test assertion helpers."""


def assert_portfolio_response(response: str, expected_markers: list[str]) -> None:
    """
    Assert that response is relevant to portfolio content.

    Args:
        response: Response text to check.
        expected_markers: List of expected terms/markers.

    Raises:
        AssertionError: If response doesn't contain expected markers.
    """
    assert len(response) > 0, "Response should not be empty"

    response_lower = response.lower()
    found = any(marker.lower() in response_lower for marker in expected_markers)

    assert found, f"Response should contain at least one of: {expected_markers}"


def assert_contains_text(response: str, expected: str) -> None:
    """
    Assert that response contains a given substring (case-insensitive).

    Args:
        response: Response text to check.
        expected: Substring expected to appear.
    """
    response_lower = response.lower()
    expected_lower = expected.lower()
    assert expected_lower in response_lower, (
        f"Response should contain '{expected}'. Got: {response}"
    )


def assert_not_contains_text(response: str, unexpected: str) -> None:
    """
    Assert that response does not contain a given substring (case-insensitive).

    Args:
        response: Response text to check.
        unexpected: Substring expected NOT to appear.
    """
    response_lower = response.lower()
    unexpected_lower = unexpected.lower()
    assert unexpected_lower not in response_lower, (
        f"Response should not contain '{unexpected}'. Got: {response}"
    )

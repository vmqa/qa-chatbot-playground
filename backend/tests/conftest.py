"""Pytest fixtures for Clean Pipes Consulting API tests."""

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient

from app.main import app

load_dotenv()


@pytest.fixture
def test_client() -> TestClient:
    """Create FastAPI test client."""
    return TestClient(app)

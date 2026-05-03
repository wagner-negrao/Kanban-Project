from fastapi.testclient import TestClient
from main import app
import os
import pytest
from app.core.database import DB_PATH, init_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def run_around_tests():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    init_db()
    yield
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_kanban_endpoints():
    # Get default board
    response = client.get("/api/kanban")
    assert response.status_code == 200
    assert "columns" in response.json()
    assert len(response.json()["columns"]) == 5

    # Update board
    new_data = {"columns": [], "cards": {}}
    response = client.put("/api/kanban", json={"data": new_data})
    assert response.status_code == 200

    # Get updated board
    response = client.get("/api/kanban")
    assert response.status_code == 200
    assert response.json() == new_data

from unittest.mock import patch

def test_chat_endpoint():
    mock_reply = {"reply": "Mocked AI Reply", "board_update": None}
    # Patch where it is used
    with patch("app.api.routers.chat.generate_chat_response", return_value=mock_reply) as mock:
        response = client.post("/api/chat", json={"message": "Hello AI", "board": {}})
        assert response.status_code == 200
        assert response.json() == mock_reply

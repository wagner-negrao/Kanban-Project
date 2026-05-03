from fastapi import APIRouter, Depends
import json
from app.core.database import get_db_connection
from app.core.constants import DEFAULT_BOARD
from app.models.kanban import KanbanUpdate

router = APIRouter()

@router.get("/kanban")
def get_kanban(username: str = "user"):
    conn = get_db_connection()
    row = conn.execute("SELECT data FROM boards WHERE username = ?", (username,)).fetchone()
    conn.close()
    if row:
        return json.loads(row["data"])
    return DEFAULT_BOARD

@router.put("/kanban")
def update_kanban(update: KanbanUpdate, username: str = "user"):
    conn = get_db_connection()
    data_str = json.dumps(update.data)
    conn.execute(
        "INSERT INTO boards (username, data) VALUES (?, ?) ON CONFLICT(username) DO UPDATE SET data=excluded.data",
        (username, data_str)
    )
    conn.commit()
    conn.close()
    return {"status": "success"}

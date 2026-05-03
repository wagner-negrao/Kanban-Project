from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
import json
from pydantic import BaseModel
from db import get_db_connection

app = FastAPI(title="Kanban API")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

class KanbanUpdate(BaseModel):
    data: dict

DEFAULT_BOARD = {
    "columns": [
        { "id": "col-backlog", "title": "Backlog", "cardIds": ["card-1", "card-2"] },
        { "id": "col-discovery", "title": "Discovery", "cardIds": ["card-3"] },
        { "id": "col-progress", "title": "In Progress", "cardIds": ["card-4", "card-5"] },
        { "id": "col-review", "title": "Review", "cardIds": ["card-6"] },
        { "id": "col-done", "title": "Done", "cardIds": ["card-7", "card-8"] },
    ],
    "cards": {
        "card-1": { "id": "card-1", "title": "Align roadmap themes", "details": "Draft quarterly themes with impact statements and metrics." },
        "card-2": { "id": "card-2", "title": "Gather customer signals", "details": "Review support tags, sales notes, and churn feedback." },
        "card-3": { "id": "card-3", "title": "Prototype analytics view", "details": "Sketch initial dashboard layout and key drill-downs." },
        "card-4": { "id": "card-4", "title": "Refine status language", "details": "Standardize column labels and tone across the board." },
        "card-5": { "id": "card-5", "title": "Design card layout", "details": "Add hierarchy and spacing for scanning dense lists." },
        "card-6": { "id": "card-6", "title": "QA micro-interactions", "details": "Verify hover, focus, and loading states." },
        "card-7": { "id": "card-7", "title": "Ship marketing page", "details": "Final copy approved and asset pack delivered." },
        "card-8": { "id": "card-8", "title": "Close onboarding sprint", "details": "Document release notes and share internally." },
    }
}

@app.get("/api/kanban")
def get_kanban(username: str = "user"):
    conn = get_db_connection()
    row = conn.execute("SELECT data FROM boards WHERE username = ?", (username,)).fetchone()
    conn.close()
    if row:
        return json.loads(row["data"])
    return DEFAULT_BOARD

@app.put("/api/kanban")
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

class ChatRequest(BaseModel):
    message: str
    board: dict

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    from ai import generate_chat_response
    response_data = generate_chat_response(request.message, request.board)
    return response_data

# Serve the static NextJS frontend
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
else:
    @app.get("/")
    def read_root():
        return {"message": "Frontend not built yet. Go to /api/health for backend health."}

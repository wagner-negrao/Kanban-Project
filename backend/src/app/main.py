from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from app.api.routers import health, kanban, chat
from app.core.database import init_db

app = FastAPI(title="Kanban API")

# Initialize database
init_db()

# Include Routers
app.include_router(health.router, prefix="/api")
app.include_router(kanban.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

# Serve the static NextJS frontend
# Current file: backend/src/app/main.py
# out/ is at backend/out/
backend_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
frontend_dir = os.path.join(backend_root, "out")

if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
else:
    @app.get("/")
    def read_root():
        return {"message": "Frontend not built yet. Go to /api/health for backend health."}

@echo off
cd /d "%~dp0.."
echo Building and starting Docker container...
docker build -t kanban-app .
IF EXIST .env (
    docker run -d --name kanban-app-container --env-file .env -p 8000:8000 kanban-app
) ELSE (
    docker run -d --name kanban-app-container -p 8000:8000 kanban-app
)
echo Container kanban-app-container started on port 8000

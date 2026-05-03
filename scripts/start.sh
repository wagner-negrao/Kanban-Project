#!/bin/bash
set -e
cd "$(dirname "$0")/.."
echo "Building and starting Docker container..."
docker build -t kanban-app .
if [ -f .env ]; then
  docker run -d --name kanban-app-container --env-file .env -p 8000:8000 kanban-app
else
  docker run -d --name kanban-app-container -p 8000:8000 kanban-app
fi
echo "Container kanban-app-container started on port 8000"

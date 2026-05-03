#!/bin/bash
cd "$(dirname "$0")/.."
docker stop kanban-app-container || true
docker rm kanban-app-container || true
echo "Container stopped and removed"

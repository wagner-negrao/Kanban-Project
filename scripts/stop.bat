@echo off
cd /d "%~dp0.."
docker stop kanban-app-container
docker rm kanban-app-container
echo Container stopped and removed

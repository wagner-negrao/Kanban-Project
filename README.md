# Project Management App

A Kanban-style project management web application.

## Features
- User authentication
- Interactive Kanban board with customizable columns
- Drag and drop card management
- AI assistant for automated board management

## Tech Stack
- Frontend: NextJS
- Backend: Python FastAPI
- Database: SQLite
- AI: OpenRouter
- Deployment: Docker

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Setup
1. Create a `.env` file in the root directory and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

2. Start the application using the provided scripts:
   - Mac/Linux: `./scripts/start.sh`
   - Windows: `.\scripts\start.bat`

3. Access the application at http://localhost:8000. Use the default credentials (user / password) to sign in.

### Stopping the Application
Use the stop scripts to shut down the application:
- Mac/Linux: `./scripts/stop.sh`
- Windows: `.\scripts\stop.bat`

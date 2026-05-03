# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run test:unit
RUN npm run build

# Stage 2: Build the backend with uv
FROM python:3.12-slim
WORKDIR /app
# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy backend requirements
COPY backend/requirements.txt ./backend/
# Install dependencies using uv into system
RUN uv pip install --system -r backend/requirements.txt

# Copy backend source
COPY backend/src ./backend/src

# Copy frontend build to backend/out
COPY --from=frontend-builder /app/frontend/out ./backend/out

EXPOSE 8000

ENV PYTHONPATH=/app/backend/src
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

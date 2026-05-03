# High level steps for project

Part 1: Plan
- [x] Review requirements and constraints.
- [x] Create `frontend/AGENTS.md` to describe the existing codebase.
- [x] Update `docs/PLAN.md` with detailed substeps, tests, and success criteria.
- [x] Get user sign-off on the plan.
*Success Criteria: The plan is comprehensive and approved by the user.*

Part 2: Scaffolding
- [x] Create `backend/` directory and initialize FastAPI project using `uv` (as per requirements).
- [x] Write a basic `/api/health` endpoint that returns `{"status": "ok"}`.
- [x] Create a `Dockerfile` multi-stage build: build NextJS frontend (using `output: 'export'`), and serve it via FastAPI alongside the API endpoints.
- [x] Create `scripts/start.sh`, `scripts/stop.sh` (for Mac/Linux) and `scripts/start.bat`, `scripts/stop.bat` (for Windows).
- [x] Write a simple backend unit test testing the health endpoint.
*Success Criteria: Running `start.sh` or `start.bat` builds the docker image, spins up the container, and `http://localhost:8000/api/health` works. Tests pass.*

Part 3: Add in Frontend
- [x] Update NextJS config (`next.config.ts`) to use `output: 'export'`.
- [x] Ensure FastAPI is configured to serve the `out/` directory as static files at the root `/`.
- [x] Update the Docker container to copy the frontend build to the backend container.
- [x] Run the frontend tests (`vitest` and `playwright`) as part of the validation before building.
*Success Criteria: When the container is running, navigating to `http://localhost:8000/` displays the existing Kanban frontend.*

Part 4: Add in a fake user sign in experience
- [x] Add a `LoginPage` component in NextJS.
- [x] Update `src/app/page.tsx` to conditionally render `LoginPage` or `KanbanBoard` based on login state.
- [x] Hardcode the credentials (`user` / `password`).
- [x] Add a Logout button to the Kanban UI.
- [x] Update frontend unit and E2E tests to cover the login and logout flows.
*Success Criteria: Unauthenticated users are forced to log in with `user`/`password`. They can log out successfully. Tests pass.*

Part 5: Database modeling
- [x] Create `docs/SCHEMA.md` detailing the SQLite approach (storing Kanban state as JSON).
- [x] Get user sign-off on the schema document.
*Success Criteria: The database schema is documented and approved.*

Part 6: Backend
- [x] Add a SQLite database connection in FastAPI using standard library `sqlite3` or a lightweight ORM like `sqlmodel` (keeping it simple).
- [x] Ensure the DB is created automatically if it doesn't exist.
- [x] Implement `GET /api/kanban` to fetch the board state (JSON).
- [x] Implement `PUT /api/kanban` to update the board state (JSON).
- [x] Write backend unit tests for these endpoints.
*Success Criteria: The backend can persist and retrieve Kanban JSON state from the SQLite database. Tests pass.*

Part 7: Frontend + Backend
- [x] Update `src/lib/kanban.ts` (or the React component) to fetch the initial state from `GET /api/kanban` on load.
- [x] Update state mutation functions (drag & drop, add, edit, rename column) to trigger `PUT /api/kanban` to save state.
- [x] Ensure optimistic updates are handled smoothly (if network fails, revert state or show error).
- [x] Update Playwright E2E tests to mock the API or run against a test backend.
*Success Criteria: The Kanban board survives page reloads. Changes in one session persist to the database. Tests pass.*

Part 8: AI connectivity
- [x] Add OpenRouter API integration in FastAPI.
- [x] Read `OPENROUTER_API_KEY` from `.env`.
- [x] Implement an endpoint `POST /api/chat` that asks `openai/gpt-oss-120b:free`.
- [x] Write a test (mocked) for the OpenRouter integration.
*Success Criteria: The test endpoint successfully returns a valid response from the OpenRouter API.*

Part 9: Backend AI logic
- [x] Implement `POST /api/chat` endpoint.
- [x] The endpoint should accept conversation history, user message, and the current Kanban JSON state.
- [x] Create a detailed System Prompt that instructs the AI on the Structured Output format (returning a reply message and optionally a new Kanban JSON state).
- [x] Test the backend logic by sending a mock request.
*Success Criteria: The AI successfully parses the Kanban state and returns a valid updated JSON Kanban state in a structured format.*

Part 10: Frontend AI widget
- [x] Build a sleek, professional sidebar/widget in NextJS for the AI chat.
- [x] Wire up the chat widget to the `POST /api/chat` endpoint.
- [x] If the AI returns an updated Kanban state, automatically update the frontend state (and persist it via the existing backend logic or rely on the backend AI endpoint having already saved it).
- [x] Add E2E tests to cover opening the widget, sending a message, and seeing a mock Kanban update.
*Success Criteria: The user can chat with the AI, the AI can edit the board, and the board updates automatically in the UI without a manual refresh.*
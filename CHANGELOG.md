# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-05-03

### Changed
- Refactored backend into a modular package structure (`backend/src/app/`) for improved maintainability.
- Organized backend logic into specialized modules: `api`, `core`, `models`, and `services`.
- Updated backend tests to support the new modular architecture.

### Added
- GitHub Actions CI pipeline (`.github/workflows/ci.yml`) to automatically run frontend and backend unit tests on push and pull requests.

## [0.0.1] - 2026-05-03

### Added
- Initial setup of the Project Management App (MVP).
- Frontend implemented in NextJS featuring a Kanban board with customizable columns and drag-and-drop.
- Backend implemented with Python FastAPI serving as the API and static file host.
- SQLite database integration for local persistence.
- AI assistant chat integration via OpenRouter (`openai/gpt-oss-120b:free`) to manipulate Kanban cards.
- Docker containerization for simple local deployment.
- Initial project documentation, including `README.md`, planning docs, and setup scripts.
- Agent rule definitions (`pull-request-protocol.md`, `root-cause-protocol.md`, and `release-protocol.md`) to guide AI workflows.

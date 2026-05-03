# Frontend Architecture

This is a Next.js 16 frontend for the Kanban application MVP.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, clsx
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Testing**: Vitest for unit tests, Playwright for E2E tests (`tests/kanban.spec.ts`)

## Directory Structure
- `src/app/`: Next.js App Router root, currently containing a single page (`page.tsx`) that renders the Kanban board.
- `src/components/`: React components for the Kanban Board:
  - `KanbanBoard.tsx`: Main board layout and drag-and-drop context.
  - `KanbanColumn.tsx`: Individual columns within the board.
  - `KanbanCard.tsx`: Individual task cards.
  - `KanbanCardPreview.tsx`: Drag overlay preview for cards.
  - `NewCardForm.tsx`: Form for creating a new card.
- `src/lib/`: Core logic:
  - `kanban.ts`: Contains types (`Card`, `Column`, `Board`) and state management logic.
- `tests/`: End-to-end tests using Playwright.
- `src/test/`: Unit tests setup or mocks.

## Existing Implementation Status
Currently, this is a purely client-rendered MVP. The board state is kept in memory. The UI is built using the required color scheme (`#ecad0a`, `#209dd7`, `#753991`, `#032147`, `#888888`). Next steps involve converting this to use backend persistence.

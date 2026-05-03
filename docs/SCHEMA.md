# Database Schema

In keeping with the project constraints (MVP, simple, single board per user, JSON storage), we will use an incredibly simple SQLite schema.

## Table: `boards`

This table stores the entire state of a user's Kanban board in a single JSON blob. This approach avoids the complexity of relational tables for columns and cards, making the API logic straight-forward and perfectly matching the frontend's data structure.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `username` | TEXT | PRIMARY KEY | The user's ID (for MVP, this will always be `"user"`). |
| `data` | TEXT | NOT NULL | The JSON string representing the complete Kanban board state. |

### JSON Data Structure (`data` column)
The JSON structure directly mirrors the frontend `BoardData` TypeScript type:

```json
{
  "columns": [
    {
      "id": "string",
      "title": "string",
      "cardIds": ["string", "string"]
    }
  ],
  "cards": {
    "card-id": {
      "id": "string",
      "title": "string",
      "details": "string"
    }
  }
}
```

## API Interaction
- **GET /api/kanban**: Selects the `data` for the authenticated `username`. If no row exists, returns a default empty board structure.
- **PUT /api/kanban**: Upserts (inserts or updates) the `data` row for the authenticated `username` with the provided JSON payload.

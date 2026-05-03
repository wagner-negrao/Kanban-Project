from pydantic import BaseModel

class KanbanUpdate(BaseModel):
    data: dict

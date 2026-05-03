from fastapi import APIRouter
from app.models.chat import ChatRequest
from app.services.ai import generate_chat_response

router = APIRouter()

@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    response_data = generate_chat_response(request.message, request.board)
    return response_data

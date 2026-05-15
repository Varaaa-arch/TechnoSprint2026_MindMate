from fastapi import APIRouter

from app.schemas.chat import ChatHistoryResponse, ChatMessageOut, ChatRequest, ChatResponse
from app.services.chat_service import process_chat
from app.services.store import get_store

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def send_message(payload: ChatRequest) -> ChatResponse:
    return process_chat(payload.user_id, payload.message)


@router.get("/history/{user_id}", response_model=ChatHistoryResponse)
def get_chat_history(user_id: str) -> ChatHistoryResponse:
    records = get_store().get_chat_history(user_id)
    messages = [
        ChatMessageOut(
            id=r.id,
            role=r.role,
            content=r.content,
            emotion=r.emotion,
            stress_level=r.stress_level,
            created_at=r.created_at,
        )
        for r in records
    ]
    return ChatHistoryResponse(user_id=user_id, messages=messages)

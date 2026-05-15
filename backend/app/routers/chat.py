from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.auth import get_current_user_id
from app.repositories import get_repository
from app.schemas.chat import ChatHistoryResponse, ChatMessageOut, ChatRequest, ChatResponse
from app.services.chat_service import process_chat

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def send_message(
    payload: ChatRequest,
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> ChatResponse:
    return process_chat(user_id, payload.message)


@router.get("/history", response_model=ChatHistoryResponse)
def get_chat_history(
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> ChatHistoryResponse:
    records = get_repository().get_chat_history(user_id)
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

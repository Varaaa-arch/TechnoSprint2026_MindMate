from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

EmotionLabel = Literal[
    "happy", "sad", "anxiety", "burnout", "neutral", "anger", "calm"
]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    reply: str
    emotion: EmotionLabel = "neutral"
    stress_level: int = Field(ge=1, le=10, default=5)
    message_id: str


class ChatMessageOut(BaseModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    emotion: EmotionLabel | None = None
    stress_level: int | None = None
    created_at: datetime


class ChatHistoryResponse(BaseModel):
    user_id: str
    messages: list[ChatMessageOut]

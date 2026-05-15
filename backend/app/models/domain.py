"""Domain records shared by in-memory and Supabase repositories."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from typing import Literal

from app.schemas.chat import EmotionLabel

MoodId = Literal["senang", "tenang", "biasa", "stres", "sedih", "cemas", "marah"]

MOOD_SCORES: dict[str, int] = {
    "senang": 5,
    "tenang": 4,
    "biasa": 3,
    "stres": 2,
    "sedih": 1,
    "cemas": 2,
    "marah": 2,
}

POSITIVE_MOODS = frozenset({"senang", "tenang"})


@dataclass
class ChatRecord:
    id: str
    user_id: str
    role: Literal["user", "assistant"]
    content: str
    emotion: EmotionLabel | None
    stress_level: int | None
    created_at: datetime
    session_id: str | None = None


@dataclass
class MoodRecord:
    id: str
    user_id: str
    mood: MoodId
    note: str | None
    entry_date: date
    created_at: datetime
    mood_score: int | None = None

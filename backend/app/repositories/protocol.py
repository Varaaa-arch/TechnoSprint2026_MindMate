from __future__ import annotations

from datetime import date
from typing import Protocol

from app.models.domain import ChatRecord, MoodRecord
from app.schemas.chat import EmotionLabel


class DataRepository(Protocol):
    def ensure_profile(
        self,
        user_id: str,
        *,
        email: str | None = None,
        display_name: str | None = None,
    ) -> None: ...

    def add_chat_message(
        self,
        user_id: str,
        role: str,
        content: str,
        *,
        emotion: EmotionLabel | None = None,
        stress_level: int | None = None,
        session_id: str | None = None,
    ) -> ChatRecord: ...

    def get_chat_history(self, user_id: str, limit: int = 100) -> list[ChatRecord]: ...

    def upsert_mood(
        self,
        user_id: str,
        mood: str,
        note: str | None,
        entry_date: date,
    ) -> MoodRecord: ...

    def get_mood_history(self, user_id: str, days: int = 30) -> list[MoodRecord]: ...

    def get_mood_stats(self, user_id: str) -> dict: ...

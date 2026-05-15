"""In-memory store for local development until Supabase tables are wired."""

from __future__ import annotations

import uuid
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import date, datetime, timezone
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

POSITIVE_MOODS = {"senang", "tenang"}


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


@dataclass
class ChatRecord:
    id: str
    user_id: str
    role: Literal["user", "assistant"]
    content: str
    emotion: EmotionLabel | None
    stress_level: int | None
    created_at: datetime


@dataclass
class MoodRecord:
    id: str
    user_id: str
    mood: MoodId
    note: str | None
    entry_date: date
    created_at: datetime


@dataclass
class InMemoryStore:
    _chats: dict[str, list[ChatRecord]] = field(default_factory=lambda: defaultdict(list))
    _moods: dict[str, list[MoodRecord]] = field(default_factory=lambda: defaultdict(list))

    # ── Chat ──────────────────────────────────────────────────────────

    def add_chat_message(
        self,
        user_id: str,
        role: Literal["user", "assistant"],
        content: str,
        *,
        emotion: EmotionLabel | None = None,
        stress_level: int | None = None,
    ) -> ChatRecord:
        record = ChatRecord(
            id=str(uuid.uuid4()),
            user_id=user_id,
            role=role,
            content=content,
            emotion=emotion,
            stress_level=stress_level,
            created_at=_utcnow(),
        )
        self._chats[user_id].append(record)
        return record

    def get_chat_history(self, user_id: str, limit: int = 100) -> list[ChatRecord]:
        return self._chats[user_id][-limit:]

    # ── Mood ──────────────────────────────────────────────────────────

    def upsert_mood(
        self,
        user_id: str,
        mood: MoodId,
        note: str | None,
        entry_date: date,
    ) -> MoodRecord:
        entries = self._moods[user_id]
        for idx, existing in enumerate(entries):
            if existing.entry_date == entry_date:
                updated = MoodRecord(
                    id=existing.id,
                    user_id=user_id,
                    mood=mood,
                    note=note,
                    entry_date=entry_date,
                    created_at=_utcnow(),
                )
                entries[idx] = updated
                return updated

        record = MoodRecord(
            id=str(uuid.uuid4()),
            user_id=user_id,
            mood=mood,
            note=note,
            entry_date=entry_date,
            created_at=_utcnow(),
        )
        entries.append(record)
        return record

    def get_mood_history(self, user_id: str, days: int = 30) -> list[MoodRecord]:
        cutoff = date.today().toordinal() - days
        return sorted(
            (e for e in self._moods[user_id] if e.entry_date.toordinal() >= cutoff),
            key=lambda e: e.entry_date,
            reverse=True,
        )

    def get_mood_stats(self, user_id: str) -> dict:
        entries = sorted(self._moods[user_id], key=lambda e: e.entry_date, reverse=True)
        if not entries:
            return {
                "total_entries": 0,
                "streak_days": 0,
                "positive_percent": 0.0,
                "average_score": 0.0,
                "dominant_mood": None,
            }

        scores = [MOOD_SCORES.get(e.mood, 3) for e in entries]
        positive = sum(1 for e in entries if e.mood in POSITIVE_MOODS)
        mood_counts: dict[str, int] = defaultdict(int)
        for e in entries:
            mood_counts[e.mood] += 1

        streak = 0
        cursor = date.today()
        entry_dates = {e.entry_date for e in entries}
        while cursor in entry_dates:
            streak += 1
            cursor = date.fromordinal(cursor.toordinal() - 1)

        dominant = max(mood_counts, key=mood_counts.get) if mood_counts else None

        return {
            "total_entries": len(entries),
            "streak_days": streak,
            "positive_percent": round(positive / len(entries) * 100, 1),
            "average_score": round(sum(scores) / len(scores), 2),
            "dominant_mood": dominant,
        }


_store: InMemoryStore | None = None


def get_store() -> InMemoryStore:
    global _store
    if _store is None:
        _store = InMemoryStore()
    return _store

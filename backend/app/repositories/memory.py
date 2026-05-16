"""In-memory repository — dev fallback when Supabase is not configured."""

from __future__ import annotations

import uuid
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import date, datetime, timezone

from app.models.domain import (
    MOOD_SCORES,
    POSITIVE_MOODS,
    ChatRecord,
    MoodRecord,
)
from app.schemas.chat import EmotionLabel


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


@dataclass
class MemoryRepository:
    _chats: dict[str, list[ChatRecord]] = field(default_factory=lambda: defaultdict(list))
    _moods: dict[str, list[MoodRecord]] = field(default_factory=lambda: defaultdict(list))
    _summaries: dict[str, dict] = field(default_factory=dict)  # key: "user_id:date"

    def ensure_profile(
        self,
        user_id: str,
        *,
        email: str | None = None,
        display_name: str | None = None,
    ) -> None:
        return None

    def add_chat_message(
        self,
        user_id: str,
        role: str,
        content: str,
        *,
        emotion: EmotionLabel | None = None,
        stress_level: int | None = None,
        session_id: str | None = None,
    ) -> ChatRecord:
        record = ChatRecord(
            id=str(uuid.uuid4()),
            user_id=user_id,
            role=role,  # type: ignore[arg-type]
            content=content,
            emotion=emotion,
            stress_level=stress_level,
            created_at=_utcnow(),
            session_id=session_id,
        )
        self._chats[user_id].append(record)
        return record

    def get_chat_history(self, user_id: str, limit: int = 100) -> list[ChatRecord]:
        return self._chats[user_id][-limit:]

    def upsert_mood(
        self,
        user_id: str,
        mood: str,
        note: str | None,
        entry_date: date,
    ) -> MoodRecord:
        entries = self._moods[user_id]
        for idx, existing in enumerate(entries):
            if existing.entry_date == entry_date:
                updated = MoodRecord(
                    id=existing.id,
                    user_id=user_id,
                    mood=mood,  # type: ignore[arg-type]
                    note=note,
                    entry_date=entry_date,
                    created_at=_utcnow(),
                    mood_score=MOOD_SCORES.get(mood, 3),
                )
                entries[idx] = updated
                return updated

        record = MoodRecord(
            id=str(uuid.uuid4()),
            user_id=user_id,
            mood=mood,  # type: ignore[arg-type]
            note=note,
            entry_date=entry_date,
            created_at=_utcnow(),
            mood_score=MOOD_SCORES.get(mood, 3),
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

    def get_daily_summary(self, user_id: str, summary_date: date) -> dict | None:
        return self._summaries.get(f"{user_id}:{summary_date.isoformat()}")

    def upsert_daily_summary(
        self,
        user_id: str,
        summary_date: date,
        summary_text: str,
        *,
        mood_score_avg: float | None = None,
        dominant_emotion: str | None = None,
        highlights: list | None = None,
        generated_by: str = "rule_engine",
    ) -> dict:
        import uuid
        key = f"{user_id}:{summary_date.isoformat()}"
        row = {
            "id": self._summaries.get(key, {}).get("id", str(uuid.uuid4())),
            "user_id": user_id,
            "summary_date": summary_date.isoformat(),
            "summary_text": summary_text,
            "mood_score_avg": mood_score_avg,
            "dominant_emotion": dominant_emotion,
            "highlights": highlights or [],
            "generated_by": generated_by,
        }
        self._summaries[key] = row
        return row

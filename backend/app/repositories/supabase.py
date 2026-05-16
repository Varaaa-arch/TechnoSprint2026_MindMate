"""Supabase/PostgreSQL repository — production storage."""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Any

from supabase import Client

from app.core.exceptions import RepositoryError
from app.models.domain import ChatRecord, MoodRecord, MOOD_SCORES
from app.schemas.chat import EmotionLabel


def _parse_ts(value: str) -> datetime:
    normalized = value.replace("Z", "+00:00")
    parsed = datetime.fromisoformat(normalized)
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=timezone.utc)
    return parsed


def _first_row(response: Any) -> dict[str, Any]:
    if getattr(response, "data", None):
        return response.data[0]
    raise RepositoryError("Supabase returned no data")


class SupabaseRepository:
    def __init__(self, client: Client) -> None:
        self._db = client

    def _rpc(self, fn: str, params: dict[str, Any]) -> Any:
        try:
            return self._db.rpc(fn, params).execute()
        except Exception as exc:
            raise RepositoryError(f"RPC {fn} failed: {exc}") from exc

    def ensure_profile(
        self,
        user_id: str,
        *,
        email: str | None = None,
        display_name: str | None = None,
    ) -> None:
        self._rpc(
            "ensure_profile",
            {
                "p_user_id": user_id,
                "p_email": email,
                "p_display_name": display_name,
            },
        )

    def _get_or_create_session(self, user_id: str) -> str:
        response = self._rpc("get_or_create_active_session", {"p_user_id": user_id})
        session_id = response.data
        if isinstance(session_id, list):
            session_id = session_id[0] if session_id else None
        if not session_id:
            raise RepositoryError("Failed to resolve chat session")
        return str(session_id)

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
        self.ensure_profile(user_id)
        sid = session_id or self._get_or_create_session(user_id)

        row: dict[str, Any] = {
            "session_id": sid,
            "user_id": user_id,
            "role": role,
            "content": content,
        }
        if emotion is not None:
            row["emotion"] = emotion
        if stress_level is not None:
            row["stress_level"] = stress_level

        try:
            response = self._db.table("chat_messages").insert(row).execute()
            data = _first_row(response)
        except Exception as exc:
            raise RepositoryError(f"Insert chat_message failed: {exc}") from exc

        return ChatRecord(
            id=str(data["id"]),
            user_id=user_id,
            role=role,  # type: ignore[arg-type]
            content=content,
            emotion=data.get("emotion"),
            stress_level=data.get("stress_level"),
            created_at=_parse_ts(data["created_at"]),
            session_id=sid,
        )

    def get_chat_history(self, user_id: str, limit: int = 100) -> list[ChatRecord]:
        try:
            response = (
                self._db.table("chat_messages")
                .select("id, user_id, role, content, emotion, stress_level, created_at, session_id")
                .eq("user_id", user_id)
                .order("created_at", desc=False)
                .limit(limit)
                .execute()
            )
        except Exception as exc:
            raise RepositoryError(f"Fetch chat history failed: {exc}") from exc

        return [
            ChatRecord(
                id=str(row["id"]),
                user_id=row["user_id"],
                role=row["role"],
                content=row["content"],
                emotion=row.get("emotion"),
                stress_level=row.get("stress_level"),
                created_at=_parse_ts(row["created_at"]),
                session_id=str(row["session_id"]) if row.get("session_id") else None,
            )
            for row in (response.data or [])
        ]

    def upsert_mood(
        self,
        user_id: str,
        mood: str,
        note: str | None,
        entry_date: date,
    ) -> MoodRecord:
        self.ensure_profile(user_id)
        row = {
            "user_id": user_id,
            "mood": mood,
            "note": note,
            "entry_date": entry_date.isoformat(),
        }
        try:
            response = (
                self._db.table("mood_entries")
                .upsert(row, on_conflict="user_id,entry_date")
                .execute()
            )
            data = _first_row(response)
        except Exception as exc:
            raise RepositoryError(f"Upsert mood_entry failed: {exc}") from exc

        return MoodRecord(
            id=str(data["id"]),
            user_id=user_id,
            mood=mood,  # type: ignore[arg-type]
            note=data.get("note"),
            entry_date=date.fromisoformat(str(data["entry_date"])[:10]),
            created_at=_parse_ts(data["created_at"]),
            mood_score=data.get("mood_score") or MOOD_SCORES.get(mood, 3),
        )

    def get_mood_history(self, user_id: str, days: int = 30) -> list[MoodRecord]:
        cutoff = date.today().toordinal() - days
        min_date = date.fromordinal(cutoff).isoformat()
        try:
            response = (
                self._db.table("mood_entries")
                .select("id, user_id, mood, note, entry_date, created_at, mood_score")
                .eq("user_id", user_id)
                .gte("entry_date", min_date)
                .order("entry_date", desc=True)
                .execute()
            )
        except Exception as exc:
            raise RepositoryError(f"Fetch mood history failed: {exc}") from exc

        return [
            MoodRecord(
                id=str(row["id"]),
                user_id=row["user_id"],
                mood=row["mood"],
                note=row.get("note"),
                entry_date=date.fromisoformat(str(row["entry_date"])[:10]),
                created_at=_parse_ts(row["created_at"]),
                mood_score=row.get("mood_score"),
            )
            for row in (response.data or [])
        ]

    def get_mood_stats(self, user_id: str) -> dict:
        response = self._rpc("get_mood_stats", {"p_user_id": user_id})
        raw = response.data
        if raw is None:
            return {
                "total_entries": 0,
                "streak_days": 0,
                "positive_percent": 0.0,
                "average_score": 0.0,
                "dominant_mood": None,
            }
        if isinstance(raw, list):
            raw = raw[0] if raw else {}
        return {
            "total_entries": int(raw.get("total_entries", 0)),
            "streak_days": int(raw.get("streak_days", 0)),
            "positive_percent": float(raw.get("positive_percent", 0)),
            "average_score": float(raw.get("average_score", 0)),
            "dominant_mood": raw.get("dominant_mood"),
        }

    def get_mood_trend(self, user_id: str, days: int = 7) -> list[dict]:
        response = self._rpc("get_mood_trend", {"p_user_id": user_id, "p_days": days})
        return response.data or []

    def get_daily_summary(self, user_id: str, summary_date: date) -> dict | None:
        try:
            response = (
                self._db.table("daily_summaries")
                .select("*")
                .eq("user_id", user_id)
                .eq("summary_date", summary_date.isoformat())
                .limit(1)
                .execute()
            )
            return response.data[0] if response.data else None
        except Exception:
            return None

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
        self.ensure_profile(user_id)
        row = {
            "user_id": user_id,
            "summary_date": summary_date.isoformat(),
            "summary_text": summary_text,
            "mood_score_avg": mood_score_avg,
            "dominant_emotion": dominant_emotion,
            "highlights": highlights or [],
            "generated_by": generated_by,
        }
        try:
            response = (
                self._db.table("daily_summaries")
                .upsert(row, on_conflict="user_id,summary_date")
                .execute()
            )
            return _first_row(response)
        except Exception as exc:
            raise RepositoryError(f"Upsert daily_summary failed: {exc}") from exc

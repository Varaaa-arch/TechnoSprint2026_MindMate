from datetime import date

from fastapi import APIRouter, Query

from app.schemas.mood import (
    MoodEntryOut,
    MoodHistoryResponse,
    MoodRequest,
    MoodResponse,
    MoodStatsResponse,
)
from app.repositories import get_repository

router = APIRouter(prefix="/api/mood", tags=["mood"])


@router.post("", response_model=MoodResponse)
def save_mood(payload: MoodRequest) -> MoodResponse:
    entry_date = payload.entry_date or date.today()
    record = get_repository().upsert_mood(
        payload.user_id,
        payload.mood,
        payload.note,
        entry_date,
    )
    return MoodResponse(status="success", entry_id=record.id, date=record.entry_date)


@router.get("/history/{user_id}", response_model=MoodHistoryResponse)
def get_mood_history(
    user_id: str,
    days: int = Query(default=30, ge=1, le=365),
) -> MoodHistoryResponse:
    records = get_repository().get_mood_history(user_id, days=days)
    entries = [
        MoodEntryOut(
            id=r.id,
            user_id=r.user_id,
            mood=r.mood,
            note=r.note,
            entry_date=r.entry_date,
            created_at=r.created_at,
        )
        for r in records
    ]
    return MoodHistoryResponse(user_id=user_id, days=days, entries=entries)


@router.get("/stats/{user_id}", response_model=MoodStatsResponse)
def get_mood_stats(user_id: str) -> MoodStatsResponse:
    stats = get_repository().get_mood_stats(user_id)
    return MoodStatsResponse(user_id=user_id, **stats)

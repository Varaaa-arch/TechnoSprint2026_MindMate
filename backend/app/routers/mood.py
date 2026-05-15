from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.core.auth import get_current_user_id
from app.repositories import get_repository
from app.schemas.mood import (
    MoodEntryOut,
    MoodHistoryResponse,
    MoodRequest,
    MoodResponse,
    MoodStatsResponse,
)

router = APIRouter(prefix="/api/mood", tags=["mood"])


@router.post("", response_model=MoodResponse)
def save_mood(
    payload: MoodRequest,
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> MoodResponse:
    entry_date = payload.entry_date or date.today()
    record = get_repository().upsert_mood(
        user_id,
        payload.mood,
        payload.note,
        entry_date,
    )
    return MoodResponse(status="success", entry_id=record.id, date=record.entry_date)


@router.get("/history", response_model=MoodHistoryResponse)
def get_mood_history(
    user_id: Annotated[str, Depends(get_current_user_id)],
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


@router.get("/stats", response_model=MoodStatsResponse)
def get_mood_stats(
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> MoodStatsResponse:
    stats = get_repository().get_mood_stats(user_id)
    return MoodStatsResponse(user_id=user_id, **stats)

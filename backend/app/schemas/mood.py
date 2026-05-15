from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field

MoodId = Literal["senang", "tenang", "biasa", "stres", "sedih", "cemas", "marah"]


class MoodRequest(BaseModel):
    mood: MoodId
    note: str | None = Field(default=None, max_length=2000)
    entry_date: date | None = Field(
        default=None,
        description="Defaults to today (UTC). One entry per user per day.",
    )


class MoodResponse(BaseModel):
    status: Literal["success"] = "success"
    entry_id: str
    date: date


class MoodEntryOut(BaseModel):
    id: str
    user_id: str
    mood: MoodId
    note: str | None
    entry_date: date
    created_at: datetime


class MoodHistoryResponse(BaseModel):
    user_id: str
    days: int
    entries: list[MoodEntryOut]


class MoodStatsResponse(BaseModel):
    user_id: str
    total_entries: int
    streak_days: int
    positive_percent: float
    average_score: float
    dominant_mood: MoodId | None

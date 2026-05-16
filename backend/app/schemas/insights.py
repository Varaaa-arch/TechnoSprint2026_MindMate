from datetime import date

from pydantic import BaseModel, Field


class InsightResponse(BaseModel):
    user_id: str
    summary: str
    highlights: list[str] = Field(default_factory=list)


class WeeklyReportResponse(BaseModel):
    user_id: str
    week_label: str
    average_mood_score: float
    mood_trend: list[dict]
    summary: str


class RecommendationItem(BaseModel):
    id: str
    type: str
    title: str
    description: str
    duration_minutes: int | None = None
    reason: str | None = None


class RecommendationsResponse(BaseModel):
    user_id: str
    recommendations: list[RecommendationItem]


class DailySummaryResponse(BaseModel):
    user_id: str
    summary_date: date
    summary_text: str
    mood_score_avg: float | None = None
    dominant_emotion: str | None = None
    highlights: list[str] = Field(default_factory=list)
    generated_by: str = "rule_engine"
    from_cache: bool = False

from fastapi import APIRouter

from app.schemas.insights import (
    InsightResponse,
    RecommendationsResponse,
    WeeklyReportResponse,
)
from app.services.insights_service import (
    build_insights,
    build_recommendations,
    build_weekly_report,
)

router = APIRouter(prefix="/api/insights", tags=["insights"])


@router.get("/weekly/{user_id}", response_model=WeeklyReportResponse)
def get_weekly_report(user_id: str) -> WeeklyReportResponse:
    return build_weekly_report(user_id)


@router.get("/recommendations/{user_id}", response_model=RecommendationsResponse)
def get_recommendations(user_id: str) -> RecommendationsResponse:
    return build_recommendations(user_id)


@router.get("/{user_id}", response_model=InsightResponse)
def get_insights(user_id: str) -> InsightResponse:
    return build_insights(user_id)

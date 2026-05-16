from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.auth import get_current_user_id
from app.schemas.insights import (
    DailySummaryResponse,
    InsightResponse,
    RecommendationsResponse,
    WeeklyReportResponse,
)
from app.services.daily_summary_service import get_daily_summary
from app.services.insights_service import (
    build_insights,
    build_recommendations,
    build_weekly_report,
)

router = APIRouter(prefix="/api/insights", tags=["insights"])


@router.get("/daily-summary", response_model=DailySummaryResponse)
def daily_summary(
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> DailySummaryResponse:
    return get_daily_summary(user_id)


@router.get("/weekly", response_model=WeeklyReportResponse)
def get_weekly_report(
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> WeeklyReportResponse:
    return build_weekly_report(user_id)


@router.get("/recommendations", response_model=RecommendationsResponse)
def get_recommendations(
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> RecommendationsResponse:
    return build_recommendations(user_id)


@router.get("", response_model=InsightResponse)
def get_insights(
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> InsightResponse:
    return build_insights(user_id)

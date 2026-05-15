from fastapi import APIRouter

from app.config import get_settings
from app.schemas.common import HealthResponse, MessageResponse

router = APIRouter(tags=["health"])


@router.get("/", response_model=MessageResponse)
def root() -> MessageResponse:
    return MessageResponse(message="MindMate API is running")


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    settings = get_settings()
    storage = "supabase" if settings.supabase_configured else "in_memory"
    return HealthResponse(
        app=settings.app_name,
        version=settings.app_version,
        supabase_configured=settings.supabase_configured,
        ai_configured=settings.ai_configured,
        storage=storage,
    )

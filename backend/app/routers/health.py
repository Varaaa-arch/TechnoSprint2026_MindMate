from fastapi import APIRouter

from app.config import get_settings
from app.schemas.common import HealthResponse, MessageResponse
from app.services.supabase_client import ping_supabase

router = APIRouter(tags=["health"])


@router.get("/", response_model=MessageResponse)
def root() -> MessageResponse:
    return MessageResponse(message="MindMate API is running")


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    settings = get_settings()
    storage = settings.effective_storage
    connected: bool | None = None

    if settings.supabase_configured:
        ping = ping_supabase()
        connected = bool(ping.get("ok"))

    status = "ok"
    if storage == "supabase" and connected is False:
        status = "degraded"

    return HealthResponse(
        status=status,
        app=settings.app_name,
        version=settings.app_version,
        supabase_configured=settings.supabase_configured,
        supabase_connected=connected,
        ai_configured=settings.ai_configured,
        storage=storage,
        storage_backend=settings.storage_backend,
    )

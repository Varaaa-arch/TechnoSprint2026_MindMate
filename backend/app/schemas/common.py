from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    app: str
    version: str
    supabase_configured: bool
    supabase_connected: bool | None = None
    ai_configured: bool
    storage: str = Field(description="in_memory | supabase")
    storage_backend: str = Field(description="auto | memory | supabase")


class MessageResponse(BaseModel):
    message: str

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    app: str
    version: str
    supabase_configured: bool
    ai_configured: bool
    storage: str = Field(description="in_memory | supabase")


class MessageResponse(BaseModel):
    message: str

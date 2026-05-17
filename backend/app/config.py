from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "MindMate API"
    app_version: str = "0.1.0"
    debug: bool = False

    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000,https://mind-mate-teal.vercel.app"

    supabase_url: str | None = None
    supabase_service_role_key: str | None = None
    supabase_jwt_secret: str | None = None

    # Require Bearer token on /api/* (set false for local dev without login)
    require_auth: bool = True

    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    ai_provider: str = "openai"

    # Storage: auto (supabase if configured) | memory | supabase
    storage_backend: str = "auto"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def supabase_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_service_role_key)

    @property
    def openai_configured(self) -> bool:
        return bool(self.openai_api_key)

    @property
    def anthropic_configured(self) -> bool:
        return bool(self.anthropic_api_key)

    @property
    def ai_configured(self) -> bool:
        if self.ai_provider == "anthropic":
            return self.anthropic_configured
        return self.openai_configured

    @property
    def auth_enabled(self) -> bool:
        return self.require_auth and self.supabase_configured

    @property
    def effective_storage(self) -> str:
        mode = self.storage_backend.strip().lower()
        if mode == "memory":
            return "in_memory"
        if mode == "supabase":
            return "supabase"
        # auto — use Supabase when credentials exist
        return "supabase" if self.supabase_configured else "in_memory"


@lru_cache
def get_settings() -> Settings:
    return Settings()

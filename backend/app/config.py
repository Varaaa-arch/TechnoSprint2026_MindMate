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

    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    supabase_url: str | None = None
    supabase_service_role_key: str | None = None

    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    ai_provider: str = "openai"

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


@lru_cache
def get_settings() -> Settings:
    return Settings()

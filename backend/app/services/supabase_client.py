"""Supabase client — returns None until credentials are configured."""

from __future__ import annotations

from functools import lru_cache
from typing import TYPE_CHECKING

from app.config import get_settings

if TYPE_CHECKING:
    from supabase import Client


@lru_cache
def get_supabase_client() -> "Client | None":
    settings = get_settings()
    if not settings.supabase_configured:
        return None

    from supabase import create_client

    return create_client(settings.supabase_url, settings.supabase_service_role_key)

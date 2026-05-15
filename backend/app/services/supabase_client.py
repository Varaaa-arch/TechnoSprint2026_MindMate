"""Supabase clients for MindMate backend."""

from __future__ import annotations

from functools import lru_cache
from typing import TYPE_CHECKING, Any

from app.config import get_settings
from app.core.exceptions import RepositoryError

if TYPE_CHECKING:
    from supabase import Client


@lru_cache
def get_supabase_admin() -> "Client | None":
    """
    Service-role client — bypasses RLS.
    Use only on the backend, never expose the key to the browser.
    """
    settings = get_settings()
    if not settings.supabase_configured:
        return None

    from supabase import create_client

    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key,
    )


def get_supabase_client() -> "Client | None":
    """Alias for admin client (backward compatible)."""
    return get_supabase_admin()


def ping_supabase() -> dict[str, Any]:
    """Lightweight connectivity check for /health."""
    client = get_supabase_admin()
    if client is None:
        return {"ok": False, "reason": "not_configured"}

    try:
        response = client.table("profiles").select("id", count="exact").limit(1).execute()
        count = getattr(response, "count", None)
        return {"ok": True, "profiles_sample_count": count}
    except Exception as exc:
        return {"ok": False, "reason": str(exc)}


def run_migration_hint() -> str:
    return (
        "Apply SQL migrations from supabase/migrations/ via Supabase Dashboard "
        "→ SQL Editor, or run: supabase db push"
    )


def require_admin() -> "Client":
    client = get_supabase_admin()
    if client is None:
        raise RepositoryError(
            f"Supabase is not configured. {run_migration_hint()}"
        )
    return client

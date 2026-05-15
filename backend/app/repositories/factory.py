from __future__ import annotations

from functools import lru_cache

from app.config import get_settings
from app.core.exceptions import SupabaseNotConfiguredError
from app.repositories.memory import MemoryRepository
from app.repositories.protocol import DataRepository
from app.repositories.supabase import SupabaseRepository
from app.services.supabase_client import get_supabase_admin


@lru_cache
def get_repository() -> DataRepository:
    settings = get_settings()
    mode = settings.effective_storage

    if mode == "supabase":
        client = get_supabase_admin()
        if client is None:
            raise SupabaseNotConfiguredError(
                "STORAGE_BACKEND=supabase but SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing"
            )
        return SupabaseRepository(client)

    return _get_memory_repository()


@lru_cache
def _get_memory_repository() -> MemoryRepository:
    return MemoryRepository()


def reset_repositories() -> None:
    """Clear cached singletons (useful in tests)."""
    get_repository.cache_clear()
    _get_memory_repository.cache_clear()
    get_supabase_admin.cache_clear()

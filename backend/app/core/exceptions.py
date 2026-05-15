class RepositoryError(Exception):
    """Data layer failure (Supabase, network, constraint)."""


class SupabaseNotConfiguredError(RepositoryError):
    """STORAGE_BACKEND=supabase but credentials missing."""

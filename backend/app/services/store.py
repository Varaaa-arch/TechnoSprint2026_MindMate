"""
Backward-compatible shim — prefer `app.repositories.get_repository`.
"""

from app.models.domain import MOOD_SCORES, POSITIVE_MOODS, ChatRecord, MoodRecord
from app.repositories import get_repository

# Re-export domain types used by legacy imports
__all__ = [
    "MOOD_SCORES",
    "POSITIVE_MOODS",
    "ChatRecord",
    "MoodRecord",
    "get_store",
]


def get_store():
    """Deprecated alias for get_repository()."""
    return get_repository()

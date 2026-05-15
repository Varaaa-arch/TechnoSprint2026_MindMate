from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.auth import AuthUser, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/me")
def auth_me(user: Annotated[AuthUser, Depends(get_current_user)]) -> dict:
    """Return the authenticated user from the Bearer token."""
    return {"id": user.id, "email": user.email}

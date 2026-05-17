"""Supabase JWT verification for protected API routes."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Annotated

import jwt
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWTError

from app.config import get_settings
from app.services.supabase_client import get_supabase_admin

_bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class AuthUser:
    id: str
    email: str | None = None


def _verify_with_secret(token: str, secret: str) -> AuthUser:
    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
    except PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )
    return AuthUser(id=str(sub), email=payload.get("email"))


def _verify_with_supabase_api(token: str) -> AuthUser:
    client = get_supabase_admin()
    if client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth verification unavailable",
        )
    try:
        response = client.auth.get_user(token)
        user = response.user
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        return AuthUser(id=str(user.id), email=user.email)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not verify token",
        ) from exc


def verify_access_token(token: str) -> AuthUser:
    settings = get_settings()
    if settings.supabase_jwt_secret:
        return _verify_with_secret(token, settings.supabase_jwt_secret)
    if settings.supabase_configured:
        return _verify_with_supabase_api(token)
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Supabase JWT secret or URL not configured",
    )


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    x_dev_user_id: Annotated[str | None, Header(alias="X-Dev-User-Id")] = None,
) -> AuthUser:
    settings = get_settings()

    if credentials and credentials.credentials:
        return verify_access_token(credentials.credentials)

    if not settings.require_auth:
        dev_id = x_dev_user_id or "anonymous"
        return AuthUser(id=dev_id, email=None)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Sign in and send Authorization: Bearer <token>.",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user_id(
    user: Annotated[AuthUser, Depends(get_current_user)],
) -> str:
    return user.id

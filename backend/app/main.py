from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.core.exceptions import RepositoryError, SupabaseNotConfiguredError
from app.routers import chat, health, insights, mood


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.title = settings.app_name
    yield


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(chat.router)
    app.include_router(mood.router)
    app.include_router(insights.router)

    @app.exception_handler(RepositoryError)
    async def repository_error_handler(_request: Request, exc: RepositoryError) -> JSONResponse:
        return JSONResponse(
            status_code=503,
            content={"detail": str(exc), "type": "repository_error"},
        )

    @app.exception_handler(SupabaseNotConfiguredError)
    async def supabase_config_error_handler(
        _request: Request, exc: SupabaseNotConfiguredError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=503,
            content={"detail": str(exc), "type": "supabase_not_configured"},
        )

    return app


app = create_app()

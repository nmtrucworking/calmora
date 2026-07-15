from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import Settings, get_settings
from app.core.errors import install_error_handlers, success
from app.core.logging import configure_logging
from app.core.middleware import PayloadLimitMiddleware, install_request_middleware
from app.modules import admin, analytics, catalog, qr, submissions, system
from app.repository import SqlAlchemyRepository
from app.services import build_services

SEED_DIR = Path(__file__).resolve().parent / "seed"


def create_app(settings: Settings | None = None, repository: Any | None = None) -> FastAPI:
    settings = settings or get_settings()
    repository = repository or SqlAlchemyRepository()

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        repository.initialize()
        yield

    application = FastAPI(title="Calmora / Senova Backend", version="1.1.0", lifespan=lifespan)
    application.state.settings = settings
    application.state.logger = configure_logging(settings.log_level)
    application.state.services = build_services(settings, repository, SEED_DIR)
    application.add_middleware(PayloadLimitMiddleware, max_bytes=settings.max_request_bytes)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Idempotency-Key", "X-Request-ID", "X-CSRF-Token"],
    )
    application.middleware("http")(install_request_middleware(application, settings))
    install_error_handlers(application)

    @application.get("/", tags=["system"])
    async def root():
        return success({"service": "calmora-senova-api", "version": application.version})

    for feature_router in (
        system.router,
        catalog.router,
        qr.router,
        submissions.router,
        analytics.router,
        admin.router,
    ):
        application.include_router(feature_router, prefix=settings.api_prefix)
        application.include_router(feature_router, prefix=f"{settings.api_prefix}/v1", include_in_schema=True)
    return application


app = create_app()

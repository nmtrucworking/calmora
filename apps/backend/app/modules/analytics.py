from __future__ import annotations

from typing import Any, Literal
from uuid import uuid4

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from app.core.errors import success
from app.modules.common import now_utc, sanitize_text

AllowedEvent = Literal[
    "catalog_load_failed",
    "catalog_local_fallback",
    "page_view",
    "contact_start",
    "feedback_submit",
    "feedback_start",
    "experience_start",
    "partner_inquiry",
    "product_view",
    "qr_inactive",
    "qr_invalid",
    "qr_redirect_success",
    "qr_scan",
    "sample_interest_start",
    "sample_interest_submit",
    "checkout_start",
    "checkout_submit",
    "contact_submit",
    "partner_submit",
]


class AnalyticsEventRequest(BaseModel):
    eventName: AllowedEvent
    productSlug: str | None = Field(default=None, max_length=100)
    batchCode: str | None = Field(default=None, max_length=100)
    contentVersion: str | None = Field(default=None, max_length=100)
    source: str | None = Field(default=None, max_length=100)
    contentViewed: str | None = Field(default=None, max_length=100)
    path: str | None = Field(default=None, max_length=500)
    destination: str | None = Field(default=None, max_length=500)
    status: str | None = Field(default=None, max_length=100)
    timestamp: str | None = Field(default=None, max_length=100)


class AnalyticsService:
    def __init__(self, repository: Any):
        self.repository = repository

    def store(self, entry: dict[str, Any]) -> None:
        self.repository.insert_analytics_event(entry)

    def ingest(self, event: AnalyticsEventRequest) -> str:
        entry_id = str(uuid4())
        self.store(
            {
                "id": entry_id,
                "eventName": event.eventName,
                "productSlug": sanitize_text(event.productSlug),
                "batchCode": sanitize_text(event.batchCode),
                "contentVersion": sanitize_text(event.contentVersion),
                "source": sanitize_text(event.source),
                "contentViewed": sanitize_text(event.contentViewed),
                "path": sanitize_text(event.path),
                "destination": sanitize_text(event.destination),
                "status": sanitize_text(event.status),
                "createdAt": event.timestamp or now_utc().isoformat(),
            }
        )
        return entry_id


router = APIRouter(tags=["analytics"])


@router.post("/analytics/events")
async def ingest(event: AnalyticsEventRequest, request: Request):
    request.app.state.services.rate_limiter.check(
        f"analytics:{request.client.host if request.client else 'unknown'}", 120
    )
    return success({"id": request.app.state.services.analytics.ingest(event)})

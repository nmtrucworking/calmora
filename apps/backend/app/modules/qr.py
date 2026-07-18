from __future__ import annotations

import json
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any, Literal
from urllib.parse import urlencode
from uuid import uuid4

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from app.core.errors import DomainError, success
from app.modules.common import now_utc, parse_datetime, sanitize_text
from app.seed.cutover import CUTOVER_VERSION, build_cutover_contents, build_cutover_override

QrStatus = Literal["active", "paused", "expired", "revoked"]


class ScanRequest(BaseModel):
    source: str | None = Field(default="qr", max_length=100)
    path: str | None = Field(default=None, max_length=500)
    referrer: str | None = Field(default=None, max_length=500)
    campaign: str | None = Field(default=None, max_length=100)


class QrRepository:
    def __init__(self, seed_dir: Path):
        self.records = _load(seed_dir / "qr_records.json")
        for record in self.records:
            if record.get("code") in {"PP-2601-A", "CL-2601-A", "GS-2601-A"} and record.get("contentVersion") == "v1":
                record["contentVersion"] = CUTOVER_VERSION
        self.contents = [*_load(seed_dir / "qr_experience_content.json"), *build_cutover_contents(seed_dir)]
        self.overrides = [*_load(seed_dir / "qr_batch_overrides.json"), build_cutover_override(seed_dir)]

    def get_record(self, code: str) -> dict[str, Any] | None:
        item = next((value for value in self.records if value.get("code") == code.strip().upper()), None)
        return deepcopy(item) if item else None

    def get_content(self, slug: str, version: str, locale: str) -> dict[str, Any] | None:
        item = next(
            (
                value
                for value in self.contents
                if value.get("productSlug") == slug
                and value.get("version") == version
                and value.get("locale", "vi") == locale
            ),
            None,
        )
        return deepcopy(item) if item else None

    def get_override(self, batch: str | None, slug: str, version: str) -> dict[str, Any] | None:
        if not batch:
            return None
        item = next(
            (
                value
                for value in self.overrides
                if value.get("batchCode") == batch.strip().upper()
                and value.get("productSlug") == slug
                and value.get("contentVersion") == version
            ),
            None,
        )
        return deepcopy(item) if item else None


class QrService:
    def __init__(self, repository: QrRepository, analytics: Any):
        self.repository = repository
        self.analytics = analytics

    @staticmethod
    def status(record: dict[str, Any], current_time: datetime | None = None) -> QrStatus:
        current_time = current_time or now_utc()
        status = record.get("status", "active")
        if status in ("paused", "revoked"):
            return status
        expires_at = parse_datetime(record.get("expiresAt"))
        if expires_at and expires_at < current_time:
            return "expired"
        active_from = parse_datetime(record.get("activeFrom"))
        return "paused" if active_from and active_from > current_time else "active"

    def resolve(self, code: str) -> dict[str, Any]:
        record = self.repository.get_record(code)
        if not record:
            raise DomainError(404, "QR_NOT_FOUND", "QR code is not recognized.")
        status = self.status(record)
        result = {key: record.get(key) for key in ("code", "productSlug", "batchCode", "contentVersion", "destination")}
        result.update({"contentViewed": f"{record['productSlug']}-scan", "status": status})
        if status == "active":
            destination = record.get("destination", "")
            if not destination.startswith("/experience/"):
                raise DomainError(500, "QR_DESTINATION_INVALID", "QR destination is not allowed.")
            params = {
                "batch": record.get("batchCode") or record["code"],
                "source": "qr",
                "content": result["contentViewed"],
                "version": record.get("contentVersion", "v1"),
            }
            result["redirectUrl"] = f"{destination}?{urlencode(params)}"
        else:
            result["message"] = f"QR code is {status}."
        return result

    def experience(self, slug: str, version: str, locale: str, batch: str | None) -> dict[str, Any]:
        content = self.repository.get_content(slug, version, locale)
        if not content:
            raise DomainError(404, "QR_CONTENT_NOT_FOUND", "QR experience content was not found.")
        override = self.repository.get_override(batch, slug, version)
        if override and override.get("guidanceOverride"):
            content["guidance"] = override["guidanceOverride"]
        content["batchNotice"] = override.get("notice") if override else None
        return content

    def scan(self, code: str, payload: ScanRequest, user_agent: str | None) -> None:
        record = self.repository.get_record(code)
        if not record:
            raise DomainError(404, "QR_NOT_FOUND", "QR code is not recognized.")
        status = self.status(record)
        self.analytics.store(
            {
                "id": str(uuid4()),
                "eventName": "qr_scan" if status == "active" else "qr_inactive",
                "code": record["code"],
                "productSlug": record["productSlug"],
                "batchCode": record.get("batchCode"),
                "contentVersion": record.get("contentVersion", "v1"),
                "contentViewed": f"{record['productSlug']}-scan",
                "source": sanitize_text(payload.source or "qr"),
                "campaign": sanitize_text(payload.campaign or record.get("campaign")),
                "path": sanitize_text(payload.path),
                "referrer": sanitize_text(payload.referrer),
                "userAgent": sanitize_text(user_agent),
                "status": status,
                "createdAt": now_utc().isoformat(),
            }
        )


def _load(path: Path) -> list[dict[str, Any]]:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else []


router = APIRouter(tags=["qr"])


@router.get("/qr/experience/{product_slug}")
async def experience(
    product_slug: str, request: Request, version: str = "v1", batch: str | None = None, locale: str = "vi"
):
    return success(request.app.state.services.qr.experience(product_slug, version, locale, batch))


@router.get("/qr/{code}")
async def resolve(code: str, request: Request):
    return success(request.app.state.services.qr.resolve(code))


@router.post("/qr/{code}/scan")
async def scan(code: str, payload: ScanRequest, request: Request):
    request.app.state.services.rate_limiter.check(f"qr_scan:{request.client.host if request.client else 'unknown'}", 60)
    request.app.state.services.qr.scan(code, payload, request.headers.get("user-agent"))
    return success({"accepted": True})

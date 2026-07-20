from __future__ import annotations

import base64
import hashlib
import hmac
import json
import re
from typing import Any, Literal
from uuid import uuid4

from fastapi import APIRouter, Header, Query, Request
from pydantic import BaseModel

from app.core.errors import DomainError, success
from app.modules.common import now_utc, sanitize_payload

SubmissionKind = Literal["feedback", "pre-order", "sample-interest", "contact", "partners"]


class SubmissionRequest(BaseModel):
    kind: SubmissionKind
    payload: dict[str, Any]


class SubmissionService:
    def __init__(self, repository: Any, catalog: Any, receipt_secret: str):
        self.repository = repository
        self.catalog = catalog
        self.receipt_secret = receipt_secret.encode()

    def create(self, submission: SubmissionRequest, idempotency_key: str | None) -> dict[str, str]:
        if idempotency_key and not re.fullmatch(r"[A-Za-z0-9._:-]{8,128}", idempotency_key):
            raise DomainError(400, "INVALID_IDEMPOTENCY_KEY", "Idempotency-Key must contain 8-128 safe characters.")
        payload = sanitize_payload(submission.payload)
        if payload.get("website"):
            raise DomainError(400, "SPAM_DETECTED", "Submission was rejected.")
        self._validate(submission.kind, payload)
        if submission.kind == "pre-order":
            payload["items"] = [self.catalog.snapshot_item(item) for item in payload["items"]]
            payload.pop("itemCount", None)
        timestamp = now_utc().isoformat()
        entry = {
            "id": f"{submission.kind}-{now_utc().strftime('%Y%m%d')}-{uuid4().hex[:8]}",
            "kind": submission.kind,
            "payload": payload,
            "status": "new",
            "createdAt": timestamp,
            "updatedAt": timestamp,
        }
        stored, _ = self.repository.insert_submission(
            entry, f"{submission.kind}:{idempotency_key}" if idempotency_key else None
        )
        return {"id": stored["id"], "receiptToken": self._receipt_token(stored["id"])}

    def status(self, submission_id: str, receipt_token: str) -> dict[str, Any]:
        if not hmac.compare_digest(receipt_token, self._receipt_token(submission_id)):
            raise DomainError(404, "SUBMISSION_NOT_FOUND", "Submission was not found.")
        entry = self.repository.get_submission(submission_id)
        if not entry:
            raise DomainError(404, "SUBMISSION_NOT_FOUND", "Submission was not found.")
        return {key: entry[key] for key in ("id", "kind", "status", "createdAt", "updatedAt")}

    def _receipt_token(self, submission_id: str) -> str:
        digest = hmac.new(self.receipt_secret, submission_id.encode(), hashlib.sha256).digest()
        return base64.urlsafe_b64encode(digest).decode().rstrip("=")

    @staticmethod
    def _validate(kind: SubmissionKind, payload: dict[str, Any]) -> None:
        required = {
            "feedback": [
                "skuOrLot",
                "source",
                "contentViewed",
                "sensoryFeedback",
                "acceptablePriceRange",
                "purchaseIntentPurpose",
                "optInConsent",
                "productSlug",
            ],
            "sample-interest": [
                "name",
                "email",
                "role",
                "primaryProduct",
                "sampleFormat",
                "useCase",
                "validationTopics",
                "evidenceConsent",
            ],
            "contact": ["name", "email", "topic", "message"],
            "partners": ["name", "email", "organization", "message"],
            "pre-order": ["name", "email", "phone", "zalo", "policyConsent", "items"],
        }
        missing = [field for field in required[kind] if not payload.get(field)]
        if missing:
            raise DomainError(422, "VALIDATION_ERROR", f"Missing required fields: {', '.join(missing)}")
        email = payload.get("email")
        if email and not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", str(email)):
            raise DomainError(422, "VALIDATION_ERROR", "Email is invalid.")
        if kind == "pre-order" and (not isinstance(payload.get("items"), list) or len(payload["items"]) > 100):
            raise DomainError(
                422, "VALIDATION_ERROR", "Pre-order items must be a non-empty array of at most 100 items."
            )
        if len(json.dumps(payload, ensure_ascii=False).encode()) > 64 * 1024:
            raise DomainError(413, "PAYLOAD_TOO_LARGE", "Submission payload exceeds 64 KiB.")


router = APIRouter(tags=["submissions"])


@router.post("/submissions")
async def create(
    submission: SubmissionRequest,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
):
    services = request.app.state.services
    services.rate_limiter.check(
        f"submissions:{request.client.host if request.client else 'unknown'}",
        request.app.state.settings.submission_rate_limit_per_minute,
    )
    return success(services.submissions.create(submission, idempotency_key))


@router.get("/submissions/{submission_id}")
async def get_status(
    submission_id: str,
    request: Request,
    receipt_token: str = Query(alias="receiptToken", min_length=20, max_length=128),
):
    return success(request.app.state.services.submissions.status(submission_id, receipt_token))

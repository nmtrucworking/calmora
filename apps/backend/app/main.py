from __future__ import annotations

import json
import os
import re
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal
from urllib.parse import urlencode
from uuid import uuid4

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.database import get_submission as find_stored_submission
from app.database import initialize_database, insert_analytics_event, insert_submission


API_PREFIX = os.getenv("API_PREFIX", "/api")
SEED_DIR = Path(__file__).resolve().parent / "seed"
QrStatus = Literal["active", "paused", "expired", "revoked"]
SubmissionKind = Literal["feedback", "pre-order", "sample-interest", "contact", "partners"]


class ApiError(BaseModel):
    code: str
    message: str


class ApiResponse(BaseModel):
    success: bool
    data: Any | None = None
    error: ApiError | None = None


class ScanRequest(BaseModel):
    source: str | None = "qr"
    path: str | None = None
    referrer: str | None = None
    campaign: str | None = None


class SubmissionRequest(BaseModel):
    kind: SubmissionKind
    payload: dict[str, Any]


class AnalyticsEventRequest(BaseModel):
    eventName: str
    productSlug: str | None = None
    batchCode: str | None = None
    contentVersion: str | None = None
    source: str | None = None
    contentViewed: str | None = None
    path: str | None = None
    destination: str | None = None
    status: str | None = None
    timestamp: str | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    yield


app = FastAPI(title="Calmora / Senova Backend", version="1.0.0", lifespan=lifespan)


def parse_origins() -> list[str]:
    raw_origins = os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://localhost:5175,http://localhost:4173",
    )
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_seed(filename: str) -> list[dict[str, Any]]:
    path = SEED_DIR / filename
    if not path.exists():
        return []

    return json.loads(path.read_text(encoding="utf-8"))


qr_records = load_seed("qr_records.json")
qr_experience_contents = load_seed("qr_experience_content.json")
qr_batch_overrides = load_seed("qr_batch_overrides.json")
products = load_seed("products.json")
rate_limits: dict[str, list[float]] = {}


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None

    normalized_value = value.replace("Z", "+00:00")
    parsed = datetime.fromisoformat(normalized_value)
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)


def normalize_qr_code(code: str) -> str:
    return code.strip().upper()


def sanitize_text(value: Any) -> Any:
    if not isinstance(value, str):
        return value

    return re.sub(r"[<>]", "", value).strip()[:5000]


def sanitize_payload(payload: dict[str, Any]) -> dict[str, Any]:
    def sanitize(value: Any) -> Any:
        if isinstance(value, dict):
            return {str(key)[:100]: sanitize(item) for key, item in value.items()}
        if isinstance(value, list):
            return [sanitize(item) for item in value[:100]]
        return sanitize_text(value)

    return {str(key)[:100]: sanitize(value) for key, value in payload.items()}


def api_success(data: Any = None) -> dict[str, Any]:
    return {"success": True, "data": data}


def api_error(status_code: int, code: str, message: str) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail={"success": False, "error": {"code": code, "message": message}},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    from fastapi.responses import JSONResponse

    if isinstance(exc.detail, dict) and "success" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": "HTTP_ERROR",
                "message": str(exc.detail),
            },
        },
    )


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(_: Request, exc: RequestValidationError):
    from fastapi.responses import JSONResponse

    fields = [".".join(str(part) for part in error["loc"][1:]) for error in exc.errors()]
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": f"Invalid request fields: {', '.join(fields)}",
            },
        },
    )


def check_rate_limit(key: str, limit: int, window_seconds: int = 60) -> None:
    current_time = time.time()
    bucket = [timestamp for timestamp in rate_limits.get(key, []) if current_time - timestamp < window_seconds]

    if len(bucket) >= limit:
        raise api_error(429, "RATE_LIMITED", "Too many requests. Please try again later.")

    bucket.append(current_time)
    rate_limits[key] = bucket


def get_client_key(request: Request, scope: str) -> str:
    host = request.client.host if request.client else "unknown"
    return f"{scope}:{host}"


def get_qr_record(code: str) -> dict[str, Any] | None:
    normalized_code = normalize_qr_code(code)
    return next((record for record in qr_records if record.get("code") == normalized_code), None)


def resolve_qr_status(record: dict[str, Any], current_time: datetime | None = None) -> QrStatus:
    current_time = current_time or now_utc()
    status = record.get("status", "active")

    if status in ("paused", "revoked"):
        return status

    expires_at = parse_datetime(record.get("expiresAt"))
    if expires_at and expires_at < current_time:
        return "expired"

    active_from = parse_datetime(record.get("activeFrom"))
    if active_from and active_from > current_time:
        return "paused"

    return "active"


def content_viewed_for(record: dict[str, Any]) -> str:
    return f"{record['productSlug']}-scan"


def build_redirect_url(record: dict[str, Any]) -> str:
    destination = record.get("destination", "")
    if not destination.startswith("/experience/"):
        raise api_error(500, "QR_DESTINATION_INVALID", "QR destination is not allowed.")

    params = {
        "batch": record.get("batchCode") or record["code"],
        "source": "qr",
        "content": content_viewed_for(record),
        "version": record.get("contentVersion", "v1"),
    }
    return f"{destination}?{urlencode(params)}"


def serialize_qr(record: dict[str, Any], status: str) -> dict[str, Any]:
    data = {
        "code": record["code"],
        "productSlug": record["productSlug"],
        "batchCode": record.get("batchCode"),
        "contentVersion": record.get("contentVersion", "v1"),
        "contentViewed": content_viewed_for(record),
        "destination": record.get("destination"),
        "status": status,
    }

    if status == "active":
        data["redirectUrl"] = build_redirect_url(record)
    else:
        data["message"] = f"QR code is {status}."

    return data


def find_experience_content(product_slug: str, version: str, locale: str) -> dict[str, Any] | None:
    return next(
        (
            content
            for content in qr_experience_contents
            if content.get("productSlug") == product_slug
            and content.get("version") == version
            and content.get("locale", "vi") == locale
        ),
        None,
    )


def find_batch_override(batch_code: str | None, product_slug: str, version: str) -> dict[str, Any] | None:
    if not batch_code:
        return None

    normalized_batch = normalize_qr_code(batch_code)
    return next(
        (
            override
            for override in qr_batch_overrides
            if override.get("batchCode") == normalized_batch
            and override.get("productSlug") == product_slug
            and override.get("contentVersion") == version
        ),
        None,
    )


def validate_submission(kind: str, payload: dict[str, Any]) -> None:
    required_by_kind = {
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
        "pre-order": ["name", "email"],
    }

    missing = [field for field in required_by_kind[kind] if not payload.get(field)]
    if missing:
        raise api_error(422, "VALIDATION_ERROR", f"Missing required fields: {', '.join(missing)}")

    email = payload.get("email")
    if email and not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", str(email)):
        raise api_error(422, "VALIDATION_ERROR", "Email is invalid.")

    if len(json.dumps(payload, ensure_ascii=False).encode("utf-8")) > 64 * 1024:
        raise api_error(413, "PAYLOAD_TOO_LARGE", "Submission payload exceeds 64 KiB.")


@app.get("/")
async def root():
    return api_success({"service": "calmora-senova-api", "version": app.version})


@app.get(f"{API_PREFIX}/health")
async def health():
    return api_success({"status": "ok"})


@app.get(f"{API_PREFIX}/products")
async def list_products():
    return api_success(products)


@app.get(f"{API_PREFIX}/products/{{slug}}")
async def get_product(slug: str):
    product = next((item for item in products if item.get("slug") == slug.strip().lower()), None)
    if not product:
        raise api_error(404, "PRODUCT_NOT_FOUND", "Product was not found.")
    return api_success(product)


@app.get(f"{API_PREFIX}/qr/experience/{{product_slug}}")
async def get_qr_experience(product_slug: str, version: str = "v1", batch: str | None = None, locale: str = "vi"):
    content = find_experience_content(product_slug, version, locale)
    if not content:
        raise api_error(404, "QR_CONTENT_NOT_FOUND", "QR experience content was not found.")

    response = dict(content)
    override = find_batch_override(batch, product_slug, version)

    if override:
        if override.get("guidanceOverride"):
            response["guidance"] = override["guidanceOverride"]
        response["batchNotice"] = override.get("notice")
    else:
        response["batchNotice"] = None

    return api_success(response)


@app.get(f"{API_PREFIX}/qr/{{code}}")
async def resolve_qr(code: str):
    record = get_qr_record(code)
    if not record:
        raise api_error(404, "QR_NOT_FOUND", "QR code is not recognized.")

    status = resolve_qr_status(record)
    return api_success(serialize_qr(record, status))


@app.post(f"{API_PREFIX}/qr/{{code}}/scan")
async def track_qr_scan(code: str, payload: ScanRequest, request: Request):
    check_rate_limit(get_client_key(request, "qr_scan"), limit=60)

    record = get_qr_record(code)
    if not record:
        raise api_error(404, "QR_NOT_FOUND", "QR code is not recognized.")

    status = resolve_qr_status(record)
    entry = {
        "id": str(uuid4()),
        "eventName": "qr_scan" if status == "active" else "qr_inactive",
        "code": record["code"],
        "productSlug": record["productSlug"],
        "batchCode": record.get("batchCode"),
        "contentVersion": record.get("contentVersion", "v1"),
        "contentViewed": content_viewed_for(record),
        "source": sanitize_text(payload.source or "qr"),
        "campaign": sanitize_text(payload.campaign or record.get("campaign")),
        "path": sanitize_text(payload.path),
        "referrer": sanitize_text(payload.referrer),
        "userAgent": sanitize_text(request.headers.get("user-agent")),
        "status": status,
        "createdAt": now_utc().isoformat(),
    }
    insert_analytics_event(entry)

    return api_success({"accepted": True})


@app.post(f"{API_PREFIX}/submissions")
async def create_submission(
    submission: SubmissionRequest,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
):
    limit = int(os.getenv("SUBMISSION_RATE_LIMIT_PER_MINUTE", "10"))
    check_rate_limit(get_client_key(request, "submissions"), limit=limit)

    if idempotency_key and not re.fullmatch(r"[A-Za-z0-9._:-]{8,128}", idempotency_key):
        raise api_error(400, "INVALID_IDEMPOTENCY_KEY", "Idempotency-Key must contain 8-128 safe characters.")

    payload = sanitize_payload(submission.payload)
    if payload.get("website"):
        raise api_error(400, "SPAM_DETECTED", "Submission was rejected.")

    validate_submission(submission.kind, payload)

    entry = {
        "id": f"{submission.kind}-{now_utc().strftime('%Y%m%d')}-{uuid4().hex[:8]}",
        "kind": submission.kind,
        "payload": payload,
        "status": "new",
        "createdAt": now_utc().isoformat(),
        "updatedAt": now_utc().isoformat(),
    }
    stored, _ = insert_submission(entry, f"{submission.kind}:{idempotency_key}" if idempotency_key else None)

    return api_success({"id": stored["id"]})


@app.get(f"{API_PREFIX}/submissions/{{submission_id}}")
async def get_submission(submission_id: str):
    entry = find_stored_submission(submission_id)
    if not entry:
        raise api_error(404, "SUBMISSION_NOT_FOUND", "Submission was not found.")

    # Public status lookup deliberately excludes the PII-bearing payload.
    return api_success({key: entry[key] for key in ("id", "kind", "status", "createdAt", "updatedAt")})


@app.post(f"{API_PREFIX}/analytics/events")
async def create_analytics_event(event: AnalyticsEventRequest, request: Request):
    check_rate_limit(get_client_key(request, "analytics"), limit=120)

    if not event.eventName.strip() or len(event.eventName) > 100:
        raise api_error(422, "VALIDATION_ERROR", "eventName must contain 1-100 characters.")

    entry = {
        "id": str(uuid4()),
        "eventName": sanitize_text(event.eventName),
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
    insert_analytics_event(entry)

    return api_success({"id": entry["id"]})

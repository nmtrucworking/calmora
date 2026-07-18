# ruff: noqa: B008, E501
from __future__ import annotations

import csv
import hashlib
import hmac
import io
import secrets
from datetime import UTC, datetime
from typing import Any
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import APIRouter, Depends, Request, Response
from pydantic import BaseModel, Field

from app.admin_repository import AdminRepository
from app.core.errors import DomainError, success

SESSION_COOKIE = "senova_admin_session"
CSRF_COOKIE = "senova_admin_csrf"
POSTGRES_TIMEZONE_ALIASES = {"Asia/Saigon": "Asia/Ho_Chi_Minh"}
hasher = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=4)


def digest(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=10, max_length=1024)


class ResetRequest(BaseModel):
    email: str = Field(min_length=3, max_length=320)


class ResetConfirmRequest(BaseModel):
    token: str = Field(min_length=32, max_length=256)
    password: str = Field(min_length=12, max_length=1024)


class ResourceWrite(BaseModel):
    data: dict[str, Any]
    expectedVersion: int | None = Field(default=None, ge=1)


class StatusWrite(BaseModel):
    status: str
    expectedVersion: int = Field(ge=1)


class LeadStatusWrite(BaseModel):
    status: str


class LeadAssignWrite(BaseModel):
    assigneeId: str | None = None


class LeadNoteWrite(BaseModel):
    note: str = Field(min_length=1, max_length=5000)


class QrContentWrite(BaseModel):
    data: dict[str, Any]


class QrOverrideWrite(BaseModel):
    guidanceOverride: dict[str, Any] | None = None
    notice: str | None = Field(default=None, max_length=2000)


class OverrideStatusWrite(BaseModel):
    status: str


class AdminService:
    def __init__(self, repository: AdminRepository, app_env: str):
        self.repository = repository
        self.app_env = app_env

    def login(self, email: str, password: str, request_id: str | None) -> tuple[dict[str, Any], str, str]:
        identity = self.repository.identity_by_email(email.strip().lower())
        if not identity or identity["status"] != "active":
            self.repository.audit(
                None, "admin.login_failed", "admin_user", None, {"reason": "invalid_credentials"}, request_id
            )
            raise DomainError(401, "INVALID_CREDENTIALS", "Email or password is invalid.")
        locked_until = identity.get("locked_until")
        if locked_until and locked_until > datetime.now(UTC):
            raise DomainError(423, "ACCOUNT_LOCKED", "Account is temporarily locked.")
        try:
            hasher.verify(identity["password_hash"], password)
        except VerifyMismatchError as exc:
            self.repository.login_failed(identity["id"])
            self.repository.audit(
                identity["id"],
                "admin.login_failed",
                "admin_user",
                identity["id"],
                {"reason": "invalid_credentials"},
                request_id,
            )
            raise DomainError(401, "INVALID_CREDENTIALS", "Email or password is invalid.") from exc
        token, csrf = secrets.token_urlsafe(48), secrets.token_urlsafe(32)
        self.repository.login_succeeded(identity["id"])
        self.repository.create_session(identity["id"], digest(token), digest(csrf))
        self.repository.audit(identity["id"], "admin.login", "admin_session", None, {}, request_id)
        return self.public_identity(identity), token, csrf

    def authenticate(self, request: Request) -> dict[str, Any]:
        token = request.cookies.get(SESSION_COOKIE)
        identity = self.repository.identity_by_session(digest(token)) if token else None
        if not identity or identity["status"] != "active":
            raise DomainError(401, "AUTHENTICATION_REQUIRED", "Admin authentication is required.")
        return identity

    @staticmethod
    def public_identity(identity: dict[str, Any]) -> dict[str, Any]:
        return {
            "id": identity["id"],
            "name": identity["name"],
            "email": identity["email"],
            "role": identity["roles"][0] if identity.get("roles") else None,
            "permissions": sorted(identity["permissions"]),
        }

    def verify_csrf(self, request: Request) -> None:
        token = request.cookies.get(SESSION_COOKIE)
        cookie_csrf = request.cookies.get(CSRF_COOKIE, "")
        header_csrf = request.headers.get("x-csrf-token", "")
        stored = self.repository.session_csrf_hash(digest(token)) if token else None
        if (
            not stored
            or not cookie_csrf
            or not hmac.compare_digest(cookie_csrf, header_csrf)
            or not hmac.compare_digest(stored, digest(header_csrf))
        ):
            raise DomainError(403, "CSRF_FAILED", "CSRF validation failed.")


def current_identity(request: Request) -> dict[str, Any]:
    return request.app.state.services.admin.authenticate(request)


def require(permission: str, mutation: bool = False):
    def dependency(request: Request, identity: dict[str, Any] = Depends(current_identity)) -> dict[str, Any]:
        if permission not in identity["permissions"]:
            request.app.state.services.admin.repository.audit(
                identity["id"],
                "permission.denied",
                "permission",
                permission,
                {"method": request.method, "path": request.url.path},
                getattr(request.state, "request_id", None),
            )
            raise DomainError(403, "PERMISSION_DENIED", "Permission is required.")
        if mutation:
            request.app.state.services.admin.verify_csrf(request)
        return identity

    return dependency


router = APIRouter(tags=["admin"])


@router.post("/auth/login")
async def login(payload: LoginRequest, request: Request, response: Response):
    request.app.state.services.rate_limiter.check(
        f"admin_login:{request.client.host if request.client else 'unknown'}", 10
    )
    identity, token, csrf = request.app.state.services.admin.login(
        payload.email, payload.password, getattr(request.state, "request_id", None)
    )
    secure = request.app.state.settings.app_env in {"staging", "production"}
    response.set_cookie(
        SESSION_COOKIE, token, httponly=True, secure=secure, samesite="strict", max_age=28800, path="/api"
    )
    response.set_cookie(CSRF_COOKIE, csrf, httponly=False, secure=secure, samesite="strict", max_age=28800, path="/api")
    return success(identity)


@router.get("/auth/me")
async def me(identity: dict[str, Any] = Depends(current_identity)):
    return success(AdminService.public_identity(identity))


@router.post("/auth/logout")
async def logout(
    request: Request, response: Response, identity: dict[str, Any] = Depends(require("sessions.revoke", True))
):
    token = request.cookies.get(SESSION_COOKIE, "")
    request.app.state.services.admin.repository.revoke_session(digest(token))
    request.app.state.services.admin.repository.audit(
        identity["id"], "admin.logout", "admin_session", None, {}, getattr(request.state, "request_id", None)
    )
    response.delete_cookie(SESSION_COOKIE, path="/api")
    response.delete_cookie(CSRF_COOKIE, path="/api")
    return success({"loggedOut": True})


@router.post("/auth/password-reset/request")
async def reset_request(payload: ResetRequest, request: Request):
    request.app.state.services.rate_limiter.check(
        f"admin_reset:{request.client.host if request.client else 'unknown'}", 5
    )
    identity = request.app.state.services.admin.repository.identity_by_email(payload.email.strip().lower())
    data: dict[str, Any] = {"accepted": True}
    if identity:
        token = secrets.token_urlsafe(48)
        request.app.state.services.admin.repository.create_reset_token(identity["id"], digest(token))
        request.app.state.services.admin.repository.audit(
            identity["id"],
            "admin.password_reset_requested",
            "admin_user",
            identity["id"],
            {},
            getattr(request.state, "request_id", None),
        )
        if request.app.state.settings.app_env == "test":
            data["resetToken"] = token
    return success(data)


@router.post("/auth/password-reset/confirm")
async def reset_confirm(payload: ResetConfirmRequest, request: Request):
    user_id = request.app.state.services.admin.repository.consume_reset_token(
        digest(payload.token), hasher.hash(payload.password)
    )
    if not user_id:
        raise DomainError(400, "RESET_TOKEN_INVALID", "Reset token is invalid or expired.")
    request.app.state.services.admin.repository.revoke_user_sessions(user_id)
    request.app.state.services.admin.repository.audit(
        user_id, "admin.password_reset", "admin_user", user_id, {}, getattr(request.state, "request_id", None)
    )
    return success({"reset": True})


@router.post("/admin/sessions/revoke-all")
async def revoke_all(request: Request, identity: dict[str, Any] = Depends(require("sessions.revoke", True))):
    request.app.state.services.admin.repository.revoke_user_sessions(identity["id"])
    return success({"revoked": True})


@router.get("/admin/products")
async def admin_products(request: Request, _: dict[str, Any] = Depends(require("catalog.read"))):
    return success(request.app.state.services.admin.repository.list_products())


@router.get("/admin/products/{product_id}")
async def admin_product(product_id: str, request: Request, _: dict[str, Any] = Depends(require("catalog.read"))):
    product = request.app.state.services.admin.repository.get_product(product_id)
    if not product:
        raise DomainError(404, "PRODUCT_NOT_FOUND", "Product was not found.")
    return success(product)


@router.put("/admin/products/{product_id}")
async def save_product(
    product_id: str,
    payload: ResourceWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("catalog.write", True)),
):
    if not payload.data.get("slug") or not payload.data.get("name"):
        raise DomainError(422, "VALIDATION_ERROR", "Product slug and name are required.")
    repository = request.app.state.services.admin.repository
    data = payload.data
    if payload.expectedVersion is None:
        if data.get("status", "draft") != "draft":
            raise DomainError(403, "PERMISSION_DENIED", "New products must be created as draft.")
    else:
        current = repository.get_product(product_id)
        if not current:
            raise DomainError(404, "PRODUCT_NOT_FOUND", "Product was not found.")
        data = {**data, "status": current["status"]}
    result = repository.save_product(product_id, data, payload.expectedVersion)
    if not result:
        raise DomainError(409, "VERSION_CONFLICT", "Product was changed by another editor.")
    request.app.state.services.admin.repository.audit(
        identity["id"],
        "catalog.write",
        "product",
        product_id,
        {"version": result["version"]},
        getattr(request.state, "request_id", None),
    )
    return success(repository.get_product(product_id))


@router.post("/admin/products/{product_id}/status")
async def product_status(
    product_id: str,
    payload: StatusWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("catalog.publish", True)),
):
    if payload.status not in {"draft", "active", "archived"}:
        raise DomainError(422, "VALIDATION_ERROR", "Invalid product status.")
    if not request.app.state.services.admin.repository.set_product_status(
        product_id, payload.status, payload.expectedVersion
    ):
        raise DomainError(409, "VERSION_CONFLICT", "Product was changed by another editor.")
    request.app.state.services.admin.repository.audit(
        identity["id"],
        f"catalog.{payload.status}",
        "product",
        product_id,
        {},
        getattr(request.state, "request_id", None),
    )
    return success(request.app.state.services.admin.repository.get_product(product_id))


@router.get("/admin/qr")
async def admin_qr(request: Request, _: dict[str, Any] = Depends(require("qr.read"))):
    return success(request.app.state.services.admin.repository.list_qr())


@router.get("/admin/qr/{code}")
async def admin_qr_detail(code: str, request: Request, _: dict[str, Any] = Depends(require("qr.read"))):
    item = request.app.state.services.admin.repository.get_qr(code)
    if not item:
        raise DomainError(404, "QR_NOT_FOUND", "QR record was not found.")
    return success(item)


@router.put("/admin/qr/{code}")
async def save_qr(
    code: str, payload: ResourceWrite, request: Request, identity: dict[str, Any] = Depends(require("qr.manage", True))
):
    destination = str(payload.data.get("destination", ""))
    if not destination.startswith("/experience/") or payload.data.get("status") not in {"active", "paused", "revoked"}:
        raise DomainError(422, "VALIDATION_ERROR", "QR destination or status is invalid.")
    normalized = code.strip().upper()
    if payload.data.get(
        "status"
    ) == "active" and not request.app.state.services.admin.repository.published_qr_content_exists(
        str(payload.data.get("productSlug", "")),
        str(payload.data.get("contentVersion", "v1")),
        str(payload.data.get("locale", "vi")),
    ):
        raise DomainError(409, "QR_CONTENT_NOT_PUBLISHED", "QR activation requires published content.")
    if not request.app.state.services.admin.repository.save_qr(
        normalized, {**payload.data, "code": normalized}, payload.expectedVersion
    ):
        raise DomainError(409, "VERSION_CONFLICT", "QR record was changed by another editor.")
    request.app.state.services.admin.repository.audit(
        identity["id"], "qr.write", "qr_record", normalized, {}, getattr(request.state, "request_id", None)
    )
    return success(request.app.state.services.admin.repository.get_qr(normalized))


@router.post("/admin/qr/{code}/status")
async def qr_status(
    code: str,
    payload: StatusWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("qr.manage", True)),
):
    if payload.status not in {"active", "paused", "revoked"}:
        raise DomainError(422, "VALIDATION_ERROR", "Invalid QR status.")
    repository = request.app.state.services.admin.repository
    normalized = code.strip().upper()
    current = repository.get_qr(normalized)
    if not current:
        raise DomainError(404, "QR_NOT_FOUND", "QR record was not found.")
    if payload.status == "active" and not repository.published_qr_content_exists(
        str(current.get("productSlug", "")), str(current.get("contentVersion", "v1")), str(current.get("locale", "vi"))
    ):
        raise DomainError(409, "QR_CONTENT_NOT_PUBLISHED", "QR activation requires published content.")
    if not repository.set_qr_status(normalized, payload.status, payload.expectedVersion):
        raise DomainError(409, "VERSION_CONFLICT", "QR record was changed by another editor.")
    repository.audit(
        identity["id"], f"qr.{payload.status}", "qr_record", normalized, {}, getattr(request.state, "request_id", None)
    )
    return success(repository.get_qr(normalized))


@router.get("/admin/qr-contents")
async def qr_contents(request: Request, _: dict[str, Any] = Depends(require("qr.read"))):
    return success(request.app.state.services.admin.repository.list_qr_contents())


@router.get("/admin/qr-contents/{product}/{version}/{locale}")
async def qr_content_detail(
    product: str,
    version: str,
    locale: str,
    request: Request,
    _: dict[str, Any] = Depends(require("qr.read")),
):
    item = request.app.state.services.admin.repository.get_qr_content(product, version, locale)
    if not item:
        raise DomainError(404, "QR_CONTENT_NOT_FOUND", "QR content was not found.")
    return success(item)


@router.put("/admin/qr-contents/{product}/{version}/{locale}")
async def save_qr_content(
    product: str,
    version: str,
    locale: str,
    payload: QrContentWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("qr.manage", True)),
):
    if not payload.data:
        raise DomainError(422, "VALIDATION_ERROR", "QR content cannot be empty.")
    if not request.app.state.services.admin.repository.product_exists(product):
        raise DomainError(404, "PRODUCT_NOT_FOUND", "Product was not found.")
    data = {**payload.data, "productSlug": product, "version": version, "locale": locale}
    if not request.app.state.services.admin.repository.save_qr_content(product, version, locale, data):
        raise DomainError(409, "QR_CONTENT_IMMUTABLE", "Published QR content is immutable; use a new version.")
    request.app.state.services.admin.repository.audit(
        identity["id"],
        "qr.content_write",
        "qr_content",
        f"{product}:{version}:{locale}",
        {},
        getattr(request.state, "request_id", None),
    )
    return success(request.app.state.services.admin.repository.get_qr_content(product, version, locale))


@router.post("/admin/qr-contents/{product}/{version}/{locale}/publish")
async def publish_qr_content(
    product: str,
    version: str,
    locale: str,
    request: Request,
    identity: dict[str, Any] = Depends(require("qr.manage", True)),
):
    if not request.app.state.services.admin.repository.publish_qr_content(product, version, locale):
        raise DomainError(409, "QR_CONTENT_TRANSITION_INVALID", "Only draft QR content can publish.")
    request.app.state.services.admin.repository.audit(
        identity["id"],
        "qr.content_publish",
        "qr_content",
        f"{product}:{version}:{locale}",
        {},
        getattr(request.state, "request_id", None),
    )
    return success(request.app.state.services.admin.repository.get_qr_content(product, version, locale))


@router.get("/admin/qr-overrides")
async def qr_overrides(
    request: Request,
    product: str | None = None,
    version: str | None = None,
    status: str | None = None,
    _: dict[str, Any] = Depends(require("qr.read")),
):
    return success(request.app.state.services.admin.repository.list_qr_overrides(product, version, status))


@router.get("/admin/qr-overrides/{batch}/{product}/{version}")
async def qr_override_detail(
    batch: str,
    product: str,
    version: str,
    request: Request,
    _: dict[str, Any] = Depends(require("qr.read")),
):
    item = request.app.state.services.admin.repository.get_qr_override(batch, product, version)
    if not item:
        raise DomainError(404, "QR_OVERRIDE_NOT_FOUND", "QR batch override was not found.")
    return success(item)


@router.put("/admin/qr-overrides/{batch}/{product}/{version}")
async def save_qr_override(
    batch: str,
    product: str,
    version: str,
    payload: QrOverrideWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("qr.manage", True)),
):
    if not request.app.state.services.admin.repository.published_qr_content_exists(product, version, "vi"):
        raise DomainError(409, "QR_CONTENT_NOT_PUBLISHED", "Batch override requires published base content.")
    data = {
        "batchCode": batch.strip().upper(),
        "productSlug": product,
        "contentVersion": version,
        "guidanceOverride": payload.guidanceOverride,
        "notice": payload.notice,
    }
    request.app.state.services.admin.repository.save_qr_override(data["batchCode"], product, version, data)
    request.app.state.services.admin.repository.audit(
        identity["id"],
        "qr.override_write",
        "qr_override",
        f"{data['batchCode']}:{product}:{version}",
        {},
        getattr(request.state, "request_id", None),
    )
    return success(request.app.state.services.admin.repository.get_qr_override(data["batchCode"], product, version))


@router.patch("/admin/qr-overrides/{batch}/{product}/{version}/status")
async def qr_override_status(
    batch: str,
    product: str,
    version: str,
    payload: OverrideStatusWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("qr.manage", True)),
):
    if payload.status not in {"active", "disabled"}:
        raise DomainError(422, "VALIDATION_ERROR", "Invalid QR override status.")
    repository = request.app.state.services.admin.repository
    if not repository.set_qr_override_status(batch, product, version, payload.status):
        raise DomainError(404, "QR_OVERRIDE_NOT_FOUND", "QR batch override was not found.")
    repository.audit(
        identity["id"],
        "qr.override_status",
        "qr_override",
        f"{batch}:{product}:{version}",
        {"status": payload.status},
        getattr(request.state, "request_id", None),
    )
    return success(repository.get_qr_override(batch, product, version))


@router.get("/admin/submissions")
async def leads(
    request: Request,
    status: str | None = None,
    kind: str | None = None,
    q: str | None = None,
    page: int = 1,
    pageSize: int = 20,
    _: dict[str, Any] = Depends(require("submissions.read")),
):
    page, pageSize = max(1, page), min(max(1, pageSize), 100)
    items, total = request.app.state.services.admin.repository.list_leads(status, kind, q, page, pageSize)
    return {"success": True, "data": items, "meta": {"page": page, "pageSize": pageSize, "total": total}}


@router.get("/admin/users")
async def admin_users(
    request: Request,
    status: str = "active",
    _: dict[str, Any] = Depends(require("submissions.assign")),
):
    if status not in {"active", "disabled"}:
        raise DomainError(422, "VALIDATION_ERROR", "Invalid admin user status.")
    return success(request.app.state.services.admin.repository.list_admin_users(status))


@router.get("/admin/submissions/{submission_id}")
async def lead_detail(submission_id: str, request: Request, _: dict[str, Any] = Depends(require("submissions.read"))):
    item = request.app.state.services.admin.repository.get_lead(submission_id)
    if not item:
        raise DomainError(404, "SUBMISSION_NOT_FOUND", "Submission was not found.")
    return success(item)


@router.patch("/admin/submissions/{submission_id}/status")
async def lead_status(
    submission_id: str,
    payload: LeadStatusWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("submissions.write", True)),
):
    if payload.status not in {"new", "contacted", "qualified", "closed"}:
        raise DomainError(422, "VALIDATION_ERROR", "Invalid lead status.")
    if not request.app.state.services.admin.repository.update_lead(
        submission_id, identity["id"], status=payload.status
    ):
        raise DomainError(404, "SUBMISSION_NOT_FOUND", "Submission was not found.")
    request.app.state.services.admin.repository.audit(
        identity["id"],
        "submission.status",
        "submission",
        submission_id,
        {"status": payload.status},
        getattr(request.state, "request_id", None),
    )
    return success({"status": payload.status})


@router.post("/admin/submissions/{submission_id}/assign")
async def lead_assign(
    submission_id: str,
    payload: LeadAssignWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("submissions.assign", True)),
):
    if payload.assigneeId and not request.app.state.services.admin.repository.admin_exists(payload.assigneeId):
        raise DomainError(422, "ASSIGNEE_INVALID", "Assignee must be an active admin user.")
    if not request.app.state.services.admin.repository.update_lead(
        submission_id, identity["id"], assignee=payload.assigneeId or ""
    ):
        raise DomainError(404, "SUBMISSION_NOT_FOUND", "Submission was not found.")
    request.app.state.services.admin.repository.audit(
        identity["id"],
        "submission.assign",
        "submission",
        submission_id,
        {"assigneeId": payload.assigneeId},
        getattr(request.state, "request_id", None),
    )
    return success({"assignedTo": payload.assigneeId})


@router.post("/admin/submissions/{submission_id}/activities")
async def lead_note(
    submission_id: str,
    payload: LeadNoteWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("submissions.write", True)),
):
    if not request.app.state.services.admin.repository.update_lead(submission_id, identity["id"], note=payload.note):
        raise DomainError(404, "SUBMISSION_NOT_FOUND", "Submission was not found.")
    return success({"created": True})


@router.post("/admin/submissions/export")
async def export_leads(request: Request, identity: dict[str, Any] = Depends(require("submissions.export", True))):
    retention_days, export_limit = 365, 1000
    items = request.app.state.services.admin.repository.list_leads_for_export(retention_days, export_limit)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "kind", "status", "name", "email", "phone", "createdAt"])
    for item in items:
        payload = item["payload"]
        writer.writerow(
            [
                item["id"],
                item["kind"],
                item["status"],
                payload.get("name", ""),
                payload.get("email", ""),
                payload.get("phone", ""),
                item["created_at"].isoformat(),
            ]
        )
    request.app.state.services.admin.repository.audit(
        identity["id"],
        "submission.export",
        "submission",
        None,
        {"count": len(items), "retentionDays": retention_days, "limit": export_limit},
        getattr(request.state, "request_id", None),
    )
    return Response(
        output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=senova-leads.csv"},
    )


@router.get("/admin/dashboard")
async def dashboard(
    request: Request,
    fromDate: datetime | None = None,
    toDate: datetime | None = None,
    timezone: str = "UTC",
    productSlug: str | None = None,
    source: str | None = None,
    _: dict[str, Any] = Depends(require("analytics.read")),
):
    try:
        zone = ZoneInfo(timezone)
    except ZoneInfoNotFoundError as exc:
        raise DomainError(422, "VALIDATION_ERROR", "Timezone is invalid.") from exc

    def normalized(value: datetime | None) -> datetime | None:
        if value is None:
            return None
        return (value.replace(tzinfo=zone) if value.tzinfo is None else value).astimezone(UTC)

    start, end = normalized(fromDate), normalized(toDate)
    if start and end and start >= end:
        raise DomainError(422, "VALIDATION_ERROR", "fromDate must be before toDate.")
    database_timezone = POSTGRES_TIMEZONE_ALIASES.get(timezone, timezone)
    result = request.app.state.services.admin.repository.dashboard(start, end, database_timezone, productSlug, source)
    result["range"] = {
        "fromDate": start.isoformat() if start else None,
        "toDate": end.isoformat() if end else None,
        "timezone": timezone,
    }
    return success(result)


@router.get("/admin/audit-logs")
async def audit_logs(request: Request, limit: int = 50, _: dict[str, Any] = Depends(require("audit.read"))):
    return success(request.app.state.services.admin.repository.list_audit(min(max(limit, 1), 200)))

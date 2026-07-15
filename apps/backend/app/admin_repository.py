# ruff: noqa: E501
from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

from sqlalchemy import Engine, text

PERMISSION_CODES = (
    "catalog.read",
    "catalog.write",
    "catalog.publish",
    "qr.read",
    "qr.manage",
    "submissions.read",
    "submissions.write",
    "submissions.assign",
    "submissions.export",
    "analytics.read",
    "audit.read",
    "sessions.revoke",
    "content.read",
    "content.write",
    "content.review",
    "content.publish",
    "content.unpublish",
)


class AdminRepository:
    def __init__(self, engine: Engine | Any):
        self._engine_source = engine

    @property
    def engine(self) -> Engine:
        return self._engine_source if isinstance(self._engine_source, Engine) else self._engine_source.engine

    def bootstrap_admin(self, email: str, name: str, password_hash: str) -> str:
        now, user_id, role_id = datetime.now(UTC), str(uuid4()), str(uuid4())
        with self.engine.begin() as db:
            for code in PERMISSION_CODES:
                db.execute(
                    text("INSERT INTO permissions(id,code) VALUES (:id,:code) ON CONFLICT(code) DO NOTHING"),
                    {"id": str(uuid4()), "code": code},
                )
            db.execute(
                text(
                    "INSERT INTO roles(id,code,name,is_system) VALUES (:id,'administrator','Administrator',true) ON CONFLICT(code) DO NOTHING"
                ),
                {"id": role_id},
            )
            role_id = db.execute(text("SELECT id FROM roles WHERE code='administrator'")).scalar_one()
            db.execute(
                text(
                    "INSERT INTO role_permissions(role_id,permission_id) SELECT :role,id FROM permissions ON CONFLICT DO NOTHING"
                ),
                {"role": role_id},
            )
            existing = db.execute(
                text("SELECT id FROM admin_users WHERE email=:email"), {"email": email}
            ).scalar_one_or_none()
            if existing:
                return str(existing)
            db.execute(
                text(
                    "INSERT INTO admin_users(id,email,name,password_hash,status,created_at,updated_at) VALUES (:id,:email,:name,:password,'active',:now,:now)"
                ),
                {"id": user_id, "email": email, "name": name, "password": password_hash, "now": now},
            )
            db.execute(
                text("INSERT INTO admin_user_roles(user_id,role_id,granted_at) VALUES (:user,:role,:now)"),
                {"user": user_id, "role": role_id, "now": now},
            )
        return user_id

    def identity_by_email(self, email: str) -> dict[str, Any] | None:
        return self._identity("u.email=:value", email)

    def identity_by_session(self, token_hash: str) -> dict[str, Any] | None:
        return self._identity(
            "s.token_hash=:value AND s.revoked_at IS NULL AND s.expires_at > now()", token_hash, session=True
        )

    def _identity(self, condition: str, value: str, session: bool = False) -> dict[str, Any] | None:
        join = "JOIN admin_sessions s ON s.user_id=u.id" if session else ""
        sql = f"""SELECT u.id,u.email,u.name,u.password_hash,u.status,u.failed_login_count,u.locked_until,
            COALESCE(array_agg(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL), ARRAY[]::varchar[]) permissions,
            COALESCE(array_agg(DISTINCT r.code) FILTER (WHERE r.code IS NOT NULL), ARRAY[]::varchar[]) roles
            FROM admin_users u {join} LEFT JOIN admin_user_roles ur ON ur.user_id=u.id LEFT JOIN roles r ON r.id=ur.role_id LEFT JOIN role_permissions rp ON rp.role_id=ur.role_id
            LEFT JOIN permissions p ON p.id=rp.permission_id WHERE {condition}
            GROUP BY u.id,u.email,u.name,u.password_hash,u.status,u.failed_login_count,u.locked_until"""
        with self.engine.connect() as db:
            row = db.execute(text(sql), {"value": value}).mappings().first()
        return dict(row) if row else None

    def login_failed(self, user_id: str) -> None:
        with self.engine.begin() as db:
            db.execute(
                text(
                    "UPDATE admin_users SET failed_login_count=failed_login_count+1, locked_until=CASE WHEN failed_login_count+1>=5 THEN now()+interval '15 minutes' ELSE locked_until END WHERE id=:id"
                ),
                {"id": user_id},
            )

    def login_succeeded(self, user_id: str) -> None:
        with self.engine.begin() as db:
            db.execute(
                text("UPDATE admin_users SET failed_login_count=0,locked_until=NULL,last_login_at=now() WHERE id=:id"),
                {"id": user_id},
            )

    def create_session(self, user_id: str, token_hash: str, csrf_hash: str) -> None:
        with self.engine.begin() as db:
            db.execute(
                text(
                    "INSERT INTO admin_sessions(id,user_id,token_hash,csrf_hash,expires_at,created_at) VALUES (:id,:user,:token,:csrf,:expires,:now)"
                ),
                {
                    "id": str(uuid4()),
                    "user": user_id,
                    "token": token_hash,
                    "csrf": csrf_hash,
                    "expires": datetime.now(UTC) + timedelta(hours=8),
                    "now": datetime.now(UTC),
                },
            )

    def session_csrf_hash(self, token_hash: str) -> str | None:
        with self.engine.connect() as db:
            return db.execute(
                text(
                    "SELECT csrf_hash FROM admin_sessions WHERE token_hash=:token AND revoked_at IS NULL AND expires_at>now()"
                ),
                {"token": token_hash},
            ).scalar_one_or_none()

    def revoke_session(self, token_hash: str) -> None:
        with self.engine.begin() as db:
            db.execute(
                text("UPDATE admin_sessions SET revoked_at=now() WHERE token_hash=:token"), {"token": token_hash}
            )

    def revoke_user_sessions(self, user_id: str) -> None:
        with self.engine.begin() as db:
            db.execute(
                text("UPDATE admin_sessions SET revoked_at=now() WHERE user_id=:id AND revoked_at IS NULL"),
                {"id": user_id},
            )

    def create_reset_token(self, user_id: str, token_hash: str) -> None:
        with self.engine.begin() as db:
            db.execute(
                text(
                    "INSERT INTO password_reset_tokens(id,user_id,token_hash,expires_at,created_at) VALUES (:id,:user,:token,:expires,:now)"
                ),
                {
                    "id": str(uuid4()),
                    "user": user_id,
                    "token": token_hash,
                    "expires": datetime.now(UTC) + timedelta(minutes=30),
                    "now": datetime.now(UTC),
                },
            )

    def consume_reset_token(self, token_hash: str, password_hash: str) -> str | None:
        with self.engine.begin() as db:
            user_id = db.execute(
                text(
                    "UPDATE password_reset_tokens SET used_at=now() WHERE token_hash=:token AND used_at IS NULL AND expires_at>now() RETURNING user_id"
                ),
                {"token": token_hash},
            ).scalar_one_or_none()
            if user_id:
                db.execute(
                    text(
                        "UPDATE admin_users SET password_hash=:password,updated_at=now(),failed_login_count=0,locked_until=NULL WHERE id=:id"
                    ),
                    {"password": password_hash, "id": user_id},
                )
                db.execute(
                    text("UPDATE password_reset_tokens SET used_at=now() WHERE user_id=:id AND used_at IS NULL"),
                    {"id": user_id},
                )
            return str(user_id) if user_id else None

    def audit(
        self,
        actor_id: str | None,
        action: str,
        target_type: str,
        target_id: str | None,
        summary: dict[str, Any],
        request_id: str | None,
    ) -> None:
        with self.engine.begin() as db:
            db.execute(
                text(
                    "INSERT INTO audit_logs(id,actor_id,action,target_type,target_id,summary,request_id,created_at) VALUES (:id,:actor,:action,:type,:target,CAST(:summary AS jsonb),:request,:now)"
                ),
                {
                    "id": str(uuid4()),
                    "actor": actor_id,
                    "action": action,
                    "type": target_type,
                    "target": target_id,
                    "summary": __import__("json").dumps(summary),
                    "request": request_id,
                    "now": datetime.now(UTC),
                },
            )

    def list_products(self) -> list[dict[str, Any]]:
        with self.engine.connect() as db:
            return [
                dict(row)
                for row in db.execute(
                    text("SELECT id,slug,name,status,data,version,updated_at FROM products ORDER BY created_at")
                ).mappings()
            ]

    def get_product(self, product_id: str) -> dict[str, Any] | None:
        with self.engine.connect() as db:
            row = (
                db.execute(
                    text("SELECT id,slug,name,status,data,version,updated_at FROM products WHERE id=:id"),
                    {"id": product_id},
                )
                .mappings()
                .first()
            )
        return dict(row) if row else None

    def save_product(
        self, product_id: str, data: dict[str, Any], expected_version: int | None
    ) -> dict[str, Any] | None:
        import json

        with self.engine.begin() as db:
            if expected_version is None:
                row = (
                    db.execute(
                        text(
                            "INSERT INTO products(id,slug,name,status,data,version,created_at,updated_at) VALUES (:id,:slug,:name,:status,CAST(:data AS jsonb),1,now(),now()) RETURNING id,version"
                        ),
                        {
                            "id": product_id,
                            "slug": data["slug"],
                            "name": data["name"],
                            "status": data.get("status", "draft"),
                            "data": json.dumps(data),
                        },
                    )
                    .mappings()
                    .first()
                )
            else:
                row = (
                    db.execute(
                        text(
                            "UPDATE products SET slug=:slug,name=:name,status=:status,data=CAST(:data AS jsonb),version=version+1,updated_at=now() WHERE id=:id AND version=:version RETURNING id,version"
                        ),
                        {
                            "id": product_id,
                            "slug": data["slug"],
                            "name": data["name"],
                            "status": data["status"],
                            "data": json.dumps(data),
                            "version": expected_version,
                        },
                    )
                    .mappings()
                    .first()
                )
        return dict(row) if row else None

    def admin_exists(self, user_id: str) -> bool:
        with self.engine.connect() as db:
            return bool(
                db.execute(
                    text("SELECT 1 FROM admin_users WHERE id=:id AND status='active'"), {"id": user_id}
                ).scalar_one_or_none()
            )

    def set_product_status(self, product_id: str, status: str, expected_version: int) -> bool:
        with self.engine.begin() as db:
            return bool(
                db.execute(
                    text(
                        "UPDATE products SET status=:status,data=jsonb_set(data,'{status}',to_jsonb(CAST(:json_status AS text))),version=version+1,updated_at=now() WHERE id=:id AND version=:version"
                    ),
                    {"id": product_id, "status": status, "json_status": status, "version": expected_version},
                ).rowcount
            )

    def list_qr(self) -> list[dict[str, Any]]:
        with self.engine.connect() as db:
            return [
                dict(row)
                for row in db.execute(
                    text("SELECT code,data,version,updated_at FROM qr_records ORDER BY created_at DESC")
                ).mappings()
            ]

    def save_qr(self, code: str, data: dict[str, Any], expected_version: int | None) -> bool:
        import json

        with self.engine.begin() as db:
            if expected_version is None:
                result = db.execute(
                    text(
                        "INSERT INTO qr_records(code,product_id,data,version,created_at,updated_at) VALUES (:code,:product,CAST(:data AS jsonb),1,now(),now()) ON CONFLICT DO NOTHING"
                    ),
                    {"code": code, "product": data.get("productSlug"), "data": json.dumps(data)},
                )
            else:
                result = db.execute(
                    text(
                        "UPDATE qr_records SET product_id=:product,data=CAST(:data AS jsonb),version=version+1,updated_at=now() WHERE code=:code AND version=:version"
                    ),
                    {
                        "code": code,
                        "product": data.get("productSlug"),
                        "data": json.dumps(data),
                        "version": expected_version,
                    },
                )
            return bool(result.rowcount)

    def list_leads(
        self, status: str | None, kind: str | None, page: int, size: int
    ) -> tuple[list[dict[str, Any]], int]:
        clauses: list[str] = []
        params: dict[str, Any] = {"limit": size, "offset": (page - 1) * size}
        if status:
            clauses.append("status=:status")
            params["status"] = status
        if kind:
            clauses.append("kind=:kind")
            params["kind"] = kind
        where = "WHERE " + " AND ".join(clauses) if clauses else ""
        with self.engine.connect() as db:
            total = db.execute(text(f"SELECT count(*) FROM submissions {where}"), params).scalar_one()
            rows = db.execute(
                text(
                    f"SELECT id,kind,status,payload,assigned_to,created_at,updated_at FROM submissions {where} ORDER BY created_at DESC LIMIT :limit OFFSET :offset"
                ),
                params,
            ).mappings()
            return [dict(row) for row in rows], total

    def list_leads_for_export(self, retention_days: int = 365, limit: int = 1000) -> list[dict[str, Any]]:
        with self.engine.connect() as db:
            rows = db.execute(
                text(
                    "SELECT id,kind,status,payload,created_at FROM submissions "
                    "WHERE created_at >= now() - make_interval(days => :days) "
                    "ORDER BY created_at DESC LIMIT :limit"
                ),
                {"days": retention_days, "limit": limit},
            ).mappings()
            return [dict(row) for row in rows]

    def get_lead(self, submission_id: str) -> dict[str, Any] | None:
        with self.engine.connect() as db:
            row = (
                db.execute(
                    text(
                        "SELECT id,kind,status,payload,assigned_to,created_at,updated_at FROM submissions WHERE id=:id"
                    ),
                    {"id": submission_id},
                )
                .mappings()
                .first()
            )
            if not row:
                return None
            result = dict(row)
            result["activities"] = [
                dict(item)
                for item in db.execute(
                    text(
                        "SELECT id,activity_type,from_status,to_status,note,actor_id,created_at FROM lead_activities WHERE submission_id=:id ORDER BY created_at DESC"
                    ),
                    {"id": submission_id},
                ).mappings()
            ]
            return result

    def update_lead(
        self,
        submission_id: str,
        actor_id: str,
        status: str | None = None,
        assignee: str | None = None,
        note: str | None = None,
    ) -> bool:
        with self.engine.begin() as db:
            current = db.execute(
                text("SELECT status FROM submissions WHERE id=:id FOR UPDATE"), {"id": submission_id}
            ).scalar_one_or_none()
            if current is None:
                return False
            if status:
                db.execute(
                    text("UPDATE submissions SET status=:status,updated_at=now() WHERE id=:id"),
                    {"status": status, "id": submission_id},
                )
            if assignee is not None:
                db.execute(
                    text("UPDATE submissions SET assigned_to=:assignee,updated_at=now() WHERE id=:id"),
                    {"assignee": assignee or None, "id": submission_id},
                )
            activity_type = "note" if note else "status_change" if status else "assignment"
            db.execute(
                text(
                    "INSERT INTO lead_activities(id,submission_id,actor_id,activity_type,from_status,to_status,note,created_at) VALUES (:id,:submission,:actor,:type,:from_status,:to_status,:note,now())"
                ),
                {
                    "id": str(uuid4()),
                    "submission": submission_id,
                    "actor": actor_id,
                    "type": activity_type,
                    "from_status": current if status else None,
                    "to_status": status,
                    "note": note,
                },
            )
            return True

    def dashboard(self, start: datetime | None = None, end: datetime | None = None) -> dict[str, Any]:
        clauses: list[str] = []
        params: dict[str, Any] = {}
        if start:
            clauses.append("created_at >= :start")
            params["start"] = start
        if end:
            clauses.append("created_at < :end")
            params["end"] = end
        where = "WHERE " + " AND ".join(clauses) if clauses else ""
        open_where = f"{where} {'AND' if where else 'WHERE'} status<>'closed'"
        with self.engine.connect() as db:
            return {
                "products": db.execute(text("SELECT count(*) FROM products WHERE status='active'")).scalar_one(),
                "qrRecords": db.execute(
                    text("SELECT count(*) FROM qr_records WHERE data->>'status'='active'")
                ).scalar_one(),
                "openLeads": db.execute(text(f"SELECT count(*) FROM submissions {open_where}"), params).scalar_one(),
                "submissionsByStatus": {
                    row[0]: row[1]
                    for row in db.execute(
                        text(f"SELECT status,count(*) FROM submissions {where} GROUP BY status"), params
                    )
                },
            }

    def list_audit(self, limit: int) -> list[dict[str, Any]]:
        with self.engine.connect() as db:
            return [
                dict(row)
                for row in db.execute(
                    text(
                        "SELECT id,actor_id,action,target_type,target_id,summary,request_id,created_at FROM audit_logs ORDER BY created_at DESC LIMIT :limit"
                    ),
                    {"limit": limit},
                ).mappings()
            ]

from __future__ import annotations

from copy import deepcopy
from typing import Any

from sqlalchemy import Engine, select, text
from sqlalchemy.dialects.postgresql import insert

from app.db.schema import (
    analytics_events,
    products,
    qr_batch_overrides,
    qr_experience_contents,
    qr_records,
    submissions,
)
from app.db.session import get_engine


class SqlAlchemyRepository:
    def __init__(self, engine: Engine | None = None):
        self._engine = engine

    @property
    def engine(self) -> Engine:
        if self._engine is None:
            self._engine = get_engine()
        return self._engine

    def initialize(self) -> None:
        """Verify connectivity only. Schema changes are exclusively owned by Alembic."""
        with self.engine.connect() as connection:
            connection.execute(text("SELECT 1"))

    def insert_submission(self, entry: dict[str, Any], idempotency_key: str | None):
        values = {
            "id": entry["id"],
            "kind": entry["kind"],
            "payload": entry["payload"],
            "status": entry["status"],
            "idempotency_key": idempotency_key,
            "created_at": entry["createdAt"],
            "updated_at": entry["updatedAt"],
        }
        statement = insert(submissions).values(**values)
        if idempotency_key:
            statement = statement.on_conflict_do_nothing(index_elements=[submissions.c.idempotency_key])
        with self.engine.begin() as connection:
            row = connection.execute(statement.returning(*submissions.c)).mappings().first()
            if row:
                return _submission(dict(row)), True
            existing = (
                connection.execute(select(submissions).where(submissions.c.idempotency_key == idempotency_key))
                .mappings()
                .one()
            )
            return _submission(dict(existing)), False

    def get_submission(self, submission_id: str):
        with self.engine.connect() as connection:
            row = connection.execute(select(submissions).where(submissions.c.id == submission_id)).mappings().first()
        return _submission(dict(row)) if row else None

    def insert_analytics_event(self, entry: dict[str, Any]) -> None:
        with self.engine.begin() as connection:
            connection.execute(
                insert(analytics_events).values(
                    id=entry["id"], event_name=entry["eventName"], data=entry, created_at=entry["createdAt"]
                )
            )

    def list(self, published_only: bool = False) -> list[dict[str, Any]]:
        statement = select(products.c.data).order_by(products.c.created_at)
        if published_only:
            statement = statement.where(products.c.status == "active")
        with self.engine.connect() as connection:
            rows = connection.execute(statement).scalars().all()
        return deepcopy(list(rows))

    def get(self, slug_or_id: str, published_only: bool = False) -> dict[str, Any] | None:
        normalized = slug_or_id.strip().lower()
        statement = select(products.c.data).where((products.c.slug == normalized) | (products.c.id == normalized))
        if published_only:
            statement = statement.where(products.c.status == "active")
        with self.engine.connect() as connection:
            value = connection.execute(statement).scalar_one_or_none()
        return deepcopy(value) if value else None

    def get_record(self, code: str) -> dict[str, Any] | None:
        with self.engine.connect() as connection:
            value = connection.execute(
                select(qr_records.c.data).where(qr_records.c.code == code.strip().upper())
            ).scalar_one_or_none()
        return deepcopy(value) if value else None

    def get_content(self, slug: str, version: str, locale: str) -> dict[str, Any] | None:
        with self.engine.connect() as connection:
            value = connection.execute(
                select(qr_experience_contents.c.data).where(
                    qr_experience_contents.c.product_id == slug,
                    qr_experience_contents.c.version == version,
                    qr_experience_contents.c.locale == locale,
                )
            ).scalar_one_or_none()
        return deepcopy(value) if value else None

    def get_override(self, batch: str | None, slug: str, version: str) -> dict[str, Any] | None:
        if not batch:
            return None
        with self.engine.connect() as connection:
            value = connection.execute(
                select(qr_batch_overrides.c.data).where(
                    qr_batch_overrides.c.batch_code == batch.strip().upper(),
                    qr_batch_overrides.c.product_id == slug,
                    qr_batch_overrides.c.content_version == version,
                )
            ).scalar_one_or_none()
        return deepcopy(value) if value else None


def _submission(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "kind": row["kind"],
        "payload": row["payload"],
        "status": row["status"],
        "createdAt": row["created_at"].isoformat(),
        "updatedAt": row["updated_at"].isoformat(),
    }


PsycopgRepository = SqlAlchemyRepository

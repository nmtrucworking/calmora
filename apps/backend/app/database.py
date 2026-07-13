from __future__ import annotations

import os
from typing import Any

import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb


def database_url() -> str:
    url = os.getenv("DATABASE_URL", "").strip()
    if not url:
        raise RuntimeError("DATABASE_URL is required")
    if url.startswith("postgres://"):
        url = f"postgresql://{url[len('postgres://') :]}"
    if not url.startswith(("postgresql://", "postgresql+psycopg://")):
        raise RuntimeError("DATABASE_URL must be a PostgreSQL connection URL")
    return url.replace("postgresql+psycopg://", "postgresql://", 1)


def connect() -> psycopg.Connection[dict[str, Any]]:
    return psycopg.connect(database_url(), row_factory=dict_row, connect_timeout=10)


def initialize_database() -> None:
    with connect() as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS submissions (
                id TEXT PRIMARY KEY,
                kind TEXT NOT NULL,
                payload JSONB NOT NULL,
                status TEXT NOT NULL DEFAULT 'new',
                idempotency_key TEXT UNIQUE,
                created_at TIMESTAMPTZ NOT NULL,
                updated_at TIMESTAMPTZ NOT NULL,
                CONSTRAINT submissions_status_check
                    CHECK (status IN ('new', 'in_progress', 'resolved', 'rejected'))
            )
            """
        )
        db.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_submissions_kind_created_at
            ON submissions(kind, created_at DESC)
            """
        )
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS analytics_events (
                id TEXT PRIMARY KEY,
                event_name TEXT NOT NULL,
                data JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL
            )
            """
        )
        db.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_analytics_event_created_at
            ON analytics_events(event_name, created_at DESC)
            """
        )


def insert_submission(entry: dict[str, Any], idempotency_key: str | None) -> tuple[dict[str, Any], bool]:
    with connect() as db:
        row = db.execute(
            """
            INSERT INTO submissions
                (id, kind, payload, status, idempotency_key, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (idempotency_key) DO NOTHING
            RETURNING id, kind, payload, status, created_at, updated_at
            """,
            (
                entry["id"],
                entry["kind"],
                Jsonb(entry["payload"]),
                entry["status"],
                idempotency_key,
                entry["createdAt"],
                entry["updatedAt"],
            ),
        ).fetchone()

        if row:
            return _submission_from_row(row), True

        existing = db.execute(
            """
            SELECT id, kind, payload, status, created_at, updated_at
            FROM submissions
            WHERE idempotency_key = %s
            """,
            (idempotency_key,),
        ).fetchone()
        if not existing:
            raise RuntimeError("Unable to resolve idempotent submission")
        return _submission_from_row(existing), False


def get_submission(submission_id: str) -> dict[str, Any] | None:
    with connect() as db:
        row = db.execute(
            """
            SELECT id, kind, payload, status, created_at, updated_at
            FROM submissions
            WHERE id = %s
            """,
            (submission_id,),
        ).fetchone()
    return _submission_from_row(row) if row else None


def insert_analytics_event(entry: dict[str, Any]) -> None:
    with connect() as db:
        db.execute(
            """
            INSERT INTO analytics_events (id, event_name, data, created_at)
            VALUES (%s, %s, %s, %s)
            """,
            (entry["id"], entry["eventName"], Jsonb(entry), entry["createdAt"]),
        )


def _submission_from_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "kind": row["kind"],
        "payload": row["payload"],
        "status": row["status"],
        "createdAt": row["created_at"].isoformat(),
        "updatedAt": row["updated_at"].isoformat(),
    }

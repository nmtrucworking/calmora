from __future__ import annotations

import json
import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator


def database_path() -> Path:
    url = os.getenv("DATABASE_URL", "sqlite:///./data/senova.db")
    prefix = "sqlite:///"
    if not url.startswith(prefix):
        raise RuntimeError("Only sqlite:/// DATABASE_URL values are supported by the current backend")

    raw_path = url[len(prefix) :]
    path = Path(raw_path)
    if not path.is_absolute():
        path = Path(__file__).resolve().parents[1] / path
    return path.resolve()


@contextmanager
def connection() -> Iterator[sqlite3.Connection]:
    path = database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path, timeout=10)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA foreign_keys=ON")
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def initialize_database() -> None:
    with connection() as db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS submissions (
                id TEXT PRIMARY KEY,
                kind TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'new',
                idempotency_key TEXT UNIQUE,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_submissions_kind_created_at
            ON submissions(kind, created_at DESC);

            CREATE TABLE IF NOT EXISTS analytics_events (
                id TEXT PRIMARY KEY,
                event_name TEXT NOT NULL,
                data_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_analytics_event_created_at
            ON analytics_events(event_name, created_at DESC);
            """
        )


def insert_submission(entry: dict[str, Any], idempotency_key: str | None) -> tuple[dict[str, Any], bool]:
    with connection() as db:
        # Serialize the lookup + insert so concurrent retries cannot create two rows.
        db.execute("BEGIN IMMEDIATE")
        if idempotency_key:
            existing = db.execute(
                "SELECT * FROM submissions WHERE idempotency_key = ?", (idempotency_key,)
            ).fetchone()
            if existing:
                return _submission_from_row(existing), False

        db.execute(
            """
            INSERT INTO submissions
                (id, kind, payload_json, status, idempotency_key, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                entry["id"],
                entry["kind"],
                json.dumps(entry["payload"], ensure_ascii=False),
                entry["status"],
                idempotency_key,
                entry["createdAt"],
                entry["updatedAt"],
            ),
        )
        return entry, True


def get_submission(submission_id: str) -> dict[str, Any] | None:
    with connection() as db:
        row = db.execute("SELECT * FROM submissions WHERE id = ?", (submission_id,)).fetchone()
    return _submission_from_row(row) if row else None


def insert_analytics_event(entry: dict[str, Any]) -> None:
    with connection() as db:
        db.execute(
            "INSERT INTO analytics_events (id, event_name, data_json, created_at) VALUES (?, ?, ?, ?)",
            (
                entry["id"],
                entry["eventName"],
                json.dumps(entry, ensure_ascii=False),
                entry["createdAt"],
            ),
        )


def _submission_from_row(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "kind": row["kind"],
        "payload": json.loads(row["payload_json"]),
        "status": row["status"],
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }

from __future__ import annotations

from typing import Any

from app import database


class PsycopgRepository:
    def initialize(self) -> None:
        database.initialize_database()

    def insert_submission(self, entry: dict[str, Any], idempotency_key: str | None):
        return database.insert_submission(entry, idempotency_key)

    def get_submission(self, submission_id: str):
        return database.get_submission(submission_id)

    def insert_analytics_event(self, entry: dict[str, Any]) -> None:
        database.insert_analytics_event(entry)

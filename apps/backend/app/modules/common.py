from __future__ import annotations

import re
from datetime import UTC, datetime
from typing import Any


def now_utc() -> datetime:
    return datetime.now(UTC)


def parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)


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

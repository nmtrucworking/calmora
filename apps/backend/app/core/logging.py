from __future__ import annotations

import json
import logging
from datetime import UTC, datetime
from typing import Any

REDACTED_KEYS = {"authorization", "cookie", "email", "name", "password", "payload", "phone", "token"}


def redact(value: Any, key: str | None = None) -> Any:
    if key and key.lower() in REDACTED_KEYS:
        return "[REDACTED]"
    if isinstance(value, dict):
        return {item_key: redact(item, item_key) for item_key, item in value.items()}
    if isinstance(value, list):
        return [redact(item) for item in value]
    return value


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        data: dict[str, Any] = {
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        for key in ("request_id", "method", "path", "status_code", "duration_ms", "client_ip"):
            value = getattr(record, key, None)
            if value is not None:
                data[key] = value
        if record.exc_info:
            data["exception"] = record.exc_info[0].__name__ if record.exc_info[0] else "Exception"
        return json.dumps(redact(data), ensure_ascii=False, default=str)


def configure_logging(level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger("senova.api")
    logger.setLevel(level.upper())
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JsonFormatter())
        logger.addHandler(handler)
    logger.propagate = False
    return logger

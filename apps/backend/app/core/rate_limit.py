from __future__ import annotations

import time

from app.core.errors import DomainError


class InMemoryRateLimiter:
    """Single-instance limiter. Replace with a shared store before scale-out."""

    def __init__(self) -> None:
        self._buckets: dict[str, list[float]] = {}

    def clear(self) -> None:
        self._buckets.clear()

    def check(self, key: str, limit: int, window_seconds: int = 60) -> None:
        now = time.monotonic()
        bucket = [timestamp for timestamp in self._buckets.get(key, []) if now - timestamp < window_seconds]
        if len(bucket) >= limit:
            raise DomainError(429, "RATE_LIMITED", "Too many requests. Please try again later.")
        bucket.append(now)
        self._buckets[key] = bucket

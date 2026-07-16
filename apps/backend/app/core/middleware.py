from __future__ import annotations

import re
import time
from collections.abc import Awaitable, Callable
from uuid import uuid4

from fastapi import Request, Response
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from app.core.config import Settings

REQUEST_ID_PATTERN = re.compile(r"^[A-Za-z0-9._:-]{8,128}$")


class PayloadLimitMiddleware:
    def __init__(self, app: ASGIApp, max_bytes: int):
        self.app = app
        self.max_bytes = max_bytes

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        content_length = next(
            (value for key, value in scope.get("headers", []) if key.lower() == b"content-length"), None
        )
        if content_length:
            try:
                too_large = int(content_length) > self.max_bytes
            except ValueError:
                too_large = True
            if too_large:
                response = Response(
                    content=(
                        '{"success":false,"error":{"code":"PAYLOAD_TOO_LARGE","message":"Request body is too large."}}'
                    ),
                    status_code=413,
                    media_type="application/json",
                )
                await response(scope, receive, send)
                return

        consumed = 0

        async def limited_receive() -> Message:
            nonlocal consumed
            message = await receive()
            if message["type"] == "http.request":
                consumed += len(message.get("body", b""))
                if consumed > self.max_bytes:
                    return {"type": "http.disconnect"}
            return message

        await self.app(scope, limited_receive, send)


def install_request_middleware(
    app: ASGIApp, settings: Settings
) -> Callable[[Request, Callable[[Request], Awaitable[Response]]], Awaitable[Response]]:
    async def request_context(request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        supplied_id = request.headers.get("x-request-id", "")
        request_id = supplied_id if REQUEST_ID_PATTERN.fullmatch(supplied_id) else uuid4().hex
        request.state.request_id = request_id
        started = time.perf_counter()
        response = await call_next(request)
        duration_ms = round((time.perf_counter() - started) * 1000, 2)
        response.headers["X-Request-ID"] = request_id
        peer = request.client.host if request.client else "unknown"
        forwarded = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        client_ip = forwarded if peer in settings.trusted_proxies and forwarded else peer
        request.app.state.logger.info(
            "request_completed",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "duration_ms": duration_ms,
                "client_ip": client_ip,
            },
        )
        return response

    return request_context

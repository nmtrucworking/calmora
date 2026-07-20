from starlette.requests import Request

from app.modules.admin import AdminService, admin_cookie_policy, digest


class SessionRepository:
    def session_csrf_hash(self, token_hash: str) -> str | None:
        return digest("csrf-token") if token_hash == digest("session-token") else None


def cookie_request(session: str = "session-token", csrf: str = "csrf-token") -> Request:
    cookie = f"senova_admin_session={session}; senova_admin_csrf={csrf}".encode()
    return Request({"type": "http", "method": "GET", "path": "/", "headers": [(b"cookie", cookie)]})


def test_production_cookie_policy_supports_cross_site_frontend():
    assert admin_cookie_policy("production") == (True, "none")
    assert admin_cookie_policy("staging") == (True, "none")
    assert admin_cookie_policy("local") == (False, "strict")


def test_csrf_token_can_be_hydrated_from_an_authenticated_session():
    service = AdminService(SessionRepository(), "test")

    assert service.csrf_token(cookie_request()) == "csrf-token"

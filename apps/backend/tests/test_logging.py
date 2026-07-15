from app.core.logging import redact


def test_structured_log_redaction_removes_pii_and_secrets():
    value = redact(
        {
            "request_id": "request-test-001",
            "payload": {"message": "private"},
            "email": "an@example.com",
            "nested": {"phone": "0900000000", "status": "new"},
            "authorization": "Bearer secret",
        }
    )
    assert value == {
        "request_id": "request-test-001",
        "payload": "[REDACTED]",
        "email": "[REDACTED]",
        "nested": {"phone": "[REDACTED]", "status": "new"},
        "authorization": "[REDACTED]",
    }

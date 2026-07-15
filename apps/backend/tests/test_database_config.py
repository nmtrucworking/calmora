from __future__ import annotations

import pytest

from app.core.config import Settings
from app.database import database_url


def test_database_url_accepts_and_normalizes_postgres_alias(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgres://user:password@localhost:5432/senova")
    assert database_url() == "postgresql://user:password@localhost:5432/senova"


def test_database_url_rejects_non_postgresql_url(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "file:///tmp/senova")
    with pytest.raises(RuntimeError, match="PostgreSQL"):
        database_url()


def test_production_settings_fail_fast_without_database():
    with pytest.raises(ValueError, match="DATABASE_URL"):
        Settings(app_env="production", database_url="", receipt_secret="x" * 40)


def test_production_settings_reject_weak_receipt_secret():
    with pytest.raises(ValueError, match="RECEIPT_SECRET"):
        Settings(app_env="production", database_url="postgresql://localhost/senova", receipt_secret="change-me")

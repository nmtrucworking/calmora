from __future__ import annotations

import pytest

from app.database import database_url


def test_database_url_accepts_and_normalizes_postgres_alias(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgres://user:password@localhost:5432/senova")
    assert database_url() == "postgresql://user:password@localhost:5432/senova"


def test_database_url_rejects_non_postgresql_url(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "file:///tmp/senova")
    with pytest.raises(RuntimeError, match="PostgreSQL"):
        database_url()

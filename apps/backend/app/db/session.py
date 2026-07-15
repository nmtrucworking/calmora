from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from functools import lru_cache

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import database_url


def sqlalchemy_url(url: str | None = None) -> str:
    value = url or database_url()
    if value.startswith("postgresql://"):
        return value.replace("postgresql://", "postgresql+psycopg://", 1)
    return value


@lru_cache
def get_engine(url: str | None = None) -> Engine:
    return create_engine(sqlalchemy_url(url), pool_pre_ping=True, pool_recycle=300)


def session_factory(engine: Engine | None = None) -> sessionmaker[Session]:
    return sessionmaker(bind=engine or get_engine(), expire_on_commit=False, autoflush=False)


@contextmanager
def transaction(engine: Engine | None = None) -> Iterator[Session]:
    factory = session_factory(engine)
    with factory.begin() as session:
        yield session


def clear_engine_cache() -> None:
    get_engine.cache_clear()

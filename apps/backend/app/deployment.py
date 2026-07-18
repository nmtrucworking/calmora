from __future__ import annotations

from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import Engine, inspect, text

from app.seed_import import import_seeds

ALEMBIC_INI = Path(__file__).resolve().parents[1] / "alembic.ini"
INITIAL_SCHEMA_LOCK = "senova-initial-schema"


def prepare_initial_database(engine: Engine) -> bool:
    """Initialize a completely empty database before the web app starts."""
    with engine.connect() as connection:
        connection.execute(
            text("SELECT pg_advisory_lock(hashtext(:name))"),
            {"name": INITIAL_SCHEMA_LOCK},
        )
        try:
            if inspect(connection).has_table("permissions"):
                return False
            command.upgrade(Config(str(ALEMBIC_INI)), "head")
            import_seeds()
            return True
        finally:
            connection.execute(
                text("SELECT pg_advisory_unlock(hashtext(:name))"),
                {"name": INITIAL_SCHEMA_LOCK},
            )

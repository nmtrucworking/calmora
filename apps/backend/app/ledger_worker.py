from __future__ import annotations

import argparse
import time

from app.core.config import get_settings
from app.modules.trace import TraceRepository, TraceService
from app.repository import SqlAlchemyRepository


def run_once() -> dict[str, int]:
    settings = get_settings()
    repository = SqlAlchemyRepository()
    repository.initialize()
    return TraceService(TraceRepository(repository), settings).process_outbox()


def main() -> None:
    parser = argparse.ArgumentParser(description="Process Senova ledger outbox jobs")
    parser.add_argument("--once", action="store_true", help="Process one batch and exit")
    parser.add_argument("--interval", type=int, default=30, help="Polling interval in seconds")
    arguments = parser.parse_args()
    while True:
        run_once()
        if arguments.once:
            return
        time.sleep(max(arguments.interval, 5))


if __name__ == "__main__":
    main()

from __future__ import annotations

import getpass
import os

from app.admin_repository import AdminRepository
from app.db.session import get_engine
from app.modules.admin import hasher


def main() -> None:
    email = os.getenv("ADMIN_EMAIL", "").strip().lower() or input("Admin email: ").strip().lower()
    name = os.getenv("ADMIN_NAME", "Senova Administrator").strip()
    password = os.getenv("ADMIN_PASSWORD") or getpass.getpass("Admin password: ")
    if len(password) < 12:
        raise ValueError("Admin password must contain at least 12 characters")
    user_id = AdminRepository(get_engine()).bootstrap_admin(email, name, hasher.hash(password))
    print(f"Admin user ready: {user_id}")


if __name__ == "__main__":
    main()

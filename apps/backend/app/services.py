from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from app.core.config import Settings
from app.core.rate_limit import InMemoryRateLimiter
from app.modules.analytics import AnalyticsService
from app.modules.catalog import CatalogRepository, CatalogService
from app.modules.qr import QrRepository, QrService
from app.modules.submissions import SubmissionService


@dataclass
class Services:
    catalog: CatalogService
    qr: QrService
    submissions: SubmissionService
    analytics: AnalyticsService
    rate_limiter: InMemoryRateLimiter


def build_services(settings: Settings, repository: Any, seed_dir: Path) -> Services:
    catalog_repository = (
        repository if all(hasattr(repository, name) for name in ("list", "get")) else CatalogRepository(seed_dir)
    )
    qr_repository = (
        repository
        if all(hasattr(repository, name) for name in ("get_record", "get_content", "get_override"))
        else QrRepository(seed_dir)
    )
    catalog = CatalogService(catalog_repository)
    analytics = AnalyticsService(repository)
    return Services(
        catalog=catalog,
        qr=QrService(qr_repository, analytics),
        submissions=SubmissionService(repository, catalog, settings.receipt_secret),
        analytics=analytics,
        rate_limiter=InMemoryRateLimiter(),
    )

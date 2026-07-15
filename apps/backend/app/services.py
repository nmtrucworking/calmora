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
    catalog = CatalogService(CatalogRepository(seed_dir))
    analytics = AnalyticsService(repository)
    return Services(
        catalog=catalog,
        qr=QrService(QrRepository(seed_dir), analytics),
        submissions=SubmissionService(repository, catalog, settings.receipt_secret),
        analytics=analytics,
        rate_limiter=InMemoryRateLimiter(),
    )

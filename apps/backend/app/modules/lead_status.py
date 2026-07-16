from __future__ import annotations

from typing import Literal

LeadStatus = Literal["new", "contacted", "qualified", "closed"]

CANONICAL_LEAD_STATUSES: tuple[LeadStatus, ...] = ("new", "contacted", "qualified", "closed")

# Contract for BE-106 data migration. Unknown values must be reported, never silently mapped.
LEGACY_LEAD_STATUS_MAPPING: dict[str, LeadStatus] = {
    "new": "new",
    "in_progress": "contacted",
    "reviewed": "contacted",
    "qualified": "qualified",
    "resolved": "closed",
    "archived": "closed",
    "rejected": "closed",
    "spam": "closed",
}


def canonical_lead_status(value: str) -> LeadStatus:
    try:
        return LEGACY_LEAD_STATUS_MAPPING[value.strip().lower()]
    except KeyError as exc:
        raise ValueError(f"Unknown legacy lead status: {value}") from exc

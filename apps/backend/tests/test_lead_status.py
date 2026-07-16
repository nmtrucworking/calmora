import pytest

from app.modules.lead_status import canonical_lead_status


@pytest.mark.parametrize(
    ("legacy", "canonical"),
    [
        ("new", "new"),
        ("in_progress", "contacted"),
        ("reviewed", "contacted"),
        ("qualified", "qualified"),
        ("resolved", "closed"),
        ("archived", "closed"),
        ("rejected", "closed"),
        ("spam", "closed"),
    ],
)
def test_legacy_lead_status_mapping(legacy, canonical):
    assert canonical_lead_status(legacy) == canonical


def test_unknown_lead_status_is_not_silently_mapped():
    with pytest.raises(ValueError, match="Unknown legacy"):
        canonical_lead_status("mystery")

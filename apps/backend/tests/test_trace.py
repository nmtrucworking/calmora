from __future__ import annotations

import hashlib

from app.ledger import DatabaseLedger, EvmLedger
from app.modules.qr import QrService
from app.modules.trace import PUBLIC_STATUS, canonical_json, sha256_json


class RecordRepository:
    def get_record(self, code: str):
        if code.upper() != "TRACEABC123":
            return None
        return {
            "code": "TRACEABC123",
            "productSlug": "petal-pack",
            "batchCode": "PP-20260721-B01",
            "contentVersion": "v2",
            "flowType": "unit-trace",
            "status": "active",
            "traceUrl": "/trace/TRACEABC123",
        }


class Analytics:
    def store(self, entry):
        del entry


def test_canonical_hash_is_deterministic_and_prefixed():
    first = {"z": [3, 2, 1], "a": {"value": "senova", "nullable": None}}
    second = {"a": {"nullable": None, "value": "senova"}, "z": [3, 2, 1]}
    expected_json = '{"a":{"nullable":null,"value":"senova"},"z":[3,2,1]}'

    assert canonical_json(first) == expected_json
    assert canonical_json(second) == expected_json
    assert sha256_json(first) == f"sha256:{hashlib.sha256(expected_json.encode()).hexdigest()}"


def test_all_internal_unit_states_have_safe_public_copy_status():
    assert set(PUBLIC_STATUS) == {
        "generated",
        "printed",
        "packed",
        "distributed",
        "activated",
        "recheck",
        "suspicious",
        "compromised",
        "recalled",
        "void",
    }
    assert PUBLIC_STATUS["suspicious"][0] == "suspicious"
    assert all("counterfeit" not in message.lower() for _, message in PUBLIC_STATUS.values())


def test_qr_resolver_routes_trace_codes_without_breaking_experience_flow():
    result = QrService(RecordRepository(), Analytics()).resolve("traceabc123")

    assert result["flowType"] == "unit-trace"
    assert result["traceUrl"] == "/trace/TRACEABC123"
    assert result["redirectUrl"] is None


def test_database_ledger_returns_a_confirmed_local_receipt_without_payload_data():
    receipt = DatabaseLedger("database-local").anchor(
        entity_type="unit",
        entity_id="internal-unit-id",
        revision=2,
        root_hash="sha256:" + "a" * 64,
        previous_root_hash=None,
    )

    assert receipt.network == "database-local"
    assert receipt.transaction_id.startswith("db:")
    assert receipt.contract_address is None


def test_evm_adapter_converts_prefixed_sha256_roots_to_bytes32():
    root = "sha256:" + "ab" * 32

    assert EvmLedger._bytes32(root) == bytes.fromhex("ab" * 32)
    assert EvmLedger._bytes32(None) == bytes(32)

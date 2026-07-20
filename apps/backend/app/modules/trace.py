# ruff: noqa: B008
from __future__ import annotations

import csv
import hashlib
import hmac
import io
import json
import secrets
from datetime import UTC, date, datetime, timedelta
from typing import Any, Literal
from urllib.parse import urlparse
from uuid import uuid4

from fastapi import APIRouter, Depends, Header, Request
from pydantic import BaseModel, Field
from sqlalchemy import Engine, func, insert, select, update
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.config import Settings
from app.core.errors import DomainError, success
from app.db.schema import (
    audit_logs,
    ledger_anchors,
    ledger_outbox,
    qr_records,
    trace_activation_attempts,
    trace_batches,
    trace_documents,
    trace_events,
    trace_risk_reviews,
    trace_scan_events,
    trace_units,
)
from app.ledger import build_ledger
from app.modules.admin import require

SCHEMA_VERSION = "trace-bundle-v1"
PUBLIC_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
SECRET_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
PRODUCT_NAMES = {
    "petal-pack": "Senova Petal Pack",
    "classic": "Senova Classic Pack",
    "gift-set": "Senova Gift Set",
}
PUBLIC_STATUS = {
    "generated": ("not-distributed", "UNIT_NOT_DISTRIBUTED"),
    "printed": ("not-distributed", "UNIT_NOT_DISTRIBUTED"),
    "packed": ("not-distributed", "UNIT_NOT_DISTRIBUTED"),
    "distributed": ("valid-unactivated", "UNIT_VALID_NOT_ACTIVATED"),
    "activated": ("activated", "UNIT_ACTIVATED"),
    "recheck": ("recheck", "UNIT_RECHECK_REQUIRED"),
    "suspicious": ("suspicious", "UNIT_SUSPICIOUS"),
    "compromised": ("compromised", "UNIT_CODE_COMPROMISED"),
    "recalled": ("recalled", "UNIT_RECALLED"),
    "void": ("invalid", "UNIT_VOID"),
}
TRANSITIONS = {
    "mark-printed": ("generated", "printed", "printed_at"),
    "mark-packed": ("printed", "packed", "packed_at"),
    "mark-distributed": ("packed", "distributed", "distributed_at"),
}


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def sha256_json(value: Any) -> str:
    return f"sha256:{hashlib.sha256(canonical_json(value).encode('utf-8')).hexdigest()}"


def _iso(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        value = value.astimezone(UTC).replace(microsecond=0)
        return value.isoformat().replace("+00:00", "Z")
    if isinstance(value, date):
        return value.isoformat()
    return str(value)


def _digest(value: str, pepper: str) -> str:
    return hmac.new(pepper.encode(), value.encode(), hashlib.sha256).hexdigest()


def _secret_normalized(value: str) -> str:
    return "".join(char for char in value.upper() if char.isalnum())


def _random_code(length: int) -> str:
    return "".join(secrets.choice(PUBLIC_ALPHABET) for _ in range(length))


def _random_secret() -> str:
    raw = "".join(secrets.choice(SECRET_ALPHABET) for _ in range(12))
    return "-".join(raw[index : index + 4] for index in range(0, 12, 4))


class BatchCreate(BaseModel):
    batchCode: str = Field(min_length=3, max_length=64)
    productSlug: str = Field(min_length=2, max_length=120)
    contentVersion: str | None = Field(default=None, max_length=64)
    productionDate: date | None = None
    packagedAt: datetime | None = None
    bestBefore: date | None = None
    sourceSummary: dict[str, Any] = Field(default_factory=dict)


class EventCreate(BaseModel):
    eventType: str = Field(min_length=3, max_length=64)
    occurredAt: datetime
    locationCode: str | None = Field(default=None, max_length=64)
    actorOrg: str | None = Field(default=None, max_length=128)
    payload: dict[str, Any] = Field(default_factory=dict)
    supersedesEventId: str | None = None


class RecallWrite(BaseModel):
    reasonCode: str = Field(min_length=3, max_length=64)
    publicMessage: str = Field(min_length=3, max_length=2000)
    internalNote: str | None = Field(default=None, max_length=5000)


class IssueWrite(BaseModel):
    quantity: int = Field(ge=1, le=5000)
    codeProfile: str = Field(default="unit-v1", max_length=64)
    exportFormat: Literal["csv"] = "csv"


class TransitionWrite(BaseModel):
    action: Literal["mark-printed", "mark-packed", "mark-distributed"]
    expectedVersion: int = Field(ge=1)


class VoidWrite(BaseModel):
    reason: str = Field(min_length=3, max_length=2000)


class ScanWrite(BaseModel):
    source: str | None = Field(default="qr", max_length=64)
    path: str | None = Field(default=None, max_length=500)
    campaign: str | None = Field(default=None, max_length=100)
    referrer: str | None = Field(default=None, max_length=500)
    clientToken: str | None = Field(default=None, max_length=256)
    regionCode: str | None = Field(default=None, max_length=32)


class ActivationConsent(BaseModel):
    coarseRegion: bool = False


class ActivateWrite(BaseModel):
    secretCode: str = Field(min_length=8, max_length=64)
    clientToken: str | None = Field(default=None, max_length=256)
    regionCode: str | None = Field(default=None, max_length=32)
    consent: ActivationConsent = Field(default_factory=ActivationConsent)


class RiskReviewWrite(BaseModel):
    decision: Literal["clear-false-positive", "confirm-misuse", "mark-recheck"]
    reason: str = Field(min_length=3, max_length=5000)


class TraceRepository:
    def __init__(self, engine: Engine | Any):
        self._engine_source = engine

    @property
    def engine(self) -> Engine:
        return self._engine_source if isinstance(self._engine_source, Engine) else self._engine_source.engine

    @staticmethod
    def _row(row: Any) -> dict[str, Any] | None:
        return dict(row) if row else None

    def get_batch(self, *, batch_id: str | None = None, batch_code: str | None = None) -> dict[str, Any] | None:
        statement = select(trace_batches)
        statement = (
            statement.where(trace_batches.c.id == batch_id)
            if batch_id
            else statement.where(func.upper(trace_batches.c.batch_code) == (batch_code or "").strip().upper())
        )
        with self.engine.connect() as db:
            return self._row(db.execute(statement).mappings().first())

    def get_unit(self, *, unit_id: str | None = None, public_code: str | None = None) -> dict[str, Any] | None:
        statement = select(trace_units)
        statement = (
            statement.where(trace_units.c.id == unit_id)
            if unit_id
            else statement.where(func.upper(trace_units.c.public_code) == (public_code or "").strip().upper())
        )
        with self.engine.connect() as db:
            return self._row(db.execute(statement).mappings().first())

    def create_batch(self, payload: BatchCreate, actor_id: str) -> dict[str, Any]:
        now, batch_id = datetime.now(UTC), str(uuid4())
        values = {
            "id": batch_id,
            "batch_code": payload.batchCode.strip().upper(),
            "product_slug": payload.productSlug.strip().lower(),
            "content_version": payload.contentVersion,
            "status": "draft",
            "production_date": payload.productionDate,
            "packaged_at": payload.packagedAt,
            "best_before": payload.bestBefore,
            "source_summary": payload.sourceSummary,
            "public_visibility": False,
            "revision": 1,
            "version": 1,
            "created_by": actor_id,
            "created_at": now,
            "updated_at": now,
        }
        try:
            with self.engine.begin() as db:
                row = db.execute(insert(trace_batches).values(**values).returning(*trace_batches.c)).mappings().one()
        except Exception as exc:
            if "unique" in str(exc).lower():
                raise DomainError(409, "TRACE_BATCH_EXISTS", "Trace batch code already exists.") from exc
            raise
        return dict(row)

    def add_event(self, batch_id: str, payload: EventCreate, actor_id: str) -> dict[str, Any]:
        batch = self.get_batch(batch_id=batch_id)
        if not batch:
            raise DomainError(404, "TRACE_BATCH_NOT_FOUND", "Trace batch was not found.")
        now, event_id = datetime.now(UTC), str(uuid4())
        values = {
            "id": event_id,
            "entity_type": "batch",
            "entity_id": batch_id,
            "event_type": payload.eventType,
            "status": "approved" if batch["status"] in {"approved", "distributed"} else "draft",
            "occurred_at": payload.occurredAt,
            "recorded_at": now,
            "location_code": payload.locationCode,
            "actor_org": payload.actorOrg,
            "payload_json": payload.payload,
            "payload_hash": sha256_json(payload.payload),
            "supersedes_event_id": payload.supersedesEventId,
            "created_by": actor_id,
            "approved_by": actor_id if batch["status"] in {"approved", "distributed"} else None,
            "approved_at": now if batch["status"] in {"approved", "distributed"} else None,
            "created_at": now,
        }
        with self.engine.begin() as db:
            row = db.execute(insert(trace_events).values(**values).returning(*trace_events.c)).mappings().one()
            db.execute(update(trace_batches).where(trace_batches.c.id == batch_id).values(updated_at=now))
        return dict(row)

    def approve_batch(self, batch_id: str, actor_id: str) -> dict[str, Any]:
        now = datetime.now(UTC)
        with self.engine.begin() as db:
            batch = (
                db.execute(select(trace_batches).where(trace_batches.c.id == batch_id).with_for_update())
                .mappings()
                .first()
            )
            if not batch:
                raise DomainError(404, "TRACE_BATCH_NOT_FOUND", "Trace batch was not found.")
            if batch["status"] in {"approved", "distributed"}:
                return dict(batch)
            event_count = db.execute(
                select(func.count())
                .select_from(trace_events)
                .where(trace_events.c.entity_type == "batch", trace_events.c.entity_id == batch_id)
            ).scalar_one()
            if not batch["production_date"] or event_count == 0:
                raise DomainError(
                    422, "TRACE_REQUIRED_EVENTS_MISSING", "Production date and one trace event are required."
                )
            revision = int(batch["revision"]) + 1
            row = (
                db.execute(
                    update(trace_batches)
                    .where(trace_batches.c.id == batch_id)
                    .values(
                        status="approved",
                        public_visibility=True,
                        approved_by=actor_id,
                        revision=revision,
                        version=trace_batches.c.version + 1,
                        updated_at=now,
                    )
                    .returning(*trace_batches.c)
                )
                .mappings()
                .one()
            )
            db.execute(
                update(trace_events)
                .where(trace_events.c.entity_type == "batch", trace_events.c.entity_id == batch_id)
                .values(status="approved", approved_by=actor_id, approved_at=now)
            )
            self._enqueue(db, "batch", batch_id, revision, now)
            self._audit(db, actor_id, "trace.batch.approved", "trace_batch", batch_id, {"revision": revision}, None)
        return dict(row)

    def recall_batch(self, batch_id: str, payload: RecallWrite, actor_id: str) -> dict[str, Any]:
        now = datetime.now(UTC)
        with self.engine.begin() as db:
            row = (
                db.execute(
                    update(trace_batches)
                    .where(trace_batches.c.id == batch_id, trace_batches.c.status != "void")
                    .values(
                        status="recalled",
                        recall_reason=payload.reasonCode,
                        public_message=payload.publicMessage,
                        revision=trace_batches.c.revision + 1,
                        version=trace_batches.c.version + 1,
                        updated_at=now,
                    )
                    .returning(*trace_batches.c)
                )
                .mappings()
                .first()
            )
            if not row:
                raise DomainError(404, "TRACE_BATCH_NOT_FOUND", "Trace batch was not found.")
            db.execute(
                update(trace_units)
                .where(trace_units.c.batch_id == batch_id, trace_units.c.status != "void")
                .values(status="recalled", version=trace_units.c.version + 1, updated_at=now)
            )
            self._enqueue(db, "batch", batch_id, int(row["revision"]), now)
            self._audit(
                db,
                actor_id,
                "trace.batch.recalled",
                "trace_batch",
                batch_id,
                {"reasonCode": payload.reasonCode, "internalNote": payload.internalNote},
                None,
            )
        return dict(row)

    def issue_units(self, batch_id: str, quantity: int, pepper: str, actor_id: str) -> tuple[list[dict[str, str]], str]:
        batch = self.get_batch(batch_id=batch_id)
        if not batch:
            raise DomainError(404, "TRACE_BATCH_NOT_FOUND", "Trace batch was not found.")
        if batch["status"] not in {"approved", "distributed"}:
            raise DomainError(409, "TRACE_STATE_CONFLICT", "Batch must be approved before issuing units.")
        now, issued = datetime.now(UTC), []
        with self.engine.begin() as db:
            for _ in range(quantity):
                for _attempt in range(10):
                    public_code, secret_code, unit_id = _random_code(12), _random_secret(), str(uuid4())
                    digest = _digest(_secret_normalized(secret_code), pepper)
                    exists = db.execute(
                        select(trace_units.c.id).where(
                            (trace_units.c.public_code == public_code) | (trace_units.c.secret_digest == digest)
                        )
                    ).first()
                    if not exists:
                        break
                else:
                    raise DomainError(503, "TRACE_CODE_GENERATION_FAILED", "Could not allocate unique codes.")
                db.execute(
                    insert(trace_units).values(
                        id=unit_id,
                        batch_id=batch_id,
                        public_code=public_code,
                        secret_digest=digest,
                        status="generated",
                        risk_level="normal",
                        risk_score=0,
                        scan_count=0,
                        unique_client_count=0,
                        version=1,
                        created_at=now,
                        updated_at=now,
                    )
                )
                qr_data = {
                    "code": public_code,
                    "productSlug": batch["product_slug"],
                    "batchCode": batch["batch_code"],
                    "contentVersion": batch["content_version"] or "v1",
                    "flowType": "unit-trace",
                    "status": "active",
                    "traceUrl": f"/trace/{public_code}",
                }
                db.execute(
                    insert(qr_records).values(
                        code=public_code,
                        product_id=batch["product_slug"],
                        flow_type="unit-trace",
                        trace_unit_id=unit_id,
                        trace_batch_id=batch_id,
                        data=qr_data,
                        created_at=now,
                        updated_at=now,
                    )
                )
                issued.append({"unitId": unit_id, "publicCode": public_code, "secretCode": secret_code})
            self._audit(db, actor_id, "trace.units.issued", "trace_batch", batch_id, {"quantity": quantity}, None)
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=("unitId", "publicCode", "secretCode"))
        writer.writeheader()
        writer.writerows(issued)
        return issued, output.getvalue()

    def transition_unit(self, unit_id: str, action: str, expected_version: int, actor_id: str) -> dict[str, Any]:
        source, target, timestamp_column = TRANSITIONS[action]
        now = datetime.now(UTC)
        with self.engine.begin() as db:
            row = (
                db.execute(
                    update(trace_units)
                    .where(
                        trace_units.c.id == unit_id,
                        trace_units.c.status == source,
                        trace_units.c.version == expected_version,
                    )
                    .values(
                        status=target,
                        version=trace_units.c.version + 1,
                        updated_at=now,
                        **{timestamp_column: now},
                    )
                    .returning(*trace_units.c)
                )
                .mappings()
                .first()
            )
            if not row:
                raise DomainError(409, "TRACE_STATE_CONFLICT", "Unit state or version does not allow this transition.")
            self._audit(db, actor_id, f"trace.unit.{target}", "trace_unit", unit_id, {}, None)
        return dict(row)

    def void_unit(self, unit_id: str, reason: str, actor_id: str) -> dict[str, Any]:
        now = datetime.now(UTC)
        with self.engine.begin() as db:
            row = (
                db.execute(
                    update(trace_units)
                    .where(trace_units.c.id == unit_id, trace_units.c.status.in_(("generated", "printed", "packed")))
                    .values(status="void", version=trace_units.c.version + 1, updated_at=now)
                    .returning(*trace_units.c)
                )
                .mappings()
                .first()
            )
            if not row:
                raise DomainError(409, "TRACE_STATE_CONFLICT", "Only undistributed units can be voided.")
            db.execute(
                update(qr_records)
                .where(qr_records.c.trace_unit_id == unit_id)
                .values(data=qr_records.c.data.op("||")({"status": "revoked"}), updated_at=now)
            )
            self._audit(db, actor_id, "trace.unit.voided", "trace_unit", unit_id, {"reason": reason}, None)
        return dict(row)

    def batch_context(self, batch_id: str) -> tuple[dict[str, Any], list[dict[str, Any]], list[dict[str, Any]]]:
        with self.engine.connect() as db:
            batch = db.execute(select(trace_batches).where(trace_batches.c.id == batch_id)).mappings().first()
            events = (
                db.execute(
                    select(trace_events)
                    .where(
                        trace_events.c.entity_type == "batch",
                        trace_events.c.entity_id == batch_id,
                        trace_events.c.status == "approved",
                    )
                    .order_by(trace_events.c.occurred_at, trace_events.c.id)
                )
                .mappings()
                .all()
            )
            documents = (
                db.execute(
                    select(trace_documents)
                    .where(trace_documents.c.batch_id == batch_id)
                    .order_by(trace_documents.c.sha256)
                )
                .mappings()
                .all()
            )
        if not batch:
            raise DomainError(404, "TRACE_BATCH_NOT_FOUND", "Trace batch was not found.")
        return dict(batch), [dict(row) for row in events], [dict(row) for row in documents]

    @staticmethod
    def _enqueue(db: Any, entity_type: str, entity_id: str, revision: int, now: datetime) -> None:
        db.execute(
            insert(ledger_outbox).values(
                id=str(uuid4()),
                aggregate_type=entity_type,
                aggregate_id=entity_id,
                revision=revision,
                command_json={"schemaVersion": SCHEMA_VERSION},
                status="pending",
                available_at=now,
                attempts=0,
                created_at=now,
                updated_at=now,
            )
        )

    @staticmethod
    def _audit(
        db: Any,
        actor_id: str | None,
        action: str,
        target_type: str,
        target_id: str,
        summary: dict[str, Any],
        request_id: str | None,
    ) -> None:
        db.execute(
            insert(audit_logs).values(
                id=str(uuid4()),
                actor_id=actor_id,
                action=action,
                target_type=target_type,
                target_id=target_id,
                summary=summary,
                request_id=request_id,
                created_at=datetime.now(UTC),
            )
        )


class TraceService:
    def __init__(self, repository: TraceRepository, settings: Settings):
        self.repository = repository
        self.settings = settings
        self.ledger = build_ledger(settings)

    def _bundle(self, entity_type: str, entity_id: str, revision: int | None = None) -> dict[str, Any]:
        if entity_type == "unit":
            unit = self.repository.get_unit(unit_id=entity_id)
            if not unit:
                raise DomainError(404, "TRACE_UNIT_NOT_FOUND", "Trace unit was not found.")
            batch, events, documents = self.repository.batch_context(unit["batch_id"])
            entity = {"type": "unit", "code": unit["public_code"], "revision": revision or unit["version"]}
            unit_state = {
                "status": unit["status"],
                "activatedAt": _iso(unit["activated_at"]),
                "batchCode": batch["batch_code"],
            }
        else:
            batch, events, documents = self.repository.batch_context(entity_id)
            entity = {"type": "batch", "code": batch["batch_code"], "revision": revision or batch["revision"]}
            unit_state = None
        previous = self._latest_anchor(entity_type, entity_id, before_revision=entity["revision"])
        return {
            "schemaVersion": SCHEMA_VERSION,
            "entity": entity,
            "unitState": unit_state,
            "events": [
                {
                    "id": event["id"],
                    "eventType": event["event_type"],
                    "occurredAt": _iso(event["occurred_at"]),
                    "payloadHash": event["payload_hash"],
                }
                for event in events
            ],
            "documents": [{"documentType": item["document_type"], "sha256": item["sha256"]} for item in documents],
            "previousRootHash": previous["root_hash"] if previous else None,
        }

    def _latest_anchor(
        self, entity_type: str, entity_id: str, before_revision: int | None = None
    ) -> dict[str, Any] | None:
        statement = select(ledger_anchors).where(
            ledger_anchors.c.entity_type == entity_type,
            ledger_anchors.c.entity_id == entity_id,
        )
        if before_revision is not None:
            statement = statement.where(ledger_anchors.c.revision < before_revision)
        with self.repository.engine.connect() as db:
            row = db.execute(statement.order_by(ledger_anchors.c.revision.desc())).mappings().first()
        return dict(row) if row else None

    def process_outbox(self, limit: int | None = None) -> dict[str, int]:
        limit = limit or self.settings.ledger_outbox_batch_size
        now, processed, failed = datetime.now(UTC), 0, 0
        with self.repository.engine.begin() as db:
            jobs = (
                db.execute(
                    select(ledger_outbox)
                    .where(ledger_outbox.c.status == "pending", ledger_outbox.c.available_at <= now)
                    .order_by(ledger_outbox.c.created_at)
                    .limit(limit)
                    .with_for_update(skip_locked=True)
                )
                .mappings()
                .all()
            )
            for job in jobs:
                bundle = self._bundle(job["aggregate_type"], job["aggregate_id"], job["revision"])
                root_hash = sha256_json(bundle)
                try:
                    receipt = self.ledger.anchor(
                        entity_type=job["aggregate_type"],
                        entity_id=job["aggregate_id"],
                        revision=job["revision"],
                        root_hash=root_hash,
                        previous_root_hash=bundle["previousRootHash"],
                    )
                except Exception as exc:
                    attempts = int(job["attempts"]) + 1
                    delays = (60, 300, 900, 3600, 21600)
                    db.execute(
                        update(ledger_outbox)
                        .where(ledger_outbox.c.id == job["id"])
                        .values(
                            status="failed" if attempts >= len(delays) else "pending",
                            attempts=attempts,
                            available_at=now + timedelta(seconds=delays[min(attempts - 1, len(delays) - 1)]),
                            last_error=str(exc)[:2000],
                            updated_at=now,
                        )
                    )
                    failed += 1
                    continue
                statement = (
                    pg_insert(ledger_anchors)
                    .values(
                        id=str(uuid4()),
                        entity_type=job["aggregate_type"],
                        entity_id=job["aggregate_id"],
                        revision=job["revision"],
                        schema_version=SCHEMA_VERSION,
                        root_hash=root_hash,
                        previous_root_hash=bundle["previousRootHash"],
                        network=receipt.network,
                        contract_address=receipt.contract_address,
                        transaction_id=receipt.transaction_id,
                        block_number=receipt.block_number,
                        status="confirmed",
                        submitted_at=now,
                        confirmed_at=receipt.confirmed_at,
                        retry_count=job["attempts"],
                        created_at=now,
                        updated_at=now,
                    )
                    .on_conflict_do_nothing(constraint="uq_ledger_anchor")
                )
                db.execute(statement)
                db.execute(
                    update(ledger_outbox)
                    .where(ledger_outbox.c.id == job["id"])
                    .values(status="confirmed", attempts=ledger_outbox.c.attempts + 1, updated_at=now)
                )
                processed += 1
        return {"processed": processed, "failed": failed}

    def unit_trace(self, public_code: str) -> dict[str, Any]:
        unit = self.repository.get_unit(public_code=public_code)
        if not unit:
            raise DomainError(404, "TRACE_UNIT_NOT_FOUND", "Trace unit was not found.")
        batch, events, _ = self.repository.batch_context(unit["batch_id"])
        status, message_code = PUBLIC_STATUS["recalled" if batch["status"] == "recalled" else unit["status"]]
        proof = self.proof(public_code)
        return {
            "publicCode": unit["public_code"],
            "product": {
                "slug": batch["product_slug"],
                "name": PRODUCT_NAMES.get(batch["product_slug"], batch["product_slug"]),
                "role": "Mở",
            },
            "batch": {
                "batchCode": batch["batch_code"],
                "packagedAt": _iso(batch["packaged_at"]),
                "bestBefore": _iso(batch["best_before"]),
            },
            "verification": {
                "status": status,
                "activatedAt": _iso(unit["activated_at"]),
                "messageCode": message_code,
                "publicMessage": batch["public_message"] if status == "recalled" else None,
            },
            "trace": {
                "sourceSummary": batch["source_summary"],
                "timeline": [
                    {
                        "type": item["event_type"],
                        "occurredAt": _iso(item["occurred_at"]),
                        "title": item["event_type"].replace("_", " ").title(),
                        "locationLabel": item["location_code"],
                    }
                    for item in events
                ],
            },
            "proof": {
                "status": proof["anchorStatus"],
                "network": proof["network"],
                "rootHash": proof["anchoredRootHash"],
                "transactionId": proof["transactionId"],
                "match": proof["match"],
            },
            "content": {
                "experiencePath": f"/experience/{batch['product_slug']}",
                "contentVersion": batch["content_version"] or "v1",
            },
        }

    def batch_trace(self, batch_code: str) -> dict[str, Any]:
        batch = self.repository.get_batch(batch_code=batch_code)
        if not batch or not batch["public_visibility"]:
            raise DomainError(404, "TRACE_BATCH_NOT_FOUND", "Public trace batch was not found.")
        _, events, _ = self.repository.batch_context(batch["id"])
        return {
            "batchCode": batch["batch_code"],
            "productSlug": batch["product_slug"],
            "status": batch["status"],
            "packagedAt": _iso(batch["packaged_at"]),
            "bestBefore": _iso(batch["best_before"]),
            "sourceSummary": batch["source_summary"],
            "timeline": [
                {
                    "type": event["event_type"],
                    "occurredAt": _iso(event["occurred_at"]),
                    "locationLabel": event["location_code"],
                }
                for event in events
            ],
        }

    def scan(self, public_code: str, payload: ScanWrite, request: Request) -> dict[str, Any]:
        unit = self.repository.get_unit(public_code=public_code)
        if not unit:
            raise DomainError(404, "TRACE_UNIT_NOT_FOUND", "Trace unit was not found.")
        now = datetime.now(UTC)
        client_hash = _digest(payload.clientToken, self.settings.trace_secret_pepper) if payload.clientToken else None
        ip_hash = _digest(request.client.host, self.settings.trace_secret_pepper) if request.client else None
        with self.repository.engine.begin() as db:
            seen = bool(
                client_hash
                and db.execute(
                    select(trace_scan_events.c.id)
                    .where(
                        trace_scan_events.c.unit_id == unit["id"], trace_scan_events.c.client_token_hash == client_hash
                    )
                    .limit(1)
                ).first()
            )
            risk_delta = 20 if unit["status"] in {"generated", "printed", "packed"} and not seen else 0
            referrer_origin = None
            if payload.referrer:
                parsed = urlparse(payload.referrer)
                referrer_origin = f"{parsed.scheme}://{parsed.netloc}" if parsed.scheme and parsed.netloc else None
            db.execute(
                insert(trace_scan_events).values(
                    id=str(uuid4()),
                    unit_id=unit["id"],
                    qr_code=unit["public_code"],
                    occurred_at=now,
                    source=payload.source,
                    path=payload.path,
                    campaign=payload.campaign,
                    referrer_origin=referrer_origin,
                    client_token_hash=client_hash,
                    ip_prefix_hash=ip_hash,
                    user_agent_family=(request.headers.get("user-agent") or "")[:80],
                    region_code=payload.regionCode,
                    risk_delta=risk_delta,
                    request_id=getattr(request.state, "request_id", None),
                )
            )
            new_score = int(unit["risk_score"]) + risk_delta
            level = "high" if new_score >= 50 else "watch" if new_score >= 20 else unit["risk_level"]
            db.execute(
                update(trace_units)
                .where(trace_units.c.id == unit["id"])
                .values(
                    scan_count=trace_units.c.scan_count + 1,
                    unique_client_count=trace_units.c.unique_client_count + (0 if seen or not client_hash else 1),
                    risk_score=new_score,
                    risk_level=level,
                    updated_at=now,
                )
            )
        return {"accepted": True, "riskLevel": level}

    def activate(
        self, public_code: str, payload: ActivateWrite, idempotency_key: str, request: Request
    ) -> dict[str, Any]:
        now, request_id = datetime.now(UTC), getattr(request.state, "request_id", None) or str(uuid4())
        idem_hash = _digest(idempotency_key, self.settings.trace_secret_pepper)
        client_hash = _digest(payload.clientToken, self.settings.trace_secret_pepper) if payload.clientToken else None
        ip_hash = _digest(request.client.host, self.settings.trace_secret_pepper) if request.client else None
        with self.repository.engine.begin() as db:
            unit = (
                db.execute(
                    select(trace_units)
                    .where(func.upper(trace_units.c.public_code) == public_code.strip().upper())
                    .with_for_update()
                )
                .mappings()
                .first()
            )
            if not unit:
                raise DomainError(404, "TRACE_UNIT_NOT_FOUND", "Trace unit was not found.")
            previous = db.execute(
                select(trace_activation_attempts.c.result).where(
                    trace_activation_attempts.c.unit_id == unit["id"],
                    trace_activation_attempts.c.idempotency_key_hash == idem_hash,
                )
            ).scalar_one_or_none()
            if previous:
                if previous == "invalid-secret":
                    raise DomainError(400, "SECRET_CODE_INVALID", "The verification code is invalid.")
                if previous == "not-distributed":
                    raise DomainError(409, "TRACE_UNIT_NOT_DISTRIBUTED", "Trace unit has not been distributed.")
                return self._activation_result(dict(unit), previous)
            if unit["status"] in {"void", "recalled"}:
                raise DomainError(409, f"TRACE_UNIT_{unit['status'].upper()}", f"Trace unit is {unit['status']}.")
            valid_secret = hmac.compare_digest(
                unit["secret_digest"],
                _digest(_secret_normalized(payload.secretCode), self.settings.trace_secret_pepper),
            )
            result, risk_delta = "invalid-secret", 10
            if unit["status"] in {"generated", "printed", "packed"}:
                result, risk_delta = "not-distributed", 20
            elif unit["status"] in {"activated", "recheck", "suspicious", "compromised"} and valid_secret:
                result, risk_delta = "already-activated", 0
            elif valid_secret:
                result, risk_delta = "activated", 0
            db.execute(
                insert(trace_activation_attempts).values(
                    id=str(uuid4()),
                    unit_id=unit["id"],
                    result=result,
                    occurred_at=now,
                    idempotency_key_hash=idem_hash,
                    client_token_hash=client_hash,
                    ip_prefix_hash=ip_hash,
                    user_agent_family=(request.headers.get("user-agent") or "")[:80],
                    region_code=payload.regionCode if payload.consent.coarseRegion else None,
                    risk_delta=risk_delta,
                    request_id=request_id,
                )
            )
            if result == "activated":
                unit = (
                    db.execute(
                        update(trace_units)
                        .where(trace_units.c.id == unit["id"])
                        .values(
                            status="activated",
                            activated_at=now,
                            first_activation_request_id=request_id,
                            version=trace_units.c.version + 1,
                            updated_at=now,
                        )
                        .returning(*trace_units.c)
                    )
                    .mappings()
                    .one()
                )
                self.repository._enqueue(db, "unit", unit["id"], int(unit["version"]), now)
            elif risk_delta:
                new_score = int(unit["risk_score"]) + risk_delta
                level = "high" if new_score >= 50 else "watch"
                unit = (
                    db.execute(
                        update(trace_units)
                        .where(trace_units.c.id == unit["id"])
                        .values(risk_score=new_score, risk_level=level, updated_at=now)
                        .returning(*trace_units.c)
                    )
                    .mappings()
                    .one()
                )
        if result == "invalid-secret":
            raise DomainError(400, "SECRET_CODE_INVALID", "The verification code is invalid.")
        if result == "not-distributed":
            raise DomainError(409, "TRACE_UNIT_NOT_DISTRIBUTED", "Trace unit has not been distributed.")
        return self._activation_result(dict(unit), result)

    @staticmethod
    def _activation_result(unit: dict[str, Any], result: str) -> dict[str, Any]:
        public_result = "already-activated" if result == "already-activated" else "activated"
        return {
            "result": public_result,
            "verificationStatus": PUBLIC_STATUS[unit["status"]][0],
            "activatedAt": _iso(unit["activated_at"]),
            "messageCode": "UNIT_ALREADY_ACTIVATED" if public_result == "already-activated" else "ACTIVATION_SUCCESS",
        }

    def proof(self, public_code: str) -> dict[str, Any]:
        unit = self.repository.get_unit(public_code=public_code)
        if not unit:
            raise DomainError(404, "TRACE_UNIT_NOT_FOUND", "Trace unit was not found.")
        anchor = self._latest_anchor("unit", unit["id"])
        bundle = self._bundle("unit", unit["id"], anchor["revision"] if anchor else unit["version"])
        local_root = sha256_json(bundle)
        return {
            "entityType": "unit",
            "entityPublicCode": unit["public_code"],
            "schemaVersion": SCHEMA_VERSION,
            "revision": anchor["revision"] if anchor else unit["version"],
            "localRootHash": local_root,
            "anchoredRootHash": anchor["root_hash"] if anchor else None,
            "match": bool(anchor and hmac.compare_digest(local_root, anchor["root_hash"])),
            "anchorStatus": anchor["status"] if anchor else "pending",
            "network": anchor["network"] if anchor else self.settings.ledger_network,
            "transactionId": anchor["transaction_id"] if anchor else None,
        }

    def risk_review(self, unit_id: str, payload: RiskReviewWrite, actor_id: str) -> dict[str, Any]:
        mapping = {
            "clear-false-positive": ("normal", "activated"),
            "confirm-misuse": ("confirmed", "compromised"),
            "mark-recheck": ("watch", "recheck"),
        }
        next_risk, next_status = mapping[payload.decision]
        now = datetime.now(UTC)
        with self.repository.engine.begin() as db:
            unit = (
                db.execute(select(trace_units).where(trace_units.c.id == unit_id).with_for_update()).mappings().first()
            )
            if not unit:
                raise DomainError(404, "TRACE_UNIT_NOT_FOUND", "Trace unit was not found.")
            db.execute(
                insert(trace_risk_reviews).values(
                    id=str(uuid4()),
                    unit_id=unit_id,
                    decision=payload.decision,
                    reason=payload.reason,
                    previous_risk_level=unit["risk_level"],
                    next_risk_level=next_risk,
                    reviewed_by=actor_id,
                    created_at=now,
                )
            )
            row = (
                db.execute(
                    update(trace_units)
                    .where(trace_units.c.id == unit_id)
                    .values(
                        risk_level=next_risk,
                        risk_score=0 if next_risk == "normal" else unit["risk_score"],
                        status=next_status,
                        version=trace_units.c.version + 1,
                        updated_at=now,
                    )
                    .returning(*trace_units.c)
                )
                .mappings()
                .one()
            )
        return _unit_admin(dict(row))

    def list_anchors(self) -> list[dict[str, Any]]:
        with self.repository.engine.connect() as db:
            rows = db.execute(select(ledger_anchors).order_by(ledger_anchors.c.created_at.desc())).mappings().all()
        return [
            {
                "id": row["id"],
                "entityType": row["entity_type"],
                "entityId": row["entity_id"],
                "revision": row["revision"],
                "rootHash": row["root_hash"],
                "network": row["network"],
                "transactionId": row["transaction_id"],
                "blockNumber": row["block_number"],
                "status": row["status"],
                "confirmedAt": _iso(row["confirmed_at"]),
            }
            for row in rows
        ]

    def retry_outbox(self, job_id: str) -> dict[str, Any]:
        now = datetime.now(UTC)
        with self.repository.engine.begin() as db:
            row = (
                db.execute(
                    update(ledger_outbox)
                    .where(ledger_outbox.c.id == job_id, ledger_outbox.c.status.in_(("pending", "failed")))
                    .values(status="pending", available_at=now, last_error=None, updated_at=now)
                    .returning(*ledger_outbox.c)
                )
                .mappings()
                .first()
            )
        if not row:
            raise DomainError(404, "LEDGER_OUTBOX_NOT_FOUND", "Retryable ledger outbox job was not found.")
        return {"id": row["id"], "status": row["status"], "attempts": row["attempts"]}


def _batch_admin(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "batchCode": row["batch_code"],
        "productSlug": row["product_slug"],
        "contentVersion": row["content_version"],
        "status": row["status"],
        "productionDate": _iso(row["production_date"]),
        "packagedAt": _iso(row["packaged_at"]),
        "bestBefore": _iso(row["best_before"]),
        "sourceSummary": row["source_summary"],
        "publicVisibility": row["public_visibility"],
        "revision": row["revision"],
        "version": row["version"],
    }


def _unit_admin(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "batchId": row["batch_id"],
        "publicCode": row["public_code"],
        "status": row["status"],
        "riskLevel": row["risk_level"],
        "riskScore": row["risk_score"],
        "scanCount": row["scan_count"],
        "version": row["version"],
        "activatedAt": _iso(row["activated_at"]),
    }


router = APIRouter(tags=["trace"])


def trace_service(request: Request) -> TraceService:
    service = request.app.state.services.trace
    if service is None:
        raise DomainError(503, "TRACE_SERVICE_UNAVAILABLE", "Trace service is unavailable.")
    return service


@router.get("/trace/units/{public_code}")
async def public_unit(public_code: str, service: TraceService = Depends(trace_service)):
    return success(service.unit_trace(public_code))


@router.get("/trace/batches/{batch_code}")
async def public_batch(batch_code: str, service: TraceService = Depends(trace_service)):
    return success(service.batch_trace(batch_code))


@router.post("/trace/units/{public_code}/scan")
async def public_scan(
    public_code: str, payload: ScanWrite, request: Request, service: TraceService = Depends(trace_service)
):
    request.app.state.services.rate_limiter.check(
        f"trace_scan:{request.client.host if request.client else 'unknown'}", 120
    )
    return success(service.scan(public_code, payload, request))


@router.post("/trace/units/{public_code}/activate")
async def activate_unit(
    public_code: str,
    payload: ActivateWrite,
    request: Request,
    idempotency_key: str = Header(alias="Idempotency-Key", min_length=8, max_length=128),
    service: TraceService = Depends(trace_service),
):
    request.app.state.services.rate_limiter.check(
        f"trace_activate:{request.client.host if request.client else 'unknown'}", 10
    )
    return success(service.activate(public_code, payload, idempotency_key, request))


@router.get("/trace/units/{public_code}/proof")
async def public_proof(public_code: str, service: TraceService = Depends(trace_service)):
    return success(service.proof(public_code))


@router.post("/admin/trace/batches")
async def create_batch(
    payload: BatchCreate,
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.batches.write", True)),
):
    return success(_batch_admin(service.repository.create_batch(payload, identity["id"])))


@router.post("/admin/trace/batches/{batch_id}/events")
async def add_batch_event(
    batch_id: str,
    payload: EventCreate,
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.batches.write", True)),
):
    event = service.repository.add_event(batch_id, payload, identity["id"])
    return success(
        {
            "id": event["id"],
            "eventType": event["event_type"],
            "payloadHash": event["payload_hash"],
            "occurredAt": _iso(event["occurred_at"]),
        }
    )


@router.post("/admin/trace/batches/{batch_id}/approve")
async def approve_batch(
    batch_id: str,
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.batches.approve", True)),
):
    batch = service.repository.approve_batch(batch_id, identity["id"])
    if service.settings.ledger_adapter == "database":
        service.process_outbox()
    return success(_batch_admin(batch))


@router.post("/admin/trace/batches/{batch_id}/recall")
async def recall_batch(
    batch_id: str,
    payload: RecallWrite,
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.recall", True)),
):
    batch = service.repository.recall_batch(batch_id, payload, identity["id"])
    if service.settings.ledger_adapter == "database":
        service.process_outbox()
    return success(_batch_admin(batch))


@router.post("/admin/trace/batches/{batch_id}/units/issue")
async def issue_units(
    batch_id: str,
    payload: IssueWrite,
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.units.export_secrets", True)),
):
    units, csv_export = service.repository.issue_units(
        batch_id, payload.quantity, service.settings.trace_secret_pepper, identity["id"]
    )
    return success(
        {
            "quantity": len(units),
            "units": units,
            "csv": csv_export,
            "warning": "Secret codes are returned once. Store the export securely.",
        }
    )


@router.post("/admin/trace/units/{unit_id}/transition")
async def transition_unit(
    unit_id: str,
    payload: TransitionWrite,
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.units.write", True)),
):
    return success(
        _unit_admin(
            service.repository.transition_unit(unit_id, payload.action, payload.expectedVersion, identity["id"])
        )
    )


@router.post("/admin/trace/units/{unit_id}/void")
async def void_unit(
    unit_id: str,
    payload: VoidWrite,
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.units.write", True)),
):
    return success(_unit_admin(service.repository.void_unit(unit_id, payload.reason, identity["id"])))


@router.post("/admin/trace/units/{unit_id}/risk-review")
async def risk_review(
    unit_id: str,
    payload: RiskReviewWrite,
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.risk.review", True)),
):
    return success(service.risk_review(unit_id, payload, identity["id"]))


@router.post("/admin/trace/anchors/process")
async def process_anchors(
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.ledger.write", True)),
):
    del identity
    return success(service.process_outbox())


@router.get("/admin/trace/anchors")
async def list_anchors(
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.ledger.write")),
):
    del identity
    return success(service.list_anchors())


@router.post("/admin/trace/outbox/{job_id}/retry")
async def retry_outbox(
    job_id: str,
    service: TraceService = Depends(trace_service),
    identity: dict[str, Any] = Depends(require("trace.ledger.write", True)),
):
    del identity
    return success(service.retry_outbox(job_id))

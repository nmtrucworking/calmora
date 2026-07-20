from __future__ import annotations

import hashlib
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from sqlalchemy.dialects.postgresql import insert

from app.db.schema import (
    cancellation_policies,
    product_variants,
    products,
    qr_batch_overrides,
    qr_experience_contents,
    qr_records,
)
from app.db.session import get_engine
from app.modules.catalog_models import CancellationPolicyContract, ProductContract
from app.seed.cutover import CUTOVER_VERSION, build_cutover_contents, build_cutover_override

SEED_DIR = Path(__file__).resolve().parent / "seed"


def canonical_hash(value: dict[str, Any]) -> str:
    return hashlib.sha256(
        json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    ).hexdigest()


def load_and_validate() -> dict[str, list[dict[str, Any]]]:
    result: dict[str, list[dict[str, Any]]] = {}
    for name in ("products", "cancellation_policies", "qr_records", "qr_experience_content", "qr_batch_overrides"):
        value = json.loads((SEED_DIR / f"{name}.json").read_text(encoding="utf-8"))
        if not isinstance(value, list) or not all(isinstance(item, dict) for item in value):
            raise ValueError(f"{name}.json must contain an array of objects")
        result[name] = value
    result["products"] = [ProductContract.model_validate(item).model_dump(mode="json") for item in result["products"]]
    result["cancellation_policies"] = [
        CancellationPolicyContract.model_validate(item).model_dump(mode="json")
        for item in result["cancellation_policies"]
    ]
    result["qr_experience_content"].extend(build_cutover_contents(SEED_DIR))
    result["qr_batch_overrides"].append(build_cutover_override(SEED_DIR))
    product_ids = {item.get("id") for item in result["products"]}
    if None in product_ids or len(product_ids) != len(result["products"]):
        raise ValueError("Product seed IDs must be present and unique")
    policy_ids = {item["id"] for item in result["cancellation_policies"]}
    if len(policy_ids) != len(result["cancellation_policies"]):
        raise ValueError("Cancellation policy seed IDs must be unique")
    for product in result["products"]:
        referenced_policies = {product["commerce"]["cancellationPolicyId"]} | {
            variant["cancellationPolicyId"] for variant in product["variants"]
        }
        unknown = referenced_policies - policy_ids
        if unknown:
            raise ValueError(f"Product {product['id']} references unknown cancellation policies: {sorted(unknown)}")
    for record in result["qr_records"]:
        if record.get("productSlug") not in product_ids:
            raise ValueError(f"QR {record.get('code')} references an unknown product")
    return result


def import_seeds() -> dict[str, int]:
    seed = load_and_validate()
    counts = {"products": 0, "variants": 0, "policies": 0, "qrRecords": 0, "contents": 0, "overrides": 0}
    now = datetime.now(UTC)
    with get_engine().begin() as connection:
        for policy in seed["cancellation_policies"]:
            statement = (
                insert(cancellation_policies)
                .values(
                    id=policy["id"],
                    version=policy["version"],
                    status=policy["status"],
                    data=policy,
                    seed_key=f"policy:{policy['id']}:{policy['version']}",
                    seed_hash=canonical_hash(policy),
                    created_at=now,
                    updated_at=now,
                )
                .on_conflict_do_nothing(index_elements=[cancellation_policies.c.id])
                .returning(cancellation_policies.c.id)
            )
            counts["policies"] += int(connection.execute(statement).first() is not None)
        for product in seed["products"]:
            statement = (
                insert(products)
                .values(
                    id=product["id"],
                    slug=product["slug"],
                    name=product["name"],
                    status=product["status"],
                    data=product,
                    seed_key=f"product:{product['id']}",
                    seed_hash=canonical_hash(product),
                    created_at=now,
                    updated_at=now,
                )
                .on_conflict_do_nothing(index_elements=[products.c.id])
                .returning(products.c.id)
            )
            counts["products"] += int(connection.execute(statement).first() is not None)
            for variant in product.get("variants", []):
                variant_data = {**variant, "productId": product["id"]}
                statement = (
                    insert(product_variants)
                    .values(
                        id=f"{product['id']}:{variant['id']}",
                        product_id=product["id"],
                        name=variant["label"],
                        data=variant_data,
                        created_at=now,
                        updated_at=now,
                    )
                    .on_conflict_do_nothing(index_elements=[product_variants.c.id])
                    .returning(product_variants.c.id)
                )
                counts["variants"] += int(connection.execute(statement).first() is not None)
        for record in seed["qr_records"]:
            statement = (
                insert(qr_records)
                .values(
                    code=record["code"],
                    product_id=record["productSlug"],
                    data=record,
                    seed_key=f"qr:{record['code']}",
                    seed_hash=canonical_hash(record),
                    created_at=now,
                    updated_at=now,
                )
                .on_conflict_do_nothing(index_elements=[qr_records.c.code])
                .returning(qr_records.c.code)
            )
            counts["qrRecords"] += int(connection.execute(statement).first() is not None)
        for content in seed["qr_experience_content"]:
            key = f"{content['productSlug']}:{content['version']}:{content.get('locale', 'vi')}"
            if content["version"] == CUTOVER_VERSION:
                existing = connection.execute(
                    qr_experience_contents.select()
                    .with_only_columns(qr_experience_contents.c.data)
                    .where(
                        qr_experience_contents.c.product_id == content["productSlug"],
                        qr_experience_contents.c.version == content["version"],
                        qr_experience_contents.c.locale == content.get("locale", "vi"),
                    )
                ).scalar_one_or_none()
                if existing is not None and canonical_hash(existing) != canonical_hash(content):
                    raise RuntimeError(f"Cutover content collision for {key}; existing data was not overwritten")
            statement = (
                insert(qr_experience_contents)
                .values(
                    product_id=content["productSlug"],
                    version=content["version"],
                    locale=content.get("locale", "vi"),
                    status="published",
                    data=content,
                    seed_key=f"content:{key}",
                    seed_hash=canonical_hash(content),
                    created_at=now,
                    updated_at=now,
                )
                .on_conflict_do_nothing(
                    index_elements=[
                        qr_experience_contents.c.product_id,
                        qr_experience_contents.c.version,
                        qr_experience_contents.c.locale,
                    ]
                )
                .returning(qr_experience_contents.c.product_id)
            )
            counts["contents"] += int(connection.execute(statement).first() is not None)
        for override in seed["qr_batch_overrides"]:
            if override["contentVersion"] == CUTOVER_VERSION:
                existing = connection.execute(
                    qr_batch_overrides.select()
                    .with_only_columns(qr_batch_overrides.c.data)
                    .where(
                        qr_batch_overrides.c.batch_code == override["batchCode"],
                        qr_batch_overrides.c.product_id == override["productSlug"],
                        qr_batch_overrides.c.content_version == override["contentVersion"],
                    )
                ).scalar_one_or_none()
                if existing is not None and canonical_hash(existing) != canonical_hash(override):
                    raise RuntimeError(
                        f"Cutover override collision for {override['batchCode']}:{override['productSlug']}"
                    )
            statement = (
                insert(qr_batch_overrides)
                .values(
                    batch_code=override["batchCode"],
                    product_id=override["productSlug"],
                    content_version=override["contentVersion"],
                    status="active",
                    data=override,
                    seed_key=f"override:{override['batchCode']}:{override['productSlug']}:{override['contentVersion']}",
                    seed_hash=canonical_hash(override),
                    created_at=now,
                    updated_at=now,
                )
                .on_conflict_do_nothing(
                    index_elements=[
                        qr_batch_overrides.c.batch_code,
                        qr_batch_overrides.c.product_id,
                        qr_batch_overrides.c.content_version,
                    ]
                )
                .returning(qr_batch_overrides.c.batch_code)
            )
            counts["overrides"] += int(connection.execute(statement).first() is not None)
    return counts


if __name__ == "__main__":
    print(json.dumps(import_seeds(), ensure_ascii=False))

# ruff: noqa: E501
from __future__ import annotations

import json
from typing import Any
from uuid import uuid4

from sqlalchemy import Engine, text


class ContentRepository:
    def __init__(self, engine: Engine | Any):
        self._engine_source = engine

    @property
    def engine(self) -> Engine:
        return self._engine_source if isinstance(self._engine_source, Engine) else self._engine_source.engine

    def list_items(self) -> list[dict[str, Any]]:
        with self.engine.connect() as db:
            rows = db.execute(
                text(
                    "SELECT i.id,i.content_key,i.content_type,i.locale,i.status,i.current_published_revision_id,i.updated_at,count(r.id) revision_count FROM content_items i LEFT JOIN content_revisions r ON r.item_id=i.id GROUP BY i.id ORDER BY i.updated_at DESC"
                )
            ).mappings()
            return [
                {
                    "id": row["id"],
                    "key": row["content_key"],
                    "contentType": row["content_type"],
                    "locale": row["locale"],
                    "status": row["status"],
                    "currentPublishedRevisionId": row["current_published_revision_id"],
                    "revisionCount": row["revision_count"],
                    "updatedAt": row["updated_at"],
                }
                for row in rows
            ]

    def get_item(self, item_id: str) -> dict[str, Any] | None:
        with self.engine.connect() as db:
            item = db.execute(text("SELECT * FROM content_items WHERE id=:id"), {"id": item_id}).mappings().first()
            if not item:
                return None
            result = {
                "id": item["id"],
                "key": item["content_key"],
                "contentType": item["content_type"],
                "locale": item["locale"],
                "status": item["status"],
                "currentPublishedRevisionId": item["current_published_revision_id"],
                "createdAt": item["created_at"],
                "updatedAt": item["updated_at"],
            }
            result["revisions"] = [
                {
                    "id": row["id"],
                    "revisionNo": row["revision_no"],
                    "status": row["status"],
                    "data": row["data"],
                    "sourceNote": row["source_note"],
                    "reviewNote": row["review_note"],
                    "version": row["version"],
                    "createdBy": row["created_by"],
                    "reviewedBy": row["reviewed_by"],
                    "publishedBy": row["published_by"],
                    "createdAt": row["created_at"],
                    "updatedAt": row["updated_at"],
                    "publishedAt": row["published_at"],
                }
                for row in db.execute(
                    text(
                        "SELECT id,revision_no,status,data,source_note,review_note,version,created_by,reviewed_by,published_by,created_at,updated_at,published_at FROM content_revisions WHERE item_id=:id ORDER BY revision_no DESC"
                    ),
                    {"id": item_id},
                ).mappings()
            ]
            return result

    def create_item(
        self,
        content_key: str,
        content_type: str,
        locale: str,
        data: dict[str, Any],
        source_note: str | None,
        actor: str,
    ) -> dict[str, str] | None:
        item_id, revision_id = str(uuid4()), str(uuid4())
        with self.engine.begin() as db:
            inserted = db.execute(
                text(
                    "INSERT INTO content_items(id,content_key,content_type,locale,status,created_by,created_at,updated_at) VALUES (:id,:key,:type,:locale,'draft',:actor,now(),now()) ON CONFLICT(content_key) DO NOTHING"
                ),
                {"id": item_id, "key": content_key, "type": content_type, "locale": locale, "actor": actor},
            )
            if not inserted.rowcount:
                return None
            db.execute(
                text(
                    "INSERT INTO content_revisions(id,item_id,revision_no,status,data,source_note,version,created_by,created_at,updated_at) VALUES (:id,:item,1,'draft',CAST(:data AS jsonb),:source,1,:actor,now(),now())"
                ),
                {"id": revision_id, "item": item_id, "data": json.dumps(data), "source": source_note, "actor": actor},
            )
        return {"id": item_id, "revisionId": revision_id}

    def create_revision(self, item_id: str, actor: str) -> str | None:
        revision_id = str(uuid4())
        with self.engine.begin() as db:
            if not db.execute(text("SELECT 1 FROM content_items WHERE id=:id FOR UPDATE"), {"id": item_id}).first():
                return None
            if db.execute(
                text("SELECT 1 FROM content_revisions WHERE item_id=:id AND status IN ('draft','in_review')"),
                {"id": item_id},
            ).first():
                return "conflict"
            latest = (
                db.execute(
                    text(
                        "SELECT revision_no,data,source_note FROM content_revisions WHERE item_id=:id ORDER BY revision_no DESC LIMIT 1"
                    ),
                    {"id": item_id},
                )
                .mappings()
                .one()
            )
            db.execute(
                text(
                    "INSERT INTO content_revisions(id,item_id,revision_no,status,data,source_note,version,created_by,created_at,updated_at) VALUES (:revision,:item,:number,'draft',CAST(:data AS jsonb),:source,1,:actor,now(),now())"
                ),
                {
                    "revision": revision_id,
                    "item": item_id,
                    "number": latest["revision_no"] + 1,
                    "data": json.dumps(latest["data"]),
                    "source": latest["source_note"],
                    "actor": actor,
                },
            )
        return revision_id

    def update_revision(
        self, revision_id: str, data: dict[str, Any], source_note: str | None, expected_version: int
    ) -> bool:
        with self.engine.begin() as db:
            result = db.execute(
                text(
                    "UPDATE content_revisions SET data=CAST(:data AS jsonb),source_note=:source,version=version+1,updated_at=now() WHERE id=:id AND status='draft' AND version=:version"
                ),
                {"id": revision_id, "data": json.dumps(data), "source": source_note, "version": expected_version},
            )
            return bool(result.rowcount)

    def submit_review(self, revision_id: str, actor: str, expected_version: int) -> bool:
        with self.engine.begin() as db:
            result = db.execute(
                text(
                    "UPDATE content_revisions SET status='in_review',reviewed_by=:actor,version=version+1,updated_at=now() WHERE id=:id AND status='draft' AND version=:version"
                ),
                {"id": revision_id, "actor": actor, "version": expected_version},
            )
            return bool(result.rowcount)

    def return_to_draft(self, revision_id: str, actor: str, note: str, expected_version: int) -> bool:
        with self.engine.begin() as db:
            result = db.execute(
                text(
                    "UPDATE content_revisions SET status='draft',reviewed_by=:actor,review_note=:note,version=version+1,updated_at=now() WHERE id=:id AND status='in_review' AND version=:version"
                ),
                {"id": revision_id, "actor": actor, "note": note, "version": expected_version},
            )
            return bool(result.rowcount)

    def publish(self, revision_id: str, actor: str, expected_version: int) -> str | None:
        with self.engine.begin() as db:
            revision = (
                db.execute(
                    text(
                        "SELECT id,item_id FROM content_revisions WHERE id=:id AND status='in_review' AND version=:version FOR UPDATE"
                    ),
                    {"id": revision_id, "version": expected_version},
                )
                .mappings()
                .first()
            )
            if not revision:
                return None
            db.execute(
                text("UPDATE content_revisions SET status='superseded' WHERE item_id=:item AND status='published'"),
                {"item": revision["item_id"]},
            )
            db.execute(
                text(
                    "UPDATE content_revisions SET status='published',published_by=:actor,published_at=now(),version=version+1,updated_at=now() WHERE id=:id"
                ),
                {"id": revision_id, "actor": actor},
            )
            db.execute(
                text(
                    "UPDATE content_items SET status='published',current_published_revision_id=:revision,updated_at=now() WHERE id=:item"
                ),
                {"revision": revision_id, "item": revision["item_id"]},
            )
            return str(revision["item_id"])

    def unpublish(self, item_id: str) -> bool:
        with self.engine.begin() as db:
            result = db.execute(
                text(
                    "UPDATE content_items SET status='unpublished',current_published_revision_id=NULL,updated_at=now() WHERE id=:id AND status='published'"
                ),
                {"id": item_id},
            )
            return bool(result.rowcount)

    def public_content(self, content_key: str) -> dict[str, Any] | None:
        with self.engine.connect() as db:
            row = (
                db.execute(
                    text(
                        "SELECT i.content_key,i.content_type,i.locale,r.revision_no,r.data,r.published_at FROM content_items i JOIN content_revisions r ON r.id=i.current_published_revision_id WHERE i.content_key=:key AND i.status='published' AND r.status='published'"
                    ),
                    {"key": content_key},
                )
                .mappings()
                .first()
            )
            if not row:
                return None
            return {
                "key": row["content_key"],
                "contentType": row["content_type"],
                "locale": row["locale"],
                "revision": row["revision_no"],
                "data": row["data"],
                "publishedAt": row["published_at"],
            }

# ruff: noqa: B008, E501
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field

from app.core.errors import DomainError, success
from app.modules.admin import require


class ContentCreate(BaseModel):
    key: str = Field(min_length=3, max_length=160, pattern=r"^[a-z0-9][a-z0-9._/-]*$")
    contentType: str = Field(min_length=2, max_length=80)
    locale: str = Field(default="vi", min_length=2, max_length=10)
    data: dict[str, Any]
    sourceNote: str | None = Field(default=None, max_length=5000)


class RevisionWrite(BaseModel):
    data: dict[str, Any]
    sourceNote: str | None = Field(default=None, max_length=5000)
    expectedVersion: int = Field(ge=1)


class RevisionAction(BaseModel):
    expectedVersion: int = Field(ge=1)


class ReturnDraft(RevisionAction):
    note: str = Field(min_length=1, max_length=5000)


def audit(request: Request, actor: str, action: str, target_type: str, target_id: str, summary=None) -> None:
    request.app.state.services.admin.repository.audit(
        actor,
        action,
        target_type,
        target_id,
        summary or {},
        getattr(request.state, "request_id", None),
    )


router = APIRouter(tags=["content"])


@router.get("/content/{content_key:path}")
async def public_content(content_key: str, request: Request):
    item = request.app.state.services.content.public_content(content_key)
    if not item:
        raise DomainError(404, "CONTENT_NOT_FOUND", "Published content was not found.")
    return success(item)


@router.get("/admin/content-items")
async def content_items(request: Request, _: dict[str, Any] = Depends(require("content.read"))):
    return success(request.app.state.services.content.list_items())


@router.post("/admin/content-items", status_code=201)
async def create_content(
    payload: ContentCreate,
    request: Request,
    identity: dict[str, Any] = Depends(require("content.write", True)),
):
    if not payload.data:
        raise DomainError(422, "VALIDATION_ERROR", "Content data cannot be empty.")
    created = request.app.state.services.content.create_item(
        payload.key, payload.contentType, payload.locale, payload.data, payload.sourceNote, identity["id"]
    )
    if not created:
        raise DomainError(409, "CONTENT_KEY_CONFLICT", "Content key already exists.")
    audit(request, identity["id"], "content.create", "content_item", created["id"])
    return success(created)


@router.get("/admin/content-items/{item_id}")
async def content_detail(item_id: str, request: Request, _: dict[str, Any] = Depends(require("content.read"))):
    item = request.app.state.services.content.get_item(item_id)
    if not item:
        raise DomainError(404, "CONTENT_NOT_FOUND", "Content item was not found.")
    return success(item)


@router.post("/admin/content-items/{item_id}/revisions", status_code=201)
async def create_revision(
    item_id: str,
    request: Request,
    identity: dict[str, Any] = Depends(require("content.write", True)),
):
    revision_id = request.app.state.services.content.create_revision(item_id, identity["id"])
    if revision_id == "conflict":
        raise DomainError(409, "EDITABLE_REVISION_EXISTS", "An editable revision already exists.")
    if not revision_id:
        raise DomainError(404, "CONTENT_NOT_FOUND", "Content item was not found.")
    audit(request, identity["id"], "content.revision_create", "content_revision", revision_id)
    return success({"revisionId": revision_id})


@router.patch("/admin/content-revisions/{revision_id}")
async def update_revision(
    revision_id: str,
    payload: RevisionWrite,
    request: Request,
    identity: dict[str, Any] = Depends(require("content.write", True)),
):
    if not payload.data:
        raise DomainError(422, "VALIDATION_ERROR", "Content data cannot be empty.")
    if not request.app.state.services.content.update_revision(
        revision_id, payload.data, payload.sourceNote, payload.expectedVersion
    ):
        raise DomainError(409, "REVISION_NOT_EDITABLE", "Revision is not draft or its version changed.")
    audit(request, identity["id"], "content.revision_update", "content_revision", revision_id)
    return success({"updated": True})


@router.post("/admin/content-revisions/{revision_id}/submit-review")
async def submit_review(
    revision_id: str,
    payload: RevisionAction,
    request: Request,
    identity: dict[str, Any] = Depends(require("content.write", True)),
):
    if not request.app.state.services.content.submit_review(revision_id, identity["id"], payload.expectedVersion):
        raise DomainError(409, "REVISION_TRANSITION_INVALID", "Only the current draft can enter review.")
    audit(request, identity["id"], "content.submit_review", "content_revision", revision_id)
    return success({"status": "in_review"})


@router.post("/admin/content-revisions/{revision_id}/return-draft")
async def return_draft(
    revision_id: str,
    payload: ReturnDraft,
    request: Request,
    identity: dict[str, Any] = Depends(require("content.review", True)),
):
    if not request.app.state.services.content.return_to_draft(
        revision_id, identity["id"], payload.note, payload.expectedVersion
    ):
        raise DomainError(409, "REVISION_TRANSITION_INVALID", "Only an in-review revision can return to draft.")
    audit(request, identity["id"], "content.return_draft", "content_revision", revision_id)
    return success({"status": "draft"})


@router.post("/admin/content-revisions/{revision_id}/publish")
async def publish_revision(
    revision_id: str,
    payload: RevisionAction,
    request: Request,
    identity: dict[str, Any] = Depends(require("content.publish", True)),
):
    item_id = request.app.state.services.content.publish(revision_id, identity["id"], payload.expectedVersion)
    if not item_id:
        raise DomainError(409, "REVISION_TRANSITION_INVALID", "Only the current in-review revision can publish.")
    audit(request, identity["id"], "content.publish", "content_revision", revision_id, {"itemId": item_id})
    return success({"status": "published"})


@router.post("/admin/content-items/{item_id}/unpublish")
async def unpublish_content(
    item_id: str,
    request: Request,
    identity: dict[str, Any] = Depends(require("content.unpublish", True)),
):
    if not request.app.state.services.content.unpublish(item_id):
        raise DomainError(409, "CONTENT_TRANSITION_INVALID", "Only published content can be unpublished.")
    audit(request, identity["id"], "content.unpublish", "content_item", item_id)
    return success({"status": "unpublished"})

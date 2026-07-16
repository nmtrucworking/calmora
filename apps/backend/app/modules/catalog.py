from __future__ import annotations

import hashlib
import json
from copy import deepcopy
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Request, Response

from app.core.errors import DomainError, success


class CatalogRepository:
    def __init__(self, seed_dir: Path):
        self._products: list[dict[str, Any]] = _load_seed(seed_dir / "products.json")

    def list(self, published_only: bool = False) -> list[dict[str, Any]]:
        products = self._products
        if published_only:
            products = [product for product in products if product.get("status") == "active"]
        return deepcopy(products)

    def get(self, slug_or_id: str, published_only: bool = False) -> dict[str, Any] | None:
        normalized = slug_or_id.strip().lower()
        item = next(
            (
                product
                for product in self._products
                if (product.get("slug") == normalized or product.get("id") == normalized)
                and (not published_only or product.get("status") == "active")
            ),
            None,
        )
        return deepcopy(item) if item else None


class CatalogService:
    def __init__(self, repository: CatalogRepository):
        self.repository = repository

    def list_products(self, published_only: bool = False) -> list[dict[str, Any]]:
        return self.repository.list(published_only=published_only)

    def get_product(self, slug: str, published_only: bool = False) -> dict[str, Any]:
        product = self.repository.get(slug, published_only=published_only)
        if not product:
            raise DomainError(404, "PRODUCT_NOT_FOUND", "Product was not found.")
        return product

    def snapshot_item(self, item: dict[str, Any]) -> dict[str, Any]:
        product_id = str(item.get("productId") or item.get("productSlug") or "")
        product = self.repository.get(product_id)
        if not product:
            raise DomainError(422, "PRODUCT_NOT_FOUND", f"Unknown pre-order product: {product_id}")
        quantity = item.get("quantity")
        if not isinstance(quantity, int) or isinstance(quantity, bool) or quantity < 1 or quantity > 1000:
            raise DomainError(422, "VALIDATION_ERROR", "Each pre-order item quantity must be between 1 and 1000.")
        variant_id = item.get("variantId")
        variant = None
        if variant_id:
            variant = next((value for value in product.get("variants", []) if value.get("id") == variant_id), None)
            if not variant:
                raise DomainError(422, "VARIANT_NOT_FOUND", f"Unknown variant for {product['slug']}.")
        snapshot = {
            "productId": product["id"],
            "productSlug": product["slug"],
            "productName": product["name"],
            "quantity": quantity,
            "variantId": variant.get("id") if variant else None,
            "variantName": variant.get("label") if variant else None,
        }
        for optional in ("giftMessage", "deliveryPreference"):
            if item.get(optional):
                snapshot[optional] = item[optional]
        return snapshot


def _load_seed(path: Path) -> list[dict[str, Any]]:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else []


def _etag(data: Any) -> str:
    encoded = json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return f'"{hashlib.sha256(encoded).hexdigest()}"'


router = APIRouter(tags=["catalog"])


def _cached_response(request: Request, data: Any) -> Response | dict[str, Any]:
    tag = _etag(data)
    if request.headers.get("if-none-match") == tag:
        return Response(status_code=304, headers={"ETag": tag, "Cache-Control": "public, max-age=60"})
    from fastapi.responses import JSONResponse

    return JSONResponse(success(data), headers={"ETag": tag, "Cache-Control": "public, max-age=60"})


@router.get("/products", response_model=None)
async def list_products(request: Request):
    published_only = request.url.path.startswith(f"{request.app.state.settings.api_prefix}/v1/")
    return _cached_response(request, request.app.state.services.catalog.list_products(published_only=published_only))


@router.get("/products/{slug}", response_model=None)
async def get_product(slug: str, request: Request):
    published_only = request.url.path.startswith(f"{request.app.state.settings.api_prefix}/v1/")
    return _cached_response(
        request,
        request.app.state.services.catalog.get_product(slug, published_only=published_only),
    )

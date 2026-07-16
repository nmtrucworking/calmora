from fastapi import APIRouter

from app.core.errors import success

router = APIRouter(tags=["system"])


@router.get("/health")
async def health():
    return success({"status": "ok"})

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", case_sensitive=False)

    app_env: Literal["local", "test", "staging", "production"] = "local"
    api_prefix: str = "/api"
    database_url: str = ""
    frontend_origins: str = "http://localhost:5173,http://localhost:5175,http://localhost:4173"
    submission_rate_limit_per_minute: int = Field(default=10, ge=1, le=10_000)
    receipt_secret: str = "local-development-receipt-secret-change-me"
    max_request_bytes: int = Field(default=65_536, ge=1_024, le=10_485_760)
    trusted_proxy_ips: str = ""
    log_level: str = "INFO"

    @field_validator("api_prefix")
    @classmethod
    def validate_api_prefix(cls, value: str) -> str:
        value = value.rstrip("/")
        if not value.startswith("/") or value == "":
            raise ValueError("API_PREFIX must be an absolute path")
        return value

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]

    @property
    def trusted_proxies(self) -> set[str]:
        return {value.strip() for value in self.trusted_proxy_ips.split(",") if value.strip()}

    @model_validator(mode="after")
    def validate_deployment_settings(self) -> Settings:
        if self.app_env in {"staging", "production"}:
            if not self.database_url:
                raise ValueError("DATABASE_URL is required outside local/test")
            if len(self.receipt_secret) < 32 or "change-me" in self.receipt_secret:
                raise ValueError("RECEIPT_SECRET must be a unique secret of at least 32 characters")
            if not self.cors_origins or "*" in self.cors_origins:
                raise ValueError("FRONTEND_ORIGINS must explicitly list allowed origins")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()

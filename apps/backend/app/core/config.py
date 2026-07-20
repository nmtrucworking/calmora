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
    admin_email: str = ""
    admin_name: str = "Senova Administrator"
    admin_password: str = Field(default="", repr=False)
    trace_secret_pepper: str = Field(default="local-trace-secret-pepper-change-me", repr=False)
    ledger_adapter: Literal["database", "evm", "fabric"] = "database"
    ledger_network: str = "database-local"
    ledger_rpc_url: str = ""
    ledger_contract_address: str = ""
    ledger_signer_key_ref: str = Field(default="", repr=False)
    ledger_confirmations: int = Field(default=1, ge=1, le=100)
    ledger_outbox_batch_size: int = Field(default=20, ge=1, le=100)

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
        if bool(self.admin_email) != bool(self.admin_password):
            raise ValueError("ADMIN_EMAIL and ADMIN_PASSWORD must be configured together")
        if self.admin_password and len(self.admin_password) < 12:
            raise ValueError("ADMIN_PASSWORD must contain at least 12 characters")
        if self.admin_email and "@" not in self.admin_email:
            raise ValueError("ADMIN_EMAIL must be a valid email address")
        if self.app_env in {"staging", "production"}:
            if not self.database_url:
                raise ValueError("DATABASE_URL is required outside local/test")
            if len(self.receipt_secret) < 32 or "change-me" in self.receipt_secret:
                raise ValueError("RECEIPT_SECRET must be a unique secret of at least 32 characters")
            if len(self.trace_secret_pepper) < 32 or "change-me" in self.trace_secret_pepper:
                raise ValueError("TRACE_SECRET_PEPPER must be a unique secret of at least 32 characters")
            if not self.cors_origins or "*" in self.cors_origins:
                raise ValueError("FRONTEND_ORIGINS must explicitly list allowed origins")
        if self.ledger_adapter == "evm":
            if not self.ledger_rpc_url or not self.ledger_contract_address or not self.ledger_signer_key_ref:
                raise ValueError(
                    "LEDGER_RPC_URL, LEDGER_CONTRACT_ADDRESS and LEDGER_SIGNER_KEY_REF are required for EVM"
                )
            if not self.ledger_signer_key_ref.startswith("env:"):
                raise ValueError("LEDGER_SIGNER_KEY_REF must use env:<VARIABLE_NAME>")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()

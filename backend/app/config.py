"""Application configuration using Pydantic Settings."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    openai_api_key: str = Field(min_length=1)
    openai_model: str = "gpt-4o-mini"
    openai_max_tokens: int = Field(default=500, ge=64, le=2000)
    openai_max_input_tokens: int = Field(default=2200, ge=256, le=120000)
    openai_max_total_tokens: int = Field(default=2800, ge=512, le=128000)
    enable_ip_daily_token_limit: bool = True
    ip_daily_token_limit: int = Field(default=10000, ge=100, le=5000000)
    allowed_origins: str = "http://localhost:3000"
    allowed_origin_regex: str = ""
    allowed_hosts: str = "localhost,127.0.0.1,testserver"
    enforce_https: bool = False
    rate_limit_requests: int = Field(default=20, ge=1, le=1000)
    rate_limit_window: int = Field(default=3600, ge=1, le=86400)

    @property
    def allowed_origins_list(self) -> list[str]:
        """Parse comma-separated origins into a list."""
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def allowed_hosts_list(self) -> list[str]:
        """Parse comma-separated hosts into a list."""
        return [host.strip() for host in self.allowed_hosts.split(",") if host.strip()]


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

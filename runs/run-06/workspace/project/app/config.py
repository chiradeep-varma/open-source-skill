from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "SlotPilot"
    base_url: str = "http://localhost:8000"
    database_url: str = "sqlite:///./data/slotpilot.db"
    session_secret: str = "change-me-in-production"

    google_client_id: str = ""
    google_client_secret: str = ""

    # Comma-separated list of the firm's Google account emails allowed to log into /admin.
    team_emails: str = ""

    default_min_notice_hours: int = 4
    default_booking_window_days: int = 21

    @property
    def team_email_set(self) -> set[str]:
        return {e.strip().lower() for e in self.team_emails.split(",") if e.strip()}


@lru_cache
def get_settings() -> Settings:
    return Settings()

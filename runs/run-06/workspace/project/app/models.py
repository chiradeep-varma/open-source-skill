import secrets
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class LocationType(str, Enum):
    google_meet = "google_meet"
    phone = "phone"
    custom = "custom"


class BookingStatus(str, Enum):
    confirmed = "confirmed"
    canceled = "canceled"


class User(SQLModel, table=True):
    """A team member (consultant) with a connected Google Calendar."""

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    name: str
    slug: str = Field(index=True, unique=True)
    timezone: str = Field(default="UTC")
    google_calendar_id: str = Field(default="primary")

    # OAuth refresh token used to mint access tokens server-side. In production, put this
    # behind field-level encryption (e.g. via a KMS-backed column) rather than plaintext.
    google_refresh_token: Optional[str] = None

    created_at: datetime = Field(default_factory=utcnow)


class AvailabilityRule(SQLModel, table=True):
    """One recurring weekly availability window, in the owning user's local timezone."""

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    weekday: int  # 0 = Monday ... 6 = Sunday
    start_minute: int  # minutes since local midnight
    end_minute: int


class EventType(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    slug: str = Field(index=True)
    name: str
    description: str = ""
    duration_minutes: int = 30
    buffer_before_minutes: int = 0
    buffer_after_minutes: int = 0
    min_notice_hours: int = 4
    booking_window_days: int = 21
    location_type: LocationType = LocationType.google_meet
    location_detail: str = ""
    is_active: bool = True


class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_type_id: int = Field(foreign_key="eventtype.id", index=True)
    invitee_name: str
    invitee_email: str
    start_utc: datetime
    end_utc: datetime
    google_event_id: Optional[str] = None
    status: BookingStatus = BookingStatus.confirmed
    cancel_token: str = Field(default_factory=lambda: secrets.token_urlsafe(24), index=True)
    created_at: datetime = Field(default_factory=utcnow)

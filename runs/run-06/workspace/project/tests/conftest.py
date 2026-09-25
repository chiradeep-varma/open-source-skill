import os

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SESSION_SECRET", "test-secret")
os.environ.setdefault("GOOGLE_CLIENT_ID", "test-client-id")
os.environ.setdefault("GOOGLE_CLIENT_SECRET", "test-client-secret")
os.environ.setdefault("TEAM_EMAILS", "alice@example.com")
os.environ.setdefault("BASE_URL", "http://testserver")

import pytest
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app import db as db_module
from app.models import AvailabilityRule, EventType, User


@pytest.fixture
def session():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    SQLModel.metadata.create_all(engine)
    db_module.engine = engine
    with Session(engine) as s:
        yield s


@pytest.fixture
def host_with_event_type(session):
    user = User(
        email="alice@example.com",
        name="Alice",
        slug="alice",
        timezone="UTC",
        google_refresh_token="fake-refresh-token",
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    session.add(AvailabilityRule(user_id=user.id, weekday=0, start_minute=0, end_minute=24 * 60))
    session.add(AvailabilityRule(user_id=user.id, weekday=1, start_minute=0, end_minute=24 * 60))
    session.add(AvailabilityRule(user_id=user.id, weekday=2, start_minute=0, end_minute=24 * 60))
    session.add(AvailabilityRule(user_id=user.id, weekday=3, start_minute=0, end_minute=24 * 60))
    session.add(AvailabilityRule(user_id=user.id, weekday=4, start_minute=0, end_minute=24 * 60))
    session.add(AvailabilityRule(user_id=user.id, weekday=5, start_minute=0, end_minute=24 * 60))
    session.add(AvailabilityRule(user_id=user.id, weekday=6, start_minute=0, end_minute=24 * 60))

    event_type = EventType(
        user_id=user.id,
        slug="intro",
        name="Intro call",
        duration_minutes=30,
        min_notice_hours=0,
        booking_window_days=3,
    )
    session.add(event_type)
    session.commit()
    session.refresh(event_type)
    return user, event_type

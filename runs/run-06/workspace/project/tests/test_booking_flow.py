import re

from fastapi.testclient import TestClient
from sqlmodel import select

from app import google_calendar
from app.main import app
from app.models import Booking, BookingStatus


def test_full_booking_and_cancel_flow(monkeypatch, session, host_with_event_type):
    host, event_type = host_with_event_type

    monkeypatch.setattr(google_calendar, "get_busy_intervals", lambda *a, **k: [])
    monkeypatch.setattr(
        google_calendar,
        "create_event",
        lambda **kwargs: {"id": "fake-google-event-id"},
    )
    deleted = {}
    monkeypatch.setattr(
        google_calendar,
        "delete_event",
        lambda refresh_token, calendar_id, event_id: deleted.update(id=event_id),
    )

    with TestClient(app) as client:
        # No tz yet -> timezone-detection stub page.
        resp = client.get("/alice/intro")
        assert resp.status_code == 200
        assert "Detecting your time zone" in resp.text

        # With tz -> real booking page with at least one open slot.
        resp = client.get("/alice/intro", params={"tz": "UTC"})
        assert resp.status_code == 200
        match = re.search(r'data-iso="([^"]+)"', resp.text)
        assert match, "expected at least one bookable slot"
        slot_iso = match.group(1)

        # Book it.
        resp = client.post(
            "/alice/intro/book",
            data={
                "start": slot_iso,
                "tz": "UTC",
                "invitee_name": "Client Carol",
                "invitee_email": "carol@client.com",
            },
            follow_redirects=False,
        )
        assert resp.status_code == 303
        confirmation_url = resp.headers["location"]

        resp = client.get(confirmation_url)
        assert resp.status_code == 200
        assert "You're booked!" in resp.text

    booking = session.exec(select(Booking)).one()
    assert booking.google_event_id == "fake-google-event-id"
    assert booking.status == BookingStatus.confirmed
    assert booking.invitee_email == "carol@client.com"

    with TestClient(app) as client:
        resp = client.post(f"/b/{booking.cancel_token}/cancel", follow_redirects=False)
        assert resp.status_code == 303

    session.refresh(booking)
    assert booking.status == BookingStatus.canceled
    assert deleted["id"] == "fake-google-event-id"


def test_double_booking_is_rejected(monkeypatch, session, host_with_event_type):
    host, event_type = host_with_event_type
    monkeypatch.setattr(google_calendar, "get_busy_intervals", lambda *a, **k: [])
    monkeypatch.setattr(google_calendar, "create_event", lambda **kwargs: {"id": "evt-1"})

    with TestClient(app) as client:
        resp = client.get("/alice/intro", params={"tz": "UTC"})
        slot_iso = re.search(r'data-iso="([^"]+)"', resp.text).group(1)

        book_data = {
            "start": slot_iso,
            "tz": "UTC",
            "invitee_name": "First Client",
            "invitee_email": "first@client.com",
        }
        resp = client.post("/alice/intro/book", data=book_data, follow_redirects=False)
        assert resp.status_code == 303

        # Simulate the slot now being busy on Google's side (e.g. booked elsewhere,
        # or a race with another invitee) and try to book the exact same slot again.
        from app.availability import Interval
        from datetime import datetime, timedelta

        start_dt = datetime.fromisoformat(slot_iso)
        monkeypatch.setattr(
            google_calendar,
            "get_busy_intervals",
            lambda *a, **k: [Interval(start=start_dt, end=start_dt + timedelta(minutes=30))],
        )

        resp = client.post(
            "/alice/intro/book",
            data={**book_data, "invitee_email": "second@client.com"},
            follow_redirects=False,
        )
        assert resp.status_code == 409
        assert "just booked by someone else" in resp.text

    bookings = session.exec(select(Booking)).all()
    assert len(bookings) == 1

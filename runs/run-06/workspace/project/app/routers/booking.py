from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo, available_timezones

from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlmodel import Session, select

from app import google_calendar
from app.availability import Interval, WeeklyRule, compute_available_slots
from app.db import get_session
from app.models import AvailabilityRule, Booking, BookingStatus, EventType, LocationType, User

router = APIRouter(tags=["booking"])
templates = Jinja2Templates(directory="app/templates")


def _get_host_and_event_type(session: Session, user_slug: str, event_slug: str):
    user = session.exec(select(User).where(User.slug == user_slug)).first()
    if not user:
        return None, None
    event_type = session.exec(
        select(EventType).where(
            EventType.user_id == user.id, EventType.slug == event_slug, EventType.is_active == True  # noqa: E712
        )
    ).first()
    return user, event_type


def _weekly_rules(session: Session, user_id: int) -> list[WeeklyRule]:
    rules = session.exec(select(AvailabilityRule).where(AvailabilityRule.user_id == user_id)).all()
    return [WeeklyRule(weekday=r.weekday, start_minute=r.start_minute, end_minute=r.end_minute) for r in rules]


# These two routes are registered BEFORE the /{user_slug}/{event_slug} catch-all
# below on purpose: Starlette matches routes in registration order, and
# "/b/<token>" has the same two-segment shape as a booking page URL. Registering
# it first means "/b/xyz" is always tried against this route before it's ever
# considered as user_slug="b", event_slug="xyz" on the catch-all.
@router.get("/b/{token}")
def booking_confirmation(request: Request, token: str, session: Session = Depends(get_session)):
    booking = session.exec(select(Booking).where(Booking.cancel_token == token)).first()
    if not booking:
        return templates.TemplateResponse(
            request, "booking/not_found.html", {"user": None, "messages": []}, status_code=404
        )
    event_type = session.get(EventType, booking.event_type_id)
    host = session.get(User, event_type.user_id) if event_type else None
    return templates.TemplateResponse(
        request,
        "booking/confirmation.html",
        {"user": None, "messages": [], "booking": booking, "event_type": event_type, "host": host},
    )


@router.post("/b/{token}/cancel")
def booking_cancel(request: Request, token: str, session: Session = Depends(get_session)):
    booking = session.exec(select(Booking).where(Booking.cancel_token == token)).first()
    if not booking:
        return RedirectResponse("/", status_code=303)
    event_type = session.get(EventType, booking.event_type_id)
    host = session.get(User, event_type.user_id) if event_type else None

    if booking.status == BookingStatus.confirmed and booking.google_event_id and host and host.google_refresh_token:
        google_calendar.delete_event(host.google_refresh_token, host.google_calendar_id, booking.google_event_id)
    booking.status = BookingStatus.canceled
    session.add(booking)
    session.commit()
    return RedirectResponse(f"/b/{token}", status_code=303)


@router.get("/{user_slug}/{event_slug}")
def booking_page(
    request: Request, user_slug: str, event_slug: str, tz: str | None = None, session: Session = Depends(get_session)
):
    user, event_type = _get_host_and_event_type(session, user_slug, event_slug)
    if not user or not event_type:
        return templates.TemplateResponse(
            request, "booking/not_found.html", {"user": None, "messages": []}, status_code=404
        )

    if not tz or tz not in available_timezones():
        return templates.TemplateResponse(
            request,
            "booking/detect_timezone.html",
            {"user": None, "messages": [], "fallback_tz": user.timezone},
        )

    if not user.google_refresh_token:
        return templates.TemplateResponse(
            request,
            "booking/not_found.html",
            {"user": None, "messages": ["This host hasn't connected their calendar yet."]},
            status_code=503,
        )

    now = datetime.now(timezone.utc)
    window_end = now + timedelta(days=event_type.booking_window_days)
    busy = google_calendar.get_busy_intervals(
        user.google_refresh_token, user.google_calendar_id, now, window_end
    )
    rules = _weekly_rules(session, user.id)
    slots = compute_available_slots(
        rules=rules,
        user_timezone=user.timezone,
        duration_minutes=event_type.duration_minutes,
        buffer_before_minutes=event_type.buffer_before_minutes,
        buffer_after_minutes=event_type.buffer_after_minutes,
        min_notice_hours=event_type.min_notice_hours,
        booking_window_days=event_type.booking_window_days,
        busy=busy,
        now_utc=now,
    )

    invitee_tz = ZoneInfo(tz)
    days: dict[str, list[dict]] = {}
    for slot in slots:
        local_start = slot.start.astimezone(invitee_tz)
        day_label = local_start.strftime("%A, %B %-d")
        days.setdefault(day_label, []).append(
            {"iso": slot.start.isoformat(), "label": local_start.strftime("%-I:%M %p")}
        )

    return templates.TemplateResponse(
        request,
        "booking/page.html",
        {
            "user": None,
            "messages": [],
            "host": user,
            "event_type": event_type,
            "days": days,
            "tz": tz,
        },
    )


@router.post("/{user_slug}/{event_slug}/book")
async def create_booking(
    request: Request, user_slug: str, event_slug: str, session: Session = Depends(get_session)
):
    user, event_type = _get_host_and_event_type(session, user_slug, event_slug)
    if not user or not event_type:
        return RedirectResponse(f"/{user_slug}/{event_slug}", status_code=303)

    form = await request.form()
    start_utc = datetime.fromisoformat(form["start"])
    tz = form.get("tz", user.timezone)
    invitee_name = form["invitee_name"].strip()
    invitee_email = form["invitee_email"].strip()
    end_utc = start_utc + timedelta(minutes=event_type.duration_minutes)

    # Re-verify the slot is still free right before booking, to close the race
    # window between the page rendering and the form submitting.
    check_start = start_utc - timedelta(minutes=event_type.buffer_before_minutes)
    check_end = end_utc + timedelta(minutes=event_type.buffer_after_minutes)
    busy = google_calendar.get_busy_intervals(
        user.google_refresh_token, user.google_calendar_id, check_start, check_end
    )
    still_free = not any(b.start < check_end and b.end > check_start for b in busy)
    if not still_free:
        return templates.TemplateResponse(
            request,
            "booking/not_found.html",
            {
                "user": None,
                "messages": ["Sorry, that slot was just booked by someone else. Please pick another time."],
            },
            status_code=409,
        )

    event = google_calendar.create_event(
        refresh_token=user.google_refresh_token,
        calendar_id=user.google_calendar_id,
        summary=f"{event_type.name} with {invitee_name}",
        description=event_type.description,
        start_utc=start_utc,
        end_utc=end_utc,
        attendee_email=invitee_email,
        attendee_name=invitee_name,
        want_meet_link=event_type.location_type == LocationType.google_meet,
    )

    booking = Booking(
        event_type_id=event_type.id,
        invitee_name=invitee_name,
        invitee_email=invitee_email,
        start_utc=start_utc,
        end_utc=end_utc,
        google_event_id=event.get("id"),
        status=BookingStatus.confirmed,
    )
    session.add(booking)
    session.commit()
    session.refresh(booking)

    return RedirectResponse(f"/b/{booking.cancel_token}", status_code=303)

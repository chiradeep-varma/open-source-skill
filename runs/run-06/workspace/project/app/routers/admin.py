from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from sqlmodel import Session, select

from app import google_calendar
from app.auth import get_current_user
from app.config import get_settings
from app.db import get_session
from app.models import AvailabilityRule, Booking, BookingStatus, EventType, LocationType, User
from app.utils import slugify

router = APIRouter(prefix="/admin", tags=["admin"])
templates = Jinja2Templates(directory="app/templates")
settings = get_settings()

WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _minutes_to_hhmm(minutes: int) -> str:
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def _hhmm_to_minutes(value: str) -> int:
    hh, mm = value.split(":")
    return int(hh) * 60 + int(mm)


@router.get("/login")
def login_page(request: Request):
    return templates.TemplateResponse(
        request, "admin/login.html", {"user": None, "messages": []}
    )


@router.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/admin/login")


@router.get("/oauth/start")
def oauth_start(request: Request):
    flow = google_calendar.build_auth_flow()
    auth_url, state = flow.authorization_url(
        access_type="offline", prompt="consent", include_granted_scopes="true"
    )
    request.session["oauth_state"] = state
    return RedirectResponse(auth_url)


@router.get("/oauth/callback")
def oauth_callback(request: Request, code: str, state: str, session: Session = Depends(get_session)):
    if state != request.session.get("oauth_state"):
        return RedirectResponse("/admin/login?error=state_mismatch")

    flow = google_calendar.build_auth_flow()
    flow.fetch_token(code=code)
    creds = flow.credentials

    claims = google_id_token.verify_oauth2_token(
        creds.id_token, google_requests.Request(), settings.google_client_id
    )
    email = claims["email"].lower()
    name = claims.get("name", email.split("@")[0])

    if email not in settings.team_email_set:
        return RedirectResponse("/admin/login?error=not_authorized")

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        base_slug = slugify(email.split("@")[0])
        slug = base_slug
        i = 1
        while session.exec(select(User).where(User.slug == slug)).first():
            i += 1
            slug = f"{base_slug}-{i}"
        user = User(email=email, name=name, slug=slug, timezone="UTC")

    if creds.refresh_token:
        user.google_refresh_token = creds.refresh_token
    session.add(user)
    session.commit()
    session.refresh(user)

    if not user.google_refresh_token:
        return RedirectResponse(
            "/admin/login?error=no_refresh_token_reconsent_required"
        )

    request.session["user_id"] = user.id
    return RedirectResponse("/admin")


@router.get("")
def dashboard(
    request: Request, user: User = Depends(get_current_user), session: Session = Depends(get_session)
):
    event_types = session.exec(select(EventType).where(EventType.user_id == user.id)).all()
    return templates.TemplateResponse(
        request,
        "admin/dashboard.html",
        {
            "user": user,
            "messages": [],
            "event_types": event_types,
            "base_url": settings.base_url,
        },
    )


@router.get("/availability")
def availability_page(
    request: Request, user: User = Depends(get_current_user), session: Session = Depends(get_session)
):
    rules = session.exec(
        select(AvailabilityRule).where(AvailabilityRule.user_id == user.id)
    ).all()
    rules_by_weekday = {r.weekday: r for r in rules}
    days = [
        {
            "index": i,
            "label": WEEKDAYS[i],
            "enabled": i in rules_by_weekday,
            "start": _minutes_to_hhmm(rules_by_weekday[i].start_minute) if i in rules_by_weekday else "09:00",
            "end": _minutes_to_hhmm(rules_by_weekday[i].end_minute) if i in rules_by_weekday else "17:00",
        }
        for i in range(7)
    ]
    return templates.TemplateResponse(
        request,
        "admin/availability.html",
        {"user": user, "messages": [], "days": days},
    )


@router.post("/availability")
async def availability_save(
    request: Request, user: User = Depends(get_current_user), session: Session = Depends(get_session)
):
    form = await request.form()
    tz_name = form.get("timezone", "UTC").strip() or "UTC"
    user.timezone = tz_name
    session.add(user)

    existing = session.exec(
        select(AvailabilityRule).where(AvailabilityRule.user_id == user.id)
    ).all()
    for r in existing:
        session.delete(r)

    for i in range(7):
        if form.get(f"enabled_{i}"):
            start = _hhmm_to_minutes(form.get(f"start_{i}", "09:00"))
            end = _hhmm_to_minutes(form.get(f"end_{i}", "17:00"))
            if end > start:
                session.add(
                    AvailabilityRule(user_id=user.id, weekday=i, start_minute=start, end_minute=end)
                )
    session.commit()
    return RedirectResponse("/admin/availability", status_code=303)


@router.get("/event-types/new")
def event_type_new(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(
        request,
        "admin/event_type_form.html",
        {"user": user, "messages": [], "event_type": None, "locations": list(LocationType)},
    )


@router.post("/event-types/new")
async def event_type_create(
    request: Request, user: User = Depends(get_current_user), session: Session = Depends(get_session)
):
    form = await request.form()
    name = form["name"].strip()
    base_slug = slugify(name)
    slug = base_slug
    i = 1
    while session.exec(
        select(EventType).where(EventType.user_id == user.id, EventType.slug == slug)
    ).first():
        i += 1
        slug = f"{base_slug}-{i}"

    et = EventType(
        user_id=user.id,
        slug=slug,
        name=name,
        description=form.get("description", ""),
        duration_minutes=int(form.get("duration_minutes", 30)),
        buffer_before_minutes=int(form.get("buffer_before_minutes", 0)),
        buffer_after_minutes=int(form.get("buffer_after_minutes", 0)),
        min_notice_hours=int(form.get("min_notice_hours", settings.default_min_notice_hours)),
        booking_window_days=int(form.get("booking_window_days", settings.default_booking_window_days)),
        location_type=LocationType(form.get("location_type", "google_meet")),
        location_detail=form.get("location_detail", ""),
    )
    session.add(et)
    session.commit()
    return RedirectResponse("/admin", status_code=303)


@router.get("/event-types/{event_type_id}/edit")
def event_type_edit(
    request: Request,
    event_type_id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    et = session.get(EventType, event_type_id)
    if not et or et.user_id != user.id:
        return RedirectResponse("/admin")
    return templates.TemplateResponse(
        request,
        "admin/event_type_form.html",
        {"user": user, "messages": [], "event_type": et, "locations": list(LocationType)},
    )


@router.post("/event-types/{event_type_id}/edit")
async def event_type_update(
    request: Request,
    event_type_id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    et = session.get(EventType, event_type_id)
    if not et or et.user_id != user.id:
        return RedirectResponse("/admin")
    form = await request.form()
    et.name = form["name"].strip()
    et.description = form.get("description", "")
    et.duration_minutes = int(form.get("duration_minutes", 30))
    et.buffer_before_minutes = int(form.get("buffer_before_minutes", 0))
    et.buffer_after_minutes = int(form.get("buffer_after_minutes", 0))
    et.min_notice_hours = int(form.get("min_notice_hours", 4))
    et.booking_window_days = int(form.get("booking_window_days", 21))
    et.location_type = LocationType(form.get("location_type", "google_meet"))
    et.location_detail = form.get("location_detail", "")
    et.is_active = bool(form.get("is_active"))
    session.add(et)
    session.commit()
    return RedirectResponse("/admin", status_code=303)


@router.post("/event-types/{event_type_id}/delete")
def event_type_delete(
    event_type_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)
):
    et = session.get(EventType, event_type_id)
    if et and et.user_id == user.id:
        session.delete(et)
        session.commit()
    return RedirectResponse("/admin", status_code=303)


@router.get("/bookings")
def admin_bookings(
    request: Request, user: User = Depends(get_current_user), session: Session = Depends(get_session)
):
    event_type_ids = [
        et.id for et in session.exec(select(EventType).where(EventType.user_id == user.id)).all()
    ]
    bookings = []
    if event_type_ids:
        bookings = session.exec(
            select(Booking)
            .where(Booking.event_type_id.in_(event_type_ids))
            .where(Booking.start_utc >= datetime.now(timezone.utc))
            .order_by(Booking.start_utc)
        ).all()
    return templates.TemplateResponse(
        request, "admin/bookings.html", {"user": user, "messages": [], "bookings": bookings}
    )


@router.post("/bookings/{booking_id}/cancel")
def admin_cancel_booking(
    booking_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)
):
    booking = session.get(Booking, booking_id)
    if not booking:
        return RedirectResponse("/admin/bookings", status_code=303)
    et = session.get(EventType, booking.event_type_id)
    if not et or et.user_id != user.id:
        return RedirectResponse("/admin/bookings", status_code=303)

    if booking.status == BookingStatus.confirmed and booking.google_event_id:
        google_calendar.delete_event(user.google_refresh_token, user.google_calendar_id, booking.google_event_id)
    booking.status = BookingStatus.canceled
    session.add(booking)
    session.commit()
    return RedirectResponse("/admin/bookings", status_code=303)

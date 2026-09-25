"""Thin wrapper around the Google Calendar + OAuth APIs.

Everything SlotPilot needs from Google fits in four calls: build an authorization
URL, exchange a code for tokens, read free/busy, and create/delete an event. No
SMTP is needed — Calendar's own `sendUpdates="all"` emails the invitee.
"""

from datetime import datetime

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from app.availability import Interval
from app.config import get_settings

SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
]
TOKEN_URI = "https://oauth2.googleapis.com/token"
AUTH_URI = "https://accounts.google.com/o/oauth2/auth"


def _client_config() -> dict:
    settings = get_settings()
    return {
        "web": {
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "auth_uri": AUTH_URI,
            "token_uri": TOKEN_URI,
            "redirect_uris": [f"{settings.base_url}/admin/oauth/callback"],
        }
    }


def build_auth_flow() -> Flow:
    settings = get_settings()
    flow = Flow.from_client_config(_client_config(), scopes=SCOPES)
    flow.redirect_uri = f"{settings.base_url}/admin/oauth/callback"
    return flow


def credentials_from_refresh_token(refresh_token: str) -> Credentials:
    settings = get_settings()
    return Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri=TOKEN_URI,
        client_id=settings.google_client_id,
        client_secret=settings.google_client_secret,
        scopes=SCOPES,
    )


def get_busy_intervals(
    refresh_token: str, calendar_id: str, time_min: datetime, time_max: datetime
) -> list[Interval]:
    creds = credentials_from_refresh_token(refresh_token)
    service = build("calendar", "v3", credentials=creds, cache_discovery=False)
    body = {
        "timeMin": time_min.isoformat(),
        "timeMax": time_max.isoformat(),
        "items": [{"id": calendar_id}],
    }
    result = service.freebusy().query(body=body).execute()
    busy = result["calendars"][calendar_id].get("busy", [])
    return [
        Interval(
            start=datetime.fromisoformat(b["start"]),
            end=datetime.fromisoformat(b["end"]),
        )
        for b in busy
    ]


def create_event(
    *,
    refresh_token: str,
    calendar_id: str,
    summary: str,
    description: str,
    start_utc: datetime,
    end_utc: datetime,
    attendee_email: str,
    attendee_name: str,
    want_meet_link: bool,
) -> dict:
    creds = credentials_from_refresh_token(refresh_token)
    service = build("calendar", "v3", credentials=creds, cache_discovery=False)

    event_body: dict = {
        "summary": summary,
        "description": description,
        "start": {"dateTime": start_utc.isoformat()},
        "end": {"dateTime": end_utc.isoformat()},
        "attendees": [{"email": attendee_email, "displayName": attendee_name}],
    }
    if want_meet_link:
        event_body["conferenceData"] = {
            "createRequest": {
                "requestId": f"slotpilot-{start_utc.timestamp():.0f}",
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        }

    created = (
        service.events()
        .insert(
            calendarId=calendar_id,
            body=event_body,
            sendUpdates="all",
            conferenceDataVersion=1 if want_meet_link else 0,
        )
        .execute()
    )
    return created


def delete_event(refresh_token: str, calendar_id: str, event_id: str) -> None:
    creds = credentials_from_refresh_token(refresh_token)
    service = build("calendar", "v3", credentials=creds, cache_discovery=False)
    service.events().delete(
        calendarId=calendar_id, eventId=event_id, sendUpdates="all"
    ).execute()

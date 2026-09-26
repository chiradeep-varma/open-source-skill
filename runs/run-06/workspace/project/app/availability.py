"""Pure slot-computation logic: the one genuinely hard part of a scheduling tool.

Kept free of DB/HTTP concerns so it's cheap to unit test: given a set of weekly
availability rules, a timezone, a list of busy intervals (from Google Calendar
free/busy), and an event type's duration/buffer/notice/window rules, produce the
list of bookable UTC slots.
"""

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo


@dataclass(frozen=True)
class Interval:
    start: datetime  # tz-aware, UTC
    end: datetime  # tz-aware, UTC


@dataclass(frozen=True)
class WeeklyRule:
    weekday: int  # 0 = Monday ... 6 = Sunday
    start_minute: int  # minutes since local midnight
    end_minute: int


def _overlaps(a_start: datetime, a_end: datetime, b: Interval) -> bool:
    return a_start < b.end and a_end > b.start


def compute_available_slots(
    *,
    rules: list[WeeklyRule],
    user_timezone: str,
    duration_minutes: int,
    buffer_before_minutes: int,
    buffer_after_minutes: int,
    min_notice_hours: int,
    booking_window_days: int,
    busy: list[Interval],
    now_utc: datetime | None = None,
) -> list[Interval]:
    """Return bookable slots as UTC intervals, earliest first.

    A slot is bookable when it falls inside a weekly availability rule, starts no
    sooner than `min_notice_hours` from now, starts no later than
    `booking_window_days` out, and — once expanded by the event type's buffers —
    does not overlap any interval in `busy`.
    """
    if now_utc is None:
        now_utc = datetime.now(timezone.utc)
    if duration_minutes <= 0:
        raise ValueError("duration_minutes must be positive")

    tz = ZoneInfo(user_timezone)
    earliest_start = now_utc + timedelta(hours=min_notice_hours)
    window_end = now_utc + timedelta(days=booking_window_days)

    by_weekday: dict[int, list[WeeklyRule]] = {}
    for rule in rules:
        by_weekday.setdefault(rule.weekday, []).append(rule)

    slots: list[Interval] = []
    # Walk local calendar days from "today" (in the host's timezone) through the
    # booking window, generating candidate slots within each day's rules.
    day_cursor = now_utc.astimezone(tz).replace(hour=0, minute=0, second=0, microsecond=0)
    window_end_local = window_end.astimezone(tz)

    while day_cursor <= window_end_local:
        for rule in by_weekday.get(day_cursor.weekday(), []):
            slot_local_start = day_cursor.replace(
                hour=0, minute=0, second=0, microsecond=0
            ) + timedelta(minutes=rule.start_minute)
            rule_end_local = day_cursor.replace(
                hour=0, minute=0, second=0, microsecond=0
            ) + timedelta(minutes=rule.end_minute)

            while slot_local_start + timedelta(minutes=duration_minutes) <= rule_end_local:
                slot_start_utc = slot_local_start.astimezone(timezone.utc)
                slot_end_utc = slot_start_utc + timedelta(minutes=duration_minutes)

                if earliest_start <= slot_start_utc <= window_end:
                    check_start = slot_start_utc - timedelta(minutes=buffer_before_minutes)
                    check_end = slot_end_utc + timedelta(minutes=buffer_after_minutes)
                    if not any(_overlaps(check_start, check_end, b) for b in busy):
                        slots.append(Interval(start=slot_start_utc, end=slot_end_utc))

                slot_local_start += timedelta(minutes=duration_minutes)
        day_cursor += timedelta(days=1)

    slots.sort(key=lambda i: i.start)
    return slots

from datetime import datetime, timedelta, timezone

from app.availability import Interval, WeeklyRule, compute_available_slots

UTC = timezone.utc


def test_generates_slots_within_open_availability():
    now = datetime(2026, 3, 2, 8, 0, tzinfo=UTC)  # a Monday
    rules = [WeeklyRule(weekday=0, start_minute=9 * 60, end_minute=17 * 60)]  # Mon 9-17

    slots = compute_available_slots(
        rules=rules,
        user_timezone="UTC",
        duration_minutes=30,
        buffer_before_minutes=0,
        buffer_after_minutes=0,
        min_notice_hours=0,
        booking_window_days=7,
        busy=[],
        now_utc=now,
    )

    assert len(slots) > 0
    for slot in slots:
        assert slot.start.weekday() == 0
        assert 9 * 60 <= slot.start.hour * 60 + slot.start.minute < 17 * 60
        assert (slot.end - slot.start) == timedelta(minutes=30)


def test_min_notice_excludes_too_soon_slots():
    now = datetime(2026, 3, 2, 8, 0, tzinfo=UTC)
    rules = [WeeklyRule(weekday=0, start_minute=0, end_minute=24 * 60)]

    slots = compute_available_slots(
        rules=rules,
        user_timezone="UTC",
        duration_minutes=30,
        buffer_before_minutes=0,
        buffer_after_minutes=0,
        min_notice_hours=4,
        booking_window_days=7,
        busy=[],
        now_utc=now,
    )

    earliest_allowed = now + timedelta(hours=4)
    assert all(slot.start >= earliest_allowed for slot in slots)


def test_booking_window_excludes_far_future_slots():
    now = datetime(2026, 3, 2, 8, 0, tzinfo=UTC)
    rules = [WeeklyRule(weekday=i, start_minute=0, end_minute=24 * 60) for i in range(7)]

    slots = compute_available_slots(
        rules=rules,
        user_timezone="UTC",
        duration_minutes=30,
        buffer_before_minutes=0,
        buffer_after_minutes=0,
        min_notice_hours=0,
        booking_window_days=2,
        busy=[],
        now_utc=now,
    )

    window_end = now + timedelta(days=2)
    assert all(slot.start <= window_end for slot in slots)
    assert any(slot.start > now + timedelta(days=1) for slot in slots)


def test_busy_interval_blocks_overlapping_slots():
    now = datetime(2026, 3, 2, 8, 0, tzinfo=UTC)
    rules = [WeeklyRule(weekday=0, start_minute=9 * 60, end_minute=12 * 60)]  # Mon 9-12
    busy = [Interval(start=datetime(2026, 3, 2, 10, 0, tzinfo=UTC), end=datetime(2026, 3, 2, 10, 30, tzinfo=UTC))]

    slots = compute_available_slots(
        rules=rules,
        user_timezone="UTC",
        duration_minutes=30,
        buffer_before_minutes=0,
        buffer_after_minutes=0,
        min_notice_hours=0,
        booking_window_days=7,
        busy=busy,
        now_utc=now,
    )

    for slot in slots:
        assert not (slot.start < busy[0].end and slot.end > busy[0].start)
    # The slot immediately before and after the busy block should still be free.
    starts = {s.start for s in slots}
    assert datetime(2026, 3, 2, 9, 30, tzinfo=UTC) in starts
    assert datetime(2026, 3, 2, 10, 30, tzinfo=UTC) in starts


def test_buffer_expands_exclusion_around_busy_interval():
    now = datetime(2026, 3, 2, 8, 0, tzinfo=UTC)
    rules = [WeeklyRule(weekday=0, start_minute=9 * 60, end_minute=12 * 60)]
    busy = [Interval(start=datetime(2026, 3, 2, 10, 0, tzinfo=UTC), end=datetime(2026, 3, 2, 10, 30, tzinfo=UTC))]

    slots = compute_available_slots(
        rules=rules,
        user_timezone="UTC",
        duration_minutes=30,
        buffer_before_minutes=15,
        buffer_after_minutes=15,
        min_notice_hours=0,
        booking_window_days=7,
        busy=busy,
        now_utc=now,
    )

    starts = {s.start for s in slots}
    # With a 15-minute buffer on each side, the slots immediately adjacent to the
    # busy block are no longer far enough away and must be excluded.
    assert datetime(2026, 3, 2, 9, 30, tzinfo=UTC) not in starts
    assert datetime(2026, 3, 2, 10, 30, tzinfo=UTC) not in starts


def test_timezone_conversion_keeps_local_hours_correct():
    # A host in America/New_York (UTC-5 in March, before DST) with 9-17 local
    # availability should produce slots at 14:00-22:00 UTC, not 9:00-17:00 UTC.
    now = datetime(2026, 3, 2, 0, 0, tzinfo=UTC)
    rules = [WeeklyRule(weekday=0, start_minute=9 * 60, end_minute=17 * 60)]

    slots = compute_available_slots(
        rules=rules,
        user_timezone="America/New_York",
        duration_minutes=60,
        buffer_before_minutes=0,
        buffer_after_minutes=0,
        min_notice_hours=0,
        booking_window_days=1,
        busy=[],
        now_utc=now,
    )

    assert len(slots) > 0
    first = min(slots, key=lambda s: s.start)
    assert first.start.hour == 14

# ADR 0003: No SMTP server; buffers computed virtually, not written to the calendar

## Context
Calendly sends its own confirmation emails and writes separate "buffer" block events around
each meeting. A self-hosted tool on a small VPS ideally has as few moving parts as possible.

## Decision
1. **No SMTP.** When SlotPilot creates a Google Calendar event, it adds the invitee as an
   attendee and calls the Calendar API with `sendUpdates=all`. Google Calendar itself emails
   the invite/confirmation to the invitee — SlotPilot never needs mail-server credentials.
2. **Virtual buffers.** Rather than writing extra "buffer" events to the calendar, SlotPilot
   expands the busy window by the configured buffer when computing available slots. The
   guarantee (no meeting starts within `buffer` minutes of another) holds without extra calendar
   clutter or extra API writes.

## Alternatives considered
- Own SMTP/transactional-email integration: another credential to manage on a small VPS, and a
  deliverability problem (SPF/DKIM) the firm doesn't need to take on when Calendar invites
  already work.
- Writing real buffer block events: matches Calendly's implementation more closely, but adds
  visible clutter to hosts' calendars and doubles the Calendar API writes per booking for no
  behavioral difference to the invitee-facing guarantee.

## Consequences
- Fewer services to run and fewer credentials to leak.
- Buffer blocks aren't independently visible/editable on the host's calendar (they're policy
  inside SlotPilot, not calendar events) — acceptable since the firm manages availability through
  SlotPilot, not by hand-editing calendar blocks.

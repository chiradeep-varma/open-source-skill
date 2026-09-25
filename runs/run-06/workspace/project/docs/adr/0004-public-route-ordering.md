# ADR 0004: Booking-confirmation routes must be registered before the booking-page catch-all

## Context
Found while writing the integration test for the booking flow (`tests/test_booking_flow.py`):
the public booking page lives at `/{user_slug}/{event_slug}` — a two-segment wildcard route.
A booking-confirmation URL like `/b/<token>` is *also* two path segments, so Starlette (which
matches routes in registration order, first match wins) was treating `/b/<token>` as
`user_slug="b", event_slug="<token>"` and returning a 404, instead of reaching the confirmation
handler. This is a real gotcha of building a scheduling tool around short, pretty
`/<person>/<meeting>` URLs — the exact convention Calendly itself uses.

## Decision
Register the confirmation (`GET /b/{token}`) and cancellation (`POST /b/{token}/cancel`) routes
in `app/routers/booking.py` *before* the `/{user_slug}/{event_slug}` catch-all. Registration
order is now load-bearing and called out with a comment at both route definitions.

## Alternatives considered
- A distinctly-shaped path that can't collide (e.g. `/booking-confirmation/<token>` as a single
  literal-prefixed segment) — works too, but a firm's real host slugs could still theoretically
  collide with any fixed prefix chosen. Route ordering is the general, always-correct fix and is
  what production routers actually rely on, so it's the one to document and keep relying on
  going forward rather than can't-collide-by-construction naming.
- Namespacing booking pages under `/book/<user_slug>/<event_slug>` instead, freeing up the root
  for other one- and two-segment paths — cleaner long-term but changes the URLs the firm would
  give out to clients; not worth it for a v1 with 6 hosts and a handful of meeting types.

## Consequences
Any new top-level public route added later must be checked against this ordering rule — either
give it a segment-count/shape that can't collide with `/{user_slug}/{event_slug}`, or register
it above that route. This is exactly the kind of thing the test suite catches immediately
(`test_full_booking_and_cancel_flow` failed with a 404 before this fix), so keep that test green
as the tripwire.

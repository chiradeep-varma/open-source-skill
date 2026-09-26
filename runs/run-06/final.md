**SlotPilot** is built in `./project` — a working prototype, all 8 tests passing, verified live against a real running server (not just the test client).

What it is: a self-hosted, single-Python-process Calendly alternative for your 6-person firm — FastAPI + SQLite + Google OAuth, no Postgres/Redis/Node like Cal.com would require. Team members sign in with their Google account (one OAuth flow grants both login and calendar access), set weekly availability and meeting types, and clients book real open slots computed from live Google Calendar free/busy. Confirmed bookings write straight to the host's Google Calendar with a Meet link; Google Calendar's own invite emails handle notifications, so there's no SMTP server to run.

Along the way I found and fixed a real bug via the test suite: the booking-confirmation URL shape collided with the `/<person>/<meeting>` booking-page route, silently 404ing. It's fixed and documented in an ADR so it doesn't regress.

To get it running: `docs/charter.md`, `docs/research/dossier.md`, and `README.md` cover the reasoning and setup; the README has a 10-minute Google Cloud OAuth walkthrough and a `docker compose up` deploy path for your VPS. The main thing you still need to supply is a Google Cloud OAuth client ID/secret and your 6 team emails in `.env`.

Not built (deliberately, tracked in `ROADMAP.md`): rescheduling, round-robin booking, payments, non-Google calendars.

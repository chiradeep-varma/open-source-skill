# SlotPilot

A small, self-hosted scheduling-link tool — an open-source alternative to Calendly for a team
that already lives in Google Calendar. One Python process, one SQLite file, no Postgres, no
Redis, no Node build step. Built to run comfortably on a small VPS.

**Status: prototype**, built for a 6-person internal team. See
[docs/product/parity-matrix.md](docs/product/parity-matrix.md) for exactly what's built vs. not,
and [ROADMAP.md](ROADMAP.md) for what's next.

## Why this exists

Calendly is $10-20/seat/month once you're past the 1-event-type free tier — real money for a
small team, for a job that's fundamentally "read my calendar's free/busy, write an event when
someone books." [Cal.com](https://cal.com) is the well-known open-source alternative, but it
needs Postgres, Redis, and a Node/Next.js build pipeline to self-host — real operational
overhead for a team without dedicated infra. SlotPilot is the middle ground: genuinely small,
genuinely self-hosted, speaks directly to the Google Calendar you already use.

See [docs/charter.md](docs/charter.md) and [docs/research/dossier.md](docs/research/dossier.md)
for the full reasoning, and [docs/legal/provenance.md](docs/legal/provenance.md) for what was
and wasn't used to build this (no Calendly or Cal.com code was read).

## How it works

- Each team member signs in with their Google account (this also grants calendar access — one
  OAuth flow does both).
- They set a weekly availability schedule and one or more meeting types (duration, buffer,
  location).
- Clients book at `https://your-domain/<person>/<meeting-slug>`, seeing real slots computed
  from that person's actual Google Calendar free/busy.
- Booking creates a real Google Calendar event (with a Meet link) and invites the client —
  Google Calendar sends the confirmation email itself, so **SlotPilot needs no SMTP server**.
- Either side can cancel; that removes the calendar event too.

## Quickstart (local)

Requires Python 3.11+.

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env   # fill in GOOGLE_CLIENT_ID/SECRET + TEAM_EMAILS, see below
uvicorn app.main:app --reload
```

Then open http://localhost:8000.

Run the tests:

```bash
pytest
```

## Google Cloud setup (one-time, ~10 minutes)

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com).
2. **APIs & Services → Library**: enable the **Google Calendar API**.
3. **APIs & Services → OAuth consent screen**: choose **External**, fill in the app name, and
   under "Test users" add all 6 team members' Google emails. Leave the app in **Testing**
   status — with ≤100 test users, Google never requires the verification review, which is
   exactly what a 6-person internal tool needs.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**, type **Web
   application**. Add an authorized redirect URI of `{BASE_URL}/admin/oauth/callback`
   (e.g. `https://scheduling.yourfirm.com/admin/oauth/callback`, or
   `http://localhost:8000/admin/oauth/callback` for local dev).
5. Copy the client ID and secret into `.env` as `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
6. Set `TEAM_EMAILS` in `.env` to the 6 comma-separated Google account emails allowed to log in.

## Deploying on a small VPS

```bash
cp .env.example .env   # fill in real values, especially BASE_URL and SESSION_SECRET
docker compose up -d --build
```

That's it — one container, one bind-mounted `./data` directory holding the SQLite file. Put
this behind any reverse proxy (Caddy, nginx, Traefik) for TLS; SlotPilot itself only speaks
plain HTTP. Back up the whole app by copying `data/slotpilot.db`.

## Project layout

```
app/
  main.py            FastAPI app, session middleware, router wiring
  models.py           User, AvailabilityRule, EventType, Booking (SQLModel)
  availability.py      pure slot-computation logic (the core hard part; unit tested)
  google_calendar.py   Google OAuth + Calendar API (freebusy, create/delete event)
  auth.py               session-based login guard for /admin
  routers/admin.py     team-member dashboard: login, availability, meeting types, bookings
  routers/booking.py     public booking pages + confirmation/cancellation
  templates/, static/  server-rendered Jinja2 + a little vanilla JS (timezone detection)
tests/                 pytest: availability engine + full booking flow (mocked Google API)
docs/                  charter, research dossier, parity matrix, ADRs, provenance log
```

## What's deliberately not built yet

Round-robin/multi-host booking, rescheduling (vs. cancel + rebook), non-Google calendars,
payments, an embeddable widget. None of these were needed for a 6-person firm's core loop; see
[ROADMAP.md](ROADMAP.md) if you want to add one.

## License

MIT — see [LICENSE](LICENSE).

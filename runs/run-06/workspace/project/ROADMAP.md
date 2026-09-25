# Roadmap

- **M0 — Skeleton** ✅ FastAPI app, SQLModel/SQLite, Docker Compose, Google OAuth login gated by
  `TEAM_EMAILS`.
- **M1 — Core loop** ✅ Availability schedules, event types, public booking page with live
  Google Calendar free/busy, booking → Calendar event + Meet link + invite email, cancellation.
- **M2 — Switch-blockers** ✅ Timezone-correct invitee display, buffers, min notice, booking
  window, per-host Google Calendar connection.
- **M3 — Differentiators (this pass)** ✅ Single Python process, SQLite file, no
  Postgres/Redis/Node, one-command deploy on a small VPS.
- **M4 — Later** (not built, tracked here for when the firm wants them):
  - Reschedule instead of cancel+rebook.
  - Multiple availability schedules per host (e.g. "office hours" vs. "client calls").
  - Round-robin / collective event types across the 6 consultants.
  - Outlook/CalDAV support if the firm ever mixes calendar providers.
  - Simple team-member management UI (replace the `TEAM_EMAILS` env var).
  - If ever published publicly: CI, packaging, CONTRIBUTING/CODE_OF_CONDUCT/SECURITY,
    versioned releases — see the skill's Project-mode checklist.

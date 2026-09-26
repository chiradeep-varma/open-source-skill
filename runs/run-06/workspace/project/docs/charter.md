# Project Charter — SlotPilot

## Target and scope
Open-source alternative to **Calendly** (calendly.com), scoped to the single-user/small-team
scheduling-link core loop: connect a calendar, define availability and meeting types, let
others book a free slot, get it on the calendar automatically. Not scoped: Calendly's sales
routing, payments, workflows/automation, or enterprise admin surface.

## Mode
**Prototype**, run in "just build it" mode — the user asked to skip checkpoints and have the
core loop running with light docs. Research, guardrails, and design still happened; they just
weren't stopped for approval mid-way. Assumptions made along the way are recorded below and in
the ADRs so they're easy to revisit.

## Motive
**Save money + own the data.** A 6-person consulting firm doesn't want $10-20/seat/month
recurring for a scheduling link (Calendly Standard/Teams pricing, confirmed on their pricing
page as of this session — see dossier). At 6 seats that's $720-$1,440/year forever, for a tool
whose core job is "read my free/busy, write an event." The firm already pays for Google
Workspace; the calendar is the source of truth already.

## Audience
Internal only: the 6 consultants at the firm, plus their external clients who land on booking
pages. Not building for public/OSS-community adoption in this pass (no CI, packaging,
contributor docs) — that's Project-mode scope, noted in ROADMAP.md as a later step if the firm
wants to share it.

## Better-thesis
For a small consulting team that already lives in Google Calendar, SlotPilot is a self-hosted
scheduling-link tool that reads and writes real Google Calendar events directly — unlike
Calendly, which charges per seat forever, and unlike Cal.com, which requires Postgres, Redis,
and a Node build pipeline to operate. SlotPilot is one Python process and a SQLite file.

## Must-have workflows
1. Each consultant connects their Google Calendar via OAuth (one-time).
2. Each consultant sets a weekly availability schedule and one or more meeting types
   (name, duration, buffer, location, booking window).
3. A client visits `https://scheduling.firm.tld/<consultant>/<meeting-type>`, sees real
   available slots (computed from actual Google Calendar free/busy), picks one, and confirms
   with name + email.
4. Booking creates a real Google Calendar event with a Google Meet link and emails the client
   an invite — via Google Calendar's own invite mechanism, so SlotPilot needs no SMTP server.
5. Either side can cancel via a link; cancellation removes the calendar event.

**Explicit non-goals for this pass:** payments, round-robin/collective booking across multiple
hosts, SMS reminders, embeddable widgets, non-Google calendars (Outlook/iCloud), workflow
automation, multi-tenant SaaS billing.

## Constraints
- Language: Python (the user's own skill) — FastAPI, chosen over Django for a small
  single-purpose service with little admin-panel need.
- Host: a single small VPS. No Postgres/Redis/Node build step — SQLite + server-rendered
  Jinja2 templates + a little vanilla JS for timezone conversion.
- Team size: 6 — informs auth (hardcoded allow-list of team emails, no user-management UI
  needed yet) and scale (no need to optimize past dozens of bookings/day).
- Calendar: Google Calendar only, via the Google Calendar API (OAuth2, `calendar` scope).

## Assets
None supplied (no existing Calendly export). Design starts from public docs + the domain model
below.

## Openness
- License: **MIT** (see docs/legal/provenance.md for reasoning) — matches "get this running for
  our firm cheaply," with no copyleft obligation the firm needs to worry about.
- Name: **SlotPilot** — checked against active GitHub/product collisions in this session; none
  found (see provenance log).
- Start: private for now (internal firm tool); the user decides if/when to publish per the
  skill's release phase.

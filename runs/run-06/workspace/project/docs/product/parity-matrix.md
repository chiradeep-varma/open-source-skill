# Parity Matrix — SlotPilot vs. Calendly

Tiers: **Core** (job fails without it) · **Switch-blocker** (can't leave Calendly without it) ·
**Differentiator** (the better-thesis) · **Later** · **Won't** (out of scope for a 6-person
internal tool).

| Feature | Tier | Status |
|---|---|---|
| Weekly availability schedule per host | Core | Built |
| Event types (name, duration, description, location) | Core | Built |
| Public booking page, live slots | Core | Built |
| Buffer before/after meetings | Core | Built |
| Minimum notice + max booking-window-out | Core | Built |
| Google Calendar free/busy read | Switch-blocker | Built |
| Google Calendar event write (with Google Meet link) | Switch-blocker | Built |
| Booking confirmation via Calendar invite email (no SMTP needed) | Switch-blocker | Built |
| Cancellation (client or host) removes the calendar event | Core | Built |
| Invitee timezone auto-detection/display | Core | Built |
| Team member login restricted to firm's Google accounts | Switch-blocker | Built |
| No per-seat cost, single SQLite file, one process | Differentiator | Built |
| Runs via one `docker compose up` on a small VPS | Differentiator | Built |
| Multiple availability schedules per host | Later | Not built |
| Round-robin / collective (multi-host) event types | Later | Not built |
| Reschedule (vs. cancel + rebook) | Later | Not built |
| Non-Google calendars (Outlook, iCloud/CalDAV) | Later | Not built |
| Embeddable widget / iframe | Later | Not built |
| Payments (Stripe) at booking time | Later | Not built |
| SMS reminders | Won't | Out of scope |
| Workflow automation / Zapier-style triggers | Won't | Out of scope |
| CRM integrations (Salesforce/HubSpot) | Won't | Out of scope |
| Multi-tenant SaaS billing / self-serve signup | Won't | Out of scope — this is a firm-internal tool |

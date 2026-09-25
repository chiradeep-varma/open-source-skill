Quick note before diving in: Calendly itself isn't open source, but there are already mature open-source alternatives that do the same job — for a 6-person firm on a small VPS, one of those might get you running today instead of building from scratch. Let me lay out the options.

**Landscape scan:**

| Project | License | Stack | Maturity | Fit for your case |
|---|---|---|---|---|
| **Cal.com** | AGPLv3 | Next.js/TS, PostgreSQL, Prisma | Very active, ~35k★, closest 1:1 Calendly clone (round-robin, team booking pages, Zoom/Google Meet integrations, workflows) | Most feature-complete, but heavier (Node app + Postgres; wants ~2GB+ RAM to run comfortably) |
| **Easy!Appointments** | AGPLv3 | PHP/MySQL | Active, mature, simpler | Lightweight, easy on a small VPS, less "modern SaaS" polish, decent for a small team's booking pages |
| Others (OpenSlots, etc.) | mixed | mixed | mostly stale/abandoned | Not worth it |

None of these are Python — but self-hosting via Docker doesn't require touching their code, so your Python skills wouldn't be used unless you want to *build* rather than *deploy*.

A few questions to pick the right path (my recommended default in **bold**, reasons in parens):

1. **Goal**: **Deploy an existing project (fastest, least maintenance)** vs. build a custom Python app (more control, but you own bugs/security/upkeep for scheduling — a solved problem)? Which draws you — speed, or do you specifically want to build/learn?
2. **Must-haves**: booking page per consultant, availability rules, calendar sync (Google/Outlook), buffer times, timezone handling, email confirmations/reminders — **all of these**, or is your actual need narrower (e.g. just "one shared link, pick a slot, confirm by email")?
3. **VPS specs**: how much RAM/CPU does it have? This decides whether Cal.com fits comfortably or Easy!Appointments (or a lean custom app) is the safer bet.
4. **Calendar integration**: do you need it to sync with Google/Outlook calendars your team already uses, or is a standalone system fine?

If you just want something working with minimal fuss, my default recommendation is **deploy Cal.com via Docker Compose** if your VPS has ≥2GB RAM — it's the true open-source Calendly equivalent, actively maintained, and self-hosting is a config task, not a build project. If your VPS is tight on resources or you specifically want a Python project to own and extend, I'd steer toward a **lean custom FastAPI app** covering just the core booking loop.

What's your VPS spec, and which direction — deploy vs. build — sounds right to you?

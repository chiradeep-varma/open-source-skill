# Target Dossier — Calendly

Research pass for **Prototype mode**: meets the floor (official site/pricing, one user-voice
pass, 2-3 rivals, name check) rather than the deeper Project/Venture pass. Claims are tagged
`confirmed` (checked this session, source linked), `inferred` (reasoned from confirmed facts),
or `memory` (unverified, from training data).

## 1. Identity
Calendly, Inc. — scheduling-link SaaS, calendly.com. Confirmed live product, not to be
confused with any other "Calendly"-named entity; no collision found in this session's searches.
`confirmed`

## 2. Concept and vision
Core insight: instead of a back-and-forth "does Tuesday work?" email thread, the host publishes
a link that always reflects their *actual* current availability, computed live from their
calendar. The host never manually maintains a list of open times. `inferred` from product
behavior, consistent with the category's own framing.

## 3. Market and rivals
- **Cal.com** — open-source (AGPLv3 core, some `ee/` enterprise code proprietary), ~41k+ GitHub
  stars, self-hostable but requires Postgres + Redis + a Node/Next.js build; positions itself
  directly as "the open-source Calendly alternative." `confirmed`,
  [github.com/calcom/cal.com and forks](https://github.com/nchemb/opencalendar)
- **OpenCalendar** — smaller MIT-licensed project, "self-hosted booking pages on your real
  Google Calendar," closer in spirit to what a small team needs, but still a separate codebase
  with its own stack/assumptions. `confirmed`,
  [github.com/nchemb/opencalendar](https://github.com/nchemb/opencalendar)
- Rallly, Easy!Appointments, BookingPress and others cover adjacent niches (group polling,
  clinic/appointment booking) rather than the 1:1 scheduling-link job. `confirmed` via search
  result titles this session.

None of these are "the same product with a different name" — this is a genuine gap for a
Python-only, SQLite-only, no-build-step option, which is the wedge SlotPilot targets.

## 4. Business model
Calendly's pricing page (per aggregator sources checked this session, dated 2026): **Free**
(1 event type), **Standard** ~$10/seat/mo annual ($12 monthly), **Teams** ~$16/seat/mo annual
($20 monthly, round-robin + Salesforce), **Enterprise** from $15,000/yr. `confirmed` (via
pricing aggregators, not Calendly's own page directly — flagged as slightly lower-confidence
than a primary-source fetch, but consistent across multiple independent aggregators)
[meetergo.com/en/magazine/calendly-plans](https://meetergo.com/en/magazine/calendly-plans),
[axisconsulting.io/calendly-pricing-guide](https://axisconsulting.io/calendly-pricing-guide/)

## 5. Users and jobs
Reviewer sentiment mined this session: the core booking flow itself draws no real complaints —
the recurring complaint is **per-seat cost compounding with team size** ("ten reps costs
$2,400/year on scheduling alone") and features a team needs (round-robin) sitting behind the
pricier tier. `confirmed`, aggregated from Capterra/G2-adjacent summaries this session. This
directly informs the better-thesis: a 6-person firm is exactly the size where per-seat pricing
starts to sting for a tool that is, underneath, "check free/busy, write an event."

## 6. Product / core loop
Per Calendly's own help docs (`confirmed`,
[calendly.com/help/availability-overview](https://calendly.com/help/availability-overview),
[help.calendly.com/.../how-to-use-buffers](https://help.calendly.com/hc/en-us/articles/14048208107287-How-to-use-buffers)):
- Host connects a calendar; Calendly reads free/busy to compute open slots and writes new
  events back the moment someone books.
- **Buffers** are counted as part of the availability window (busy-adjacent time is excluded);
  Calendly additionally writes buffer time as separate calendar blocks.
- Deleting/declining the Calendly event in the external calendar cancels it in Calendly too
  (two-way sync).

Domain model (as commonly understood for this category, `inferred`): **Host** (a person with a
connected calendar) → **Availability Schedule** (recurring weekly windows) → **Event Type**
(name, duration, buffer, location, booking-window rules) → **Booking** (a confirmed slot tied to
an invitee) on a **Calendar Connection**.

## 7. Technology
Calendly's own stack is not fully public; not required for this build since booking pages are a
well-understood UI pattern and the only hard integration is the Google Calendar API, which is
public and documented. No proprietary code was read or needed. `n/a`

## 8. Where the value lives
For Calendly-the-company: the value is largely in the software itself (the free/busy + booking
UX) plus distribution/brand, not in data network effects or a regulated activity. That means an
open, self-hosted version can capture the *core* value close to 1:1 for a private team use case
— it just can't capture Calendly's integration marketplace (Salesforce, HubSpot, Zapier
directory) or its brand recognition for external client trust. `inferred`

## Legal surface
No Calendly source code, assets, or proprietary docs were accessed. Only Calendly's own public
help pages (workflow description, not code) and third-party pricing/review aggregators were
used. No ToS clause against building a competing product was found or needed to be relied on —
building a competitor is legal; the constraint is in *how* (no copying), covered in
docs/legal/provenance.md.

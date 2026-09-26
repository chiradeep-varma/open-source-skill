# Project charter: Formstead

> Written in Phase 2 (Prototype mode, "just build it" — no checkpoints, assumptions made by the builder and recorded here for the user to revisit).

_Last updated: 2026-09-25_

## Target

| | |
|---|---|
| Fingerprint | **Typeform** · Typeform S.L. · typeform.com · conversational form/survey builder (one question at a time) · category: form/survey builder · status: active, VC-backed, ~$935M valuation (2024 est.) |
| Sub-scope | Core form/survey building and response collection product. Not in scope: Typeform's AI-agent products (VoiceForm, Forms AI-assistant features), Growth Plans (marketing/ABM suite), payments processing, native mobile apps. |
| Out of scope | Typeform Enterprise-only features (SSO/SAML, HIPAA, custom SLAs), Typeform's video/AI question generation. |
| Route | Build independently. Typeform is closed-source SaaS — no code was read or will be read; everything here comes from public marketing/docs/review pages and original design (see provenance log). |

## Intent

| Question | Answer | Source |
|---|---|---|
| Motive | Save money (the nonprofit is paying for Typeform just to run a handful of signup forms and surveys) | user |
| Audience | The nonprofit's own team (a few admins) and the public (people filling out forms) | assumed from "our volunteer nonprofit" |
| Better-thesis seed | Free once hosted, no per-response metering, one small VPS, own the data — built for a volunteer org with no ops budget, not for a growth team | assumed |
| Must-have workflows | 1. Build a form with several question types 2. Publish a public link people can fill out on any device 3. Collect and view responses, export CSV 4. Reuse for both "signup" (RSVP/volunteer intake) and "survey" (feedback/NPS-style) forms 5. One-command self-hosted deploy on a cheap VPS | assumed from request |
| Non-goals (v1) | Payments/checkout, native mobile apps, AI question generation, marketing/ABM "Growth" features, multi-tenant SaaS hosting for other orgs | assumed |
| Mode | Prototype: core loop running, light docs, demo-able. No CI/community files required yet. | user ("Prototype mode") |

## Constraints

| | Answer | Source |
|---|---|---|
| Technical comfort | Unknown, but "cheap VPS" + "self-host" implies someone comfortable with `docker compose up` but not a dedicated ops team | assumed |
| Languages/stacks maintainable | Unspecified — chose a mainstream, low-maintenance stack (Node.js + SQLite) that a volunteer with basic web dev skills can read | assumed |
| Where it runs | A single cheap VPS (e.g. $5-6/mo droplet/Hetzner CX-class box) | user |
| Expected scale | Small: a handful of forms, likely low hundreds to low thousands of responses per form, not high concurrency | assumed from "nonprofit... signup forms and a couple of surveys" |
| Time/budget | One build session (Prototype mode); budget is "cheaper than Typeform's ~$25-300/mo" | assumed |
| Other | Public forms must work without the respondent creating an account; admin side needs basic login | assumed |

## Assets available

- No Typeform account or data export was provided by the user; the importer is deferred to a later milestone (documented as a gap, not built in this pass).
- Public marketing/pricing/review pages only (see dossier sources).

## Openness

| | Answer | Source |
|---|---|---|
| License leaning | Permissive-but-protective for a self-hosted app with no proprietary "ee/" tier planned → AGPL-3.0-or-later (keeps hosted forks open; see ADR-0002) | assumed, explained in ADR |
| Commercial intent | None — built for this nonprofit; open-sourcing is a byproduct | user |
| Public from day one? | Left to the user to decide when to publish (Phase 8); code is written as if it will be public | assumed |
| Name ideas | "Formstead" — checked for collisions (see provenance log), no active form-builder or software project uses it | builder |

## Open questions

- Does the nonprofit want email notifications on new responses (needs an SMTP relay)? Left as an optional env var, off by default.
- Does the nonprofit need a Typeform import path? Not built in this pass — noted as a v2 switch-blocker in the parity matrix.
- Custom domain / branding needs? Basic logo+color theming included; full custom CSS deferred.

## Change log

- 2026-09-25: created, Prototype mode, no user checkpoints per explicit instruction.

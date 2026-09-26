# Project charter: open-Figma (working name)

> Written in Phase 2. The user said "figure out the right place to start" and "make the calls yourself" — so most answers below are **assumptions**, made to keep momentum, and stay open to revision. Nothing here is final.

_Last updated: 2026-09-25_

## Target

| | |
|---|---|
| Fingerprint | **Figma** · Figma, Inc. (San Francisco; IPO'd on NYSE, 2025) · figma.com · collaborative interface-design & whiteboarding tool · one line: browser-based, real-time multiplayer vector design tool with prototyping, dev handoff (Dev Mode) and whiteboarding (FigJam) · status: active, independent (2023 Adobe acquisition attempt was blocked and abandoned) |
| Sub-scope | The core design/prototyping product (files, canvas, components, Dev Mode). FigJam (whiteboarding) and Figma Slides are treated as adjacent, out of scope for the initial wedge — see Non-goals. |
| Out of scope | FigJam, Figma Slides, Figma Make (AI app builder), Figma's mobile viewer/mirror apps, enterprise admin/compliance suite — all deferred to "Later." |
| Route | Build independently. Figma is proprietary/closed source, so there is no code to build on — everything is original implementation from public behavior, docs and specs. |

## Intent

| Question | Answer | Source |
|---|---|---|
| Motive | Public good / community — a genuinely self-hostable, data-owning alternative to a proprietary tool that has become critical infrastructure for design teams, with cost and lock-in as secondary drivers | assumed |
| Audience | Public (open-source project meant for other teams and self-hosters to adopt), not just the requesting user | assumed |
| Better-thesis seed | Self-hosted, real data ownership (exportable, inspectable file format), no per-seat viewer/editor pricing, and — because Penpot already exists as an open Figma alternative (see dossier) — differentiation has to be sharper than "open Figma," likely around performance, import fidelity from real Figma files, or a simpler self-host story | assumed, to be sharpened after research |
| Must-have workflows (3–5) | 1. Real-time multiplayer canvas editing (the core loop) 2. Components/instances with a shared library 3. Basic prototyping (click-through flows) 4. Dev Mode-style inspect/export (CSS/values, asset export) 5. Comments | assumed, from Figma's own core-loop |
| Non-goals (v1) | FigJam-style whiteboarding, Figma Slides, AI generation features, native mobile apps, enterprise SSO/SCIM/audit logs (candidates for "Later" or "Diff" once core exists) | assumed |
| Mode | **Brief** — research and a plan only, no code this session | user-specified |

## Constraints

| | Answer | Source |
|---|---|---|
| Technical comfort | Unknown — assuming "writes code / runs servers," typical for someone commissioning an open-source dev tool | assumed |
| Languages and stacks the user can maintain | Unknown — plan will recommend a mainstream, widely-known stack (TypeScript/web) rather than assume a preference | assumed |
| Where it runs | Self-hosted: laptop for dev, small VPS/Docker Compose for real use, since that's the standard bar for "operable by strangers" | assumed |
| Expected scale | Small-to-mid team scale initially (tens of concurrent users per file, thousands of files), not Figma's own hyperscale | assumed |
| Time and budget | Unknown; plan is scoped as a multi-milestone open-source project, not a weekend build, given the product's real complexity | assumed |

## Assets available

- Accounts on the incumbent: none provided this session; research relies on public docs, pricing pages, blog posts and review sites only.
- Data exports: none provided.
- Screenshots and recordings: none provided.
- Other material: none provided.

## Openness

| | Answer | Source |
|---|---|---|
| License leaning | Likely **AGPL-3.0** for the server/app (network-service copyleft, matches other open SaaS alternatives) or **MPL-2.0** (Penpot's own choice, file-level copyleft, more permissive for embedding) — final recommendation in Phase 5 after checking Penpot's precedent and the user's likely commercial intent | assumed, pending Phase 5 |
| Commercial intent | Unknown — plan will note the option (open core / hosted offering) without committing to it | assumed: none for now |
| Public from day one? | Assumed yes, since audience = public | assumed |
| Name ideas | None given; will propose options and run the name-collision check in Phase 5 | assumed |

## Open questions

- What should differentiate this from **Penpot**, the existing mature open-source Figma alternative (MPL-2.0, funded, active since 2019)? This is the single biggest planning question and drives the whole better-thesis — addressed in the brief after research.
- Real commercial intent, or purely community project? Changes the license and whether "Venture"-style business modeling is worth doing later.
- Any existing team/stack preference?

## Change log

- 2026-09-25: created, all fields assumed (user asked for research + plan, "make the calls yourself").

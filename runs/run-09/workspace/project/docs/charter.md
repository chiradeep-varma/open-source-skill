# Project charter: Homestat (proposed name)

> Written in Phase 2. The user said "make the calls yourself," so every item below is an **assumption** unless marked otherwise — nothing here was confirmed by the user yet. Revisit before moving past Brief mode.

_Last updated: 2026-09-25_

## Target

| | |
|---|---|
| Fingerprint | **Nest Learning Thermostat** (and the wider "Google Nest thermostat" family) · maker: Nest Labs, acquired by Google in 2014 · store.google.com · category: smart/learning home thermostat · one-line: a Wi-Fi thermostat that learns your schedule and is controlled through a Google account and Google's cloud · status: actively sold (Nest Thermostat, Nest Learning Thermostat 4th gen), with 1st/2nd gen support ended Oct 25 2025 |
| Sub-scope | **In scope:** Nest Learning Thermostat 4th gen (2024, Matter-certified — official local channel) and 1st/2nd gen (2011/12, orphaned Oct 2025 — jailbreak channel via the existing open NoLongerEvil project). **Out of scope for now:** 3rd gen (2015) and the budget "Nest Thermostat"/"Nest Thermostat E" line — no confirmed local-control path found this session; flagged as a research follow-up, not ruled out permanently. |
| Out of scope | Nest cameras, Nest Protect, Nest doorbells/speakers, Nest Wifi — this project is thermostat-only. |
| Route | **Build independently.** The target itself is fully proprietary (no route to build on Nest's own code). One optional dependency: NoLongerEvil-Thermostat, a *separate* third-party open-source project (not Nest's own code) that we may integrate with under its license for the Gen 1/2 path — see dossier §3. |

## Intent

| Question | Answer | Source |
|---|---|---|
| Motive | **Privacy / data ownership** (no Google account, no cloud dependency) is primary; **avoiding forced obsolescence** (the Oct 2025 EOL) is a close second | assumed, directly from the user's phrasing ("local control without google") |
| Audience | **Public** — an open-source project other Nest owners and the self-hosted/Home Assistant community can use, not just the requester | assumed |
| Better-thesis seed | For Nest owners (and orphaned Nest-1/2 owners especially) who don't want a Google account or cloud dependency just to control their own thermostat, Homestat is a local-first thermostat brain that talks to the hardware you already have — unlike Nest, which requires Google's cloud for every remote or smart feature | assumed, built from dossier §5 pain themes |
| Must-have workflows | 1. Set/view target temperature and mode locally (LAN, no internet required) 2. Build and follow a learned or manual schedule 3. Presence-based Home/Away switching 4. View temperature/HVAC-runtime history 5. Integrate with Home Assistant (the de facto local smart-home hub) | assumed |
| Non-goals (initial) | Voice assistant integration, a companion cloud/remote-access service, camera/security features, multi-language UI, iOS/Android native apps (a local web UI + Home Assistant integration covers the workflow first) | assumed |
| Mode | **Brief** — research and a plan only, no code or hardware sourcing yet | user-specified |

## Constraints

| | Answer | Source |
|---|---|---|
| Technical comfort | Unknown — not stated. Assumed **intermediate/hobbyist** (comfortable with Home Assistant, soldering/wiring a relay board, or at minimum following a guided installer) given the domain; plan should still document the fully-guided path for less technical users | assumption — confirm before Prototype mode |
| Languages/stacks | Not stated. Recommend Python (matches Home Assistant/`python-matter-server` ecosystem) for the local server, C++/ESPHome-YAML if custom firmware is built | assumption |
| Where it runs | A local device on the user's LAN — Raspberry Pi–class hardware, a Home Assistant add-on, or a small home server | assumed, from "local control" requirement |
| Expected scale | Single household, one to a handful of thermostats/zones | assumed |
| Time/budget | Not stated; Brief mode implies no build commitment yet | n/a |
| Other | Real HVAC hardware safety (24VAC low-voltage, but still capable of damaging a compressor if driven wrong) must be respected in any later design | inferred from domain |

## Assets available

- Accounts on the incumbent: none provided this session; not used (all research was via public web sources).
- Data exports: none.
- Screenshots/recordings: none.
- Other material: none — this Brief-mode pass is desk research only, per the user's "make the calls yourself" instruction.

## Openness

| | Answer | Source |
|---|---|---|
| License leaning | **Apache-2.0** for the core local-control software (matches the ecosystem it plugs into — Home Assistant and `python-matter-server` are both Apache-2.0 — and maximizes adoption/embedding); **CERN-OHL-S** if/when open hardware designs are added later; AGPL-3.0 considered and rejected for now since there's no realistic "closed hosted SaaS fork" risk for a LAN device controller | assumed, reasoned in brief.md |
| Commercial intent | None stated — treat as a pure open-source community project unless the user says otherwise | assumption |
| Public from day one? | Assumed yes (this is being built as "the open source Nest thermostat," implying public release is the point) | assumption |
| Name ideas | **Homestat** (checked this session — no colliding software/thermostat product found; see provenance log) | proposed this session |

## Open questions

- Does the user actually own Nest hardware (which generation), or is this meant to also cover people with no Nest hardware at all (fully open DIY device)? The plan below covers both, but which one is primary changes the wedge.
- Confirm the "public open-source project" audience assumption — if this is really just for the user's own house, scope and licensing choices simplify.
- Confirm technical comfort level, since it changes how much of the "guided installer" work matters for M1.

## Change log

- 2026-09-25: created, all fields assumption-filled per "make the calls yourself" instruction; Brief mode.

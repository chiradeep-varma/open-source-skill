# Parity matrix: Homestat vs. Google Nest thermostat

> One row per notable capability. **Tier:** `Core` · `Switch` (can't leave the incumbent without it) · `Diff` (our better-thesis) · `Later` · `Won't`.
> **Status:** all rows are `planned` — Brief mode produced no code. **Effort** is a rough S/M/L guess for Phase 6 (Design) to refine.

_Last updated: 2026-09-25_

| Primitive / area | Capability | Nest's tier/plan | Our tier | Effort | Milestone | Status | Evidence | Notes |
|---|---|---|---|---|---|---|---|---|
| Control | Manual setpoint, mode (heat/cool/auto/off) via local LAN, no internet | Requires Google cloud for app/remote control | **Core** | M | M1 | planned | dossier §4, §7 | The entire point of the project |
| Control | Local web UI / Home Assistant `climate` entity | App requires Google account | **Core** | M | M1 | planned | dossier §6 | Home Assistant integration doubles as the "app" |
| Backend: hardware | Direct 24VAC relay driving (DIY/ESPHome hardware) | n/a (closed hardware) | **Core** | M | M1 | planned | dossier §7, §3 | Needed for anyone without Nest hardware, and as the reference/simplest backend |
| Backend: hardware | Matter backend for Nest Learning Thermostat 4th gen | Official but Google-app-first commissioning (unconfirmed extent) | **Core** | M | M1 | planned | dossier §7 | Highest-value backend: uses currently-sold, currently-supported hardware people already own |
| Backend: hardware | Integration with NoLongerEvil-liberated Nest 1st/2nd gen (MQTT) | n/a — Google abandoned these Oct 2025 | **Diff** | S | M2 | planned | dossier §3 | Depend on NoLongerEvil under its license; don't re-derive the jailbreak ourselves |
| Scheduling | Manual schedule (time × day × temp) | Core Nest feature | **Core** | S | M1 | planned | dossier §6 | Table-stakes, low effort |
| Scheduling | Auto-learning schedule from manual adjustments | Nest's signature feature | **Diff** | L | M3 | planned | dossier §2, §6 | The hardest "smart" feature; needs real usage data to tune, so lands after the core loop ships |
| Presence | Geofence-based Home/Away (phone location) | Nest "Home/Away Assist" | **Diff** | M | M3 | planned | dossier §6 | Local-first geofencing (e.g. via Home Assistant's own presence detection) avoids a cloud round-trip Nest itself uses |
| Presence | Built-in occupancy/motion sensing | Nest has a physical sensor | **Later** | M | Later | planned | dossier §6 | Only relevant on our own open hardware; N/A when driving existing Nest units as a backend |
| Sensors | Multi-room temperature sensors | Nest 4th gen ships one | **Diff** | M | M3 | planned | dossier §6 | Any Matter/Zigbee temp sensor should work, not just Google's own |
| History | Temperature/runtime history + basic energy view | Nest's "Energy History" + "leaf" | **Diff** | M | M3 | planned | dossier §6 | Own UI/graphics, not Nest's leaf icon |
| HVAC safety | Compressor short-cycle protection, multi-stage/heat-pump staging | Nest handles this internally | **Core** | L | M2 | planned | dossier §7 | Domain-correctness hard part; get this wrong and we damage real equipment |
| Import | None applicable — no user data export exists to import from a closed cloud thermostat | n/a | **Won't** | — | — | won't | dossier §6 | There's no Nest "export" to migrate; onboarding is just wiring + setup, not data migration |
| Voice/assistant | Alexa/Google Assistant voice control | Core Nest feature (cloud) | **Later** | M | Later | planned | dossier §6 | Explicit non-goal for M1–M3 (charter); can be added via Home Assistant's own assistant integrations later without us building it |
| Companion cloud/remote access | Check/control thermostat from outside the LAN when away from home | Core Nest feature (cloud) | **Later** | M | Later | planned | dossier §4 | Achievable locally-rooted (e.g. user's own VPN/Home Assistant Cloud alternative) without us running a multi-tenant cloud — needs its own design pass, deliberately deferred |
| Hardware | Our own open reference hardware (ESP32 + relay board, KiCad + BOM) | n/a | **Later** | L | M4 | planned | product-types.md §8 | Serves users with no Nest hardware at all or who want mainline (non-jailbroken) support long-term |

## Summary

- Core: 6 · Switch: 0 · Diff: 5 · Later: 4 · Won't: 1
- Current milestone: none started (Brief mode — plan only).
- Honest status line for a future README: *"Homestat is a planning-stage project. No code has been written yet. See docs/brief.md for the plan and docs/research/dossier.md for the research behind it."*

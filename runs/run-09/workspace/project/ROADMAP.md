# Roadmap (planning stage — nothing built yet)

This is a forward plan, not a commitment schedule. See `docs/brief.md` for the reasoning behind each milestone and `docs/product/parity-matrix.md` for the full feature-to-milestone mapping.

## M0 — Skeleton
Repo scaffolding, the internal `climate backend` interface defined (the abstraction that lets one scheduling/learning core drive Matter, MQTT/NoLongerEvil, and DIY-relay hardware interchangeably). No real hardware driven yet.

## M1 — Core loop
- Local LAN control: manual setpoint + mode, no internet required.
- Manual (non-learning) schedule.
- Home Assistant `climate` entity integration.
- Two backends working against real hardware: DIY ESP32+relay (simplest, no legal complexity) and Matter (Nest Learning Thermostat 4th gen — official, local, no jailbreak).
- **Gate to open before this milestone:** hands-on confirmation of whether Nest 4th gen Matter commissioning can happen without any Google Home app step.

## M2 — Switch-blockers and safety
- HVAC safety logic: multi-stage staging, heat-pump auxiliary/emergency heat, compressor short-cycle protection.
- NoLongerEvil-backend integration for Nest 1st/2nd gen, as an optional, clearly-labeled add-on.
- **Gate to open before this milestone:** legal review of the Gen 1/2 jailbreak-integration path (DMCA §1201 exposure), per `docs/legal/provenance.md` and `docs/brief.md` risks.

## M3 — Differentiators
- Auto-learning schedule (the hard, data-driven "smart" feature).
- Geofence-based presence detection (local-first, e.g. via Home Assistant's own presence tracking — not a Homestat-run cloud).
- Multi-room temperature sensors.
- Local temperature/runtime history and an energy view (own design, not Nest's "leaf").

## M4 — Later
- Our own open reference hardware design (KiCad schematics, BOM, enclosure) for people with no Nest hardware at all, per `product-types.md` §8's "fully custom open device" path.
- Voice-assistant integration and any remote/away-from-home access — each designed as pluggable and local-first, not as a Homestat-operated cloud service.

## Explicit non-goals (for now)
Camera/security features, native iOS/Android apps, multi-tenant/commercial hosting. See `docs/charter.md` and `docs/brief.md`.

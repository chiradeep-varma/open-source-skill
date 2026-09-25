# Brief: Homestat — an open, local-first alternative to the Google Nest thermostat

> One-page summary. Full detail in `docs/research/dossier.md`, `docs/product/parity-matrix.md`, `docs/charter.md`.

**The product.** A local-first "smart thermostat brain" — scheduling, learning, presence detection and a clean UI — that runs entirely on your home network and drives your HVAC system through whichever local backend fits your hardware, with no Google account and no cloud round-trip required for control.

**Why people use the incumbent.** Nest's learning algorithm removes the need to manually program a schedule, it looks good, and (historically) it had a wide smart-home ecosystem. People stick with it out of sunk cost in the hardware and because the learning schedule, when it works, is genuinely convenient.

**Where its value lives.** Almost entirely in software/workflow (scheduling, learning, presence logic) — not in network effects, proprietary data, or content. The one real leverage Google has is that people already own the hardware, and until now, only Google's cloud could talk to it.

**The field.** Ecobee, Honeywell, Mysa, Tado and friends all repeat the same pattern: cloud-required for remote/smart features. The DIY ESPHome/Home Assistant community has solved local HVAC control for years but ships it as generic automations, not a purpose-built learning-thermostat product. A genuinely active open project called **NoLongerEvil-Thermostat** (MIT-ish, found this session) already jailbreaks orphaned Nest 1st/2nd-gen hardware and gets it talking locally — but it stops at "restore connectivity," with no learning/scheduling/presence layer of its own. Nobody has yet built the smart layer on top, across more than one hardware generation.

**What we'll build.** For Nest owners — and orphaned 1st/2nd-gen owners especially — who don't want a Google account or a cloud dependency just to control their own thermostat, Homestat is a local-first thermostat brain that talks to hardware you already have, unlike Nest, which requires Google's cloud for every remote or smart feature.
- **Core loop:** sense temperature/presence → compare to schedule → drive HVAC relays locally → log history → refine the schedule over time.
- **Switch-blockers:** none in the traditional "data import" sense — there's no user data export to migrate from a closed cloud thermostat, so onboarding is wiring + setup, not migration.
- **Differentiators:** works across *three* local backends from one codebase — official Matter (Nest Learning Thermostat 4th gen, no jailbreak needed), NoLongerEvil-liberated hardware (Nest 1st/2nd gen), and open DIY hardware (ESP32 + relay board) for anyone without Nest hardware at all.

**What we won't build (for now).** Voice assistant integration, our own companion cloud/remote-access service, camera/security features, and native iOS/Android apps — a local web UI plus a Home Assistant integration covers the core workflow, and each of those is a substantial project of its own better tackled after the core loop proves out (all `Later` in the parity matrix).

**Hard parts and how we'll handle them.**
1. **Talking to three very different backends from one core.** → A single internal `climate backend` interface; Matter via the existing open `python-matter-server`/Matter.js (Apache-2.0); MQTT for NoLongerEvil-liberated and DIY hardware.
2. **Confirming Nest 4th gen can be commissioned onto our own local Matter fabric without leaving a permanent Google dependency.** → Needs a hands-on test with real hardware before Prototype mode; document honestly if a one-time Google Home app touch turns out to be unavoidable, rather than overclaiming "zero Google."
3. **Driving real HVAC equipment safely** (multi-stage, heat pumps, compressor short-cycling). → Solved from public HVAC wiring standards and existing open-thermostat prior art, never from Nest's own firmware; treat as a correctness/safety problem, not a research-access problem.

**Name and license (proposed).** **Homestat** — no colliding thermostat/smart-home software product found in this session's checks (GitHub, general web, package-registry search); trademark-register and package-registry checks still outstanding before public launch (see `docs/legal/provenance.md`). **Apache-2.0** for the core software, because it matches and maximizes embedding into the exact ecosystem this depends on (Home Assistant and `python-matter-server` are both Apache-2.0), and there's no realistic "closed hosted SaaS fork" risk to guard against with AGPL for a device that lives on one household's LAN. Hardware designs, if/when built, would use CERN-OHL-S.

**Milestones.**
- **M0 — skeleton:** repo scaffolding, backend-abstraction interface defined, no real hardware talked to yet.
- **M1 — core loop:** local LAN control (manual setpoint/mode), manual schedule, Home Assistant `climate` entity, DIY-hardware (ESP32+relay) backend and Matter backend for Nest 4th gen — both talking to real hardware.
- **M2 — switch-blockers & safety:** multi-stage/heat-pump-safe HVAC driving; NoLongerEvil-backend integration for Gen 1/2.
- **M3 — differentiators:** auto-learning schedule, geofence presence detection, multi-sensor rooms, local history/energy view.
- **M4 — later:** our own open reference hardware design; voice-assistant and remote-access options, each via pluggable local-first mechanisms rather than a Homestat-run cloud.

**Risks and open questions.**
- *Legal:* the Gen 1/2 jailbreak path (via NoLongerEvil) carries real DMCA §1201 circumvention exposure even for abandoned devices — recommend counsel before building that integration for wide public distribution, per `legal-and-licensing.md` §11 ("the target is a device with firmware or DRM"). The Matter path (Gen 4) carries materially lower legal risk since it uses a documented, vendor-exposed local protocol with no circumvention.
- *Technical:* whether Gen-4 Matter commissioning truly needs zero ongoing Google dependency is unconfirmed — needs hands-on verification.
- *Scope:* Gen 3 and the budget "Nest Thermostat" line have no confirmed local path yet — may expand or shrink the addressable hardware base.
- *Audience:* charter assumptions (public open-source project, Apache-2.0, no commercial intent) were made by the assistant per "make the calls yourself" and are not yet user-confirmed.

**Decision needed:** confirm (or correct) the charter assumptions in `docs/charter.md` — especially audience/license — and say whether to proceed to Prototype mode (a working core loop against real or simulated hardware) or stay in planning a while longer.

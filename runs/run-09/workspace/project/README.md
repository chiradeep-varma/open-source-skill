# Homestat (proposed name) — planning stage

An open-source, local-first alternative to the Google Nest thermostat: no Google account, no cloud dependency for control.

**Status: Brief mode.** This is research and a plan only — no code has been written and no hardware has been sourced yet.

## Start here

1. **[docs/brief.md](docs/brief.md)** — the one-page summary: what we'd build, why, the hard parts, proposed name/license, and the milestone plan.
2. **[docs/charter.md](docs/charter.md)** — scope and assumptions (all currently assumed, not yet confirmed by the project owner — see its "Open questions").
3. **[docs/research/dossier.md](docs/research/dossier.md)** — the full research behind the plan, with sources and confidence tags.
4. **[docs/product/parity-matrix.md](docs/product/parity-matrix.md)** — feature-by-feature plan vs. the incumbent.
5. **[docs/legal/provenance.md](docs/legal/provenance.md)** — independent-creation record, name check, license reasoning.
6. **[ROADMAP.md](ROADMAP.md)** — milestones M0–M4.
7. **[docs/process-log.md](docs/process-log.md)** — exactly what was researched/checked this session, and what's still outstanding.

## The one-paragraph version

Google ended cloud support for 1st/2nd-generation Nest Learning Thermostats on October 25, 2025, and every Nest thermostat's remote/smart features require a Google account and Google's cloud — confirmed directly from Google's own support and developer pages (via search results; see the dossier for source notes). The newest hardware (4th gen, 2024) actually has an official local-control channel via Matter. A live open-source project, NoLongerEvil-Thermostat, already jailbreaks the orphaned old hardware. Nobody has yet built the "smart" layer — learning schedules, presence detection, energy history — on top of either local channel. That's the gap this project plans to fill.

**Not affiliated with or endorsed by Google. "Nest," "Google Nest" and "Nest Learning Thermostat" are trademarks of Google LLC.**

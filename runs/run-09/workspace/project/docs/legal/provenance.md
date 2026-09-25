# Provenance log

> Evidence that Homestat is being developed independently of Google Nest. Records what informed the work and what was deliberately never accessed.

## Statement

Homestat (proposed name) is planned as an independent implementation of a local-first smart-thermostat control system. Everything in this repository so far was built from publicly available information about Nest thermostats' features, behavior and reputation (web search results, official support/developer pages, teardown articles, user reviews), and from original analysis and design work. No Nest source code, decompiled or de-minified firmware, internal Google documents, or copyrighted Nest assets or text were used or accessed. Homestat is not affiliated with or endorsed by Google. "Nest," "Google Nest" and "Nest Learning Thermostat" are trademarks of Google LLC, used here only to identify the product this project offers a local-control alternative to/for.

One exception to "independent implementation": Homestat's plan for owners of orphaned 1st/2nd-generation Nest hardware anticipates depending on **NoLongerEvil-Thermostat** (`github.com/codykociemba/NoLongerEvil-Thermostat`), a separate, pre-existing third-party open-source project, used under its own license as an external dependency — not as code copied into Homestat, and not as a route to Nest's own code (NoLongerEvil does not contain or expose Nest's proprietary firmware source; it replaces it).

## Sources that informed the work

| Date | Source type | Reference | What it informed |
|---|---|---|---|
| 2026-09-25 | Search-engine results over Google's own support/developer pages | [S1][S4][S5] in dossier | Understanding of the Oct 2025 EOL and the cloud-only Device Access Program — both are Google's own stated policies, not reverse-engineered |
| 2026-09-25 | Search-engine results over independent tech press | [S2][S3][S8][S9][S19]–[S22] in dossier | Timeline, pricing, Matter certification claims |
| 2026-09-25 | Search-engine results over review aggregators | [S16][S17][S18] in dossier | User pain/love themes for the better-thesis |
| 2026-09-25 | Search-engine results over teardown articles | [S24][S25] in dossier | High-level hardware/protocol facts (SoC family, Zigbee coprocessor, Weave protocol) — behavioral/observational facts, not source code |
| 2026-09-25 | Direct fetch of a third-party open-source project's own README | [S23] in dossier, `github.com/codykociemba/NoLongerEvil-Thermostat` | Understanding of the existing Gen 1/2 jailbreak/self-hosting landscape, to differentiate rather than duplicate |

## Deliberately not accessed

- Nest/Google Nest client or firmware source code, bundles, decompiled binaries or source maps
- Any leaked, internal or NDA Google material
- Nest's own mobile app internals (no reverse engineering of the app was performed)
- The NoLongerEvil-Thermostat project's *implementation* of the OMAP DFU exploit was not read line-by-line for reuse this session (Brief mode did no code work); only its public README/feature description was reviewed

## Name check

| Date | Search (where / query) | Result |
|---|---|---|
| 2026-09-25 | Web: `"Homestat" thermostat app software` | No thermostat/smart-home product found using this name |
| 2026-09-25 | Web/GitHub: `"Homestat" github npm package` and `site:github.com homestat` | No exact-name GitHub project; nearby names found are unrelated hobby projects (`homestats` plural — ambient sensor loggers) and a cybernetics history repo (`homeostat`), none in the thermostat/smart-home-control space |
| 2026-09-25 | Web: bare `homestat` | Unrelated organizations found in different categories/classes: HomeSTAT NYC homelessness outreach program, HomeSTAT Home Healthcare (Dallas-Fort Worth), Homestat Farm (cereal brands), HomeState (Tex-Mex restaurant chain) — none in software/IoT/Nice classes 9 or 42, judged low confusion risk but noted |
| — | USPTO / EUIPO / WIPO trademark register search | **Not done this session** — no direct database access available; do this before any public launch, per `legal-and-licensing.md` §5 |
| — | Package registries (PyPI, npm, Docker Hub) direct search | **Not done this session** — only reached indirectly via general web search; re-check directly before first publish |

**Verdict:** "Homestat" is a reasonable working name — no collision found in the thermostat/smart-home software space — but it is not yet cleared. Treat it as provisional until the trademark-register and package-registry checks above are completed, ideally right before or during Prototype mode.

## Terms-of-service review

| Date | Terms reviewed | Relevant clauses | Decision |
|---|---|---|---|
| — | Google Nest Additional Terms of Service / general Google ToS | **Not reviewed this session** — `developers.google.com` and `support.google.com` were both blocked by this session's outbound proxy | Used only public search-result summaries; read the actual ToS directly (for reverse-engineering/competitive-use clauses) before any hands-on Device Access Program or account testing — flagged as a pre-Prototype task in the dossier |

## Third-party material we may use (not yet used — Brief mode)

| Item | Source | License | Where it would be used |
|---|---|---|---|
| `python-matter-server` / Matter.js server | Open Home Foundation / home-assistant-libs | Apache-2.0 (per search results — verify at adoption time) | Matter backend for driving a Nest 4th gen locally |
| NoLongerEvil-Thermostat (as an external dependency, not copied code) | codykociemba/NoLongerEvil-Thermostat | Stated "MIT" in third-party summaries; **verify the actual LICENSE file** before depending on it | Optional backend for liberated Nest 1st/2nd gen hardware |
| ESPHome | esphome.io / Open Home Foundation | GPL-3.0 core, per general knowledge — verify at adoption time | Possible DIY-hardware firmware backend |

## Human direction

| Date | Decision | Made or approved by |
|---|---|---|
| 2026-09-25 | Scope: Brief mode, research + plan only, output in `./project` | user, direct instruction |
| 2026-09-25 | All charter answers (motive, audience, license leaning, name) | assumed by the assistant per the user's "make the calls yourself" instruction — flagged in `docs/charter.md` as assumptions pending user confirmation |
| 2026-09-25 | Better-thesis and wedge selection (multi-backend local brain vs. single-generation hardware hack) | assistant's synthesis from research; not yet reviewed by the user |

## Incidents

None. No target implementation material was loaded into context this session.

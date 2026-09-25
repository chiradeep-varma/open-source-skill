# Target dossier: Nest Learning Thermostat / Google Nest thermostats

> Research notes for building an independent open alternative. Contains facts, observations and analysis only. No copied code, assets or substantial copied text.
> Claim tags: `confirmed` (page opened directly) · `reported` (seen in search results / secondary source; primary page not opened) · `inferred` · `assumption` · `memory`.
> **Access note:** this session's outbound proxy blocked direct `WebFetch` to several primary domains (`developers.google.com`, `support.google.com`, `tomshardware.com`, `nolongerevil.com`) — repeated attempts returned "proxy refused the connection." All claims from those domains are therefore tagged `reported` (from search-result snippets), not `confirmed`. The one exception is the NoLongerEvil-Thermostat GitHub README, fetched directly via `curl` to `raw.githubusercontent.com` and tagged `confirmed`. Re-verify the `reported` claims with direct fetches before relying on them for anything legally load-bearing.

_Research window: 2026-09-25 · Mode: Brief_

---

## Summary (written last)

- **What it is:** A Wi-Fi connected, self-programming ("learning") thermostat from Google Nest that controls home HVAC systems, sold since 2011 and now requiring a Google account and Google's cloud for remote/automated features.
- **Why people buy it:** it's the best-known "smart thermostat" brand, learns a schedule automatically, looks good on the wall, and (used to) integrate with a wide smart-home ecosystem.
- **Where the value lives:** mostly software/workflow (scheduling, learning, geofencing) plus brand trust — not network effects, not proprietary data of real value to a competitor, and (as of late 2025) actively eroding cloud/support commitment.
- **What an open version can capture:** nearly all of it. The learning/scheduling/geofencing logic is a solved, well-understood problem; the hardware is commodity (24VAC HVAC relay control is a decades-old open standard); and Google's own cloud-dependency is the single biggest reason people want an alternative.
- **Three hardest problems:** (1) safely driving arbitrary HVAC systems (compressor short-cycle protection, multi-stage, heat pumps) without new hardware from scratch; (2) getting *local* control out of hardware the user may already own, which Google didn't design to be run without its cloud; (3) building a "learning" schedule and presence-detection engine that's actually as good as Nest's, entirely offline.

---

## 1. Identity and history

- Nest Labs was founded in 2010 by ex-Apple engineers Tony Fadell and Matt Rogers; the Nest Learning Thermostat launched October 2011. `memory` — general industry knowledge, not independently re-verified this session.
- Google acquired Nest Labs in 2014 (~$3.2B, widely reported at the time). `memory`.
- Google folded Nest into "Google Nest" / Google Home branding; accounts were migrated from standalone Nest accounts to Google accounts over 2019–2020. `reported` [S6][S7].
- **2025 turning point:** Google announced end-of-support for the 1st and 2nd generation Nest Learning Thermostats (2011/2012 hardware), effective **October 25, 2025** — cloud/app control, remote access, notifications and Home/Away Assist stop working; only basic on-device schedule and manual control remain. `reported` [S1][S2][S3]. Google offered eligible US/Canada owners ~50% off a 4th-gen upgrade through Dec 31, 2025 `reported` [S2].
- Today's date is 2026-09-25 — this cutoff is 11 months in the past, so any 1st/2nd-gen unit still in service is, right now, an orphaned device by Google's own action. This is the single biggest motive-generating event for this project.

**So what for the build:** There is a large, currently-growing population of Nest owners with hardware that Google has just abandoned. That's both the audience and the legal/ethical grounding (abandoned-device right-to-repair) for a local-control project — timing is unusually good.

## 2. Concept and vision

- **Core insight (Nest's):** most people never program their thermostat well; a device that *learns* the household's actual schedule from manual adjustments, and that knows when nobody's home (geofencing / "Home & Away Assist"), saves energy without asking the user to do anything.
- **Core primitives:** a target temperature/setpoint, a learned or manual **schedule**, an **Eco/Away** mode driven by presence, a **history** of temperature and HVAC runtime, and **remote control** via app.
- **Verbs:** set temperature, view/edit schedule, mark home/away, view energy history, get a "leaf" efficiency indicator.
- Nest's stated vision (early marketing) was "conscious home" devices that quietly save energy and money without user effort. `memory`.

**So what for the build:** The concept model (setpoint + learned schedule + presence-based mode + history) is functional, not expressive/creative work — squarely in the "free to reimplement" column of copyright doctrine (ideas/methods of operation, `legal-and-licensing.md` §1). We can and should rebuild this whole primitive set; we just can't copy Nest's UI text, icons, or the "leaf" graphic.

## 3. Market and industry

- **Proprietary competitors:** Ecobee (local-ish scheduling, Alexa built in, still cloud-first for remote features), Honeywell/Resideo, Mysa (cloud), Sensibo (cloud, retrofit AC), Tado (EU-focused, cloud), Sinopé, Flair. All of these use the same "cloud-required-for-remote-control" pattern that we're setting out to avoid — none currently markets a genuinely local-only learning thermostat. `memory`, not re-verified this session; worth a follow-up pass before Prototype mode.
- **Open / DIY competitors, found this session:**
  - **NoLongerEvil-Thermostat** (`codykociemba/NoLongerEvil-Thermostat`, MIT-ish per third-party summary, active in 2025–2026, "FULU Bounty Winner") — jailbreaks Nest **1st/2nd gen** hardware via a known OMAP USB-DFU boot exploit, replaces the firmware's server URL, and offers **cloud-hosted, self-hosted-via-Home-Assistant-add-on, or self-hosted standalone-server** modes. `confirmed` (README fetched directly) [S23]. This is the closest thing to "the target itself, already partly liberated" that exists.
  - It explicitly credits and builds on two older public security-research repos: `exploiteers/NestDFUAttack` (the original DFU exploit) and `ajb142/omap_loader` (the USB flashing tool) — both already public. `confirmed`, via S23's own credits section.
  - It ships only a firmware/flashing tool + hosting options today; no visible "learning" scheduling engine, geofencing, or energy-history UI comparable to Nest's — it restores connectivity and basic control, not the smart layer. `inferred` from the README's feature description (installer + hosting modes only) [S23].
  - A hardware alternative also referenced: `sett.homes`, described as a "drop-in PCB replacement" for the same generation. `confirmed` (linked directly in S23's README), not independently investigated further this session.
  - Several small community add-ons already exist to bridge it into Home Assistant/HomeKit (`patricktr/NoLongerEvil-HomeAssistant`, `will-tm/home-assistant-nolongerevil-thermostat` via MQTT, `lastowl/homebridge-nolongerevil-nest`). `reported` [S from GitHub search].
  - **ESPHome / Home Assistant DIY thermostat projects** — many hobbyist writeups (ESP32/ESP8266 + relay board wired directly to 24VAC HVAC terminals, driven by ESPHome, scheduled/automated from Home Assistant). `reported`, multiple independent sources [S30][S31][S32]. Mature, well-trodden, fully local, but these are "climate entity + automations," not a purpose-built learning-thermostat product with its own UI/learning engine.
  - **Historical:** Spark.io (2014) and Adafruit both built early open-source Nest-alternative thermostats around the time of the Google acquisition, as a reaction to it. `reported` [S29]. Shows the "open alternative to Nest" impulse is over a decade old and has never produced a lasting mainstream project — an opening.
- **Legacy cloud libraries, now largely dead-ends:** `python-nest`, `homebridge-nest` and similar wrapped the old "Works With Nest" API, which Google announced it would shut down Aug 31, 2019, then partially walked back for *existing* integrations only (no new ones) `reported` [S6][S7]. These libraries are a historical dead end for new local-control work — not a foundation to build on.

**So what for the build:** Don't reinvent the DFU jailbreak — that hard, narrow, legally-sensitive reverse-engineering work is already done and open (MIT) for Gen 1/2. Our differentiated wedge is the layer nobody has built yet: a **vendor-agnostic local "smart thermostat brain"** (learning schedule, presence, energy history, clean UI) that can drive *multiple* local backends — NoLongerEvil-liberated Gen 1/2 hardware, Matter-based Gen 4 hardware, and plain ESPHome/DIY relay hardware — through one open, well-designed core, rather than one more hardware-specific hack.

## 4. Business model

- Current Nest thermostat pricing (US): **Nest Thermostat** (budget model) **$130**; **Nest Learning Thermostat (4th gen, 2024)** **$279.99**, sold with a bundled temperature sensor. `reported` [S8].
- No stated ongoing subscription is required for basic thermostat function (unlike Nest cameras/Nest Aware); the business model is hardware margin plus ecosystem lock-in (Google Home app, Google Assistant, ties into the broader Google account). `inferred`, consistent with reviewer complaints below.
- Google's **Device Access Program** (the only officially sanctioned third-party integration path today) charges a **one-time developer registration fee** and requires a **Google Cloud project** and OAuth through a Google account; it exposes thermostats via the cloud-based **Smart Device Management (SDM) REST API**, not a local API. `reported` [S4][S5]. This confirms: even Google's *official* "let developers integrate" story is cloud-and-Google-account-required, for every generation except where Matter applies (see §7).
- Pricing history / cost of "abandonware": Google is now using a **discount on new hardware** as the mechanism to move Gen 1/2 owners off orphaned devices rather than supporting them — i.e., the business model actively benefits from cloud dependency creating forced upgrades. `inferred` from S1–S3.

**So what for the build:** The "SSO-tax"-equivalent gate here is Google's *entire remote/smart feature set* — it's 100% gated behind a Google account and (for developers) a paid cloud registration. Zero-Google local control is not a minor feature gap; it is the whole better-thesis.

## 5. Users and jobs

- **Job to be done:** "When I'm not thinking about it, I want my house to be the right temperature and my energy bill to be low, without me manually programming a schedule or checking an app."
- **Love themes (from Nest's reputation broadly):** learning algorithm removes the need to manually schedule; attractive hardware/UI; "leaf" energy feedback; wide third-party ecosystem (historically). `memory`, general reputation, not from this session's review mining — flag for a deeper review-mining pass before Prototype mode.
- **Pain themes, found this session** (ConsumerAffairs / PissedConsumer aggregate, ~1.6★ average across ~1,570 reviews on the Google Nest storefront listing `reported` [S16][S18]):
  - Forced Google-account linkage: *"users complain that they don't want to share their Google account with their home thermostat, but Google demands that users connect the two things."* `reported` [S16]
  - Unpredictable automatic behavior: temperature "continuously changing regardless of owner settings," unwanted Eco-mode switches, Home/Away flapping — several users report disabling Wi-Fi entirely just to get a stable basic controller. `reported` [S16]
  - Forced migration breaking access: *"when they were instructed to 'Migrate to Google,' all access to their device ceased."* `reported` [S16]
  - Mozilla Foundation's *Privacy Not Included* project has a dedicated review of the Google Nest Learning Thermostat's privacy posture (exact verdict not opened this session — flagged as a follow-up read). `reported` [S17]
  - Poor support, unclear billing/refunds for connected subscriptions (Nest Aware et al., which bleeds into the general Nest support experience even though the thermostat itself isn't subscription-gated). `reported` [S16]
- **Switching blockers:** physical HVAC wiring compatibility (C-wire/common-wire availability, multi-stage heat pumps), sunk cost in existing Nest hardware, and (for people who like it) the learning algorithm's quality — a fresh open project has to earn trust on "does it actually learn well" before people give up a device they already paid for.
- **Switching triggers:** exactly what's happening now — the Oct 2025 EOL notice, the forced-migration horror stories, and the general Google-account-required friction.

**So what for the build:** The better-thesis writes itself from the pain themes: stop being surprised by the thermostat, stop needing a Google account, stop being at the mercy of a vendor's support calendar. A full quantitative review-mining pass (30–60 reviews, themed and counted) belongs in Prototype/Project mode; this Brief pass is qualitative and directional only.

## 6. Product

- **Feature inventory (see parity matrix for full detail):** setpoint control, auto-learning schedule, Home/Away Assist (geofencing + built-in motion sensor), Eco temperatures, multi-room temperature sensors (4th gen ships with one), energy history + "leaf," Farsight (ambient display), remote app control, voice assistant integration, multi-stage/heat-pump HVAC support, System Health Monitor (4th gen), Matter support (4th gen only) `reported` [S8][S9].
- **Core loop:** sense current temp/humidity/presence → compare to learned or manual schedule → drive HVAC relays (heat/cool/fan) → log runtime and outcome → adjust the learned schedule over time.
- **Domain model (inferred):** Device → {Setpoint, Mode (heat/cool/auto/eco/off), Schedule (time-of-day × day-of-week × temp), Sensor readings (temp/humidity/occupancy), HVAC relay state (W/Y/G/Rc/Rh/C wiring), History log}. Multi-sensor 4th-gen adds a Room concept (which sensor "wins" for a given zone/time). `inferred`.
- **Platforms:** iOS/Android app, Google Home app, (4th gen) any Matter controller, (older gens, pre-2019) various "Works with Nest" third parties, (all, officially) Google Assistant / Alexa via cloud skills.
- **Notable UX convention, described independently (not copied):** a single physical rotating-ring dial for manual setpoint adjustment, paired with a round display — a widely imitated but *not exclusively Nest's* physical affordance (Honeywell and others use dials too); we should design our own distinct hardware/UI identity rather than a round-dial look-alike, per the legal guidance on close visual resemblance.

**So what for the build:** The feature list is buildable end-to-end by a small team; nothing here requires data or scale Nest uniquely has. Multi-stage HVAC and heat-pump support is the one area with real domain complexity (compressor minimum-off-time, auxiliary/emergency heat staging) — worth flagging as a "hard part," not because it's mysterious but because getting it wrong damages real HVAC equipment.

## 7. Technology

- **Inferred architecture, original hardware (1st–3rd gen):** TI OMAP (AM3703, ARM Cortex-A8) main SoC running embedded Linux, with a separate **EM357 Zigbee radio SoC** (ARM Cortex-M3) handling the "Weave" protocol (Nest's own IEEE 802.15.4 + Wi-Fi based device-to-device protocol, later open-sourced in spirit but superseded industry-wide by Thread/Matter) `reported`, teardown sources [S25], protocol background [S26]. Boots via a USB **DFU (Device Firmware Update)** mode at the OMAP ROM level — this is the exact mechanism NoLongerEvil's jailbreak uses.
- **4th gen (2024) is a materially different, newer platform**: it added a **Matter** certification, a larger screen, and a "System Health Monitor." `reported` [S8][S9]. Its exact SoC/radio stack was not independently re-verified this session (no fresh teardown found) — flagged as a research gap before hardware work on Gen 4 specifically.
- **The load-bearing fact for this whole project:** Matter, when supported, is a **local-first protocol by design** — a Matter controller (including the fully open, Apache-2.0-licensed `python-matter-server`/Matter.js server that Home Assistant uses) talks to a Matter device **directly on the LAN**, with no cloud round-trip required for basic control, once the device is commissioned onto a fabric. `reported`, multiple independent sources converge on this [S10][S12][S13][S14][S15]. This means genuine local control of a **currently-sold, currently-supported** Nest thermostat is achievable *without reverse-engineering anything* — a categorically safer and more durable path than firmware jailbreaking.
- **The one caveat found:** initial Matter commissioning of the 4th-gen Nest currently appears to require opening the **Google Home app** at least once to enable "Linked Matter apps & services" before another controller (e.g., Home Assistant) can join the device's Matter fabric. `reported` [S10]; whether this is a hard Google-side requirement or just the documented default flow (some Matter devices support direct multi-fabric commissioning without any vendor app) was **not conclusively confirmed** this session — this is the single most important open technical question for the "without Google" claim on Gen 4 and needs a hands-on test with real hardware before Prototype mode.
- **Older/orphaned hardware (1st/2nd gen) local path:** requires physical USB access and the OMAP DFU exploit already packaged by NoLongerEvil (Docker-based firmware builder, Electron-based flashing GUI, self-hostable server or Home Assistant add-on for control after flashing) `confirmed` [S23].
- **3rd gen (2015) and the budget "Nest Thermostat"/"Nest Thermostat E" line:** no Matter support and no known jailbreak found this session; today they can only be reached through Google's cloud SDM API. Flagged as **out of scope** for a genuinely local build until/unless that changes. `assumption`, pending further research.

**So what for the build — three hardest problems:**
1. **Multi-backend abstraction.** The "brain" (scheduling/learning/presence) needs one clean internal interface over at least three very different transports: Matter (Gen 4, official/local/no-jailbreak), MQTT/HTTP to a NoLongerEvil-liberated device (Gen 1/2, jailbreak-dependent, third-party project), and GPIO/relay (fully open DIY hardware). Building blocks: `python-matter-server`/Matter.js (Apache-2.0) for Matter; MQTT (any broker, e.g. Mosquitto, EPL/EDL) as the lingua franca for the others.
2. **Confirming and minimizing the residual Google touchpoint on Gen 4.** If one-time Google Home app commissioning turns out to be unavoidable, be explicit about it rather than overclaiming "zero Google" — this is a "so what for the build" that directly shapes the honest README status table later.
3. **Safe, correct HVAC driving logic** (multi-stage, heat pump, compressor short-cycle protection, C-wire detection) — a domain-correctness problem, not a research-access problem; solvable from public HVAC wiring standards and existing open thermostat projects' published behavior, never from Nest's own firmware.

## 8. Where the value lives

| Source of value | Strength | Can an open version match, beat, substitute, or not reach it? | Why |
|---|---|---|---|
| Software and workflow (scheduling, learning, presence, UI) | High | **Match/Beat** | Pure logic problem, well understood, no proprietary data needed |
| Network effects | Low | N/A | Thermostats aren't a network good; no multi-user network to replicate |
| Data (learned household patterns) | Medium, but per-household | **Match** | Each household's own usage data trains its own schedule locally — nothing to import from Google, no aggregate dataset advantage that matters at single-home scale |
| Content | None | N/A | No content library involved |
| Operations and humans (support, RMA) | Medium | **Not reach at first / Later** | A commercial venture would need this; a Brief/Prototype/Project-mode open project relies on community support instead — be explicit about that trade-off |
| Hardware | Medium-High (for existing Nest units) | **Substitute** | Either reuse Nest's own already-purchased hardware via the two legitimate local paths (Matter, or the already-open NoLongerEvil jailbreak), or bypass it with open ESP32-class hardware |
| Brand and trust | High (Google's) | **Not reach** | An open project can't borrow Google's brand trust and must earn its own — but Google's trust is actively being spent down by the abandonment (§1), which helps |
| Licenses and certifications (FCC/CE radio certs on Nest hardware) | High, for *selling* new hardware | **Not reach without doing the work** | Only relevant if/when this project ships its own new physical device for sale — flagged for the hardware roadmap, not the Brief-mode plan |

## Legal surface

- **Trademarks to avoid:** "Nest," "Google Nest," "Nest Learning Thermostat," the Nest logo/leaf icon, Google's product trade dress. Never put "Nest" inside our project's name (`legal-and-licensing.md` §5). Refer to it only factually: "an open-source alternative to the Google Nest Learning Thermostat," with a non-affiliation line.
- **Reverse-engineering / DMCA exposure (Gen 1/2 jailbreak path only):** the OMAP DFU exploit is a technical-protection-measure circumvention under US DMCA §1201 in the strict sense (it unlocks a boot-level flashing mode not intended for end users), even though the devices are now vendor-abandoned. §1201(f) has only a narrow interoperability exemption, and the triennial Copyright Office rulemaking has granted some device-repair exemptions in other categories (phones, some IoT) but a thermostat-specific exemption was **not verified this session** — this is exactly the kind of question the legal reference flags as a "recommend a lawyer" trigger ("the target is a device with firmware or DRM," `legal-and-licensing.md` §11). Practical mitigation: don't re-derive the exploit ourselves; if we integrate with NoLongerEvil at all, do it as an optional, clearly-labeled, community-maintained integration that depends on *their* already-public project, not as work we did.
- **Matter path (Gen 4) has materially lower legal risk:** it uses a documented, standards-based local protocol with no circumvention involved at all — this is the "path 1: open firmware/software for existing hardware, where the device is designed to be reflashed *or the local protocol is intentionally exposed*" case from the hardware playbook, in its safest form.
- **Terms of service:** Google's Nest Additional Terms of Service and general Google ToS were not fetched directly this session (proxy blocked `developers.google.com`); before any hands-on API/account testing, read them for reverse-engineering/competitive-use clauses per `legal-and-licensing.md` §4. Flagged as a pre-Prototype-mode task.
- **Patents:** HVAC/thermostat control is not flagged in the legal reference's patent-heavy list (codecs, cellular, compression); no patent search performed, consistent with the skill's default guidance not to search patents casually.
- **Radio/safety certification:** only becomes relevant if this project designs and sells its own new physical hardware (FCC/CE/UKCA, low-voltage design) — not a Brief-mode concern, flagged for the hardware roadmap.

## Contradictions and open questions

- Whether Gen-4 Matter commissioning can be done **without ever opening the Google Home app** (multi-fabric direct commissioning) is unconfirmed — sources describe the documented flow (via Google Home app) but don't state whether it's the *only* flow. **Needs a hands-on test with real hardware.**
- Exact Matter/HomeKit capabilities of the 3rd-gen and budget "Nest Thermostat"/"Nest Thermostat E" models weren't confirmed — one source implied the budget model has native Apple Home (HomeKit) support, which would be a third, independent local-control channel worth investigating.
- NoLongerEvil's stated license ("MIT" per a search-engine-generated summary) was not seen verbatim in a LICENSE file during this session — the README itself says firmware/backend "will be open sourced soon," implying some parts may not be fully public yet. **Verify the actual LICENSE file and current repo state directly before depending on it.**
- Nest's exact current Gen-4 SoC/radio stack (teardown) wasn't found this session.

## Sources

| # | Title | URL | Published | Accessed | Tag basis |
|---|---|---|---|---|---|
| S1 | End of support for Nest Learning Thermostats (1st & 2nd gen) | https://support.google.com/googlehome/answer/16233096 | — | 2026-09-25 (search snippet only) | reported |
| S2 | Google Announces End Date for Original Nest Thermostat Support | https://www.macrumors.com/2025/04/30/google-end-date-original-nest-thermostat/ | 2025-04-30 | 2026-09-25 (search snippet) | reported |
| S3 | Google Nest Is Shutting Down Support — Here's What to Do Before October 25th | https://www.128plumbing.com/blog/google-nest-is-shutting-down-support-heres-what-to-do-before-october-25th/ | — | 2026-09-25 (search snippet) | reported |
| S4 | Get Started \| Device Access \| Google for Developers | https://developers.google.com/nest/device-access/get-started | — | fetch blocked by proxy | reported |
| S5 | Update Nest integration to support Google Nest Device Access, home-assistant/core PR #41689 | https://github.com/home-assistant/core/pull/41689 | — | 2026-09-25 (search snippet) | reported |
| S6 | Nest API shutting down on August 31, 2019 — Home Assistant Community | https://community.home-assistant.io/t/nest-api-shutting-down-on-august-31-2019/115456 | 2019 | 2026-09-25 (search snippet) | reported |
| S7 | Google Backtracks on Ending 'Works With Nest' | https://www.tomsguide.com/us/google-ends-works-with-nest,news-30036.html | 2019 | 2026-09-25 (search snippet) | reported |
| S8 | Nest Learning Thermostat (4th Gen) vs. Nest Thermostat | https://www.digitaltrends.com/home/nest-learning-thermostat-4th-gen-vs-nest-thermostat/ | — | 2026-09-25 (search snippet) | reported |
| S9 | Nest Learning Thermostat 4th gen — Matter Alpha | https://www.matteralpha.com/google-llc/nest-learning-thermostat-4th-gen-p1897 | — | 2026-09-25 (search snippet) | reported |
| S10 | Nest Thermostat + Home Assistant: Matter & SDM Setup | https://www.leios.consulting/guides/nest-thermostat-home-assistant/ | — | 2026-09-25 (search snippet) | reported |
| S11 | Nest thermostat + matter = local hvac control? — HA Community | https://community.home-assistant.io/t/nest-thermostat-matter-local-hvac-control/603058 | — | 2026-09-25 (search snippet) | reported |
| S12 | Running Home Assistant & Matter Server on a UGREEN NAS | https://sergeytihon.com/2026/01/03/running-home-assistant-matter-server-on-a-ugreen-nas-a-deep-dive-into-thread-device-commissioning/ | 2026-01-03 | 2026-09-25 (search snippet) | reported |
| S13 | Set Up a Local Matter Controller in Home Assistant | https://theethicalhacker.blog/local-matter-controller-home-assistant/ | — | 2026-09-25 (search snippet) | reported |
| S14 | Matter — Home Assistant docs | https://www.home-assistant.io/integrations/matter/ | — | 2026-09-25 (search snippet) | reported |
| S15 | home-assistant-libs/python-matter-server | https://github.com/home-assistant-libs/python-matter-server | — | 2026-09-25 (search snippet) | reported |
| S16 | Nest Reviews & Complaints — ConsumerAffairs | https://www.consumeraffairs.com/homeowners/nest.html | — | 2026-09-25 (search snippet) | reported |
| S17 | *Privacy Not Included*: Google Nest Learning Thermostat — Mozilla Foundation | https://www.mozillafoundation.org/en/privacynotincluded/google-nest-learning-thermostat/ | — | 2026-09-25 (search snippet) | reported |
| S18 | Google Nest Reviews — PissedConsumer | https://google-nest.pissedconsumer.com/review.html | — | 2026-09-25 (search snippet) | reported |
| S19 | No Longer Evil Thermostat — Tom's Hardware | https://www.tomshardware.com/software/no-longer-evil-thermostat-heats-your-home-better-by-removing-google-revive-sunsetted-hardware-gain-more-precise-control-open-source | — | fetch blocked by proxy | reported |
| S20 | Your unsupported Nest thermostat might be saved by this free, open-source project — Android Central | https://www.androidcentral.com/accessories/smart-home/your-unsupported-nest-thermostat-might-be-saved-by-this-free-open-source-project | — | 2026-09-25 (search snippet) | reported |
| S21 | Google pulled the plug on old Nest Thermostats, but this project revives them — 9to5Google | https://9to5google.com/2025/11/03/google-nest-thermostat-old-revive-project/ | 2025-11-03 | 2026-09-25 (search snippet) | reported |
| S22 | Nest Thermostat: Now 100% Less Evil — Hackaday | https://hackaday.com/2025/11/11/nest-thermostat-now-100-less-evil/ | 2025-11-11 | 2026-09-25 (search snippet) | reported |
| S23 | codykociemba/NoLongerEvil-Thermostat README | https://github.com/codykociemba/NoLongerEvil-Thermostat | — | 2026-09-25 (fetched directly) | **confirmed** |
| S24 | Nest Thermostat / Nest Protect teardowns — SparkFun Learn | https://learn.sparkfun.com/tutorials/nest-thermostat-teardown-/all | — | 2026-09-25 (search snippet) | reported |
| S25 | Weave (protocol) — Wikipedia | https://en.wikipedia.org/wiki/Weave_(protocol) | — | 2026-09-25 (search snippet) | reported |
| S26 | Spark.io Builds Open Source Nest-Alternative Smart Thermostat — SlashGear | https://www.slashgear.com/spark-io-builds-open-source-nest-alternative-smart-thermostat-17313622/ | ~2014 | 2026-09-25 (search snippet) | reported |
| S27 | ESPHome HVAC Zone Controller for Home Assistant — HA Community | https://community.home-assistant.io/t/project-esphome-hvac-zone-controller-for-home-assistant-24vac-up-to-7-zones/993228 | — | 2026-09-25 (search snippet) | reported |
| S28 | ESP8266 WiFi Smart Thermostat Powered by ESPHome and Home Assistant | https://joestump.github.io/hass/esp8266-thermostat/ | — | 2026-09-25 (search snippet) | reported |
| S29 | Build a Smart Thermostat with ESP32, Home Assistant, and Relays | https://omarghader.github.io/esp32-smart-thermostat-home-assistant-relay-sensors/ | — | 2026-09-25 (search snippet) | reported |

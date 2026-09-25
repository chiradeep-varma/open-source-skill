# Playbooks by product type

SKILL.md's default path assumes a web application. Other kinds of target change what's feasible, where the value lives, how the result is distributed and what the legal traps are. Read the section that matches, and more than one if the target spans types (a SaaS with mobile apps, for example).

## Contents
1. SaaS and web apps
2. Desktop apps
3. Mobile apps
4. Developer tools, CLIs and libraries
5. Infrastructure, APIs and platforms
6. AI products
7. Marketplaces, networks and social products
8. Hardware and IoT devices
9. Games
10. Communication and protocol-based products
11. Data and content products
12. Enterprise suites (ERP, CRM, HR, accounting)
13. Browser extensions
14. Targets too big to replicate whole

---

## 1. SaaS and web apps

- **Value lives in** the workflow, collaboration, integrations and convenience. It's usually well within reach of an open project.
- **Architecture.** A single-tenant self-hosted default, with multi-tenancy only if a hosted offering is planned. One `docker compose up`, Postgres, and a background worker. Email and object storage go through pluggable adapters.
- **Adoption levers.** An importer from the incumbent, a public demo instance or recorded walkthrough, and one-click deploy templates for popular platforms.
- **Traps.**
  - Rebuilding every enterprise feature.
  - Making self-hosting depend on five services.
  - Forgetting that **integrations need OAuth apps.** Connecting to Google, Microsoft, Slack and similar providers means each self-hoster must register their own OAuth client, and some scopes (calendar and mail, for example) require the provider's verification before the public can use them. Document it step by step, because it's often the hardest part of self-hosting an integration-heavy product. Standards-based fallbacks such as CalDAV, IMAP and webhooks avoid the problem where they're available.

## 2. Desktop apps

- **Value lives in** responsiveness, the file format, and plugins or ecosystem.
- **Architecture.** Choose native, Qt (LGPL/GPL or commercial), Electron (MIT) or Tauri (MIT/Apache-2.0) based on the performance needs and the user's skills. Treat the document or file format as a public contract: version it and document it.
- **Distribution.**
  - GitHub Releases, plus Homebrew, winget, Flathub or Snap.
  - Code signing and notarization cost money and need developer accounts: Apple notarization, and Windows signing to avoid SmartScreen warnings. Budget for them in the charter.
  - Add auto-update with signed update feeds.
- **Adoption levers.** Opening the incumbent's files, where the formats are documented or already reverse-engineered by open projects (reading them is interoperability). Keyboard shortcuts that feel familiar (behavior, not copied text).
- **Shells over big open engines.** Many desktop products are a proprietary interface over a huge open component: browsers over Chromium or Gecko, code editors over an open editor core, note apps over an open database. Build on the same open component and put the effort into the layer that makes the product distinct. Never set out to rebuild the engine itself, and track the upstream project's releases, especially security updates, as a standing maintenance cost.

## 3. Mobile apps

- **Value lives in** the experience and in the backend service. A mobile app is rarely the whole product.
- **Architecture.** Native, or a cross-platform framework such as Flutter (BSD-3), React Native (MIT) or Kotlin Multiplatform (Apache-2.0). Plan the backend and sync first. Push notifications go through Apple and Google gateways; UnifiedPush is an open option on Android.
- **Distribution.**
  - The app stores' fees, review rules and privacy labels.
  - **F-Droid** requires fully free builds, with no proprietary SDKs such as Google Play Services. Design for that from the start if it matters to the audience.
  - GPL and app-store terms have conflicted before, so choose the license with the distribution channels in mind.
  - Alternative iOS distribution is limited, and depends on region (the EU's DMA opened some routes).
- **Traps.** Analytics or crash-reporting SDKs that phone home. Leave them out, or make them opt-in and open.

## 4. Developer tools, CLIs and libraries

- **Value lives in** correctness, speed, ergonomics and ecosystem integrations.
- **Adoption levers.**
  - **Drop-in compatibility**: the same command-line flags, config file format or API shape, where that's functional. Compatibility is legal, but write your own docs. Document which parts are compatible.
  - Honest, reproducible benchmarks.
  - Great error messages.
  - Packaging for every relevant registry.
- **Testing.** Build your own conformance suite from the documented behavior. Don't copy the incumbent's test suite unless its license allows it.
- **Licensing.** Apache-2.0 or MIT maximizes adoption for libraries.

## 5. Infrastructure, APIs and platforms

This covers databases, queues, storage, authentication, backend-as-a-service and observability.

- **Value lives in** reliability, operability, performance and the ecosystem of clients and tools that work with it.
- **Adoption levers.** **Wire-protocol or API compatibility**, such as the S3 API, the Postgres or Redis protocols, or OpenTelemetry. Existing clients and tools then work unchanged, which is the strongest adoption lever in this category.
- **Quality bar.**
  - Correctness under failure: crash-recovery tests and fault injection. Consistency tests in the style of the published Jepsen analyses are worth studying.
  - Backup and restore.
  - Zero-downtime upgrades.
  - Observability.
- **Licensing.** This is where the relicensing wars happened (Elasticsearch, Terraform, Redis, MongoDB's SSPL). Choose the license and governance deliberately; `legal-and-licensing.md` §10 covers the lessons. Foundation governance builds trust for infrastructure people will depend on.

## 6. AI products

This covers assistants, AI coding tools, image and video generators, and "AI-powered X".

- **Value lives in** some mix of model quality, product workflow, proprietary data or evals, and cost efficiency. Decompose it honestly: the model is often *not* the part an open project needs to own.
- **Architecture.**
  - A provider-agnostic model layer, so users can bring their own key or run a local model (llama.cpp, vLLM or Ollama).
  - Retrieval built from open components.
  - **Your own evaluation harness**, with task-specific test sets you create, to measure quality honestly.
- **Legal.**
  - Don't distill from proprietary models whose terms forbid it.
  - Check open-weight model licenses; many are not OSI-open.
  - Datasets need their own licensing review.
  - Your system prompts must be your own.
- **Better-thesis candidates.** Privacy (local inference), transparency (inspectable prompts and pipelines), cost control, and freedom to choose models.

## 7. Marketplaces, networks and social products

This covers ride-hailing, rentals, social networks, forums, creator platforms and chat communities.

- **Value lives in** the network: supply and demand, the social graph, trust and safety operations, payments and local operations. The software is the smallest part.
- **Realistic open strategies.**
  - **Build on an open protocol** instead of inventing one. An app that federates over ActivityPub, the AT Protocol, or Matrix (for chat) can reach users on day one.
  - **Software for co-ops and local operators.** For example, dispatch for a driver-owned co-op in one city, or a booking platform for a local association. The open project provides the rails, and the community provides the network.
  - **Community-scale self-hosting** for a single group, school or company.
- **Hard parts.** Moderation tools, spam and abuse prevention, identity, payments and local regulation. Budget for them as first-class features, not afterthoughts.
- Be explicit with the user that no software release recreates a network. That honesty belongs in the brief.

## 8. Hardware and IoT devices

This covers thermostats, cameras, e-readers, wearables, speakers and printers.

- **Value lives in** the hardware design, manufacturing, certification, the cloud service and the app.
- **Check the lifecycle first.** Search "<device> end of support" and "<device> custom firmware" for each generation. When a vendor abandons a device, owners gain both a motive and, often, a legitimate path to run open firmware on hardware they own. This happened with early Nest Learning Thermostats, whose support ended on 25 October 2025. Which generation the user owns can decide which path below is open.
- **Paths, in increasing difficulty:**
  1. **Open firmware or software for existing hardware**, only where the device is designed to be reflashed or the user can do so without bypassing protections. Circumventing locked bootloaders or DRM runs into anti-circumvention law.
  2. **An open device built from off-the-shelf modules**, such as ESP32 or Raspberry Pi-class boards with standard sensors. Common firmware routes are ESPHome (for Home Assistant integration), Tasmota, or Zephyr RTOS (Apache-2.0) for custom firmware.
  3. **A fully custom open device.** Schematics and PCB in KiCad, enclosure CAD, a bill of materials, firmware and a companion app.
- **Local control first.** Integrate with Home Assistant or Matter where relevant, with no mandatory cloud. This is usually the whole better-thesis.
- **Legal and safety.**
  - Hardware licenses: CERN-OHL-S, -W or -P. OSHWA certification is available for open hardware.
  - **Selling** a device requires radio and safety certification (FCC in the US; CE/RED in the EU; UKCA).
  - Mains voltage and batteries are genuine safety hazards. Flag them, and prefer low-voltage designs.
  - Patents matter more for hardware.
- **Repository contents.** `hardware/` (KiCad sources, Gerbers, BOM), `firmware/`, `app/` and assembly docs with photos.

## 9. Games

- **Value lives in** the mechanics (free to reuse), the expression, meaning art, audio, characters, levels and story (protected), plus the community and the content pipeline.
- **Legal.** Mechanics and rules are free, but a close visual and audiovisual clone infringes (*Tetris Holding v. Xio*, 2012). Use original art, audio, names and levels throughout. Trademarked titles and character names are off-limits.
- **A proven pattern: the open engine reimplementation.** Rebuild the *engine* so it runs the original game using data files the player legally owns (OpenMW for Morrowind, OpenRCT2 for RollerCoaster Tycoon 2). The project ships no original assets, and players supply their own copies.
- **Engines.** Godot (MIT) or Bevy (MIT/Apache-2.0).
- **Traps.** Anti-cheat is fundamentally hard for open clients; design around server authority. Netcode needs early prototyping.

## 10. Communication and protocol-based products

This covers email, chat, calls, calendars, file sync and feeds.

- **Value lives in** reach (who you can talk to), reliability and trust.
- **Strategy.** Implement open standards (IMAP/SMTP/JMAP, CalDAV/CardDAV, WebDAV, XMPP, Matrix, WebRTC, ActivityPub, RSS) so the product works with existing clients and networks from day one.
- **Security.** Use vetted protocols and libraries. Never invent cryptography. Plan an external security review before making claims.
- **Operations.** Email deliverability and TURN servers for calls are operational problems. Document them rather than hiding them.

## 11. Data and content products

This covers datasets, maps, knowledge bases, dictionaries, fonts, courses and stock media.

- **Value lives in** the content itself, its quality and its freshness. Software is secondary.
- **Strategy.** Build from openly licensed sources (Wikidata CC0, OpenStreetMap ODbL, public-domain and government data), and create a contribution pipeline with quality control on the Wikipedia or OpenStreetMap model. Never copy the incumbent's database: compilations and databases have their own protection, including the EU database right.
- **Licensing.** CC-BY-4.0, CC0 or ODbL for data; OFL-1.1 for fonts. Record the provenance of every source.

## 12. Enterprise suites (ERP, CRM, HR, accounting)

- **Value lives in** domain correctness (tax, payroll, accounting rules and compliance), integrations, and implementation services.
- **Strategy.** Pick a **wedge**: one module, one vertical, one country's rules. Make it excellent, and design the rest as modules that plug into it later.
- **Traps.** Country-specific compliance, such as payroll taxes and e-invoicing mandates, is endless. Scope it explicitly, and design jurisdiction rules as pluggable modules.

## 13. Browser extensions

- **Value lives in** a narrow utility and trust (extensions see a great deal of user data).
- **Architecture.** Manifest V3 constraints, minimal permissions, local-first storage, no remote code.
- **Distribution.** Chrome Web Store, Firefox Add-ons and Edge. Reproducible builds help reviewers and build trust.

## 14. Targets too big to replicate whole

This covers operating systems, cloud providers, office suites, search engines and super-apps.

- Say it plainly: the whole thing is a decades-long, thousand-person effort. Then build the useful version:
  - **A wedge** that one person or a small team can own: one service, one workflow, one audience.
  - **Big open foundations as building blocks.** Build on the Linux kernel rather than a new OS kernel, on Kubernetes or standard virtualization rather than a new cloud control plane, and on an open document engine rather than new format parsers. Spend the effort on the layer that makes your product distinct.
- Put the long-term decomposition into modules in the roadmap, so the wedge is clearly a first step and not the whole ambition.

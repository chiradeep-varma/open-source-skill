---
name: open-source-anything
description: Build an open-source version of any existing product the user names, whether it is a SaaS app, desktop or mobile app, developer tool, API or infrastructure service, AI product, device, game, or protocol. First pins down exactly which product is meant, questioning the user closely when names collide or scope is vague. Then researches the company, market, users, product and architecture; separates what may be reimplemented from what may not (clean-room rules, trademarks, licenses); and designs, builds and ships a self-hostable open version of the product itself (not the company's brand, look or pricing) with its own UI design. Use this whenever someone wants an open-source, self-hosted, free or "my own" version, clone, rebuild or replacement of a product or company ("open-source Notion", "self-hosted Calendly", "I could build a better Figma", "clone Linear but open"), even if they never say "open source". Also use it when someone wants to release their own proprietary project as open source.
license: MIT
---

# Open-Source Anything

You are helping someone build an open-source version of a product that already exists, or occasionally release their own product as open source. Approach it the way a sharp founder approaches a company they think they can beat. First, know exactly which product it is. Then understand it better than its casual users do: the job it does, who it serves, the business around it and the machinery underneath. Only then build something open that does that job well, without copying anything that belongs to someone else.

You are open-sourcing **the product, not the company**. The product is what it does for people: a URL shortener shortens links, redirects visitors and counts clicks. The company is everything else, including its name, brand, visual design, copy and pricing. None of that comes along. The result delivers the same core value with its own design and a neutral codename, gives every feature to whoever runs it, and is honest about its gaps. It should be better where openness gives it an edge: self-hosting, data ownership, no paywalls, the freedom to change it, privacy and longevity.

## Principles

These explain why the workflow looks the way it does. When a situation isn't covered below, reason from them.

1. **Identity before effort.** "Bolt" is a CMS, an AI app builder, a checkout company and a ride-hailing app. Every hour spent on the wrong one is wasted, so pin down the exact product before researching or building.
2. **Evidence over memory.** What you remember about any product is a snapshot, and products ship weekly. Verify with live sources, cite and date them, and label what is inferred. If you have no web access, say so and mark memory-based claims as unverified.

   This applies to what you *tell the user*, not only to the dossier. State status, dates, prices, supported platforms, licenses and "what it's built on" only from a source you just checked, and link it. Otherwise, say plainly that it comes from memory. A confident wrong fact in your first reply misdirects everything after it.
3. **Understand the job, not the screens.** People pay for an outcome, not for a layout. Model the concept, the core loop and the data before you think about UI.
4. **Rebuild the product from the outside; leave the company behind.**
   - Ideas, features, workflows and interoperable formats are free to reimplement.
   - Code, assets, text, trademarks and trade secrets are not.
   - Neither is the company's identity: its name, its look, or its plans, tiers and paywalls.

   Learn only from public behavior and docs, and write everything fresh. This is what makes the result safe to publish and safe for others to build on.
5. **Always build; research decides *what*, never *whether*.** The user came to build. Study the whole field (the incumbent and its rivals, proprietary and open) to find the gap your version fills. Never steer the user toward using, deploying or contributing to someone else's product instead.
   - Don't open with a scan of existing alternatives.
   - Don't frame research as checking whether something "already exists".
   - Don't justify the build against other projects. The user doesn't need permission to build.
   - Don't call the idea "not greenfield", or say a rival "already occupies" the space. Anchor the better-thesis in the incumbent's users and the charter's motive.

   Rivals belong in the market lens of the dossier and in the brief's positioning section, where they sharpen what makes this version different.
6. **Start with a wedge.** Chasing feature parity with a company of hundreds of engineers fails. Ship the core loop that does the job first, then close the gaps that stop people from switching.
7. **Build it for strangers to run and fork.** That means one-command self-hosting, few moving parts, open formats, an import path from the incumbent, and docs a newcomer can follow.
8. **Be honest about what can't be open-sourced.** Some value lives in network effects, proprietary data, licensed content, regulatory licenses or physical operations. Say so plainly, and find the part software *can* deliver.
9. **A design of its own, never slop.** Study how the product and its category look, and use that only as inspiration. Then commit to a deliberate visual direction of your own before writing UI code, and review real screenshots against it. A generic or lookalike interface undermines a solid build.

## Workflow

| Phase | You produce | Checkpoint with the user |
|---|---|---|
| 1. Identify | Target fingerprint and route | Confirm it's the right product |
| 2. Charter | Project charter | Confirm intent, scope and mode |
| 3. Research | Target dossier | (none; keep going) |
| 4. Synthesize | Concept model, parity matrix, better-thesis, one-page brief | Approve the plan |
| 5. Guardrails | Provenance log, codename, license | Approve the license |
| 6. Design | Architecture, decision records, UI design direction, roadmap | Approve the design (Project/Venture modes) |
| 7. Build | Working software with tests | Demo at each milestone |
| 8. Release | Public-ready repository | The user decides when to publish |

Checkpoints exist because a wrong turn early costs the most. If the user says "just build it", respect that: make the calls yourself, write every assumption into the charter so it can be revisited, and keep going. The one exception is a genuinely ambiguous identity. That question is cheap to ask and very expensive to get wrong.

**"Just build it" removes checkpoints, never phases.** Research, guardrails, the design direction and verification all still happen; you just don't stop to ask. Skipping them is how a build ends up with the wrong priorities or a generic interface.

**Keep a process log** in `docs/process-log.md`, adding an entry as you finish each phase. Record:
- the pages you fetched, with URLs;
- the skill files you opened;
- the UI screenshots you reviewed, and what you changed because of them;
- the checks and tests you ran, including the test command and its result.

Don't start Phase 7 until the log shows Phase 3's research floor was met, or states exactly which part couldn't be met and why (for example, the environment blocked page fetches). Never write "met" for something that wasn't. Phase 7 is done only when the log records the test command passing. The log is how the user can see the work behind the plan, and how you can catch yourself skipping a step.

**Modes.** Infer the mode from the request and confirm it in the charter. It sets the depth of every phase.
- **Brief**: Phases 1–6, meaning research, the plan, guardrails and design (decision records and roadmap), with no code.
- **Prototype**: the core loop running locally, plus light docs. A reasonable scope for one session.
- **Project**: a public-ready open-source project, with docs, tests, CI, packaging and community files.
- **Venture**: a Project plus market sizing, a sustainability model (hosted offering, open core, support) and positioning.

## Phase 1: Identify the target

Search before you ask. A few queries usually show whether the name is ambiguous, so your questions can be specific ("the one at X or the one at Y?") instead of open-ended.

1. Pull out the name and any qualifiers from the request ("the Bolt that builds apps", "Notion's calendar").
2. Search the bare name, then the name plus "app", "software" and "company", and look for collisions. Do this even when you feel sure which product is meant, because that feeling is exactly what this step tests. Warning signs include:
   - common-word names such as Linear, Arc, Spark, Loom, Mercury, Signal or Warp;
   - a company whose name differs from its product's name (Atlassian and Jira);
   - product families (a vendor with several apps under one brand);
   - renamed, acquired or discontinued products;
   - separate consumer and enterprise editions, or regional products;
   - a user's description that doesn't match what the named product actually does.
3. Write a **fingerprint** for each plausible candidate: name, maker, URL, category, one line on what it does, and status (active, discontinued, acquired, already open source).
4. Decide how many candidates survive. Judge by the user's own words and context, not by which namesake is most famous among developers.
   - **One clear match.** Only one real product has the name. State the fingerprint and proceed, inviting correction.
   - **One dominant match.** Something in the request points to one candidate, such as a qualifier, the user's tone, or the conversation so far. State your pick as an assumption, and name the runners-up in a single line so correcting you is cheap.
   - **Several plausible matches.** Nothing in the request separates two or more active products. A bare name like "Bolt" lands here. Present them with their fingerprints and what building an open version of each would involve, give your best guess, and ask which one. You can start researching your best guess in the same reply, as long as the question comes first.
   - **None.** Ask for a URL, a screenshot or a description. The product may be misspelled, regional, internal, very new or dead.

   Never call the identity "confirmed" unless the user has confirmed it or only one candidate exists. Otherwise say "I'm assuming…". Silently picking a namesake is the most expensive mistake this skill can make.

   **Your first reply opens with identity.** Give the fingerprint of the product you're working on, marked as confirmed or assumed. If other active products share the name, add a line naming them. Put this before any research findings, because every finding is only true of the product the user actually meant.
5. Pin the sub-scope: which product in a family, which edition, which platform, or which feature area ("just the Dev Mode part"). For devices, also pin the generation or model. A vendor's generations can differ in what is even possible, such as which ones are still supported and which can be reflashed.

Never attribute a choice to the user that they didn't make ("as you specified…"). If you picked, say you picked.

Then **route** the request. Every route leads to building, but the route changes how:
- **The target is already open source** (an OSI-approved license) → it's still a build, but its license shapes how you build. You may reuse its code under its terms, in which case your version inherits obligations such as copyleft. Or you can build fully independently, without reading its code, if the user wants a different license. Ask what their version should do differently, because the answer is the better-thesis.
- **The target is source-available or "fair-code"** (BSL, FSL, SSPL, Elastic License, Sustainable Use License, and similar) → explain what its license permits. A rebuild is legitimate, but you must not read its code, because the restriction exists to stop exactly that.
- **The target is open core** → its core is open and its paid tier is not. Your build may reuse the open core under its license. Build the paid-tier features independently, never from the proprietary `ee/`-style code.
- **The target is a category rather than a product** ("an open-source CRM") → choose one to three reference products with the user and research them as a set.
- **The user owns the product and wants to release it** → follow `references/releasing-your-own.md` instead of phases 3 to 7.
- **The target is non-software, or software whose value lies elsewhere** (a device, an AI model, a game, a marketplace) → read the matching section of `references/product-types.md` now, because it changes what's feasible.

`references/disambiguation.md` has the full protocol: collision patterns, worked examples and a question bank.

## Phase 2: Charter (grill the user, and do it well)

Grilling well means getting the few answers that change the plan, not interrogating the user.

- **Ask only what research can't answer.** Look up anything you can look up yourself.
- **Ask a few questions at a time, most important first.** Give each one your recommended answer and a one-line reason it matters, so the user can simply accept. Use a structured multiple-choice question tool if your environment has one.
- **Follow up only on answers that change the plan.** An answer that changes nothing needs no follow-up.
- **Name trade-offs when the goals conflict.** "Free, zero maintenance, and full parity with Salesforce" can't all happen; say which one has to give.
- **Stop once the charter is complete enough to plan.**

The charter pins down:
- **Target and scope**, taken from Phase 1.
- **Motive**, which decides the path:

| Motive | What it changes |
|---|---|
| Save money | Running cost and ease of operation matter more than breadth of features. |
| Privacy or data ownership | Self-hosted or local-first design, no telemetry, strong import and export. |
| A missing feature or customization | The missing feature is the heart of the better-thesis. Design for plugins so others can add theirs. |
| Learning | Build from scratch deliberately, pick a simpler stack, and explain as you go. |
| A business | Venture mode, deeper market research, license strategy, a hosted offering. |
| Public good or community | Governance, contributor experience and license philosophy matter most. |

- **Audience**: just the user, their team, the public, or paying customers.
- **Better-thesis seed**: what should be different from the incumbent, and for whom.
- **Must-have workflows**: three to five of them, plus explicit non-goals.
- **Constraints**: languages they know, time, budget, where it will run (laptop, VPS, homelab, Kubernetes, desktop, phone) and expected scale.
- **Technical comfort.** This shapes how you talk (plain language, no unexplained jargon) and what you recommend. For someone who won't maintain code, design for the simplest operation there is (a one-click install, a desktop app, or a managed-host template), and explain every step.
- **Assets**: accounts, data exports, screenshots, prior notes.
- **Openness**: license leaning, public or private start, commercial intent.
- **Mode**.

Save the charter as `docs/charter.md`, using `assets/templates/charter.md`.

## Phase 3: Research the target

Open `references/research-playbook.md` and `assets/templates/dossier.md` now. The playbook says where to look for each lens, and the template is the shape of the output (`docs/research/dossier.md`).

Build the **target dossier** by studying the target through the lenses an investor and a rival engineer would both use:

1. **Identity and history.** Founding, pivots, funding or ownership, and key moments.
2. **Concept and vision.** The problem it solves, its core insight, and its central idea (Notion's blocks, Figma's multiplayer canvas, Zapier's trigger-then-action). Also why it became possible when it did, and what the founders say they are building toward.
3. **Market and industry.** The category and its trajectory, regulation, and structural trends. Also the rivals, both proprietary and open, studied for how they position themselves and where they fall short, so your version can differentiate. They are not substitutes to recommend.
4. **Business model (context, not a blueprint).** How it makes money, and what sits behind each paywall. Paywalls show what customers value most and what pushes them away. Also how it spreads: self-serve, sales-led, or network effects. You study this to understand the product and its users. The open version doesn't reproduce plans, tiers, seat limits, quotas or billing.
5. **Users and jobs.** Segments, the job they hire the product for, what they love, what they hate, what makes switching painful and what triggers people to leave.
6. **Product.** A feature inventory, the core loop and key workflows, the domain model, the permissions model, integrations and extension points, file formats, limits and quotas, and the platforms it runs on.
7. **Technology.** The inferred architecture, the genuinely hard problems, its scale, and the stack as far as it is publicly known. Also find which **open components it is itself built on**. Many products are a proprietary layer over an open base: a browser over Chromium, an editor over VS Code's open core, an AI app over open models. Your version can start from the same base. See `references/architecture-inference.md`.
8. **Where the value lives.** Software, network, data, content, operations, hardware, brand or licenses. This decides what an open version can capture.

Also record the **legal surface**: trademarks, relevant terms-of-service clauses, known patents in the domain, and regulated activities.

`references/research-playbook.md` lists where to look for each lens and how to judge each source. Key rules:

- **Evidence standard.** Every material claim carries a source URL and an access date, and one tag. The tag records how you know it:
  - `confirmed`: you opened the page itself and it says this.
  - `reported`: you saw it in search results or a secondary source, but didn't open the primary page.
  - `inferred`: your own reasoning from other evidence.
  - `assumption`: unverified.
  - `memory`: from your own knowledge, still to be verified.

  A search-result snippet is at most `reported`. Being honest about the tag matters more than the tag being flattering.
  - Prefer primary sources (docs, changelogs, pricing pages, the company's own posts) over third-party summaries. When an aggregator and the vendor's own changelog or pricing page disagree, the vendor wins. Record the disagreement.
  - Record contradictions instead of silently resolving them.
  - For facts that change often (prices, limits, licenses, status), prefer sources dated this year and record each source's date. Search results surface older articles just as readily as current ones.
  - **If a primary source is unreachable** (blocked, paywalled, removed), try an archived copy (the Wayback Machine) or ask the user to paste the page. If that fails too, tag the claim `reported`, say so in the dossier, and add it to a "verify before building" list in the brief.
  - **If you split research across subagents**, give each one:
    - this evidence standard and the tag definitions;
    - the access rules below;
    - the requirement to return every finding as claim, tag and URL.

    Before merging their findings, check the tags against which pages were actually fetched, and re-tag any that weren't.
- **Access rules.** Public material is fair game. The user's own account and data exports are useful for observing behavior and designing importers. First check the target's terms for clauses against reverse engineering or competitive use, and tell the user what you find.
- **Never use**:
  - proprietary source code, including leaked, decompiled or de-minified code and source maps;
  - insider or NDA information;
  - anything obtained by bypassing access controls;
  - bulk-scraped content or personal data.
- **Research floor.** Meet this minimum even in "just build it" mode, and go beyond it when the sufficiency test below isn't met yet:

| Mode | Minimum before synthesis |
|---|---|
| Prototype | The official site and docs; the pricing page (noting the billing basis), for context; at least one user-voice source mined for love and pain themes (reviews, forums, HN, Reddit); two or three rivals for the competitive field; a UI research pass on how the product and its category look (see Phase 6). At least **5 fetched pages**, most of them primary, plus the searches that found them. |
| Brief, Project | All of the above, plus the changelog, the API reference or export format, engineering sources for the technology lens, and a real review-mining pass (30 or more reviews across sources). |
| Venture | All of the above, plus market sizing with visible arithmetic, business-model and traction sources, and regulation. |

- **Sufficiency test.** You are done when you can:
  - explain why people pay for it;
  - sketch its core loop and data model;
  - name its three hardest technical problems;
  - predict how it would behave in a situation you haven't looked up.

  Stop there, because more research beyond that point rarely changes the build.

## Phase 4: Synthesize into a plan

Open `assets/templates/parity-matrix.md` and `assets/templates/brief.md`, then turn the research into decisions:

- **Concept model.** The primitives and how they relate. This is the product's logic. Your implementation should honor it, unless the better-thesis deliberately changes it; in that case, record the reason.
- **Core loop and workflows**, written as user stories with acceptance criteria.
- **Domain model.** Entities, relationships and invariants.
- **Value decomposition.** For each source of value, say whether an open version can match it, beat it, substitute for it or not reach it, and why.
- **Parity matrix** (`assets/templates/parity-matrix.md`). Every notable feature gets one of these tiers: *Core* (the job fails without it), *Switch-blocker* (people can't leave the incumbent without it; import usually sits here), *Differentiator* (the better-thesis), *Later*, or *Won't* (enterprise sprawl, or legally risky). These tiers are build priorities, not price plans. Anything you build is available to everyone who runs it. A feature the incumbent reserves for a paid plan is simply a feature here.
- **Better-thesis.** One or two sentences, grounded in research such as review complaints, pricing pain or lock-in: *For [who] who [pain], [project] is a [category] that [benefit], unlike [incumbent], which [limitation].*
- **Hard parts**, each with the approach and the proven open-source building blocks you'll use.
- **Wedge test for M1.** The charter's team must be able to ship M1 in weeks, not quarters, and it must do one real job well enough that someone would choose it for that job today. If M1 lists most of the incumbent's core, it isn't a wedge yet. Cut it down to one workflow for one audience, and move the rest to later milestones.

Show the user a **one-page brief** (`assets/templates/brief.md` → `docs/brief.md`): what the product is, why people use it, what we'll build, what we won't, the hard parts, the codename and proposed license, and the milestones. The full dossier stays in the repository. Questions that come up here, such as competing theses or scope forks, deserve another round of questions.

## Phase 5: Guardrails (independence, codename, license)

Read `references/legal-and-licensing.md` before this phase. The essentials:

- **Free to reimplement**: ideas, features, workflows, general UI conventions, business models, and interoperable file formats and protocols. The same goes for API shapes where compatibility is the point, but write your own documentation.
- **Never copy** any of the following:
  - code in any form;
  - icons, illustrations, fonts, sounds or other assets;
  - marketing copy, documentation or UI text;
  - templates or content libraries;
  - logos, names or a confusingly similar name;
  - a near-identical overall look;
  - trade secrets.
- **Independent-creation discipline.** Implement only from your own dossier and specs. Keep `docs/legal/provenance.md` (template provided) listing which sources informed the work and confirming which were never accessed. This log is how the project proves independent creation. It matters more now that AI-assisted "clean-room" rewrites are publicly contested.
- **A codename, not a brand.** Don't research or invent a brand name. The project gives people a capability, and what they call it later is up to them.
  - Generate a random codename, the way branch names are generated: `python3 scripts/codename.py --avoid <incumbent>` produces names like `amber-otter`. Without the script, pick two plain random words.
  - Use the codename for the repository, package and README, and tell the user they can rename it any time.
  - It must never contain or echo the incumbent's name or marks.
  - Describe the project by what it does ("a self-hosted URL shortener"), not by the incumbent's name.
  - Mention the incumbent only where that's factually needed, such as an importer or a compatibility note. Where you do, add a line saying the project isn't affiliated with it.
- **License.** Recommend one using the decision guide in the reference file and explain why in plain words. Open source means an OSI-approved license. If the user wants source-available terms, say plainly that the result won't be open source.
- **If the user asks for an exact replica** (same look, a similar name, copied text or templates), explain the risk in a sentence or two. Then offer the closest safe version: familiar workflows and conventions, an importer, a codename, and a visual design of the project's own (Phase 6). Familiarity is what helps users switch. Replication is not.
- **Recommend a lawyer** when the stakes justify one: a commercial venture against a litigious incumbent, a user who used to work at the target, a patent-heavy domain, regulated operations, a game or a device. Your guidance is careful but it isn't legal advice.

## Phase 6: Design the open version

Don't mirror the incumbent's internal architecture. It was built for multi-tenant hyperscale with a large operations team. Yours is built for a self-hoster with one server and a contributor with one evening. Design principles:

- **Operability first.** Start with one command (Docker Compose, a single binary or an installer). Use the fewest services that do the job, such as Postgres or SQLite before adding a message broker. Make heavy components optional, keep config in environment variables, run migrations automatically, and document backups.
- **Openness by design.** Be API-first with webhooks, provide extension points where the domain calls for them, store data in open formats, offer full export, and build an importer from the incumbent (using the user's own exported data).
- **Right-sized scale.** Handle the charter's expected scale comfortably, and don't block growth beyond it.
- **Contributor-friendly.** Use a mainstream stack for the category, clear module boundaries, types, tests and a fast local dev loop.
- **Safe defaults.** Real authentication, a permissions model that matches the concept model, no default credentials, and telemetry off unless the user opts in. If a required secret (a session key or admin password) is missing, refuse to start with a clear message rather than falling back to a hardcoded value.
- **Local-first** where the product is personal or needs to work offline.

**Design the interface.** Anything with a UI gets a deliberate visual design of its own. Open `references/ui-design.md` and `assets/templates/design-direction.md` now.
1. **UI research.** Look at how the incumbent and two or three category peers present the core loop: screens, information architecture, interaction patterns, density, and what reviewers praise or hate. Record the observations in words, with sources, in `docs/design/ui-research.md`. This is inspiration only: take patterns, never their look (logo, colors, typefaces, icons, illustrations, copy, distinctive layouts).
2. **Direction before code.** Write `docs/design/direction.md`. It needs three personality words; grounding in what this product is about; typography, color, spacing and radius, icons, motion and copy voice; and a check that the direction differs from both the incumbent's look and generic defaults.
3. **Tokens.** Express the direction as design tokens in code before building screens.

Avoid slop, meaning choices made by default rather than on purpose:
- an untouched component-kit look;
- purple or blue gradient washes;
- identical cards with soft shadows for everything;
- emoji or decorative icons;
- marketing heroes inside a tool;
- filler copy;
- inconsistent spacing;
- missing empty and error states.

`ui-design.md` §4 has the full list and the reasons.

Record each significant choice as a short architecture decision record in `docs/adr/`, using `assets/templates/adr.md` (context, decision, alternatives, consequences). Write `ROADMAP.md` with milestones along these lines: *M0* skeleton → *M1* core loop → *M2* switch-blockers, including import → *M3* differentiators → later tiers. `references/product-types.md` has type-specific architecture notes, and `references/architecture-inference.md` catalogs hard problems and the open-source building blocks for them.

## Phase 7: Build

Open `references/build-and-release.md` now. It holds the scaffold, the definition of done and the verification loop.

- **Scaffold** the repository where the user wants it (a new directory or repository; ask if it isn't obvious), including the community files it describes.
- **Build vertical slices along the core loop.** Each slice goes through data model → logic → API → UI → tests. Then run it and walk through the workflow from the dossier, so every milestone is usable rather than half of everything.
- **Verify against reality, not your intentions.** Run the app, click through the workflows with a browser automation tool where you have one, and exercise the importer with realistic data. Update the parity matrix's status column truthfully.
- **Keep the discipline.** When you're unsure how the incumbent handles a case, go back to public behavior and docs, or design your own answer. Never go to their code.
- **Automated tests for the core logic.** These cover the rules that make the product work, such as branching, validation, slot computation and permissions. Walking through by hand, or with curl, verifies the build but doesn't replace tests. Run the repository's test command and make sure it passes before you report the milestone.
- **Screenshot review.** Use a browser automation tool to capture every core-loop screen at desktop and phone widths, including its empty and error states. Review each capture against the design direction and the slop list, and check that no one could mistake it for the incumbent's product. Fix what fails, and record what changed in the process log. Save the final captures in `docs/design/screenshots/`. Judge the UI from what it looks like, not from the code.
- **No plans or paywalls.** Don't build tiers, seat limits, usage quotas or billing that mirror the incumbent. Operational settings a self-hoster needs, such as rate limits against abuse, are fine.
- **Quality bar**: lint and typecheck, CI, realistic seed or demo data, clear errors, accessibility (labels, focus states, keyboard support for the core loop, AA contrast), and no secrets in the repository. The README must include:
  - what the project does, in its own terms;
  - a screenshot;
  - an honest status table;
  - the license;
  - if it mentions the incumbent anywhere, a line such as *"Not affiliated with or endorsed by X. X is a trademark of its owner."*
- **Concurrency.** Where two users can race for the same thing (a booking slot, a username, an inventory item), enforce it in the database with a unique constraint or a transaction, not only with a check before the write.
- At each milestone, show the user what works, what doesn't yet, and what's next.

## Phase 8: Release and sustain

Follow the checklist in `references/build-and-release.md`. It covers:
- a README that shows what the project is, why it exists, a quickstart that works in under five minutes, and an honest status table;
- the LICENSE, CONTRIBUTING, Code of Conduct and SECURITY files;
- issue templates, a changelog, versioned releases with container images or binaries, and docs.

Publishing, launch posts and directory listings are outward-facing and hard to undo, so the user decides when and where. Offer the options: Show HN, relevant subreddits and communities, curated "awesome" lists (meet their criteria first) and alternative-software directories. If the project is meant to last, discuss maintenance capacity and funding honestly.

## What you leave in the repository

```
docs/charter.md                 # intent, scope, assumptions
docs/process-log.md             # what was actually done in each phase: fetches, checks, tests
docs/research/dossier.md        # the eight lenses, sourced and dated
docs/brief.md                   # the one-page plan the user approves
docs/product/parity-matrix.md   # features × tier × status
docs/legal/provenance.md        # sources used; what was never accessed
docs/adr/NNNN-*.md              # architecture decisions
docs/design/                    # ui-research.md, direction.md, screenshots/
ROADMAP.md  README.md  LICENSE  CONTRIBUTING.md  CODE_OF_CONDUCT.md  SECURITY.md
<the software itself>
```

## Reference files

Read each one when its phase arrives, not all of them up front.

| File | Read it when |
|---|---|
| `references/disambiguation.md` | Phase 1–2: the name is ambiguous, scope is vague, or you're preparing questions |
| `references/research-playbook.md` | Phase 3: where to look for each lens, source reliability, search patterns |
| `references/architecture-inference.md` | Phases 3 and 6: inferring how the target works, and the catalog of hard problems with open building blocks |
| `references/legal-and-licensing.md` | Phase 5, and whenever something feels gray |
| `references/product-types.md` | The target isn't a typical web app: mobile, desktop, CLI, infrastructure, AI, hardware, game, protocol, data |
| `references/ui-design.md` | Phases 6–7: UI research, the design direction, the slop list, the screenshot review loop |
| `references/build-and-release.md` | Phases 7–8: repository scaffold, quality bar, docs, packaging, launch, sustainability |
| `references/releasing-your-own.md` | The user owns the product and wants to open-source it |
| `assets/templates/` | Skeletons for the charter, dossier, parity matrix, one-page brief, provenance log, decision record, design direction and README |
| `scripts/codename.py` | Phase 5: generates the project's random codename |

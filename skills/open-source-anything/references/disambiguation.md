# Identifying the target and questioning the user

This covers Phases 1 and 2: working out exactly what the user means, and getting the few answers that shape the whole project.

## Contents
1. Collision patterns
2. The identification protocol
3. Worked examples
4. Question bank for the charter
5. When to stop, and when to ask again
6. Anti-patterns

---

## 1. Collision patterns

Most ambiguity falls into a small number of patterns. Recognizing the pattern tells you what to ask.

| Pattern | Example | What to pin down |
|---|---|---|
| Common-word name | Linear, Arc, Spark, Loom, Mercury, Signal, Warp, Frame, Delta | Which maker and which category. Show the candidates. |
| Same name in different categories | "Bolt" is a CMS, an AI app builder, a checkout company and a ride-hailing app | Which one. The projects that follow have nothing in common. |
| Company instead of product | "Atlassian", "Adobe", "Google" | Which product. A company is dozens of products. |
| Product family or suite | A design tool's whiteboard, slides and dev-handoff siblings; an office suite | Which member, or which shared core. |
| Edition or tier | Free vs. enterprise, consumer vs. business | Which feature set counts as "the product". |
| Platform or surface | Web app vs. mobile app vs. public API vs. the recommendation engine behind them | Which surface; they are different builds. |
| Renamed or absorbed | Twitter→X; Cron→Notion Calendar; G Suite→Google Workspace | Use the current identity, but search the old name for history. |
| Discontinued | Google Reader (2013), Intuit Mint (2024) | Research through archives. Former users are often the audience. |
| Regional | Same brand, different product per country, or local "super-apps" | Country, language, and local regulation. |
| Description mismatch | "Like Notion but for spreadsheets" (likely Airtable-like) | Confirm the job described, not the name used. |
| Already open | Signal (apps and server under AGPL-3.0), Bolt CMS (MIT) | Still a build. Ask what their version should do differently. The target's license decides whether its code can be reused (see SKILL.md, Phase 1). |
| A feature, not a product | "Figma's auto-layout", "TikTok's For You algorithm" | Scope a library or component, not a whole app. |
| Internal, private or enterprise-only | A bank's internal tooling, a niche vertical system | Public information will be thin. Lean on the user's knowledge and on category analogs, and say so. |

The same product can match several patterns at once. A renamed product can also belong to a family, for example.

## 2. The identification protocol

**Search first.** Useful queries:
- `"<name>"`, `"<name> app"`, `"<name> software"`, `"<name> company"`, `"<name> open source"`
- `"<name> alternatives"`: alternative directories show which category the market files it under.
- `"<name>" site:github.com`: whether it, or a namesake, is already open.
- `"<name>" acquired OR discontinued OR renamed`
- `"<name>" + the user's own descriptive words`

**Write a fingerprint for each candidate** (one line):

> **Name** · maker · URL · category · what it does in one line · status (active / discontinued / acquired / already open source, with license)

**Choose how to respond.** Judge by what the *user* said, not by which namesake is most prominent in tech media. A developer-heavy search index will rank developer products first, and that isn't evidence of what this user meant.

- **One clear match that fits the user's words.** State the fingerprint and continue: "I'm taking this to mean Calendly (calendly.com), the scheduling-link tool. Tell me if you meant something else." Asking for confirmation you don't need wastes the user's patience.
- **One dominant match plus unlikely namesakes.** State your pick and name the others in one line: "I'm assuming the Arc *browser*, not ArcGIS or Intel's Arc GPUs." The user can correct you in two words, and you haven't made them read a menu.
- **Several plausible matches.** List them with fingerprints. For each, add one line on what an open version would involve and any routing fact, such as it already being open, its value being mostly network, or it being regulated. Ask the user to choose, and give your best guess.
- **No match.** Ask for a URL, screenshots or a description of what it does. Possible causes include a misspelling, a very new product, a regional or internal tool, or a discontinued one.

**Then pin the sub-scope** within the chosen product: family member, edition, platform or feature area. Ask only if the answer changes what gets built.

## 3. Worked examples

### "Make me an open-source Bolt"

Searching shows four real products named Bolt. A good reply:

> Quick check before I dig in. "Bolt" is several different products, and each leads to a very different project:
>
> 1. **bolt.new** (StackBlitz): an AI app builder that generates and runs full-stack apps in the browser. The hard part to build openly is the in-browser execution runtime.
> 2. **Bolt** (bolt.com): one-click checkout for online stores. The software can be built, but much of the value lies in its shopper network and in payment and compliance operations.
> 3. **Bolt** (bolt.eu): ride-hailing and delivery. The apps can be built, but the value lies in drivers, riders and local operations. An open version is realistic as dispatch software for a co-op or a single city.
> 4. **Bolt CMS**: a PHP content management system whose code is already MIT-licensed, so your version could reuse it or start fresh.
>
> Which did you mean? My guess is #1. If so, what should your version do differently?

The reply is short, shows the research was done, puts the facts that change the project next to each option, and moves straight on to what the user will build.

### "yo build me an open source version of Arc, i'm sick of it"

Searching "Arc" turns up a browser, Esri's ArcGIS suite, Intel's Arc GPUs, a backup product and more. "Sick of it" plus consumer phrasing makes the browser the dominant reading, so state it and move on:

> I'm assuming you mean the **Arc browser** (The Browser Company, owned by Atlassian since 2025), not ArcGIS or Intel Arc. Correct me if not.

The research is already shaping the next questions:
- **Status.** Arc is in maintenance mode, getting security updates but no new features, and its maker has shifted to a different browser. "Sick of it" might mean "worried it's dying", "it's slow", or "I dislike the direction". Each leads somewhere different, so ask.
- **Built on an open base.** Arc is a proprietary interface on top of Chromium. An open version is also an interface on top of an open engine (Chromium or Firefox's Gecko), never a new browser engine.
- **Competitive field.** Other browsers, some of them open, have adopted Arc-style interfaces. Research what they do and where users find them lacking, so the new project has a sharper better-thesis. They inform the build; they aren't offered as substitutes.

### "I want an open-source version of Signal"

Signal's apps and server are already published under AGPL-3.0, so "open source" alone can't be the point. Ask what their version should do differently, because that difference *is* the project:
- **"I want to run my own server."** Signal's official apps talk only to Signal's servers, and it doesn't federate. The build becomes a self-hostable private messenger, perhaps implementing an open federation protocol so users aren't isolated.
- **"I don't want to depend on one organization."** The build becomes a federated or peer-to-peer design. That's a protocol-level project, so scope it honestly.
- **"I want Signal-grade privacy for a specific group, such as a clinic or a union."** The build becomes a focused messenger for that group, with the onboarding and admin controls it needs, built on vetted cryptography libraries.

Licensing shapes the route. Signal's code is AGPL-3.0, so the user can build on it under those terms, keeping the result AGPL. If they want a different license, build independently without reading that code.

### "Open-source Google"

This is a company with dozens of products. Ask which one, and suggest likely readings: "Search? Photos? Docs? Gmail?" Then continue with the chosen product. If the answer is Search, explain that the value lies in the crawl, the index and ranking at scale. Scope a realistic wedge, such as a focused search engine for one domain or a metasearch layer, and be clear that a full independent web index is a research-scale undertaking.

### "Figma's auto-layout, but open source"

This asks for a feature, not the whole product. Scope it as a layout engine or library with a clear API and a demo canvas. The research concentrates on how that feature behaves: constraints, edge cases and the concepts users rely on. Only the surrounding context of the full product needs covering.

## 4. Question bank for the charter

Choose the questions whose answers you can't infer and that would change the plan. Give each one a recommended answer and a short reason.

**Motive (always settle this, because it decides the path)**
- "What's the main reason for an open version: cost, privacy and data ownership, a missing feature, learning, a business, or giving something to a community?"
  Why it matters: "Cost" puts operating simplicity first. "Learning" means a simpler stack and explaining as you go. "Business" means a license strategy and much deeper market research.

**Audience**
- "Who will use it: just you, your team (roughly how many), the public, or paying customers?"
  Why it matters: this sets requirements for auth, multi-tenancy, scale, docs and support.

**What "better" means**
- "What frustrates you most about [incumbent]?" Then take the answer and ask: "If the open version fixed only that, would you switch?"
- If the user says "same thing, but open", suggest theses based on the research, such as pricing pain from reviews, a lock-in complaint or a missing self-host option, and let them pick one.

**Must-haves and non-goals**
- "Which three to five things must it do on day one for you to actually use it?"
- "What can we deliberately leave out?" Suggest candidates such as enterprise SSO, compliance reports, a marketplace, or mobile apps at first.

**Constraints**
- "How hands-on do you want to be: writing and maintaining code, running a server someone else's code runs on, or just using it?" Why it matters: for a non-developer, design the build for the simplest possible operation (a one-click install, a desktop app, or a managed-host template), and explain everything in plain language.
- "Which languages or stacks are you comfortable maintaining?" Default to a mainstream stack for the category if they don't mind.
- "Where will it run: your laptop, a small VPS, a homelab, Kubernetes, a desktop app, or a phone?"
- "Roughly how much data or how many users?"
- "Any time or budget constraints I should plan around?"

**Assets**
- "Do you have an account, data exports, screenshots or notes from using it?" A data export is especially valuable, because it shows the real data model and lets you build and test the importer.

**Openness**
- "Any license preference, or do you want a recommendation? And do you intend to make money from it, now or later?" (See the license guide.)
- "Public from day one, or private until it works?"
- "Any name ideas?" Reassure them that you'll check it doesn't collide with the incumbent's trademark.

**Mode**
- "Do you want a researched plan, a working prototype, a public-ready project, or a project plus a business plan?"

**Red-flag questions.** Ask these when the context hints at them, and handle the answers carefully.
- "Did you work at [target], or do you have access to its internal material?" If yes, their employment agreements, confidentiality duties and knowledge of trade secrets matter a great deal. Keep their inside knowledge out of the project, and recommend legal advice before a commercial launch.
- "Is the plan to be compatible with [target]'s files or API, or only to do the same job?" Compatibility is valuable and generally lawful, but it has its own considerations (see the legal reference).

## 5. When to stop, and when to ask again

Stop when you can fill in every section of the charter. You can fill a section either with the user's answer or with a stated assumption the user saw and didn't reject.

Ask again later when:
- research reveals a fork in the road, such as several editions or a legal risk;
- the parity matrix forces a choice between two plausible cores;
- something the user said conflicts with what the research found ("it must be free to run" vs. a design that needs GPU inference).

When you reopen a question, give the new finding in one or two sentences, your recommendation, and the options.

## 6. Anti-patterns

- **Asking a wall of questions.** Fifteen questions at once gets skimmed and half-answered. Ask the few that matter now.
- **Asking what you could look up.** Don't ask "what does it do?" about a public product. Research it and confirm.
- **Offering options you haven't explained.** Each option needs the consequence that makes it different.
- **Accepting "like X, but better" without asking better how.** An unspecified "better" produces a worse clone.
- **Asking the same thing twice.** Once the charter records an answer, it stands until the user changes it.
- **Questioning a user who has made a clear choice.** If they know exactly what they want and say "go", record the assumptions and go.

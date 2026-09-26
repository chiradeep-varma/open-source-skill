## Phase 1 — Target identified

**Bolt** = **bolt.new** by StackBlitz — an AI-powered, entirely-in-browser full-stack app builder. You describe an app in chat, it generates the code, installs npm packages, and runs the dev server live — all client-side via **WebContainers**, StackBlitz's WASM-based Node.js runtime that boots a full Node environment inside the browser tab (no server-side VM per user). Active, commercial (free tier + Pro subscriptions), launched Oct 2024, uses Claude under the hood.

Other products named "Bolt" exist (Bolt.eu ride-hailing, Bolt.com fraud/checkout fintech, Bolt CMS) — none match "AI app builder in the browser," so I'm proceeding with bolt.new. Say so now if you meant one of those instead.

One important technical fact up front: **WebContainers itself is proprietary** (StackBlitz's IP, not open source) — so an open version can't reuse it and needs a different sandbox/runtime strategy. More on that below.

## Phase 2 — A few questions before I build (recommended defaults given — just confirm or correct)

1. **Mode** — how far to take this in one go?
   Recommend: **Prototype** — get the core loop (prompt → generated app → live preview → chat-edit) running locally today. We can grow it into a full public "Project" (docs/CI/tests) afterward. *Confirm or say "go straight to Project."*

2. **Sandbox strategy** (replaces WebContainers) — this is the biggest architectural fork:
   - **A. Server-side Docker sandboxes** — your server spins up an isolated container per session, runs the generated app inside it, reverse-proxies the port to the browser for live preview. Fully open, self-hostable with one `docker compose up`, but needs a server (not pure-client like bolt.new).
   - **B. E2B (open-source, Apache-2.0) sandbox SDK** — same idea, packaged for you, faster to build on, adds a dependency.
   - **C. Browser WASM runtime alternative** (e.g., a from-scratch WebContainers-alike) — matches bolt.new's zero-server magic exactly but is a multi-month research project, not realistic for a wedge.
   Recommend: **A (self-hosted Docker sandboxes)** — keeps the whole thing self-hostable and dependency-light, in the spirit of "one command, no cloud account required." *Confirm or pick B/C.*

3. **LLM backend** — recommend **pluggable**, defaulting to the Anthropic API (bring-your-own-key), with OpenAI-compatible and local Ollama support so people aren't locked to one vendor. *Confirm?*

4. **Core workflows for the wedge** (v1) — recommend:
   - Chat prompt → scaffolds a new full-stack project
   - Live preview of the running app (via sandbox + proxy)
   - Follow-up chat messages → iterative code edits applied as diffs
   - File tree + in-browser code editor
   - Export/download as zip or push to a fresh git repo
   *Anything to add or cut?*

5. **Stack** — recommend **TypeScript everywhere**: Next.js (or Vite+Express) frontend/backend, Postgres for session/project metadata, Docker for sandboxes. Matches what most JS/TS devs (and most bolt.new users) already know. *OK, or you have a preferred stack?*

6. **Where will this run** — your laptop only, a home server, or a VPS for a small team? (Affects how much I optimize for resource use.)

7. **Name & license** — "Bolt" itself isn't available to reuse as a name. I'll propose a shortlist once scope is locked (e.g. something evoking speed/building — "Anvil," "Sparkframe," "Ember"). For license, recommend **AGPL-3.0** (stops a cloud provider from taking the code and reselling it as a closed hosted service without contributing back) unless you want max-adoption **MIT** instead. *Preference?*

If you want, just reply "go with your recommendations" and I'll lock the charter and start building the prototype (Docker-sandbox based, TypeScript, pluggable LLM) right away.

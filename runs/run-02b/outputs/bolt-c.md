I've got enough to stop and course-correct before building anything. Here's what I found:

## Identity
Confirmed target: **bolt.new** by StackBlitz — the browser-based AI app builder that generates/runs full-stack apps client-side via WebContainers. (Other unrelated products share the name "Bolt" — the Estonian ride-hailing company, a payments/fraud company — not relevant here since you specified StackBlitz's bolt.new.)

## Important finding: this already exists, twice

1. **[stackblitz/bolt.new](https://github.com/stackblitz/bolt.new)** — StackBlitz open-sourced the actual bolt.new codebase (MIT license) shortly after its October 2024 launch.
2. **[bolt.diy](https://github.com/stackblitz-labs/bolt.diy)** (formerly oTToDev) — a community fork of that codebase, now maintained under the `stackblitz-labs` org itself, **19,000+ GitHub stars**, MIT licensed, actively developed. It adds multi-LLM support (OpenAI, Anthropic, Ollama, Gemini, Mistral, Groq, DeepSeek, local models via LM Studio, etc.), Docker/self-host docs, and is described by StackBlitz as "the official open source version of Bolt."

Per how I approach these requests: when a mature, actively-maintained open-source alternative already exists, rebuilding from scratch is usually wasted effort — the better move is to deploy it, fork it, or contribute the specific thing that's missing.

Sources: [bolt.diy on AlternativeTo](https://alternativeto.net/software/bolt-diy/about/), [stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy), [stackblitz/bolt.new](https://github.com/stackblitz/bolt.new)

**So, a few questions before I go further:**

1. **Given bolt.diy already exists**, what's actually motivating this? A few different answers lead to very different next steps:
   - You didn't know it existed → I can just help you **self-host bolt.diy** (Docker Compose, ~5 min) instead of building anything.
   - You want to **customize/extend** it (different UI, different default models, your own branding, specific integration) → I fork/modify bolt.diy directly.
   - You want to build your own **from scratch anyway** (learning, or you want a fundamentally different architecture/stack) → I go through the full research → design → build workflow and write everything fresh (no copying from bolt.diy's or bolt.new's code).
   - Something bolt.diy specifically lacks that you need → tell me what, and I evaluate closing that gap upstream vs. building new.

2. If it's a genuine rebuild: what's the primary motive — cost savings, learning, a business/venture, or a specific missing capability? And what mode — a **Prototype** (core loop running locally this session) or a full **Project** (docs, tests, CI, packaging)?

What's the actual goal here?

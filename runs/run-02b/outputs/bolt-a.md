## Identity check

"Bolt" collides with several unrelated products (Bolt the ride-hailing app, Bolt.com checkout/fintech, Bolt CMS). Given your phrasing, I'm proceeding with **Bolt.new by StackBlitz** — the AI-powered in-browser app builder — as you specified in the task. Flag me if you meant a different one.

## Important finding before I build anything

This is one of the rare cases where **the open-source version already exists, officially**:

- **[stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy)** — MIT-licensed, actively maintained, community-run fork that StackBlitz itself seeded from Bolt.new's original open-sourced core. It does everything Bolt.new does — prompt, run, edit, deploy full-stack apps in-browser — but lets you plug in **any LLM** (OpenAI, Anthropic, Gemini, Ollama, DeepSeek, local models, 15+ providers) instead of being locked to one. Self-hosts via Docker or `pnpm` in one command.

So "build an open-source Bolt" is, strictly, already solved — deploying or forking `bolt.diy` gets you 90% of the way in an afternoon, not a multi-week build.

**The one real gap**: both Bolt.new *and* bolt.diy run their live preview/execution via StackBlitz's **WebContainers** — an in-browser Node.js runtime. The WebContainer *core* is MIT, but StackBlitz's hosted WebContainer API requires a paid commercial license once you use it in production for money (free for personal/prototype use). So a bolt.diy self-host isn't fully independent of StackBlitz commercially — that's the genuine wedge if you want something with zero vendor dependency.

## Your real options

| Option | Effort | Result |
|---|---|---|
| **A. Deploy bolt.diy as-is** | ~30 min | Full-featured, multi-LLM, self-hosted Bolt clone today. Still leans on StackBlitz's WebContainers for execution. |
| **B. Fork bolt.diy, swap the runtime** | Days–weeks | Same UX, but replace WebContainers with a fully open execution backend (e.g. server-side Docker/Firecracker sandboxes, or something like E2B/Daytona) — removes the last proprietary dependency. |
| **C. Build fresh from scratch** | Weeks | Only worth it for learning, or if you want a materially different architecture/UX. Reinvents a lot bolt.diy already got right. |

My recommendation: **A now, B if/when it bites you** — don't rebuild a mature 60k★+ project's UI/agent loop from zero without a specific reason.

To pin down which path fits, quick questions (answer what matters, skip the rest):

1. **Why do you want this** — cost savings, avoiding StackBlitz's WebContainer dependency, learning, or a product of your own? (Recommendation depends heavily on this.)
2. **Where will it run** — your laptop, a VPS/homelab, or does "production for customers" matter (which is when the WebContainers commercial-license issue actually bites)?
3. **Mode** — do you want it running today (deploy bolt.diy), or a proper from-scratch/forked project with docs, tests, roadmap?

Tell me your motive and I'll either walk you through deploying bolt.diy right now, or scope out option B/C properly.

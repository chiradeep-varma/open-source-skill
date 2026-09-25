**Identity:** I'm building an open-source version of **bolt.new** — StackBlitz's AI-powered, in-browser full-stack app builder (prompt → generates a real Node.js app running in a WebContainer sandbox, editable and deployable, no local setup). This is a different product from Bolt the Estonian ride-hailing app or Bolt Financial's checkout/payments platform — both also active under the "Bolt" name. Flag me if you meant one of those instead.

**Before building — a mature open-source alternative already exists.** This changes the plan:

**bolt.diy** ([stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy)) is the community-built, now StackBlitz-adopted open-source version of bolt.new:
- 17k+ stars, active, maintained inside StackBlitz's own GitHub org
- Same core loop: prompt → generate/edit/run a full-stack app in-browser
- Multi-LLM: Anthropic, OpenAI, Gemini, Ollama, OpenRouter, Mistral, Groq, etc. (bolt.new locks you to their model choices)
- Code is MIT licensed

**But there's a real gap**: bolt.diy still runs on StackBlitz's **WebContainers** — the in-browser Node.js sandbox tech. WebContainers itself is *not* open source; StackBlitz's terms require a **paid commercial license** to run it in production/commercial settings (free for prototypes/POCs only). So bolt.diy is open-source code sitting on a proprietary, non-free runtime — you can't fully self-host it commercially without StackBlitz's blessing and a bill.

That's a legitimate wedge for a fresh build: a genuinely FOSS, self-hostable app-builder with **no proprietary runtime dependency**, using an open sandboxing approach instead (e.g., Docker containers, Firecracker microVMs, or a project like E2B's open runtime) for code execution.

So — three real paths, not one default:

1. **Just self-host bolt.diy.** Fastest, zero build time, but you inherit the WebContainers licensing catch for commercial use.
2. **Fork bolt.diy and rip out WebContainers**, replacing it with an open server-side sandbox (Docker/Firecracker). Keeps their UI/agent logic pattern, removes the one proprietary dependency. Moderate effort.
3. **Build fresh from scratch** with our own architecture, license, and name — full control, more work, appropriate if you want this as a real project/product rather than a personal tool.

A few quick questions to pick the right path:

1. **Why do you want this?** (save money / own your data / learn / ship it as a product) — my default guess is "own your data + no per-seat pricing," which points toward option 2 or 3.
2. **Where will it run?** Your laptop, a personal VPS, or a real multi-user service?
3. **Mode**: quick working prototype tonight, or a proper public-ready project (docs, tests, CI, license, README)?

If you just want me to make the call and go, say so — I'd default to **option 2** (fork bolt.diy, swap WebContainers for Docker-based sandboxing) as the best time/value tradeoff, in **Prototype** mode. Let me know which way to go.

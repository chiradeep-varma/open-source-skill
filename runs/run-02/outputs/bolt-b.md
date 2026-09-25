Good news — before building anything, I checked whether this already exists, and it does.

**Which "Bolt"?** I'm assuming you mean [Bolt.new](https://bolt.new) — StackBlitz's AI app builder that generates and runs full-stack apps in-browser (prompt → live app, no local setup). That's the natural fit for a coding session and matches "open source bolt" almost exactly. (If you actually meant Bolt the ride-hailing app or Bolt the checkout/fintech company, let me know and I'll redirect.)

**Here's the thing: it's already open source, twice over.**

1. **[github.com/stackblitz/bolt.new](https://github.com/stackblitz/bolt.new)** — the actual Bolt.new source, released by StackBlitz themselves under the **MIT license**. It's not a clone target, it's the real thing, open.
2. **[github.com/stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy)** (formerly oTToDev / "bolt.new-any-llm") — a mature community fork, done *in partnership with StackBlitz*, that adds the thing people most want from an open version: bring-your-own-LLM support (OpenAI, Anthropic, Ollama, local models, OpenRouter, Gemini, etc.) instead of being locked to StackBlitz's hosted model. Actively maintained, large community, Docker-installable.

So per how I approach these requests: when a solid open-source alternative already exists, building a from-scratch clone from scratch is usually wasted effort — the better move is to self-host or fork what's there.

Given that, tell me which direction you actually want:

1. **Just self-host bolt.diy** — I set up Docker/local install, configure your LLM provider keys, get it running. Fastest path, ~10 minutes.
2. **Fork bolt.diy and customize it** — e.g. change branding, add/remove a feature, adjust the model routing. Tell me what's missing for you specifically.
3. **Contribute a feature upstream** to bolt.diy instead of forking.
4. **Build your own from scratch anyway** — e.g. for learning, a very different architecture, or because you want something with no ties to StackBlitz's codebase at all. This is a bigger effort (WebContainers-style in-browser execution is the hard part) and I'd run the full research/design process.

Which one?

Good news — I found this before building anything. Here's what I turned up:

**Identity confirmed:** Bolt = **bolt.new** by StackBlitz, an AI-powered in-browser full-stack app builder (describe an app in natural language → it generates and runs a live React/Node app right in your browser via WebContainers, a WASM-based Node.js runtime).

**The open-source landscape already covers this:**

| Project | License | Status |
|---|---|---|
| [stackblitz/bolt.new](https://github.com/stackblitz/bolt.new) | MIT | StackBlitz's own original open-sourced snapshot of Bolt |
| [stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy) | MIT | **19.1k stars**, actively maintained community fork. Self-hostable (Docker), works with 15+ LLM providers (Anthropic, OpenAI, Ollama, DeepSeek, Groq, local models, etc.) |

`bolt.diy` **is** the open-source Bolt — same core loop (prompt → generate → live-run full-stack app in-browser), already free, already self-hostable, already BYOK for any LLM.

**One real catch:** the tech that lets it run a full Node.js app inside your browser tab — WebContainers — is StackBlitz's proprietary WASM runtime. It's free for non-commercial/personal use, but StackBlitz requires a paid license if you run it commercially/for-profit. That's the one piece nobody can truly "open source" without swapping the execution engine for something else (e.g. server-side Docker/Firecracker sandboxes, or a project like CodeSandbox's approach) — which is a real architectural fork, not a small tweak.

So, per how this skill works, I'd rather not rebuild something that already exists well. Which of these fits what you actually want?

1. **Just self-host bolt.diy** — I set it up for you locally/on a server, configure your LLM provider(s), you're using an open Bolt in minutes.
2. **Contribute to bolt.diy** — you have a specific feature/fix in mind; I help you build it against their codebase.
3. **Build something new** — because of a specific gap bolt.diy doesn't solve for you (e.g., you want server-side sandboxing instead of WebContainers to avoid the commercial licensing issue, a different UX, a narrower/simpler tool, mobile support, etc.)

What's the actual motive here — cost, a missing feature, learning, or building a product of your own?

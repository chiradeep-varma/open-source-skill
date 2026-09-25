Good news — before building anything, this one already has a mature open-source version, so building from scratch would mostly duplicate existing work. Here's what I found:

## Bolt.new is already open source

**bolt.new** (StackBlitz's AI-powered, in-browser full-stack app builder) has an official community-maintained open-source fork:

**[bolt.diy](https://github.com/stackblitz-labs/bolt.diy)** (`stackblitz-labs/bolt.diy`)
- **License:** MIT
- **Maturity:** ~19.1k GitHub stars, active development, originally started by Cole Medin, now maintained under StackBlitz's own `stackblitz-labs` org
- **What it does:** Prompt, run, edit, and deploy full-stack web apps — the same core loop as bolt.new
- **Where it's better than bolt.new for self-hosters:** supports *any* LLM provider (OpenAI, Anthropic, Ollama, OpenRouter, Gemini, LMStudio, Mistral, xAI, HuggingFace, DeepSeek, Groq, or anything on the Vercel AI SDK) instead of being locked to StackBlitz's model choices
- **Docs:** [stackblitz-labs.github.io/bolt.diy](https://stackblitz-labs.github.io/bolt.diy/)

**One real technical catch:** the "runs entirely in your browser" magic in bolt.new comes from StackBlitz's **WebContainers** runtime. The WebContainers *API* that bolt.diy depends on requires a commercial license for production/for-profit use (prototypes/POCs are free). bolt.diy's own issue tracker has open discussion about swapping in an alternative in-browser or server-side execution backend for fully-free self-hosting ([issue #2008](https://github.com/stackblitz-labs/bolt.diy/issues/2008)) — this is the one piece that isn't fully solved yet.

## So, what do you actually want?

1. **Just self-host bolt.diy** — fastest path, get a working AI app builder today with a free choice of LLMs. I can set this up for you (Docker Compose, .env with your API keys, walk through the app).
2. **Fork bolt.diy and build the specific gap you care about** — e.g., a free/open WebContainers alternative, a different UI, a different deploy target. Tell me what's missing for you.
3. **Build something genuinely new from scratch anyway** — e.g., if you want a fundamentally different architecture (no WebContainers dependency at all, using Docker-based sandboxes or Firecracker microVMs server-side instead of in-browser), a different LLM-orchestration approach, or you just want to learn by building it yourself.

Which of these fits what you're after?

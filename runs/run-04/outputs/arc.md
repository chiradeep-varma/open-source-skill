**Identity check.** I'm assuming you mean **Arc**, the desktop browser from The Browser Company (arc.net) — not Paul Graham's Arc programming language, ArcGIS, or Arc.dev. Given "sick of it," that's almost certainly the one.

Worth knowing before we plan: Arc has been in **maintenance mode since May 2025** — security patches only, no new features. The Browser Company was acquired by Atlassian in Oct 2025 and the team moved to a new AI-native browser called Dia. So Arc itself is effectively in slow decline, which is a real reason to want an open alternative (no abandonment risk, no acquisition risk).

A few questions before I start building — answer as many or as few as you want, I'll pick sensible defaults for the rest:

1. **What specifically bugs you about Arc?** (e.g. Spaces/sidebar UX you love but want to keep, performance/memory hogging, the "it's dying" abandonment fear, no Linux support, wanting AI features gone, sync/privacy concerns) — this becomes the better-thesis. My default guess: you want Arc's *workflow* (sidebar tabs, Spaces, Split View) without depending on a company that might kill it.
2. **Platform**: macOS only (like Arc), or also Windows/Linux? Arc dropped Linux entirely — that's an easy differentiator.
3. **Scope/mode**: 
   - *Prototype* — a browser-extension or Electron shell replicating Arc's sidebar/Spaces UX on Chromium in one session, or
   - *Project* — a proper standalone browser (Chromium-embedded, like Brave/Vivaldi/Zen Browser do) with installers, docs, CI — bigger effort, multi-session.
4. **Technical comfort**: are you going to hack on this yourself, or do you want something you just run?

Building an actual browser engine from scratch isn't realistic (that's a multi-hundred-engineer problem) — the real path is a Chromium-based shell (like Brave, Vivaldi, and the existing open-source **Zen Browser** already do) that reimplements Arc's UX fresh. That's not a reason not to build — it's *how* we build.

What's your answer on 1–4, or should I just make the calls and go?

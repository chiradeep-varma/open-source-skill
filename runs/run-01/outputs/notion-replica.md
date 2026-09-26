I've identified the target: **Notion** (Notion Labs, Inc. — notion.so), an all-in-one workspace/docs/wiki/database tool. No ambiguity there.

Before I plan anything, three parts of your ask cross from "build an alternative" into legal risk, so I want to flag them now rather than after building:

| Ask | Risk | Safe alternative |
|---|---|---|
| Name it **"Notion Open"** | Uses Notion's trademark in your product name — this is the kind of thing that gets a cease-and-desist even for OSS projects | A distinct name that describes the relationship factually, e.g. "an open-source alternative to Notion" in the README/tagline, not in the name itself |
| **Same icons** | Notion's icon set (and its emoji/illustration library) is proprietary artwork — copying it is asset infringement, not idea reuse | Use an open icon library (Lucide, Phosphor, Tabler) styled to match the same minimalist line-icon *feel* |
| **Copy the template gallery** | Templates are authored content (text, structure, phrasing) owned by Notion or its community creators — copying them directly is copyright infringement | Build an original template gallery covering the *same categories* (roadmaps, wikis, trackers, OKRs, CRM-lite) so users feel at home by convention, not by copied content |
| "Same UI" generally | General layout conventions (sidebar + block editor + slash commands) are fair game to reimplement; a pixel-identical visual clone (exact spacing, colors, wordmark-adjacent styling) risks trade dress claims | Match the *interaction patterns* users expect (blocks, `/` commands, nested pages, drag-to-reorder) with your own visual identity |

I'll build toward the "closest safe version" column — familiar enough that Notion users feel at home within seconds, original enough to publish without risk.

Two quick questions to set the charter, my recommendation in brackets:

1. **Mode** — Brief (plan only), Prototype (core loop running locally, ~1 session), Project (full public-ready repo w/ docs, tests, CI), or Venture (Project + business model)? **[Project — this is a real product ask, not a toy]**
2. **Motive** — mainly data ownership/self-hosting, a specific missing feature, or wanting to build a real open alternative for others to use? **[Public good/alternative — shapes whether we prioritize a hosted-import path and community templates]**

Also — quick gut check before I go further: do you want me to first check whether an existing mature open-source Notion alternative (there are a few, like AFFiNE, Outline, AppFlowy) already covers what you need? Sometimes deploying/contributing beats a rebuild. Let me know your answers and I'll move into research.

# UI design: research the category, then design your own

How to give the open version an interface that is clearly its own and clearly well made: neither a lookalike of the incumbent nor generic AI "slop". Use it in Phase 6 (design) and Phase 7 (build and review).

## Contents
1. What you take and what you leave
2. UI research
3. The design direction
4. Slop: what it looks like and why it happens
5. Building the UI
6. The screenshot review loop
7. Products without a graphical UI

---

## 1. What you take and what you leave

You are rebuilding the **product**: the jobs it does and the interactions that make those jobs easy. You are not rebuilding the company's look.

| Take (patterns and conventions) | Leave (their identity) |
|---|---|
| Information architecture: which screens exist and what's on each | Logo, name, colors, typefaces, illustrations, icon set |
| Interaction patterns: drag to reorder, inline editing, a command palette, keyboard shortcuts | Distinctive visual signatures and their overall look (trade dress) |
| Flow order: the steps of the core loop and where decisions happen | Marketing copy, microcopy, empty-state text, onboarding scripts |
| Density expectations: how much fits on a screen for this kind of tool | Screenshots or assets in your repository |
| What users praise or complain about in reviews ("too many clicks to…") | Pixel measurements taken off their product |

Familiar *patterns* help people switch. A familiar *look* is both a legal risk and a missed chance to be better.

## 2. UI research

Before designing, spend a short, focused pass on how products in this category look and behave.

**Where to look**
- The incumbent's own public material: marketing pages, help-center and docs screenshots, product tours, changelog images, app-store screenshots, and official demo videos. Tutorials by users show real workflows in motion.
- Two or three other products in the category, proprietary or open, to separate *category conventions* (everyone does it, so users expect it) from *one company's style* (don't copy it).
- UI pattern libraries (for example, Mobbin) and the public design systems of well-crafted products in any category, as references for craft rather than for this category's look.
- Reviews and forums for UI complaints. They are a direct source of your better-thesis for the interface.

**What to record** in `docs/design/ui-research.md`, with a source for each observation:
- the screens the core loop needs, and what each one must show;
- conventions users will expect (for example, "a short link's stats page leads with a clicks-over-time chart");
- interaction patterns worth adopting, and the ones reviewers hate;
- the density and tone appropriate to the audience: an operator's tool, a consumer app, a developer tool;
- what makes the best products in the category *feel* well made: speed, restraint, clarity of hierarchy, and polish on states.

Write observations in words. Don't save their screenshots into the repository.

## 3. The design direction

Commit to a direction **before writing UI code**, and write it down in `docs/design/direction.md` using `assets/templates/design-direction.md`. Designing screen by screen without a direction is how UIs end up generic.

The direction covers:
- **Personality.** Three words that fit the product's users and job (for example, "calm, precise, fast" for an operator tool, or "warm, plain, encouraging" for a volunteer sign-up form). Every later choice should serve these words.
- **Grounding.** Something about *this* product that the design can draw on: its subject, its users' world, its core object. A link shortener is about links and traffic; a scheduler is about time. Ground the look in that, not in a generic SaaS template.
- **Typography.** One or two open-licensed families, chosen for the personality and the density, with a type scale (sizes, weights and line heights) set deliberately. A system font stack is a valid choice for a dense tool when you choose it on purpose; picking a font because it's the default is not.
- **Color.** A neutral scale, one accent used sparingly, and semantic colors (success, warning, danger, info). Define them as tokens. Check text contrast against WCAG AA (4.5:1 for body text). Decide on dark mode deliberately.
- **Space and shape.** A spacing scale (for example, a 4px base), one or two radius values, and a rule for when to use borders and when to use elevation. Consistency here does more than any decoration.
- **Iconography.** One open-licensed icon set with a consistent stroke and size, and icons used only where they carry meaning.
- **Motion.** Minimal and purposeful: feedback on actions and transitions that explain a change in state. Nothing merely decorative.
- **Copy voice.** Plain language, sentence case, active voice, each piece of text doing one job. Interface copy is part of the design.
- **Differentiation check.** One paragraph on how this direction differs from both the incumbent's look and the generic defaults in §4.

Then express the direction as **design tokens** in code (CSS custom properties, a theme file or a Tailwind config) before building any screens, so every component draws from one source of truth.

## 4. Slop: what it looks like and why it happens

"Slop" is what a UI looks like when every choice was a default rather than a decision. It reads as generic and untrustworthy, and it makes an open alternative look like a weekend clone even when the engineering is solid. Common tells:

- **An untouched component-library or framework-starter look**: stock grays, a default indigo or purple accent, default radius and shadow everywhere.
- **Gradient washes**: purple-to-blue backgrounds, gradient headline text, glassmorphism with no reason for it.
- **The SaaS card kit**: every piece of content in an identical rounded container, arranged in a uniform grid regardless of what the content is. Swapping the shadow for a border doesn't fix it; the uniform container is the tell. Vary the structure by content: a table can sit directly on the page, a primary form can be a band, and related stats can share one row.
- **Template chrome**: ALL-CAPS eyebrow labels, middle-dot metadata strings and arrows on every link, used as decoration rather than to convey information.
- **Emoji and decorative icons** in headings, buttons and empty states.
- **Marketing patterns inside a tool**: a hero section, a stat-tile "dashboard" with vanity numbers, and "Welcome back! 👋" where the user's work should be.
- **Filler copy**: lorem ipsum, "Lorem Corp", "Your amazing dashboard", or vague labels ("Manage", "Explore") instead of what the button does.
- **Inconsistency**: several font sizes that almost match, random spacing, three radius values, and gray text too faint to read.
- **Missing states**: no designed empty, loading, error or long-content states; tables that break with real data.
- **Everything centered, everything the same size**, so there's no hierarchy telling the eye where to go.

Any one of these can be right for a specific product. They become slop when they're used because they were there, not because the product called for them. The frontend-design guidance published by Anthropic makes the same point: these patterns are "defaults rather than choices".

## 5. Building the UI

- **Tokens first**, then a small set of components (buttons, inputs, tables or lists, dialogs, toasts) that use only tokens. Screens are built from those components.
- **Real content.** Seed data should look like the real thing: realistic names, long titles, empty fields and edge cases. Design against that data, not against three perfect rows.
- **Charts and lists handle 0, 1 and many.** A chart with one data point shouldn't render as a solid block, and one with none should say so plainly.
- **Never transform user data.** Don't capitalize, upper-case or otherwise restyle URLs, names, codes or anything the user typed. Truncate from the middle, or show the meaningful part (such as the hostname), so the useful information survives.
- **Every state.** Empty (with one clear next action), loading, error (saying what happened and what to do), partial, long content, and permission-denied.
- **Hierarchy.** Each screen has one primary action and one thing the eye lands on first. Secondary actions are visibly secondary.
- **Density that matches the job.** Operator tools can be dense and fast. Public-facing pages, such as a booking page or a form, should be spacious and calm.
- **Responsive.** Check the core flows at phone width, especially anything the public sees.
- **Accessible by default.** Semantic HTML, labels on every input, visible focus states, keyboard support for the core loop, and AA contrast.
- **Keyboard and speed.** Where the category's best products are keyboard-driven, support the same *patterns* (for example, a command palette) with your own key choices where theirs aren't a convention.

## 6. The screenshot review loop

Don't judge the UI from code. Look at it.

The same agent that designed and built the screens is reviewing them, so the review has to be structured to overcome that bias. A free-form "looks good" isn't a review.

1. **Capture.** Use a browser automation tool to capture every core-loop screen at desktop (about 1280px) and phone (390px) widths, in dark mode if it exists, and with four data sets:
   - empty;
   - a single item;
   - many items, at realistic volume;
   - long: the longest value the validation allows in every text field, plus an unbroken string such as a URL. Real people paste these, and they're what breaks layouts. In testing, a public page looked fine with typical data and scrolled sideways on a phone once a bio held one long word.
2. **Run the mechanical check.** At phone width, with the long data set, check that no screen scrolls horizontally: `document.documentElement.scrollWidth <= window.innerWidth`. Treat any overflow as a bug. Text that users write usually needs `overflow-wrap: anywhere`.
3. **Critique before you approve.** For each screen, write down at least three concrete weaknesses before deciding what to fix, as a skeptical designer would. "None" isn't an acceptable answer on a first pass.
4. **Record the review** in `docs/design/review.md`, starting from `assets/templates/design-review.md`. For each screen, give explicit answers for:
   - each slop tell in §4: present or not, and if present, why it's a deliberate choice;
   - the overflow check result;
   - hierarchy: is the primary action obvious in one second?
   - consistency: are spacing, type and radius drawn only from tokens?
   - user data shown untransformed;
   - charts and lists correct with the empty, single, many and long data sets;
   - could a user mistake it for the incumbent's product?

   The template ends with a claims check: each README claim, and where the running app proves it.
5. **Fix, capture again, and update the review.** Record in the process log what changed and why.
6. **Save the final screenshots** under `docs/design/screenshots/` for the README and for the user to judge.

## 7. Products without a graphical UI

Interface craft still applies:
- **CLIs**: consistent verbs and flags, readable output with alignment, color used only for meaning, helpful errors with a next step, and `--help` that reads like documentation.
- **APIs**: consistent naming, predictable pagination and errors, and examples in the docs.
- **Hardware**: a physical interaction model (buttons, dial, display states) designed as deliberately as a screen, plus a companion app that follows this guide.

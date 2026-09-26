# Parity matrix — rustic-fjord vs. the group-poll job Doodle does

Tiers: **Core** (job fails without it) · **Switch-blocker** (people can't leave the incumbent without it) · **Differentiator** (the better-thesis) · **Later** · **Won't** (enterprise sprawl / out of scope).
Status: **Built** · **Partial** · **Not started**.

| Feature | Tier | Status | Notes |
|---|---|---|---|
| Create poll (title, description, location, time-slot options) | Core | Built | |
| Share link (no account needed to vote) | Core | Built | |
| Vote Yes / If-need-be / No per option | Core | Built | |
| Live results grid with per-option counts + best-option highlight | Core | Built | |
| Edit your own vote later via the same link | Core | Built | localStorage edit token, no login |
| Finalize a winning time | Core | Built | |
| Poll shows "scheduled" state to everyone once finalized | Core | Built | |
| CSV export of results | Differentiator | Built | Open, portable format; Doodle has no equivalent free export |
| No ads, no branding on the shared page, unlimited polls for everyone who self-hosts | Differentiator | Built | The whole point — nothing here is paywalled because there's no paywall |
| Timezone-correct display (each viewer sees their own local time) | Differentiator | Built | Options stored as UTC instants |
| Organizer account / login | Later | Not started | Not needed for the core loop; admin link (secret URL) stands in for now |
| Response deadline / auto-close voting | Later | Not started | |
| Email notifications on vote / finalize | Later | Not started | |
| Calendar invite generation (.ics) on finalize | Switch-blocker | Not started | Real gap vs. Doodle; next milestone |
| Google/Outlook calendar sync for availability | Switch-blocker | Won't (this build) | Requires OAuth + external services; against "no external services" constraint for the prototype; revisit post-prototype |
| 1:1 booking pages | Later | Not started | Explicit non-goal this round (charter) |
| AI scheduling assistant | Won't | — | Doodle's newest surface area; not the job this project targets |
| Payments / plan tiers / seat limits | Won't | — | Everything built is available to every self-hoster; no artificial gates |
| Admin console / SSO | Won't | — | Enterprise sprawl, out of scope for a self-hosted single-team tool |

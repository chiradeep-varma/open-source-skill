# UI research: status pages

> Patterns observed across the category (Statuspage and peers), described in words only. No screenshots, colors, typefaces, icons or copy were copied from any source — inspiration only, per the skill's provenance rules.

Sources: general status-page marketing/guide pages surveyed 2026-09-25 (UptimeRobot's guide, PagerDuty's best-practices guide, and others returned by search — see list below). No Statuspage account exists, so no actual Statuspage product screens were viewed.

## Observed patterns

- **One banner at the top, worst-status-wins.** Every example puts a single colored strip or headline at the very top of the page stating overall health in plain language ("All systems operational" / "Partial system outage"), before any component detail.
- **Components listed, not just a single dot.** Grouped by area of the product, each with its own small status indicator — this is repeatedly called out as what separates a good status page from a bare "up/down" badge.
- **Current incidents surface above history.** Anything unresolved is shown prominently near the top; resolved incidents move into a separate, chronological history section below.
- **Each incident is a mini-timeline.** Timestamped entries in order, from first detection through to resolution, each with a short note — not just a single "fixed" message.
- **History is scannable in chunks**, typically grouped by day or month rather than one long flat list, especially past 30–90 days.
- **Mobile is a first-class read surface** — status pages are checked from phones during an outage, so scannability at narrow widths matters more than density.
- **Subscription/notification affordance is present but secondary** — a small "subscribe" action, never the visual focus.

## What we take vs. leave

- **Take** (genre convention, not brand-specific): banner-then-components-then-history structure; per-component status; chronological in-incident update timeline; grouped history.
- **Leave**: any specific vendor's color values, logo, typography, illustration style, or marketing copy voice — none were viewed for Statuspage specifically, and the rest is deliberately original (see `direction.md`).

## Sources

| # | Title | URL | Accessed |
|---|---|---|---|
| U1 | How to Build a Status Page in 2026 (+Templates) | https://uptimerobot.com/knowledge-hub/monitoring/guide-to-building-a-status-page/ | 2026-09-25 |
| U2 | Status page guide: Best practices for communicating system status during incidents | https://www.pagerduty.com/resources/outages/learn/status-page-best-practices/ | 2026-09-25 |
| U3 | Status Page Examples: What Good Looks Like | https://inventivehq.com/blog/status-page-examples-best-practices | 2026-09-25 |
| U4 | 10 Real-World Status Page Examples | https://uptimerobot.com/blog/10-real-status-page-examples/ | 2026-09-25 |

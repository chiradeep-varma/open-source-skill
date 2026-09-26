# Target Dossier: Trello

Prototype-mode research floor: WebSearch used across all lenses below. Direct
WebFetch of primary pages (trello.com/pricing, github.com/wekan/wekan,
github.com/plankanban/planka) failed in this environment (proxy refused / 403 —
recorded in `docs/process-log.md`). All claims below are therefore tagged
`reported` (from search-result summaries of primary/secondary pages), not
`confirmed`. Verify against the live pricing page before relying on exact figures.

## 1. Identity & history
Trello — kanban board product, originally built by Fog Creek Software (Glitch),
spun out as Trello Inc., acquired by Atlassian in January 2017. `[reported]`

## 2. Concept & vision
Core insight: represent work as physical index cards on a board, organized into
columns (lists) representing workflow stages; drag a card to move it forward. This
"boards → lists → cards" model is Trello's entire mental model and is not
proprietary — it's the generic Kanban board concept, also used by Wekan, Planka,
Focalboard, Jira boards, etc. `[reported/inferred]`

## 3. Market & industry
Category: visual work/task management, sitting between plain to-do lists and
full project-management suites (Jira, Asana, monday.com, ClickUp). Existing
open-source alternatives already in this space: **Wekan** (Meteor/MongoDB, MIT
license, boards/lists/cards/swimlanes/WIP limits, translated into 100+ languages),
**Planka** (React/Sails.js/Postgres, Docker Compose; relicensed from
MIT→AGPL-3.0→a proprietary "Community License" with its 2.0 release — no longer
OSI-approved), **Focalboard**, **Kanboard** (PHP, MIT, deliberately minimal).
`[reported]` This is the competitive field Corkboard sits in — the wedge is
staying genuinely OSI-licensed (MIT) where Planka moved away from open source,
and being simpler to operate than Wekan's Meteor/Mongo stack.

## 4. Business model
Per-seat SaaS: Free (10 collaborators, 250 Butler automation runs/mo, capped
boards), Standard ~$5/user/mo, Premium ~$10/user/mo (adds Calendar/Timeline/
Table/Dashboard/Map views, unlimited automation), Enterprise ~$17.50/user/mo
(50-seat minimum, sliding scale down). `[reported]` For an 8-person team on
Standard that's ~$40/mo forever just to remove the board cap; Premium is ~$80/mo.

## 5. Users & jobs
Users hire Trello for lightweight, visual task tracking without the overhead of a
full PM suite. Review-mining (G2/Capterra/Selecthub summaries, `[reported]`) shows
recurring pain themes:
- **Cost**: "nearly 83% of users mention cost as a concern"; Power-Ups needed to
  reach feature parity with competitors add $20–40/user/mo on top.
- **Feature ceiling**: reporting, time tracking, dependencies, and advanced
  workflows are missing or paywalled/Power-Up-gated.
- **Recent restructuring backlash**: free-board caps and forced workspace
  restructuring made the free tier feel worse over time.
This directly supports the "save money / no seat metering" motive in the charter.

## 6. Product (feature inventory)
Board → Lists (columns) → Cards. Cards carry: description, due date (+ optional
start date, color-coded as it approaches/passes), labels (colored tags, filterable),
checklists (with per-item assignee/due-date on paid tiers), attachments (size-capped
by plan), comments, members. Automation via "Butler" (trigger → action rules).
Extension via "Power-Ups" (200+ integrations: Slack, Drive, Jira, Calendar).
`[reported]`

## 7. Technology
Not independently inferred beyond public knowledge (React frontend historically,
proprietary backend) — not load-bearing for this build since the app is being
built fresh, not ported. No proprietary code, assets, or text were read.

## 8. Where the value lives
For Trello: brand, Atlassian's distribution/integration ecosystem (Jira, Slack,
Atlassian Intelligence), and the Power-Ups marketplace network effect. None of
that is reachable by an open clone and isn't the goal — the goal is the boards/
lists/cards job itself, which is fully capturable in software with no dependency
on Trello's network or data.

## Legal surface
- Trademark: "Trello" is Atlassian's trademark — not used as the project name;
  README will carry a "not affiliated with Atlassian" disclaimer.
- No Trello code, assets, marketing copy, or UI text were read or copied — see
  `docs/legal/provenance.md`.
- No ToS was scraped/bypassed; only public search-result summaries were consulted.

# One-page brief: Corkboard

**What it is.** A self-hosted, open-source kanban board — boards, lists, cards,
drag-and-drop — for a small team that runs its own instance.

**Why people use the category.** Visual task tracking beats a shared doc or a
to-do list once more than a couple of people are moving work through stages
together; boards/lists/cards is the proven mental model (Trello popularized it,
Wekan/Planka/Focalboard/Kanboard all reuse it — it's the generic Kanban concept,
not anyone's IP).

**Better-thesis.** For a small team that outgrew sticky notes but doesn't want
per-seat SaaS pricing or their task data on someone else's servers, Corkboard is a
self-hosted kanban board that gives everyone full access on one flat install,
unlike Trello, which meters board count and automation runs on its free tier and
charges per seat once you need more than the basics.

**What we'll build (M1, this session).** Auth, boards, lists, cards, drag & drop,
labels, due dates, members, checklists, comments, archive/delete, full JSON
export, a basic Trello-JSON importer, and a one-command Docker Compose deploy.

**What we won't build.** Power-Ups/integrations marketplace, Butler automation
builder, extra board views (Calendar/Timeline/Table/Map), SSO/SCIM/audit logs,
multi-workspace billing. These are enterprise/marketplace surface area that a
5-8 person self-hosted team doesn't need, and each is a project of its own.

**Hard parts.**
- Ordering: cards/lists need a stable, collision-safe order under concurrent
  drags → fractional-index ordering + a unique DB constraint per (list, position)
  isn't used; instead we use a float `position` column re-normalized on collision,
  simple and proven at this scale.
- Auth without SSO complexity → NextAuth credentials provider + bcrypt, admin
  bootstrap via env var on first boot.
- Self-host in one command → Docker Compose (app + Postgres), migrations run
  automatically on container start.

**Name & license.** Corkboard, MIT license (see ADR 0002). Not affiliated with
Atlassian/Trello.

**Milestones.** M0 skeleton (auth, DB, Docker) → M1 core loop (this brief) → M2
Trello import polish + attachments → M3 real-time sync, extra views.

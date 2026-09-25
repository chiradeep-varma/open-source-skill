I know exactly which product you mean — **Calendly**, the scheduling-links SaaS (calendly.com, owned by Calendly LLC, still independent/private, priced per-seat starting ~$10-12/user/month for the tiers a small firm would actually need). No naming collision to worry about there.

Before I start building, a few quick questions — I've put my recommended answer on each so you can just say "yep" if they sound right:

**1. What's the main driver — cost, or something else?**
→ *My guess: cost + data ownership.* At 6 seats, Calendly's team plan runs ~$700-900/year, and you already have a VPS sitting there. That combo (small fixed cost of ownership, avoid recurring per-seat billing) shapes everything else below.

**2. Which calendar do your consultants use — Google Calendar, Outlook/Microsoft 365, or mixed?**
→ *This is the single hardest technical part* (real-time availability requires OAuth + calendar API sync to avoid double-bookings), so nailing this down early matters a lot. If everyone's on Google, I'll build one integration well rather than a shaky one for both.

**3. Core workflow — confirm this covers it, or tell me what's missing:**
 - Each of the 6 people has a public booking page + one or more event types (e.g. "30-min intro call", "60-min strategy session")
 - They set weekly availability rules; the system blocks times already busy on their synced calendar
 - Client picks a slot → gets a confirmation email + calendar invite; consultant gets notified
 - Either side can cancel/reschedule
 - Timezone handling (client's local time shown automatically)

 → *Explicitly out of scope unless you say otherwise:* payments/deposits, round-robin routing across the team, SMS reminders, native mobile apps, SSO — these are the things Calendly's enterprise tiers add, and a 6-person firm won't need them.

**4. Stack — okay with Django?**
→ Since you know "some Python," Django is the strong recommendation over Flask/FastAPI here: its built-in admin panel gives you a free back-office UI for managing users/bookings without writing one, and its auth system saves you from hand-rolling login security. One Docker Compose file (app + Postgres), runs comfortably on a small VPS.

**5. How finished should this be?**
→ *My recommendation: a real, working "Project"* — not just a local prototype, since 6 real people and real clients will depend on it — but deliberately scoped small (no Kubernetes, no multi-tenant SaaS complexity, one docker-compose up). Tests on the core booking logic, a README, easy backups.

Reply with any corrections (or just "go" and I'll run with the defaults above) and I'll write up a short charter and get moving.

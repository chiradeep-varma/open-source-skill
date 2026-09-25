**Identity check:** "Calendly" is unambiguous — the meeting-scheduling company (calendly.com), founded 2013, ~$3B valuation, ~20M+ users. No naming collision to worry about. Proceeding on that basis.

**Quick landscape check** (so I don't rebuild something that already exists):

- **Cal.com** is the dominant open-source alternative (39k+ GitHub stars, AGPL-3.0) — but it's Next.js + PostgreSQL + Redis, needs a 4GB+ VPS, and its "Cal.diy" MIT fork is explicitly scoped for personal/non-production use, not a team. Not Python, and heavier than a 6-person firm needs. [Cal.com licensing](https://cal.com/blog/changing-to-agplv3-and-introducing-enterprise-edition) · [Cal.diy](https://www.opensourcealternatives.to/item/cal)
- Other options (Easy!Appointments, Rallly, Thunderbird Appointment) are PHP, poll-based, or not really Python-friendly team scheduling either.
- Calendly itself gets expensive fast for a team: **Teams plan is ~$16–20/seat/month**, so 6 people ≈ $1,150–1,440/year, just for scheduling. [Calendly pricing](https://cal.com/blog/calendly-pricing)

**The gap:** nothing in the open-source space is *small, Python-based, and sized for a one-VPS team of ~6* — that's a legitimate wedge, not a reason to just point you at Cal.com.

So the plan is: a lean Python app (FastAPI or Flask + Postgres/SQLite, one Docker container, no Redis/Node) that does the Calendly core loop — public booking pages, availability rules, calendar sync, confirmation/reminder emails — and skips the enterprise sprawl (payments, lead routing, Salesforce, AI notetaker) you don't need.

Before I start building, a few things that change the design — my recommendation in **bold**, feel free to just say "go with defaults":

1. **Calendar sync**: does your firm use **Google Calendar**, or Microsoft/Outlook, or something else? (Google is my default assumption — most common for small firms.)
2. **Booking model**: mostly **individual booking pages** (each consultant has their own link), or do you also need **round-robin/team routing** (client books "the firm" and it picks whoever's free)?
3. **Auth for the 6 of you**: simple **email/password accounts** is fine, or do you want login via Google?
4. **License**: I'd lean **AGPL-3.0** (matches the category norm, keeps hosted forks open) or plain **MIT** if you'd rather keep it maximally permissive — no strong reason either way for internal use, just pick one.

If you'd rather I just make the calls and start building, say so and I'll proceed with the bolded defaults and note the assumptions in the charter.

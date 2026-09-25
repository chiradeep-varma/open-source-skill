# Parity matrix: Formstead vs. Typeform

_Last updated: 2026-09-25_

| Primitive / area | Capability | Incumbent tier or plan | Our tier | Effort | Milestone | Status | Evidence | Notes |
|---|---|---|---|---|---|---|---|---|
| Form | Create/edit/delete forms, unlimited forms | All tiers | Core | S | M1 | done | [S1] response is what's metered, not form count | |
| Form | Question types: short text, long text, email, number, single choice, multi choice, yes/no, rating (1-5), date | All tiers | Core | M | M1 | done | dossier §6 | |
| Form | Reorder questions, mark required/optional | All tiers | Core | S | M1 | done | dossier §6 | |
| Form | One-question-at-a-time public fill experience with progress bar | All tiers | Core | M | M1 | done | dossier §2, §6 | Own visual design, not copied |
| Form | Branching/skip logic ("if answer to Q = X, skip to Q") | All tiers | Core | M | M1 | done | [S6][S7] | Simplified vs. Typeform's hidden-field logic; covers signup/survey branching needs |
| Responses | Response list + CSV export | All tiers | Core | S | M1 | done | dossier §6 | |
| Responses | Unlimited responses, no metering | Metered 10-10,000+/mo by tier [S1] | Diff | — | M1 | done | [S1][S2] pricing-pain theme | This is the headline better-thesis |
| Publishing | Public shareable URL, no respondent login | All tiers | Core | S | M1 | done | dossier §6 | |
| Publishing | Custom domain | Paid tiers | Later | M | M3 | planned | [S2] | Not needed for v1 nonprofit use |
| Anti-spam | Honeypot field + rate limiting | CAPTCHA on paid tiers only [S2] | Diff | S | M1 | done | [S2] pain theme "CAPTCHA gated behind paid tiers" | Free by default in ours |
| Branding | Remove "powered by" branding | Paid tiers [S2] | Diff | S | M1 | done | [S2] | No branding to begin with; ours is unbranded by default |
| Extensibility | Webhook on new response | All tiers (+ larger integration marketplace) | Core | S | M1 | done | dossier §6 "openness by design" | Full integration marketplace is Won't |
| Extensibility | Integration marketplace (Zapier, Slack, Sheets, etc.) | All tiers | Won't | — | — | won't | dossier §3 | Out of reach for a Prototype; webhook covers the same need generically |
| Files | File upload question type | Paid tiers [S2] | Later | M | M3 | planned | [S2] | Needs storage/quota design; deferred |
| Payments | Stripe/payment collection question | Paid tiers | Won't | — | — | won't | charter non-goals | Out of scope for a nonprofit signup/survey tool |
| Admin | Login for form owners (single or few admin accounts) | Workspace/team roles, all tiers | Core | S | M1 | done | dossier §6 | Multi-role permissions is Later |
| Admin | Team roles / workspaces / SSO | Business/Enterprise | Later/Won't | — | — | won't | charter non-goals | Single-admin is enough for a volunteer org |
| Import | Import forms/responses from a Typeform export | n/a | Switch | M | M2 | planned | charter open question | No export sample available this session; deferred |
| Deploy | One-command self-hosted deploy (Docker Compose) on a cheap VPS | n/a (Typeform is SaaS-only) | Diff | M | M1 | done | charter constraints | The actual reason this project exists |
| AI | AI-generated questions/voice agents | Newer paid features | Won't | — | — | won't | charter non-goals | Not needed for signup/survey use case |

## Summary

- Core: 11 · Switch: 1 · Diff: 4 · Later: 3 · Won't: 4
- Current milestone: M1, all M1 Core and Diff rows done for the prototype.
- Honest status line for the README: "Formstead covers the core Typeform workflow — build a conversational form, publish it, collect unlimited responses, export CSV, get a webhook — self-hosted on one small VPS. It does not yet do file uploads, payments, a Typeform importer, or an integration marketplace."

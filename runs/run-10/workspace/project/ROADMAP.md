# Roadmap

- **M0 — Skeleton.** Repo scaffold, Docker Compose, empty app boots, admin login works. *(done, folded into M1)*
- **M1 — Core loop.** Build forms (all question types + branching logic), publish public link, one-question-at-a-time fill experience, collect responses, CSV export, webhook on new response, honeypot anti-spam. *(done — this session)*
- **M2 — Switch-blockers.** Import forms/responses from a Typeform export (needs a real export sample from the user to build/test against). Bulk response delete/GDPR-style data deletion for a given respondent.
- **M3 — Differentiators.** Custom domain support, file-upload question type with storage quotas, richer per-form theming (colors/logo/custom CSS), email notification on new response (SMTP), multiple admin accounts with roles.
- **Later / Won't.** Payments, AI question generation, integration marketplace, SSO/SAML, native mobile apps — see `docs/product/parity-matrix.md` for the full tiering and reasoning.

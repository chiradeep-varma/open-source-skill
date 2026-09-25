# Releasing a project the user owns

Use this when the user wants to open-source something they (or their organization) already built, rather than build an alternative to someone else's product. Phases 3–7 of the main workflow mostly don't apply. Rights, cleanup and readiness do.

## Contents
1. Confirm the right to release
2. Decide what to release and why
3. Clean the code and its history
4. License and dependency audit
5. Make it runnable by strangers
6. Release plan
7. Checklist

---

## 1. Confirm the right to release

Ask these questions before anything else, because they can't be fixed after publication.

- **Who owns the copyright?**
  - Code written as an employee usually belongs to the employer.
  - Contractors' work depends on their contracts.
  - Co-founders' work depends on the company's IP assignment.
  - For company code, the user needs whoever has authority to approve the release.
- **Does anything restrict it?** Customer contracts, investor agreements, government funding terms, NDAs, or code licensed *to* the company rather than owned by it.
- **Were there outside contributors?** Every contributor without a license or assignment covering this use has to agree to the release, or their code has to come out.
- **Patents.** Does the owner hold patents that the chosen license would grant rights under? (Apache-2.0 and GPL-3.0 carry patent grants.)

If any answer is unclear, recommend resolving it with the organization's legal contact before publishing.

## 2. Decide what to release and why

- **Motive.** The main motives are community goodwill or hiring, adoption as a standard, a business model (open core or hosting), sunsetting a product responsibly, or transparency. The motive decides the license, the effort on docs and community, and whether the whole thing or a component is released.
- **Scope.** The whole product, a core engine, a library or SDK, or a snapshot marked "as is" with no maintenance promise. Be honest about ongoing maintenance, and label archival releases as such.
- **Name and trademarks.** Releasing the code doesn't have to release the brand. Decide what the trademark policy is; many projects publish one.

## 3. Clean the code and its history

- **Secrets.** Scan the working tree *and the full git history* for credentials, keys and tokens, using a dedicated secret scanner.
  - Rotate every secret found, even after removing it, because it has been exposed to everyone with repository access.
  - If history contains secrets or sensitive data, either rewrite it (with a history-filtering tool) or publish a fresh repository with a single initial commit. The fresh start is simpler and safer. The trade-off is losing blame history.
- **Personal and customer data.** Remove fixtures, seeds, logs and test data containing real people's data.
- **Internal references.** Internal hostnames, IP addresses, customer names, private URLs and internal ticket links, plus comments that shouldn't be public. Also remove profanity or remarks about customers and colleagues.
- **Proprietary dependencies.** Remove internal packages, licensed SDKs and paid fonts or assets, or replace them with open equivalents.
- **Infrastructure coupling.** Remove hardcoded cloud accounts and company-specific deployment scripts, and move configuration into environment variables with documented defaults.

## 4. License and dependency audit

- Choose the license with the decision guide in `legal-and-licensing.md` §10. A company with a hosted business usually weighs AGPL-3.0 (protects the hosted offering) against Apache-2.0 (maximizes adoption).
- Run a license scan across all dependencies and vendored code. Resolve incompatibilities, such as GPL code in a project meant to be permissive, or unlicensed snippets copied from the web.
- Add a `LICENSE`, SPDX identifiers, and NOTICE files for Apache-licensed dependencies where required. Add third-party notices for assets.
- Decide on contribution terms (DCO or CLA) *before* the first outside contribution arrives. `legal-and-licensing.md` §10, Step 4 covers the trade-offs.

## 5. Make it runnable by strangers

Internal projects assume internal knowledge. Test that assumption by following the README on a clean machine.

- Provide a one-command start, seed or demo data, and a documented `.env.example`.
- Write a README, an architecture overview and a self-hosting guide (see `build-and-release.md`).
- Remove dependence on internal services, or replace them with local equivalents and adapters.
- Get CI running in the public forge.
- Add community files: CONTRIBUTING, CODE_OF_CONDUCT and SECURITY.

## 6. Release plan

- **Soft launch.** Make the repository public with a clear status (alpha, beta or stable) and a roadmap.
- **Announcement.** Explain why it's being opened, what's included and what isn't, and how the maintainers will engage. Prepare answers for "will this stay open?", "what's in the paid version?" and "how do I contribute?"
- **Commitments.** Only promise response times and maintenance the team can actually keep.
- For a product being sunset, include migration and self-hosting instructions for existing customers, and be clear about the end of official support.

## 7. Checklist

- [ ] Ownership and authority to release confirmed; no conflicting contracts.
- [ ] Secrets scanned across full history, rotated, and removed (or a fresh history published).
- [ ] No personal, customer or internal data or references.
- [ ] Proprietary dependencies and assets removed or replaced.
- [ ] License chosen and applied; dependency scan clean; notices in place.
- [ ] Contribution terms decided and documented.
- [ ] Fresh-machine install works from the README alone.
- [ ] Community files and CI in place.
- [ ] Trademark policy decided.
- [ ] Announcement drafted, and the user has approved when and where it goes out.

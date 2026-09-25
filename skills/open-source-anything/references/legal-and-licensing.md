# Legal boundaries and licensing

What an open-source alternative can take from the product it replaces, what it can't, how to prove independent creation, how to name it, and which license to choose. Use it in Phase 5, and any time something feels gray.

This is careful orientation, mostly under US and EU law, not legal advice. Say so to the user when the stakes are real, and recommend counsel in the situations listed in §11.

## Contents
1. The core rule: expression is protected, function is not
2. What never to copy
3. Independent-creation discipline, and AI
4. Reverse engineering, terms of service and access
5. Trademarks and naming
6. Patents
7. Content, data, privacy and AI models
8. Regulated domains
9. EU Cyber Resilience Act
10. Choosing a license
11. When to recommend a lawyer
12. Key authorities

---

## 1. The core rule: expression is protected, function is not

Copyright protects the *expression* of an idea: the code, the text, the artwork. It does not protect the idea, system, method of operation or functionality. That distinction is why open alternatives exist legally.

- **US.** Copyright doesn't extend to "any idea, procedure, process, system, method of operation" (17 U.S.C. §102(b)). In *Lotus v. Borland* (1st Cir. 1995), a menu command hierarchy was held to be an uncopyrightable method of operation.
- **EU.** In *SAS Institute v. World Programming* (CJEU, C-406/10, 2012), the court held that a program's functionality, its programming language and its data file formats are not protected by copyright. In the same dispute, WPL's *manual* was found to infringe because it reproduced SAS's documentation text. **Reimplement the behavior, but write your own documentation.**
- **APIs.** In *Google v. Oracle* (US Supreme Court, 2021), reimplementing the Java API's declarations was held to be fair use. The Court did not decide whether APIs are copyrightable. Compatible reimplementations are common and well supported, but in the US the protection rests on fair use, not on a blanket rule.

| Generally free to reimplement | Handle with care | Off-limits |
|---|---|---|
| Ideas, features, workflows, the concept model | API compatibility: fine to implement, but write your own docs and don't copy reference text | Code in any form (source, minified, decompiled, leaked) |
| Business model and pricing structure | Close visual resemblance: conventions are fine, a near-replica isn't | Icons, illustrations, fonts, sounds, screenshots |
| General UI conventions (sidebars, command palettes, kanban boards) | Reading the target's terms before using your account on it | Docs, marketing copy, distinctive UI text, templates |
| Interoperable file formats and protocols | Anything patented in the domain (§6) | Trademarks and confusingly similar names |
| Function names and behavior needed for compatibility | Using the target's API to import a user's data | Trade secrets, insider or NDA information |

## 2. What never to copy

- **Code.** This includes code you "only glanced at" in a bundle, a leak or a decompiler. It also includes the target's source-available or proprietary `ee/` directory when the target is open core.
- **Visual assets.** Icons, illustrations, logos, fonts that aren't openly licensed, sound effects, marketing imagery and screenshots. Use openly licensed sets (and record their licenses) or make your own.
- **Text.** Documentation, help articles, marketing copy, onboarding flows, error messages and distinctive UI copy. Short functional labels such as "Share", "Settings" and "New page" are fine.
- **Content and data.** Template galleries, sample content, stock media, curated datasets, community content, and anything behind their login.
- **Look and feel as a whole.** Individual conventions are free, but a near-pixel replica of a distinctive overall design can create copyright or trade-dress exposure, especially for games and visually driven products. In *Tetris Holding v. Xio Interactive* (D.N.J. 2012), the game mechanics were free to use but a close visual clone infringed. Give the project its own visual identity.
- **Trade secrets.** Anything that isn't public and was obtained through employment, contract, leak or trickery.

## 3. Independent-creation discipline, and AI

**The classic clean room.** One team studies the original and writes a specification containing only functional facts. A second team, never exposed to the original's implementation, builds from that specification. Phoenix Technologies' clone of the IBM PC BIOS in the 1980s is the textbook case. The separation creates evidence that the new work was independently created.

**In this workflow, you are the implementer.** So:
- The dossier and specs are the only bridge between research and code, and they contain behavior and facts, never implementation.
- Never load the target's implementation into your context: no source, bundles, decompiled output or leaked code. If it was loaded earlier in a session, disclose that to the user, because it undermines any clean-room claim for code written afterwards.
- Keep `docs/legal/provenance.md` up to date. It records which sources informed the work, what was deliberately never accessed, and who directed which decisions.
- Write original code. Don't reproduce substantial verbatim passages from memory. Well-known open-source libraries should be used as dependencies under their licenses, not recalled and pasted in.

**AI rewrites are contested ground.** In early 2026 a long-standing library was rewritten with an AI coding assistant and relicensed from LGPL to MIT. Its original author publicly objected that exposure to the original code made it a derivative work rather than a clean-room rewrite. Whatever the legal outcome, the lesson is practical:
- An AI rewrite of code the AI has read is not a clean room.
- If the target is copyleft open source and the user wants a permissive version, **don't "rewrite to relicense"**. Either build on its code under its license (keeping the copyleft), or build a genuinely independent implementation from behavior and specs alone, and document the provenance.

**AI-generated code and copyright.** US law requires human authorship. In January 2025 the US Copyright Office concluded that purely AI-generated material isn't protected, while human creative contributions (selection, arrangement, modification) are. *Thaler v. Perlmutter* (D.C. Cir. 2025) affirmed the human-authorship requirement, and the Supreme Court declined review in March 2026. In practice:
- The license still covers the human-authored parts, and the project remains fully usable.
- Meaningful human direction, review and editing strengthen the copyright position, and with it the enforceability of copyleft terms.
- Tell the user this plainly if they plan copyleft enforcement or dual licensing.

## 4. Reverse engineering, terms of service and access

**Observing behavior**
- **EU.** Anyone entitled to use a program may observe, study and test it to find its underlying ideas (Software Directive 2009/24/EC, Art. 5(3)), and contract terms can't take that away (Art. 8).
- **EU decompilation** (Art. 6) is allowed only to achieve interoperability of an *independently created* program, only when the information isn't otherwise available, and never to build a substantially similar program. **Decompiling a target in order to clone it isn't covered.**
- **US.** Disassembly as intermediate copying for interoperability has been held to be fair use (*Sega v. Accolade*, 9th Cir. 1992; *Sony v. Connectix*, 9th Cir. 2000).
- **But contracts can override this in the US.** In *Bowers v. Baystate* (Fed. Cir. 2003), a license clause banning reverse engineering was enforced. Terms of service matter.

**Technical protection measures.** The US DMCA §1201 prohibits circumventing access controls, with a narrow interoperability exemption in §1201(f), and the EU has equivalent rules. Never bypass DRM, license checks, encryption, paywalls or login gates.

**Access and scraping**
- *Van Buren v. United States* (2021) narrowed the US Computer Fraud and Abuse Act to "gates-up-or-down" access.
- In *hiQ v. LinkedIn*, scraping public pages was held unlikely to count as access "without authorization". The case still ended with hiQ liable for breach of LinkedIn's user agreement and for trespass to chattels, in a 2022 consent judgment that included $500,000 and a permanent injunction.
- **The live risk is contract and tort, not criminal hacking law.**

**Rules for this workflow**
1. Prefer public sources. They are usually enough.
2. Before you or the user study the product through their account, read the terms for clauses on reverse engineering, competitive use, benchmarking, scraping and automated access. Quote the relevant clause to the user and let them decide how to proceed.
3. Use it as a normal user would. Don't script or automate against their service.
4. Don't scrape content or personal data. You need understanding, not their data.
5. If you use their API, including for an importer, stay within the API terms. Some forbid building competing products. **The user's own data export is the safest input for designing and testing importers.**

## 5. Trademarks and naming

Trademarks protect names, logos, slogans and sometimes distinctive trade dress, to prevent consumer confusion.

- **Don't:**
  - put their mark in your name ("OpenNotion", "FreeFigma", "Figma-OSS");
  - pick a sound-alike name;
  - use their logo, or a color-and-layout combination that suggests affiliation;
  - register domains or package names containing their mark.
- **Do:** refer to them factually when you need to. "An open-source alternative to Notion" and "Import from Notion" are referential uses, protected as nominative fair use in the US and as honest-practices referential use under the EU Trade Mark Regulation (2017/1001, Art. 14). Use no more of the mark than needed, never their logo, and add a line such as *"Not affiliated with or endorsed by X. X is a trademark of its owner."*
- **Comparison pages:** keep claims truthful and dated ("as of 2026-09"), avoid disparagement, and link to sources.

**Name check**
- Look for conflicts in the national trademark registers where the project will be used (USPTO, EUIPO/TMview, WIPO Global Brand Database), mainly in the software classes (Nice classes 9 and 42).
- Also check a general web search, GitHub, the package registries the project will publish to (npm, PyPI, crates.io, Docker Hub and others), domains and social handles.
- Coined, distinctive names are safest and easiest to find. In this skill's own test runs, every common-word name collided with an existing product in the same category, and every coined name came back clean (see `runs/` in the skill's repository).

## 6. Patents

Patents protect functional inventions, and **independent creation is not a defense**. That makes them the one area where clean-room discipline doesn't protect you.

- Software patents exist in both the US and Europe. The US narrowed them after *Alice v. CLS Bank* (2014). The European Patent Convention excludes programs "as such" but allows inventions with a technical character.
- Don't run patent searches by default. In the US, knowingly infringing a patent can raise damages (35 U.S.C. §284). For that reason, many companies tell engineers not to read patents without counsel.
- Do flag domains known to be patent-heavy: audio and video codecs, cellular and wireless standards, some compression and imaging techniques, and medical devices. Prefer royalty-free standards (AV1, VP9, Opus, WebRTC's royalty-free profile).
- Licenses with explicit patent grants (Apache-2.0, GPL-3.0, MPL-2.0) protect users from contributors' patents. MIT and BSD don't grant patent rights explicitly.
- For a commercial venture in a patent-heavy domain, recommend counsel before launch.

## 7. Content, data, privacy and AI models

- Build your own templates, sample data and content. Openly licensed sources are fine with attribution, for example OpenStreetMap under ODbL, whose share-alike terms apply to derived databases.
- **Privacy.** If the software processes personal data, give deployers the tools they need to comply with laws such as GDPR and CCPA: export, deletion, retention settings, audit logs. Keep telemetry off by default.
- **AI models.**
  - Don't train on or distill a proprietary model's outputs where its terms forbid that.
  - For open-weight models, read the license. Some are OSI-style (Apache-2.0, MIT). Others are "community licenses" with use and scale restrictions, which aren't open source.
  - Keep the model layer pluggable.

## 8. Regulated domains

The software can be open while *operating* it still requires licenses or compliance. Build for deployers, and be explicit about what's on them:
- **Payments and financial services:** money transmission, lending, banking charters, PCI DSS for card data.
- **Health:** HIPAA in the US and equivalents elsewhere. If the software diagnoses or treats, it may count as medical-device software (FDA, EU MDR).
- **Children and education:** COPPA, FERPA and their equivalents.
- **Transport and ride-hailing:** operator permits and insurance.
- **Legally meaningful records:** electronic signatures (ESIGN and UETA in the US, eIDAS in the EU, with levels of assurance that need qualified providers), e-invoicing mandates, record retention and archiving.
- **Telecom, gambling, drones and aviation.**

Never market the project as "compliant" or "certified" unless a certification actually exists. Describe the controls it provides instead.

## 9. EU Cyber Resilience Act

The CRA sets security obligations for products with digital elements sold in the EU. Vulnerability-reporting obligations apply from 11 September 2026, and the rest from 11 December 2027.
- Open-source software developed and supplied outside any commercial activity is largely out of scope.
- "Open-source software stewards" (legal entities that sustainably support open-source products intended for commercial use) have a lighter regime.
- Monetizing the product, for example by selling it, hosting it or bundling support, can make you a manufacturer with the full obligations.

For Venture mode, flag this and suggest counsel. For every project, the cheap basics help anyway: a `SECURITY.md` with a reporting channel, a documented vulnerability-handling process, and SBOM generation in CI.

## 10. Choosing a license

**Step 1. Is it actually open source?** Open source means a license approved by the Open Source Initiative. Source-available licenses such as BSL, FSL, SSPL, the Elastic License, the "Sustainable Use License" and the Commons Clause restrict use, usually by prohibiting competing commercial use, so they aren't open source. BSL and FSL convert to an open license after a delay (FSL after two years). If the user wants one of these, that's their call. Describe it accurately ("source-available"), never as open source.

**Step 2. Match the license to the goal.**

| Goal | License | Reasoning |
|---|---|---|
| Maximum adoption; libraries, SDKs, anything meant to be embedded | **Apache-2.0**, or MIT | Apache-2.0 adds an explicit patent grant and patent-retaliation clause, so prefer it for substantial code. MIT is the shortest and most familiar. |
| Keep changes to *your files* open while allowing larger proprietary combinations | **MPL-2.0** | File-level copyleft. Penpot, an open alternative to Figma, uses it. |
| Keep distributed derivatives open (desktop apps, tools) | **GPL-3.0** | Strong copyleft on distribution. GPL and app-store terms have clashed before (VLC was pulled from Apple's App Store in 2011), so check distribution channels. |
| A network service where you don't want closed hosted forks | **AGPL-3.0** | Requires offering source to network users. It's the common choice for open alternatives to SaaS: Plausible, Immich, Twenty, Signal's server and Grafana use it (as of September 2026). Some companies ban AGPL internally, which trades away some corporate adoption. |
| Documentation | CC-BY-4.0 | |
| Artwork, icons, sample content | CC-BY-4.0 or CC0; fonts under OFL-1.1 | |
| Datasets | CC-BY-4.0, CC0 or ODbL | |
| Hardware designs | CERN-OHL-S, -W or -P (strong, weak or permissive) | See `product-types.md`. |

For a SaaS alternative, default to **AGPL-3.0** when the user wants hosted forks to stay open, and to **Apache-2.0** when adoption and embedding matter more. Explain the trade-off in two sentences and let the user decide.

**Step 3. Business structure (Venture mode).**
- **Open core.** A fully open core plus separately licensed commercial modules, kept in a clearly separated directory or repository. Be honest about which features sit where.
- **Dual licensing** (AGPL plus a commercial license) requires the project to hold rights to all the code, which means a CLA or contributor copyright assignment.
- **Hosted service.** The core stays fully open and the business is running it well. This is the simplest to explain and the most trusted.

**Step 4. Contribution terms.**
- **DCO** (Developer Certificate of Origin: contributors add a `Signed-off-by` line) is light and trusted, and the Linux kernel uses it. It's the default recommendation.
- **A CLA** enables relicensing and dual licensing, but it costs community trust. Every major relicensing of the last decade led to a community fork:
  - Elasticsearch in 2021 → OpenSearch;
  - Terraform's move to BSL in 2023 → OpenTofu;
  - Redis in 2024 → Valkey.

  Elastic (2024) and Redis (2025) later added AGPL options. In April 2026, Cal.com moved its main product from AGPL-3.0 to a proprietary license, citing AI-assisted vulnerability discovery, and published a reduced MIT-licensed fork (Cal.diy).

  Use a CLA only if the business model needs one, and explain why in `CONTRIBUTING.md`. Licenses really do change, so re-verify any license you cite.

**Step 5. Check dependency compatibility.**
- Permissive dependencies (MIT, BSD, ISC, Apache-2.0) fit in almost anything. The exception: Apache-2.0 is incompatible with GPL-2.0-only.
- GPL dependencies in distributed software make the combined work GPL.
- AGPL components in a network service bring source-offer obligations.
- LGPL is generally fine via dynamic linking. Follow its relinking terms for static linking.
- Code with no license is all rights reserved. Don't use it.
- Scan dependencies in CI with ScanCode, `licensee`, or ecosystem tools (license checkers for npm, `pip-licenses`, `cargo-deny`, `go-licenses`). Consider REUSE/SPDX headers.

**Step 6. Apply it.** Put the full license text in `LICENSE` and the SPDX identifier in every package manifest. Keep the NOTICE files of Apache-licensed dependencies where required, and list third-party asset licenses in `docs/legal/` or a `THIRD_PARTY_NOTICES` file.

## 11. When to recommend a lawyer

Say so plainly, without alarm, when:
- the project is a commercial venture that directly targets a well-funded or historically litigious incumbent;
- the user works or worked at the target, or holds any of its non-public information;
- the domain is patent-heavy, or the project implements a standard with essential patents;
- the product operates in a regulated domain (§8);
- the target is a game, or a device with firmware or DRM;
- the user wants API or file-format compatibility with a vendor that has sued over compatibility before;
- the user plans dual licensing, CLAs or relicensing.

## 12. Key authorities

| Authority | Holding in one line |
|---|---|
| 17 U.S.C. §102(b) | No copyright in ideas, procedures, systems, methods of operation |
| *Lotus v. Borland*, 1st Cir. 1995 | A menu command hierarchy is an uncopyrightable method of operation |
| *Sega v. Accolade*, 9th Cir. 1992 | Disassembly to reach unprotected functional elements for compatibility can be fair use |
| *Sony v. Connectix*, 9th Cir. 2000 | Intermediate copying to build a compatible product can be fair use |
| *Bowers v. Baystate*, Fed. Cir. 2003 | A contractual ban on reverse engineering can be enforced |
| *SAS Institute v. World Programming*, CJEU 2012 | Functionality, programming languages and data formats aren't protected, but manuals are |
| Directive 2009/24/EC, Arts. 5(3), 6, 8 | Right to observe, study and test; narrow decompilation for interoperability; contract can't override these |
| *Tetris Holding v. Xio*, D.N.J. 2012 | Game rules are free, but a near-identical visual expression infringes |
| *Google v. Oracle*, US 2021 | Reimplementing API declarations was fair use (copyrightability left undecided) |
| *Van Buren v. United States*, US 2021 | The CFAA's "exceeds authorized access" means entering off-limits areas |
| *hiQ v. LinkedIn*, 9th Cir. 2022, consent judgment Dec. 2022 | Public scraping probably isn't a CFAA violation, but breach of contract still bit |
| US Copyright Office AI report, Part 2, Jan. 2025; *Thaler v. Perlmutter*, D.C. Cir. 2025 | Copyright requires human authorship; AI-assisted works are protected to the extent of human contribution |
| DMCA 17 U.S.C. §1201(f) | Narrow interoperability exemption from the anti-circumvention rules |

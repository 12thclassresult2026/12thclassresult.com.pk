# Implementation Plan — 12thclassresult.com.pk

**Created:** 2026-09-14
**Status of the foundation:** built and passing the full quality gate.

This plan is prioritized and executable. It records what is done, what is next, and
what is blocked on something outside this repository.

---

## Phase 0 — Foundation ✅ COMPLETE

| Item                                                           | Status                                   |
| -------------------------------------------------------------- | ---------------------------------------- |
| Repository audit (`docs/repository-audit.md`)                  | Done                                     |
| Adapter decision gate (`docs/architecture-decisions.md`)       | Done — OpenNext over vinext, on evidence |
| Locked dependency matrix, lockfile committed                   | Done                                     |
| Next.js App Router + TypeScript strict + Tailwind v4           | Done                                     |
| Security headers, enforced CSP, preview isolation              | Done                                     |
| Canonical system, metadata factory, segmented sitemaps, robots | Done                                     |
| Typed page registry with validation gates                      | Done                                     |
| Board registry (10 boards) + official source registry          | Done                                     |
| `VerifiedFact` provenance model + capability tri-state         | Done                                     |
| Rate limiting, input validation schemas                        | Done                                     |
| Unit + validation test suites                                  | Done — 95 tests                          |
| CI workflow (validation only, no deploy)                       | Done                                     |

**Quality gate:** `npm run check` passes — format, lint, typecheck, validate, test, build.

---

## Phase 1 — Close the verification gaps 🔴 BLOCKED ON A HUMAN

These need an ordinary browser. They cannot be closed by automated fetching, and no
block may be evaded.

1. **BISE Faisalabad** — confirm the HSSC Part-II result route. Seven hosts returned
   403; `InterResults.aspx` is suspected but unverified, so it is not registered.
2. **FBISE** — confirm the Part-II route and its form fields behind the 301 to
   `portal.fbise.edu.pk`.
3. **CAPTCHA presence/absence** for Multan, Rawalpindi, Sargodha, Sahiwal and DG Khan
   by reading each form as **served HTML** rather than converted markdown. Until then
   every one stays `null`, and none is eligible for server integration.
4. **Any board page that prints an SMS shortcode.** None was found. Until one is, the
   site publishes no shortcode at all.

---

## Phase 2 — Board pages, one at a time

Registry-first is already in place: all ten boards exist as `planned` with no route,
so the directory is honest without shipping a single thin page.

For each board, in this order:

1. Write the page from the board's own verified data — never a template with the name
   swapped.
2. Add its route; it serves as `draft` (`noindex`, not in the sitemap, not linked).
3. Conduct a publication review **from the rendered page**, not from the registry:
   count what is genuinely distinct versus shared with every other board page.
4. Promote to `published` only if it carries value the hub does not.
5. Add it to `ROUTE_MODULES` in `tests/validation/route-metadata.test.ts`, or it is
   not covered.

**Stop at the first board that cannot clear unique value. Do not batch.**

---

## Phase 3 — Result-day infrastructure

1. Source-health model and a scheduled, conservative check (never per-visitor).
2. The fallback ladder: official portal link → gazette guidance → verified SMS (if one
   ever exists) → board notice → retry guidance.
3. Status vocabulary wired to `VerifiedFact` — never "LIVE" without verification, and
   no countdown without a `confirmed` date **with a time**.
4. A result lookup route only if a board is ever legitimately integrable. Today none
   is, and `BOARD_ADAPTERS` stays empty by policy, not by oversight.

---

## Phase 4 — Tier-1 whitespace (from `docs/research/content-gap-analysis.md`)

Ranked by opportunity, all currently uncovered market-wide:

1. Post-result document admin — duplicate DMC, name/DOB correction, migration,
   attestation.
2. Result-problem triage — withheld, UFM, missing practicals, roll number not found.
3. Result statistics archived as structured, sourced data.
4. Second annual / supplementary depth.
5. Urdu / Roman-Urdu coverage.

Each page must pass the URL Eligibility Gate (section 132) before it is written.

---

## Phase 5 — Expansion

Additional provinces (KPK, Sindh, Balochistan, AJK) registry-first, then pages.
Sindh needs its **group-wise staggered announcement** model handled correctly — every
Punjab-centric competitor gets this wrong, which is precisely the opening.

Study-material verticals only where original, source-backed value exists.

---

## External requirements — genuinely still needed from the owner

1. **GitHub access.** The target repository could not be reached. `gh` is not
   installed and credentials are not available non-interactively. No remote has been
   added and no duplicate repository was created.
2. **Cloudflare account confirmation.** The only authenticated account belongs to the
   11th-class project. Whether this site deploys there must be confirmed before the
   zone is bound.
3. **The content/keyword packet** (section 62). None exists for this project. No
   owner keyword assignments have been discarded, because none were received.
4. **Brand assets** — a logo and an OG image. Until one exists, no OG image is
   referenced rather than referencing a 404.
5. **Analytics / Turnstile IDs**, if and when those are wanted. Both stay disabled and
   out of the CSP until real configuration exists.

---

## Standing rules for every future phase

- No page ships from a template with only the board name changed.
- No route becomes indexable before a publication review.
- No dataset status is inferred from a form's year dropdown.
- No SMS shortcode without a board source.
- No fabricated result, statistic, rating or review — ever, including in schema.
- Every past bug becomes a test.

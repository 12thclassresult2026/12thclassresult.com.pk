# Implementation Plan

**Updated:** 2026-09-14 (Phase 3 complete)
**Status:** Foundation built · Research complete · Architecture complete · **Production foundation built**

---

## Where the project stands

| Phase                                | Status                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| **0 — Production foundation**        | ✅ Next.js 16 on Cloudflare Workers, 3 pages, gate green                              |
| **1 — Research**                     | ✅ 21 deliverables, 28 boards verified                                                |
| **2 — Architecture**                 | ✅ 20 blueprint documents, 11 ADRs                                                    |
| **3 — Production foundation build**  | ✅ **Complete.** Domain model, registries, components, representative page, 117 tests |
| **4 — Core product + result engine** | ⏸ Not started                                                                         |

---

## What Phase 3 delivered

### Domain model — the central change

The board model now expresses **four board models, not one**. `accessModel` and
`declarationModel` are orthogonal fields on all 28 boards, `ResultDataset` is group-aware,
and `CapabilityStatus` has six states so "blocked" is no longer conflated with "unknown".

`AccessModelAction` switches on the model in exactly one place, with compiler-checked
exhaustiveness — so a gazette-only board **cannot** be shown a roll-number prompt, and a
new board model is a build failure rather than a silently wrong page.

### Registries

28 boards (10 Punjab/Federal, 8 KPK, 6 Sindh, Balochistan, AJK, 2 private) and 28 source
records, each carrying a provenance note recording what was seen **and what was not**.

Two factual corrections from Phase 1 applied: Multan's reCAPTCHA and Rawalpindi's name
search, both previously `null`.

### Gates added

`intentId` uniqueness (entity-scoped) · every board has an access model · a gazette-only
board claims no roll-number support · a per-group board is not flattened · board and page
lifecycle agreement · yearless board paths · no capability coerced to a boolean in
rendered output · an expanded shortcode blocklist.

**117 tests, all green.**

---

## Phase 4 — Core product and result engine

| Batch  | Contents                                                                                                        |
| ------ | --------------------------------------------------------------------------------------------------------------- |
| **4a** | The Tier-0 sourced vacuums: rechecking hub + 6 per-board pages, lost roll number, percentage guide + calculator |
| **4b** | Board pages in evidence order — **Quetta next** (the only declared 2026 result), then Punjab one at a time      |
| **4c** | Gazette system — hub, 8 board pages, archive                                                                    |
| **4d** | Remaining boards; the session hub, which unblocks the moment a board declares                                   |
| **4e** | Source-health model and the result-day fallback ladder                                                          |

Each board page passes a publication review conducted **from the rendered page**, not
from the data.

---

## Blocked — needs a human, not more engineering

| Item                               | Unblocks when                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Faisalabad, FBISE, Kohat pages** | Someone opens each in an ordinary browser and records the route and form fields. All three WAF-block automated requests; **no block was evaded** |
| **Sukkur, Shaheed Benazirabad**    | A working official route exists at all                                                                                                           |
| **DG Khan results page**           | Re-verified — two research passes disagreed about whether the page carries a form                                                                |
| **CAPTCHA status on 5 boards**     | Each form is read as served HTML rather than converted markdown                                                                                  |
| **HSSC rechecking fees**           | Boards publish them; every rate held was read from an SSC portal                                                                                 |
| **The improvement supersession**   | The amending policy document becomes readable                                                                                                    |
| **Any SMS content**                | A board publishes a shortcode on its own page                                                                                                    |
| **Session hub date content**       | A board publishes a 2026 Part-II notification                                                                                                    |

---

## External requirements — unchanged

1. **GitHub access.** The target repository could not be reached; `gh` is not installed and credentials are not available non-interactively. **No remote is configured and no duplicate repository was created.**
2. **Cloudflare account confirmation.** The only authenticated account belongs to the 11th-class project, so `wrangler.jsonc` still declares **no `routes`**.
3. **Owner content/keyword packet.** None exists. No owner keyword assignment has been discarded, because none was received.
4. **Brand assets** — a logo and an OG image. Until one exists, no OG image is referenced rather than referencing a 404.
5. **Analytics / challenge-widget IDs**, if wanted. Both stay disabled and out of the CSP until real configuration exists.

---

## Standing rules

1. No page ships from a template with only the board name changed.
2. No route becomes indexable before a publication review from the rendered page.
3. No dataset status is inferred from a form's year dropdown.
4. No SMS shortcode without a board source.
5. No fabricated result, statistic, rating or review — including in schema.
6. `unknown` never renders as "No".
7. A gazette-only board never shows a roll-number call to action.
8. Every past bug becomes a test.
9. One board at a time. Stop at the first that cannot clear unique value.

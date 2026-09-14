# Implementation Plan

**Updated:** 2026-09-14 (Phase 2)
**Status:** Foundation built · Research complete · **Architecture complete — Phase 3 not started**

---

## Where the project stands

| Phase                         | Status                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------- |
| **0 — Production foundation** | ✅ Complete. Next.js 16 on Cloudflare Workers, 3 pages, 95 tests, gate green |
| **1 — Research**              | ✅ Complete. 21 deliverables, 28 boards verified, commit `6c5adad`           |
| **2 — Architecture**          | ✅ Complete. 20 blueprint documents, 11 ADRs                                 |
| **3 — Production build**      | ⏸ **Not started.** Begins at the Phase 2 stop gate's release                 |

Phase 3 executes the approved architecture. It does not re-decide structure while coding
— that was the point of Phase 2.

---

## Phase 3 batches

Full detail in `seo/implementation-roadmap.md`. Summary:

| Batch | Contents                                                                                                                                     | Depends on |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **0** | Data model migration — access/declaration models, capability status, group-aware datasets, `intentId`, new gates                             | nothing    |
| **1** | The sourced vacuums — rechecking hub + 6 board pages, lost roll number, percentage guide + calculator, second annual                         | Batch 0    |
| **2** | Board pages in evidence order — **Quetta first** (the only declared 2026 result), **Karachi second** (gazette-only + per-group), then Punjab | Batch 0    |
| **3** | Gazette system — hub, 8 board pages, archive                                                                                                 | Batch 2    |
| **4** | Remaining boards; session hub when a board declares                                                                                          | Batch 2    |
| **5** | DMC, improvement, conditional families                                                                                                       | Batch 1    |
| **6** | Urdu surface, session archives, conditional expansion                                                                                        | Batch 4    |

**Why the hardest board models come first:** if the architecture cannot express Quetta's
declared result and Karachi's seven staggered group declarations, that must surface
before seven similar Punjab pages are written against the wrong shape.

---

## Blocked — needs a human, not more engineering

| Item                               | Unblocks when                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Faisalabad, FBISE, Kohat pages** | Someone opens each in an ordinary browser and records the route and form fields. All three WAF-block automated requests; **no block was evaded** |
| **Sukkur, Shaheed Benazirabad**    | A working official route exists at all                                                                                                           |
| **DG Khan results page**           | Re-verified — two passes disagreed about whether the page carries a form                                                                         |
| **CAPTCHA status on 5 boards**     | Each form is read as served HTML rather than converted markdown                                                                                  |
| **HSSC rechecking fees**           | Boards publish them; every rate we hold was read from an SSC portal                                                                              |
| **The improvement supersession**   | The amending policy PDF becomes readable                                                                                                         |
| **Any SMS content**                | A board publishes a shortcode on its own page                                                                                                    |
| **Session hub date content**       | A board publishes a 2026 Part-II notification                                                                                                    |

---

## External requirements — unchanged since the foundation cycle

1. **GitHub access.** The target repository could not be reached; `gh` is not installed
   and credentials are not available non-interactively. **No remote is configured and no
   duplicate repository was created.**
2. **Cloudflare account confirmation.** The only authenticated account belongs to the
   11th-class project. `wrangler.jsonc` therefore declares **no `routes`** — a routes
   entry naming a zone the account does not hold fails the deploy outright.
3. **Owner content/keyword packet.** None exists for this project. No owner keyword
   assignment has been discarded, because none was received.
4. **Brand assets** — a logo and an OG image. Until one exists, no OG image is referenced
   rather than referencing a 404.
5. **Analytics / challenge-widget IDs**, if wanted. Both stay disabled and out of the CSP
   until real configuration exists.

---

## Standing rules for Phase 3

1. No page ships from a template with only the board name changed.
2. No route becomes indexable before a publication review conducted **from the rendered page**.
3. No dataset status is inferred from a form's year dropdown.
4. No SMS shortcode without a board source.
5. No fabricated result, statistic, rating or review — including in schema.
6. `unknown` never renders as "No".
7. A gazette-only board never shows a roll-number call to action.
8. Every past bug becomes a test.
9. One board at a time. Stop at the first that cannot clear unique value.

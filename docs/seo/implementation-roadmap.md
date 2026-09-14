# Implementation Roadmap — Phase 3 onward

**Phase:** 2 — Architecture (sequencing; nothing scheduled for build yet)
**Date:** 2026-09-14
**Supersedes for sequencing:** `content-roadmap.md` (Phase 1 priorities)

---

## The sequencing principle

> **Build what does not depend on an announcement first.**

The 2026 Part-II result is undeclared for Punjab, KPK, the Federal board and AJK. A
roadmap that starts with the year hub would stall on something no board has done.

Meanwhile three Tier-0 items — rechecking, lost roll number, percentage — are
**buildable today from verified primary documents**, and each targets a genuine vacuum.
So the roadmap deliberately front-loads post-result guides ahead of session pages.

---

## Batch 0 — Data model migration

_No new pages. This is the migration that everything else depends on._

| Task                                                                                   | Source                           |
| -------------------------------------------------------------------------------------- | -------------------------------- |
| Add `accessModel` + `declarationModel` to `Board`; populate all 10 registered boards   | `board-data-model.md` §2         |
| Add `group`, `declaredAt`, `gazetteSourceId` to `ResultDataset`                        | §5                               |
| Introduce `CapabilityStatus`; migrate flags; set `blocked` on the 3 WAF-blocked boards | §3                               |
| Extend `capabilityLabel()` for six states, with no default-to-false branch             | §3                               |
| Register the 16 verified non-Punjab boards as `planned`                                | capability matrix                |
| Apply the 2 factual source corrections                                                 | risk register §6                 |
| Add `intents.ts` + `intentId` on `PageEntry`                                           | `information-architecture.md` §3 |
| Add the Phase 3 validation gates                                                       | `testing-strategy.md` §3         |

**Exit:** `npm run check` green; the board directory names all 28 boards honestly; a
`gazette-only` board cannot render a roll-number call to action even if someone tries.

---

## Batch 1 — The sourced vacuums

_Highest value, zero dependency on any board announcing anything._

| Page                                   | Why now                                                                                                                       |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `/guides/rechecking`                   | The market's biggest gap. Leads with re-marking being excluded — the most misunderstood fact in the topic                     |
| `/guides/rechecking/<board>` × 6       | Real fees, deadlines, modes, refund rules. Shows one board's three conflicting official fees rather than silently picking one |
| `/guides/lost-roll-number`             | The weakest surface observed anywhere                                                                                         |
| `/guides/how-percentage-is-calculated` | The ranking answer uses a foreign formula that is wrong here                                                                  |
| `/tools/percentage-calculator`         | The tool that guide implies                                                                                                   |
| `/guides/second-annual`                | Statutory compartment rules in hand                                                                                           |

**Exit:** six guides + one tool published, each with provenance and a review date.

---

## Batch 2 — Board pages, in evidence order

_One at a time. Stop at the first that cannot clear unique value. Never batch._

| Order | Board                                                                 | Why this order                                                                                                        |
| ----- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1     | **Quetta**                                                            | The only board verified as having **declared** its 2026 result, with gazettes. Proves the "announced" path end to end |
| 2     | **Karachi**                                                           | Gazette-only **and** per-group. Proves the hardest model, and is the highest-differentiation page in the inventory    |
| 3–9   | Lahore, Gujranwala, Multan, Rawalpindi, Sargodha, Bahawalpur, Sahiwal | Verified portals, richest cautions                                                                                    |
| 10    | DG Khan                                                               | After its results page is re-verified                                                                                 |

Building the two hardest models **first** is deliberate: if the architecture cannot
express Quetta's declared result and Karachi's seven staggered group declarations, that
should surface before seven similar Punjab pages are written against the wrong shape.

**Exit:** each page passes a publication review conducted from the rendered page.

---

## Batch 3 — Gazette system

Gazette hub → per-board pages for the 8 verified boards → archive.

Sequenced after Karachi because that page needs the gazette journey to exist. For
gazette-only boards this is the primary route, not a supporting page.

**Exit:** every gazette-only board links its gazette as the primary action.

---

## Batch 4 — Remaining boards and the session hub

- KPK board pages (7 verified; Peshawar and Mardan carry the session-rotation warning)
- Hyderabad, AJK (gazette-led)
- Larkana, if re-verification holds
- **The session hub** `/results/12th-class/2026` — **unblocks the moment a board declares**

**Exit:** national coverage for every board with a verified route.

---

## Batch 5 — Remaining guides and conditional families

DMC guide · improvement guide (with the supersession caveat) · board hubs where distinct ·
updates feed if genuinely maintained · admissions guidance if it stays tethered.

---

## Batch 6 — Conditional expansion

Urdu surface · board session archives that clear the durable-value gate · Punjab group
pages **only** if real group content is obtained · academic resources, which is a scope
decision rather than a keyword one.

---

## Permanently blocked

| Item                           | Unblocks when                                     |
| ------------------------------ | ------------------------------------------------- |
| Faisalabad, FBISE, Kohat pages | A human verifies the route in an ordinary browser |
| Sukkur, Shaheed Benazirabad    | A working official route exists                   |
| Any SMS page                   | A board publishes a shortcode on its own page     |
| Session hub date content       | A board publishes a notification                  |
| Direct integration             | A board grants written permission or an API       |
| Punjab group pages             | Real group-specific content is sourced            |

Never: name-lookup pages · position holders · certificate verification · entry-test
calculators · personal result URLs.

---

## Per-batch quality gate

Every batch passes before the next begins:

`npm run check` green (format, lint, typecheck, 58+ validation, unit, build) ·
OpenNext build + `wrangler deploy --dry-run` · publication review from rendered output ·
new routes added to `ROUTE_MODULES` · no duplicate title/H1/description/intent ·
no orphans, no broken links · similarity floor cleared · provenance on every volatile
fact · mobile check at 320–1440 · accessibility check · **no fabricated data of any kind**.

---

## Scale expectation

| Stage                   | Indexable URLs |
| ----------------------- | -------------- |
| Today                   | 3              |
| After Batch 1           | ~10            |
| After Batch 2           | ~20            |
| After Batch 3           | ~30            |
| After Batch 4           | ~55            |
| Full approved inventory | **~80–110**    |

Not thousands. Every URL traces to a real entity with verified source data, and the
limiting factor is verification effort — which is exactly the moat.

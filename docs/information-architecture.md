# Information Architecture — Final

**Phase:** 2 — Architecture (blueprint; not implemented)
**Date:** 2026-09-14
**Supersedes:** `research/information-architecture-proposal.md` (Phase 1 recommendation)

---

## 1. Where this challenges the Phase 1 proposal

Phase 2 is required to challenge the preliminary IA rather than approve it. Two
decisions changed on re-reading the evidence.

### 1.1 Board pages become YEARLESS — changed

**Preliminary:** `/results/<board>/12th-class/2026`
**Final:** `/results/<board>/12th-class`

The Phase 1 evidence that forced this: **no competitor maintains year-stamped archive
URLs.** Their year-stamped equivalents return 404 while the yearless page resolves and
carries the year in its title. The sites that bake a year into the URL — or into the
domain — have a one-season architecture.

A yearless board page is the durable asset. It carries the current session's status
prominently and past sessions as sections. Link equity accumulates on one URL instead of
resetting annually, and there is no yearly migration.

A **year-specific** board page is created only when a past session has durable unique
value (a real declared date, a gazette, verified statistics) — never by default.

### 1.2 Group becomes a data dimension before it becomes a URL — changed

Karachi declares group by group across four weeks; Hyderabad publishes per group with no
dates at all. That is a **data** fact first. Groups render as status sections on the
board page, and a group earns its own URL only when it has durable unique content.

This avoids pre-creating seven group pages per Sindh board on the strength of a keyword
pattern.

---

## 2. Final hierarchy

```
/                                       Home — navigational, does NOT own the head term
│
├── /results/12th-class                 ★ CANONICAL OWNER, head intent, evergreen
│   ├── /2026                           National session status (conditional, §4)
│   └── /<board-slug>/12th-class        ★ Board page, EVERGREEN
│       └── /<year>                     Historical session (durable value only)
│
├── /boards                             Directory — 26 public + 2 private
│   └── /<board-slug>                   Board hub (institutional) — CONDITIONAL
│
├── /gazettes/12th-class                Gazette hub — board × session × year
│   ├── /<board-slug>                   Per-board gazette listing
│   └── /archive                        Historical gazettes
│
├── /guides/
│   ├── rechecking                      ★ Tier 0 — sourced vacuum
│   │   └── /<board-slug>               Per-board, only where real figures exist
│   ├── second-annual                   (also owns "supplementary")
│   ├── improvement
│   ├── lost-roll-number                ★ Tier 0 — weakest surface in the market
│   ├── result-card-dmc
│   ├── how-percentage-is-calculated
│   └── after-12th-admissions           CONDITIONAL
│
├── /tools/percentage-calculator        ★ Tier 0 — the market is actively wrong
│
└── /updates                            CONDITIONAL, source-gated
```

Note that `/results/<board>/12th-class` sits under the result hub, not under `/boards`.
A board _result_ is a result-intent page; a board _hub_, if one ever exists, is an
institutional page. Different intents, and they must not merge.

---

## 3. Canonical intent registry

One owner per intent. This table is the contract; `lib/content/intents.ts` implements it
in Phase 3, and each page registry entry references an `intentId` so ownership becomes
machine-checkable.

| Intent ID                 | Intent                                                            | Canonical owner                        | Indexation          |
| ------------------------- | ----------------------------------------------------------------- | -------------------------------------- | ------------------- |
| `result.head`             | 12th class result · 2nd year result · HSSC Part-II · inter part 2 | `/results/12th-class`                  | index               |
| `result.session.current`  | 12th class result 2026                                            | `/results/12th-class/2026`             | index (conditional) |
| `result.board`            | `<board>` 12th class result                                       | `/results/<board>/12th-class`          | after review        |
| `result.board.session`    | `<board>` result `<past year>`                                    | `/results/<board>/12th-class/<year>`   | durable value only  |
| `result.group.sindh`      | pre-medical / pre-engineering / science general result            | section on the Sindh board page        | via parent          |
| `result.group.punjab`     | FSc / FA / ICS / ICom part 2 result                               | **unassigned**                         | conditional — §5    |
| `board.directory`         | all boards · bise list                                            | `/boards`                              | index               |
| `gazette.head`            | 12th class gazette · HSSC gazette pdf                             | `/gazettes/12th-class`                 | index               |
| `gazette.board`           | `<board>` gazette                                                 | `/gazettes/<board-slug>`               | index               |
| `gazette.archive`         | old · previous year gazette                                       | `/gazettes/12th-class/archive`         | index               |
| `post.rechecking`         | rechecking · re-evaluation · re-totalling                         | `/guides/rechecking`                   | index               |
| `post.second-annual`      | second annual · supplementary                                     | `/guides/second-annual`                | index               |
| `post.improvement`        | improvement of marks                                              | `/guides/improvement`                  | index               |
| `post.dmc`                | DMC · result card · duplicate DMC                                 | `/guides/result-card-dmc`              | index               |
| `trouble.roll-number`     | result without roll number · forgot roll number                   | `/guides/lost-roll-number`             | index               |
| `compute.percentage`      | percentage calculation · marks out of 1100                        | `/guides/how-percentage-is-calculated` | index               |
| `method.sms`              | result by SMS · `<board>` SMS code                                | **BLOCKED — no owner**                 | not built           |
| `method.name`             | result by name                                                    | **REJECTED — no owner**                | not built           |
| `result.position-holders` | position holders                                                  | **REJECTED — no source**               | not built           |

**Rule:** a page declares exactly one `intentId`, and two published pages may not declare
the same one. A validation gate enforces it — this is the machine-checkable form of the
cannibalization map.

---

## 4. Evergreen vs session ownership

| Surface                              | Owns                                                   | Must NOT own                                  | Lifecycle                  |
| ------------------------------------ | ------------------------------------------------------ | --------------------------------------------- | -------------------------- |
| `/results/12th-class`                | the yearless head term, the explanation, board routing | a specific year's status as its primary claim | permanent                  |
| `/results/12th-class/<year>`         | "12th class result `<year>`" — national session status | the yearless head term                        | archives after the session |
| `/results/<board>/12th-class`        | "`<board>` 12th class result", current status          | a year term as primary                        | permanent                  |
| `/results/<board>/12th-class/<year>` | "`<board>` result `<year>`"                            | current status                                | durable value only         |

**Differentiation requirements**, enforced by the existing uniqueness gates: distinct
primary keyword, title, H1 and description.

**Link direction:** evergreen → session (down); session → evergreen (up, via breadcrumb).
A session page cannot outrank its evergreen parent for the yearless term because it does
not target it.

**Future years:** a session page is never created before the session has real content. No
empty next-year page exists to "capture demand".

---

## 5. The Punjab group question — deferred behind an explicit gate

Phase 1 found zero URL overlap between generic and group queries, but also that Punjab
boards have **no group field** and declare every group simultaneously.

**Decision: no Punjab group pages in the approved inventory.** `result.group.punjab` has
no canonical owner.

**The gate for ever creating one:** the page must carry group-specific content the result
hub cannot — subject list, marks distribution, grading, and post-result pathways for that
qualification, verified from a scheme of studies. If it would repeat the same lookup and
the same date, it is a clone and is rejected. The decaying group pages observed on the
market leader are the evidence behind this gate.

---

## 6. Breadcrumbs

Deterministic per family. Visible and structured-data breadcrumbs must match, and only
levels that actually exist may appear.

```
Home > 12th Class Result > BISE Lahore
Home > 12th Class Result > BISE Lahore > 2025
Home > 12th Class Result > 2026
Home > Boards
Home > Gazettes > BISE Gujranwala
Home > Guides > Rechecking > BISE Sahiwal
```

There is deliberately no bare `Home > Results >` level: the hub _is_
`/results/12th-class`, and inventing a `Results` crumb would name a page that does not
exist.

---

## 7. Internal linking rules

Rules and anti-patterns live in `research/internal-link-graph.md`. Architecture-level
additions:

| From                        | To                                                         | Relationship                                |
| --------------------------- | ---------------------------------------------------------- | ------------------------------------------- |
| Result hub                  | board pages, session hub, guides                           | routing                                     |
| Board page                  | its gazette, its rechecking page, official site (outbound) | same entity                                 |
| **Gazette-only board page** | **its gazette — as the PRIMARY action**                    | access model                                |
| Session hub                 | board pages                                                | composition                                 |
| Rechecking                  | second annual                                              | the path when rechecking fails              |
| Second annual               | improvement                                                | adjacent decisions, actively confused       |
| Percentage guide            | the calculator                                             | explainer ↔ tool                            |
| **No board**                | **another board**                                          | a Lahore reader has no interest in Peshawar |

Navigation links (header, footer, directory) and contextual links (in-content) are
counted **separately**: only contextual inbound links satisfy the orphan gate, so a page
cannot be rescued from orphan status merely by appearing in the footer.

---

## 8. Indexation state model

Extends the existing three-state lifecycle to what Phase 2 requires:

| State        | Route exists | Indexable  | In sitemap |
| ------------ | ------------ | ---------- | ---------- |
| `planned`    | no           | no         | no         |
| `draft`      | yes          | no         | no         |
| `review`     | yes          | no         | no         |
| `published`  | yes          | if `index` | yes        |
| `archived`   | yes          | if `index` | yes        |
| `redirected` | 308          | n/a        | no         |
| `removed`    | 410          | no         | no         |

`review` is new — built and awaiting publication review, distinct from a draft still
being written. `archived` is new — a past session that stays valuable and indexable but
is no longer maintained on a volatile cadence, dropping from freshness class A to D.

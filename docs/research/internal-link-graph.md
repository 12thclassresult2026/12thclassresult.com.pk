# Internal Link Graph

**Phase:** 1 — Research (recommendation)
**Date:** 2026-09-14
**Derived from:** `entity-map.md`

Links should follow **real entity relationships**, not keyword similarity. A board
result page links to that board's gazette because the board publishes it — not because
both pages contain the word "gazette".

---

## 1. The governing principle

> If you cannot state the relationship as a sentence about the real world, it is not a
> link worth making.

"BISE Multan publishes its own gazette" is a relationship. "Both pages mention Multan"
is not.

---

## 2. Link rules by page family

### Evergreen result hub → …

| Target                 | Relationship                                       | Anchor style                                        |
| ---------------------- | -------------------------------------------------- | --------------------------------------------------- |
| Board directory        | the hub lists boards; the directory describes them | descriptive ("every board and its official portal") |
| Each board result page | the hub routes to the specific entity              | board name                                          |
| Current year hub       | the hub's current session                          | the year                                            |
| Method guides          | how the task is performed                          | task wording                                        |

### Board result page → …

| Target                                  | Relationship                        |
| --------------------------------------- | ----------------------------------- |
| Board hub                               | this result belongs to that board   |
| That board's gazette                    | the board publishes it              |
| That board's SMS method                 | **only if verified for that board** |
| Rechecking                              | the dispute path for this result    |
| Second annual                           | the retry path for this result      |
| Previous-year result for the same board | historical continuity               |
| The evergreen hub                       | parent intent                       |
| The board's **official site**           | outbound, `rel="noopener nofollow"` |

### Result date page → …

Board result pages · the evergreen hub · the board's own notification (outbound)

### Post-result pages → …

| From                  | To                                     | Relationship                        |
| --------------------- | -------------------------------------- | ----------------------------------- |
| DMC / result card     | rechecking, corrections, verification  | same document lifecycle             |
| Rechecking            | second annual                          | the alternative if rechecking fails |
| Second annual         | the board's second-annual result route | where that result appears           |
| Aggregate calculation | admissions, entry tests                | the number feeds the decision       |
| Admissions            | DMC, certificate, attestation          | documents required to apply         |

### Academic resources → …

Subject hub ↔ its resources (notes, past papers, pairing scheme, model papers) ·
Group hub → its subjects · Past paper → adjacent years and the paper pattern

---

## 3. Anti-patterns

These are things competitors in this market actually do.

| Anti-pattern                                       | Why it fails                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Linking every board page to every other board page | A Lahore reader has no interest in Peshawar. Dilutes signal, inflates crawl depth, helps nobody. |
| Exact-match anchor spam                            | Twenty links all reading "12th class result 2026" is a pattern, not a navigation aid.            |
| Footer link dumps of all 30 boards                 | Pushes real content down, adds no context. Use the directory page.                               |
| Linking a page that does not exist yet             | A dead internal link is worse than no link. A `planned` page must never be linked.               |
| Linking a held draft from a published page         | Leaks an unreviewed page into the crawl graph.                                                   |
| Cross-linking on keyword overlap                   | Produces relationships that are not real.                                                        |

**Structural protections already in place:** `findBrokenInternalLinks()` fails the
build on a link to a path no page owns, and the `planned`/`draft`/`published` lifecycle
means a helper physically cannot return a link to an unbuilt page.

---

## 4. Orphan rule

**Every indexable page must have at least one inbound internal link from a relevant
page**, unless it is a deliberate entry point (the homepage).

Enforced by `findOrphanPages()`; a violation fails validation. A page in the sitemap
that nothing links to is a page the site does not really believe in.

---

## 5. Link direction and hierarchy

```
                    Home
                     │
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
  Evergreen hub  Board directory  Guides
        │            │
        ▼            ▼
   Year hub  ───► Board result page ───► Board hub
                     │  │  │
                     │  │  └──► Gazette
                     │  └─────► Rechecking / Second annual
                     └────────► Official board site (outbound)
```

Links flow **down** the hierarchy for discovery and **up** via breadcrumbs for
orientation. Sideways links exist only where a genuine relationship justifies them.

---

## 6. Outbound links to official sources

These are not a leak of authority — they are the product. The site's value proposition
is routing a reader to the right official source with an accurate description of what
it will ask for.

Rules:

- `rel="noopener nofollow"` on outbound board links.
- Link only sources whose ownership is **verified**.
- Never link a source observed to 404 — a board publishing a dead link on its own site
  is a real, observed case.
- Never present a lookalike domain as official, however plausible it looks.
- Describe accurately what the reader will encounter (extra identifier, security
  check) — only where verified.

---

## 7. Current state

The built graph is deliberately small and fully connected:

```
/ (entry point)
├─► /results/12th-class
└─► /boards

/results/12th-class ─► /boards, /
/boards             ─► /results/12th-class
```

Zero orphans, zero broken links, verified by tests. The ten registered boards are
`planned` and are therefore **correctly not linked** — a link to an unbuilt page is the
exact failure this lifecycle prevents.

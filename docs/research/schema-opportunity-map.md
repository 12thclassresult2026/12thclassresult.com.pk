# Structured Data Opportunity Map

**Phase:** 1 — Research (recommendation)
**Date:** 2026-09-14

Schema is a factual claim made to machines. It is held to exactly the same evidence
standard as a sentence shown to a reader.

---

## 1. Schema by page type

| Page family              | Recommended types                              | Notes                                                             |
| ------------------------ | ---------------------------------------------- | ----------------------------------------------------------------- |
| Site-wide                | `Organization`, `WebSite`                      | One `@graph`, emitted once in the root layout                     |
| Every page               | `WebPage`, `BreadcrumbList`                    | Breadcrumbs must match the real hierarchy, not an invented one    |
| Evergreen result hub     | `WebPage` + `BreadcrumbList`                   | Add `FAQPage` only if real questions are answered in visible copy |
| Board result page        | `WebPage` + `BreadcrumbList`                   | The board is described and linked, never impersonated             |
| Result date page         | `WebPage`                                      | **No `Event`** — see §3                                           |
| Guides / explainers      | `Article`                                      | Only with a real publication and modification date                |
| Gazette listing          | `WebPage`, possibly `DigitalDocument` per file | Only for a document we are entitled to reference, with provenance |
| Calculators / tools      | `WebApplication` or `SoftwareApplication`      | Only for a tool that genuinely performs the task in-page          |
| Board directory          | `ItemList`                                     | Members are real registered boards                                |
| Search results / filters | **none**                                       | These should be noindex anyway                                    |
| Personal result response | **none, ever**                                 | Not indexable, not in the sitemap, no markup                      |

---

## 2. What is deliberately NOT built

There is **no builder** in this codebase for any of the following, and a unit test
asserts the serialized output contains none of them:

- `AggregateRating` · `ratingValue` · `reviewCount`
- `Review`
- `award`
- student counts, result counts, pass percentages presented as site data
- author credentials that do not exist

This is not caution for its own sake. Every one of these is a claim this site has no
honest value to supply, and each is a common way result sites manufacture credibility.

### `SearchAction` is also absent

`WebSite` carries no `potentialAction`. That markup advertises a site-search endpoint
to search engines; this site performs no such search, and pointing it at a URL that
does not exist is a claim we cannot honour.

---

## 3. Three judgement calls worth recording

### `Event` for a result announcement — REJECTED

Tempting, and wrong. `Event` implies a scheduled occurrence with a known time. The
current evidence is that **no board has announced an HSSC Part-II 2026 date at all**.
Marking up an unconfirmed date as an `Event` would assert to machines exactly the
confidence the visible page is careful to avoid — and answer engines would repeat it.

**Revisit only when** a board publishes a confirmed date with a time, and even then the
markup must not outlive the source.

### `Dataset` for gazettes or statistics — CONDITIONAL

Legitimate only where a real, publicly presented dataset exists with a stated licence
and provenance. Linking to a board's gazette page is not publishing a dataset. If
result statistics are ever archived as structured, sourced data, `Dataset` becomes
genuinely appropriate — that is a Tier-1 whitespace opportunity, and the schema follows
the substance rather than leading it.

### `FAQPage` — CONDITIONAL, and never the reason to write questions

Only where questions are genuinely asked by readers and answered in visible page copy.
Never generate questions to obtain the markup. Rich-result treatment for FAQ has been
unreliable; the reason to write a good answer is the reader, and the markup is
incidental.

---

## 4. Safety requirements

1. **Escaping.** All JSON-LD is serialized through one function that escapes `<` to
   `<`, so a board name or quoted notice containing `</script>` cannot close the
   element early. Covered by a test.
2. **One `@graph`.** Nodes are combined into a single script rather than scattered, so
   `@id` references resolve and duplicates cannot drift apart.
3. **Markup must match visible content.** If a fact is not on the page, it is not in
   the schema. If a fact is qualified on the page as tentative, it must not appear
   unqualified in markup.
4. **Never mark up this site as a board.** `Organization` describes this site, which is
   an independent information service. Boards are described in content and linked to
   their own sites.

---

## 5. Provenance as a first-class surface

The strongest AEO opportunity here is not markup at all — it is that **no competitor
shows where a fact came from or when it was last checked.**

Recommended visible pattern per volatile fact:

> **Status** (Official / Tentative / Expected / Not announced)
> **Source** — link to the board's own page
> **Last checked** — a real date

This is human-readable, machine-parsable, and cannot be faked without doing the work.
Where markup can carry it honestly (`dateModified`, `citation`, `isBasedOn`), it
should — but the visible module is the primary artefact.

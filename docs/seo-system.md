# SEO System Architecture

**Phase:** 2 — Architecture
**Date:** 2026-09-14
**Implemented:** `lib/seo/*`, `lib/schema/json-ld.ts`, `app/robots.ts`, `app/sitemap.xml`, `app/sitemaps/[segment]`

SEO here is architecture, not per-page effort. A route cannot opt out of the canonical
system, and cannot hand-write metadata.

---

## 1. Canonical architecture

`SITE_ORIGIN` is defined once. `canonicalUrl()` always builds on it, so a preview
deployment **cannot self-canonicalise**.

`normalizePath()` is the single duplicate-URL defence — leading slash, no trailing slash,
lowercase, no duplicate slashes, query and hash stripped, full URLs reduced to pathname.
Every canonical, sitemap entry and internal link passes through it.

| Rule                       | Value                                                         |
| -------------------------- | ------------------------------------------------------------- |
| Canonical origin           | apex, `https://12thclassresult.com.pk`                        |
| `www`                      | 308 → apex, via **two** rules (`/` and `/:path+`)             |
| Self-referential canonical | on every indexable page                                       |
| 404                        | **no canonical** — it has no address of its own               |
| Preview hosts              | `X-Robots-Tag: noindex, nofollow` via the `missing` host rule |

The two-rule `www` redirect exists because `/:path*` matches the bare root with an empty
capture and emits a literal placeholder in `Location` — a correct 308 to a 404, which a
status-only check calls green. The smoke test asserts the redirect **target**.

---

## 2. Metadata system

Routes call `metadataForPage(entry)`; only the 404 calls `buildMetadata` directly.
Indexability is **re-derived** as `index && status === 'published'`, so a draft cannot
become indexable through one mistaken field.

| Rule         | Detail                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Title cap    | 60 characters target                                                                                                                |
| Brand suffix | appended **only if it still fits** — a title choosing between naming the board and naming the site names the board                  |
| Noindex      | `index: false`, **`follow: true`**, `nocache: true` — never `nofollow`, because a held page still links the board's official portal |
| OG           | type, url (= canonical), siteName, title, description, locale                                                                       |
| Twitter      | `summary_large_image` when an image exists, else `summary`                                                                          |
| OG image     | **omitted** until a real branded asset exists — a 404 in OG metadata is worse than no tag                                           |

### Title patterns (templates, not rigid strings)

| Family      | Pattern                                                |
| ----------- | ------------------------------------------------------ |
| Result hub  | `12th Class Result — HSSC Part-II Result by Board`     |
| Board page  | `{Board} 12th Class Result — Official Portal & Status` |
| Session hub | `12th Class Result {Year} — Board-by-Board Status`     |
| Gazette     | `{Board} 12th Class Gazette — Part-II`                 |
| Rechecking  | `{Board} Rechecking Fee & Deadline — HSSC Part-II`     |

Year appears in **titles**, not in board URLs — matching the observed pattern where
yearless URLs survive and year-stamped ones 404.

**Descriptions are never templated across boards.** Nine boards sharing one description
template produces nine near-identical descriptions, which the uniqueness gate rejects.
Each leads with that board's own distinguishing fact.

---

## 3. Sitemap architecture

`/sitemap.xml` is an **index**; `/sitemaps/<segment>.xml` are the urlsets. Eleven
segments are typed; only **populated** segments appear, and an unpopulated segment 404s
rather than serving an empty urlset.

Included: canonical, published, indexable, 200-status URLs only.
Excluded: API routes, the lookup endpoint, drafts, planned pages, noindex pages,
redirects, 404s, internal search, parameter variants, preview hosts.

`lastmod` comes from each entry's `contentUpdatedAt`, **never build time** — so a rebuild
does not falsely claim every URL just changed.

`MAX_URLS_PER_SITEMAP = 50_000` with an `oversizedSegments()` gate. At ~100 URLs this is
headroom, not a live constraint — but the segmentation means growth needs no
restructuring.

---

## 4. Robots

Allow `/`. Disallow `/api/` and `/search`. Reference the production sitemap.

**Deliberately not blocked:** pages that must be seen as `noindex`. A blocked page can
never have its noindex read, which is the reliable way to keep an unwanted page in the
index. CSS and JS are not blocked either — a crawler that cannot render cannot judge.

Robots is never used as a security mechanism; private endpoints are protected by
application controls.

---

## 5. Structured data

Builders exist **only** for types whose claims are visible on the page:
`Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `ItemList`, `Article` (guides),
`FAQPage` (only where real questions are answered in visible copy).

**No builder exists** for `AggregateRating`, `Review`, `award`, pass percentages or
student counts — and a unit test asserts the serialized output contains none of them.

Three recorded judgements:

| Type                              | Decision                                                                                                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Event` for a result announcement | **Rejected.** It implies a scheduled occurrence with a known time; no board has announced a 2026 Part-II date. Marking an unconfirmed date as an Event asserts to machines exactly the confidence the page avoids |
| `Dataset`                         | **Conditional.** Only if result statistics are ever archived as real structured data with provenance                                                                                                              |
| `SearchAction`                    | **Absent.** It advertises a search endpoint this site does not perform                                                                                                                                            |

All JSON-LD serializes through one function that escapes `<`, so a board name or quoted
notice containing a closing script tag cannot break out. One `@graph` per page.

---

## 6. AEO / GEO architecture

Translating the research into reusable components rather than prose habits:

| Component          | Purpose                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| `StatusSentence`   | The extractable unit — one self-contained sentence with board, exam, session, status, date, time, timezone |
| `EntityDefinition` | One crisp sentence defining gazette, DMC, second annual, rechecking, where the question is asked           |
| `ProvenanceBlock`  | Source name, link, checked date                                                                            |
| `FactTable`        | The scannable counterpart to the sentence                                                                  |
| `UpdateHistory`    | A short changelog when a volatile fact changes                                                             |

**The format rule from the research:** no engine surfaced a table as the answer unit.
Tables aid containment; **sentences get quoted**. So every volatile fact exists twice —
as a sentence near the top of its section, and in the maintained table.

**Entity qualification is mandatory** in the passage itself: "HSSC Part-II (12th class),
`<Board>`, Pakistan". The head term is contested by another country's board content, and
an unqualified passage gets mis-clustered.

No artificial FAQ blocks. No schema gimmicks. Being correct, dated and linked is what
makes a passage citable.

---

## 7. Duplicate prevention — the gate stack

| Gate                                | Enforces                                                |
| ----------------------------------- | ------------------------------------------------------- |
| `normalizePath`                     | One URL shape                                           |
| Route collision check               | No two entries on one path                              |
| Title / H1 / description uniqueness | Across the **whole** inventory, including planned       |
| `intentId` uniqueness               | One canonical owner per intent                          |
| Query-variant check                 | A page never lists its own primary keyword as a variant |
| Homepage guard                      | The homepage never owns a head result term              |
| Orphan check                        | Every indexable page has a contextual inbound link      |
| Broken-link check                   | No internal link to an unowned path                     |
| Sitemap composition                 | Only published + indexable                              |

These already run in `tests/validation/`; Phase 3 adds the `intentId` and contextual-link
gates.

---

## 8. Internal links and breadcrumbs

Links follow real entity relationships, never keyword similarity — rules in
`information-architecture.md` §7 and `research/internal-link-graph.md`.

Breadcrumbs are deterministic per family, and visible and structured-data breadcrumbs
must match. Breadcrumb paths are validated to start at `/` and end at the page itself.

---

## 9. What the architecture deliberately refuses

- Year-stamped board URLs that must be migrated annually
- Synonym pages for one intent
- Pre-published future-year pages
- Indexable search or filter permutations
- Any URL containing a roll number
- Schema asserting more confidence than the visible page
- Auto-updated "last updated" stamps

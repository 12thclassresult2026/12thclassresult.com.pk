# Competitor Audit — 12th Class / HSSC Part-II

**Research date:** 2026-09-14
**Purpose:** understand market _coverage and structure_ in order to build something
better and original. Structure is described; **no competitor wording, markup, CSS or
imagery is reproduced anywhere in this project.**

> **Every factual claim observed on a competitor — result dates, SMS codes, passing
> criteria, fees — is recorded here as an UNVERIFIED COMPETITOR CLAIM and is not used
> as evidence of anything.** Competitors are a discovery tool for _topics_, never an
> authority for _facts_ (section 28).

---

## Method and confidence

| Confidence                    | Basis                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **HIGH**                      | Page was fetched and rendered; structure read directly.                                                                         |
| **PARTIAL — listing-derived** | Host refused automated requests (HTTP 403). Structure reconstructed from public search listings — URL patterns and titles only. |

Refused automated requests: `results.hamariweb.com`, `freeilm.pk`, `bisepunjab.com`,
`checkresult.pk`, `resultpedia.com.pk`, and several clone domains.

**A caution carried over from the sibling project's methodology, and it applies
here:** a record that is partly listing-derived must never be presented as though it
were observed. Where a field below could not be seen, it says so rather than being
filled with a plausible value. Structured confidence that contradicts its own prose is
the specific failure this note exists to prevent.

---

## 1. 12thclassresult2026.com.pk — HIGH

A single-purpose landing page with a thin blog attached.

```
Home
├── Date Sheets (category)
├── News (category)
├── Pairing Schemes (category)
├── Punjab ▾ (9 boards)
├── KPK ▾ (8 boards)
├── Sindh ▾ (5 boards; two marked "Soon")
├── Position Holders
└── About ▾ (Contact / Disclaimer / Privacy / Terms)
```

**Result UX:** board dropdown (22 options) + roll number + student name. Presents four
methods (roll number / name / SMS / gazette). **It is not a real checker** — it
resolves to an "open the official board website" handoff.

**Modules:** countdown, checker, SMS explainer, date/time table, four methods with
screenshots, SMS code table, gazette instructions, board profiles, subjects by group,
passing criteria, grade conversion, career table, three-question FAQ.

**Weaknesses:**

- **No template discipline in URLs.** Board slugs vary wildly across four different
  shapes, and one board occupies the site's generic result path.
- **Self-contradicting data:** prints one SMS code for Lahore while a note beside it
  states a different code is the correct one _(UNVERIFIED COMPETITOR CLAIM)_.
- Incomplete regional coverage shipped as "Soon" placeholders.
- No official notification cited anywhere.

---

## 2. ulearnlms.com — HIGH (weakest of the mandatory set)

An LMS/course platform with a results section bolted on; the navigation is course
navigation, not result navigation. 27 board pages under `/results/`.

**Result UX:** none. Outbound links and prose only.

**Weaknesses (severe):**

- **Stale and mutually contradictory dates** — two different announcement dates
  appear on the same page, both from a previous cycle _(UNVERIFIED COMPETITOR CLAIM)_.
- "How to check" section is placeholder filler.
- A board slug is misspelled in a live URL.
- No date sheets, gazettes, past papers, roll number slips or pairing schemes.

---

## 3. results.hamariweb.com — PARTIAL (listing-derived)

The page could not be rendered. From public listings, this is the **deepest
programmatic matrix** in the mandatory set — board × class × artifact:

```
/12th-class-results/                       class hub
/intermediate-results.aspx                 qualification hub
/bise-<board>/                             board hub
/bise-<board>-inter/hssc-part-2-result/
/bise-<board>-inter/hssc-part-2-date-sheet/
/pastpapers/<board>/<class>/
/pdf/<boardcode>-part-2.pdf                self-hosted gazette PDFs
```

Two things most rivals lack: **self-hosted gazette PDFs** and **per-board date-sheet
pages**. Result UX was not observed and nothing is claimed about it.

---

## 4. taleem360.com — HIGH

Not a result site: a **document library with user uploads**. Its 12th-class-results
category is a gazette PDF archive, paginated, mixing several years with no year
filter.

Its taxonomy is the broadest in the market and is a useful **information-architecture
reference** — it indexes by _artifact type × class × province_, which is exactly why
it cannot serve board-specific result intent:

```
Textbooks (by province × class) · Notes · Helping Books · Pairing Schemes ·
Test Papers (chapterwise / full / half) · MCQs · Guess Papers · Model Papers ·
Past Papers · Results & Gazettes · Date Sheets · Syllabus · AIOU ·
Entry Tests (MDCAT / ECAT / ETEA / NUMS / LAT / ISSB) ·
Professional (CA / CSS / NTS / FPSC / PPSC) · International (O/A-Level, IGCSE)
```

**Weaknesses:** no result-checking utility by design; no year filter on the gazette
archive; the Date Sheets category holds a handful of items spanning six years; no
roll-number-slip category at all; model papers exist for one class only.

---

## 5. Secondary set — all live, none dead

| Domain                 | Shape                                 | Notable                                                                                                                                     | Weakness                                                                                                               |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `12classresult2026.pk` | Landing + news                        | Roll number + board checker                                                                                                                 | Board dropdown covers three boards                                                                                     |
| `2ndyearresult.com.pk` | Punjab-only                           | Gazette + position holders in nav                                                                                                           | No coverage beyond Punjab                                                                                              |
| `2ndyearresult2026.pk` | Best URL hierarchy of the small sites | A genuinely deep **supplementary** section (eligibility, fee windows, absentees, practicals, single-subject failure)                        | No last-updated stamp; hedging language throughout signals the author cannot verify their own dates                    |
| `punjabresults.pk`     | **Best result UX observed anywhere**  | Uniquely adds a **session/year dimension**: annual vs supplementary across three years. Grading table includes fail / absent / **withheld** | Punjab + Federal only; thresholds and deadlines unsourced                                                              |
| `result.pk`            | Largest network; per-board subdomains | Gazette archive by year, and a **result-date history table going back over a decade** — the most useful evergreen asset found anywhere      | "Updated" auto-stamps to today on every page — manufactured freshness. Two URLs serve the same intent and self-compete |

---

## 6. The one IA lesson worth taking

**The two-axis matrix `{board} × {artifact}` is the correct scalable shape** — the
market converges on it independently, and it maps cleanly onto real entities.

**What to reject is the execution, not the shape:**

1. Multiple slug shapes for one page template (crawl-hostile, impossible to maintain).
2. A year hard-coded into the domain name itself, which strands the site annually.
3. One identical timestamp asserted across different boards' pages.
4. A generic path occupied by one specific board.
5. Synonym URLs that compete with each other for one intent.

Each of these is a page-level decision we make differently, and several are enforced
by validation gates rather than left to discipline.

---

## 7. Volatile claims seen — DO NOT TRUST OR REUSE

Recorded solely so that if any of these ever appears in our content, it is
identifiable as having come from an aggregator rather than a board.

| Claim type                     | Values seen across competitors | Status                                                                      |
| ------------------------------ | ------------------------------ | --------------------------------------------------------------------------- |
| HSSC Part-II 2026 result date  | 13, 18 and 23 September 2026   | **All unverified.** Mutually inconsistent; none cites a board notification. |
| FBISE result date              | 9 September 2026               | **Unverified.**                                                             |
| Lahore SMS shortcode           | 80029, 800291, 80092, 8583     | **All unverified.** Mutually contradictory.                                 |
| Other SMS shortcodes           | 5050, 800293, 800290, 8002     | **All unverified.** None found on a board domain.                           |
| Passing criteria / grade bands | Several variants               | **Unverified.** Not carried.                                                |

Our own live check of the boards' own sites on the same date found **no** HSSC
Part-II 2026 announcement at all — see `board-capability-matrix.md`.

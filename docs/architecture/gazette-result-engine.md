# Gazette Result Engine

**Phase:** 9.5 · **Date:** 2026-09-14 · **Status:** researched and specified; ingestion not built

The architectural correction this phase makes: instead of routing every reader to a board's
portal, ingest the gazettes boards already publish, and serve exact roll-number lookups from a
validated local dataset.

**Why this changes the product's position fundamentally:** it needs no board permission. A
gazette is a published document whose entire purpose is to be the public record of a result.
Reading one is not the same activity as querying a portal that has not consented to automation —
which is why `BOARD_ADAPTERS` is empty and will stay empty (ADR-012), while this path is open.

---

## 1. The premise, checked

Phase 9.5 opens by correcting a Punjab-only assumption. **This codebase does not have one.**

| Region             | Boards |
| ------------------ | -----: |
| Punjab             |      9 |
| Sindh              |      8 |
| Khyber Pakhtunkhwa |      8 |
| Balochistan        |      1 |
| Federal            |      1 |
| Azad Jammu Kashmir |      1 |
| **Total**          | **28** |

`Province` is a typed union covering all six plus Gilgit-Baltistan, and no province is
hard-coded anywhere in the registry, routes, result service or SEO layer. Phase 1 established
that Balochistan has one board rather than three, and that Gilgit-Baltistan has none.

The correction to make is not "go national" — it is "go from routing to data".

---

## 2. What a real gazette actually contains

Measured against **BISE Gujranwala, HSSC Part-II, First Annual 2025**, fetched 2026-09-14.

```
https://bisegrw.edu.pk/download/GAZETTE/Gz_IA2p25.pdf
HTTP 200 · application/pdf · 14,469,020 bytes (13.8 MB)
Last-Modified: Thu, 18 Sep 2025 · 5,920 pages
```

Gujranwala publishes HSSC Part-II gazettes annually **back to 2012** — fourteen sessions, all
directly downloadable.

### The file identifies itself

Page 1 prints:

> BOARD OF INTERMEDIATE AND SECONDARY EDUCATION GUJRANWALA
> HSSC FIRST ANNUAL PART-II EXAMINATION, 2025

That matters for the §8 legitimacy gate: the document corroborates its own registry entry, so
the binding between file and dataset does not rest solely on the URL it came from. Where a
gazette is **not** self-identifying, that weaker binding is recorded on the source
(`selfIdentifying: false`).

### It has two distinct sections

| Section                | Pages (approx.) | Content                                                   |
| ---------------------- | --------------- | --------------------------------------------------------- |
| Institution statistics | ~1–200          | `Code │ Institute Name │ Group │ Appear │ Pass │ %age`    |
| Candidate records      | ~200–5,920      | Individual roll numbers, names, marks, status annotations |

A parser that assumes the whole document is candidate records will ingest institution rows as
candidates. The section boundary must be detected, not assumed.

### THE CRITICAL HAZARD: the candidate section is two-column

Records run in **two columns per page**, side by side. Extracted with layout preservation, a
single text line contains fragments of **two different candidates**.

Measuring where the second record's roll number begins, across a six-page sample:

```
second-token column:  min 45  ·  median 111  ·  max 122
histogram:  40:1  50:10  60:5  80:9  110:25  120:14
```

**The boundary moves**, because names vary in length. So:

> A fixed column split is unsafe, and a naive line-based parse will attach one candidate's
> marks to another candidate's roll number.

That is precisely the P0 failure in §101. The correct approach is to split on **true page
geometry** — word bounding boxes from `pdftotext -bbox` or equivalent — rather than on column
positions in reflowed text. A parser that cannot establish which physical column a token came
from must reject the page rather than guess.

---

## 3. Scale, and why D1 alone does not hold this

Anchored on the measured Gujranwala file: ~5,720 candidate pages at ~20 candidates per page is
**~114,000 candidates** for one board, one year, one session.

Extrapolated across 28 boards with a weighted size mix, and both annual sessions:

| Horizon  | Records | Summary only (~220 B) | With subject detail (~900 B) |
| -------- | ------: | --------------------: | ---------------------------: |
| 1 year   |      3M |                0.6 GB |                       2.3 GB |
| 3 years  |      8M |                1.7 GB |                       6.8 GB |
| 5 years  |     13M |                2.8 GB |                  **11.4 GB** |
| 10 years |     25M |                5.6 GB |                  **22.7 GB** |

**Cloudflare D1's limit is 10 GB per database.** With subject-level detail, a single D1 is
exceeded before the five-year horizon and is more than doubled at ten. Choosing D1 because it is
the Cloudflare-native answer would build in a migration.

### The decisive observation

**The primary query is a single exact key.** `board:year:examination:rollNumber` — no ranges, no
joins, no full-text search, no sorting. That access pattern does not need a relational database.

### Recommended architecture

| Layer                            | Holds                                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **R2** — immutable originals     | The gazette files themselves, by checksum. Never mutated.                                                          |
| **R2** — sharded immutable index | Normalized records, sharded by `board:year:exam` and then by roll-number prefix. A lookup reads exactly one shard. |
| **D1 or KV** — dataset metadata  | Registry, lifecycle status, active-version pointers, parse reports. Small, relational, queried by operators.       |
| **KV / cache**                   | Board coverage status, active dataset pointers. Non-personal only.                                                 |

This scales without a database limit, keeps each read to one object, makes a dataset version
atomically swappable by moving a pointer, and keeps personal records out of anything that could
be queried in bulk.

**This is a recommendation with evidence, not a decision taken.** It needs a latency benchmark
against a real shard before it is committed to an ADR.

---

## 4. Isolation — the part that is built

`lib/gazettes/identity.ts` and its 28 tests exist for one failure: showing one candidate's marks
under another candidate's roll number.

| Guarantee                          | How                                                                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Roll number is never an identifier | Every lookup takes the full four-part key; there is no by-roll API                                                                     |
| Matching is exact                  | No fuzzy distance function exists, and none may be added                                                                               |
| Leading zeros preserved            | `012345` ≠ `12345` — a board may issue both                                                                                            |
| No padding, no correction          | Guessing a digit means naming a different person                                                                                       |
| Separators preserved               | `12-3456` ≠ `123456`                                                                                                                   |
| Isolation re-checked on output     | `assertBelongsToDataset` **throws** rather than return a mismatch                                                                      |
| Duplicates surfaced                | Never silently de-duplicated — a duplicate means a parser bug, a source duplication or a correction, and those have different remedies |

Throwing is deliberate. A thrown error degrades to the fallback ladder and raises an incident; a
returned mismatch is read by a student as their own result.

---

## 5. Dataset lifecycle

```
unverified → parsed → validation-failed
                   ↘ qa-required → validated → active → disabled
                                                     ↘ archived
```

**Only `active` is searchable.** `validated` is deliberately not — passing QA and being
activated are separate decisions, so no dataset goes live as a side effect of a successful
parse.

Archived versions are never deleted. When a board reissues a corrected gazette it becomes `v2`,
is parsed and validated independently, and the active pointer moves only after its own QA.

---

## 6. What is built, and what is not

### Built

- The national board registry (pre-existing, 28 boards, 6 regions)
- `lib/gazettes/types.ts` — source files, records, subjects, parse reports, lifecycle, coverage
- `lib/gazettes/identity.ts` — composite keys, exact matching, isolation assertions, duplicates
- 28 isolation and exact-match tests

### Not built, and honestly so

- **The parser.** Designing it required knowing the format; that research is now done and the
  two-column hazard is specified. Building it against real page geometry is the next body of
  work.
- **Ingestion, storage and indexing.** Blocked behind the storage benchmark above.
- **The result service switch.** The service still routes to official sources, which remains
  correct until a dataset is genuinely active.
- **Any activated dataset.** None exists. No gazette has been parsed into servable records.

No page claims gazette lookup is available, because it is not.

---

## 7. Privacy, which gets stricter under this architecture

Holding candidate records raises the stakes rather than lowering them. The controls that must be
in place _before_ any dataset is activated:

- **No student-level URLs.** There is no `/[board]/result/[roll]` route and there will not be
  one. Millions of candidate pages is a student directory, not SEO.
- **Personal responses are `noindex`, `no-store`, never in a sitemap, never internally linked.**
  Already enforced at the edge and verified in the Phase 7 crawl.
- **No bulk export.** No endpoint returns more than one record, and rate limiting plus exact-key
  lookup makes enumeration expensive.
- **No name search** until board practice, ambiguity and enumeration risk are assessed
  separately. Names existing in the data is not a reason to expose a name index.
- **No personal data in logs or analytics** — unchanged from the existing privacy architecture.
- **Nothing is called an official DMC.** A gazette record is a gazette record.

### On the repository

The gazette examined for this document was downloaded to a scratch directory outside the
repository, read for structure, and deleted. **No real candidate record is committed to this
repo**, and parser fixtures must be synthetic or anonymised (§88).

---

## 8. Next steps, in order

1. **Benchmark a shard.** Build one board-year index in R2, measure p50/p95/p99 for an exact-key
   read. This converts §3's recommendation into an ADR.
2. **Build the parser against page geometry**, not reflowed text. Detect the section boundary;
   reject pages whose column assignment is ambiguous.
3. **Parse Gujranwala 2025 end to end** as Batch 0 — it is self-identifying, text-based, and has
   fourteen years of consistent siblings to regression-test against.
4. **Sample QA against the source PDF** before any activation, including page boundaries, the
   first and last records, and unusual statuses.
5. **Then** widen — and not Punjab-first. Quetta, Karachi and AJK gazettes should be in the
   early batches so the format assumptions are tested nationally rather than provincially.

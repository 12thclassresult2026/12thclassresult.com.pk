# ADR: Gazette dataset storage

**Status:** Accepted
**Date:** 2026-09-15
**Supersedes:** the storage deferral recorded in ADR-007
**Evidence:** `gazette-private/run-2/storage-benchmark.json`, produced by
`scripts/gazette/storage-benchmark.ts` from a real 138,617-record dataset

---

## The decision

**Cloudflare D1, one database per `board + year`.**

Bulk data stays in D1. R2 is not used for the lookup path.

---

## What changed, and why this was reopened

Storage was deferred because a standing estimate put five years of nationwide
data at roughly **11.4 GB**, above D1's 10 GB per-database ceiling. That number
predates any gazette actually being parsed — it was a guess, and it was the only
thing blocking the decision.

There is now a real dataset: BISE Gujranwala, HSSC Part-II First Annual 2025,
138,617 records parsed from the board's own 5,920-page gazette. The question is
answerable in bytes.

**The estimate was high by about 2.4x.** Five years nationwide measures at
**4.66 GB**, not 11.4 GB.

---

## What was measured

All figures from 138,617 real records. D1 is SQLite and `node:sqlite` is SQLite,
so the D1 rows below are the real engine on the real data, not a model of it.

| Option                                | Bytes/record | This dataset | Lookup p50 | p95     | p99       |
| ------------------------------------- | ------------ | ------------ | ---------- | ------- | --------- |
| **A. D1, single table, composite PK** | **160**      | 22.2 MB      | 0.017ms    | 0.025ms | 0.112ms   |
| B. D1 partitioned by board+year       | 160          | 22.2 MB/part | same as A  | same    | same      |
| C. R2 gzipped shards + prefix index   | **13.9**     | 1.93 MB      | 0.372ms\*  | 0.646ms | 1.379ms\* |
| D. D1 with audit columns split out    | 206.5        | 28.6 MB      | 0.017ms    | 0.023ms | 0.033ms   |

\* Local decompress-and-find only. **Excludes R2 network time**, which cannot be
measured from here and would dominate the figure.

Import: 0.3s for 138,617 rows. Parse: 14.6s for the whole 5,920-page PDF.

### Projection to national scale

**This is a bracket, not a forecast.** One board-year has been parsed. The rows
below assume 28 boards of Gujranwala's size and 1.5 examinations per year (a
first annual plus a smaller supplementary). Real board sizes vary a lot — Lahore
is larger, Quetta smaller — so treat these as good enough to choose an
architecture with and not good enough to plan capacity with.

| Horizon  | Records | D1 bytes    | R2 gzipped | Single D1 under 10 GB? |
| -------- | ------- | ----------- | ---------- | ---------------------- |
| 1 year   | 5.8 M   | **931 MB**  | 81 MB      | Yes                    |
| 3 years  | 17.5 M  | 2.79 GB     | 243 MB     | Yes                    |
| 5 years  | 29.1 M  | **4.66 GB** | 405 MB     | Yes                    |
| 10 years | 58.2 M  | **9.32 GB** | 809 MB     | Yes — at 93% of it     |

---

## Why D1, partitioned

**A single D1 database is not chosen**, even though ten years fits. 9.32 GB of a
10 GB ceiling is 93% full on an assumption-based projection. If boards average
larger than Gujranwala — and Lahore alone plausibly does — a single database hits
the wall mid-year, on the one day of the year when it must not.

**Partitioning by board+year** gives:

- ~33 MB per partition at this dataset's size, against a 10 GB ceiling. Three
  orders of magnitude of headroom, so the projection being wrong does not matter.
- 280 databases for ten years nationwide, against a limit of **50,000**.
- Dataset isolation that matches the correctness rule already in force: a lookup
  is exact on `board:year:examination:rollNumber`, and a partition boundary makes
  a cross-board or cross-year leak a missing-database error rather than a wrong
  row. The storage layout enforces what the query was already promising.
- Per-board, per-year activation, rollback and re-import without touching any
  other board's data — which is what the dataset lifecycle already requires.

**Why not R2** (option C), despite being 11x smaller: every lookup becomes a
network fetch plus a decompress. The local half alone is 20x the D1 query, and
the network half — unmeasured, but the dominant term — is paid on every single
result check. D1 answers in 17 microseconds at p50. On result day, when a board's
whole cohort arrives at once, that difference is the product. R2 stays the right
place for the original gazette PDFs, which are bulk, cold, and never on the
lookup path.

**Why not split the audit columns out** (option D): it was tried and it is
_worse_. Moving `rawResultStatus` and the page reference into a side table cost
206.5 bytes/record against 160 — the duplicated four-column composite key in the
second table outweighs the text it removes. The audit trail stays inline, where
it is also easier to keep honest.

### Schema notes

`PRIMARY KEY (board_id, year, examination, roll_number)` with `WITHOUT ROWID`.

The composite identity **is** the primary key rather than a secondary index.
That is deliberate: it makes a lookup on roll number alone impossible to express
by accident, which is the cross-board leak this design exists to prevent.

---

## What this does not decide

- **Whether a board's data may be published at all.** That is the dataset
  lifecycle's decision, not storage's.
- **Per-record retention.** Not addressed here.
- **Result-day concurrency limits.** D1 query latency is measured; the Worker's
  concurrency envelope under real result-day load is not, and must be tested
  before a second board is activated.

## How to re-run this

```
npx tsx scripts/gazette/storage-benchmark.ts <runDir>
```

Re-run it when a materially different board is parsed — particularly a larger
one — and update the projection table above with the new bracket.

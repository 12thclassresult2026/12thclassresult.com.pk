# National Result Coverage

**Cycle:** 2026 · **Date:** 2026-09-14 · **Generated from** `lib/board/registry.ts` and the source registry.

The operational question this answers: for each board, can a student get their result **here**,
or do we send them to the board?

---

## Today: nobody gets a result here

| Coverage status         | Boards | Meaning                                          |
| ----------------------- | -----: | ------------------------------------------------ |
| `gazette-lookup-active` |  **0** | No gazette has been parsed into servable records |
| `source-pending`        |      6 | A gazette source is identified; nothing ingested |
| `fallback-only`         |     22 | Routed to the board's own portal or gazette page |

That is the truthful state, and every board page reflects it. No page claims a lookup that does
not exist.

Full per-board detail: `docs/research/national-board-capability-matrix.csv`.

---

## The six boards with an identified gazette source

| Region      | Board           | Gazette source                                | Note                                                                                                        |
| ----------- | --------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Punjab      | BISE Gujranwala | `bisegrw.edu.pk/result-gazatte.html`          | **Best candidate.** HSSC Part-II PDFs back to 2012, self-identifying, text-based                            |
| Punjab      | BISE Multan     | `web.bisemultan.edu.pk/result-gazette-inter/` | Inter-specific gazette index                                                                                |
| Punjab      | BISE Sahiwal    | `bisesahiwal.edu.pk/result-stats-gazzet.php`  | **Caution:** research recorded this as a statistics sheet, not a candidate gazette. Verify before ingesting |
| Sindh       | BIEK Karachi    | `biek.edu.pk/results.asp`                     | Gazette is the board's ONLY route — highest reader value                                                    |
| Balochistan | BBISE Quetta    | `bbise.edu.pk/Notifications`                  | The only board with a confirmed 2026 result date                                                            |
| AJK         | AJKBISE         | `ajkbise.net/results.php`                     | Gazette is the verified route; the online form is blocked                                                   |

Regional spread matters here: these six span Punjab, Sindh, Balochistan and AJK, so an early
ingestion batch can test format assumptions **nationally** rather than proving a Punjab-shaped
parser and discovering the rest differ.

---

## Where a gazette would change the most for readers

Ranked by what a student gains, not by how easy the file is:

1. **Karachi (BIEK)** — gazette-only. There is no roll-number checker at this board at all, so
   a local lookup would be the only way to search by roll number rather than reading a PDF.
   Also per-group, declared across four weeks.
2. **AJK** — the online form is blocked; the gazette is the verified route.
3. **Quetta** — the only confirmed 2026 declaration; a completed session to validate against.
4. **Gujranwala** — a portal exists, but fourteen consistent years make it the best **technical**
   proving ground.

The tension is deliberate: the easiest file to parse (Gujranwala) is not the one that helps
readers most (Karachi). Batch 0 should be Gujranwala for architecture, with Karachi close behind
for value.

---

## The 22 fallback-only boards

Not a failure state. A board is genuinely well served by an accurate route to its own portal,
and `fallback-only` remains the correct answer where no legitimate gazette exists (§111).

Two of them — **Faisalabad** and **FBISE** — are flagged separately: both are `accessModel:
unverified` because their hosts refused automated checks, yet both returned 200 to a plain GET
in the Phase 8 link check. They need a human with an ordinary browser. FBISE is a national
board, so this is the highest-value unblock on the list.

---

## Before any board moves to `gazette-lookup-active`

Per `docs/architecture/gazette-result-engine.md` §39:

- [ ] Source verified as genuinely that board's, that examination, that year
- [ ] Checksum recorded; original preserved immutably
- [ ] Parser succeeded with an acceptable warning profile
- [ ] Validation passed — counts, ranges, duplicates
- [ ] Sample QA compared against the source PDF, including page boundaries
- [ ] Board / year / examination isolation tested
- [ ] Exact-match lookup tested, including near-miss roll numbers
- [ ] Privacy controls verified: noindex, no sitemap, no bulk export
- [ ] Activation performed as a deliberate, separate step

A partially imported dataset is never activated. `dataset-processing` is an honest status and is
shown as such.

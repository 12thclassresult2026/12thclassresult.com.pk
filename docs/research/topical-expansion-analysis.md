# Topical Expansion Analysis

**Phase:** 6 — category eligibility before any expansion
**Date:** 2026-09-14
**Method:** scored against evidence already held. No category is scored on assumed demand.

---

## The headline finding

**Most of the Phase 6 expansion surface is blocked, and the blocker is the same one in almost
every case: there is no verified Pakistani HSSC scheme of studies in evidence.**

Subject hubs, group hubs, chapter taxonomies, notes, MCQs and syllabus pages all depend on
knowing — from an official curriculum document — which subjects belong to which group, how many
marks each carries, and how the chapters are structured. That document has not been obtained.
Building on top of it anyway would mean inferring a national curriculum from competitor sites,
which is precisely the failure mode this project exists to avoid.

A second, independent blocker applies to past papers, textbooks and notes: **copyright**.
"Available online" is not redistribution permission.

**Exactly one cluster is fully buildable today: Tools.** And it happens to be the one where the
market's current answer is not merely thin but _wrong_.

---

## Eligibility scorecard

Scored 0–3 on each axis. `Source` and `Copyright` are **veto axes**: a 0 on either blocks the
category regardless of demand.

| Category                    | Demand | Relevance | Unique value | Source | Copyright | Maintainable | Verdict         |
| --------------------------- | -----: | --------: | -----------: | -----: | --------: | -----------: | --------------- |
| **Percentage tool + guide** |      3 |         3 |            3 |      3 |         3 |            3 | **BUILD NOW**   |
| Historical gazette archive  |      2 |         3 |            3 |      3 |         2 |            2 | **BUILD LATER** |
| Result statistics archive   |      2 |         3 |            3 |      1 |         3 |            2 | CONDITIONAL     |
| Post-result document admin  |      3 |         3 |            3 |      2 |         3 |            2 | CONDITIONAL     |
| Subject hubs                |      3 |         3 |            2 |  **0** |         3 |            1 | **BLOCKED**     |
| Group hubs (FSc/ICS/ICom)   |      3 |         3 |            2 |  **0** |         3 |            2 | **BLOCKED**     |
| Grade bands / passing rules |      3 |         3 |            3 |  **0** |         3 |            2 | **BLOCKED**     |
| Past papers                 |      3 |         3 |            3 |      1 |     **0** |            1 | **BLOCKED**     |
| Pairing schemes             |      3 |         2 |            2 |  **0** |         1 |        **0** | **BLOCKED**     |
| Textbooks                   |      3 |         2 |            1 |      1 |     **0** |            1 | **BLOCKED**     |
| Notes                       |      3 |         2 |            1 |  **0** |         1 |        **0** | **BLOCKED**     |
| MCQs / tests                |      2 |         2 |            1 |  **0** |         1 |        **0** | **BLOCKED**     |
| Chapter resources           |      2 |         2 |            1 |  **0** |         1 |        **0** | **BLOCKED**     |
| Aggregate / entry-test tool |      3 |         2 |            1 |      1 |         3 |        **0** | **REJECT**      |
| University / degree pages   |      2 |         1 |            1 |      1 |         3 |            1 | **REJECT**      |

---

## Why each blocked category is blocked

### Subject hubs, group hubs, chapters, notes, MCQs — no curriculum source

Phase 2 set the gate explicitly and it has not been met:

> A Punjab group page ships **only** if it carries genuinely group-specific content — subject
> list, marks distribution, grading, and post-result pathways for that qualification. A group
> page that repeats the same lookup and the same date is cannibalization.

None of those four is in evidence. Without a scheme of studies we cannot state which subjects
belong to Pre-Medical versus Pre-Engineering, what each is marked out of, or how chapters are
structured — and every one of those varies by board and province.

**Unblocking step:** obtain a current scheme of studies from a board or curriculum authority,
register it as a source, and build the subject taxonomy from it. Until then these are
inventory rows, not pages.

### Grade bands and passing criteria — verified as unverifiable today

The competitor audit is unambiguous: _"Passing criteria / grade bands — several variants —
**Unverified. Not carried.**"_ Competitors publish mutually inconsistent grade tables. This is
the same failure pattern as the result dates and the SMS shortcodes.

**Consequence for the tool built in this phase:** the percentage calculator outputs a
percentage and deliberately **no grade and no division**, because those bands are not verified.

### Past papers and textbooks — copyright veto

A board's examination paper and a provincial textbook are somebody's copyright. The project
holds no licence, no owner-supplied scans, and no permission. The research gap analysis shows
the opportunity is real — _"no competitor offers solved papers, marking schemes or answer
keys"_ — but the legitimate route to it is original material or a licence, not redistribution.

**Unblocking step:** either a licence, owner-supplied originals, or original explanatory
material that does not reproduce the papers.

### Pairing schemes — maintenance veto

Freshness-sensitive by nature, board-specific, and re-issued every session. No official source
has been verified. A scheme that silently becomes last year's is worse than no page, because a
student revises the wrong topics. Scored 0 on maintainability deliberately.

### Aggregate / entry-test calculators — rejected, and stay rejected

Already rejected in the Phase 2 inventory, and Phase 6 does not change the reasoning:
weightings differ by institution and by admission cycle, so the formula is a maintenance
liability with a real cost to a student who relies on a stale one. Established tools exist.

---

## What is buildable now

### Tools — percentage (BUILD NOW)

The one category that clears every axis, and the strongest single opportunity found in the
whole expansion survey.

**The market's answer is wrong, not thin.** Evidence `G6c`, verified: the ranking advice for
12th-class percentage calculation is CBSE's `CGPA × 9.5` — an Indian formula, for a grading
system Pakistan does not use. Pakistani HSSC marks are out of 1100.

It needs no board permission, no copyright clearance and no curriculum document. It is
evergreen (freshness class D). Both halves were already approved in the Phase 2 inventory:
`/guides/how-percentage-is-calculated` and `/tools/percentage-calculator`.

**The honest constraints it must respect:**

1. **No grade, no division output.** Grade bands are unverified.
2. **1100 is offered, never assumed.** The result data contract is explicit: _"HSSC is commonly
   out of 1100, but that is a scheme fact, not a safe default."_ The reader confirms their own
   total.
3. **The aggregate rule is stated** — pass/fail is decided on Part-I + Part-II together
   (evidence `H5b`, verified) — because a student calculating from Part-II alone gets a number
   that means nothing for their result.

### Historical gazette archive (BUILD LATER)

Evidence `G6h`, verified: boards publish deep gazette archives — one covering HSSC Part-I and
Part-II 2012–2025, another Inter Part-I and Part-II ~2014–2025 — and rank only on archival
phrasing. `G6i`: current-year gazette queries return mostly 9th/10th/11th material.

Real, durable, and the boards' own files. Deferred rather than blocked because it belongs
behind the Phase 5 gazette hub, which is not built yet, and because linking is required —
hosting a board's gazette is redistribution.

### Result statistics archive (CONDITIONAL)

Evidence: pass percentages and group/gender splits are carried only by news outlets on
announcement day, then lost. Nothing archives them. Genuinely durable data.

Conditional because the source would be news reporting rather than a board publication, which
sits at tier 4 of the editorial source hierarchy. Acceptable only where the report quotes a
board document, and labelled as such.

---

## What Phase 6 deliberately does not do

- No subject × board × year × chapter × resource generation. Not one of those dimensions has a
  verified taxonomy behind it.
- No page family is created as an empty template awaiting content.
- No category is built because a competitor has it. Several of the blocked categories above are
  well covered by competitors; that is not evidence we can cover them accurately.

The Phase 6 principle is that authority comes from relationships, and scale comes after
quality. Today the honest expansion is one excellent tool, not nine thin families.

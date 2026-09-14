# Keyword Cluster Map & Intent Model

**Phase:** 1 — Research
**Date:** 2026-09-14

> **No owner keyword export exists for this project** (see `../content-ingestion-report.md`).
> This model is derived bottom-up from live search behaviour, competitor coverage and
> official board terminology.
>
> **No search-volume figure is asserted anywhere in this document.** Volume data was
> not available. Priority reflects evidence of intent and of weak supply, not measured demand.

**Standing caveat:** the search index used is US-anchored, so Indian results are
over-represented. This is read as a signal of **how ambiguous a term is**, never as a
measurement of Pakistani ranking.

---

## 1. Intent classification model

| Class                      | Description                           | Example                                   |
| -------------------------- | ------------------------------------- | ----------------------------------------- |
| **Direct lookup**          | Wants their own result now            | "12th class result by roll number"        |
| **Status**                 | Is it out yet?                        | "12th class result announced"             |
| **Date**                   | When will it be out?                  | "2nd year result date 2026"               |
| **Method**                 | How do I check?                       | "result by SMS", "result gazette"         |
| **Board-specific**         | All of the above, scoped to one board | "`<board>` 12th class result"             |
| **Group-specific**         | Scoped to a qualification or stream   | "FSc part 2 result", "pre-medical result" |
| **Troubleshooting**        | Something went wrong                  | "result without roll number", "withheld"  |
| **Post-result — dispute**  | Challenge the marks                   | "rechecking"                              |
| **Post-result — retry**    | Sit again                             | "second annual", "improvement"            |
| **Post-result — document** | Get or fix the paperwork              | "DMC", "duplicate certificate"            |
| **Computation**            | Turn marks into a number              | "percentage calculation", "aggregate"     |
| **Transition**             | What next                             | "admission after 12th"                    |
| **Academic resource**      | Study material                        | "past papers", "pairing scheme"           |

---

## 2. Clusters and canonical owners

| #   | Cluster                                                                                                                                                        | Intent                      | Canonical owner                                                  | Status                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | 12th class result · 2nd year result · second year result · HSSC part 2 · HSSC part II · inter part 2 · intermediate part 2 · 12 class result · class 12 result | Head / direct lookup        | `/results/12th-class`                                            | **Approved**                                                        |
| 2   | 12th class result 2026 · 2nd year result 2026 · hssc part 2 result 2026                                                                                        | Current session status      | `/results/12th-class/2026`                                       | **Approved**                                                        |
| 3   | `<board>` 12th class result · `<board>` 2nd year result                                                                                                        | Board-specific              | `/results/<board>/12th-class/<year>`                             | **Approved**, per board, on evidence                                |
| 4   | board list · all boards result · bise boards                                                                                                                   | Navigational                | `/boards`                                                        | **Approved**                                                        |
| 5   | 12th class result date · announcement time · when will it be announced                                                                                         | Date                        | Section on cluster 2                                             | **Blocked** — no board-sourced date exists                          |
| 6   | `<board>` result date                                                                                                                                          | Board date                  | Section on cluster 3                                             | Split only once sourced per board                                   |
| 7   | check result by roll number                                                                                                                                    | Method                      | Section on cluster 1                                             | **Approved** as a section                                           |
| 8   | result by SMS · `<board>` SMS code                                                                                                                             | Method                      | Section on cluster 1                                             | **Blocked** — zero verified shortcodes nationally                   |
| 9   | result by name                                                                                                                                                 | Method                      | —                                                                | **Rejected** — most boards do not offer it                          |
| 10  | result without roll number · forgot roll number                                                                                                                | Troubleshooting             | `/guides/lost-roll-number`                                       | **Approved** — weakest surface in the market                        |
| 11  | 12th class gazette · HSSC gazette pdf · `<board>` gazette                                                                                                      | Document retrieval          | `/gazettes/12th-class`                                           | **Approved**                                                        |
| 12  | old gazette · previous year gazette                                                                                                                            | Archival                    | `/gazettes/12th-class/archive`                                   | **Approved** — the one gazette surface where boards themselves rank |
| 13  | FSc part 2 result · FA part 2 result · ICS part 2 result · ICom part 2 result                                                                                  | Group, Punjab model         | Conditional group pages                                          | **Conditional** — see §3                                            |
| 14  | pre-medical result · pre-engineering result · science general result · humanities result                                                                       | Group, Sindh model          | `/results/karachi-board/12th-class/<year>` with per-group status | **Approved** — genuinely separate events                            |
| 15  | rechecking · re-evaluation · re-totalling                                                                                                                      | Post-result dispute         | `/guides/rechecking`                                             | **Approved — highest-value gap found**                              |
| 16  | second annual · supplementary                                                                                                                                  | Post-result retry           | `/guides/second-annual`                                          | **Approved**, both words on one page                                |
| 17  | improvement of marks                                                                                                                                           | Post-result retry           | `/guides/improvement`                                            | **Approved**, cross-linked to 16                                    |
| 18  | DMC · result card · duplicate DMC                                                                                                                              | Document                    | `/guides/result-card-dmc`                                        | **Approved**                                                        |
| 19  | percentage calculation · marks out of 1100                                                                                                                     | Computation                 | `/tools/percentage-calculator` + explainer                       | **Approved** — currently answered with wrong methodology            |
| 20  | certificate verification · attestation · equivalence                                                                                                           | Document                    | —                                                                | **Rejected** — the official body owns its own intent                |
| 21  | MDCAT / ECAT aggregate calculator                                                                                                                              | Transition                  | —                                                                | **Rejected** — crowded, established, settled formula                |
| 22  | admission after 12th · merit list                                                                                                                              | Transition                  | `/guides/after-12th-admissions`                                  | **Conditional**                                                     |
| 23  | position holders                                                                                                                                               | Status                      | —                                                                | **Rejected** — no official 2026 source                              |
| 24  | Urdu-script result queries                                                                                                                                     | Head intent, Urdu           | Urdu surface on canonical pages                                  | **Conditional** — see §4                                            |
| 25  | Roman-Urdu ("kab aayega")                                                                                                                                      | Head intent, transliterated | —                                                                | **Rejected** as a page; cover phrasing naturally                    |
| 26  | past papers · pairing scheme · notes · model papers                                                                                                            | Academic resource           | Deferred                                                         | **Needs evidence**                                                  |

---

## 3. The group-term decision — the most nuanced call in this model

**Evidence for treating group terms as distinct:**

- Generic and group queries share **zero identical URLs**. Domain overlap is high; URL overlap is nil.
- Market leaders already serve group terms from separate URLs.

**Evidence against building Punjab group pages:**

- Punjab, KPK and Federal board portals have **no group field** — one roll-number form.
- Punjab declares **all groups simultaneously**, with identical timestamps.
- The incumbent group pages are **template-swapped and decaying** — one carries a 2026 title over a 2025 heading; another is entirely last year's content with an update block about a different exam.
- The lookup instruction on a group page is identical to the generic one.

**Decision:**

| Term                      | Decision                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `FSc part 2 result`       | **Conditional approve** — cleanest group term; the abbreviation is effectively unique to Pakistan                                 |
| `FA part 2 result`        | Conditional approve. **Never target the bare "FA result"** — 0/10 Pakistani results (a blood disorder and a football competition) |
| `ICS part 2 result`       | Conditional approve. **Never target bare "ICS result"** — adding a year makes it _worse_                                          |
| `ICom part 2 result`      | Conditional approve; needs a Pakistan or year qualifier                                                                           |
| **Karachi group results** | **Full approve** — a different real-world event, not a keyword variant                                                            |

**The condition:** a Punjab group page ships **only** if it carries genuinely
group-specific content — subject list, marks distribution, grading, and post-result
pathways for that qualification. A group page that repeats the same lookup and the same
date is cannibalization, and the market's own decaying group pages are the proof.

---

## 4. Urdu — a real vacuum with a calibration

| Evidence                                                                      | Implication                                    |
| ----------------------------------------------------------------------------- | ---------------------------------------------- |
| Urdu-script results are ~100% Pakistani and served **entirely by newspapers** | Genuinely uncontested by aggregators           |
| **Zero** aggregators, lookup tools or official boards appear                  | No incumbent to displace                       |
| **No English aggregator has any Urdu presence**                               | English content is not capturing these queries |
| Every ranking Urdu roll-number how-to is for **matric**, never intermediate   | A specific, nameable gap                       |
| Urdu intent skews to **announcement and statistics**, not lookup              | Build news/how-to, not a second form           |
| Roman-Urdu is India-dominated and video-first                                 | Not worth a dedicated page                     |

**Recommendation:** an Urdu surface on canonical pages, or a localized path — decided in
Phase 2. **Do not create duplicate English pages targeting transliterated queries.**

---

## 5. Consolidation decisions, with the evidence for each

| Decision                                              | Evidence                                                                                                                                                                            |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Consolidate** the nine head synonyms onto one owner | Same domains and frequently the same URLs rank across all of them                                                                                                                   |
| **Split** evergreen from current-year                 | Distinct intents; but note **no competitor maintains year-stamped archive URLs** — year-stamped equivalents 404 while yearless ones resolve. The evergreen hub is the durable asset |
| **Split** by board                                    | Different entity, different portal, different requirements, different status                                                                                                        |
| **Split** by group **only in Sindh**                  | One board declares groups up to four weeks apart                                                                                                                                    |
| **Merge** second annual with supplementary            | The same examination under two vocabularies                                                                                                                                         |
| **Separate** improvement from second annual           | Same sitting, different eligibility and motivation — and the two are actively confused                                                                                              |
| **Separate** rechecking entirely                      | No re-examination; different form, fee and deadline                                                                                                                                 |
| **Merge** date + announcement time + "when"           | One question                                                                                                                                                                        |
| **Merge** the four method queries into hub sections   | One competitor provably serves all four from one page and ranks for each                                                                                                            |

---

## 6. Priority — by evidence of weak supply

**Tier A — vacuums with real intent**

1. **Rechecking** — every engine returns Indian content; we hold real board-published fees from KPK
2. **Percentage calculation for Pakistan** — currently answered with a foreign methodology that is simply wrong here
3. **Result without roll number** — the weakest surface observed anywhere
4. **Gazette board × class × year matrix** — current-year gazette queries return mostly 9th/10th/11th material
5. **Urdu-script coverage** — no aggregator present at all

**Tier B — contested but weakly held** 6. Head result intent · 7. Current-year status · 8. Board pages · 9. Second annual / improvement · 10. DMC and document admin

**Tier C — conditional** 11. Punjab group pages (only with real group content) · 12. Karachi group results (approved, needs the gazette journey) · 13. Admissions guidance

**Rejected:** name lookup · SMS pages · position holders · certificate verification ·
entry-test aggregate calculators · Roman-Urdu pages.

---

## 7. Still outstanding

1. A board-specific SERP sweep (whether `<board> result` and `<board> result 2026` are distinct intents) — the search budget was exhausted.
2. A Pakistan-localised re-check of rechecking, improvement and percentage queries, to firm up the "vacuum" verdicts.
3. Academic-resource demand, which is a scope question more than a keyword question.
4. Everything above is re-derived, not replaced, if the owner supplies a keyword packet.

# Content Gap Analysis — 12th Class / HSSC Part-II

**Research date:** 2026-09-14
**Competitors examined live:** 12thclassresult2026.com.pk, ulearnlms.com,
taleem360.com, 12classresult2026.pk, 2ndyearresult.com.pk, 2ndyearresult2026.pk,
punjabresults.pk, result.pk, plus live SERP discovery.
**Unreachable (HTTP 403, reconstructed from search listings only):**
results.hamariweb.com, freeilm.pk, bisepunjab.com, checkresult.pk, resultpedia.com.pk.

Every competitor claim about dates, SMS codes, fees or passing criteria is treated as
an **unverified competitor claim** and none is carried into this project.

---

## 1. The single most important structural finding

**"12th class result", "2nd year result", "HSSC Part-II result" and "inter part 2
result" are ONE search intent, not four.** The same domains — frequently the same
URLs — rank across all of them.

The genuine splits in this market run along entirely different axes:

```
board  ×  year  ×  session (annual vs second annual)  ×  group (FA / FSc / ICS / ICom)
```

**Consequence for our architecture:** one canonical owner at `/results/12th-class`
holds the head intent, with the synonyms recorded as `queryVariants`. We do not build
six near-duplicate synonym pages. A validation test asserts this consolidation holds.

The market splits three ways on this question: most sites stuff every synonym into one
page's title; ilmkidunya separates at hub level but collapses at board level; and the
`result.pk` network accidentally self-competes by serving `/12th-results/` and
`/inter-part-2-results/` as separate URLs for the same intent.

---

## 2. Market leader worth knowing about

**ilmkidunya.com is the structural benchmark and was absent from the supplied
competitor set.** It ranks not because any one page is strong but because it owns
every adjacent entity: results by class, by qualification, by board, by university
(70+), by entry test (80+), by commission, by technical board — plus a `/12th-class/`
resource hub with roughly fifteen sub-sections. Its actual result widget is only
exam-type + board + year, and it still routes the reader out to the board site.

---

## 3. Gaps nobody fills — ranked by opportunity

### Tier 1 — real demand, no adequate supply

| #   | Gap                                   | Evidence                                                                                                                                                                                                                     | Our position                                                                                                                                               |
| --- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **A sourced result date**             | The live SERP carries 23, 18 and 13 September 2026 for the same Punjab result. Not one page cites a board notification.                                                                                                      | Already built: dates are `VerifiedFact`s; nothing publishes without a source, a source-publication date and a check date. This is an immediate trust moat. |
| 2   | **A verified SMS shortcode table**    | Lahore appears as 80029, 800291, 80092 and 8583 across rivals; one site publishes an entirely different flat scheme.                                                                                                         | We publish **none**, and say why. A code ships only with the board page that prints it.                                                                    |
| 3   | **Post-result document admin**        | Duplicate DMC, name/father-name/DOB correction, migration certificate, IBCC attestation — essentially uncovered market-wide, though official proformas exist.                                                                | High-intent, evergreen, zero competition. Strong Tier-2 roadmap candidate.                                                                                 |
| 4   | **Result-problem triage**             | "Withheld", UFM, missing practical marks, roll number not found, name mismatch. Only one competitor even lists _withheld_ as a status; nobody explains what to do next. Searchers currently land on Indian exam-board pages. | Directly serves the reader on the day it matters.                                                                                                          |
| 5   | **Result statistics as durable data** | Pass percentages and group/gender splits are carried only by news outlets on announcement day, then lost. No result portal archives them.                                                                                    | Structured, sourced, year-over-year.                                                                                                                       |
| 6   | **Urdu / Roman-Urdu coverage**        | Urdu SERP for this intent is served entirely by news sites. No result portal targets it.                                                                                                                                     | Unclaimed.                                                                                                                                                 |

### Tier 2 — everyone covers it badly

| #   | Gap                                            | Evidence                                                                                                                                                                                   |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 7   | **Sindh's group-wise staggered announcements** | Karachi announced Pre-Medical, Science General and Computer Science on _different dates_. Every Punjab-centric competitor models "one board = one date" and gets Sindh structurally wrong. |
| 8   | **Session and year dimension**                 | Only punjabresults.pk lets a reader choose Annual vs Supplementary and a past year. Everyone else serves one undated page that silently rots.                                              |
| 9   | **Second annual / supplementary**              | Eligibility, fee windows, absentees, practicals, single-subject failure — covered properly by exactly one competitor.                                                                      |
| 10  | **Past papers with answers**                   | No competitor offers solved papers, marking schemes or answer keys; papers are also merged across Punjab rather than kept per board.                                                       |
| 11  | **Roll-number recovery**                       | "Forgot roll number" returns only generic advice anywhere.                                                                                                                                 |
| 12  | **Stale inventory is endemic**                 | One competitor serves 2024 dates on a current-cycle page; another auto-stamps today's date as "updated" on every page; a whole `2ndyearresult2025.pk` domain is still live.                |

### The market-wide truth worth stating plainly

**No first-party result checker exists in this market.** Every "checker" — including
the best one found — is a router to the official board portal. Our research
independently confirms why: three of the boards we verified sit behind a CAPTCHA, and
no board's CAPTCHA absence could be positively established. Any competitor promising
an in-page result is either proxying a portal or overstating what it does.

This makes **honest routing plus verified provenance** the winning position, not a
compromise.

---

## 4. Combined market category tree

The union of everything the market covers, as the candidate topical universe. Nothing
here is approved for building yet — each entry must pass the URL Eligibility Gate
(section 132).

```
12th Class / 2nd Year / HSSC Part-II
├── RESULTS — by year · session · board · qualification · group · method · candidate type
│            · status handling (pass/fail/absent/withheld/UFM)
├── GAZETTES — per board, per year, annual vs supplementary
├── POSITION HOLDERS — board-wise, group-wise
├── DATE SHEETS — annual · second annual · practicals
├── ROLL NUMBER SLIPS — regular vs private · recovery
├── STUDY RESOURCES — notes · textbooks · past papers · model papers · guess papers
│                     · pairing schemes · MCQs · online tests · syllabus
├── POST-RESULT ACADEMIC — rechecking vs revaluation · supplementary · improvement
├── POST-RESULT ADMIN — result card/DMC · duplicate DMC · corrections · migration
│                       · verification · IBCC attestation        [near-zero coverage]
├── ADMISSIONS & CAREER — merit/aggregate calculators · merit lists · MDCAT/ECAT
├── GRADING & RULES — grade bands · division · passing criteria · marks distribution
├── BOARD REFERENCE — jurisdiction · official site · helpline · SMS code
├── NEWS — announcements · statistics · policy changes
└── TOOLS — GPA/CGPA · percentage · gazette search guidance · countdown
```

---

## 5. Rejected and deferred, with reasons

| Opportunity                                                                      | Decision             | Reason                                                                                                                          |
| -------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Separate `/2nd-year-result`, `/hssc-part-2-result`, `/inter-part-2-result` pages | **Rejected**         | Same intent as `/results/12th-class` (section 125). Would cannibalize our own canonical owner.                                  |
| Countdown timer to the 2026 result                                               | **Rejected for now** | Requires a `confirmed` date with a time. No board has published one. A countdown on a tentative date is an unqualified promise. |
| SMS shortcode pages per board                                                    | **Blocked**          | No shortcode verified on any board domain.                                                                                      |
| Position holders                                                                 | **Deferred**         | No official 2026 source exists yet; publishing before one does would mean copying a competitor's unverified list.               |
| Hosting gazette PDFs ourselves                                                   | **Deferred**         | Requires a rights/provenance review (section 19). Linking the board's own gazette page carries no such risk.                    |
| Name-based result lookup                                                         | **Not promised**     | Not confirmed as supported on any board portal. A `name=` parameter seen in a search listing is not evidence a board offers it. |

---

## 6. What this implies for the build order

1. **Core + honest status** — done: hub, board directory, "nothing is announced" stated plainly.
2. **Per-board pages** — one at a time, each through a publication review. Registry-first: all ten boards are registered as `planned` with no page, so the directory is honest without shipping thin pages.
3. **Close the two verification gaps** — Faisalabad and FBISE need a human with a browser.
4. **Result-day infrastructure** — source status, fallback ladder, official-link-first.
5. **Tier-1 whitespace** — document admin, problem triage, statistics archive.
6. **Study-material expansion** — only where original, source-backed value exists.

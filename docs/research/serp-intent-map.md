# SERP Intent Map — 12th Class / HSSC Part-II

**Research date:** 2026-09-14

This is a **competitor and intent inventory**, not a rank report. Ranking positions
were not measured; presence in results for a query is recorded, not position.

---

## The central finding

Across the queries "12th class result", "2nd year result", "HSSC part 2 result" and
"inter part 2 result", **the same domains and frequently the same URLs appear.**

**This is one intent.** It gets one canonical owner — `/results/12th-class` — with the
synonyms carried as query variants on that page. A validation test asserts this.

The real intent splits run along different axes:

| Axis                                                    | Distinct intent?       | Our treatment                                                       |
| ------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------- |
| Synonym (12th / 2nd year / HSSC Part-II / inter part 2) | **No**                 | Consolidate onto one canonical owner                                |
| **Board**                                               | **Yes**                | One page per board, registry-driven                                 |
| **Year**                                                | **Yes**                | Evergreen hub + per-year pages where the year carries durable value |
| **Session** (annual vs second annual)                   | **Yes**                | Modelled in the data contract; boards publish separate routes       |
| **Group** (FA / FSc / ICS / ICom)                       | **Yes, but secondary** | Deferred — only worth pages if we compete at hub level              |
| Method (roll number / name / SMS / gazette)             | **Partly**             | Sections on the hub first; own URLs only if demand justifies        |

---

## Competitor inventory

| Domain                                | Category                          | Representative paths                                          | Intent served                                                              | Strength                                                                                                                                                                                      | Weakness                                                                     |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ilmkidunya.com                        | Portal — market leader            | `/results/`, `/12th-class/`, `/date_sheets/`, `/past_papers/` | Every adjacent entity: class, qualification, board, university, entry test | Unmatched entity coverage and internal linking                                                                                                                                                | Result widget still routes out; page-level depth is thin relative to breadth |
| result.pk (+ clone network)           | Portal network                    | `/12th-results/`, `/12th-rollnoslip/`, gazette PDF paths      | Board × artifact matrix                                                    | Gazette archive; long result-date history table                                                                                                                                               | Auto-stamped freshness; self-competing duplicate URLs                        |
| punjabresults.pk                      | Result tool                       | `/12th-class-result`                                          | Board + **session + year**                                                 | Best checker UX found; honest status vocabulary incl. withheld                                                                                                                                | Punjab + Federal only; unsourced thresholds                                  |
| results.hamariweb.com                 | Portal                            | `/bise-<board>-inter/hssc-part-2-result/`                     | Board × artifact                                                           | Per-board date sheets; self-hosted gazettes                                                                                                                                                   | Not observable; heavy                                                        |
| taleem360.com                         | Document library                  | `/categories/12th-class-results`                              | Artifact × class × province                                                | Enormous resource taxonomy                                                                                                                                                                    | No result utility; no board axis                                             |
| 12thclassresult2026.com.pk            | Landing                           | board result paths                                            | Head result intent                                                         | Broad module coverage                                                                                                                                                                         | Inconsistent slugs; self-contradicting data                                  |
| 2ndyearresult2026.pk                  | Landing + topics                  | `/supplementary/`, `/2nd-year-passing-marks/`                 | Result + supplementary                                                     | Genuine supplementary depth                                                                                                                                                                   | No verification stamps                                                       |
| biseresults.com                       | Long-form guide                   | 12th result guide                                             | Explanatory intent                                                         | Most complete _explanatory_ page found; worked aggregate example                                                                                                                              | No checker                                                                   |
| resultchecker.com.pk                  | Portal + tools                    | calculator paths                                              | Tool intent                                                                | Only site with a real tools layer                                                                                                                                                             | Broken on-site search                                                        |
| freeilm.pk                            | Class-first taxonomy              | `/2nd-year-result/<board>/`, `/2nd-year/gazette/<board>/`     | Class × artifact × board                                                   | Cleanest three-axis IA in the market                                                                                                                                                          | Listing-derived only                                                         |
| rollnoslip.com.pk                     | Roll-slip vertical                | roll slip paths                                               | Document intent                                                            | Owns an adjacent vertical now ranking for result queries                                                                                                                                      | Narrow                                                                       |
| News layer (several national outlets) | Editorial                         | announcement articles                                         | Statistics + announcement                                                  | **Carry the actual pass-rate and enrolment statistics that no result portal publishes**; dominate the first 48 hours                                                                          | Not archived; not structured                                                 |
| Notes/library layer (several)         | Resource libraries                | notes / past paper paths                                      | Study-material intent                                                      | Own those intents outright                                                                                                                                                                    | Not result-focused                                                           |
| Sindh-specific sites                  | Regional                          | Karachi board result paths                                    | Group-wise staggered results                                               | Model Sindh correctly                                                                                                                                                                         | Regional only                                                                |
| `12thclassresult2026.org.pk`          | **Near-identical domain to ours** | head result intent                                            | Head intent                                                                | Has the two best ideas in the market: a **"12th Class vs HSSC Part-II" terminology explainer** and **per-board gazette released/not-released tracking**, plus a visible "last verified" stamp | Otherwise thin                                                               |

---

## Query clusters and canonical assignment

| Cluster            | Example queries                                                                              | Canonical owner                                     | Status                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| Head result intent | 12th class result, 2nd year result, hssc part 2 result, inter part 2 result, 12 class result | `/results/12th-class`                               | **Built**                                               |
| Current session    | 12th class result 2026, 2nd year result 2026                                                 | `/results/12th-class/2026`                          | Planned                                                 |
| Board + session    | `<board>` 12th class result 2026                                                             | `/results/<board>/12th-class/2026`                  | Planned (10 registered)                                 |
| Board directory    | bise board list, all boards result                                                           | `/boards`                                           | **Built**                                               |
| Result date        | 12th class result date 2026                                                                  | Section on the year hub until a sourced date exists | Blocked on a board notification                         |
| SMS method         | 12th class result by sms, `<board>` sms code                                                 | Section on the hub                                  | **Blocked — no verified shortcode exists**              |
| Gazette            | 12th class gazette `<board>`                                                                 | Deferred                                            | Rights/provenance review needed before hosting anything |
| Position holders   | 12th class position holders 2026                                                             | Deferred                                            | No official 2026 source exists                          |
| Post-result admin  | duplicate DMC, name correction, migration certificate                                        | Unclaimed whitespace                                | Tier-1 roadmap                                          |
| Problem triage     | result withheld, roll number not found                                                       | Unclaimed whitespace                                | Tier-1 roadmap                                          |

---

## Notes on demand evidence

No owner-supplied keyword packet has been received for this project, so **no
search-volume figures are asserted anywhere in this document.** Clusters above are
derived from observed competitor coverage and from which URLs actually appear for
each query — not from a volume tool.

When the owner supplies keyword exports, they become the primary authority for
priority (section 113), and this map is re-derived against them rather than replaced.

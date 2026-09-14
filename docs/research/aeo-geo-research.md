# AEO / GEO Research — Answer & AI Search

**Phase:** 1 — Research
**Date:** 2026-09-14

AEO/GEO here is treated as an extension of accurate content, clear entities and strong
technical SEO — **not** as a schema trick or an FAQ-stuffing exercise.

---

## 1. The central finding

> **Answer engines are citing whoever states the fact plainly in crawlable HTML —
> because the authoritative sources are structurally unciteable.**

Pakistani board sites barely rank and largely _cannot_ be quoted:

| Barrier                                                                          | Effect                            |
| -------------------------------------------------------------------------------- | --------------------------------- |
| CAPTCHA-gated result forms                                                       | Nothing behind them is readable   |
| Facts published **only inside PDFs**                                             | Not extractable as a passage      |
| JavaScript portals and subdomain redirects                                       | No server-rendered fact to quote  |
| No structured data anywhere                                                      | No machine-readable entity        |
| Rechecking portals exposing a status checker with **no fee or deadline in HTML** | The answer does not exist as text |

Consequence: aggregators own the answer layer **by default**, not by merit. In direct
observation, answer engines synthesised responses from aggregator sites and news
outlets — **never from a board site**.

**This is the opportunity.** A site that states board facts plainly, in HTML, with a
linked source and a real verification date becomes the citable source almost by
construction.

---

## 2. What actually wins, by query family

| Query family                       | Winning answer format                                                      |
| ---------------------------------- | -------------------------------------------------------------------------- |
| "when is the result / result date" | **A single self-contained sentence carrying date + time**, quoted verbatim |
| "how to check by roll number"      | **Numbered steps** or a short requirement list                             |
| "result by SMS"                    | **The literal shortcode inside a sentence**                                |
| "gazette"                          | **A file-offer page plus one definitional line**                           |

### The format lesson that matters most

> **No engine surfaced a table as the answer unit.**
> Tables help _containment_ — a sentence gets _quoted_.

So every fact must exist **twice**: once as a self-contained sentence near the top of
the relevant section, and once inside the maintained table. The table is for the
reader scanning; the sentence is what gets extracted.

Observed contrast: a page that opens with the fact in sentence one gets quoted across
engines. A page that opens with a narrative lede ("If you're a 2nd year student,
you're probably checking your phone every day…") gets a context snippet instead of the
answer.

---

## 3. Entity disambiguation — a structural risk

The head term is **contested by Indian board content**. "12th class result" returns an
interleaved India/Pakistan result set, and the acronym "HSSC" additionally collides
with an Indian state recruitment commission and with an Indian board that uses "HSSC"
for its own Class 12.

**Mitigation:** qualify the entity string in the passage itself, not only in metadata —
_"HSSC Part-II (12th class), <Board>, Pakistan"_. A passage that does not name the
country and the board will be mis-clustered with content about a different country's
examination.

---

## 4. Freshness behaviour by family

| Family                      | Sensitivity                         | Current state of the index                                                                                  |
| --------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Result date                 | **Extreme**                         | **Contradictory** — the same 2026 Punjab result is published as both 18 and 23 September across major sites |
| Result day / by roll number | Hours-level                         | Winners carry recency stamps                                                                                |
| SMS codes                   | Stable but **wrong in circulation** | One board appears as both `800291` and `80029`; another as both `800292` and `800299`                       |
| Gazette                     | Days after announcement, per board  | Thin                                                                                                        |
| Rechecking                  | Annual                              | **Almost unserved in Pakistan**                                                                             |

The date contradiction is not noise — it is the single clearest demonstration that
**nobody in this market verifies**. Every one of those pages asserts a date with
confidence and none links a notification.

---

## 5. The questions readers actually ask

Captured verbatim from question blocks on ranking pages. These are **user questions to
answer**, not content to copy:

- When will the 12th Class Result be announced?
- Can I check my result without a roll number?
- Do the Punjab Boards' results come out on the same day?
- What if I don't pass a subject?
- Is the online result the same as a DMC?
- How do you check a 2nd Year result through the gazette?
- What is the SMS code for `<board>` result?
- How can I check my result by SMS?
- Which board will declare results first?

Related-search signals point to the same demand: board-specific result queries, "result
card check by roll number", and per-board/per-group date queries.

**Note the fourth and fifth questions.** "What if I don't pass a subject?" and "Is the
online result the same as a DMC?" are exactly the post-result and document-literacy
intents the market does not serve — and they are being asked on result pages.

---

## 6. Recommendations

1. **Lead with the fact.** Every page and every board section opens with one
   self-contained, entity-qualified sentence: board + exam + session + status + date +
   time + timezone. No narrative lede before it.
2. **State the fact twice** — once as an extractable sentence, once in the maintained
   table.
3. **One canonical, maintained fact table per board**: Board | Exam/session | Status |
   Date | Time | Official portal | SMS code | Source document | Verified on.
4. **Show provenance, not badges.** Name the document, **link it**, and give the date it
   was sighted. Two competitors name the issuing committee; neither links it. Linking
   it is a cheap and genuine moat.
5. **Last-verified, honestly.** A real timestamp per fact block that moves only when a
   human re-checks — never today's date auto-printed. When a date shifts, keep a short
   changelog; readers searched _through_ a date change this cycle.
6. **Own rechecking.** Every engine currently returns Indian fees for this family, and
   Pakistani coverage is unsourced ranges. We already hold **real, board-published
   rechecking figures from KPK** — publishing per-board fee, window, portal link and
   source, each with a verified-on date, is the highest-authority opportunity found in
   this research.
7. **Define the entities** in one crisp sentence each, placed where the question is
   asked: gazette, DMC, supplementary vs second annual, rechecking vs re-evaluation,
   position holders.
8. **Format to intent**: steps for "how to check", a numeric sentence for "SMS", a date
   sentence for "when", a file offer plus definition for "gazette".
9. **Answer the real questions inside the relevant section** — not as a bolted-on FAQ
   wall, and without schema gimmickry.

---

## 7. What is explicitly NOT recommended

- Artificial FAQ blocks written to obtain markup.
- Schema asserting anything not visible on the page.
- `Event` markup for an unannounced result date — it would assert to machines exactly
  the confidence the visible page is careful to avoid.
- Chasing rich-result treatment as a strategy. **Being the source that is correct,
  dated and linked is what makes a passage citable** — the markup is incidental.

---

## 8. Why this is defensible

Every competitor advantage in this market is copyable in an afternoon — layout, tables,
FAQ counts, even a countdown.

**Verification is not copyable.** It requires loading board sites, recording what was
seen, distinguishing confirmed from tentative, and re-checking on a cadence. The
market's own contradictions — two different dates for one result, four different
shortcodes for one board — are proof that nobody is doing it.

That is the moat, and it is the same work that makes the site genuinely useful on the
one morning a student needs it.

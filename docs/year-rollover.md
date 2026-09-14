# Year Rollover

How this site moves from one result cycle to the next — 2026 → 2027, and every year after.

---

## The one rule

> **Never run a global find-and-replace on the year.**

Rollover is a research and publication event, not a string substitution. A blind
`2026 → 2027` produces a site that confidently describes a session nobody has announced, using
portals that may have moved, fees that may have changed, and dates that are pure invention. That
is precisely how this market's existing sites decay — one competitor still serves 2024 dates on
a current-cycle page, and a whole `2ndyearresult2025.pk` domain is still live.

Everything below exists to make the slow, correct path easier than the fast, wrong one.

---

## What carries over, and what does not

| Carries over                                | Must be re-verified                      |
| ------------------------------------------- | ---------------------------------------- |
| Board identity, official name, province     | Official portal URL                      |
| The fact that a board exists                | Whether a CAPTCHA is present             |
| Historical dates, marked historical         | Result date, time and declaration status |
| Evergreen explanation (percentage, grading) | SMS shortcode and format                 |
| Access model, **as a starting hypothesis**  | Gazette availability and location        |
| Page structure and components               | Rechecking fee, deadline and process     |
|                                             | Second annual schedule                   |
|                                             | Admission dates and aggregate formulas   |

**`accessModel` is a hypothesis, not a fact, at rollover.** A gazette-only board may deploy a
portal; a roll-number board may take one down. Re-verify before the page tells anyone.

---

## Status reset — do this first

Carrying a previous cycle's operational state into a new one is the most dangerous single
mistake available here.

```
2026 = announced   MUST NOT IMPLY   2027 = announced
```

Concretely, for every board:

1. `resultDate` → `unknownFact('HSSC Part-II <new year>')`
2. `released` on every new-year dataset → `unknown`, never inherited
3. `smsCode` → `unknown` until re-sourced
4. `gazetteAvailable` → `unknown` until re-checked
5. `lastVerifiedAt` → `null`, so the freshness detector treats the board as unverified

A new cycle starts with **no** knowledge. That is accurate, and it is what the reader needs.

---

## Preserve 2026

A 2026 page with durable value stays, and stays indexable. Durable value means it carries at
least one of:

- the **actual** declared date, with its source
- a board gazette for that session
- verified statistics
- a historical result-access method that differs from the current one

**Do not redirect 2026 URLs to 2027.** They are not equivalents. A student looking for a 2026
result is not served by a 2027 page, and the redirect destroys the archive.

Board pages are yearless by design (ADR-004), so most of them do not need a new URL at all —
the current session renders on the same page with the year in the title. A year-stamped board
URL is created only when a past session has durable value of its own.

---

## Evergreen ownership does not move

`/results/12th-class` owns the yearless head term **permanently**. It is not rewritten into the
new year's page, and it never competes with the year hub.

| Page                       | Owns                          | At rollover                    |
| -------------------------- | ----------------------------- | ------------------------------ |
| `/results/12th-class`      | `12th class result` (no year) | Update links; keep ownership   |
| `/results/12th-class/2026` | `12th class result 2026`      | Becomes historical, stays live |
| `/results/12th-class/2027` | `12th class result 2027`      | Created only when justified    |

---

## The 2027 creation gate

A new-year page ships only when **all** of these hold:

- [ ] Real evidence of search demand for that year's term, not an assumption
- [ ] At least one official source publishing something about the new session
- [ ] Year-specific content that is not a clone of the previous year
- [ ] Canonical ownership resolved against the evergreen hub
- [ ] An internal-link role that is not "exists so the year is covered"

An empty `2027` placeholder published early to rank is a doorway page. The freshness detector
fails the build on any page whose `year` exceeds the current cycle, so this is enforced rather
than remembered.

Board × year pages have the same gate, applied per board. **Do not generate all 28.**

---

## Procedure

### 1. Research (before touching code)

- Re-run SERP checks for the head terms; intent does shift between cycles
- Re-check every board's own site for the new session's schedule
- Note new competitors, and old ones that have gone stale
- Record everything in the evidence log with dates

### 2. Reset state

Apply the status reset above. Run the freshness gate — it should now report the whole registry
as unverified, which is correct and is the starting point.

### 3. Re-verify sources, board by board

For each board, confirm: portal URL, CAPTCHA state, lookup methods, gazette path, SMS. Update
`lastCheckedAt` and `lastSuccessfulCheckAt` only where a check actually happened.

Never mark a historical verification as a current one.

### 4. Re-verify procedures

Rechecking fees and deadlines, second annual windows, improvement rules. These are the most
year-sensitive facts on the site and the ones a student acts on with money.

### 5. Publish, gated

New-year pages only where the gate passes. Batch, then QA.

### 6. Re-point navigation

Evergreen → new year. Historical section → previous year. Primary navigation must not keep
pointing at a finished cycle.

### 7. Audit

- [ ] Grep titles, H1s, descriptions and OG metadata for the old year
- [ ] Sitemap: new pages added, historical preserved, `lastmod` meaningful
- [ ] Canonicals correct on both new and historical pages
- [ ] Cannibalization re-checked between evergreen, new year and historical
- [ ] Internal links repaired
- [ ] Full quality gate green

---

## What the automation already enforces

The freshness detector (`lib/freshness/stale.ts`, gated in `tests/validation/freshness.test.ts`)
fails the build on:

| Check                     | Catches                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `old-year-in-metadata`    | A past year left in a title or H1 after rollover               |
| `future-year-page`        | A `2027` page published before its cycle                       |
| `future-year-in-metadata` | A future year in a title or H1                                 |
| `result-date-passed`      | An expected date that came and went without being confirmed    |
| `unsourced-sms`           | A shortcode carried over without a source                      |
| `unsupported-wording`     | "latest", "live", "confirmed", "official" asserted in metadata |

These are the mistakes that are easy to make at 2 a.m. during a rollover, so they are compiler
problems rather than review problems.

---

## Rollover acceptance

- [ ] 2026 historical value preserved and still reachable
- [ ] New-cycle state genuinely reset, not inherited
- [ ] Every important source re-verified this cycle
- [ ] New-year pages pass the creation gate individually
- [ ] Evergreen still owns the yearless term
- [ ] Navigation points at the live cycle
- [ ] SMS, gazette and result methods re-checked
- [ ] Cannibalization reviewed across evergreen / current / historical
- [ ] Sitemap and canonicals audited
- [ ] `npm run check` green, freshness gate green

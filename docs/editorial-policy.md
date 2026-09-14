# Editorial Policy

How facts get onto this site, and what stops them.

---

## 1. The standard

Every volatile factual claim on a public page must be traceable to a **board's own
publication**, carry the date it was read, and state its confidence. A claim that cannot meet
all three is not published as a fact — it is published as "not verified", or not at all.

This is not caution for its own sake. The market this site enters is defined by confident wrong
answers: three competitors publish mutually contradictory result dates for the same board, none
citing a notification; nine or more SMS shortcodes circulate that contradict each other; and the
top answers for Pakistani HSSC rechecking are Indian board rules.

Being right is the product.

---

## 2. Source hierarchy

In order. A lower tier never overrides a higher one.

1. The education board itself — notification, portal, gazette, rulebook
2. A government or education-department publication
3. An official inter-board body (e.g. a PBCC-synchronised schedule)
4. Reputable primary reporting that quotes a board document
5. Reliable secondary reporting

**Competitors are tier zero: discovery only.** They may tell us a question exists. They may
never be the authority for:

result date · result time · live status · SMS shortcode · passing criteria · board procedure ·
rechecking fees or deadlines · second annual rules · gazette availability · which portal is
official

If the only source for a claim is another result site, the claim does not ship.

---

## 3. Confidence labels

Five states, from `VerifiedFact<T>`:

| Status       | Means                                                             | May drive a countdown |
| ------------ | ----------------------------------------------------------------- | --------------------- |
| `confirmed`  | Read from the board's own source, for this exact exam and session | Yes                   |
| `tentative`  | The board itself calls it provisional                             | No                    |
| `expected`   | Our inference from a historical pattern, labelled as such         | No                    |
| `historical` | True for a past session; not asserted for the current one         | No                    |
| `unknown`    | Not verified. **Not the same as "no".**                           | No                    |

Rules that follow from this:

- `expected` is never rendered as "official". `tentative` is never rendered as "confirmed".
- Only `confirmed` may drive a countdown, because a countdown is an unqualified promise that
  something happens at a specific moment.
- "Not verified" is never collapsed to "No". A board whose site refused an automated check is
  very likely fine in an ordinary browser, and saying otherwise misrepresents the board.

---

## 4. Scope of a fact

A fact is true of **one examination, one session, one year, and — where the board declares by
group — one group**. It is never inherited sideways.

Three concrete applications:

- A fee read from a board's **SSC** rechecking portal is not an HSSC fee. The rechecking data
  model makes the examination a required field so a renderer cannot lose it.
- A board-level "result announced" is false for a Karachi Commerce candidate when only
  Pre-Medical has been declared. Per-group boards are modelled per group.
- Punjab boards share a centrally synchronised examination **calendar**. They do not share fee
  schedules, rules or portals, and one board's figure is never generalised across the province.

---

## 5. Conflicting official sources

When a board's own publications disagree, **all of them are genuine**. We show the conflict and
say which one governs in practice; we do not silently pick one.

Gujranwala publishes three different rechecking fees — Rs 600 in its statutory rulebook,
Rs 1,000 in its fee table, Rs 1,500 on its live portal. Choosing one and presenting it as "the
fee" would be inventing an answer the board has not given. The live portal is what actually
charges a student, so it leads, and the other two are shown alongside it.

---

## 6. What is never published

- A result date, time, SMS shortcode or result payload not traceable to a board's own source.
- A "LIVE" badge, countdown or result-announced banner not backed by a `confirmed` fact.
- Student results copied from a competitor.
- Position holders or toppers, for which no official source exists.
- Any claim that this site is an official board website, a government partner, or approved by a
  board. It is none of those.
- Unverifiable superlatives — "#1", "most trusted", "fastest" — as trust signals.
- Fabricated ratings, reviews, statistics, author credentials or partnerships, in content or in
  structured data.
- A personal result at an indexable URL. Ever.

---

## 7. AI-assisted drafting

Drafting may be AI-assisted. Publishing is not automatic.

Every page must clear, by human review:

- **Facts** — each volatile claim traced to its source and date, or downgraded.
- **Originality** — no competitor paragraph, heading sequence, table or FAQ reproduced.
- **Filler** — no "in today's digital age", no "students eagerly await", no padding written to
  hit a word count. There is no word-count target anywhere in this project.
- **Intent** — one dominant intent per page; no unrelated intents merged for length.
- **Hedging** — uncertainty stated plainly, not smoothed into confident prose.

A page that cannot be defended sentence by sentence from its sources does not publish.

---

## 8. Corrections

A factual error is corrected at the **data layer**, not by editing prose around it.

1. Re-verify against the board's own source.
2. Correct the structured fact, and its `checkedAt`.
3. Let dependent pages re-render — no page hard-codes a fact that bypasses the registry.
4. Where the correction changes meaning, preserve what was previously stated and why.

Because volatile facts live in typed registries rather than in page copy, one correction fixes
every page that renders it, and no page can silently keep the old value.

---

## 9. Freshness

Review cadence is editorial, not a crawler schedule:

| Class | Cadence  | Applies to                         |
| ----- | -------- | ---------------------------------- |
| A     | 3 days   | Live result status during a season |
| B     | 30 days  | Dates, announcements, fees         |
| C     | 90 days  | Board procedure and methods        |
| D     | 365 days | Evergreen explanation              |

`contentUpdatedAt`, `lastVerifiedAt` and `lastReviewedAt` are distinct and are **never** bumped
automatically by a build. A timestamp that moves without a human re-reading the source is a lie
about verification.

---

## 10. Independence

This site is independent of every board. It is not affiliated with, endorsed by, or acting for
any board or government body, and it says so where a reader might assume otherwise.

It holds no student's result, and cannot look one up on a student's behalf at any board that has
not permitted it — which today is all of them. Where that is the case, the site says so and
routes the reader to the board's own source rather than simulating a checker.

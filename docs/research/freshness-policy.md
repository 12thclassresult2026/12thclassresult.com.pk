# Content Freshness Policy

**Phase:** 1 — Research (recommendation)
**Date:** 2026-09-14

A result platform's core failure mode is not being wrong on day one. It is being right
on day one and silently wrong three weeks later, while still looking authoritative.

---

## 1. Volatility classes

| Class | Volatility          | Review cadence         | Examples                                                                                     |
| ----- | ------------------- | ---------------------- | -------------------------------------------------------------------------------------------- |
| **A** | Highly volatile     | **3 days** (in season) | Live result status, declaration date/time, portal availability, gazette release state        |
| **B** | Moderately volatile | **30 days**            | SMS method, result portal workflow, rechecking deadlines, second annual windows, date sheets |
| **C** | Periodic            | **90 days**            | Board procedures, portal URLs, form requirements, jurisdiction, aggregate formulas           |
| **D** | Evergreen           | **365 days**           | How grading works, what a DMC is, how percentage is calculated, terminology explainers       |

**These are editorial review cadences, not crawler schedules.** They say how often a
human must re-check the facts, and nothing about how often a search engine should
visit.

### The rule that makes this real

**A class A or B page may not publish without a recorded `lastReviewedAt`.** A page
making volatile claims with no record of when anyone last verified them is exactly the
failure mode above.

---

## 2. Four timestamps, never merged

Collapsing these into one "last updated" field is the single most common dishonesty in
this market — several competitors auto-stamp today's date on every page on every
build, which makes freshness meaningless.

| Field                  | Question it answers                                           |
| ---------------------- | ------------------------------------------------------------- |
| `contentUpdatedAt`     | When did the content itself change? Drives sitemap `lastmod`. |
| `lastVerifiedAt`       | When were the facts last checked against their sources?       |
| `lastReviewedAt`       | When did a human last look at this page?                      |
| `sourcePublishedAt`    | When did the **source** publish this claim?                   |
| `checkedAt` (per fact) | When did we last read that source?                            |

`sourcePublishedAt` and `checkedAt` are deliberately separate: a notification
published in February and read in September is stale evidence even though the check is
fresh. Supersession cannot be reasoned about without both.

`lastReviewedAt` exists because **a review can confirm that nothing changed**, which is
itself worth recording — and is why the interface should say "last reviewed" rather
than "last updated".

### Hard rule

**A build must never move a visible date.** Dates change when facts change or when a
human reviews, never because a deployment happened.

---

## 3. Update triggers

A fact must be re-verified when any of these occur, regardless of cadence:

1. A board publishes a notification touching the examination, session or year.
2. A result season opens for any covered board.
3. A source URL starts redirecting, 404ing, or changes shape.
4. A source's availability changes (online → blocked/offline).
5. A conflicting claim appears anywhere credible.
6. A reader reports an error.
7. The academic year rolls over.
8. A previously blocked source becomes reachable — the Faisalabad and FBISE gaps are
   standing examples.

---

## 4. Result-season escalation

Outside season, class A pages are quiet. From the point a board signals an imminent
declaration until roughly a week after, class A moves to **daily** verification.

Two constraints on that:

- Checks stay conservative and scheduled. **Never poll a government server per
  visitor** — thousands of readers must never become thousands of upstream requests.
- Status is cached and served from our own store, not fetched live on page render.

---

## 5. Stale-content detection

Automated reports should flag, rather than silently hide:

- a class A/B page past its review cadence
- a previous year appearing in a current-session title
- a result date whose source is older than a newer notification
- an official URL that has started to fail
- an empty new-year page
- "latest", "live", "announced" or "confirmed" wording on an unverified fact
- an expired rechecking or second-annual deadline
- a gazette link that no longer resolves

**Detection reports; it does not deindex.** A stale page is an editorial problem to
fix, not a page to delete — deleting it destroys the URL's history and the reader's
bookmark.

---

## 6. Year rollover

Not a find-and-replace of 2026 with 2027.

1. Preserve valuable historical pages — a past year's real result date, method and
   gazette have durable value.
2. Verify the new session's schedule from official sources before publishing anything.
3. Create a new year page only when there is something real to put on it.
4. Update the evergreen hub, internal links and the sitemap.
5. **Do not redirect an old result page to a new-year page** unless they are genuinely
   equivalent — they are usually not, and the redirect destroys a working historical
   record.

---

## 7. Wording must follow fact status

The interface may never smooth these into one confident phrase:

| Status       | Permitted wording                                                 |
| ------------ | ----------------------------------------------------------------- |
| `confirmed`  | "Official result date: …"                                         |
| `tentative`  | "Tentative date, per the board's own provisional notification: …" |
| `expected`   | "Expected — this is our inference, not a board announcement"      |
| `historical` | "In 2025 the result was declared on …"                            |
| `unknown`    | "The board has not published a confirmed date yet."               |

And the standing prohibitions: **never show "LIVE" without verification**, and
**never run a countdown on anything but a confirmed date with a confirmed time.**

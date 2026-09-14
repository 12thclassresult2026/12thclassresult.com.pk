# Privacy Architecture

**Phase:** 2 — Architecture
**Date:** 2026-09-14

---

## 1. The position

> **This system holds no personal data.**

No student results are stored. No accounts exist. No forms collect anything. No database
is provisioned. That is not a stage we have not reached — it is the architecture, and it
makes most privacy risk structurally impossible rather than procedurally managed.

The rules below govern what happens **if** a lookup capability is ever added, so that the
protections exist before the data does.

---

## 2. What counts as sensitive here

A result query and its response identify a real person, often a minor:

| Field                     | Sensitivity                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| Roll number               | Identifies one candidate at one board                             |
| Candidate name            | Direct identifier                                                 |
| **Father's name**         | Direct identifier, and used for identity verification in Pakistan |
| **CNIC / B-Form number**  | **National identity document.** Two boards' portals accept one    |
| Marks, grade, subjects    | Sensitive personal data about a minor                             |
| Pass/fail/withheld status | Sensitive                                                         |

That two boards accept a CNIC or B-Form number raises the stakes above marks data — and
is a reason we route to the board rather than proxying the field ourselves.

---

## 3. Hard rules

| #   | Rule                                                                        | Why                                                                          |
| --- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | **No identifier in a URL, ever.** No `/result/<roll-number>` route exists   | A URL leaks into history, referrers, server logs and analytics automatically |
| 2   | **Lookup is POST-only**; `GET` returns 405                                  | Prevents accidental URL-borne identifiers                                    |
| 3   | **`no-store` + `noindex`** on any personal response, declared in two places | A result belongs to one person and must never reach a shared cache           |
| 4   | **Never in the sitemap**, never internally linked                           | Structurally excluded                                                        |
| 5   | **Never logged.** Not the roll number, name, or record                      | Logs are the most common accidental store                                    |
| 6   | **Never in a rate-limit key**                                               | Keys are retained in memory                                                  |
| 7   | **Never in analytics** — no identifier, name, marks or payload              | See §4                                                                       |
| 8   | **No retention.** A response is rendered and forgotten                      | Nothing to leak, subpoena or breach                                          |
| 9   | **No third-party transmission**                                             | No processor exists                                                          |

---

## 4. Analytics contract

Analytics is **feature-flagged off** and admits no origin to the CSP until real
configuration is supplied.

**Permitted events** (no parameters that identify anyone):

```
board_selected · result_search_started · result_search_success
result_search_error · official_source_clicked · gazette_clicked
```

**Forbidden as parameters — absolutely:** roll number · candidate name · father's name ·
CNIC/B-Form · marks · grade · any part of a result payload · any free-text user input.

When analytics is enabled it loads **only on the production host**, so preview and local
environments never emit events.

---

## 5. Separation of concerns

Four streams that must never merge:

| Stream              | Contains                                                 | Retention                    |
| ------------------- | -------------------------------------------------------- | ---------------------------- |
| Analytics           | aggregate, non-identifying events                        | per provider, no identifiers |
| Operational logs    | request ids, error digests, latency, source availability | short                        |
| Result data         | **not stored**                                           | n/a                          |
| Contact submissions | **none today**                                           | n/a — needs its own decision |

Merging operational logs with result data is the classic way a "we don't store results"
claim quietly becomes false. They stay separate by never putting a record into a log.

---

## 6. Indexation protection

Personal result responses must never become search landing pages:

- No URL exists for one
- POST-only
- `noindex, nofollow`
- Excluded from the sitemap structurally, not by a rule that could be forgotten
- Never linked publicly
- Disallowed in `robots.txt` for crawling — while pages that must show `noindex` are
  deliberately **not** disallowed

---

## 7. A hazard observed in this market

The DMC and result-card surface contains **tools that fabricate result cards** and
document-sharing sites hosting **individual students' real scanned result cards**.

This project publishes guidance about result documents and **never**: generates a result
card, hosts a candidate's document, or accepts an upload. Recorded here because the
temptation is a traffic opportunity, and it is one we refuse.

Similarly, one board's portal supports **name search**, which permits discovery without
knowing a roll number. We document that it exists — because a reader deserves to know how
their board works — and we do not build anything that makes enumeration easier.

---

## 8. Review triggers

Revisit when: a lookup endpoint ships · analytics is configured · any form is added ·
D1 is provisioned · a board grants a data-sharing agreement · advertising is enabled.

Each requires its own privacy decision **before** launch, not after.

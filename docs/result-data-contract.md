# Result Data Contract & Source Architecture

**Phase:** 2 — Architecture (blueprint; not implemented)
**Date:** 2026-09-14
**Current implementation:** `lib/result/types.ts`, `lib/result-sources/*`

---

## 1. The governing constraint

Phase 1 established, by loading every portal:

> **No board in Pakistan can currently be integrated.** Six confirmed CAPTCHAs across five boards,
> VIEWSTATE-protected forms that structurally reject synthetic posts, JavaScript-only
> portals, and **not one board publishing an API or any permission to automate**.

So this contract is designed for a system that **routes honestly today** and can accept a
real integration later **without a frontend rewrite** — not for one that pretends to look
results up.

`BOARD_ADAPTERS` stays empty. That is a policy state, not an unfinished feature, and a
test asserts it.

---

## 2. The normalized result record

The frontend consumes this shape and never a board's HTML.

```ts
type ResultRecord = {
  boardId: string
  boardCode: string | null
  className: '12' // this site covers the final Intermediate year only
  examination: ExaminationType // annual | second-annual | supplementary
  year: number
  group: GroupId | null // NEW — Sindh boards declare by group
  rollNumber: string // normalized uppercase

  candidateName: string | null
  fatherName: string | null

  subjects: SubjectRecord[]
  obtainedMarks: number | null
  totalMarks: number | null
  grade: string | null
  status: ResultStatus // pass | fail | absent | withheld | not-declared

  declaredAt: string | null

  // Provenance — required on every record
  sourceId: string
  sourceUrl: string
  fetchedAt: string
}
```

### Field rules

| Rule                                                  | Reason                                                                                  |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `sourceId`, `sourceUrl`, `fetchedAt` are **required** | A record with no provenance cannot be shown, corrected or audited                       |
| Everything a board may not publish is **nullable**    | A board that does not expose a field yields `null`, never a guess and never a zero      |
| `totalMarks` is nullable                              | HSSC is commonly out of 1100, but that is a scheme fact, not a safe default             |
| `status` includes `withheld`                          | Real and common; only one competitor even lists it                                      |
| No computed percentage is stored                      | It is derived at render from marks, so a formula change cannot silently rewrite history |

**Privacy-sensitive fields:** `rollNumber`, `candidateName`, `fatherName`, `subjects`,
marks. Handling rules are in `privacy-architecture.md`; the short version is that they
never enter a URL, a log, analytics, or a shared cache.

---

## 3. Lookup outcomes — a closed union

```ts
type LookupOutcome =
  | { kind: 'found'; record: ResultRecord; alsoAtBoards?: string[] }
  | { kind: 'not-found'; message: string }
  | { kind: 'not-announced'; message: string; boardId: string }
  | { kind: 'not-announced-for-group'; message: string; boardId: string; group: GroupId }
  | { kind: 'no-lookup-exists'; message: string; boardId: string; gazetteSourceId?: string }
  | { kind: 'unsupported'; message: string; boardId: string }
  | {
      kind: 'source-unavailable'
      message: string
      boardId: string
      retryAfterSeconds: number | null
    }
  | { kind: 'invalid-request'; message: string }
```

Two variants are **new in Phase 2**, and both come straight from the research:

- **`no-lookup-exists`** — Karachi, Hyderabad and AJK have no roll-number form at all.
  Answering "not found" there would be a lie; the honest answer names the gazette.
- **`not-announced-for-group`** — Karachi's Commerce group had not declared while six
  other groups had. A board-level "not announced" would be wrong for the other six.

There is deliberately no `{ found: boolean, record?: ... }` shape: it permits
`found: true` with no record, and lets "the source is down" render as "no such result".

---

## 4. Source adapter architecture

```
UI (server component)
      │
Result Service            ← owns timeouts, fallbacks, circuit breaking
      │
Source Registry           ← what exists, who owns it, what was observed
      │
Board Adapter (none yet)  ← per-board, isolated, replaceable
      │
Official Source
```

```
lib/result-sources/
├── types.ts        ResultSource, CapabilityStatus, SourceHealth
├── registry.ts     the records + the filter ladder
├── service.ts      resolve(query) -> { outcome, fallbacks }   [Phase 3]
├── adapters/       one file per board, registered only after review  [empty]
└── normalization/  board shape -> ResultRecord                [Phase 3]
```

**The isolation rule:** no component may contain board-specific parsing, URL building or
capability logic. A component receives a normalized outcome and renders it. This is what
makes adding a board a registry edit rather than a refactor.

### The filter ladder (already implemented)

```
getSourcesForBoard → verifiedSources → linkableSources → rollNumberSources
```

Components consume the **narrow** end. A gate asserts no student-facing helper ever
returns a board's full source set, so an unverified or dead source cannot reach a reader.

---

## 5. Integration decision gate

Every source carries one classification. Phase 1 evidence assigns them:

| Classification             | Boards                         | Basis                                                                    |
| -------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| `OUTBOUND_OFFICIAL`        | the default, nearly everywhere | CAPTCHA present, or absence unproven                                     |
| `GAZETTE_ONLY`             | Karachi, Hyderabad, AJK        | No lookup form exists                                                    |
| `STATUS_ONLY`              | Multan                         | reCAPTCHA confirmed; status is cacheable, lookup is not                  |
| `DIRECT_ALLOWED_CANDIDATE` | Sahiwal                        | Clean POST, stable names, permissive robots — **permission-conditional** |
| `OFFICIAL_API_CANDIDATE`   | Sargodha                       | Modern stack most likely to be able to grant one                         |
| `BLOCKED`                  | Faisalabad, FBISE, Kohat       | Host refuses automated requests                                          |
| `MANUAL_ONLY`              | Sukkur, Shaheed Benazirabad    | No working route found                                                   |
| `SMS_ONLY`                 | **none**                       | Zero verified shortcodes nationally                                      |

### Three rules that are not negotiable

1. **No architecture may include CAPTCHA bypass or anti-bot evasion.** A CAPTCHA moves a
   source permanently to `OUTBOUND_OFFICIAL`.
2. **A permissive `robots.txt` is not consent** to republish candidates' names, fathers'
   names and marks. `DIRECT_ALLOWED_CANDIDATE` requires written board permission before a
   single automated request.
3. **No promise of direct lookup** where the evidence does not support it. The interface
   must never render a form that cannot work.

---

## 6. Lookup states and the interface contract

Every state has a designed response. None fabricates success.

| State                        | What the reader is told                                         | Fallbacks offered                    |
| ---------------------------- | --------------------------------------------------------------- | ------------------------------------ |
| Invalid input                | Which field, and what shape is expected                         | —                                    |
| Unknown board                | The board is not covered; here is the directory                 | directory                            |
| Unsupported year             | Which sessions are covered                                      | covered sessions                     |
| **No lookup exists**         | This board publishes a gazette rather than a lookup             | **gazette (primary)**, official site |
| Not announced                | Not announced yet, with the last-checked date                   | official site, notifications         |
| Not announced for this group | Named groups declared; yours has not                            | per-group gazettes, official site    |
| Found                        | The record, with source and fetch time                          | —                                    |
| No matching record           | Checked and nothing matched; what usually causes that           | roll-number recovery guide           |
| Portal unavailable           | The board's portal is down — **not** that the result is missing | gazette, retry guidance              |
| CAPTCHA required             | You must complete a check on the board's own site               | direct link                          |
| Rate limited                 | Try again shortly                                               | —                                    |

**Fallbacks attach to every branch**, including success. A reader who gets a result still
benefits from the official link.

---

## 7. Error classes

```
VALIDATION_ERROR · BOARD_UNSUPPORTED · YEAR_UNSUPPORTED · NO_LOOKUP_EXISTS
RESULT_NOT_ANNOUNCED · RESULT_NOT_FOUND · SOURCE_UNAVAILABLE · SOURCE_BLOCKED
CAPTCHA_REQUIRED · RATE_LIMITED · INTERNAL_ERROR
```

Public errors are plain-language and actionable. Internal detail is logged with a
correlation id and never rendered. No stack trace, schema fragment or upstream body ever
reaches a response body.

---

## 8. Result-day posture

From the outage record: all nine Punjab boards announce simultaneously at 10:00 AM, and
boards have measurably collapsed under it.

| Principle                                                      | Consequence                                                                      |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Upstream is least available exactly when our traffic peaks** | No critical path may depend on a live upstream call                              |
| **A visitor's page load never triggers an upstream request**   | Status is served from our own store                                              |
| **Never auto-retry into a degrading portal**                   | Retries make a government outage worse                                           |
| **Circuit breaker**                                            | Repeated failure marks a source degraded and serves cached status with fallbacks |
| **Timeouts**                                                   | Bounded (8s), with the fallback ladder on timeout                                |

The system is therefore useful _because_ it does not depend on the boards being up.

---

## 9. What changes if a board grants access

The contract is designed so this is additive:

1. Register an adapter in `adapters/`, implementing `lookup(query, signal)`.
2. Flip that source's classification.
3. Add normalization mapping its shape to `ResultRecord`.
4. Add integration tests, including upstream-failure cases.

**No component, route, URL or page changes.** That is the whole point of the abstraction,
and it is why the empty adapter registry is not wasted structure.

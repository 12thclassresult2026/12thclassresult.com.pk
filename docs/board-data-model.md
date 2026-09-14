# Board Data Model

**Phase:** 2 — Architecture (blueprint; not implemented)
**Date:** 2026-09-14
**Current implementation:** `lib/board/types.ts`, `lib/board/registry.ts`

---

## 1. The problem this model must solve

Phase 1 produced one finding the existing model **cannot express**:

> There is not one board model in Pakistan. There are four, and they are orthogonal.

| Model                           | Boards                           | What breaks without it                                                        |
| ------------------------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| **Roll-number portal**          | most of Punjab, KPK, Balochistan | — (the assumed default)                                                       |
| **Gazette-only**                | Karachi, Hyderabad, AJK          | A roll-number call to action is shown for a board that **has no form at all** |
| **Group-staggered declaration** | Karachi, Hyderabad               | One `released` flag per board+year cannot hold seven different answers        |
| **Session-rotating portal**     | Peshawar, Mardan                 | A deep link built today points at a different class next month                |

The current `Board` type assumes model 1 everywhere. Every competitor makes the same
assumption and is therefore structurally wrong about roughly a fifth of the country.
**Correcting this is the highest-value architectural change in Phase 2.**

---

## 2. Two new orthogonal axes

They are separate fields because they vary independently: Karachi is gazette-only _and_
per-group; Peshawar is session-rotating _and_ whole-board.

```ts
/** HOW a candidate reaches their result at this board. */
type ResultAccessModel =
  | 'roll-number-portal' // a form accepts a roll number
  | 'gazette-only' // no lookup form exists; the gazette IS the route
  | 'session-rotating-portal' // the portal exposes one session at a time
  | 'unverified' // we could not establish how this board publishes

/** WHETHER the board declares all groups together. */
type DeclarationModel =
  | 'whole-board' // one declaration covers every group
  | 'per-group' // each group declares separately, on its own date
  | 'unknown'
```

### What each access model obliges the interface to do

| `ResultAccessModel`       | Primary action                                                | Forbidden                      |
| ------------------------- | ------------------------------------------------------------- | ------------------------------ |
| `roll-number-portal`      | "Check on the board's portal", plus what it will ask for      | —                              |
| `gazette-only`            | **"Find your group's gazette"**                               | Any roll-number call to action |
| `session-rotating-portal` | Link the portal **root**; warn that the session shown rotates | Deep-linking a session path    |
| `unverified`              | Link the board homepage; say plainly what is unverified       | Any capability claim           |

`session-rotating-portal` exists precisely so a link-rot hazard is encoded as data rather
than remembered by whoever writes the page.

---

## 3. Capability status — replacing the tri-state

`boolean | null` served its purpose, but it conflates two different unknowns: _we have
not checked_ and _the board prevents us from checking_.

```ts
type CapabilityStatus =
  | 'verified-supported' // observed working on the board's own page
  | 'verified-unsupported' // observed absent on pages actually fetched
  | 'unknown' // not checked, or not establishable
  | 'temporarily-unavailable' // the board offers it; it is down right now
  | 'blocked' // we are prevented from checking (WAF / CAPTCHA)
  | 'manual-only' // exists, but only through an offline process
```

**Migration is lossless, and adds information:**

| Now                                 | Becomes                             |
| ----------------------------------- | ----------------------------------- |
| `true`                              | `verified-supported`                |
| `false`                             | `verified-unsupported`              |
| `null`                              | `unknown`                           |
| `null` **and the host returns 403** | **`blocked`** ← the new information |

Faisalabad, FBISE and Kohat move from `unknown` to `blocked` — the honest distinction
between "not checked" and "the host refuses automated requests".

**The display rule is unchanged and non-negotiable:** only `verified-supported` may be
advertised. Everything else renders as its own honest phrase, never as "No".
`capabilityLabel()` gains cases; it never gains a default-to-false branch.

---

## 4. The board model

```ts
type Board = {
  id: string // stable, internal, never derived from a URL
  slug: string // the URL segment; {city}-board
  officialName: string
  shortName: string
  province: Province
  officialWebsite: string

  // NEW — the two axes
  accessModel: ResultAccessModel
  declarationModel: DeclarationModel

  sourceIds: string[]
  publishState: PublishState // planned | draft | review | published

  resultDate: VerifiedFact<string>
  smsCode: VerifiedFact<string>
  gazetteAvailable: VerifiedFact<boolean>

  resultDatasets: ResultDataset[] // group-aware, see section 5

  studentCautions?: string[]
  lastVerifiedAt: string | null
}
```

`officialWebsite` stays required and non-empty: a board with no verified website is not
registered at all.

---

## 5. Result datasets become group-aware

```ts
type ResultDataset = {
  examLevel: ExamLevel
  year: number

  /** NEW. null = a whole-board declaration covering every group. */
  group: GroupId | null

  /** NEW. Per-group declaration date — Karachi's groups differ by ~4 weeks. */
  declaredAt: VerifiedFact<string>

  /** Methods confirmed for THIS exam, year and group. Never inherited. */
  methodsConfirmed: DatasetMethods

  released: VerifiedFact<boolean>

  /** NEW. For a gazette-only board this is the access route, not an extra. */
  gazetteSourceId?: string
}

type GroupId =
  | 'pre-medical'
  | 'pre-engineering'
  | 'science-general'
  | 'commerce'
  | 'humanities'
  | 'home-economics'
  | 'medical-technology'
```

Karachi's 2026 Part-II session is therefore **seven dataset rows** — six with
`released: confirmed` and distinct `declaredAt`, and Commerce with `released: unknown`
because it had not declared. No other shape can represent that truthfully.

A whole-board board keeps exactly one row with `group: null`. The model costs nothing
where it is not needed.

---

## 6. Two independent state axes

Announcement state and source availability must be separable, because **a result can be
officially announced while the portal is offline** — the normal condition on result
morning.

```
Announcement (about the world)        Availability (about a server)
  not-announced                         unknown
  expected                              online
  announced                             degraded
  live                                  offline
  archived                              blocked
```

These are already separate types (`ResultState`, `SourceAvailability`). The architectural
rule: **no code may derive one from the other.** An HTTP 200 never implies `announced`,
and `offline` never implies `not-announced`.

The interface composes them:

| Announcement  | Availability | Message                                                                                 |
| ------------- | ------------ | --------------------------------------------------------------------------------------- |
| announced     | online       | Result is out — check on the board's portal                                             |
| **announced** | **offline**  | **Result is out, but the board's portal is down. Try the gazette, or try again later.** |
| not-announced | online       | Not announced yet; the portal is up but has nothing for this session                    |
| not-announced | blocked      | Not announced yet, and we cannot check this board automatically                         |

The highlighted row is the one every competitor gets wrong on result day.

---

## 7. Board page content contract

A board page ships only if it carries board-specific verified value. Minimum:

1. **The status sentence** — self-contained and extractable: board + exam + session + status + date + time + timezone.
2. **The right primary action for its `accessModel`** (§2).
3. **What the portal actually asks for** — extra identifier, security check — only where verified.
4. **Board-specific cautions** — expired certificates, rotating sessions, dead links the board itself publishes.
5. **Provenance** — source link and last-checked date.
6. **Per-group status**, where `declarationModel` is `per-group`.

**Rejected:** a template whose only difference is the board name. A validation gate
measures distinct-versus-shared rendered lines, and a page that cannot clear the
threshold does not publish.

---

## 8. Registry mechanics

A frozen array with `Map` lookups by `id` and `slug` — unchanged, and adequate at 28
rows. Verification timestamps stay hoisted into named constants so a re-check moves one
date rather than twenty.

New derived selectors for Phase 3:

```ts
gazetteOnlyBoards()
perGroupBoards()
boardsByAccessModel(model)
datasetsFor(boardId, year) // all groups
datasetFor(boardId, year, group) // one group
```

Adding, updating or removing a board must touch **only** the registry and its source
records — never a component.

---

## 9. Migration plan (Phase 3)

1. Add `accessModel` and `declarationModel`; populate all 10 registered boards from the capability matrix.
2. Add `group`, `declaredAt` and `gazetteSourceId` to `ResultDataset`; default `group: null`.
3. Introduce `CapabilityStatus`; migrate flags mechanically; set `blocked` for the three WAF-blocked boards.
4. Extend `capabilityLabel()` for the new states, with no default-to-false branch.
5. Register the 16 verified non-Punjab boards as `planned`.
6. Apply the two factual corrections in `research/result-source-risk-register.md` §6.
7. Add gates: every board has an `accessModel`; a `gazette-only` board exposes no roll-number call to action; a `per-group` board has at least two datasets for a released year.

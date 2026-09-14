# Page Family Specifications

**Phase:** 2 — Architecture (blueprint; not implemented)
**Date:** 2026-09-14

Each approved family below defines what makes an instance worth existing. A generator
that cannot satisfy a family's required unique data **must fail**, not emit filler.

---

## 0. The universal publish gate

Every indexable page, hand-written or generated, passes all of these:

1. **Real entity** — a registered board, a real session, a real document.
2. **One `intentId`**, owned by no other published page.
3. **Required unique data present** — per family, below.
4. **Source satisfied** — `direct` pages register a source; `derived` pages hard-code no volatile fact.
5. **Unique metadata** — title, H1, description unique across the whole inventory.
6. **Contextual inbound link** — footer links do not count.
7. **Similarity below threshold** — §9.
8. **Freshness satisfied** — class A/B need `lastReviewedAt`.
9. **Publication review passed** — assessed from the rendered page, not the data.

Failing any one blocks publication. Nine gates, all machine-checkable except the last.

---

## 1. Board result page ★

**Route** `/results/<board-slug>/12th-class` · **Intent** `result.board` · **Parent** result hub
**Freshness** A in season, C out · **Schema** WebPage + BreadcrumbList

### Required unique data — all must be present

| Field                                                       | Source          |
| ----------------------------------------------------------- | --------------- |
| Verified official website                                   | board registry  |
| At least one verified source record                         | source registry |
| `accessModel`                                               | board registry  |
| Current-session status as a `VerifiedFact`                  | result dataset  |
| Observed portal requirements, or an explicit "not verified" | source record   |

### Required modules

Status sentence → access-model action → capability table → board cautions → provenance →
fallback ladder → per-group status (if `declarationModel: 'per-group'`).

### Variants by access model

| Access model              | Primary action                     | Must not render                |
| ------------------------- | ---------------------------------- | ------------------------------ |
| `roll-number-portal`      | Portal link + what it asks for     | —                              |
| `gazette-only`            | **Gazette navigation**             | Any roll-number call to action |
| `session-rotating-portal` | Portal **root** + rotation warning | A deep session link            |
| `unverified`              | Homepage link + what is unverified | Any capability claim           |

### Rejection criteria

Board name is the only difference from a sibling page · no verified source · status
asserted without provenance · a roll-number call to action on a gazette-only board.

---

## 2. Result hub (evergreen) ★

**Route** `/results/12th-class` · **Intent** `result.head` · **Freshness** B · **Status** built

Owns the head term and the terminology explainer (12th class ≡ 2nd year ≡ HSSC Part-II ≡
Inter Part-II). Carries the national board table, method sections, and — critically —
**what has not been announced**, with the date checked.

Must **not** own a year term as primary. Must **not** list an SMS shortcode.

---

## 3. Session hub

**Route** `/results/12th-class/<year>` · **Intent** `result.session.current` · **Freshness** A → D when archived

**Required unique data:** per-board declaration status for that session, with at least
one board carrying a `confirmed` or `historical` fact.

**Publish gate:** created only when the session has real content. A session hub whose
every row reads "not announced" is a page about nothing — that content belongs as a
section on the evergreen hub until at least one board declares.

At session end: `status: archived`, freshness → D, and the page keeps its URL as a dated
record.

---

## 4. Board session archive

**Route** `/results/<board-slug>/12th-class/<year>` · **Intent** `result.board.session`

**Publish gate — at least two of:** a verified declared date · a board-published gazette
for that session · verified statistics · a session-specific method that differed.

Otherwise it is a section on the yearless board page, not a URL. **This gate is what
prevents 28 boards × N years of thin permutations.**

---

## 5. Board directory ★

**Route** `/boards` · **Intent** `board.directory` · **Freshness** C · **Status** built

Lists **all** registered boards including `planned` ones — that is the point of the
registry-first model. A planned board is named, described and linked to its official
source, and is **not** linked to a page that does not exist.

Shows honestly which boards could not be verified, and why.

---

## 6. Gazette hub / per-board / archive

**Routes** `/gazettes/12th-class`, `/gazettes/<board-slug>`, `/gazettes/12th-class/archive`

**Required unique data:** at least one gazette reference verified on that board's own
domain, with session, year and source URL.

Currently satisfied by 8 boards. **No KPK board publishes a gazette** — so no KPK gazette
page may exist.

Rules: a **statistics sheet is not a per-candidate gazette** and is labelled as what it
is; we **link**, we do not host (see `data-storage-decision.md` §4); file offers state
what the file is and where it came from.

For gazette-only boards this page is the **primary result route**, and is linked as such.

---

## 7. Rechecking guide + per-board ★

**Routes** `/guides/rechecking`, `/guides/rechecking/<board-slug>` · **Intent** `post.rechecking` · **Freshness** B

The highest-value family in the inventory — the intent is a vacuum, and we hold
primary-source data for six boards.

### The hub must lead with what rechecking is _not_

Two boards state, in their own words and one citing superior-court decisions, that
**re-marking cannot be done under any circumstances**. Rechecking verifies totalling,
transfer, unmarked portions and script identity. That single fact is the most
misunderstood point in the topic and almost nobody conveys it.

### Per-board required unique data

Fee · deadline · mode (online / hybrid / manual) · refund rule · whether the board states
the re-marking exclusion itself.

**Only 6 boards qualify today.** A board with no published figures gets a row on the hub
saying so — not a page.

### Two traps encoded as data, not memory

- One board's rule barring improvement governs **professional examinations**, not HSSC. It must never be cited as an Intermediate rule.
- One board's form fee may be superseded while its script fee is not.

Both live in the rechecking record as explicit notes, so they cannot be lost.

---

## 8. Guides and tools

| Route                                  | Intent                | Required unique value                                                           |
| -------------------------------------- | --------------------- | ------------------------------------------------------------------------------- |
| `/guides/second-annual`                | `post.second-annual`  | Compartment rules from statutory text; owns both vocabularies                   |
| `/guides/improvement`                  | `post.improvement`    | Better-of-two rule; **carries the supersession caveat**                         |
| `/guides/lost-roll-number`             | `trouble.roll-number` | Recovery procedure — never framed as name lookup                                |
| `/guides/result-card-dmc`              | `post.dmc`            | Guidance only; never a generator, never a hosted document                       |
| `/guides/how-percentage-is-calculated` | `compute.percentage`  | The Pakistan rule (marks out of 1100), against a foreign formula in circulation |
| `/tools/percentage-calculator`         | —                     | Must actually calculate                                                         |

**Tool rule:** a tool page performs the claimed task. No aggregate formula is hard-coded
without source and admission-cycle metadata, because weightings change by institution
and cycle.

---

## 9. Programmatic generation & similarity control

Generated families: board result pages, board session archives, per-board gazette pages,
per-board rechecking pages.

### Generation contract

Each generator declares its **source registry**, its **required unique fields**, and its
**failure mode — which is to throw.** A generator never emits a page with a missing
required field, and never substitutes a placeholder.

### Similarity checks

| Check                                               | Threshold                                                            |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| Duplicate title / H1 / description                  | **zero tolerance** (already enforced)                                |
| Duplicate canonical                                 | zero tolerance                                                       |
| Identical section sequence across a family          | flag for review                                                      |
| Rendered-line overlap between two pages in a family | **distinct lines must clear a floor**; measured from rendered output |
| Board-name-swap detection                           | substituting the board name must not make two pages equal            |

The rendered-line measure is the meaningful one: the sibling project found nine defects
that "were invisible in the data and obvious on the page". Similarity is therefore
assessed **after** rendering, not on the registry.

---

## 10. Family status summary

| Family                                                             | Status             | Count today              |
| ------------------------------------------------------------------ | ------------------ | ------------------------ |
| Home, result hub, board directory                                  | **built**          | 3                        |
| Board result pages                                                 | approved, gated    | ≤ 28 (10 registered)     |
| Session hub                                                        | approved, gated    | 0 until a board declares |
| Board session archives                                             | approved, gated    | expect single digits     |
| Gazette hub / per-board / archive                                  | approved           | 8 boards qualify         |
| Rechecking hub + per-board                                         | approved ★         | 6 boards qualify         |
| Guides                                                             | approved           | 6                        |
| Tools                                                              | approved           | 1                        |
| Board hubs, province hubs, updates, admissions                     | **conditional**    | 0                        |
| Punjab group pages                                                 | conditional, gated | 0                        |
| SMS, name lookup, position holders, verification, entry-test tools | **rejected**       | 0                        |
| Personal result URLs                                               | **prohibited**     | never                    |

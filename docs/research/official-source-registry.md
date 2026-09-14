# Official Source Registry — Evidence Record

**Research date:** 2026-09-14
**Machine-readable counterpart:** `lib/result-sources/registry.ts`

This file records _how_ each source was verified. The code registry is the single
source of truth for what the site renders; this document explains why each record
says what it says.

---

## The evidence standard

A domain is treated as **officially owned by a board** only when identifying details
were observed on the live page that a squatter or aggregator would not carry — the
board's formal name, a government or ministry affiliation line, its own copyright
line, and a `.edu.pk` registration where applicable.

**Search-engine listings and competitor sites were used ONLY to discover candidate
domains — never as evidence of a fact.** A domain that merely looks like a board,
shares its branding, or is widely linked is not thereby the board: that is a test a
copied lookalike page also passes.

Corollaries enforced in code and tests:

- `isOfficial: true` requires `ownershipStatus: 'verified'`.
- A source with `observedVia: 'not-observed'` may claim **no** capabilities, **no**
  exam levels and **no** years, and may not record a successful check.
- Every source carries a prose `provenanceNote` recording what was seen **and what
  was not**.

---

## Access policy

`AUTOMATED_FETCH_POLICY = 'do-not-bypass'`, asserted repo-wide and covered by a test.

During this pass: no user agent was spoofed, no browser was emulated, no CAPTCHA was
touched, no form was submitted, no candidate identifier was entered, and **no URL was
constructed by editing a year token in someone else's address**.

Five hosts refused automated requests with HTTP 403. Each is recorded as
`status: 'blocked'` with `observedVia: 'not-observed'`. None was evaded, and a 403 is
explicitly **not** recorded as an outage — it is a WAF user-agent block, and those
sites are very likely fine in an ordinary browser.

---

## Registered sources

| id                                       | Board      | Type     | Observed         | Status  | Integration              |
| ---------------------------------------- | ---------- | -------- | ---------------- | ------- | ------------------------ |
| `lahore-result-portal`                   | Lahore     | result   | automated-fetch  | online  | official-link            |
| `gujranwala-result-portal`               | Gujranwala | result   | automated-fetch  | online  | official-link            |
| `gujranwala-gazette`                     | Gujranwala | gazette  | automated-fetch  | online  | gazette-guidance         |
| `faisalabad-official-base`               | Faisalabad | homepage | **not-observed** | blocked | manual-verification-only |
| `multan-result-archive`                  | Multan     | result   | automated-fetch  | online  | official-link            |
| `multan-gazette`                         | Multan     | gazette  | automated-fetch  | online  | gazette-guidance         |
| `rawalpindi-result-portal`               | Rawalpindi | result   | automated-fetch  | online  | official-link            |
| `sargodha-result-portal`                 | Sargodha   | result   | automated-fetch  | online  | official-link            |
| `bahawalpur-result-portal`               | Bahawalpur | result   | automated-fetch  | online  | official-link            |
| `bahawalpur-result-portal-second-annual` | Bahawalpur | result   | automated-fetch  | online  | official-link            |
| `sahiwal-result-portal`                  | Sahiwal    | result   | automated-fetch  | online  | official-link            |
| `sahiwal-gazette`                        | Sahiwal    | gazette  | automated-fetch  | online  | gazette-guidance         |
| `dg-khan-result-directory`               | DG Khan    | result   | automated-fetch  | online  | official-link            |
| `fbise-result-portal`                    | FBISE      | result   | **not-observed** | blocked | manual-verification-only |

---

## Distinctions that were kept apart deliberately

### Engine capability is not dataset capability

A portal offering "12th" in one dropdown and "2026" in another has described a
**cross-product of form options**. It has not confirmed that a 2026 HSSC Part-II
dataset sits behind them.

This is why every board's 2026 dataset carries `methodsConfirmed` of all-`null` while
several sources carry `supportsRollNumber: true`. The source flag describes the
_form_; the dataset flag would describe _this exam and this year_. There is
deliberately no field combining them and no fallback from one to the other.

### A gazette is not a statistics sheet

Sahiwal's gazette page carries an entry labelled _"Stats Inter 2nd Annual 2026"_. A
statistics sheet is not a per-candidate gazette and is not described as one.

Multan's Part-II gazette content appears only inside **combined 2017 and 2018**
intermediate gazettes — recorded as `historical`, not as a current Part-II series.

### A result archive is not an announcement

Several portals expose past sessions. An archive proves history; it never confirms
the current session. Nothing in this registry treats the existence of a year option,
an archive entry, or an HTTP 200 as evidence that a result is declared.

---

## Source hierarchy applied (section 28)

1. Official education board — **the only accepted authority for every fact here**
2. Official government/education department
3. Official result portal
4. Official gazette/document
5. Reputable primary reporting
6. Reliable secondary reporting
7. Competitors — **discovery only**

No fact in the code registry rests on tier 5, 6 or 7.

# Operations Report

**Cycle:** 2026 · **Date:** 2026-09-14 · **Status:** **ACTION REQUIRED — not launched**

The first Phase 8 maintenance pass. Most of Phase 8's monitoring surface needs a live site and
has no data yet; what could be measured, was.

---

## 1. Operational status

| Area             | State                                                          |
| ---------------- | -------------------------------------------------------------- |
| Production       | **Not launched.** Worker deployed, no routes — nothing public. |
| Repository       | Local only; no remote configured                               |
| Result engine    | Healthy — 39 tests green, no adapter registered by policy      |
| Freshness        | 0 critical, 1 low finding                                      |
| Official sources | 26 of 28 reachable, 0 moved or removed                         |
| Quality gate     | Green — 290 tests                                              |

**Blocker:** the `12thclassresult.com.pk` zone is not on the authenticated Cloudflare account.
See `launch-report.md`. Everything in this report is pre-launch baseline.

---

## 2. Current result cycle

```
Year:               2026 (HSSC Part-II)
Current state:      Undeclared for 27 of 28 boards
Confirmed dates:    1 — BBISE Quetta, 2026-07-20
Last verification:  2026-09-14
```

No board other than Quetta has published a date this project could verify. Dates circulating
elsewhere for this session remain untraceable to any board notification and are not carried.

---

## 3. Official source health (§30)

One request per source, sequential, 700 ms apart, 12 s timeout, no retries, no content parsing.
Status line only — no form submitted, no identifier sent.

| Verdict       | Count | Sources                                       |
| ------------- | ----: | --------------------------------------------- |
| **OK** 200    |    26 | —                                             |
| **TIMEOUT**   |     2 | `bahawalpur-result-portal`, `…-second-annual` |
| Moved/removed |     0 | —                                             |

### Bahawalpur timeouts — expected, not new

Both Bahawalpur portals timed out. This **corroborates** the Phase 1 risk register, which rates
Bahawalpur the highest outage risk nationally with a documented >1 hour failure, plus a `www`
certificate mismatch. No registry change: the source is not gone, it is characteristically slow.

### Two `blocked` sources now answer — REQUIRES MANUAL RE-VERIFICATION

| Source                     | Registry status | Live today |
| -------------------------- | --------------- | ---------- |
| `faisalabad-official-base` | `blocked`       | **200 OK** |
| `fbise-result-portal`      | `blocked`       | **200 OK** |

These are the two `manual-verification-only` sources, and they are why BISE Faisalabad and FBISE
both sit at `accessModel: 'unverified'` — their hosts previously refused automated requests.

**The registry has deliberately NOT been changed.** A 200 on a base URL is evidence that the
host answered a plain GET today. It is **not** evidence that:

- the result portal is usable,
- a CAPTCHA is absent,
- the access model is what we would guess.

Treating a successful fetch as capability verification is the exact error this project overrode
a research agent on in Phase 1. These need a human opening them in an ordinary browser.

**Priority: HIGH.** FBISE is a national board, and both are currently `unverified` — the least
useful state a board page can be in.

---

## 4. Freshness (§7)

Detector: `lib/freshness/stale.ts`, gated by `tests/validation/freshness.test.ts`.

| Severity     | Today | +35 days | Notes                                   |
| ------------ | ----: | -------: | --------------------------------------- |
| **Critical** |     0 |        0 | Blocks the build                        |
| High         |     0 |        3 | Class-B pages lapse at 30 days          |
| Medium       |     0 |       56 | 28 boards + 28 sources lapse at 30 days |
| Low          |     1 |        1 | —                                       |

### The one standing finding

```
[result-date-archivable] bbise
    confirmed result date 2026-07-20 is 56 days old; consider archiving the session
```

Legitimate and actionable. Quetta's 2026 session is complete; the page is still correct, so this
is a prompt to archive rather than a defect.

### Proof the detector works

Wound forward 35 days it reports 60 findings; at 400 days the whole registry reads as stale.
That matters — a staleness check that is quiet because it is broken looks identical to one that
is quiet because the site is fresh, so the clock is moved deliberately in the tests.

---

## 5. Search Console — NO DATA

Blocked on launch. Nothing is indexed because nothing is served. No property exists, no sitemap
has been submitted, and there are no queries, impressions, clicks or Core Web Vitals field data
to analyse.

Everything in §21–§27 of the Phase 8 brief — query-to-page mapping, CTR work, position 4–15
opportunities, indexing anomalies, decay detection — resumes when the site is live and has
accumulated data. Claiming any of it now would be fabrication.

---

## 6. Content inventory

| State                   | Count | Notes                                      |
| ----------------------- | ----: | ------------------------------------------ |
| Published + indexable   |     6 | home, result hub, boards, 2 guides, 1 tool |
| Draft (routed, noindex) |     1 | Karachi board page                         |
| Planned (no route)      |    28 | 27 board pages + the 2026 year hub         |
| Broken internal links   |     0 | —                                          |
| Orphans                 |     0 | —                                          |

**27 of 28 boards have no page.** Not a launch blocker, but it is the single biggest gap in the
product and the clearest next body of work.

---

## 7. Technical health

| Check               | Result                                 |
| ------------------- | -------------------------------------- |
| Build               | PASS                                   |
| Typecheck           | PASS — strict                          |
| Lint                | PASS — 0 errors, 0 warnings            |
| Tests               | 290 (118 validation, 100 unit, 72 e2e) |
| Dependencies        | 0 vulnerabilities across 674 packages  |
| Worker bundle       | 1078.81 KiB gzip of a 3 MiB ceiling    |
| Client JS           | 172 KB gzipped (framework baseline)    |
| Third-party scripts | none                                   |

### Standing dependency note

`eslint@9.39.5` prints an end-of-support notice. ESLint 10 remains rejected per ADR-002 —
`eslint-config-next`'s plugin set is not ESLint 10 ready. Re-evaluate when it is; do not upgrade
blindly (§58).

---

## 8. Security and privacy

No change since the Phase 7 audit. No analytics installed, so no personal data can reach one.
No secrets in the tree or history. Full security header set. Personal-result URLs 404 with
`noindex` and `no-store`.

---

## 9. Next cycle (2027) readiness — NOT READY, and correctly so

`docs/year-rollover.md` now exists and defines the gate. Nothing 2027 should be created yet, and
the freshness detector fails the build on any future-year page, so this is enforced rather than
remembered.

---

## 10. Priority actions

### Critical

1. **Resolve the Cloudflare zone.** Either add `12thclassresult.com.pk` to the authenticated
   account, or log in to the account that holds it. Everything else is ready; the `routes` block
   to restore is recorded verbatim in `wrangler.jsonc`.

### High

2. **Manually re-verify Faisalabad and FBISE** in an ordinary browser. Both now answer automated
   requests. If their portals are usable, two boards move off `unverified` — and one is a
   national board.
3. **Build out board pages.** 27 of 28 boards have no page. Quetta first: it is the only board
   with a confirmed 2026 result.

### Medium

4. Archive Quetta's 2026 session, clearing the standing freshness finding.
5. Configure a git remote so CI can run.

### Low

6. Re-check Bahawalpur when convenient; expect it to stay slow.

---

## Reporting cadence

This report is regenerated per maintenance cycle. Pre-launch it is a baseline; once live it
gains the Search Console, indexing and performance sections that currently have no data.

# Operations

**Phase:** 3 — as implemented
**Date:** 2026-09-14

Day-to-day running of the site. No secrets appear here or anywhere in the repository.

---

## 1. Local development

```bash
npm ci          # install from the lockfile
npm run dev     # http://localhost:3000
npm run check   # the full gate: format, lint, typecheck, validate, test, build
```

Node is pinned to 24.19.0 via `.nvmrc` and `.node-version`; `engines` requires >= 22.11.0.

---

## 2. The quality gate

```
format:check → lint → typecheck → validate → test → build
```

**Nothing deploys on a red gate.** Current state: **155 tests** — 76 validation, 41 unit, 38 end-to-end across desktop and mobile.

`validate` is the one to understand. Unit tests check that functions work; **validation
tests check that the published site is honest.** They import the real registries and
assert invariants across the whole inventory, so a content mistake fails a build instead
of reaching a reader.

---

## 3. Changing a fact

A fact change is a code change, deliberately — it is reviewable, attributable and
revertible, and it invalidates every derived page atomically.

1. **Re-check the source.** Load the board's own page. Never a competitor, never a search snippet.
2. **Edit the registry** — `lib/board/registry.ts` or `lib/result-sources/registry.ts`.
3. **Update the timestamps that actually changed:**
   - `checkedAt` — you looked
   - `sourcePublishedAt` — the source published it
   - `lastVerifiedAt` — the record was re-verified
   - `contentUpdatedAt` — the content itself changed
4. `npm run check`
5. Commit with what you saw, and where.

> **Never move a visible date because a build ran.** Competitors auto-stamp today's date
> on every page, which makes freshness meaningless. Dates change when facts change.

### Adding a board

Add the registry entry with `publishState: 'planned'`, plus its source records. The
board appears in the directory immediately — named, described, linked to its official
source — with **no page**. That is the registry-first model working, not a gap.

A board only gets a route when its page is built, at which point `publishState` becomes
`draft`, and `published` after a review conducted from the rendered page.

---

## 4. Diagnosing common failures

| Symptom                                   | Cause                                                | Fix                                                             |
| ----------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------- |
| `Unknown page id: x` at build             | A route references a registry id that does not exist | Add the entry, or fix the id. This failing loudly is the design |
| Duplicate title / H1 / description        | Two pages share metadata                             | Differentiate. Do not weaken the gate                           |
| Orphan page                               | Indexable with no inbound contextual link            | Link it from a relevant page, or mark it an entry point         |
| Intent conflict                           | Two live pages claim one entity-scoped intent        | One of them is a duplicate. Merge or re-scope                   |
| `stage-prerender-cache` exits non-zero    | The build produced no cache to stage                 | Re-run the OpenNext build. **Never deploy past this**           |
| Board page shows the wrong call to action | `accessModel` is wrong for that board                | Fix the registry, not the component                             |
| A capability renders as "No" unexpectedly | Something bypassed `capabilityLabel`                 | Find the coercion; a gate exists to catch `? 'Yes' : 'No'`      |

---

## 5. Source status troubleshooting

When a board's site changes:

| Observation                                   | Record it as                                                          |
| --------------------------------------------- | --------------------------------------------------------------------- |
| Page loads, feature present                   | `verified-supported`                                                  |
| Page loads, feature genuinely absent          | `verified-unsupported`                                                |
| Page loads, could not tell                    | `unknown`                                                             |
| Host returns 403 / refuses automated requests | `blocked` **and** `status: 'blocked'`                                 |
| Host returns 5xx or times out                 | `temporarily-unavailable`                                             |
| URL now 404s                                  | `status: 'offline'` — it drops out of `linkableSources` automatically |

**A 403 is never recorded as an outage.** It is a WAF user-agent block, and those sites
are very likely fine in an ordinary browser.

### The access policy is not negotiable

`AUTOMATED_FETCH_POLICY = 'do-not-bypass'`, and a test greps the repository for
violations. No user agent is spoofed, no CAPTCHA touched, no form submitted, no
identifier entered, no 403 retried with different headers, and no URL built by editing a
year token in someone else's address.

These are government servers, and several have measurably collapsed under result-day
load. Checks stay infrequent and stop on repeated failure rather than retrying.

---

## 6. Preview and deploy

```bash
npm run preview   # opennext build -> stage cache -> local workerd preview
npm run deploy    # opennext build -> stage cache -> deploy
```

> **Never run `opennextjs-cloudflare deploy` directly.** It skips the cache staging step,
> and the failure it causes is intermittent rather than obvious — see §7.

Pre-deploy checklist is in `deployment.md`. In short: correct branch and clean tree,
correct remote, correct Cloudflare account, gate green, dry-run showing expected bindings
only, no secret committed, no draft page in the sitemap, no fabricated data.

---

## 7. The Error 1102 failure mode

The one production failure worth recognising on sight.

**Symptom:** intermittent "Worker exceeded resource limits" under load, with a clean
error log and no exception.

**Cause:** the prerender cache was not staged into the uploaded assets, so every request
misses and the Worker re-renders the whole React tree. A page that should cost tens of
milliseconds of CPU costs hundreds.

**Diagnosis:** a cache **miss** on a route the build marked prerendered. That specific
combination is the signature.

**Prevention:** `stage-cache` runs inside both `preview` and `deploy`, and exits non-zero
if it stages nothing. Check its file count after every deploy — it should match the
build.

---

## 8. Result-day operations

All nine Punjab boards announce simultaneously at 10:00 AM, and boards have measurably
failed under it.

| Principle                                      | Why                                                              |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| Static pages cannot fail because a board fails | The site stays up when boards do not                             |
| A page load never triggers an upstream request | Thousands of readers never become thousands of upstream requests |
| Never auto-retry into a degrading portal       | Retries worsen a government outage                               |
| Verify, then deploy                            | Status is pre-verified, not fetched live                         |

On a declaration day: re-check the board's own page, update the registry, run the gate,
deploy. Class A facts move to daily verification for the duration of the season.

---

## 9. Rollback

`npx wrangler deployments list`, then `npx wrangler rollback`.

Prefer deploying forward. A rollback past the commit that attached a hostname leaves that
hostname pointing at nothing.

---

## 10. Logging

Only `error.digest`, route and timestamp. **Never** secrets, authorization headers, roll
numbers, candidate or father names, marks, result records or request bodies.

The reader is shown the digest as a reference, so a report can be matched to a log line
without storing anything about the reader.

---

## 11. Launch state and the first deploy

**The site has never been deployed.** This section is the handoff for whoever does it.

### The two gates that are still closed

| Gate               | State                                                              |
| ------------------ | ------------------------------------------------------------------ |
| GitHub remote      | Not configured. Credentials unreadable non-interactively.          |
| Cloudflare account | Authenticated as `11thclassresult@gmail.com` — the sibling project |

Neither is a code problem. Both need an owner decision, and until they are settled a deploy is
an absolute launch blocker under the Phase 7 rules.

### Sequence once they are settled

1. **Confirm the Cloudflare account** holds the `12thclassresult.com.pk` zone.
   `wrangler whoami` shows the current login; switch with `wrangler login` if it is wrong.
2. **Configure the remote** and push `main` to `12thclassresult-sys/12thclassresult.com.pk`.
   Never force-push; never create a second repository if auth fails.
3. **Verify CI** on the remote. Local green does not guarantee remote green.
4. **Add the `routes` entry** to `wrangler.jsonc` — only now, and only with the confirmed zone.
   A `routes` entry naming a zone the account does not hold fails the deploy outright.
5. **Deploy:** `npm run deploy` (which runs the OpenNext build, `stage-cache`, then wrangler).
6. **Smoke test** the live apex: `/`, `/robots.txt`, `/sitemap.xml`, the result hub, the board
   page, a 404, and the calculator.
7. **Check live headers** — particularly that the production apex does _not_ carry the
   preview `X-Robots-Tag: noindex`, which every non-apex host does by design.
8. **Search Console** only after the smoke test passes.

### Rolling back a first deploy

There is no previous version to revert to, and no database to restore — no D1, KV or R2 binding
exists. Rollback of a first deploy means removing the Worker route so the domain stops serving.
That is the whole procedure.

### Why `www` is not in `routes` yet

When it is added it exists for exactly one purpose: giving the permanent `www → apex` redirect a
hostname that resolves. It must never pass the production-host check, so that if the redirect
ever failed open, `www` emits `noindex` and an apex canonical rather than quietly duplicating
the site.

---

## 12. Freshness operations

The stale-content detector lives in [`lib/freshness/stale.ts`](../lib/freshness/stale.ts) and is
gated by `tests/validation/freshness.test.ts`, which runs inside `npm run validate` and therefore
inside `npm run check`.

### What blocks a build

**Only `critical` findings.** Staleness is continuous, so a gate that failed on every medium
finding would be red most of the year and would train everyone to ignore it. Critical means a
reader is being told something false _right now_:

| Check                      | Why it is critical                                                         |
| -------------------------- | -------------------------------------------------------------------------- |
| `result-date-passed`       | An expected date came and went and was never confirmed                     |
| `unsourced-sms`            | A shortcode with no source — an SMS is charged, so a wrong one costs money |
| `old-year-in-metadata`     | A past year presented as the current cycle                                 |
| `future-year-page`         | A next-year page published before that cycle exists                        |
| `review-overdue` (class A) | Live result status not reviewed inside its 3-day cadence                   |

Everything else is reported, not enforced.

### Review cadence

Derived from `freshnessClass`, never stored — a stored `nextReviewAt` would be a second copy of
a fact that can disagree with the first.

| Class | Cadence  | Applies to                         |
| ----- | -------- | ---------------------------------- |
| A     | 3 days   | Live result status during a season |
| B     | 30 days  | Dates, announcements, fees         |
| C     | 90 days  | Board procedure and methods        |
| D     | 365 days | Evergreen explanation              |

### Reading the report

When a critical finding fires, the full report prints in the test failure. To see the
non-blocking findings, call `detectStaleContent(new Date())` and `formatStaleReport(...)` from a
scratch test — the functions are exported for exactly this.

### Timestamps are not build artefacts

`contentUpdatedAt`, `lastVerifiedAt` and `lastReviewedAt` are distinct, and **none of them is
ever bumped by a build, a deploy or a reformat**. A timestamp that moves without a human
re-reading the source is a lie about verification, and it is the specific dishonesty one
competitor in this market commits on every page.

Update only the one that actually changed:

- re-read the board's page and it still says the same thing → `lastVerifiedAt`
- rewrote the copy → `contentUpdatedAt`
- did an editorial pass over the whole page → `lastReviewedAt`

### Known standing finding

`bbise` (Quetta) carries `result-date-archivable` — its confirmed 2026-07-20 result date is the
only confirmed date on the site, and the session is now well past. It is `low` severity because
the page is still correct; it is a prompt to archive the session, not a defect.

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

**Nothing deploys on a red gate.** Current state: 117 tests — 76 validation, 41 unit.

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

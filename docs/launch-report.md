# Launch Report

**Phase:** 7 — Full-site QA, launch and production deployment
**Date:** 2026-09-14
**Decision:** **DO NOT LAUNCH** — the production zone is not on the authenticated Cloudflare
account. Proven by a deploy attempt, not assumed. Worker deploys fine; domain cannot attach.

Every gate that can be run without external credentials was run and passed. The site itself is
in good shape; what is missing is confirmation of _where_ it should be deployed.

---

## 1. Release candidate

| Field                    | Value                                 |
| ------------------------ | ------------------------------------- |
| Repository               | local only — **no remote configured** |
| Branch                   | `main`                                |
| Commit                   | `e2270bf`                             |
| Working tree             | clean                                 |
| Node                     | 24.19.0                               |
| npm                      | 11.17.0                               |
| Next.js                  | 16.3.5                                |
| React                    | 19.3.0                                |
| TypeScript               | 6.0.3                                 |
| `@opennextjs/cloudflare` | 1.20.6                                |
| Wrangler                 | 4.131.1                               |

---

## 2. Launch blockers

### BLOCKER 1 — No GitHub remote (§6, §99)

`git remote -v` returns nothing. The intended target is
`12thclassresult2026/12thclassresult.com.pk`.

Git credentials could not be read non-interactively in this environment (Credential Manager
entries and GCM at system level both failed to satisfy a non-interactive fetch). Per §7, **no
alternative repository was created** and nothing was pushed anywhere else.

All work is committed locally. Nothing is lost; it is simply not pushed.

### BLOCKER 2 — RESOLVED THEN DISPROVEN: the zone is not on the authenticated account

**Update after the deploy attempt.** The owner confirmed the account was correct, so the deploy
proceeded — in two steps, deliberately.

**Step 1, routeless deploy: SUCCEEDED.**

```
Uploaded 12thclassresult-com-pk
No targets deployed for 12thclassresult-com-pk
Worker Startup Time: 31 ms
Version ID: dfdb88e3-45bb-4d76-b5b7-90621043ed6c
```

This proves account access while serving nothing publicly — which is exactly why it was done
first.

**Step 2, attaching the custom domains: FAILED.**

```
Could not find zone for `12thclassresult.com.pk`.
Make sure the domain is set up to be proxied by Cloudflare.
```

So the answer is now measured rather than assumed: **the zone is NOT on account
`c085ba412b1289d5950bd55daf501b51`.** The domain does delegate to Cloudflare nameservers
(`thea.ns` / `hasslo.ns`), so a zone exists — just not on the account Wrangler is logged into.

**No harm done.** The failure happened before any DNS write. Verified afterwards: no address
record was created, and both `https://12thclassresult.com.pk/` and `https://www.…/` still
return no response. The account is in exactly the state step 1 left it: a Worker uploaded with
no targets.

**To finish the launch, one of:**

1. Add `12thclassresult.com.pk` as a zone on the authenticated account, or
2. `wrangler login` against whichever Cloudflare account already holds the zone.

Then restore the `routes` block recorded in `wrangler.jsonc` and redeploy. Everything else is
ready.

---

### Original blocker 2 assessment (§86, §144), retained for the record

```
wrangler whoami
→ 11thclassresult@gmail.com
→ account c085ba412b1289d5950bd55daf501b51
```

The authenticated account belongs to the **sibling project** (11thclassresult.com.pk). The token
carries `workers (write)` and `workers_scripts (write)`, so a deploy **would succeed** — which
is precisely why this must not proceed unconfirmed.

§144 lists "wrong GitHub/Cloudflare account or deployment target" as an **absolute launch
blocker**. This was flagged as an open question in Phase 0 and recorded in `wrangler.jsonc`:

> NOT yet verified: that the zone sits on the authenticated account
> (`c085ba412b1289d5950bd55daf501b51`), which is the 11th-class project's account and may or may
> not be where this site belongs.

What is known: `12thclassresult.com.pk` delegates to Cloudflare nameservers and publishes no
address record — so a zone exists somewhere and nothing is served on the domain yet.

**This needs one answer from the owner: is this the account that should host the site?**

`wrangler.jsonc` still has **no `routes` entry**, deliberately. A `routes` entry naming a zone
the account does not hold fails the deploy outright, so it must never be guessed.

---

## 3. Core QA — all PASS

| Gate                        | Result                                         |
| --------------------------- | ---------------------------------------------- |
| Clean install (`npm ci`)    | **PASS** — 674 packages, **0 vulnerabilities** |
| Format (`prettier --check`) | **PASS**                                       |
| Lint (`eslint .`)           | **PASS** — 0 errors, 0 warnings                |
| Typecheck (`tsc --noEmit`)  | **PASS** — strict, 0 errors                    |
| Content validation          | **PASS** — 104 tests                           |
| Unit tests                  | **PASS** — 100 tests                           |
| End-to-end                  | **PASS** — 72 (36 specs × 2 viewports)         |
| Production build            | **PASS**                                       |
| OpenNext Cloudflare build   | **PASS**                                       |
| `wrangler deploy --dry-run` | **PASS** — gzip 1078.80 KiB vs 3 MiB ceiling   |

**Total: 276 automated tests, all green.**

---

## 4. Production crawl (§16–§33)

Crawled against the real production build. **0 FAIL, 0 WARN.**

| Check                     | Result                                         |
| ------------------------- | ---------------------------------------------- |
| Indexable URLs in sitemap | 6                                              |
| Noindex routes serving    | 1 (`/results/karachi-board/12th-class`, draft) |
| Canonical issues          | 0 — all on `https://12thclassresult.com.pk`    |
| Duplicate titles          | 0                                              |
| Duplicate descriptions    | 0                                              |
| Duplicate canonicals      | 0                                              |
| Duplicate H1s             | 0                                              |
| Pages with ≠1 `<h1>`      | 0                                              |
| Broken internal links     | 0                                              |
| Orphan pages              | 0                                              |
| 404 behaviour             | 5/5 correct, no soft 404s, no redirect-to-home |

### Indexable inventory

```
/                                        470 words
/results/12th-class                      593 words
/boards                                  623 words
/guides/rechecking                      1422 words
/guides/how-percentage-is-calculated     515 words
/tools/percentage-calculator             303 words
```

### One accepted, non-blocking difference

The homepage canonical renders as `https://12thclassresult.com.pk` (no trailing slash) while the
sitemap emits `https://12thclassresult.com.pk/`. Next.js normalises the root URL when resolving
`alternates.canonical` against `metadataBase`; sub-pages are unaffected and `og:url` matches the
canonical exactly.

Per RFC 3986 §6.2.3 an empty path is equivalent to `/` for http(s) — the same resource.
**Accepted as non-material**, and not changed during a §4 release freeze for a cosmetic
difference in SEO plumbing.

---

## 5. Personal result indexation (§19) — PASS

Every personal-result shaped URL probed returns **404**, with both protective headers already
applied at the edge:

```
/result/123456       404   x-robots-tag: noindex, nofollow   cache-control: private, no-store
/results/123456      404   x-robots-tag: noindex, nofollow   cache-control: private, no-store
/api/result          404   x-robots-tag: noindex, nofollow   cache-control: private, no-store
/api/result/123456   404   x-robots-tag: noindex, nofollow   cache-control: private, no-store
```

No personal-result URL exists, none is in a sitemap, and none is internally linked. There is no
`/result/<roll-number>` route and there never will be.

---

## 6. Security (§54–§59) — PASS

### Headers, verified live on the running build

| Header                      | Value                                                              |
| --------------------------- | ------------------------------------------------------------------ |
| `x-content-type-options`    | `nosniff`                                                          |
| `referrer-policy`           | `strict-origin-when-cross-origin`                                  |
| `permissions-policy`        | camera, microphone, geolocation, browsing-topics all `()`          |
| `x-frame-options`           | `DENY`                                                             |
| `strict-transport-security` | `max-age=63072000; includeSubDomains; preload`                     |
| `content-security-policy`   | `default-src 'self'; frame-ancestors 'none'; object-src 'none'; …` |

### Secret audit (§57) — clean

No `.env` tracked or present · `.gitignore` covers `.env` and `.env.*` · no token-shaped strings
in any tracked file or in history · the only `NEXT_PUBLIC_*` variable is the public site origin.

### SSRF (§55) — 7 tests

`assertAllowedUrl` refuses non-https, internal addresses (`169.254.169.254`), `localhost`,
look-alike hosts (`biselahore.com.evil.test`), `file://` and malformed input. Upstream
destinations come from configuration; no caller-supplied value ever reaches a URL.

### Known CSP characteristic

`script-src` and `style-src` include `'unsafe-inline'`, required by Next.js's inlined bootstrap
and Tailwind's injected styles. Mitigated by `object-src 'none'`, `base-uri 'self'`,
`frame-ancestors 'none'` and `form-action 'self'`. Tightening this needs a nonce-based CSP,
which is a post-launch improvement, not a launch blocker.

---

## 7. Privacy (§52–§53) — PASS

No analytics is installed, so no personal data can reach one. The result engine never logs a
payload: `ResultSourceError.detail` is explicitly log-only and a test asserts it never reaches a
reader. No roll number, candidate name, father name, CNIC/B-Form or marks appears in any URL,
any log line, or any cache key.

---

## 8. Result engine (§44–§51) — PASS, 39 tests

| Area                       | Result                                                        |
| -------------------------- | ------------------------------------------------------------- |
| Policy state               | `BOARD_ADAPTERS` empty; no direct lookup for any of 28 boards |
| Input validation           | 6 tests; no internal field paths leak into messages           |
| Fallback ladder            | Every unresolved outcome has ≥1 rung, ends at board domain    |
| Parser failure ≠ not-found | 6 tests attacking the invariant, all hold                     |
| Circuit breaker            | Opens after 3 upstream failures; validation errors excluded   |
| Kill switch                | Disables an adapter without breaking the page                 |
| SSRF guard                 | 7 refusal cases                                               |

**Board coverage:** 1 of 28 boards has a public page (Karachi, `draft`, noindex). Integration
mode for all 28 is outbound-link or gazette guidance — **no board is directly integrated**, and
none can be legitimately (see `result-source-adapters.md`).

---

## 9. Content and factual audit (§37–§49) — PASS

| Check                             | Result                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------- |
| Future-year pages (§38)           | 0 mentions of 2027+                                                          |
| Stale-year claims (§39)           | 0 — `2025` appears only in dated observations                                |
| Unsupported liveness claims (§49) | 0 — no "LIVE", no unqualified "announced"                                    |
| Unverified SMS shortcodes         | 0 of 8 circulating codes rendered                                            |
| Thin content (§37)                | 0 pages under 150 words                                                      |
| Structured data (§74)             | Valid on all 7 pages: `WebPage`, `BreadcrumbList`, `Organization`, `WebSite` |
| Schema abuse (§75)                | 0 — no fabricated ratings, reviews or awards                                 |

The two liveness strings that an initial naive scan flagged were the site's own honesty
qualifiers — _"not whether a result has been announced"_ and _"if another group's result is out,
that says nothing about yours"_. The scanner was corrected to respect negation rather than the
copy being changed.

---

## 10. Accessibility (§61–§65)

Automated coverage in the E2E suite, across desktop and mobile viewports:

- Skip link is the **first tab stop** and targets `#main`
- Exactly one `<h1>` and one `main#main` landmark on every page
- No horizontal overflow at any tested width
- No console errors
- Calculator: real `<label>` per field, `inputMode="numeric"`, `role="alert"` errors conveyed in
  **text not colour**, `aria-live` result region

**Not yet done:** a screen-reader pass with an actual AT, and a contrast audit. Neither is
claimed as passing. No WCAG certification is asserted from automated checks alone.

---

## 11. Performance (§67–§72)

| Metric                     | Value                                     |
| -------------------------- | ----------------------------------------- |
| Client JS, homepage        | **172 KB gzipped**                        |
| Client JS, calculator page | **174 KB gzipped** (+2 KB for the island) |
| Worker bundle              | 1078.80 KiB gzip vs 3 MiB ceiling         |
| Rendering                  | All routes static / SSG                   |
| Third-party scripts        | **none**                                  |
| Images                     | **none** — no LCP image, no CLS source    |

172 KB is the React 19 + Next 16 App Router baseline, not application weight. The site's only
client component is the percentage calculator.

**Not yet done:** field Core Web Vitals. LCP/INP/CLS cannot be measured meaningfully before the
site is served from the edge on its real domain.

---

## 12. Rollback readiness (§97)

| Item                | State                                                            |
| ------------------- | ---------------------------------------------------------------- |
| Previous production | **none — this would be a first deploy**                          |
| Rollback commit     | n/a; the rollback of a first deploy is deleting the Worker route |
| Database            | none — no D1, KV or R2 binding exists, so no migration risk      |
| Adapter kill switch | present and tested                                               |
| Emergency noindex   | available via the existing host-based `X-Robots-Tag` rule        |

A first deploy is the _lowest-risk_ deployment this project will ever do: there is no live
traffic and no data to corrupt. The risk is entirely in choosing the wrong target.

---

## 13. Launch-readiness concern that is not a §144 blocker

**27 of 28 board pages are `planned` and have no route.** One board page exists, held at
`draft`. The site is honest and correct, but it is one board deep.

This does not meet any absolute launch blocker in §144, and there is a real argument for
launching a small, correct site early. But it is the owner's call, and it is stated plainly here
rather than buried: launching now means launching with the result layer largely unbuilt.

---

## 14. Known limitations

1. No GitHub remote — nothing is pushed.
2. Cloudflare account not confirmed as the correct target.
3. 27 of 28 board pages unbuilt.
4. `eslint@9.39.5` prints an end-of-support deprecation notice on install. ESLint 10 stays
   rejected per ADR-002 (`eslint-config-next`'s plugin set is not ESLint 10 ready). Re-evaluate
   after that lands.
5. CSP requires `'unsafe-inline'` for scripts and styles.
6. No screen-reader pass, no contrast audit, no field Core Web Vitals.

---

## 15. Final verdict

**NOT PRODUCTION READY — for deployment-target reasons, not code quality.**

Everything that can be verified locally passes: 276 automated tests, a clean production crawl
with zero findings, full security headers, verified personal-data protection, and a Cloudflare
bundle well inside limits.

Two questions must be answered by the owner before any deploy:

1. **Is `11thclassresult@gmail.com` / account `c085ba412b1289d5950bd55daf501b51` the correct
   Cloudflare account for this site?**
2. **How should the GitHub remote be authenticated**, so the release candidate can be pushed to
   `12thclassresult2026/12thclassresult.com.pk`?

With those two answers, the remaining sequence is short: push → verify CI → add the `routes`
entry → deploy → live smoke test → Search Console.

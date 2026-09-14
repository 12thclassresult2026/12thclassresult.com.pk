# Caching Strategy

**Phase:** 2 — Architecture
**Date:** 2026-09-14

---

## 1. The premise

Everything public is **prerendered at build and served from Cloudflare's edge as static
assets**. There is no database, no runtime data fetch, and no per-visitor upstream call.

That makes caching mostly a question of headers rather than invalidation — and it is the
reason the site stays up on result morning while boards do not.

---

## 2. Cache behaviour by data class

| Class                                     | Location                     | TTL                                             | Revalidation  | On failure      |
| ----------------------------------------- | ---------------------------- | ----------------------------------------------- | ------------- | --------------- |
| **Fingerprinted assets** (JS, CSS, fonts) | Edge + browser               | 1 year, immutable                               | filename hash | n/a             |
| **Images, icons**                         | Edge                         | long, revalidated                               | deploy        | serve stale     |
| **Prerendered HTML**                      | Edge + `cdn-cgi/_next_cache` | until next deploy                               | deploy        | serve stale     |
| **Sitemap index / segments**              | Edge                         | `s-maxage=3600`, `stale-while-revalidate=86400` | deploy        | serve stale     |
| **`robots.txt`**                          | Edge                         | same                                            | deploy        | serve stale     |
| **Board / source / status data**          | **compiled into the page**   | n/a                                             | deploy        | n/a             |
| **Result lookup response** (if ever)      | **never cached**             | `no-store`                                      | n/a           | fallback ladder |
| **Any future write endpoint**             | `no-store`                   | n/a                                             | n/a           | safe error      |

---

## 3. The prerender cache — and why a script guards it

`staticAssetsIncrementalCache` reads prerendered pages from `cdn-cgi/_next_cache/`
**inside the uploaded assets**. The OpenNext build writes them to
`.open-next/cache/<buildId>/`, and Wrangler uploads `.open-next/assets` **and nothing
else**.

Without the copy, the cache is configured, looks correct, and has nothing to read. Every
request misses, the Worker re-renders the whole React tree, and under a burst Cloudflare
terminates it with **Error 1102** — intermittently, which is the worst way to fail.

`npm run stage-cache` performs the copy and **exits non-zero** if the source is missing,
empty, or the copy is incomplete. It runs inside both `preview` and `deploy`.

> **Never run `opennextjs-cloudflare deploy` directly.** It skips the staging step.

---

## 4. Personal data is never shared-cached

If a lookup endpoint ever exists:

- `Cache-Control: no-store, no-cache, must-revalidate`
- `X-Robots-Tag: noindex, nofollow`
- **POST only**; `GET` returns 405
- Declared **twice** — in the route handler and in `next.config.ts` — so the header exists
  even on a path the handler never reaches

A result response belongs to one person. It must never reach a shared cache layer, and no
CDN rule may be broad enough to catch it by accident.

---

## 5. Invalidation

Deploy-based, which is the whole point: a verified fact change **is** a commit, and
shipping it invalidates everything derived from it atomically. There is no partial-update
window and no stale-key class.

| Change                          | Invalidation                   |
| ------------------------------- | ------------------------------ |
| A board's status is re-verified | edit registry → build → deploy |
| A source URL changes            | same                           |
| Prose correction                | same                           |
| New board page                  | same                           |

**Cost:** a fact change requires a deploy. **Benefit:** every fact change is reviewed,
attributable and revertible — which is exactly what a provenance-first site should want.

---

## 6. Result-day posture

| Principle                                      | Consequence                                                      |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| Static pages cannot fail because a board fails | The site stays up when boards collapse                           |
| A page load never triggers an upstream request | Thousands of readers never become thousands of upstream requests |
| Status is pre-verified, not fetched            | No live dependency on result morning                             |
| Never auto-retry into a degrading portal       | Retries worsen a government outage                               |
| Stale-while-revalidate on generated routes     | A brief origin problem is invisible to readers                   |

If automated source-health checking is ever added, the cached snapshot — not the live
check — is what pages read. A visitor must never be the trigger for an upstream request.

---

## 7. What is deliberately not used

| Mechanism                    | Why not                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ISR / on-demand revalidation | The static-assets cache cannot write. Adopting it means provisioning KV or R2 — a decision with its own trigger |
| Edge KV cache                | Nothing produces runtime data to cache                                                                          |
| Cache tags / purge API       | Deploy-based invalidation covers every case                                                                     |
| Client-side data fetching    | Would reintroduce the upstream dependency the architecture removes                                              |
| `localStorage` for facts     | Facts come from the server. Browser storage is only ever for per-viewer convenience                             |

---

## 8. Verification

Post-deploy checks that the caching model is actually working:

1. Prerendered pages report a cache **hit**, not a miss on a prerendered route.
2. Worker CPU time per request stays in the low tens of milliseconds — the 1102
   signature is a page costing hundreds.
3. `stage-cache` reports a non-zero file count.
4. `no-store` is present on any personal endpoint.
5. A non-production host returns `X-Robots-Tag: noindex`.

# Architecture — 12thclassresult.com.pk

A Class 12 / Second Year / HSSC Part-II result platform on Cloudflare Workers.

**Stack:** Next.js 16.3.5 (App Router, React Server Components) · React 19.3.0 ·
TypeScript 6.0.3 strict · Tailwind CSS 4.3.3 · Zod 4.6.5 ·
`@opennextjs/cloudflare` 1.20.6 · Wrangler 4.131.1 · Node 24.19.0.

Decision records live in `docs/architecture-decisions.md`. Deployment mechanics live
in `docs/deployment.md`.

---

## 1. The organising idea

This is a **provenance system with a website attached**, not a blog about results.

Everything a reader is told about a board traces to a record of what was actually
observed on that board's own site, on a recorded date. Where nothing was observed, the
site says so. That constraint shapes the type system, the data registries and the
tests far more than any visual decision does.

---

## 2. Module map

```
app/                     App Router. Routes are thin: resolve a registry entry,
                         emit JSON-LD, render a component.
├── page.tsx                     /
├── results/12th-class/page.tsx  the canonical head-intent hub
├── boards/page.tsx              board directory
├── sitemap.xml/route.ts         sitemap INDEX
├── sitemaps/[segment]/route.ts  per-segment urlsets
├── robots.ts · not-found.tsx · error.tsx · icon.svg · globals.css

components/
├── layout/              header, footer  (server components)
└── seo/                 json-ld script wrapper

lib/
├── seo/        site identity, canonical + normalizePath, metadata factory, sitemaps
├── content/    the page registry: routing metadata, sitemap membership, link graph
├── board/      board model and registry
├── result/     result contract, VerifiedFact, capability wording
├── result-sources/  official source contract and registry
├── schema/     JSON-LD builders
├── validation/ Zod wire schemas
└── security/   rate limiting

scripts/stage-prerender-cache.mjs   half of the Error 1102 fix — see deployment.md
tests/{unit,validation}             95 tests; validation is the content gate
```

---

## 3. One registry, many consumers

`lib/content/registry.ts` is the single source of truth for every page. It feeds:

- **routes** — via `requirePage(id)`, which _throws_, so a route referencing a
  non-existent entry fails the build rather than rendering without metadata
- **metadata** — via `metadataForPage()`
- **sitemaps** — via `indexablePages()` / `pagesInSegment()`
- **the internal-link graph** — `findOrphanPages()`, `findBrokenInternalLinks()`
- **the cannibalization gate** — `findKeywordConflicts()`

A page therefore cannot exist in one system while being invisible to the others.

### Page lifecycle

| Status      | Route exists | Indexable  | In sitemap |
| ----------- | ------------ | ---------- | ---------- |
| `planned`   | No           | No         | No         |
| `draft`     | Yes          | No         | No         |
| `published` | Yes          | If `index` | Yes        |

`planned` is not a formality. All ten boards are currently `planned`, which lets the
directory name every board honestly and link its official source **without shipping a
single thin page**. Collapsing `planned` into `draft` would claim ten held pages
exist when none do.

---

## 4. The honesty invariants

These are the load-bearing ones. Each is enforced by a test, not by discipline.

### Facts carry provenance or they are `unknown`

`VerifiedFact<T>` carries `value`, `status`, `sourceId`, `sourceUrl`,
`sourcePublishedAt`, `checkedAt`. Five statuses:

`confirmed` · `tentative` · `expected` · `historical` · `unknown`

- **`tentative` never collapses into `confirmed`.** A board calling its own date
  provisional is a different claim from a board stating it as fact.
- **`supportsCountdown()` is `isConfirmed()` and nothing more.** A countdown is an
  unqualified promise that something happens at a specific moment.
- `sourcePublishedAt` is distinct from `checkedAt`, because a notice published in
  February and read in September is stale evidence even though the check is fresh.

### The capability tri-state

`boolean | null`, where `null` means **not verified** — not "no".

`value ? 'Yes' : 'No'` is the natural thing to type and it silently turns every
unverified capability into a denial. So the conversion lives in exactly one place,
`capabilityLabel()`, which returns three words for three states. A student told
"SMS: No" when the truth is "not checked" has been misinformed about how to get their
own result.

### Engine capability never inherits to a dataset

A source's `supportsRollNumber` describes the **form**. A `ResultDataset`'s
`methodsConfirmed` describes **this exam and this year**. There is deliberately no
field combining them and no fallback between them.

A portal offering "12th" in one dropdown and "2026" in another has described a
cross-product of options, not confirmed that a 2026 dataset exists.

### Outcomes cannot be confused with each other

`LookupOutcome` is a discriminated union — `found` / `not-found` / `not-announced` /
`unsupported` / `source-unavailable` / `invalid-request`. There is no
`{ found: boolean, record?: ... }` shape, because that permits `found: true` with no
record, and lets "the source is down" render as "no such result".

---

## 5. Source trust model

Three axes kept apart because they fail independently:

| Axis         | Field             | Meaning                          |
| ------------ | ----------------- | -------------------------------- |
| Ownership    | `ownershipStatus` | Is this domain really the board? |
| Availability | `status`          | Could it be reached?             |
| Observation  | `observedVia`     | Did we actually look?            |

A four-tier filter ladder is what components consume — never the raw list:

```
getSourcesForBoard  →  verifiedSources  →  linkableSources  →  rollNumberSources
```

`isOfficial: true` requires verified ownership. A source with
`observedVia: 'not-observed'` may claim no capabilities, no exam levels, no years,
and no successful check.

**`AUTOMATED_FETCH_POLICY = 'do-not-bypass'`** is asserted repo-wide and covered by a
test: no user agent spoofed, no CAPTCHA touched, no form submitted, no identifier
entered, no URL built by editing someone else's year token.

`serverIntegrableSources()` returns an empty array — not by oversight, but because no
board's CAPTCHA absence has been positively established, and section 144 permits
server integration only where it has been.

---

## 6. SEO architecture

- **One canonical origin.** `SITE_ORIGIN` is defined once; `canonicalUrl()` always
  builds on it, so a preview deployment cannot self-canonicalise.
- **`normalizePath()` is the single duplicate-URL defence** — every canonical,
  sitemap entry and internal link passes through it, so case, trailing-slash and
  parameter variants cannot become separate URLs.
- **One intent, one owner.** `/results/12th-class` owns the head term; "2nd year
  result", "HSSC part 2 result" and "inter part 2 result" are recorded as
  `queryVariants` of it, not built as separate pages. A test asserts this.
- **The homepage deliberately does not own the head term** — a homepage competing
  with its own hub splits the signal and wins with neither.
- **Titles cap at 60 characters**, and the brand suffix is appended only when the
  result still fits. A title choosing between naming the board and naming the site
  names the board.
- **Noindex means `follow: true`**, never `nofollow` — a held page still links to the
  board's official portal, and discarding that helps nobody.
- **Segmented sitemaps** with an index; `lastmod` comes from each page's
  `contentUpdatedAt`, never from build time, so a rebuild does not falsely refresh
  every URL.
- **Preview isolation** is one rule: any host that is not the apex gets
  `X-Robots-Tag: noindex, nofollow` (`next.config.ts` `headers()` with `missing`).

---

## 7. Security posture

- Enforced CSP admitting **no third party at all** today. Turnstile and analytics
  origins get added deliberately when those are actually configured — never
  speculatively, because a policy that is constantly violated teaches everyone to
  ignore it.
- Full security-header baseline site-wide, plus `public/_headers` for static assets,
  which the Worker's response headers do not cover.
- Result lookup, when built, is POST-only, `no-store`, `noindex`, excluded from the
  sitemap, with no `/result/[rollNumber]` route — a roll number must never travel in
  a URL, a referrer, a log or browser history.
- Rate-limit keys use the client address and endpoint scope, and **never** the roll
  number.
- `error.tsx` logs only `error.digest` — no stack, no payload.

---

## 8. Performance and result-day posture

Everything public is prerendered at build; no route sets `revalidate`. The
`staticAssetsIncrementalCache` override serves those prerendered pages straight from
uploaded assets, so a request does not re-render the React tree on the Worker. This
is what keeps the site standing during a result-day burst — and the cache is useless
unless `stage-cache` ran, which is why that step exits non-zero rather than warning.

Images are served directly rather than through `/_next/image`: without an IMAGES
binding the optimizer returns the untouched original through a Worker invocation and
without the static-asset headers.

Current bundle: **gzip 1023 KiB** against a 3 MiB compressed free-plan ceiling.

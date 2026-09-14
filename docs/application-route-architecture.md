# Application & Route Architecture

**Phase:** 2 — Architecture (blueprint; not implemented)
**Date:** 2026-09-14
**Stack:** Next.js 16.3.5 App Router · React 19.3.0 · TypeScript 6.0.3 strict · Tailwind 4.3.3 · `@opennextjs/cloudflare` 1.20.6

---

## 1. Rendering strategy

| Class                       | Strategy                       | Routes                                                                                         |
| --------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Static (prerendered)**    | Build-time, served from assets | home, result hub, board pages, board directory, gazette pages, guides, tools, sitemaps, robots |
| **Controlled revalidation** | Not used yet — see below       | —                                                                                              |
| **Dynamic**                 | `force-dynamic`, never cached  | `POST /api/result` (when a board is ever integrable)                                           |

**Everything public is static today.** That is not a limitation — it is the result-day
posture from `result-data-contract.md` §8: a visitor's page load must never trigger an
upstream request, and static pages cannot.

### Why no ISR yet

`open-next.config.ts` uses `staticAssetsIncrementalCache`, whose `set` is a no-op. It can
serve prerendered pages but **cannot write revalidated ones**. That is deliberate and
sufficient while status changes are editorial (a verified change is a commit and a
deploy, which is auditable and git-tracked).

**Trigger to revisit:** the moment automated source-health checking exists, ISR needs a
writable cache, which means provisioning KV or R2 and swapping the override. That is a
single, contained change — see `data-storage-decision.md`.

---

## 2. Route tree

```
app/
├── layout.tsx                          root layout (the only layout)
├── page.tsx                            /
├── globals.css · icon.svg
├── not-found.tsx · error.tsx
├── robots.ts
├── sitemap.xml/route.ts                sitemap INDEX
├── sitemaps/[segment]/route.ts         per-segment urlsets
│
├── results/
│   ├── 12th-class/page.tsx             ★ canonical head-intent owner
│   ├── 12th-class/[year]/page.tsx      session hub    (generateStaticParams)
│   └── [board]/12th-class/
│       ├── page.tsx                    ★ board page, yearless
│       └── [year]/page.tsx             board session archive
│
├── boards/
│   ├── page.tsx                        directory
│   └── [board]/page.tsx                board hub (conditional)
│
├── gazettes/12th-class/
│   ├── page.tsx                        gazette hub
│   ├── archive/page.tsx
│   └── [board]/page.tsx
│
├── guides/
│   ├── [topic]/page.tsx                static list of approved topics
│   └── rechecking/[board]/page.tsx
│
├── tools/percentage-calculator/page.tsx
│
└── api/result/route.ts                 POST only (when integrable)
```

### Dynamic segments are enumerated, never open

Every `[param]` route declares `generateStaticParams()` from the registries and sets
**`dynamicParams = false`**. An unregistered board, year or topic therefore returns a real
404 rather than rendering an empty shell.

This is what makes a dynamic segment safe here: the parameter space is closed and comes
from verified data, so there is no crawlable infinite surface.

**A validation gate asserts no result link's first path segment is dynamic at render
time** — links are built from the registry, not string-concatenated.

### No route groups

`app/(site)/` is not used. The sibling project left an empty route group behind; a group
that wraps every route and changes nothing earns nothing.

---

## 3. Server/client boundary

**React Server Components by default.** The entire content surface — hub, board pages,
guides, gazette pages, directory — is server-rendered with zero client JavaScript.

Client islands are permitted only where genuine interactivity exists:

| Island                                                | Why                               |
| ----------------------------------------------------- | --------------------------------- |
| `error.tsx`                                           | Required to be a client component |
| Percentage calculator                                 | Real computation on user input    |
| Board selector (if it gains type-ahead)               | Filtering 28 boards               |
| Result form (only if a board ever becomes integrable) | Submission + states               |
| Mobile navigation disclosure                          | Focus management                  |

**Forbidden:** `'use client'` on a layout, on a page shell, or on any component that
mainly renders content. A wide table is not interactivity; it is CSS.

---

## 4. Component architecture

```
components/
├── ui/          primitives: status chip, card, table wrapper, callout, badge
├── layout/      header, footer, mobile nav, skip link
├── board/       board card, capability table, access-model action, cautions
├── result/      status sentence, per-group status, fallback ladder, provenance
├── seo/         json-ld, breadcrumbs
└── shared/      prose containers, section headers
```

### The components that carry the architecture

| Component           | Contract                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `StatusSentence`    | Emits the extractable sentence — board + exam + session + status + date + time + timezone. The AEO unit.              |
| `AccessModelAction` | Switches on `board.accessModel`. **This is where gazette-only boards stop being shown a roll-number call to action.** |
| `CapabilityTable`   | Renders `CapabilityStatus` via `capabilityLabel` only. No boolean coercion may exist in a component.                  |
| `ProvenanceBlock`   | Source name, link, last checked. Required wherever a volatile fact renders.                                           |
| `FallbackLadder`    | Ordered alternatives, driven by the board's real capabilities.                                                        |
| `PerGroupStatus`    | Renders one row per dataset for `per-group` boards.                                                                   |

`AccessModelAction` is deliberately a single component: it means a new board model is
handled in one place, and a missing case is a TypeScript exhaustiveness error rather than
a silently wrong page.

---

## 5. Metadata generation

Routes never assemble metadata by hand. Each calls `metadataForPage(entry)` with its
registry entry, which re-derives indexability as `index && status === 'published'` — so a
draft cannot become indexable by a typo in one field.

Dynamic routes generate metadata from the same registry lookup used by
`generateStaticParams`, so a route and its metadata cannot disagree about which entity
it is.

---

## 6. Loading and error boundaries

| Boundary        | Placement                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| `error.tsx`     | Root only. Logs `error.digest` and nothing else                                                             |
| `not-found.tsx` | Root. Real 404 status, recovery links, `canonical: false`                                                   |
| `loading.tsx`   | **None.** Every public route is static; a loading skeleton would render for a page that is already complete |

If a dynamic result route is ever added, it gets its own local boundaries — not a global
one that makes static pages flash.

---

## 7. Where the Cloudflare adapter constrains the design

| Constraint                                              | Design response                                                                                                     |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| No Node.js middleware support                           | Redirects and headers stay declarative in `next.config.ts`, and are unit-tested                                     |
| Image optimization needs an IMAGES binding              | `images.unoptimized: true`; files sized for display and served from assets with `public/_headers` applied           |
| Worker compressed-size limit (3 MiB free / 10 MiB paid) | Current bundle gzip ~1023 KiB. Large datasets go to assets and are fetched over HTTP, never bundled                 |
| **Workers have no filesystem**                          | Any future data shard is fetched by URL. `fs` is never used at runtime — a lesson the sibling learned in production |
| Prerender cache is not uploaded by default              | `stage-cache` runs between build and deploy and exits non-zero if it stages nothing                                 |

---

## 8. Repository structure

The existing structure is correct and is **not** being restructured. Phase 3 adds
directories rather than moving files:

```
app/ components/ lib/ scripts/ tests/ public/ docs/
                     ↑ adds: content/ (if MDX is ever justified)
                             lib/result-sources/adapters/
                             lib/result-sources/normalization/
                             lib/content/intents.ts
```

No file moves, no aesthetic refactors.

# Architecture Decisions — 12thclassresult.com.pk

Decision records for the production foundation. Each entry states what was
chosen, what it was chosen over, the evidence checked at decision time, and what
would justify revisiting it.

---

## ADR-001 — Cloudflare Next.js adapter: OpenNext, not vinext

**Date:** 2026-09-14
**Status:** Accepted
**Section:** master prompt section 9 (adapter decision gate), section 5 (version policy)

### Decision

Deploy Next.js to Cloudflare Workers using **`@opennextjs/cloudflare` v1.20.6**.

### Context

Section 9 forbids following an old tutorial blindly and requires inspecting
Cloudflare's _current_ recommendation before implementing. That check produced a
genuine surprise which changes the default answer:

**Cloudflare's framework guide now recommends `vinext` — a Vite-based Next.js
plugin — for new Next.js applications on Workers, and positions OpenNext as the
path for maintaining existing applications.**

Taken at face value, a greenfield project like this one would use vinext. It was
evaluated properly rather than dismissed.

### Evidence checked at decision time

| Question                    | Finding                                                                                                                                                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vinext published version    | **`vinext@1.0.0-beta.9`**, `@vinext/cloudflare@1.0.0-beta.7`                                                                                                                                                                             |
| vinext maturity             | **Beta.** Cloudflare's own guide describes it as beta, marks image optimization as only "partially supported", and instructs running `npx vinext check` for module-level compatibility before adopting it for an existing production app |
| OpenNext current version    | `@opennextjs/cloudflare@1.20.6` (`latest` dist-tag)                                                                                                                                                                                      |
| OpenNext Next.js 16 support | Supported — "all minor and patch versions of Next.js 16"; peer range `next: ">=15.5.24 <16                                                                                                                                               |     | >=16.3.3"`admits`next@16.3.5` |
| OpenNext feature coverage   | App Router, RSC, Route Handlers, dynamic routes, SSG, SSR, Middleware, image optimization, PPR, ISR, `after()`, `'use cache'`, Turbopack                                                                                                 |
| OpenNext known gap          | Node.js Middleware (Next 15.2+) is **not** supported                                                                                                                                                                                     |
| Proven in production        | Yes — the sibling 11thclassresult.com.pk runs this exact adapter version on Cloudflare Workers today                                                                                                                                     |

### Rationale

1. **Section 5 requires production-stable releases** over beta/RC/canary "unless
   a specific Cloudflare compatibility requirement justifies otherwise". vinext
   is beta. No compatibility requirement of this project forces it — OpenNext
   supports every feature listed below that this project actually needs.
2. **This is a result platform with result-day traffic spikes.** Section 33 and
   section 80 demand resilience under burst load. A beta adapter is the wrong
   place to discover an edge case when a board announces results.
3. **OpenNext covers the full required feature set** for this project: App Router,
   React Server Components, Route Handlers for result lookup, the Metadata API,
   redirects and headers from `next.config.ts`, static generation for evergreen
   content, and Cloudflare bindings when D1/KV are eventually justified.
4. **The one documented gap does not bind us.** Node.js Middleware is unsupported,
   and this project deliberately does not use middleware: canonical-host
   enforcement and `www` → apex redirects are declared statically in
   `next.config.ts` instead. This mirrors the sibling project, which made the
   same call for the same reason.
5. **Shared framework with the sibling** (section 0) — same adapter, same Wrangler
   workflow, same failure modes already understood and documented.

### Consequences / limitations accepted

- No Node.js Middleware. Redirects, headers and host rules stay in
  `next.config.ts`. If a future requirement genuinely needs runtime middleware,
  that is a trigger to re-open this decision, not to quietly add an unsupported
  feature.
- The app must use the **Node.js runtime**, not the Edge runtime (OpenNext
  requirement).
- Worker compressed-size limits apply: 3 MiB on Free, 10 MiB on Paid. Bundle
  weight must be watched; large datasets belong in assets, KV or D1 rather than
  in the Worker bundle.

### Revisit when

- vinext reaches a stable (non-beta) release **and** demonstrates full support
  for the feature set above, **or**
- OpenNext drops support for a Next.js version this project needs.

Any migration must be validated through the full quality gate (`npm run check`)
plus a preview deploy before production.

---

## ADR-002 — Dependency matrix: newest _compatible_, not newest

**Date:** 2026-09-14
**Status:** Accepted
**Section:** master prompt section 5

### Decision

Pin `typescript@6.0.3`, `eslint@9.39.5`, `vitest@4.1.11` and
`@types/node@24.13.4` — each deliberately **not** the latest published release —
alongside `next@16.3.5`, `react@19.3.0` and `react-dom@19.3.0`.

### Rationale

Live registry checks showed the newest releases are mutually incompatible:

- **TypeScript 7.0.2 is unusable with Next.js linting.** TS 7 ships native
  binaries with no JavaScript compiler API. `eslint-config-next@16.3.5` depends
  on `typescript-eslint@^8.46.0`, which declares peer
  `typescript: ">=4.8.4 <6.1.0"`. Installing TS 7 breaks `npm run lint`.
  → **`typescript@6.0.3`** (current stable 6.x, the highest permitted).
- **ESLint 10.10.0 is unusable with `eslint-config-next`.** Its bundled plugin
  set (`eslint-plugin-react`, `eslint-plugin-jsx-a11y`, and others) has not
  shipped ESLint 10 support; tracked in open issue `vercel/next.js#91702`.
  → **`eslint@9.39.5`** (current stable 9.x).
- **`@types/node` must match the runtime, not the registry.** The runtime is Node
  24.19.0; `@types/node@26` would type APIs that do not exist there.
  → **`@types/node@24.13.4`** (current stable 24.x).
- **Vitest 5.0.0** is a major bump with nothing requiring it. Section 5 forbids
  silent major upgrades. → **`vitest@4.1.11`**.

### Consequence

"Latest" is re-evaluated per upgrade cycle against the whole graph, never per
package in isolation. Any major upgrade runs the full validation pipeline before
it is accepted (section 5).

---

## ADR-003 — Canonical host and preview isolation

**Date:** 2026-09-14
**Status:** Accepted
**Section:** master prompt sections 21, 42

### Decision

The apex domain `https://12thclassresult.com.pk` is the single canonical origin.
`workers_dev` will be disabled, and any non-production host serves
`X-Robots-Tag: noindex, nofollow`.

### Rationale

Every canonical tag on the site points at the apex. A `*.workers.dev` origin
serving identical pages would be a duplicate copy that the canonical system
cannot see, competing with the real site in search. Disabling it removes the
duplicate at the source rather than trying to suppress it afterwards.

`www` is **not** a production host. If `www` is later attached to the Worker, it
exists solely so the permanent `www` → apex redirect has a hostname that
resolves; it must still fail the production-host check so that, if the redirect
ever failed open, `www` would emit `noindex` and an apex canonical rather than
silently duplicating the site.

### Note on `routes`

`routes` will **not** be declared in `wrangler.jsonc` until the zone is confirmed
to be on the authenticated Cloudflare account and a deploy to it has succeeded. A
`routes` entry naming a zone the account does not hold fails the deploy outright,
so this value is never guessed (section 12).

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

---

## ADR-004 — Board pages are yearless

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 2

### Decision

`/results/<board-slug>/12th-class`, not `/results/<board-slug>/12th-class/2026`.

### Context

The Phase 1 preliminary inventory proposed year-stamped board URLs. Phase 2 is required
to challenge the preliminary IA rather than approve it, and the evidence refutes it:
**no competitor maintains year-stamped archive URLs.** Their year-stamped equivalents
return 404 while the yearless page resolves and carries the year in its title. The sites
that bake a year into the URL — or into the domain — have a one-season architecture.

### Options

1. Year-stamped primary (preliminary) — annual migration, link equity reset each year, empty future-year pages tempting.
2. **Yearless primary, year archives on a value gate** — chosen.
3. Yearless only — loses genuinely valuable historical records.

### Consequences

Link equity accumulates on one URL. No annual migration. The year lives in the title and
H1, which is exactly the pattern that survives in the market. A year-specific board page
is created only when a past session clears a durable-value gate (two of: verified
declared date, board gazette, verified statistics, session-specific method).

---

## ADR-005 — Board access model becomes a first-class field

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 2

### Decision

Add `accessModel` (`roll-number-portal` | `gazette-only` | `session-rotating-portal` |
`unverified`) and `declarationModel` (`whole-board` | `per-group` | `unknown`) to `Board`.

### Context

The existing model assumes every board has a roll-number form and one declaration per
year. Phase 1 proved otherwise: Karachi and Hyderabad have **no lookup form at all** and
publish per group, Karachi's 2026 groups declaring across four weeks with Commerce still
undeclared; AJK's route is the gazette; Peshawar and Mardan expose one session at a time
so deep links rot.

Every competitor encodes the single-model assumption and is therefore structurally wrong
about roughly a fifth of the country.

### Consequences

`AccessModelAction` switches on the field, so a gazette-only board can never be shown a
roll-number call to action — and a missing case is a TypeScript exhaustiveness error
rather than a silently wrong page. A validation gate asserts the same at build time.

`ResultDataset` gains `group` and `declaredAt`, so Karachi's session is seven rows rather
than one flattened lie. A whole-board board keeps one row with `group: null`, so the
model costs nothing where it is not needed.

---

## ADR-006 — CapabilityStatus replaces the boolean tri-state

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 2

### Decision

Replace `boolean | null` with a six-state union: `verified-supported`,
`verified-unsupported`, `unknown`, `temporarily-unavailable`, `blocked`, `manual-only`.

### Context

`null` currently means both "we have not checked" and "the board blocks us from
checking". Those are different facts. Faisalabad, FBISE and Kohat refuse automated
requests; recording that as `unknown` loses the reason.

### Consequences

Migration is mechanical and lossless. The display rule is unchanged: only
`verified-supported` may be advertised, and `capabilityLabel()` gains cases but never a
default-to-false branch — the bug the module exists to prevent.

---

## ADR-007 — No D1, no KV, no R2

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 2

### Decision

All data stays typed TypeScript in the repository, prerendered at build. The only binding
is `ASSETS`.

### Context

Every row of data changes because **a human verified something** — never from user
traffic, never at runtime. We hold no student results and the feasibility study says we
cannot legitimately obtain any. Boards plus sources is 28 rows joined to ~40.

### Consequences

Code review on every fact change, git history as a provenance audit trail, and **no
runtime dependency that can be down on result morning** — the decisive argument, given
that boards measurably collapse at 10:00 AM.

Cost: a fact change requires a deploy. That is a benefit disguised as a cost, because it
makes every change reviewed and revertible.

Triggers to revisit are recorded per store in `data-storage-decision.md` §7. Nothing is
pre-provisioned and no placeholder id exists anywhere.

---

## ADR-008 — Static-only rendering, no ISR yet

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 2

### Decision

Every public route is prerendered. No route sets `revalidate`.

### Context

`staticAssetsIncrementalCache` can serve prerendered pages but its `set` is a no-op, so
it cannot write revalidated ones. Status changes are editorial, so a deploy is the
natural invalidation boundary.

### Consequences

A visitor's page load can never trigger an upstream request — which is the result-day
posture the research demands. Adopting ISR later means provisioning KV or R2 and swapping
the override: one contained change, not a rewrite.

---

## ADR-009 — Honest routing over a simulated checker

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 2

### Decision

The product routes readers to official sources with verified context. It does not render
a result form that cannot work. `BOARD_ADAPTERS` stays empty.

### Context

Six confirmed CAPTCHAs across five boards, VIEWSTATE-protected forms that reject synthetic
posts, JavaScript-only portals, and no board publishing an API or permission. Every
"checker" in this market is a router; one competitor even adds a synthetic
"Verifying details…" delay before an outbound link.

### Consequences

The empty adapter registry is a policy state, not an unfinished feature, and a test
asserts it. The abstraction still earns its place: if a board ever grants access, an
adapter plus normalization is added and **no component, route or URL changes**.

---

## ADR-010 — Group is a data dimension before it is a URL

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 2

### Decision

Groups render as status sections on the board page. No Punjab group pages are approved;
`result.group.punjab` has no canonical owner.

### Context

Generic and group queries share zero URLs, so group terms are not simple synonyms. But
Punjab, KPK and Federal boards have **no group field** and declare all groups
simultaneously — so a Punjab group page would repeat one identical lookup and one
identical date. The market leader's own group pages are decaying template swaps carrying
a current-year title over a previous-year heading.

Sindh is different: separate dates, separate gazettes, a genuinely different event.

### Consequences

Sindh group status is modelled in data and rendered per group. A Punjab group page may
only be created if it carries subject list, marks distribution, grading and pathways
verified from a scheme of studies.

---

## ADR-011 — Version matrix reaffirmed

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 2

Re-verified against the live registry at Phase 2. `next` 16.3.5, `react` 19.3.0,
`tailwindcss` 4.3.3, `@opennextjs/cloudflare` 1.20.6, `@playwright/test` 1.63.0 and `zod`
4.6.5 all remain current. `wrangler` has a patch bump (4.131.1 → 4.131.2), adopted on the
next dependency pass.

**TypeScript 7, ESLint 10 and Vitest 5 remain rejected** for the reasons in ADR-002 —
`typescript-eslint` still caps TypeScript below 6.1, and `eslint-config-next`'s plugin
set is still not ESLint 10 ready. Re-evaluated, not assumed.

---

## ADR-012 — The adapter registry ships empty

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 4

### Context

Phase 4 asked for a real result engine with source adapters. The obvious reading is "integrate
the boards we can". The source survey says which those are: **none**.

Six sources across five boards present a confirmed CAPTCHA, three sit behind
`VIEWSTATE`/`EVENTVALIDATION`, three need JavaScript to render anything, and zero publish an API
or any statement permitting automated access. Exactly one board is a clean technical candidate — and its payload is a named minor's
marks beside their father's name, which a permissive `robots.txt` does not license us to
republish.

### Decision

`BOARD_ADAPTERS` is `[]`, asserted by test. The full adapter contract, circuit breaker, timeout,
error taxonomy and provenance assertion are built and tested around it via a synthetic adapter
that cannot be registered outside the test runner.

`getAdapterForBoard()` applies four independent gates, two of which read the live source
registry — so a source that acquires a CAPTCHA or is reclassified stops being called with no
other change.

### Consequences

Every board returns a routing outcome with a fallback ladder rather than a record. When a board
grants access, an adapter is added and **no component, route or URL changes**.

The alternative — shipping an adapter that defeats a control a board deliberately installed — was
never on the table, and the code makes it awkward rather than merely discouraged.

---

## ADR-013 — A parser failure may never become "not found"

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 4

### Context

The worst defect this system can have is not an outage. It is telling a student their result does
not exist when it does.

That happens by default. A board redesigns its HTML, the selector matches nothing, the adapter
returns "no rows", and the engine reports a confident `not-found` to every candidate who asks —
with nothing in any log to notice, because from the code's perspective nothing failed.

### Decision

`not-found` is reachable from exactly one place: an adapter that completed and explicitly
returned `null`. Every other condition throws a typed `ResultSourceError`.

An unrecognised exception classifies as `PARSER_FAILURE`, not `INTERNAL_ERROR` — an unexpected
throw mid-lookup usually means the page changed under us, and that classification fails **toward
the official link** rather than toward a confident wrong answer. A record without provenance, or
citing a source absent from the registry, is rejected rather than displayed.

### Consequences

A broken parser degrades to "we could not read this reliably, so we will not guess — here is the
board's own portal". That is a worse user experience than a working lookup and a far better one
than a lie.

---

## ADR-014 — Every unresolved outcome carries a fallback ladder

**Date:** 2026-09-14 · **Status:** Accepted · **Phase:** 4

### Context

Honest routing is only better than a fake checker if the honest answer is _actionable_. "We
cannot check this board" with nothing attached is worse than a lookup box, because at least the
box implies a next step.

### Decision

The `fallbacks` field is on the type, not left to convention: every `LookupOutcome` except
`found` and `invalid-request` carries `ResultFallback[]`, so a dead end is a compile error rather
than an oversight. `invalid-request` is excluded because the fix is in the form the reader
already has.

The ladder is built from verified capabilities only, ordered direct → official portal → SMS →
gazette → board website, with the gazette promoted to first for a `gazette-only` board, where it
is the route rather than a fallback. It is deduplicated by URL, and it always ends with the
board's own domain — the one rung that still helps when everything else breaks, and the direct
answer to a market where students are routinely misled by aggregators that look official.

An SMS rung requires a shortcode `confirmed` from a board's own domain. None exists, so it never
renders, and a test asserts that. The codes circulating on aggregator sites contradict each
other, and an SMS is charged — a wrong shortcode costs a student money and returns nothing.

### Consequences

`primarySourceFor()` is the single definition of "the route to take first", shared by the call to
action and the ladder, so the button and the list beneath it cannot disagree or repeat a link.

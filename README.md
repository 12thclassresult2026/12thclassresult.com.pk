# 12thClassResult.com.pk

A Class 12 / Second Year / HSSC Part-II result platform for Pakistan, on Cloudflare
Workers.

**What it is:** an independent information service that routes students to the official
board source for their result, with verified context about what that source actually
offers and what has genuinely been announced.

**What it is not:** an education board, and not a result checker. No board in Pakistan
currently publishes an API or permits automated lookup, so every "checker" in this market
is a router. This one says so.

---

## The idea

> This is a provenance system with a website attached.

Everything a reader is told about a board traces to a record of what was observed on that
board's own site, on a recorded date. Where nothing was observed, the site says so.

That constraint is also the product. The live market publishes **three different dates**
for the same 2026 Punjab result and **four different SMS shortcodes** for the same board,
none citing a board notification. This project publishes neither, and explains why.

---

## Stack

|            |                                                                      |
| ---------- | -------------------------------------------------------------------- |
| Framework  | Next.js 16.3.5, App Router, React Server Components                  |
| Language   | TypeScript 6.0.3, strict, `noUncheckedIndexedAccess`                 |
| Styling    | Tailwind CSS 4.3.3 (`@theme`, no config file)                        |
| Validation | Zod 4.6.5                                                            |
| Hosting    | Cloudflare Workers via `@opennextjs/cloudflare` 1.20.6               |
| Tooling    | Wrangler 4.131.1 · Vitest 4.1.11 · Playwright 1.63.0 · ESLint 9.39.5 |
| Runtime    | Node 24.19.0                                                         |

TypeScript 7, ESLint 10 and Vitest 5 are deliberately **not** used — see ADR-002.

---

## Prerequisites

Node 24.19.0 (`.nvmrc`), npm 11. A Cloudflare account is needed only to deploy.

## Install and run

```bash
npm ci
npm run dev
```

## Commands

| Command                           | Purpose                      |
| --------------------------------- | ---------------------------- |
| `npm run dev`                     | Development server           |
| `npm run build`                   | Production build             |
| `npm run lint` / `lint:fix`       | ESLint                       |
| `npm run typecheck`               | `tsc --noEmit`               |
| `npm run format` / `format:check` | Prettier                     |
| `npm run test`                    | Unit tests                   |
| `npm run validate`                | **Content validation gates** |
| `npm run check`                   | The full pre-deployment gate |
| `npm run test:e2e`                | Playwright                   |
| `npm run preview`                 | Local preview on workerd     |
| `npm run deploy`                  | Deploy to Cloudflare Workers |

`npm run check` runs format, lint, typecheck, validate, test and build. **Nothing deploys
on a red gate.**

---

## Environment

One public variable, declared in `wrangler.jsonc`:

```
NEXT_PUBLIC_SITE_ORIGIN=https://12thclassresult.com.pk
```

No secret is required to build, test or preview. Analytics and challenge-widget
configuration are feature-flagged off and admit no origin to the CSP until real values
exist. `.env` and `.dev.vars` are gitignored and CI greps for them.

---

## Project layout

```
app/          routes — thin: resolve a registry entry, emit JSON-LD, render a component
components/   ui/ primitives · result/ domain components · tools/ · layout/ · seo/
lib/
  board/          board registry and model (access models, groups, datasets)
  result-sources/ official source registry and capability contract
  result/         result contract, VerifiedFact, capability wording, fallback ladder
  rechecking/     per-board rechecking facts (fees, deadlines, rules)
  marks/          percentage calculation
  content/        page registry, canonical intents, lifecycle
  seo/            site identity, canonical, metadata, sitemaps
  schema/         JSON-LD builders
  security/       rate limiting
  validation/     Zod wire schemas
tests/        unit/ · validation/ · e2e/
docs/         architecture, decisions, research, SEO inventory
```

---

## The invariants

These are enforced by tests, not by discipline.

1. **Facts carry provenance or they are `unknown`.** Five states; `tentative` never collapses into `confirmed`, and only a confirmed fact may drive a countdown.
2. **Capability is six-state, never boolean.** `unknown` renders as "Not verified", never "No" — and `blocked` ("the board prevents us from checking") is distinct from `unknown`.
3. **Engine capability never implies a dataset.** A dropdown offering "12th" and "2026" is a cross-product of form options, not evidence a result exists.
4. **There are four board models, not one.** A gazette-only board is never shown a roll-number prompt. Handled in one component, with exhaustiveness checked by the compiler.
5. **One intent, one owning page.** Entity-scoped, and gated.
6. **No personal data is held, ever.** No result URL, no identifier in a log, a rate-limit key or analytics.
7. **No access control is ever bypassed.** A repo-wide policy, covered by a test.

---

## Content workflow

Adding a board, changing a fact and recording source status are documented in
[docs/operations.md](docs/operations.md). In short: verify against the board's own page,
edit the registry, update only the timestamps that actually changed, run the gate.

A board is registered long before it has a page, so the directory can name it honestly
without shipping a thin page.

## Result-source workflow

No board is integrated, and `BOARD_ADAPTERS` is empty **by policy** — a test asserts it.
Six confirmed CAPTCHAs across five boards, VIEWSTATE-protected forms, JavaScript-only portals,
and no board publishing an API or permission to automate.

If a board ever grants access, an adapter plus normalization is added and **no component,
route or URL changes**. That is what the abstraction is for.

---

## Deployment

```
Local → git → GitHub main → CI validation → npm run deploy → Cloudflare Workers
```

CI validates only; it never deploys. A single system owns production.

Two things that must not be forgotten, both documented in
[docs/deployment.md](docs/deployment.md): `stage-cache` must run between build and deploy,
and `routes` must not be declared until the zone is confirmed on the authenticated
account.

### Launch state — not yet deployed

The site has **never served a page**. The Worker deploys successfully; the domain cannot be
attached. This is now measured rather than assumed:

```
Uploaded 12thclassresult-com-pk          <- the Worker ships fine
No targets deployed                       <- routeless, so nothing is public
Could not find zone for 12thclassresult.com.pk
```

1. **The zone is not on the authenticated Cloudflare account.** Wrangler is logged in as
   `11thclassresult@gmail.com`; the domain delegates to Cloudflare nameservers, so a zone
   exists — on some other account. Fix by adding the zone to this account, or by
   `wrangler login` against the one that holds it. Then restore the `routes` block recorded
   verbatim in `wrangler.jsonc` and redeploy.
2. **No git remote is configured.** Credentials could not be read non-interactively, and per the
   git-safety rules no alternative repository was created. Everything is committed locally. This
   blocks CI only, not the deploy.

Full evidence, including the QA that did pass, is in
[docs/launch-report.md](docs/launch-report.md).

---

## Documentation

| Topic              | File                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| System overview    | [docs/architecture.md](docs/architecture.md)                                                        |
| Decision records   | [docs/architecture-decisions.md](docs/architecture-decisions.md)                                    |
| Board model        | [docs/board-data-model.md](docs/board-data-model.md)                                                |
| Result contract    | [docs/result-data-contract.md](docs/result-data-contract.md)                                        |
| Source adapters    | [docs/result-source-adapters.md](docs/result-source-adapters.md)                                    |
| Result day         | [docs/result-day-operations.md](docs/result-day-operations.md)                                      |
| SEO system         | [docs/seo-system.md](docs/seo-system.md)                                                            |
| Design system      | [docs/design-system.md](docs/design-system.md)                                                      |
| Operations         | [docs/operations.md](docs/operations.md)                                                            |
| Ops report         | [docs/operations-report.md](docs/operations-report.md)                                              |
| Year rollover      | [docs/year-rollover.md](docs/year-rollover.md)                                                      |
| Launch report      | [docs/launch-report.md](docs/launch-report.md)                                                      |
| Incidents          | [docs/incidents/](docs/incidents/)                                                                  |
| Authority / PR     | [docs/authority/](docs/authority/)                                                                  |
| Gazette engine     | [docs/architecture/gazette-result-engine.md](docs/architecture/gazette-result-engine.md)            |
| Admin & roles      | [docs/admin/](docs/admin/)                                                                          |
| Deployment         | [docs/deployment.md](docs/deployment.md)                                                            |
| Security · Privacy | [docs/security.md](docs/security.md) · [docs/privacy-architecture.md](docs/privacy-architecture.md) |
| Research evidence  | [docs/research/](docs/research/)                                                                    |

---

## Status

Foundation built; core product and result engine are later phases. Three pages are
published and one board page is held in draft as the representative implementation.
Board coverage is 28 registered boards, of which most are `planned` — named and linked,
with no page, until each one earns one.

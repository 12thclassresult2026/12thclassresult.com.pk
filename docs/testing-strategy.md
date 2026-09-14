# Testing Strategy

**Phase:** 2 — Architecture
**Date:** 2026-09-14
**Implemented:** 155 tests — 41 unit, 76 validation, 38 end-to-end — all green

---

## 1. The layers

| Layer          | Command        | Runs                                                         |
| -------------- | -------------- | ------------------------------------------------------------ |
| Format         | `format:check` | Prettier                                                     |
| Lint           | `lint`         | ESLint flat config, with `no-eval` / `no-new-func` as errors |
| Types          | `typecheck`    | `tsc --noEmit`, strict + `noUncheckedIndexedAccess`          |
| **Validation** | `validate`     | Vitest over `tests/validation` — **the content gate**        |
| Unit           | `test`         | Vitest over `tests/unit`                                     |
| Build          | `build`        | `next build`                                                 |
| E2E            | `test:e2e`     | Playwright, desktop + mobile                                 |

`npm run check` chains the first six. It is the pre-deployment gate, and **nothing
deploys on a red gate**.

---

## 2. Why validation is its own layer

Unit tests check that functions work. **Validation tests check that the published site is
honest.** They import the real registries and assert invariants across the whole
inventory — which is how a content mistake fails a build rather than reaching a reader.

This is the layer that caught a duplicate H1 between the homepage and a planned page
before either shipped.

---

## 3. Validation gates

### Already enforced (58 assertions)

Registry integrity · no route collisions · normalized paths · known sitemap segments ·
breadcrumbs start at `/` and end at the page · **no duplicate titles, descriptions or
H1s across the whole inventory** · title and description length bounds · one canonical
owner per primary keyword · no page lists its own primary keyword as a variant · the
homepage never owns a head result term · synonym consolidation holds · no broken internal
links · no orphan pages · planned pages never indexable · class A/B pages carry
`lastReviewedAt` · `direct` pages register a source · sitemaps contain only published
indexable pages on the production origin · no API or search URL in a sitemap · only
populated segments indexed · segments within the protocol limit · board id/slug
uniqueness · **no board slug is a substring of another** · https official websites ·
every referenced source id resolves · confirmed facts carry source and timestamp ·
unknown facts carry no value · **no SMS shortcode is published for any board** · no
confirmed 2026 result date · dataset methods never inferred from form options · sources
never official without verified ownership · unobserved sources claim no capability ·
no successful check on an unreached source · provenance note on every source · no
server-integration with a confirmed CAPTCHA · **`serverIntegrableSources()` is empty** ·
roll-number routes only from real result endpoints · **no circulating SMS shortcode
string appears anywhere in rendered output** · no browser-disguise or bypass code ·
route metadata matches the registry · the 404 is noindex with no canonical · every
indexable page has a built route.

### To add in Phase 3

| Gate                                                             | Enforces                                                                     |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `intentId` uniqueness                                            | One canonical owner per intent — the machine form of the cannibalization map |
| Every board has an `accessModel`                                 | The new axis is never left undefined                                         |
| **A `gazette-only` board renders no roll-number call to action** | The central correctness rule of this architecture                            |
| A `per-group` board has ≥ 2 datasets for a released year         | Group staggering is modelled, not flattened                                  |
| `CapabilityStatus` never coerced to boolean                      | No component may contain `value ? 'Yes' : 'No'`                              |
| Contextual inbound link required                                 | Footer links do not satisfy the orphan gate                                  |
| Rendered-line similarity floor per family                        | Board-name-swap detection, measured after rendering                          |
| No literal fee, date or shortcode in prose                       | Volatile facts render from the registry or not at all                        |
| Breadcrumb depth matches the real hierarchy                      | No invented crumb levels                                                     |
| Every indexable route is in `ROUTE_MODULES`                      | A new route cannot ship uncovered                                            |

---

## 4. Unit tests

Cover the pure logic where a subtle error is invisible in review:

`normalizePath` · `canonicalUrl` · `isProductionHost` (including that **`www` is not a
production host**) · `brandedTitle` at the length boundary · `buildMetadata` robots
shapes · JSON-LD escaping, including a script-breakout case · absence of rating/review/
award fields · `VerifiedFact` guards — `isConfirmed` false for tentative, `supportsCountdown`
false for anything unconfirmed, `isSourced` narrowing · `capabilityLabel` returning
"Not verified" for unknown · `identifierRequirementSentence` claiming nothing unverified ·
rate limiting and key construction without identifiers · Zod bounds including registry
membership and injection-shaped input.

### Phase 3 additions

`CapabilityStatus` label mapping for all six states · access-model action selection ·
per-group dataset selection · result outcome composition, especially
`no-lookup-exists` and `not-announced-for-group` · percentage calculation against the
Pakistan rule · rechecking record conflict handling.

---

## 5. Integration tests

None today — there is no service layer and no adapter. When one exists:

result service resolution order · timeout and abort behaviour · circuit-breaker
transitions · fallback ladder composition per access model · upstream failure rendering
as `source-unavailable` and never as `not-found` · rate-limit and body-cap enforcement ·
`no-store` on personal responses · the error envelope leaking nothing.

---

## 6. E2E — implemented

Playwright, desktop-chromium and mobile-chromium (Pixel 7), 19 specs run against both
projects. The assertions that matter are the honesty invariants checked against RENDERED
output: that a gazette-only board renders no roll-number input, that each Karachi group
shows separately including the undeclared one, that no circulating SMS shortcode reaches
any page, and that a held board page is noindex but still follow.

One of these caught real content duplication on its first run — a board caution repeating
a fact the access-model component already rendered structurally.

Playwright, `desktop-chromium` + `mobile-chromium` (Pixel 7). Mobile is a project, not an
afterthought.

| Spec               | Asserts                                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Core journeys      | Homepage h1; the status section states what is not announced; navigation works; a real 404; skip link focuses; robots and sitemap resolve |
| Board journeys     | Each access model renders its correct primary action — and **a gazette-only board shows no roll-number call to action**                   |
| SEO links          | Every internal link on every route resolves; canonical is self-referential                                                                |
| Accessibility      | Heading order; visible focus; form labels present; status not colour-only                                                                 |
| Responsive         | 320/390/768/1024/1440 — `scrollWidth - clientWidth <= 1` on every route                                                                   |
| No fabricated data | No circulating SMS shortcode, no countdown, no "LIVE" badge in rendered output                                                            |
| Console            | No uncaught errors                                                                                                                        |

---

## 7. CI

```
checkout → setup Node from .nvmrc → npm ci → format:check → lint → typecheck
        → validate → test → build → opennextjs-cloudflare build
        → wrangler deploy --dry-run → secret-leak grep
```

The dry-run needs **no credentials** and proves the Worker bundle assembles and the
Wrangler config is valid before anything is deployed for real.

**CI does not deploy.** A single system owns production; two competing deploy systems are
worse than one.

---

## 8. Principles

1. **Every past bug becomes a test.** The duplicate-H1 catch, the `www` redirect
   placeholder, the Error 1102 cache miss, the SMS shortcode strings — each is pinned so
   it cannot return.
2. **Validation asserts honesty, not just correctness.** "No SMS shortcode is published"
   is a test, because it is a promise.
3. **Tests read the real registries**, never fixtures — a fixture drifts, and then the
   suite reports green on data nobody ships.
4. **Similarity is measured after rendering.** Defects invisible in the data are obvious
   on the page.
5. **A test that disappears is not a test that passed.** Skips are failures.

# Deployment — 12thclassresult.com.pk

Production origin: **Cloudflare Workers**, via `@opennextjs/cloudflare`.
Canonical host: **`https://12thclassresult.com.pk`** (apex, not `www`).

---

## Commands

```bash
npm run check      # the complete pre-deployment quality gate
npm run preview    # opennext build -> stage cache -> local preview on workerd
npm run deploy     # opennext build -> stage cache -> deploy
```

`npm run check` runs, in order: `format:check`, `lint`, `typecheck`, `validate`,
`test`, `build`. **Never deploy on a red gate.**

---

## ⚠ The staging step is not optional

`npm run preview` and `npm run deploy` both run `stage-cache`
(`scripts/stage-prerender-cache.mjs`) between the build and the deploy. **Never run
`opennextjs-cloudflare deploy` directly**, because it skips that step.

Why it exists:

- `open-next.config.ts` uses `staticAssetsIncrementalCache`, which reads prerendered
  pages from `cdn-cgi/_next_cache/` **inside the uploaded assets**.
- The OpenNext build writes them to `.open-next/cache/<buildId>/`.
- Wrangler uploads `.open-next/assets` **and nothing else**.

Without the copy, the cache override is configured, looks correct, and has nothing to
read. Every request misses, the Worker re-renders the entire React tree, and under a
result-day burst Cloudflare terminates it with **Error 1102 — Worker exceeded resource
limits**. Intermittently, which is the worst way for it to fail.

The script exits non-zero if the source is missing, empty, or the copy is incomplete.
A deploy that quietly ships no cache is that bug returning.

---

## ⚠ `routes` must never be guessed

`wrangler.jsonc` currently declares **no `routes` entry**. This is deliberate.

A `routes` entry naming a zone the authenticated account does not hold **fails the
deploy outright**.

**Verified:** `12thclassresult.com.pk` delegates to Cloudflare nameservers
(`thea.ns` / `hasslo.ns`) and publishes no address record — so a zone exists and
nothing is currently served on the domain.

**Not verified:** that the zone sits on the authenticated account
(`c085ba412b1289d5950bd55daf501b51`, which belongs to the _11th-class_ project).

**Order of operations:**

1. Confirm with the owner which Cloudflare account owns this zone.
2. Deploy once **without** routes; confirm the Worker exists and serves.
3. Add the apex as a `custom_domain` route and redeploy.
4. Only then, if wanted, add `www` as a second `custom_domain`.

A Workers Custom Domain provisions its own proxied DNS record — never create a
placeholder record by hand.

### Why `www` would be added at all

For exactly one reason: so the permanent `www` → apex redirect in `next.config.ts`
has a hostname that resolves. If `www` is not attached to the Worker, that hostname
does not exist and a reader typing it gets a DNS error rather than a redirect.

`www` must **never** pass `isProductionHost()`. If the redirect ever failed open,
`www` then emits `noindex` and an apex canonical instead of silently duplicating the
entire site. A unit test asserts this.

### The redirect needs TWO rules

`next.config.ts` declares `/` and `/:path+` separately. A single `/:path*` matches the
bare root with an **empty capture** and emits the literal `:path*` in the `Location`
header — sending `https://www.<site>/` to a 404. The status is a correct 308 the whole
time, which is exactly why a status-only check calls it green. **Assert the redirect
target, not just the status.**

---

## Pre-deployment gate

- [ ] On `main`, working tree clean
- [ ] `git remote -v` is the intended repository
- [ ] `npx wrangler whoami` is the intended account
- [ ] `npm run check` green
- [ ] `npx wrangler deploy --dry-run` reports the expected bindings **only**
- [ ] No secret committed (`.env`, `.dev.vars`)
- [ ] No `planned` or `draft` page in the sitemap
- [ ] No fabricated result data, SMS shortcode or statistic
- [ ] Canonicals resolve to the apex

## Post-deployment

- Confirm the apex serves and returns a self-referential apex canonical.
- Confirm a non-production host returns `X-Robots-Tag: noindex, nofollow`.
- Confirm `robots.txt` and `/sitemap.xml` both 200 and reference each other correctly.
- Confirm an unknown route returns a real 404 with no stack trace.
- If `www` is attached, confirm the redirect **target** for root, a path, and a query
  string — not merely that a 3xx came back.

---

## Bindings

Only `ASSETS` (required by the adapter). No D1, KV or R2 — nothing in this foundation
needs one, the account has none provisioned, and R2 is not enabled. Add a binding only
against a real requirement, using ids returned by the authenticated account. **Never a
placeholder id.**

---

## Rollback

`npx wrangler deployments list` then `npx wrangler rollback`. Prefer deploying
forward: a rollback past the commit that attached a hostname leaves that hostname
pointing at nothing.

---

## CI does not deploy

`.github/workflows/ci.yml` runs validation only. A single system should own
production; two competing deploy systems are worse than one.

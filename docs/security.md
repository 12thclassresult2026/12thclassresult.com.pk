# Security Architecture

**Phase:** 2 — Architecture
**Date:** 2026-09-14

---

## 1. Threat model

| Threat                                           | Exposure today                                                | Control                                                             |
| ------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| Result-lookup abuse / brute-forcing roll numbers | **None — no lookup endpoint exists**                          | Designed before one ships: rate limit, body cap, bounded input      |
| Automated scraping of our pages                  | Low — everything is public, verified, attributed              | No control needed; the data is meant to be read                     |
| SQL injection                                    | **None — no database**                                        | Parameterized queries mandatory if D1 is ever adopted               |
| XSS                                              | Low — no user input is rendered                               | No `dangerouslySetInnerHTML` except JSON-LD, which is escaped       |
| JSON-LD script breakout                          | Real — board names and quoted notices are third-party strings | One serializer escapes `<`; unit-tested with an injection case      |
| Unvalidated route parameters                     | Real — dynamic board/year segments                            | `dynamicParams = false` + enumerated `generateStaticParams`         |
| Oversized request bodies                         | Future                                                        | 8 KB cap, checked before parsing                                    |
| Credential exposure                              | Real (build/deploy)                                           | No secret in the repo; `.env`/`.dev.vars` gitignored and CI-checked |
| Private data leakage                             | **None — no personal data is held**                           | Architectural, not procedural                                       |
| Cache poisoning of personal responses            | Future                                                        | `no-store` declared in two places                                   |
| Malicious third-party scripts                    | **None admitted**                                             | CSP admits no third party today                                     |
| Unsafe logging                                   | Real                                                          | Only `error.digest` is logged; never payloads                       |

The strongest control is structural: **the system holds no personal data and has no
database**, so the two highest-severity categories have no attack surface at all.

---

## 2. Input validation

All external input passes a Zod schema at the edge, before any work. Bounds are tight
because a legitimate query is a few dozen bytes.

| Input        | Rule                                                                 |
| ------------ | -------------------------------------------------------------------- |
| Board slug   | lowercase hyphenated, 2–64 chars, **and must exist in the registry** |
| Year         | integer, `[2000, currentYear + 1]`                                   |
| Examination  | enum, defaults to `annual`                                           |
| Group        | enum of known `GroupId` values                                       |
| Roll number  | trimmed, uppercased, 4–15 chars, `^[A-Z0-9-]+$`                      |
| Body         | ≤ 8 KB, checked **before** `JSON.parse`                              |
| Content type | must be `application/json`, else 415                                 |

The registry `.refine()` on board slug is the important one: without it, a well-formed
but arbitrary string would reach the service layer and be used to build an outbound URL.

### Request pipeline order

```
content-type → body size → rate limit → JSON.parse → schema → (challenge) → service
```

Cheap checks first, so a flood is refused before it costs anything. Any human-verification
challenge runs **before** any data read, so an unverified caller never reaches the data.

---

## 3. Rate limiting

Two layers, honestly scoped:

| Layer                                      | Scope           | Role                                                |
| ------------------------------------------ | --------------- | --------------------------------------------------- |
| Application (`lib/security/rate-limit.ts`) | **per isolate** | Cheap first line. Explicitly **not** a global limit |
| Cloudflare zone rate limiting              | account-wide    | The durable control                                 |

The in-process limiter is a fixed-window counter, bounded at 5,000 tracked keys with
eviction. It must never be described as a global guarantee — Workers run many isolates.

**Proposed limits** (when an endpoint exists): result lookup 20 req/60s; any future search
15 req/60s.

These are chosen to be invisible to a student checking their own result several times on
result morning — including retries after a board portal fails. **A limit that blocks a
legitimate student on result day is a worse failure than the abuse it prevents.**

**Keys never contain a roll number.** `clientKey()` uses `cf-connecting-ip`, falling back
to the first `x-forwarded-for` entry, plus an endpoint scope. A rate-limit table is
exactly the kind of incidental store where identifiers accumulate unnoticed.

---

## 4. Security headers

Applied site-wide from `next.config.ts`, plus `public/_headers` for static assets — which
Worker response headers do not cover, and whose absence an SEO crawl reports as dozens of
URLs missing headers.

| Header                              | Value                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `Content-Security-Policy`           | enforced; **no third party admitted today**                                |
| `Strict-Transport-Security`         | `max-age=63072000; includeSubDomains; preload`                             |
| `X-Content-Type-Options`            | `nosniff`                                                                  |
| `Referrer-Policy`                   | `strict-origin-when-cross-origin`                                          |
| `X-Frame-Options`                   | `DENY` (with CSP `frame-ancestors 'none'`)                                 |
| `Permissions-Policy`                | camera, microphone, geolocation, browsing-topics, interest-cohort all `()` |
| `Cross-Origin-Opener-Policy`        | `same-origin`                                                              |
| `X-Permitted-Cross-Domain-Policies` | `none`                                                                     |

### CSP policy discipline

The policy is **enforced, not decorative**. `'unsafe-inline'` remains on `style-src`
because Next.js injects inline styles for streaming and RSC.

A third-party origin is added **only when that third party is actually configured**, and
only for the directives it genuinely needs. It is never widened speculatively: a policy
that is constantly violated teaches everyone to ignore it.

Today that means no analytics origin and no challenge-widget origin are present, because
neither is configured.

---

## 5. Outbound links

Every board link uses `rel="noopener nofollow"`, links only **ownership-verified**
sources, and never links a source observed to 404 — a board publishing a dead link on its
own site is a real, observed case.

A resolving host is not a valid destination: one AJK subdomain serves a hosting-panel
default page and is explicitly barred from ever being presented as a result URL.

---

## 6. Automated access policy — a security control in both directions

`AUTOMATED_FETCH_POLICY = 'do-not-bypass'`, asserted repo-wide and covered by a test that
greps the source for browser-disguise and bypass patterns.

No user agent is spoofed. No CAPTCHA is touched. No anti-bot control is probed. No form is
submitted. No identifier is entered. No URL is built by editing a year token in someone
else's address. A 403 is recorded as a block, never retried with different headers.

This protects the boards from us, and protects the project from building on an
unsustainable and legally exposed foundation.

---

## 7. Secrets

| Rule                           | Enforcement                                                                |
| ------------------------------ | -------------------------------------------------------------------------- |
| No secret in the repository    | `.gitignore` + a CI grep for `.env` / `.dev.vars`                          |
| No secret in a browser bundle  | Server-only modules; no `NEXT_PUBLIC_` secret                              |
| No secret in `wrangler.jsonc`  | Only a public origin var is declared                                       |
| No secret in CI workflow files | Repository/environment secrets only                                        |
| No fabricated ids              | No placeholder account, database, namespace or token value exists anywhere |

---

## 8. Error handling

Public errors are plain-language and actionable. Internal detail is logged with a
correlation id and never rendered.

- `error.tsx` logs **only** `error.digest` — no stack, no payload — and shows the digest
  as a reference the reader can quote.
- No error response contains a stack trace, schema fragment, upstream body or internal
  path.
- A 404 returns a **real 404 status** — no soft 404, and no redirect of invalid URLs to
  the homepage.
- A removed page returns **410**, not a redirect to a parent.

---

## 9. Review triggers

Re-run this threat model when any of these happens:

1. A result lookup endpoint ships.
2. Any third party is admitted to the CSP.
3. D1, KV or R2 is provisioned.
4. A board grants API access or a data-sharing agreement.
5. Advertising is enabled.
6. Any form accepting user input is added.

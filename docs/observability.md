# Observability Architecture

**Phase:** 2 — Architecture
**Date:** 2026-09-14

---

## 1. Scope

Cloudflare Workers observability is enabled in `wrangler.jsonc`. The site is static, so
there is little runtime behaviour to observe — which is itself the point. Observability
here exists to answer four questions:

1. Is the Worker healthy, and is it serving from cache rather than re-rendering?
2. Did a deploy ship a complete, correct site?
3. Have the facts we publish gone stale?
4. Have the official sources we link changed or broken?

Questions 3 and 4 are **editorial** monitoring, and for a provenance-first site they
matter more than infrastructure metrics.

---

## 2. What is logged

| Event                        | Fields                                         | Never included                  |
| ---------------------------- | ---------------------------------------------- | ------------------------------- |
| Unhandled error              | `error.digest`, route, timestamp               | stack, payload, any identifier  |
| Worker error                 | Cloudflare-provided                            | —                               |
| Rate-limit rejection         | endpoint scope, coarse outcome                 | the client key, any roll number |
| Source check (if ever added) | `sourceId`, HTTP status, latency, availability | response body                   |

**Never logged, under any circumstances:** secrets, authorization headers, roll numbers,
candidate or father names, marks, full result records, request bodies.

`error.tsx` logs only the digest and surfaces it to the reader as a reference, so a
report can be matched to a server log without any internal detail reaching the page.

---

## 3. The signal that matters most

**Worker CPU time per request.**

The Error 1102 failure mode is not an exception — it is a page quietly costing hundreds
of milliseconds of CPU because the prerender cache is missing, until Cloudflare
terminates the Worker under load. It presents as intermittent flakiness with a clean
error log.

| Signal                              | Healthy                 | Investigate               |
| ----------------------------------- | ----------------------- | ------------------------- |
| CPU per request, static page        | low tens of ms          | > 100 ms sustained        |
| Cache status on a prerendered route | hit                     | **miss**                  |
| `stage-cache` staged file count     | > 0, matching the build | 0 → the deploy is refused |

A cache **miss on a route that is marked prerendered** is the specific signature. It is
worth checking after every deploy, not only when something looks wrong.

---

## 4. Correlation

A request id (Cloudflare's ray id, or a generated one for any future API) is attached to
error logs and surfaced as the reader-facing digest. That is enough to connect "a reader
reported this" to "this is the log line" without storing anything about the reader.

---

## 5. Editorial monitoring — the stale-content detector

This is the observability that is specific to this project. A scheduled report flags,
without changing anything automatically:

| Check                                                            | Trigger                                 |
| ---------------------------------------------------------------- | --------------------------------------- |
| Class A/B page past its review cadence                           | 3 days / 30 days since `lastReviewedAt` |
| A previous year appearing in a current-session title             | string check                            |
| A fact whose source is older than a newer notification           | `sourcePublishedAt` comparison          |
| An official URL that has started to fail                         | link check                              |
| "latest", "live", "announced", "confirmed" on an unverified fact | wording check against fact status       |
| An expired rechecking or second-annual deadline                  | date comparison                         |
| A gazette link that no longer resolves                           | link check                              |
| An empty new-year page                                           | registry check                          |

**Detection reports; it never deindexes or deletes.** A stale page is an editorial problem
to fix — removing it destroys the URL's history and the reader's bookmark.

---

## 6. Link health

Every outbound official link is checked on a schedule, conservatively and never from a
visitor request.

Findings feed the source registry rather than the page: a source observed to 404 changes
`status`, which changes what `linkableSources()` returns, which changes the page. The fact
flows through the data, never through a manual edit to prose.

**Constraint:** these are government servers. Checks are infrequent, sequential, and stop
on repeated failure rather than retrying — the same discipline the result-day posture
requires.

---

## 7. Post-deploy smoke test

`npm run smoke` (Phase 3) runs against a real origin and fails on any of:

1. A published page not returning 200
2. A canonical that is not the production origin, or not self-referential
3. A page missing exactly one `<h1>`
4. `localhost`, `127.0.0.1` or a preview host leaking into rendered output
5. A held page that is not `noindex`
6. `robots.txt` not 200, or not referencing the sitemap
7. A published path missing from the sitemap by **exact parsed membership**, never substring
8. An unknown route not returning a real 404
9. On HTTPS: the `www` → apex redirect asserted by **target**, not merely a 3xx

The page list is parsed **from the registry**, not hardcoded: a smoke test that drifts
reports green on the wrong thing, which is worse than no smoke test.

---

## 8. What is deliberately not built

| Not built                                          | Why                                                                        |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| APM / distributed tracing                          | One Worker, no services, no database                                       |
| Real-user monitoring                               | Third-party script; CSP admits none, and privacy cost outweighs the signal |
| Uptime pinging of board portals from user requests | Would make us part of a board's result-day outage                          |
| Error aggregation service                          | Cloudflare's own logs suffice at this scale                                |

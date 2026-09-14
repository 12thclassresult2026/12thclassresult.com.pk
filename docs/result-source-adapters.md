# Result Source Adapters

How this project talks — and deliberately does not talk — to board result systems.

## The finding this document exists to record

**No board adapter is registered, and none can be today.**

`BOARD_ADAPTERS` in [`lib/result-sources/adapter.ts`](../lib/result-sources/adapter.ts) is an
empty array. That is a policy state, not an unfinished one, and a unit test asserts it stays
empty.

The Phase 1 source survey assessed all 28 registered sources. The integration modes it produced:

| Integration mode           | Sources | Meaning                                             |
| -------------------------- | ------: | --------------------------------------------------- |
| `official-link`            |      19 | Send the reader to the board. No automated request. |
| `gazette-guidance`         |       7 | Explain how to read the board's gazette.            |
| `manual-verification-only` |       2 | Not enough was verified to route confidently.       |
| `server-integration`       |   **0** | Permitted automated lookup.                         |

`serverIntegrableSources()` returns `[]`, and that is the honest answer rather than a gap:

- **Six** sources across **five** boards present a confirmed CAPTCHA — Lahore, Gujranwala,
  Multan (reCAPTCHA), Bahawalpur (two session routes) and Bannu. A CAPTCHA is a board asking a
  human to prove they are one. Answering it programmatically is defeating a control the board
  deliberately put in place, so we do not, in any form — no solver, no service, no "just this
  one". Two further sources (Faisalabad, FBISE) blocked the check itself, so their CAPTCHA
  status is `blocked`, not absent.
- **Three** sit behind ASP.NET `VIEWSTATE` / `EVENTVALIDATION`, which structurally rejects posts
  that did not originate from a real session on the board's own page.
- **Three** produce no result at all without JavaScript execution.
- **Zero** publish an API, a data licence, or any statement permitting automated access.

The last line is the one that settles it. Even the single board that is a clean technical
candidate is not an ethical one without written permission, because the payload is a named
minor's marks alongside their father's name. A permissive `robots.txt` is not consent to
republish that.

### Why this is the product rather than a compromise

A site that cannot query any board can still be the most useful result site in this market,
because the competition's central failure is not missing lookups — it is confident wrong
information. Three competitors publish mutually contradictory result dates for the same board.
Several show a roll-number box for boards that have no roll-number lookup at all.

So the deliverable is: route every student to the best legitimate path for **their** board, and
be explicit about what is verified and what is not.

## The contract

```ts
export type BoardAdapter = {
  boardId: string
  sourceId: string
  allowedHosts: readonly string[]
  canLookup: () => boolean
  lookup: (query: ResultQuery, signal: AbortSignal) => Promise<ResultRecord | null>
  checkHealth?: (signal: AbortSignal) => Promise<SourceHealth>
}
```

`lookup` returns `null` for a genuine "no such record" and **throws** for everything else.
That split is the most important line in the engine — see below.

### The four gates

`getAdapterForBoard()` returns an adapter only if all four hold:

1. The adapter is not disabled by the kill switch.
2. Its own `canLookup()` returns true.
3. Its `sourceId` resolves in the source registry.
4. That source is still `server-integration` **and** not `hasCaptcha: 'verified-supported'`.

Gates 3 and 4 mean a source that is reclassified after a re-check — because it acquired a
CAPTCHA, or changed terms — stops being called with no other code change.

## The rule that matters most

> **"This candidate has no result" is NOT "our parser broke."**

A board redesigns its HTML. A naive implementation finds no rows, and returns a confident "not
found" to every student who asks — telling them something false about their own result, with
nothing in any log to notice.

So:

- A parse failure raises `ResultSourceError('PARSER_FAILURE')`. It is never degraded to
  `not-found`.
- An unrecognised exception is classified as `PARSER_FAILURE`, not `INTERNAL_ERROR`, because an
  unexpected throw during a lookup most often means the page shape changed. That classification
  fails **toward the official link** rather than toward a confident wrong answer.
- `not-found` is reachable from exactly one place: an adapter that completed successfully and
  explicitly returned `null`.
- A record arriving without `sourceId`/`sourceUrl`, or citing a source not in the registry, is
  rejected rather than displayed. A result a reader cannot check is one we cannot defend.

Six tests in [`tests/unit/result-service.test.ts`](../tests/unit/result-service.test.ts) exist
purely to try to make the engine violate this.

## Writing an adapter, if a board ever grants access

1. Get written permission. Record it in the source registry's `provenanceNote`.
2. Reclassify the source to `server-integration`.
3. Add the adapter, with `allowedHosts` naming every host it may contact.
4. Call `assertAllowedUrl(adapter, url)` before every fetch. It refuses non-https and any host
   off that adapter's allowlist, including a redirect that leaves approved infrastructure.
   **Upstream destinations come from configuration, never from user input** — no value a caller
   supplied may ever become part of a URL.
5. Normalise into `ResultRecord`. Missing fields are `null`, never `0` and never a guess.
6. Throw a typed `ResultSourceError` for every failure mode. Never return a partial record.
7. Respect the budget: one upstream request per reader request, `SOURCE_TIMEOUT_MS` (8s), and
   the circuit breaker. Never retry in a loop.

### Standing prohibitions

These do not become acceptable because an adapter exists:

- Never bypass or solve a CAPTCHA, or defeat any anti-bot measure.
- Never rotate identities, IPs or user agents to evade a restriction.
- Never trigger an upstream request for every site visitor.
- Never enumerate or bulk-download a board's result database.
- Never take student results from a competitor's site.
- Never log a full personal result payload, and never send any identifier — roll number, name,
  father's name, CNIC, B-Form, marks — to analytics.

## The synthetic adapter

`__registerTestAdapter()` exists so the machinery around the empty registry — breaker, timeout,
parse-failure classification, provenance assertion — is proven before the day it is needed
rather than on it.

Two independent guards keep it out of production: registration throws outside the test runner,
and resolution re-checks the runtime. Neither alone would do, because a bundler that mangles
`NODE_ENV` should not be able to silently enable a fake result source.

It skips exactly one gate — `integrationMode` — because no real source is classified
`server-integration`, which would otherwise make the machinery untestable. Every other gate
still applies.

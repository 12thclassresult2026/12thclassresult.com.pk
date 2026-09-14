# Result Day Operations

What happens on the one morning of the year this site is actually judged.

## The shape of the day

A board announces at a press conference, usually around 10:00 PKT. Within minutes, traffic for
that board rises by two to three orders of magnitude, and the board's own servers — which are
sized for an ordinary day — slow down or stop responding entirely. Every aggregator's "live"
banner keeps claiming everything is fine.

Two consequences shape every decision below:

1. **The board's portal will probably be degraded at the exact moment readers need it.** Our
   job is to say so accurately, not to pretend otherwise and not to add to the load.
2. **Being wrong is worse than being slow.** A student who is told "no result found" because a
   parser broke has been told something false about their own life.

## What this site does under load

Result pages are statically generated and served from Cloudflare's edge. They do not call any
board on render, so a board being down does not take our pages down, and our traffic does not
become the board's traffic.

There is **no per-visitor upstream request anywhere in the system**. Health checks are
scheduled, one per source per interval, and the read path only ever consults the cache. This is
not a performance optimisation — it is the difference between serving students and making the
board's outage worse for everyone, including them.

## Circuit breaker

Defined in [`lib/result-sources/health.ts`](../lib/result-sources/health.ts).

| Setting             | Value | Why                                           |
| ------------------- | ----: | --------------------------------------------- |
| Failure threshold   |     3 | Three consecutive upstream failures opens it. |
| Cooldown            | 2 min | Then one trial request, not a flood.          |
| Per-request timeout |    8s | Past this, a reader is better served a link.  |

Only `SOURCE_TIMEOUT`, `SOURCE_OFFLINE` and `SOURCE_BAD_RESPONSE` count toward it. A validation
error is the caller's, not the board's — counting those would let malformed input take a healthy
source offline for everyone.

`SOURCE_BLOCKED` maps to availability `blocked`, never `offline`. A board that declines automated
access is working perfectly. Recording that as an outage would misrepresent the board and would
invite a "fix" that means evading the block.

State is per-isolate rather than shared. That fails closed locally and can never wrongly hold a
source open globally, which is the conservative direction. A shared breaker needs a durable
store; ADR-007 defers that until an adapter exists to justify it, and none does.

## Kill switch

```ts
disableAdapter('bise-lahore') // stops upstream calls immediately
enableAdapter('bise-lahore')
```

Incident recovery must never require deleting code or unpublishing a page. A disabled adapter
stops making requests; the board page keeps working and falls back to official links. A test
asserts the fallbacks survive the switch.

## Runbook

### The board's portal is down or crawling

Do nothing to the portal. This is expected and it is not ours to fix.

Confirm the source health note reflects reality, and that the page is showing the fallback
ladder. Readers should be seeing the gazette route and the board's own domain.

**Do not** add retry logic, raise the timeout, or "just try once more" — the board is already
struggling and our retries are indistinguishable from an attack.

### A lookup is returning wrong or empty data

Assume the parser, not the students. Disable the adapter for that board immediately
(`disableAdapter`), which returns the page to official links with no deployment.

Then check whether the source changed shape. If it did, the fix is a new parser **plus** a test
reproducing the exact failure — not a tweak that makes today's page look right.

### A board announces a date we have not verified

Do not publish it because three aggregators agree. They routinely agree with each other and
disagree with the board.

A date reaches a page only as a `VerifiedFact` with a `sourceId`, a `sourceUrl`, and a
`sourcePublishedAt`. Until then its status is `expected` or `unknown`, and the page says so.
Only a `confirmed` fact may drive a countdown, because a countdown is an unqualified promise
that something happens at a specific moment.

### A per-group board declares one group

Update **only** that group's dataset. Do not set a board-level "announced".

Karachi's 2026 groups declared across four weeks, and Commerce was still undeclared after six
others were out. A board-level banner would have been wrong for every Commerce candidate — and
it is exactly what every competitor showed.

### Traffic spike

Nothing to do. Static pages at the edge, no upstream calls. Verify cache hit ratio and that no
page has accidentally become dynamic.

## What must never happen on result day

Under deadline pressure these get proposed. They stay prohibited:

- Publishing a result date, SMS shortcode or result payload that is not verified from a board's
  own source.
- Copying results from a competitor to fill a gap.
- Solving a CAPTCHA, rotating identities, or raising request rates against a board.
- Showing a "LIVE" badge, a countdown, or a result-announced banner that is not backed by a
  confirmed fact.
- Logging a personal result payload, or sending any candidate identifier to analytics.
- Making a personal result response indexable or putting it in a sitemap.

## Pre-season checklist

- [ ] Re-verify every source's availability and capability; update `lastCheckedAt`.
- [ ] Re-check each board's access model — a gazette-only board may have gained a portal.
- [ ] Confirm no unverified date, shortcode or capability has crept into the registry.
- [ ] Run the full gate: `npm run check`.
- [ ] Confirm `BOARD_ADAPTERS` is still empty, or that any entry has documented permission.
- [ ] Confirm the kill switch works in the deployed environment.

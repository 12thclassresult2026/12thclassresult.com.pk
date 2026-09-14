# Authority Baseline

**Date:** 2026-09-14 · **Cycle:** 2026 · **Status:** pre-launch

---

## The baseline is zero, and that is a measurement

| Metric                  | Value | Why                                            |
| ----------------------- | ----- | ---------------------------------------------- |
| Referring domains       | **0** | The domain has never served a page             |
| Total backlinks         | **0** | —                                              |
| Dofollow/nofollow mix   | n/a   | —                                              |
| Top linked pages        | none  | —                                              |
| Anchor distribution     | n/a   | —                                              |
| Unlinked brand mentions | **0** | The brand has never been public                |
| Referral traffic        | **0** | —                                              |
| Branded search volume   | **0** | Nobody can search for a site they cannot reach |

`12thclassresult.com.pk` resolves to Cloudflare nameservers and serves nothing. The Worker is
deployed with no routes attached because the zone sits on a different Cloudflare account — see
`launch-report.md`.

No metrics are estimated, and no third-party authority score is quoted. There is nothing to
measure yet, and inventing a starting figure would corrupt every later comparison.

---

## Outreach is not merely premature — it is actively harmful right now

This is the most important line in this document.

**Pitching a journalist, educator or publisher a URL that does not resolve burns that
relationship permanently.** A first impression of "this person sent me a dead link" is not
recoverable by a later, better pitch. The people Phase 9 exists to build credibility with are
precisely the people a broken link would cost us.

So no outreach happens until the site is live and stable. Everything below is preparation.

---

## What is being built instead

Phase 9's own principle sets the order:

```
Useful Asset → Relevant Audience → Legitimate Promotion → Editorial Discovery → Mentions
```

Pre-launch, only the first step is available. The work is therefore to make the site **worth
citing**, which is the half that does not depend on being live.

The specific gap closed in this phase: the site had **no trust layer at all** — no about page, no
public methodology, no stated corrections process. §67 is blunt about the consequence:
_"Anonymous-looking sites are harder to cite."_ A journalist landing here could not establish who
operated the site or how a figure was verified.

`/about` and `/methodology` now exist.

---

## Competitor link gap — deferred, with a reason

`competitor-link-gap.csv` is **not** created yet, and the honest reason is that no backlink data
source is available in this environment. Fabricating a competitor's referring domains from
memory would produce a file that looks like research and is not.

What Phase 1 research already established, without link data:

- No competitor in this market has a first-party result checker; every one is a router
- Several publish mutually contradictory result dates and SMS shortcodes
- The Pakistani HSSC rechecking surface is answered almost entirely by Indian board content

That last point is the strongest authority opportunity on the site, and it does not require
knowing anyone's backlink profile.

**To fill this in:** run the domains through a backlink tool and record referring domains, target
pages and whether each link is editorial. Classify before treating any as an opportunity — a
competitor link may be expired spam, paid placement, or a hacked site (§9).

---

## Measurement, once live

Track and compare against this zero baseline:

| Metric                     | Where from                           |
| -------------------------- | ------------------------------------ |
| Relevant referring domains | Backlink tool                        |
| Links to deep assets       | Backlink tool, by target URL         |
| Branded search growth      | Search Console, branded queries      |
| Referral traffic           | Server logs or analytics if added    |
| Editorial mentions         | Manual, logged in `earned-links.csv` |

**Not** total backlinks. Ten editorial links from Pakistani education publishers are worth more
than ten thousand from anywhere else, and a count invites the behaviour this phase prohibits.

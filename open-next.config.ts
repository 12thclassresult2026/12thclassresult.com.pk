import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

/**
 * OpenNext Cloudflare adapter configuration.
 *
 * THE INCREMENTAL CACHE IS NOT OPTIONAL HERE, and the reason is counter-
 * intuitive enough to write down.
 *
 * This site is almost entirely prerendered: nothing revalidates at runtime,
 * every public page is built ahead of time. The tempting conclusion is that no
 * incremental cache is needed. That conclusion is wrong, and on the sibling
 * 11th-class project it cost production outages.
 *
 * Without an incremental cache configured, OpenNext has nowhere to read a
 * prerendered page FROM. Every request misses and the Worker re-renders the
 * entire React tree to reproduce, byte for byte, HTML that was already built.
 * Measured there before the fix:
 *
 *   /robots.txt    37-43 ms CPU     - the real cost of serving a file
 *   /             163-486 ms CPU    - the same work, redone, every request
 *
 * Cloudflare terminates a Worker that exceeds its resource limits, so on a cold
 * isolate or under a burst the homepage returned "Error 1102" instead of a
 * page - intermittently, which is why it reads as flakiness rather than a bug.
 * A result site's worst-case traffic is a result-day spike, which is exactly
 * the condition that triggers it.
 *
 * `staticAssetsIncrementalCache` is the correct override for this shape: its
 * own documentation says it is for applications that do NOT want revalidation
 * and ONLY want to serve prerendered data. Its `set` is a no-op and it needs no
 * KV, R2 or D1 provisioned - it reads prerendered output straight from the
 * assets uploaded alongside the Worker. No new binding, no new infrastructure.
 *
 * THE SECOND HALF OF THIS FIX LIVES IN `scripts/stage-prerender-cache.mjs`.
 * OpenNext writes cache files to `.open-next/cache/<buildId>/`, which Wrangler
 * does not upload; only `.open-next/assets` is uploaded. Without that staging
 * step this override has nothing to read and the failure returns silently.
 * Never run a deploy that skips it.
 *
 * IF A PAGE EVER NEEDS REAL ISR, this override cannot serve it - revalidation
 * has nowhere to write. That is the moment to provision KV or R2 and swap the
 * override, not a reason to run without one now.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
})

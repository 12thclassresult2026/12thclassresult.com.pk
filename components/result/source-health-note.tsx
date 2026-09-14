import type { SourceAvailability } from '@/lib/result-sources/types'

import { displayHealth } from '@/lib/result-sources/health'
import { formatDay } from './provenance-block'

/**
 * What we know about a source's availability, and how much that is worth.
 *
 * This page is statically rendered, so at build time no probe has run and this
 * falls back to the registry's recorded manual check. It says so. A status
 * observed weeks ago is not a live status, and presenting it as one would be
 * the same class of error as publishing an unverified result date.
 *
 * Note what this deliberately does NOT say: nothing here implies anything about
 * whether a result has been declared. A board's portal is reachable every day
 * of the year; reachability and declaration are different facts, and conflating
 * them is how a site ends up announcing a result that does not exist.
 */

const AVAILABILITY_SENTENCE: Record<SourceAvailability, string> = {
  online: 'responded normally',
  degraded: 'was slow or partly unavailable',
  offline: 'did not respond',
  blocked: 'declined automated checks, which usually does not affect a normal browser',
  unknown: 'has not been checked automatically',
}

export function SourceHealthNote({
  sourceId,
  className = '',
}: {
  sourceId: string
  className?: string
}) {
  const health = displayHealth(sourceId)
  if (!health) return null

  const when = health.checkedAt ? formatDay(health.checkedAt) : null

  return (
    <p className={`text-xs text-[var(--text-muted)] ${className}`.trim()}>
      {when ? (
        <>
          When we last checked on {when}, this source {AVAILABILITY_SENTENCE[health.availability]}.
        </>
      ) : (
        <>We have no automated availability check for this source.</>
      )}{' '}
      {/*
        The qualifier is not boilerplate. Without it a reader can reasonably
        read a status line as live, and act on it on the one morning where
        being wrong matters most.
      */}
      This describes the site’s availability when it was checked, not whether a result has been
      announced.
    </p>
  )
}

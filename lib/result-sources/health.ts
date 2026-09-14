import type { ResultSource, SourceAvailability, SourceHealth } from './types'

import { RESULT_SOURCES, getSource } from './registry'
import { shouldCountTowardCircuitBreaker, type ResultErrorCode } from './errors'

/**
 * Source health tracking and the circuit breaker.
 *
 * TWO RULES THIS MODULE EXISTS TO ENFORCE:
 *
 * 1. HTTP 200 IS NOT "THE RESULT IS OUT".
 *    A board homepage returns 200 every day of the year. Availability and
 *    result-state are therefore separate fields, and a health probe may only
 *    ever write availability. `resultState` stays whatever the registry says
 *    until a human verifies otherwise — no probe can promote it.
 *
 * 2. HEALTH CHECKS ARE NEVER VISITOR-TRIGGERED.
 *    One check per source per interval, from a scheduled job. If a page view
 *    triggered a probe, then result day — the exact moment a board's servers
 *    are least able to cope — would turn our traffic into their load. The
 *    read path only ever consults the cache.
 */

/** Minimum spacing between probes of the same source, outside result season. */
export const HEALTH_CHECK_INTERVAL_MS = 15 * 60 * 1000

/** Spacing during an active result window, where staleness costs more. */
export const HEALTH_CHECK_INTERVAL_RESULT_DAY_MS = 5 * 60 * 1000

/** Consecutive upstream failures before we stop calling a source. */
export const CIRCUIT_BREAKER_THRESHOLD = 3

/** How long the breaker stays open before a single trial request. */
export const CIRCUIT_BREAKER_COOLDOWN_MS = 2 * 60 * 1000

/** Per-request upstream budget. Beyond this a reader is better served a link. */
export const SOURCE_TIMEOUT_MS = 8000

export type CircuitState = 'closed' | 'open' | 'half-open'

type BreakerRecord = {
  consecutiveFailures: number
  openedAt: number | null
}

/**
 * In-memory state.
 *
 * Deliberately per-isolate rather than shared. On Workers this means a breaker
 * protects one isolate's traffic, which is the conservative direction: it can
 * fail closed locally, never wrongly hold a source open globally. Sharing it
 * would need a durable store, which ADR-007 defers until an adapter exists to
 * justify it — and none does.
 */
const BREAKERS = new Map<string, BreakerRecord>()
const HEALTH_CACHE = new Map<string, SourceHealth>()

function breakerFor(sourceId: string): BreakerRecord {
  const existing = BREAKERS.get(sourceId)
  if (existing) return existing
  const created: BreakerRecord = { consecutiveFailures: 0, openedAt: null }
  BREAKERS.set(sourceId, created)
  return created
}

export function circuitState(sourceId: string, now: number = Date.now()): CircuitState {
  const breaker = BREAKERS.get(sourceId)
  if (!breaker || breaker.openedAt === null) return 'closed'
  if (now - breaker.openedAt >= CIRCUIT_BREAKER_COOLDOWN_MS) return 'half-open'
  return 'open'
}

/** True when a call may proceed. A half-open breaker allows exactly one trial. */
export function canAttempt(sourceId: string, now: number = Date.now()): boolean {
  return circuitState(sourceId, now) !== 'open'
}

export function recordSuccess(sourceId: string): void {
  BREAKERS.set(sourceId, { consecutiveFailures: 0, openedAt: null })
}

export function recordFailure(
  sourceId: string,
  code: ResultErrorCode,
  now: number = Date.now(),
): void {
  // A validation error is the caller's fault, not the board's. Counting it
  // would let malformed input take a healthy source offline for everyone.
  if (!shouldCountTowardCircuitBreaker(code)) return

  const breaker = breakerFor(sourceId)
  breaker.consecutiveFailures += 1
  if (breaker.consecutiveFailures >= CIRCUIT_BREAKER_THRESHOLD) {
    breaker.openedAt = now
  }
}

/** Test seam. Never called from request handling. */
export function resetCircuitBreakers(): void {
  BREAKERS.clear()
}

/**
 * Map a failure code to the availability it implies.
 *
 * `SOURCE_BLOCKED` maps to `blocked`, not `offline`: a board that declines
 * automated access is working perfectly. Recording it as an outage would
 * misrepresent the board and would invite a "fix" that means evading the block.
 */
export function availabilityForError(code: ResultErrorCode): SourceAvailability {
  switch (code) {
    case 'SOURCE_OFFLINE':
      return 'offline'
    case 'SOURCE_BLOCKED':
    case 'CAPTCHA_REQUIRED':
      return 'blocked'
    case 'SOURCE_TIMEOUT':
    case 'SOURCE_BAD_RESPONSE':
    case 'SOURCE_CHANGED':
    case 'PARSER_FAILURE':
      return 'degraded'
    default:
      return 'unknown'
  }
}

export function cacheHealth(health: SourceHealth): void {
  HEALTH_CACHE.set(health.sourceId, health)
}

export function cachedHealth(sourceId: string): SourceHealth | undefined {
  return HEALTH_CACHE.get(sourceId)
}

export function clearHealthCache(): void {
  HEALTH_CACHE.clear()
}

export function isHealthStale(
  health: SourceHealth,
  now: number = Date.now(),
  intervalMs: number = HEALTH_CHECK_INTERVAL_MS,
): boolean {
  const checkedAt = Date.parse(health.checkedAt)
  if (Number.isNaN(checkedAt)) return true
  return now - checkedAt > intervalMs * 2
}

/**
 * The health a reader should be shown, and how much to trust it.
 *
 * Falls back to the registry's recorded status when no probe has run, and
 * reports staleness rather than hiding it — a status observed six hours ago is
 * not a live status, and saying so is the difference between information and a
 * claim we cannot support.
 */
export type DisplayHealth = {
  sourceId: string
  availability: SourceAvailability
  checkedAt: string | null
  stale: boolean
  /** True when this came from a probe rather than the registry's last manual check. */
  live: boolean
}

export function displayHealth(sourceId: string, now: number = Date.now()): DisplayHealth | null {
  const source = getSource(sourceId)
  if (!source) return null

  const cached = HEALTH_CACHE.get(sourceId)
  if (!cached) {
    return {
      sourceId,
      availability: source.status,
      checkedAt: source.lastCheckedAt,
      stale: true,
      live: false,
    }
  }

  return {
    sourceId,
    availability: cached.availability,
    checkedAt: cached.checkedAt,
    stale: isHealthStale(cached, now),
    live: true,
  }
}

/**
 * Sources a scheduled job may probe.
 *
 * Excludes anything marked `blocked` — re-probing a source that has declined
 * automated access is exactly the "keep trying until it works" pattern the
 * access policy prohibits, and repetition would make it worse, not better.
 */
export function probeableSources(): ResultSource[] {
  return RESULT_SOURCES.filter(
    (source) =>
      source.isOfficial && source.status !== 'blocked' && source.url.startsWith('https://'),
  )
}

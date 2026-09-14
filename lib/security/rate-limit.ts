/**
 * Application-level rate limiting for dynamic endpoints (section 38).
 *
 * HONEST SCOPE: this is a per-isolate fixed-window counter. Cloudflare runs
 * many isolates, so this is NOT a global limit and must never be described as
 * one. It is a cheap first line that stops a single client hammering one
 * isolate. Durable, account-wide limiting is Cloudflare's own rate limiting,
 * configured on the zone — this does not replace it.
 */

type Entry = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Entry>()

/** Bounded so a flood of unique keys cannot grow memory without limit. */
const MAX_TRACKED_KEYS = 5000

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

function evictExpired(now: number): void {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key)
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) evictExpired(now)
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    }
  }

  existing.count += 1
  const remaining = Math.max(0, limit - existing.count)
  return {
    allowed: existing.count <= limit,
    remaining,
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  }
}

/**
 * Builds the bucket key for a request.
 *
 * NEVER include the roll number or any candidate identifier here (section 39).
 * A rate-limit key is retained in memory and is exactly the kind of incidental
 * store where personal identifiers accumulate unnoticed. The client address and
 * the endpoint scope are all that is needed to limit abuse.
 */
export function clientKey(request: Request, scope: string): string {
  const cfIp = request.headers.get('cf-connecting-ip')
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = cfIp ?? forwarded?.split(',')[0]?.trim() ?? 'unknown'
  return `${scope}:${ip}`
}

/** Test-only hook so suites do not leak counters into one another. */
export function __resetRateLimitState(): void {
  buckets.clear()
}

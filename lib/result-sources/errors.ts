/**
 * Typed failure classification for the result engine.
 *
 * THE DISTINCTION THAT MATTERS MOST:
 *
 *   "this candidate has no result"   is NOT   "our parser broke"
 *
 * A source that redesigns its HTML will, in a naive implementation, produce a
 * confident "not found" for every student. That is the single worst failure
 * this engine can have — it tells a candidate something false about their own
 * result, with no error anywhere to notice.
 *
 * So parser failure is its own class, it never degrades to `not-found`, and it
 * fails closed to a fallback.
 */

export type ResultErrorCode =
  // Request-side — the caller can fix these.
  | 'VALIDATION_ERROR'
  | 'BOARD_UNSUPPORTED'
  | 'YEAR_UNSUPPORTED'
  | 'RATE_LIMITED'
  // Capability — the board does not offer this, which is not a failure.
  | 'NO_LOOKUP_EXISTS'
  | 'CAPTCHA_REQUIRED'
  | 'RESULT_NOT_ANNOUNCED'
  // Upstream — the board's side.
  | 'SOURCE_TIMEOUT'
  | 'SOURCE_OFFLINE'
  | 'SOURCE_BLOCKED'
  | 'SOURCE_BAD_RESPONSE'
  // Ours.
  | 'SOURCE_CHANGED'
  | 'PARSER_FAILURE'
  | 'INTERNAL_ERROR'

/**
 * An internal failure. `detail` is for logs only and must never be rendered:
 * it may contain upstream fragments, selectors or status lines.
 */
export class ResultSourceError extends Error {
  readonly code: ResultErrorCode
  readonly sourceId: string | null
  readonly retryAfterSeconds: number | null

  constructor(
    code: ResultErrorCode,
    options: { detail?: string; sourceId?: string; retryAfterSeconds?: number } = {},
  ) {
    super(options.detail ?? code)
    this.name = 'ResultSourceError'
    this.code = code
    this.sourceId = options.sourceId ?? null
    this.retryAfterSeconds = options.retryAfterSeconds ?? null
  }
}

/**
 * Public, plain-language messages.
 *
 * Every one of these is written to be actionable and to avoid implying anything
 * about the candidate's academic outcome. In particular, nothing here says or
 * suggests "you failed" — a lookup state is not an academic state.
 */
const PUBLIC_MESSAGES: Record<ResultErrorCode, string> = {
  VALIDATION_ERROR: 'Please check the details you entered and try again.',
  BOARD_UNSUPPORTED: 'This board is not covered here yet.',
  YEAR_UNSUPPORTED: 'That examination year is not covered here.',
  RATE_LIMITED: 'Too many attempts in a short time. Please wait a moment and try again.',
  NO_LOOKUP_EXISTS:
    'This board does not publish an online roll-number result check. Use the alternatives below.',
  CAPTCHA_REQUIRED:
    'This board asks you to complete a security check on its own site, which only you can do.',
  RESULT_NOT_ANNOUNCED: 'This result has not been announced yet.',
  SOURCE_TIMEOUT: 'The board’s portal did not respond in time. Your result is not affected.',
  SOURCE_OFFLINE: 'The board’s portal is not responding right now. Your result is not affected.',
  SOURCE_BLOCKED: 'We cannot check this board automatically. Use the official link below.',
  SOURCE_BAD_RESPONSE:
    'The board’s portal returned something we could not read. Your result is not affected.',
  SOURCE_CHANGED:
    'The board’s portal has changed and we cannot read it reliably. Use the official link below.',
  PARSER_FAILURE:
    'We could not read the board’s response reliably, so we will not guess. Use the official link below.',
  INTERNAL_ERROR: 'Something went wrong on our side. Please try again.',
}

export function publicMessageFor(code: ResultErrorCode): string {
  return PUBLIC_MESSAGES[code]
}

/**
 * Whether a failure is the board's side rather than the request's.
 * These are the ones that should surface the fallback ladder.
 */
export function isUpstreamFailure(code: ResultErrorCode): boolean {
  return (
    code === 'SOURCE_TIMEOUT' ||
    code === 'SOURCE_OFFLINE' ||
    code === 'SOURCE_BLOCKED' ||
    code === 'SOURCE_BAD_RESPONSE' ||
    code === 'SOURCE_CHANGED' ||
    code === 'PARSER_FAILURE'
  )
}

/**
 * Whether repeated occurrences should open the circuit breaker.
 *
 * A validation error is the caller's; a timeout is the board struggling. Only
 * the second kind should make us back off — and backing off matters, because
 * retrying into an overloaded government portal makes its outage worse.
 */
export function shouldCountTowardCircuitBreaker(code: ResultErrorCode): boolean {
  return code === 'SOURCE_TIMEOUT' || code === 'SOURCE_OFFLINE' || code === 'SOURCE_BAD_RESPONSE'
}

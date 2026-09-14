/**
 * Capability status — the six-state model (ADR-006).
 *
 * THIS MODULE EXISTS TO MAKE A SPECIFIC BUG IMPOSSIBLE.
 *
 * The natural thing to type is `value ? 'Yes' : 'No'`, which silently converts
 * every unverified capability into a denial. A student told "SMS: No" when the
 * truth is "we have not checked" has been told something false about how to get
 * their own result — and on result day they may act on it.
 *
 * So the conversion lives here, once, and there is deliberately no branch that
 * can produce "No" from anything other than `verified-unsupported`.
 *
 * The previous model was `boolean | null`. It conflated two different unknowns:
 * *we have not checked* and *the board prevents us from checking*. Three boards
 * refuse automated requests outright; recording that as `unknown` loses the
 * reason, which is exactly the kind of detail that decides whether a gap is
 * worth re-checking or needs a human with a browser.
 */

export type CapabilityStatus =
  /** Observed working on the board's own page. */
  | 'verified-supported'
  /** Observed absent on the pages actually fetched. */
  | 'verified-unsupported'
  /** Not checked, or not establishable from what was fetched. */
  | 'unknown'
  /** The board offers it; it is down right now. */
  | 'temporarily-unavailable'
  /** We are prevented from checking (WAF block, CAPTCHA wall). */
  | 'blocked'
  /** Exists, but only through an in-person or offline process. */
  | 'manual-only'

export const CAPABILITY_STATUSES: readonly CapabilityStatus[] = [
  'verified-supported',
  'verified-unsupported',
  'unknown',
  'temporarily-unavailable',
  'blocked',
  'manual-only',
] as const

/**
 * The single place a capability becomes words shown to a reader.
 *
 * Only `verified-unsupported` may produce "No". Everything else says what it
 * actually means.
 */
export function capabilityLabel(status: CapabilityStatus): string {
  switch (status) {
    case 'verified-supported':
      return 'Yes'
    case 'verified-unsupported':
      return 'No'
    case 'unknown':
      return 'Not verified'
    case 'temporarily-unavailable':
      return 'Temporarily unavailable'
    case 'blocked':
      return 'Cannot be checked'
    case 'manual-only':
      return 'In person only'
  }
}

/** Longer form for tooltips and table footnotes. */
export function capabilityDetail(status: CapabilityStatus): string {
  switch (status) {
    case 'verified-supported':
      return 'Confirmed by loading the board’s own page.'
    case 'verified-unsupported':
      return 'Checked on the board’s own page and not offered there.'
    case 'unknown':
      return 'Not verified yet. Absence of evidence is not evidence of absence.'
    case 'temporarily-unavailable':
      return 'The board offers this, but it was not working when last checked.'
    case 'blocked':
      return 'This board’s site refuses automated checks, so we cannot confirm it either way.'
    case 'manual-only':
      return 'Available, but only in person or by post — not online.'
  }
}

/**
 * Whether a capability may be advertised to a reader as available.
 * Only an explicit `verified-supported` qualifies.
 */
export function isAdvertisable(status: CapabilityStatus): boolean {
  return status === 'verified-supported'
}

/**
 * Whether we were prevented from establishing this, as opposed to simply not
 * having looked. Drives "needs a human with a browser" reporting.
 */
export function isBlocked(status: CapabilityStatus): boolean {
  return status === 'blocked'
}

/**
 * One sentence describing what a portal will ask for beyond a roll number.
 *
 * Built only from statuses verified present. Anything else produces no claim at
 * all, rather than a reassuring one: telling someone a roll number is all they
 * need, when we have not checked whether the portal also demands a B-Form
 * number or a security check, sends them to a page they cannot get through.
 */
export function identifierRequirementSentence(input: {
  requiresAdditionalIdentifier: CapabilityStatus
  hasCaptcha: CapabilityStatus
}): string | null {
  const parts: string[] = []
  if (input.requiresAdditionalIdentifier === 'verified-supported') {
    parts.push('asks for an additional identifier such as a CNIC or B-Form number')
  }
  if (input.hasCaptcha === 'verified-supported') {
    parts.push('requires a security check you must complete yourself')
  }
  if (parts.length === 0) return null
  return `This portal ${parts.join(' and ')}.`
}

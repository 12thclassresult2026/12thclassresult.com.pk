/**
 * The one place a nullable capability becomes words (sections 71, 86).
 *
 * THIS MODULE EXISTS TO MAKE A SPECIFIC BUG IMPOSSIBLE.
 *
 * Capability flags across this project are `boolean | null`, where `null` means
 * "we have not verified this", not "no". The natural thing to type is:
 *
 *     value ? 'Yes' : 'No'
 *
 * which silently converts every unverified capability into a denial. A student
 * told "SMS: No" when the truth is "we have not checked" has been told
 * something false about how to get their own result — and on result day they
 * may act on it.
 *
 * So the conversion lives here, once, and returns three words for three states.
 */

export type CapabilityValue = boolean | null

export function capabilityLabel(value: CapabilityValue): 'Yes' | 'No' | 'Not verified' {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  return 'Not verified'
}

/** Longer form for tooltips and table footnotes. */
export function capabilityDetail(value: CapabilityValue): string {
  if (value === true) return 'Confirmed by loading the board’s own page.'
  if (value === false) return 'Checked on the board’s own page and not offered there.'
  return 'Not verified yet. Absence of evidence is not evidence of absence.'
}

/**
 * Whether a capability may be advertised to a reader as available.
 * Only an explicit `true` qualifies — never a `null`.
 */
export function isAdvertisable(value: CapabilityValue): boolean {
  return value === true
}

/**
 * One sentence describing what a portal will ask for beyond a roll number.
 *
 * Built only from flags verified `true`. A `null` produces no claim at all,
 * rather than a reassuring one: telling someone a roll number is all they need,
 * when we have not checked whether the portal also demands a B-Form number or a
 * security check, sends them to a page they cannot get through.
 */
export function identifierRequirementSentence(input: {
  requiresAdditionalIdentifier: CapabilityValue
  hasCaptcha: CapabilityValue
}): string | null {
  const parts: string[] = []
  if (input.requiresAdditionalIdentifier === true) {
    parts.push('asks for an additional identifier such as a CNIC or B-Form number')
  }
  if (input.hasCaptcha === true) {
    parts.push('requires a security check you must complete yourself')
  }
  if (parts.length === 0) return null
  return `This portal ${parts.join(' and ')}.`
}

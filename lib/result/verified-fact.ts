/**
 * The provenance model for every volatile fact on this site (sections 29, 77,
 * 158).
 *
 * A result date, an SMS shortcode, a "results are live" claim and a gazette
 * availability are all factual claims about the world that change over time and
 * that a student will act on. None of them may exist in this codebase as a bare
 * value. They exist as a value PLUS where it came from, when the source
 * published it, when we last checked, and how confident that makes us.
 */

/**
 * Five states, and the distinctions between them are load-bearing.
 *
 *  - `confirmed`  an official source states it plainly, as current fact.
 *  - `tentative`  an OFFICIAL source states it, and that source itself labels
 *                 the value provisional / subject to change.
 *  - `expected`   OUR inference, from a prior-year pattern or from secondary
 *                 reporting. Not something any board has said.
 *  - `historical` it was true for a past session and is recorded as history.
 *  - `unknown`    not verified. The correct default for everything.
 *
 * `tentative` and `expected` are deliberately distinct. Collapsing them would
 * either overstate our own inference as an official notification, or understate
 * a real board notification as guesswork. Both errors are visible to a student
 * on the one day the answer matters.
 */
export type FactStatus = 'confirmed' | 'tentative' | 'expected' | 'historical' | 'unknown'

export type VerifiedFact<T> = {
  value: T | null
  status: FactStatus
  sourceId: string | null
  sourceUrl: string | null
  /**
   * ISO date the SOURCE was published — deliberately distinct from `checkedAt`.
   *
   * A notification published in February and read in September is stale
   * evidence even though the check is fresh. Supersession cannot be reasoned
   * about without both dates.
   */
  sourcePublishedAt: string | null
  /** ISO timestamp we last read the source. */
  checkedAt: string | null
  /** Exactly which examination/session/year this fact applies to. */
  validFor?: string
}

/** The correct default for any fact that has not been verified. */
export function unknownFact<T>(validFor?: string): VerifiedFact<T> {
  return {
    value: null,
    status: 'unknown',
    sourceId: null,
    sourceUrl: null,
    sourcePublishedAt: null,
    checkedAt: null,
    ...(validFor === undefined ? {} : { validFor }),
  }
}

/**
 * True only for a fact an official source states as current fact, with a value
 * and a registered source. Returns FALSE for `tentative` — a provisional date
 * must never be labelled official.
 */
export function isConfirmed(fact: VerifiedFact<unknown>): boolean {
  return fact.status === 'confirmed' && fact.value !== null && fact.sourceId !== null
}

/**
 * Type predicate for a fact that may be displayed with an honest qualifier:
 * confirmed, tentative or historical, each carrying a value and provenance.
 *
 * Narrowing away the nulls is the point — a caller that passes this guard
 * cannot then render an empty source link.
 */
export function isSourced<T>(
  fact: VerifiedFact<T>,
): fact is VerifiedFact<T> & { value: NonNullable<T>; sourceId: string; sourceUrl: string } {
  return (
    fact.value !== null &&
    fact.sourceId !== null &&
    fact.sourceUrl !== null &&
    (fact.status === 'confirmed' || fact.status === 'tentative' || fact.status === 'historical')
  )
}

/**
 * Whether a fact may drive a countdown (section 148).
 *
 * This is `isConfirmed` and nothing more. A tentative date — one the board
 * itself calls provisional — can never run a countdown, because a countdown is
 * an unqualified promise that something happens at a specific moment.
 */
export function supportsCountdown(fact: VerifiedFact<unknown>): boolean {
  return isConfirmed(fact)
}

/** The single place a fact status becomes a word shown to a reader. */
export function factQualifier(status: FactStatus): string {
  switch (status) {
    case 'confirmed':
      return 'Official'
    case 'tentative':
      return 'Tentative'
    case 'expected':
      return 'Expected'
    case 'historical':
      return 'Historical'
    case 'unknown':
      return 'Not announced'
  }
}

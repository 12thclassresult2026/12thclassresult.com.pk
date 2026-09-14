/**
 * HSSC percentage calculation.
 *
 * THE MARKET'S ANSWER FOR THIS IS WRONG, NOT MERELY THIN.
 *
 * The advice currently ranking for "12th class percentage" is CBSE's
 * `CGPA x 9.5` — an Indian formula, for a grading system Pakistan does not
 * use. Pakistani HSSC results are reported as marks out of a total, most
 * commonly 1100, and the percentage is simply obtained ÷ total.
 *
 * TWO THINGS THIS MODULE DELIBERATELY WILL NOT DO:
 *
 * 1. It does not return a grade or a division. Grade bands were assessed in
 *    research and came back "several variants — unverified, not carried".
 *    Competitors publish mutually inconsistent tables. A calculator that
 *    printed a grade would be inventing the one number a student would most
 *    likely act on.
 *
 * 2. It does not assume a total of 1100. The result data contract is explicit
 *    that 1100 "is a scheme fact, not a safe default" — it varies by scheme,
 *    and a private candidate or a technical stream may differ. 1100 is offered
 *    as a starting value the reader confirms, never applied silently.
 */

/** The most common HSSC total. Offered as a default, never assumed. */
export const COMMON_HSSC_TOTAL = 1100

/** An upper bound that rejects nonsense without guessing a scheme. */
export const MAX_REASONABLE_TOTAL = 5000

export type PercentageInput = {
  obtained: number
  total: number
}

export type PercentageResult =
  | { kind: 'ok'; percentage: number; obtained: number; total: number }
  | { kind: 'invalid'; reason: PercentageError }

export type PercentageError =
  | 'obtained-not-a-number'
  | 'total-not-a-number'
  | 'obtained-negative'
  | 'total-not-positive'
  | 'obtained-exceeds-total'
  | 'total-implausible'

export const PERCENTAGE_ERROR_MESSAGES: Record<PercentageError, string> = {
  'obtained-not-a-number': 'Enter your obtained marks as a number.',
  'total-not-a-number': 'Enter the total marks as a number.',
  'obtained-negative': 'Obtained marks cannot be less than zero.',
  'total-not-positive': 'Total marks must be more than zero.',
  // Stated as a fact about the arithmetic, never as a suggestion the reader
  // has misread their own result card.
  'obtained-exceeds-total': 'Obtained marks cannot be higher than the total marks.',
  'total-implausible': 'That total looks too high for an HSSC result. Check the figure.',
}

export function calculatePercentage(input: PercentageInput): PercentageResult {
  const { obtained, total } = input

  if (!Number.isFinite(obtained)) return { kind: 'invalid', reason: 'obtained-not-a-number' }
  if (!Number.isFinite(total)) return { kind: 'invalid', reason: 'total-not-a-number' }
  if (obtained < 0) return { kind: 'invalid', reason: 'obtained-negative' }
  if (total <= 0) return { kind: 'invalid', reason: 'total-not-positive' }
  if (total > MAX_REASONABLE_TOTAL) return { kind: 'invalid', reason: 'total-implausible' }
  if (obtained > total) return { kind: 'invalid', reason: 'obtained-exceeds-total' }

  /*
   * Rounded to two decimals for display. Deliberately NOT rounded up to a
   * nicer number: a board's own aggregate is what counts for admission, and a
   * flattering rounding here could make a reader believe they cleared a merit
   * threshold they did not.
   */
  const percentage = Math.round((obtained / total) * 10000) / 100

  return { kind: 'ok', percentage, obtained, total }
}

export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(2)}%`
}

/**
 * The formula in words, for the explainer and for answer engines.
 *
 * Kept next to the implementation so the prose and the arithmetic cannot
 * drift apart.
 */
export const PERCENTAGE_FORMULA = {
  pakistan: '(obtained marks ÷ total marks) × 100',
  /** What the market currently recommends, and why it does not apply here. */
  foreign: 'CGPA × 9.5',
  foreignOrigin: 'CBSE, India',
  whyForeignIsWrong:
    'Pakistani boards report HSSC results as marks out of a total, not as a CGPA, so there is no CGPA to multiply.',
} as const

import { describe, expect, it } from 'vitest'

import {
  COMMON_HSSC_TOTAL,
  MAX_REASONABLE_TOTAL,
  PERCENTAGE_ERROR_MESSAGES,
  PERCENTAGE_FORMULA,
  calculatePercentage,
  formatPercentage,
} from '@/lib/marks/percentage'

describe('the arithmetic', () => {
  it.each([
    [550, 1100, 50],
    [842, 1100, 76.55],
    [1100, 1100, 100],
    [0, 1100, 0],
    [1, 3, 33.33],
  ])('%i out of %i is %f%%', (obtained, total, expected) => {
    const result = calculatePercentage({ obtained, total })
    expect(result.kind).toBe('ok')
    if (result.kind !== 'ok') return
    expect(result.percentage).toBe(expected)
  })

  it('never rounds up to a flattering number', () => {
    /*
     * 659/1100 is 59.909…%. Rounding that to 60 would tell a reader they hit a
     * threshold they missed, and merit cut-offs are real. Half-up to two
     * decimals only.
     */
    const result = calculatePercentage({ obtained: 659, total: 1100 })
    expect(result.kind).toBe('ok')
    if (result.kind !== 'ok') return
    expect(result.percentage).toBe(59.91)
    expect(result.percentage).toBeLessThan(60)
  })

  it('formats to two decimals', () => {
    expect(formatPercentage(50)).toBe('50.00%')
    expect(formatPercentage(76.55)).toBe('76.55%')
  })
})

describe('refusals', () => {
  it.each([
    ['obtained above total', { obtained: 1200, total: 1100 }, 'obtained-exceeds-total'],
    ['negative obtained', { obtained: -5, total: 1100 }, 'obtained-negative'],
    ['zero total', { obtained: 500, total: 0 }, 'total-not-positive'],
    ['negative total', { obtained: 500, total: -1100 }, 'total-not-positive'],
    ['NaN obtained', { obtained: Number.NaN, total: 1100 }, 'obtained-not-a-number'],
    ['NaN total', { obtained: 500, total: Number.NaN }, 'total-not-a-number'],
    [
      'infinite obtained',
      { obtained: Number.POSITIVE_INFINITY, total: 1100 },
      'obtained-not-a-number',
    ],
    ['implausible total', { obtained: 500, total: MAX_REASONABLE_TOTAL + 1 }, 'total-implausible'],
  ])('rejects %s', (_label, input, reason) => {
    const result = calculatePercentage(input)
    expect(result.kind).toBe('invalid')
    if (result.kind !== 'invalid') return
    expect(result.reason).toBe(reason)
  })

  it('gives every failure a message that does not blame the reader', () => {
    for (const [reason, message] of Object.entries(PERCENTAGE_ERROR_MESSAGES)) {
      expect(message.length, reason).toBeGreaterThan(10)
      // A student mistyping a figure is not "invalid" and should not be told so.
      expect(message, reason).not.toMatch(/invalid|error|wrong|you failed/i)
    }
  })
})

describe('what the calculator deliberately will not return', () => {
  it('returns no grade and no division', () => {
    /*
     * THE CENTRAL CONSTRAINT.
     *
     * Grade bands were assessed in research and came back "several variants —
     * unverified, not carried". The grade is the figure a student is most
     * likely to act on, so guessing it is the worst available option.
     */
    const result = calculatePercentage({ obtained: 900, total: COMMON_HSSC_TOTAL })
    expect(result.kind).toBe('ok')
    if (result.kind !== 'ok') return

    const keys = Object.keys(result)
    expect(keys).toEqual(['kind', 'percentage', 'obtained', 'total'])
    for (const forbidden of ['grade', 'division', 'remarks', 'status', 'passed']) {
      expect(keys, `calculator leaked a ${forbidden}`).not.toContain(forbidden)
    }
  })

  it('does not assume a total of 1100', () => {
    // 1100 is offered as a default in the UI, never applied by the function.
    // A scheme with a different total must compute correctly.
    const result = calculatePercentage({ obtained: 400, total: 550 })
    expect(result.kind).toBe('ok')
    if (result.kind !== 'ok') return
    expect(result.percentage).toBe(72.73)
    expect(result.total).toBe(550)
  })
})

describe('the formula copy', () => {
  it('states the Pakistani rule, not the foreign one', () => {
    expect(PERCENTAGE_FORMULA.pakistan).toMatch(/obtained marks/i)
    expect(PERCENTAGE_FORMULA.pakistan).not.toMatch(/cgpa/i)
  })

  it('names the foreign formula and its origin, so the correction is checkable', () => {
    // Evidence G6c: the ranking answer is CBSE's CGPA x 9.5.
    expect(PERCENTAGE_FORMULA.foreign).toMatch(/9\.5/)
    expect(PERCENTAGE_FORMULA.foreignOrigin).toMatch(/CBSE/i)
    expect(PERCENTAGE_FORMULA.whyForeignIsWrong).toMatch(/not as a CGPA|no CGPA/i)
  })
})

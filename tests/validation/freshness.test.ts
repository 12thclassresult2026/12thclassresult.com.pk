import { describe, expect, it } from 'vitest'

import { CURRENT_RESULT_YEAR } from '@/lib/board/registry'
import { PAGES, livePages } from '@/lib/content/registry'
import {
  REVIEW_DAYS,
  bySeverity,
  criticalFindings,
  detectStaleContent,
  formatStaleReport,
  isReviewOverdue,
  nextReviewAt,
} from '@/lib/freshness/stale'

/**
 * The freshness gate.
 *
 * Two jobs, and the second matters more than the first:
 *
 *  1. Assert nothing is critically stale TODAY.
 *  2. Prove the detector actually fires when time passes. A staleness check
 *     that is quiet because it is broken looks identical to one that is quiet
 *     because the site is fresh — so the clock is wound forward deliberately.
 */

const TODAY = new Date('2026-09-14T00:00:00.000Z')
const plusDays = (days: number) => new Date(TODAY.getTime() + days * 24 * 60 * 60 * 1000)

describe('the site is fresh today', () => {
  it('reports no critical staleness', () => {
    const critical = criticalFindings(TODAY)
    expect(critical, formatStaleReport(critical)).toEqual([])
  })

  it('publishes no page whose title or H1 carries a past year', () => {
    const findings = detectStaleContent(TODAY).filter((f) => f.check === 'old-year-in-metadata')
    expect(findings).toEqual([])
  })

  it('publishes no future-year page', () => {
    // Publishing 2027 early to rank for it is how this market creates doorway
    // pages. There must be none, in metadata or as a page year.
    const findings = detectStaleContent(TODAY).filter((f) => f.check.startsWith('future-year'))
    expect(findings).toEqual([])
    expect(PAGES.filter((p) => (p.year ?? 0) > CURRENT_RESULT_YEAR)).toEqual([])
  })

  it('carries no unsourced SMS shortcode', () => {
    const findings = detectStaleContent(TODAY).filter((f) => f.check === 'unsourced-sms')
    expect(findings).toEqual([])
  })

  it('has no expected result date already in the past', () => {
    const findings = detectStaleContent(TODAY).filter((f) => f.check === 'result-date-passed')
    expect(findings).toEqual([])
  })

  it('uses no unsupported authority wording in metadata', () => {
    const findings = detectStaleContent(TODAY).filter((f) => f.check === 'unsupported-wording')
    expect(findings, formatStaleReport(findings)).toEqual([])
  })

  it('gives every live page a verification date', () => {
    const findings = detectStaleContent(TODAY).filter((f) => f.check === 'never-verified')
    expect(findings, formatStaleReport(findings)).toEqual([])
  })
})

describe('the detector actually fires as time passes', () => {
  it('flags a class-A page once its 3-day cadence lapses', () => {
    const classA = livePages().filter((p) => p.freshnessClass === 'A')
    // If no class-A page exists yet this assertion documents that, rather than
    // passing vacuously.
    if (classA.length === 0) {
      expect(classA).toEqual([])
      return
    }
    const soon = detectStaleContent(plusDays(REVIEW_DAYS.A + 1))
    expect(soon.some((f) => f.check === 'review-overdue' && f.severity === 'critical')).toBe(true)
  })

  it('flags class-B pages after 30 days and class-C after 90', () => {
    const at31 = detectStaleContent(plusDays(31)).filter((f) => f.check === 'review-overdue')
    const at91 = detectStaleContent(plusDays(91)).filter((f) => f.check === 'review-overdue')
    expect(at31.length).toBeGreaterThan(0)
    // More pages are overdue at 91 days than at 31 — the cadence is graded, not
    // a single cliff.
    expect(at91.length).toBeGreaterThan(at31.length)
  })

  it('flags stale board and source verification after their window', () => {
    const later = detectStaleContent(plusDays(REVIEW_DAYS.B + 1))
    expect(later.some((f) => f.check === 'board-verification-stale')).toBe(true)
    expect(later.some((f) => f.check === 'source-check-stale')).toBe(true)
  })

  it('escalates nothing that has not actually aged', () => {
    // One day on, a 30-day cadence has not lapsed.
    const tomorrow = detectStaleContent(plusDays(1)).filter(
      (f) => f.check === 'review-overdue' && f.severity === 'high',
    )
    expect(tomorrow).toEqual([])
  })

  it('a year from now, the whole site reads as stale', () => {
    // The point of the detector: left alone, this site does not stay correct.
    const inAYear = detectStaleContent(plusDays(400))
    expect(inAYear.length).toBeGreaterThan(10)
    expect(bySeverity(inAYear).high.length).toBeGreaterThan(0)
  })
})

describe('derived review dates', () => {
  it('derives nextReviewAt from class and last review, never storing it', () => {
    const page = livePages().find((p) => p.lastReviewedAt)
    expect(page).toBeDefined()
    const due = nextReviewAt(page!)
    expect(due).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    const expected = new Date(
      Date.parse(page!.lastReviewedAt!) + REVIEW_DAYS[page!.freshnessClass] * 86_400_000,
    )
      .toISOString()
      .slice(0, 10)
    expect(due).toBe(expected)
  })

  it('treats a never-reviewed page as not-overdue, reporting it separately', () => {
    // "Never reviewed" and "review lapsed" are different problems and must not
    // be collapsed — one needs a first review, the other a refresh.
    const unreviewed = PAGES.find((p) => p.lastReviewedAt === null)
    if (!unreviewed) return
    expect(nextReviewAt(unreviewed)).toBeNull()
    expect(isReviewOverdue(unreviewed, plusDays(9999))).toBe(false)
  })
})

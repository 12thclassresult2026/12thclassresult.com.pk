import type { FreshnessClass, PageEntry } from '@/lib/content/types'
import type { Board } from '@/lib/board/types'
import type { ResultSource } from '@/lib/result-sources/types'

import { BOARDS, CURRENT_RESULT_YEAR } from '@/lib/board/registry'
import { PAGES, livePages } from '@/lib/content/registry'
import { RESULT_SOURCES } from '@/lib/result-sources/registry'

/**
 * The stale-content detector.
 *
 * A result site loses authority faster by going stale than by being small. The
 * market this project entered is the proof: one competitor serves 2024 dates on
 * a current-cycle page, another auto-stamps today's date as "updated" on every
 * page, and a whole `2ndyearresult2025.pk` domain is still live.
 *
 * THIS RUNS ON A CLOCK, NOT ON A DEPLOY. Every check takes `now` explicitly, so
 * it is deterministic in tests and answers the real question — "what has gone
 * stale as of today?" — rather than "did the build succeed?".
 *
 * `nextReviewAt` is DERIVED from `freshnessClass` + `lastReviewedAt` rather than
 * stored. Storing it would create a second copy of a fact that can disagree with
 * the first, which is the error this whole project is built to avoid.
 */

export type StaleSeverity = 'critical' | 'high' | 'medium' | 'low'

export type StaleFinding = {
  severity: StaleSeverity
  /** The check that fired, for grouping a report. */
  check: string
  /** Page path, board id or source id. */
  subject: string
  detail: string
}

/** Editorial review cadence in days. Not a crawler schedule. */
export const REVIEW_DAYS: Record<FreshnessClass, number> = {
  A: 3,
  B: 30,
  C: 90,
  D: 365,
}

const DAY_MS = 24 * 60 * 60 * 1000

function daysBetween(fromIso: string, now: Date): number {
  const from = Date.parse(fromIso)
  if (Number.isNaN(from)) return Number.POSITIVE_INFINITY
  return Math.floor((now.getTime() - from) / DAY_MS)
}

/**
 * When a page is next due for editorial review.
 *
 * Returns `null` when it has never been reviewed — which is itself a finding,
 * reported separately rather than silently treated as "due now".
 */
export function nextReviewAt(page: PageEntry): string | null {
  if (!page.lastReviewedAt) return null
  const base = Date.parse(page.lastReviewedAt)
  if (Number.isNaN(base)) return null
  return new Date(base + REVIEW_DAYS[page.freshnessClass] * DAY_MS).toISOString().slice(0, 10)
}

export function isReviewOverdue(page: PageEntry, now: Date): boolean {
  const due = nextReviewAt(page)
  if (!due) return false
  return Date.parse(due) < now.getTime()
}

// ---------------------------------------------------------------- the checks

/**
 * A published page whose review is overdue for its volatility class.
 *
 * Severity tracks the class: a class-A page carrying live result status is
 * critical three days after its last review; an evergreen explainer is not.
 */
function checkReviewOverdue(now: Date): StaleFinding[] {
  const findings: StaleFinding[] = []
  for (const page of livePages()) {
    if (!isReviewOverdue(page, now)) continue
    const overdueBy = page.lastReviewedAt ? daysBetween(page.lastReviewedAt, now) : 0
    findings.push({
      severity:
        page.freshnessClass === 'A' ? 'critical' : page.freshnessClass === 'B' ? 'high' : 'medium',
      check: 'review-overdue',
      subject: page.path,
      detail: `class ${page.freshnessClass} page last reviewed ${overdueBy} days ago (cadence ${REVIEW_DAYS[page.freshnessClass]} days)`,
    })
  }
  return findings
}

/** A live page that has never been verified at all. */
function checkNeverVerified(): StaleFinding[] {
  return livePages()
    .filter((page) => page.lastVerifiedAt === null)
    .map((page) => ({
      severity: 'high' as const,
      check: 'never-verified',
      subject: page.path,
      detail: 'published with lastVerifiedAt = null',
    }))
}

/**
 * A previous year presented as the current one, in a title or H1.
 *
 * Checks metadata rather than body copy on purpose: a dated observation in
 * prose ("the most recent link was for 2025") is correct reporting, while the
 * same year in a title is a stale claim.
 */
function checkOldYearInMetadata(): StaleFinding[] {
  const findings: StaleFinding[] = []
  const oldYears = [CURRENT_RESULT_YEAR - 1, CURRENT_RESULT_YEAR - 2, CURRENT_RESULT_YEAR - 3]
  for (const page of PAGES) {
    // A page that legitimately OWNS a past year is not stale.
    if (page.year && page.year < CURRENT_RESULT_YEAR) continue
    for (const year of oldYears) {
      if (page.title.includes(String(year)) || page.h1.includes(String(year))) {
        findings.push({
          severity: 'critical',
          check: 'old-year-in-metadata',
          subject: page.path,
          detail: `title or H1 carries ${year} while the current cycle is ${CURRENT_RESULT_YEAR}`,
        })
      }
    }
  }
  return findings
}

/**
 * A future year appearing anywhere it has not been justified.
 *
 * Publishing `2027` early to rank for it is the single most common way this
 * market creates empty doorway pages.
 */
function checkFutureYear(): StaleFinding[] {
  const findings: StaleFinding[] = []
  for (const page of PAGES) {
    if (page.year && page.year > CURRENT_RESULT_YEAR) {
      findings.push({
        severity: 'critical',
        check: 'future-year-page',
        subject: page.path,
        detail: `page claims year ${page.year}, ahead of the current cycle ${CURRENT_RESULT_YEAR}`,
      })
      continue
    }
    for (const future of [CURRENT_RESULT_YEAR + 1, CURRENT_RESULT_YEAR + 2]) {
      if (page.title.includes(String(future)) || page.h1.includes(String(future))) {
        findings.push({
          severity: 'critical',
          check: 'future-year-in-metadata',
          subject: page.path,
          detail: `title or H1 carries ${future} before that cycle exists`,
        })
      }
    }
  }
  return findings
}

/**
 * Unsupported authority or liveness wording in metadata.
 *
 * "Official" and "latest" are the two words this market abuses most. This site
 * is not an education board, and nothing here is official by virtue of being
 * here.
 */
function checkUnsupportedWording(): StaleFinding[] {
  const findings: StaleFinding[] = []
  const banned: [RegExp, string][] = [
    [
      /\bofficial (12th class )?result (website|portal|site)\b/i,
      'claims to be an official result site',
    ],
    [/\blatest\b/i, 'uses "latest", which decays the moment it is published'],
    [/\blive\b/i, 'uses "live" as a claim'],
    [/\bconfirmed\b/i, 'asserts "confirmed" in metadata'],
  ]
  for (const page of PAGES) {
    for (const [re, why] of banned) {
      if (re.test(page.title) || re.test(page.h1)) {
        findings.push({
          severity: 'high',
          check: 'unsupported-wording',
          subject: page.path,
          detail: why,
        })
      }
    }
  }
  return findings
}

/**
 * A board fact whose own verification has aged out.
 *
 * Board facts are class-B volatile: portals move, CAPTCHAs appear, and a
 * "verified" note from last season is not a verification of this one.
 */
function checkBoardVerificationAge(now: Date, maxDays = REVIEW_DAYS.B): StaleFinding[] {
  const findings: StaleFinding[] = []
  for (const board of BOARDS) {
    if (!board.lastVerifiedAt) {
      findings.push({
        severity: 'medium',
        check: 'board-never-verified',
        subject: board.id,
        detail: 'board has no lastVerifiedAt',
      })
      continue
    }
    const age = daysBetween(board.lastVerifiedAt, now)
    if (age > maxDays) {
      findings.push({
        severity: board.publishState === 'published' ? 'high' : 'medium',
        check: 'board-verification-stale',
        subject: board.id,
        detail: `last verified ${age} days ago (limit ${maxDays})`,
      })
    }
  }
  return findings
}

/** A source we have not re-checked inside its window. */
function checkSourceCheckAge(now: Date, maxDays = REVIEW_DAYS.B): StaleFinding[] {
  const findings: StaleFinding[] = []
  for (const source of RESULT_SOURCES) {
    if (!source.lastCheckedAt) {
      findings.push({
        severity: 'medium',
        check: 'source-never-checked',
        subject: source.id,
        detail: 'source has no lastCheckedAt',
      })
      continue
    }
    const age = daysBetween(source.lastCheckedAt, now)
    if (age > maxDays) {
      findings.push({
        severity: 'medium',
        check: 'source-check-stale',
        subject: source.id,
        detail: `last checked ${age} days ago (limit ${maxDays})`,
      })
    }
  }
  return findings
}

/**
 * A result date that has passed while the result is still not announced.
 *
 * This is the highest-consequence staleness on the site. A board page telling a
 * candidate a result is expected on a date three weeks gone is worse than
 * saying nothing, and it is exactly what the market does.
 */
function checkPassedResultDate(now: Date): StaleFinding[] {
  const findings: StaleFinding[] = []
  for (const board of BOARDS) {
    const fact = board.resultDate
    if (!fact.value) continue
    const when = Date.parse(fact.value)
    if (Number.isNaN(when) || when >= now.getTime()) continue

    const daysPast = Math.floor((now.getTime() - when) / DAY_MS)
    if (fact.status === 'expected' || fact.status === 'tentative') {
      findings.push({
        severity: 'critical',
        check: 'result-date-passed',
        subject: board.id,
        detail: `${fact.status} result date ${fact.value} passed ${daysPast} days ago and was never confirmed`,
      })
    } else if (fact.status === 'confirmed' && daysPast > REVIEW_DAYS.B) {
      findings.push({
        severity: 'low',
        check: 'result-date-archivable',
        subject: board.id,
        detail: `confirmed result date ${fact.value} is ${daysPast} days old; consider archiving the session`,
      })
    }
  }
  return findings
}

/**
 * Any SMS shortcode that ever reaches the registry without a source.
 *
 * Nine or more mutually contradictory codes circulate in this market and an SMS
 * is charged, so a wrong one costs a student money and returns nothing.
 */
function checkUnsourcedSms(): StaleFinding[] {
  return BOARDS.filter((b) => b.smsCode.value !== null && !b.smsCode.sourceUrl).map((b) => ({
    severity: 'critical' as const,
    check: 'unsourced-sms',
    subject: b.id,
    detail: `SMS shortcode "${b.smsCode.value}" has no source URL`,
  }))
}

// ---------------------------------------------------------------- the report

export function detectStaleContent(now: Date = new Date()): StaleFinding[] {
  return [
    ...checkPassedResultDate(now),
    ...checkUnsourcedSms(),
    ...checkOldYearInMetadata(),
    ...checkFutureYear(),
    ...checkUnsupportedWording(),
    ...checkReviewOverdue(now),
    ...checkNeverVerified(),
    ...checkBoardVerificationAge(now),
    ...checkSourceCheckAge(now),
  ]
}

const SEVERITY_ORDER: StaleSeverity[] = ['critical', 'high', 'medium', 'low']

export function bySeverity(findings: StaleFinding[]): Record<StaleSeverity, StaleFinding[]> {
  const out: Record<StaleSeverity, StaleFinding[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  }
  for (const f of findings) out[f.severity].push(f)
  return out
}

/**
 * The gate: only `critical` blocks.
 *
 * Staleness is continuous, so a build that failed on every medium finding would
 * be red most of the year and would train everyone to ignore it. Critical means
 * a reader is being told something false right now.
 */
export function criticalFindings(now: Date = new Date()): StaleFinding[] {
  return detectStaleContent(now).filter((f) => f.severity === 'critical')
}

export function formatStaleReport(findings: StaleFinding[]): string {
  if (findings.length === 0) return 'No stale content detected.'
  const grouped = bySeverity(findings)
  const lines: string[] = []
  for (const severity of SEVERITY_ORDER) {
    const group = grouped[severity]
    if (group.length === 0) continue
    lines.push(`${severity.toUpperCase()} (${group.length})`)
    for (const f of group) lines.push(`  [${f.check}] ${f.subject}\n      ${f.detail}`)
    lines.push('')
  }
  return lines.join('\n')
}

export type { Board, ResultSource }

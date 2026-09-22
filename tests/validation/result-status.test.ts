import { describe, expect, it } from 'vitest'

import { BOARDS } from '@/lib/board/registry'
import {
  announcementTally,
  BOARD_RESULT_STATUS,
  statusesForBoards,
  statusFor,
} from '@/lib/board/result-status'
import { PUNJAB_HSSC_PART2_ANNOUNCEMENT } from '@/lib/result/announcement'

/**
 * Status is four questions, not one.
 *
 * The site used to answer them with whichever sentence a component happened to
 * carry, and they disagreed: the board directory and the result hub showed
 * different totals, and Peshawar's page described a 14 September SSC-only
 * snapshot while the board's own portal had been serving HSSC 2026 for a day.
 *
 * These rules hold the four apart — declared, portal session, our own lookup
 * capability, reachability — because collapsing any two of them ships a wrong
 * headline on the one morning the site is actually read.
 */

describe('every status record is about a real board and a real session', () => {
  it('names a board the registry knows', () => {
    const known = new Set(BOARDS.map((b) => b.id))
    for (const status of BOARD_RESULT_STATUS) {
      expect(known, `${status.boardId} is not a registered board`).toContain(status.boardId)
    }
  })

  it('records each board once per year and session', () => {
    const seen = new Set<string>()
    for (const s of BOARD_RESULT_STATUS) {
      const key = `${s.boardId}:${s.year}:${s.session}`
      expect(seen, `${key} has two status records`).not.toContain(key)
      seen.add(key)
    }
  })

  it('carries an https source and a check date on every record', () => {
    for (const s of BOARD_RESULT_STATUS) {
      expect(s.sources.length, `${s.boardId} cites no source`).toBeGreaterThan(0)
      for (const url of s.sources) expect(url).toMatch(/^https:\/\//)
      expect(s.officialHomeUrl).toMatch(/^https:\/\//)
      if (s.officialResultUrl) expect(s.officialResultUrl).toMatch(/^https:\/\//)
      expect(s.lastVerifiedAt, `${s.boardId} has no verification date`).toMatch(
        /^\d{4}-\d{2}-\d{2}$/,
      )
    }
  })
})

describe('a date is never stronger than its evidence', () => {
  it('uses +05:00 on every timestamp, because result morning is a local event', () => {
    for (const s of BOARD_RESULT_STATUS) {
      for (const stamp of [s.announcedAt, s.scheduledAt]) {
        if (stamp === null) continue
        expect(stamp, `${s.boardId} has a timestamp without a Pakistan offset`).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+05:00$/,
        )
      }
    }
  })

  it('gives no announced time without a date confidence to match', () => {
    for (const s of BOARD_RESULT_STATUS) {
      if (s.announcedAt === null) continue
      expect(
        s.dateConfidence,
        `${s.boardId} states an exact announcement time with unknown confidence`,
      ).not.toBe('unknown')
    }
  })

  it('never marks a scheduled session as announced, or the reverse', () => {
    for (const s of BOARD_RESULT_STATUS) {
      if (s.announcementStatus === 'scheduled') {
        expect(s.scheduledAt, `${s.boardId} is scheduled with no time`).not.toBeNull()
        expect(
          s.announcedAt,
          `${s.boardId} is scheduled yet carries an announcement time`,
        ).toBeNull()
      }
      if (s.announcementStatus === 'unverified') {
        expect(s.announcedAt, `${s.boardId} is unverified yet claims a time`).toBeNull()
        expect(s.dateConfidence).toBe('unknown')
      }
    }
  })

  it('keeps the Punjab schedule in step with the date the UI shows', () => {
    /*
     * Two files hold this date: this registry for per-board status, and
     * lib/result/announcement.ts for the header and ticker. They must not
     * drift — one saying 23 September while the other says something else is
     * how the site told students 22 October for a week.
     */
    const punjab = BOARD_RESULT_STATUS.filter((s) => s.announcementStatus === 'scheduled')
    expect(punjab.length, 'no board is scheduled; the Punjab rows are gone').toBeGreaterThan(0)

    for (const s of punjab) {
      expect(s.scheduledAt!.slice(0, 10)).toBe(PUNJAB_HSSC_PART2_ANNOUNCEMENT.value)
      // Press reporting of a committee calendar is not a board notification.
      expect(s.dateConfidence, `${s.boardId} calls the PBCC date official`).toBe('reported')
    }
  })
})

describe('the four questions stay separate', () => {
  it('claims no local lookup for a session with no dataset', () => {
    /*
     * `local-dataset` means THIS site can answer. No 2026 gazette exists, so
     * every 2026 row is `official-link` — which is what keeps a student who
     * asks about 2026 from being handed a 2025 record.
     */
    for (const s of BOARD_RESULT_STATUS.filter((x) => x.year === 2026)) {
      expect(s.lookupMode, `${s.boardId} claims a local 2026 dataset`).toBe('official-link')
    }
  })

  it('treats an unread capability as unknown, never as unsupported', () => {
    /*
     * Bannu's form genuinely offers name and father's name. That is a fact
     * about Bannu. Every other board was not observed either way, and the
     * difference between `unverified` and a claim of "not supported" is the
     * difference between honest and wrong.
     */
    const bannu = statusFor('bise-bannu')
    expect(bannu?.nameSearch, 'Bannu name search is no longer recorded as supported').toBe(
      'supported',
    )

    const claimedSupported = BOARD_RESULT_STATUS.filter((s) => s.nameSearch === 'supported')
    expect(
      claimedSupported.map((s) => s.boardId),
      'name search was generalised from Bannu to other boards',
    ).toEqual(['bise-bannu'])
  })

  it('quotes the portal session rather than inferring one', () => {
    for (const s of BOARD_RESULT_STATUS) {
      if (s.announcementStatus !== 'announced') continue
      expect(
        s.portalSessionObserved,
        `${s.boardId} is announced with nothing observed on its portal`,
      ).toBeTruthy()
      expect(s.officialResultUrl, `${s.boardId} is announced with no result URL`).toBeTruthy()
    }
  })

  it('does not call a year dropdown an announcement', () => {
    /*
     * Swat's form is a class selector, an exam selector and a year dropdown
     * running 2005–2026. A dropdown reaching 2026 is a form, not a declared
     * result. If this ever flips to `announced`, it must be because the board
     * said so — not because the form still lists the year.
     */
    const swat = statusFor('bise-swat')
    expect(swat, 'Swat has no status record').not.toBeNull()
    expect(
      swat!.announcementStatus,
      'Swat is marked announced on the strength of a year dropdown',
    ).toBe('unverified')
  })
})

describe('a region card counts only its own region', () => {
  it('tallies from the subset it describes', () => {
    const kpk = BOARDS.filter((b) => b.province === 'khyber-pakhtunkhwa').map((b) => b.id)
    const tally = announcementTally(statusesForBoards(kpk))

    expect(tally.total, 'no KPK board has a status record').toBeGreaterThan(0)
    expect(tally.announced + tally.scheduled + tally.unverified).toBe(tally.total)

    /*
     * THE CLAIM THIS RULE EXISTS TO STOP. KPK results did not all arrive on one
     * day — Peshawar declared on 21 September, others later, and Swat is not
     * confirmed at all. A card that says "all KPK results are live" is wrong,
     * and the only thing that makes it wrong is a number nobody derived.
     */
    expect(
      tally.announced,
      'every KPK board is announced, so a blanket claim would now be true — re-read the sources before trusting this',
    ).toBeLessThan(tally.total)
  })

  it('gives Punjab a schedule and KPK none', () => {
    const punjab = BOARDS.filter((b) => b.province === 'punjab').map((b) => b.id)
    const kpk = BOARDS.filter((b) => b.province === 'khyber-pakhtunkhwa').map((b) => b.id)

    expect(announcementTally(statusesForBoards(punjab)).scheduled).toBeGreaterThan(0)
    // KPK boards do not inherit Punjab's date.
    expect(
      announcementTally(statusesForBoards(kpk)).scheduled,
      'a KPK board picked up the Punjab schedule',
    ).toBe(0)
  })
})

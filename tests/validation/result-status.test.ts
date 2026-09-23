import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const REPO_ROOT = process.cwd()

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

describe('operator notes never reach a student', () => {
  it('renders no provenance note in any page or component', () => {
    /*
     * THIS SHIPPED, AND IT READ AS AN INSTRUCTION.
     *
     * `provenanceNote` is an operator's working record — redirect chains,
     * parser caveats, field names in backticks. The board page rendered it
     * raw, so the Peshawar page told students, in this site's own voice:
     *
     *   "The portal exposes ONE session at a time and was serving SSC
     *    Annual-I 2026, so no HSSC entry point was present at all.
     *    `examLevelsObserved` is therefore empty"
     *
     * A student looking for their 12th result reads that as "there is no 12th
     * result here". By the time it was found it was also false — the board had
     * been serving HSSC Annual-I 2026 for a day.
     *
     * The field stays in the registry. It must not be rendered.
     */
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) {
          walk(full)
          continue
        }
        if (!entry.endsWith('.tsx')) continue
        const code = readFileSync(full, 'utf8')
          .replace(/\{?\/\*[\s\S]*?\*\/\}?/g, '')
          .replace(/^\s*\/\/.*$/gm, '')
        // Rendered, not merely imported: `{something.provenanceNote}`.
        if (/\{\s*[\w.]*provenanceNote\s*\}/.test(code)) {
          offenders.push(full.replace(REPO_ROOT, '').replace(/\\/g, '/'))
        }
      }
    }
    /*
     * SCOPED TO THE PAGES THAT INSTRUCT, and the distinction is real.
     *
     * A board page tells a student what to do next, so an operator note there
     * is read as an instruction in this site's voice. The rechecking guide
     * renders the same field under a heading that says 'Where this came from',
     * beside the source link it describes — that is a provenance section, the
     * thing this site is built on, and a reader there has asked to see how a
     * fee was sourced.
     *
     * If a provenance note ever needs to appear on a result page, it needs
     * rewriting for a student first, not an exemption added here.
     */
    for (const dir of [
      'app/results',
      'components/result',
      'components/home',
      'components/region',
    ]) {
      walk(join(REPO_ROOT, dir))
    }

    expect(
      offenders,
      `an operator note is rendered to readers:\n  ${offenders.join('\n  ')}\n` +
        `Show lib/board/result-status.ts's portalSessionObserved instead — it is written for a student and carries a check date.`,
    ).toEqual([])
  })

  it('writes the portal session in language a student can act on', () => {
    // No backticks, no field names, no redirect chains.
    for (const s of BOARD_RESULT_STATUS) {
      if (!s.portalSessionObserved) continue
      expect(s.portalSessionObserved, `${s.boardId} quotes code at the reader`).not.toMatch(/`/)
      expect(s.portalSessionObserved).not.toMatch(/\b\w+Observed\b|\b301\b|parser/i)
    }
  })
})

describe('the seventeen priority boards all have somewhere to land', () => {
  /*
   * Nine Punjab boards and eight KPK boards. Punjab declares tomorrow on one
   * calendar; KPK has already declared, board by board. Between them they are
   * where essentially all of this site's result-day traffic goes.
   *
   * Two of the seventeen had no page at all — Faisalabad and Kohat, both
   * marked `planned` because automated checks were refused on 2026-09-14. That
   * is a fact about one afternoon's fetches, not about the boards: re-checked
   * on 2026-09-22, Faisalabad serves an Intermediate roll-number search and
   * Kohat's own homepage links its Intermediate Annual 2026 result. A failed
   * fetch is not evidence a board has no result route, and leaving two boards
   * unreachable on that basis cost their students a destination.
   */
  const PRIORITY = [
    'bise-lahore',
    'bise-gujranwala',
    'bise-faisalabad',
    'bise-multan',
    'bise-rawalpindi',
    'bise-sargodha',
    'bise-bahawalpur',
    'bise-dg-khan',
    'bise-sahiwal',
    'bise-peshawar',
    'bise-mardan',
    'bise-abbottabad',
    'bise-swat',
    'bise-kohat',
    'bise-bannu',
    'bise-malakand',
    'bise-dera-ismail-khan',
  ]

  it('covers exactly the seventeen, with none missing from the registry', () => {
    const known = new Set(BOARDS.map((b) => b.id))
    const missing = PRIORITY.filter((id) => !known.has(id))
    expect(missing, `not in the board registry: ${missing.join(', ')}`).toEqual([])
    expect(PRIORITY.length).toBe(17)
  })

  it('gives each of them a published page', () => {
    const unpublished = PRIORITY.filter(
      (id) => BOARDS.find((b) => b.id === id)?.publishState !== 'published',
    )
    expect(
      unpublished,
      `these priority boards have no page, so their students have nowhere to land: ${unpublished.join(', ')}`,
    ).toEqual([])
  })

  it('gives each of them a status record and an official destination', () => {
    for (const id of PRIORITY) {
      const status = statusFor(id)
      expect(status, `${id} has no result status record`).not.toBeNull()
      // Even a board we know nothing else about must have somewhere to send a
      // student — its own website, at minimum.
      expect(status!.officialHomeUrl, `${id} has no official destination`).toMatch(/^https:\/\//)
    }
  })

  it('splits them nine Punjab and eight KPK, from the registry not a literal', () => {
    const byProvince = (province: string) =>
      PRIORITY.filter((id) => BOARDS.find((b) => b.id === id)?.province === province)

    expect(byProvince('punjab')).toHaveLength(9)
    expect(byProvince('khyber-pakhtunkhwa')).toHaveLength(8)
  })
})

describe('the header mega menu keeps up with the registry', () => {
  /*
   * The menu's province lists are hand-written for presentation order. A
   * second list of boards is a second truth and it drifts: Faisalabad and
   * Kohat were published and stayed missing from it, so two boards had pages
   * that the navigation never pointed at.
   *
   * The menu already filters OUT boards with no page. Nothing was checking the
   * other direction.
   */
  const menu = readFileSync(join(REPO_ROOT, 'components/layout/header-mega-menu.tsx'), 'utf8')
  const listed = new Set(
    [...menu.matchAll(/href: '\/results\/([a-z0-9-]+)\/12th-class'/g)].map((m) => m[1]!),
  )

  it.each([
    ['punjab', 'Punjab'],
    ['khyber-pakhtunkhwa', 'KPK'],
    ['sindh', 'Sindh'],
  ])('lists every routed %s board', (province) => {
    const missing = BOARDS.filter(
      (b) => b.province === province && b.publishState === 'published' && !listed.has(b.slug),
    ).map((b) => b.slug)

    expect(
      missing,
      `these boards have pages but are not in the header menu: ${missing.join(', ')}`,
    ).toEqual([])
  })

  it('offers the province switcher only where a region was not already chosen', () => {
    /*
     * "Punjab Boards" opening a panel that asks Punjab, KPK, Sindh,
     * Balochistan or AJK makes the reader answer a question they just
     * answered, and pushes the boards they came for into a narrow column.
     */
    const header = readFileSync(join(REPO_ROOT, 'components/layout/site-header.tsx'), 'utf8')
    expect(header, 'the region menus no longer suppress the province switcher').toMatch(
      /showProvinceSwitcher=\{openDropdown === 'all-boards'\}/,
    )
    expect(menu, 'the mega menu no longer accepts showProvinceSwitcher').toContain(
      'showProvinceSwitcher',
    )
  })
})

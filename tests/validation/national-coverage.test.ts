import { describe, expect, it } from 'vitest'

import { BOARDS } from '@/lib/board/registry'
import { PROVINCE_LABELS, type Province } from '@/lib/board/types'
import {
  anyGazetteLookupActive,
  boardsInRegion,
  coverageFor,
  nationalCoverageSummary,
  nationalRegions,
  regionCounts,
} from '@/lib/gazettes/coverage'
import { COVERAGE_LABELS } from '@/lib/gazettes/types'

/**
 * The national-scope gate.
 *
 * This exists because of a real defect: the board directory rendered a
 * hard-coded `['punjab', 'federal']`, so eighteen boards across four regions
 * were invisible on a page claiming to cover Pakistan. The registry was
 * national the whole time; the page was not.
 *
 * These tests make that class of bug fail the build rather than wait to be
 * noticed.
 */

describe('every registered board is reachable', () => {
  it('lists a region for every board in the registry', () => {
    const regions = new Set(nationalRegions())
    for (const board of BOARDS) {
      expect(regions.has(board.province), `${board.shortName} is in a region nobody renders`).toBe(
        true,
      )
    }
  })

  it('accounts for all 28 boards across the regions it renders', () => {
    const total = nationalRegions().reduce((sum, p) => sum + boardsInRegion(p).length, 0)
    expect(total).toBe(BOARDS.length)
  })

  it('covers every region that actually holds a board', () => {
    /*
     * The specific regression. If someone re-introduces a hand-written region
     * list, the regions it forgets fail here — by name.
     */
    const present = new Set(BOARDS.map((b) => b.province))
    const rendered = new Set(nationalRegions())
    const missing = [...present].filter((p) => !rendered.has(p))
    expect(
      missing,
      `regions present in the registry but not rendered: ${missing.join(', ')}`,
    ).toEqual([])
  })

  it('includes each non-Punjab region by name', () => {
    // Named explicitly so the failure message says which region vanished.
    for (const province of [
      'sindh',
      'khyber-pakhtunkhwa',
      'balochistan',
      'azad-jammu-kashmir',
    ] satisfies Province[]) {
      expect(
        nationalRegions(),
        `${PROVINCE_LABELS[province]} is missing from the national directory`,
      ).toContain(province)
      expect(boardsInRegion(province).length).toBeGreaterThan(0)
    }
  })

  it('does not report Punjab as the national total', () => {
    // The locked scope rule: Punjab counts are never national counts.
    const punjab = boardsInRegion('punjab').length
    expect(punjab).toBeLessThan(BOARDS.length)
    const counts = regionCounts()
    expect(counts.length).toBeGreaterThan(1)
    expect(counts.reduce((s, r) => s + r.boards, 0)).toBe(BOARDS.length)
  })
})

describe('coverage is stated honestly', () => {
  it('claims no active gazette lookup, because no dataset exists', () => {
    /*
     * The central honesty invariant of the gazette-first product. Finding a
     * board's gazette page is not the same as being able to search it, and
     * this must stay false until a dataset is genuinely serving.
     */
    expect(anyGazetteLookupActive()).toBe(false)
    expect(nationalCoverageSummary()['gazette-lookup-active']).toBe(0)
  })

  it('gives every board a coverage status', () => {
    const summary = nationalCoverageSummary()
    const total = Object.values(summary).reduce((a, b) => a + b, 0)
    expect(total).toBe(BOARDS.length)
  })

  it('gives every status a reader-facing label', () => {
    for (const board of BOARDS) {
      const label = COVERAGE_LABELS[coverageFor(board)]
      expect(label, `${board.shortName} has no coverage label`).toBeTruthy()
      expect(label.length).toBeGreaterThan(8)
    }
  })

  it('never labels an unverified board as working', () => {
    for (const board of BOARDS.filter((b) => b.accessModel === 'unverified')) {
      const status = coverageFor(board)
      expect(['unknown', 'blocked'], `${board.shortName} claims more than is verified`).toContain(
        status,
      )
    }
  })

  it('marks the gazette-only boards as having a gazette source', () => {
    // Karachi and the other gazette-only boards are exactly where a local
    // lookup would matter most, so their source must be recognised.
    const karachi = BOARDS.find((b) => b.id === 'biek')
    expect(karachi).toBeDefined()
    expect(coverageFor(karachi!)).toBe('source-pending')
  })
})

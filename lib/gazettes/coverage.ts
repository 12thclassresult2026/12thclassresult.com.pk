import type { Board, Province } from '@/lib/board/types'
import type { BoardCoverageStatus } from './types'

import { BOARDS } from '@/lib/board/registry'
import { getSourcesForBoard, gazetteSources } from '@/lib/result-sources/registry'

/**
 * National coverage: what can a student at this board actually do here?
 *
 * TWO THINGS THIS MODULE EXISTS TO FIX.
 *
 * 1. THE PUNJAB-SHAPED UI. The board registry has always been national — 28
 *    boards across six regions — but the directory page listed a hard-coded
 *    `['punjab', 'federal']`, so eighteen boards across four regions were
 *    invisible. A registry being national is worth nothing if the page is not.
 *
 *    `nationalRegions()` therefore DERIVES the region list from the registry.
 *    Adding a board in a new region makes it appear; there is no second list to
 *    forget.
 *
 * 2. HONEST CAPABILITY. The product is gazette-first, but no gazette has been
 *    ingested yet. A board whose gazette we have merely *found* must not be
 *    presented as one where lookup works. `coverageFor` distinguishes them.
 */

/**
 * Regions that actually hold a board, in a stable national order.
 *
 * Derived, never hand-listed. The order below is presentational only — any
 * region present in the registry but missing from it still appears, appended,
 * rather than being silently dropped.
 */
const PREFERRED_ORDER: readonly Province[] = [
  'punjab',
  'sindh',
  'khyber-pakhtunkhwa',
  'balochistan',
  'federal',
  'azad-jammu-kashmir',
  'gilgit-baltistan',
] as const

export function nationalRegions(): Province[] {
  const present = new Set(BOARDS.map((board) => board.province))
  const ordered = PREFERRED_ORDER.filter((province) => present.has(province))
  // Anything the registry holds that the preferred order forgot. This is the
  // guard that makes the hard-coded-list bug unrepeatable.
  const extras = [...present].filter((province) => !PREFERRED_ORDER.includes(province))
  return [...ordered, ...extras.sort()]
}

export function boardsInRegion(province: Province): Board[] {
  return BOARDS.filter((board) => board.province === province)
}

/**
 * Operational coverage for one board.
 *
 * Deliberately conservative. `gazette-lookup-active` is returned only when a
 * dataset is genuinely serving — and none is, so today it never is. Finding a
 * board's gazette page is not the same as being able to search it, and
 * conflating the two would promise a lookup that does not exist.
 */
export function coverageFor(board: Board): BoardCoverageStatus {
  /*
   * When the dataset registry lands, an active dataset for this board's current
   * year is checked FIRST and returns `gazette-lookup-active`. Until then the
   * honest answer can never be that, which is why there is no branch for it.
   */

  const sources = getSourcesForBoard(board.id)
  if (sources.length === 0) return 'unknown'

  // A board whose sources all refuse automated checks is `blocked` rather than
  // unsupported — the board works fine, we simply cannot verify it.
  if (sources.every((source) => source.status === 'blocked')) return 'blocked'

  if (gazetteSources(board.id).length > 0) return 'source-pending'

  if (board.accessModel === 'unverified') return 'unknown'

  return 'fallback-only'
}

/** Coverage counts, for a dashboard or a report. National, never per-province. */
export function nationalCoverageSummary(): Record<BoardCoverageStatus, number> {
  const summary: Record<BoardCoverageStatus, number> = {
    'gazette-lookup-active': 0,
    'dataset-processing': 0,
    'fallback-only': 0,
    'source-pending': 0,
    blocked: 0,
    unsupported: 0,
    unknown: 0,
  }
  for (const board of BOARDS) summary[coverageFor(board)] += 1
  return summary
}

/**
 * Boards per region — for a national directory, and for the rule in the locked
 * scope correction that Punjab counts are never reported as national counts.
 */
export function regionCounts(): { province: Province; boards: number }[] {
  return nationalRegions().map((province) => ({
    province,
    boards: boardsInRegion(province).length,
  }))
}

/** True once any board is genuinely served from an ingested gazette. */
export function anyGazetteLookupActive(): boolean {
  return BOARDS.some((board) => coverageFor(board) === 'gazette-lookup-active')
}

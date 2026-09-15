import type { Column, GeometryRefusal, PageGeometry, Word } from './types'

/**
 * Per-page column inference.
 *
 * WHY THIS IS INFERRED PER PAGE RATHER THAN CONFIGURED.
 *
 * A census of all 5,920 pages of the Gujranwala 2025 gazette found FIVE
 * distinct page shapes. 5,793 body pages put the two `Roll-No` headings at
 * x=50.4 and x=512.1; 116 pages carry no heading at all; and 11 front-matter
 * pages put a `Roll No.` heading near the middle of the page (x=258-288) for
 * the position-holder lists, which are a different table entirely.
 *
 * A single hard-coded split would therefore have mis-parsed the merit lists as
 * though they were candidate rows — reading a POSITION as a roll number. The
 * split is measured from each page's own headings, and a page whose shape does
 * not match this family is refused rather than forced.
 *
 * Every tolerance is expressed in multiples of the page's own font height, so
 * the same code works on a gazette typeset at a different size.
 */

const ROLL_HEADING = 'Roll-No'
const NAME_HEADING = 'Name'
/** The heading reads "Result-I / Result-II"; match its first token only. */
const RESULT_HEADING = /^Result-I\b/

export type GeometryOutcome =
  { ok: true; geometry: PageGeometry } | { ok: false; reason: GeometryRefusal }

export function inferGeometry(words: Word[], pageWidth: number): GeometryOutcome {
  const rolls = words.filter((w) => w.text === ROLL_HEADING).sort((a, b) => a.x - b.x)

  // No exact `Roll-No` token: front matter, statistics, or the merit lists,
  // whose heading is the different string "Roll No.".
  if (rolls.length === 0) return { ok: false, reason: 'not-a-candidate-page' }
  if (rolls.length !== 2) return { ok: false, reason: 'unexpected-column-count' }

  const first = rolls[0]
  const second = rolls[1]
  if (!first || !second) return { ok: false, reason: 'unexpected-column-count' }

  const font = median(rolls.map((w) => w.h))
  // The heading row is one line; anything claiming to be part of it must sit on
  // roughly the same baseline, or the page is not this family.
  const sameRow = (w: Word) => Math.abs(w.y - first.y) < font * 1.25

  const names = words.filter((w) => w.text === NAME_HEADING && sameRow(w)).sort((a, b) => a.x - b.x)
  const results = words
    .filter((w) => RESULT_HEADING.test(w.text) && sameRow(w))
    .sort((a, b) => a.x - b.x)

  if (names.length !== 2 || results.length !== 2) {
    return { ok: false, reason: 'missing-column-headings' }
  }

  /*
   * The gutter is derived from the RIGHT column's own heading spacing, not
   * from the page midpoint. Half the roll-to-name distance is the widest a
   * boundary can be pushed left while still clearing the right column's
   * institution headings, which print to the left of its roll field.
   */
  const rightName = names[1]
  if (!rightName) return { ok: false, reason: 'missing-column-headings' }
  const split = second.x - (rightName.x - second.x) * 0.5

  const columns: Column[] = []
  for (let i = 0; i < 2; i += 1) {
    const roll = rolls[i]
    const name = names[i]
    const result = results[i]
    if (!roll || !name || !result) return { ok: false, reason: 'heading-rows-disagree' }

    const left = i === 0 ? 0 : split
    const right = i === 0 ? split : pageWidth
    const bodyTop = Math.max(roll.y, name.y, result.y) + font * 0.5

    /*
     * Prefer the data's own alignment over the heading's. A heading can be
     * nudged a point or two by centring; the roll numbers themselves are the
     * column. Fall back to the heading on a sparse final page.
     */
    const aligned = words.filter(
      (w) =>
        w.x >= left &&
        w.x < right &&
        w.y > bodyTop &&
        Math.abs(w.x - roll.x) < font * 1.15 &&
        /^\d{6}$/.test(w.text),
    )
    const rollX = aligned.length > 0 ? median(aligned.map((w) => w.x)) : roll.x

    columns.push({
      left,
      right,
      bodyTop,
      rollX,
      nameX: name.x,
      // `PI:` and `PII:` labels print left of the heading's x — see rows.ts.
      resultX: result.x - font * 2,
    })
  }

  return { ok: true, geometry: { split, font, columns } }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length === 0) return 0
  if (sorted.length % 2 === 1) return sorted[mid] ?? 0
  return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
}

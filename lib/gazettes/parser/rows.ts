import type { Column, PageGeometry, PageResult, ParseProblem, RawRecord, Word } from './types'

import { inferGeometry } from './geometry'

/**
 * Row segmentation, and the reason it is not a line-by-line read.
 *
 * WHAT THE PAGE ACTUALLY DOES. A row's roll number and name sit on one
 * baseline, but its result cell does NOT:
 *
 *   roll 236824 at y=113, name on the same line
 *     result "704"            at y=130   (+17, a single line)
 *
 *   roll 236829 at y=154, name on the same line
 *     result "PI:  ENG"       at y=151   (-3, the cell is two lines and the
 *     result "PII: ENG"       at y=170    first one starts ABOVE the roll)
 *
 * So a passing candidate's result prints below its roll number while a failing
 * candidate's FIRST result line prints above it. Reading line by line would
 * attach half of every failed candidate's result to the candidate above —
 * silently, and only for failures. That is a wrong-candidate mapping, the one
 * class of defect this whole pipeline exists to prevent.
 *
 * The fix is to segment by ANCHOR rather than by line. Each roll number opens a
 * window that starts just above its own baseline and ends just above the next
 * anchor's. Row pitch here is ~40.5pt and the overhang is 3pt, so a window
 * opening 0.65 font-heights early captures a two-line cell without ever
 * reaching into the row above.
 *
 * Anything inside the column body that no window claimed is reported, never
 * attached to the nearest row by proximity.
 */

/** A row anchor or an institution heading, in page order. */
type Event = { kind: 'row'; y: number; word: Word } | { kind: 'heading'; y: number; word: Word }

const SIX_DIGITS = /^\d{6}$/
/** Institution headings are "211002-GOVT. ISLAMIA COLLEGE, GUJRANWALA". */
const INSTITUTION_CODE = /^\d{6}-/
const PRIVATE_HEADING = 'PRIVATE'
/** Latin letters, spaces and the punctuation genuinely printed in names. */
const NAME_CHARS = /^[A-Z][A-Z .,'()/_-]*$/

export function parsePage(
  words: Word[],
  pageWidth: number,
  pageNumber: number,
  institutionIn: string | null,
): PageResult {
  const outcome = inferGeometry(words, pageWidth)
  if (!outcome.ok) {
    return {
      records: [],
      problems:
        outcome.reason === 'not-a-candidate-page'
          ? []
          : [{ page: pageNumber, kind: outcome.reason, raw: headingSample(words) }],
      institution: institutionIn,
      geometry: null,
    }
  }

  const geometry = outcome.geometry
  const records: RawRecord[] = []
  const problems: ParseProblem[] = []
  let institution = institutionIn

  geometry.columns.forEach((column, columnIndex) => {
    const result = parseColumn(words, column, geometry, pageNumber, columnIndex, institution)
    records.push(...result.records)
    problems.push(...result.problems)
    institution = result.institution
  })

  return { records, problems, institution, geometry }
}

function parseColumn(
  words: Word[],
  column: Column,
  geometry: PageGeometry,
  page: number,
  columnIndex: number,
  institutionIn: string | null,
): { records: RawRecord[]; problems: ParseProblem[]; institution: string | null } {
  const { font } = geometry
  const records: RawRecord[] = []
  const problems: ParseProblem[] = []
  let institution = institutionIn

  const body = words.filter((w) => w.x >= column.left && w.x < column.right && w.y > column.bodyTop)

  const anchors = body
    .filter((w) => Math.abs(w.x - column.rollX) < font * 0.7 && /^\d/.test(w.text))
    .sort((a, b) => a.y - b.y)

  // Institution text starts to the LEFT of the roll field. Anything else found
  // there is reported rather than assumed to be an institution.
  const headings = body.filter(
    (w) =>
      w.x < column.rollX - font * 0.7 &&
      (INSTITUTION_CODE.test(w.text) || w.text === PRIVATE_HEADING),
  )

  const events: Event[] = [
    ...anchors.map((word): Event => ({ kind: 'row', y: word.y, word })),
    ...headings.map((word): Event => ({ kind: 'heading', y: word.y, word })),
  ].sort((a, b) => a.y - b.y)

  const claimed = new Set<Word>()

  /*
   * ROW BOUNDARIES ARE DERIVED FROM THE ROW PITCH, NOT FROM THE FONT SIZE.
   *
   * A two-line result cell starts above its own roll number, and the size of
   * that overhang VARIES: 3pt on page 151, 5pt on page 4528. A lead of
   * 0.65 font-heights (~4.5pt) covered the first and missed the second, which
   * dropped 29 subject lists on 29 pages while silently keeping the same
   * construct everywhere else. Inconsistency like that is worse than a clean
   * failure, because the output looks complete.
   *
   * The honest boundary is the empty band between two rows. With a ~40.5pt
   * pitch the previous row's last line ends ~23pt above this anchor and this
   * row's first line starts ~5pt above it, so the midpoint of that band is
   * about 0.35 of the pitch — comfortably clear of both, and it scales with a
   * gazette typeset at any size.
   */
  const pitch = medianGap(events.map((e) => e.y)) ?? font * 5
  const lead = Math.max(pitch * 0.35, font * 0.65)

  const claimEnd = (index: number, y: number): number => {
    const next = events[index + 1]
    // The last row may not run to the bottom of the page: an open-ended window
    // absorbs footers and stray fragments into the final candidate.
    return next ? next.y - lead : y + pitch * 0.9
  }

  events.forEach((event, index) => {
    const start = event.y - lead
    const end = claimEnd(index, event.y)
    const rowWords = body.filter((w) => w.y >= start && w.y < end)
    rowWords.forEach((w) => claimed.add(w))

    const bbox: [number, number, number, number] = [
      column.left,
      start,
      column.right,
      Number.isFinite(end) ? end : Math.max(...rowWords.map((w) => w.y), start),
    ]
    const raw = textOf(rowWords)

    if (event.kind === 'heading') {
      const heading = textOf(rowWords).replace(/\s+/g, ' ').trim()
      if (heading === '') {
        problems.push({ page, column: columnIndex, kind: 'empty-heading', raw, bbox })
      } else if (INSTITUTION_CODE.test(heading)) {
        institution = heading
      } else if (heading.startsWith(PRIVATE_HEADING)) {
        // Private candidates have no institution; the previous one must not
        // carry over onto them.
        institution = null
      } else {
        institution = null
        problems.push({
          page,
          column: columnIndex,
          kind: 'unclassified-heading',
          raw: heading,
          bbox,
        })
      }
      return
    }

    const anchor = event.word
    const rollNumber = anchor.text
    const nameWords = rowWords.filter((w) => w.x > anchor.x + anchor.w && w.x < column.resultX)
    const statusWords = rowWords.filter((w) => w.x >= column.resultX)

    /*
     * Both fields are assembled by VISUAL LINE, never by raw y.
     *
     * Sorting on y directly looked correct and was not: words sharing a line
     * differ in baseline by fractions of a point, so the sort reordered them at
     * random. It printed result cells as "ENG PI: ENG PII:" instead of
     * "PI: ENG / PII: ENG", and it would have scrambled multi-word names the
     * same way — invisibly, because a reordered name still passes every
     * character check. `textOf` groups to a line with tolerance first, then
     * orders by x within the line.
     */
    const candidateName = textOf(nameWords).replace(/\s+/g, ' ').trim()
    const rawResultStatus = textOf(statusWords)

    const record: RawRecord = {
      rollNumber,
      candidateName,
      rawResultStatus,
      institution,
      page,
      column: columnIndex,
      bbox,
      raw,
    }

    const issue = rowIssue(record)
    if (issue) problems.push({ page, column: columnIndex, kind: issue, raw, bbox })
    else records.push(record)
  })

  const leftovers = body.filter((w) => !claimed.has(w))
  if (leftovers.length > 0) {
    // Never join a stray fragment to the nearest candidate by guesswork.
    problems.push({
      page,
      column: columnIndex,
      kind: 'unassigned-text',
      raw: textOf(leftovers),
    })
  }

  return { records, problems, institution }
}

function rowIssue(record: RawRecord): ParseProblem['kind'] | null {
  if (!SIX_DIGITS.test(record.rollNumber)) return 'malformed-roll-number'
  if (record.candidateName === '' || !NAME_CHARS.test(record.candidateName)) return 'malformed-name'
  if (record.rawResultStatus === '') return 'missing-result'
  return null
}

/** Verbatim text of a word set, grouped back into visual lines. */
function textOf(words: Word[]): string {
  const sorted = [...words].sort((a, b) => a.y - b.y || a.x - b.x)
  const lines: Word[][] = []
  for (const word of sorted) {
    const last = lines[lines.length - 1]
    const lastWord = last?.[0]
    if (last && lastWord && Math.abs(lastWord.y - word.y) <= Math.max(word.h * 0.55, 2)) {
      last.push(word)
    } else {
      lines.push([word])
    }
  }
  return lines
    .map((line) =>
      line
        .sort((a, b) => a.x - b.x)
        .map((w) => w.text)
        .join(' '),
    )
    .join('\n')
}

/** A short structural sample for a refusal, so the page can be found again. */
function headingSample(words: Word[]): string {
  return words
    .slice(0, 12)
    .map((w) => w.text)
    .join(' ')
    .slice(0, 300)
}

/**
 * Median spacing between consecutive anchors — the column's own row pitch.
 * Returns null when there is nothing to measure from.
 */
function medianGap(ys: number[]): number | null {
  if (ys.length < 2) return null
  const sorted = [...ys].sort((a, b) => a - b)
  const gaps: number[] = []
  for (let i = 1; i < sorted.length; i += 1) {
    const a = sorted[i - 1]
    const b = sorted[i]
    if (a !== undefined && b !== undefined) gaps.push(b - a)
  }
  if (gaps.length === 0) return null
  gaps.sort((a, b) => a - b)
  const mid = Math.floor(gaps.length / 2)
  return gaps.length % 2 === 1 ? (gaps[mid] ?? null) : ((gaps[mid - 1] ?? 0) + (gaps[mid] ?? 0)) / 2
}

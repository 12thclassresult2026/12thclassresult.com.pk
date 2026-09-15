import { describe, expect, it } from 'vitest'

import type { Word } from '@/lib/gazettes/parser/types'

import { inferGeometry } from '@/lib/gazettes/parser/geometry'
import { wordsFromItems } from '@/lib/gazettes/parser/pdf-words'
import { parsePage } from '@/lib/gazettes/parser/rows'

/**
 * Parser tests, built on SYNTHETIC pages.
 *
 * The fixtures are generated rather than committed, and they are not invented:
 * every coordinate below was measured off the real Gujranwala 2025 gazette with
 * `scripts/gazette/census.mjs` and `dump-page.mjs`. Page 1008x612; `Roll-No`
 * headings at x=50.4 and x=512.1; `Name` at 96 and 552; `Result-I / Result-II`
 * at 282 and 736; a row pitch of 40.5pt.
 *
 * Generating them is the point. A gazette page holds real candidates' names,
 * roll numbers and marks, and none of that belongs in a public repository to
 * make a test pass. Synthesising from measured geometry gives the same coverage
 * with no personal data at all.
 */

const PAGE_W = 1008
const FONT = 8
const HEADING_Y = 55
const FIRST_ROW_Y = 73
const ROW_PITCH = 40.5

/** Column anchors, left and right, exactly as measured. */
const COLS = [
  {
    rollX: 56,
    nameX: 92,
    resultLabelX: 270,
    resultX: 284,
    headingRollX: 50.4,
    headingNameX: 96,
    headingResultX: 282,
  },
  {
    rollX: 517,
    nameX: 553,
    resultLabelX: 731,
    resultX: 745,
    headingRollX: 512.1,
    headingNameX: 552,
    headingResultX: 736,
  },
] as const

function word(text: string, x: number, y: number): Word {
  return { x, y, w: text.length * FONT * 0.5, h: FONT, text }
}

function headings(): Word[] {
  return COLS.flatMap((c) => [
    word('Roll-No', c.headingRollX, HEADING_Y + 1),
    word('Name', c.headingNameX, HEADING_Y),
    word('Result-I / Result-II', c.headingResultX, HEADING_Y),
  ])
}

type Row =
  | { kind: 'pass'; roll: string; name: string; marks: string }
  | { kind: 'fail'; roll: string; name: string; partI?: string; partII: string }
  | { kind: 'institution'; text: string }

/**
 * Lay rows out the way the gazette does, including the detail that matters:
 * a PASS prints its marks ~17pt BELOW the roll baseline, while a FAIL's
 * two-line cell starts ~3pt ABOVE it.
 */
function buildPage(rows: { left: Row[]; right: Row[] }): Word[] {
  const words = headings()

  for (const [index, side] of ([rows.left, rows.right] as const).entries()) {
    const col = COLS[index]
    if (!col) continue
    let y = FIRST_ROW_Y

    for (const row of side) {
      if (row.kind === 'institution') {
        // Institution headings print to the LEFT of the roll field.
        words.push(word(row.text, col.rollX - FONT * 2, y))
        y += ROW_PITCH
        continue
      }

      words.push(word(row.roll, col.rollX, y))
      let nameX = col.nameX
      for (const part of row.name.split(' ')) {
        words.push(word(part, nameX, y))
        nameX += part.length * FONT * 0.55 + 4
      }

      if (row.kind === 'pass') {
        words.push(word(row.marks, col.resultX, y + 17))
      } else {
        if (row.partI !== undefined) {
          words.push(word('PI:', col.resultLabelX, y - 3))
          words.push(word(row.partI, col.resultX, y - 3.4))
        }
        words.push(word('PII:', col.resultLabelX, y + 16))
        words.push(word(row.partII, col.resultX, y + 15.6))
      }
      y += ROW_PITCH
    }
  }

  return words
}

describe('geometry inference', () => {
  it('finds the two columns and puts the gutter between them', () => {
    const result = inferGeometry(buildPage({ left: [], right: [] }), PAGE_W)
    expect(result.ok).toBe(true)
    if (!result.ok) return

    const [left, right] = result.geometry.columns
    expect(left).toBeDefined()
    expect(right).toBeDefined()
    // The gutter must sit between the last left-column field and the right
    // column's roll number, or a record lands in the wrong column.
    expect(result.geometry.split).toBeGreaterThan(COLS[0].headingResultX)
    expect(result.geometry.split).toBeLessThan(COLS[1].headingRollX)
  })

  it('refuses a page with no Roll-No heading instead of guessing', () => {
    const result = inferGeometry([word('INTRODUCTION', 80, 98)], PAGE_W)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe('not-a-candidate-page')
  })

  it('refuses the position-holder table, which is a different family', () => {
    /*
     * Pages 5-10 and 18-23 of the real gazette are merit lists headed
     * "Position | Roll No. | Marks | Name of Candidate". They carry roll
     * numbers, so a loose match would parse them as candidate rows and read a
     * POSITION as a roll number. The heading token differs ("Roll No." with a
     * space, not "Roll-No") and that is what keeps them out.
     */
    const merit = [
      word('Position', 216, 102),
      word('Roll', 268, 102),
      word('No.', 290, 102),
      word('Marks', 329, 102),
      word('Name', 399, 102),
      word('1', 232, 130),
      word('236818', 268, 130),
      word('1053', 329, 130),
    ]
    const result = inferGeometry(merit, PAGE_W)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe('not-a-candidate-page')
  })

  it('refuses a page with one column rather than halving it', () => {
    const half = [
      word('Roll-No', 50.4, 56),
      word('Name', 96, 55),
      word('Result-I / Result-II', 282, 55),
    ]
    const result = inferGeometry(half, PAGE_W)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.reason).toBe('unexpected-column-count')
  })

  it('tracks a moved column split rather than assuming the measured one', () => {
    // Same family, shifted 60pt right — the real gazette has five distinct page
    // shapes, so the split is measured per page and must follow.
    const shifted = [
      word('Roll-No', 110.4, 56),
      word('Name', 156, 55),
      word('Result-I / Result-II', 342, 55),
      word('Roll-No', 572.1, 56),
      word('Name', 612, 55),
      word('Result-I / Result-II', 796, 55),
    ]
    const base = inferGeometry(buildPage({ left: [], right: [] }), PAGE_W)
    const moved = inferGeometry(shifted, PAGE_W)
    expect(base.ok && moved.ok).toBe(true)
    if (!base.ok || !moved.ok) return
    expect(moved.geometry.split).toBeGreaterThan(base.geometry.split)
    expect(moved.geometry.split - base.geometry.split).toBeCloseTo(60, 0)
  })
})

describe('row extraction', () => {
  it('reads a passing record from the left column', () => {
    const words = buildPage({
      left: [{ kind: 'pass', roll: '236818', name: 'MUHAMMAD SHARIQ MIR', marks: '621' }],
      right: [],
    })
    const { records, problems } = parsePage(words, PAGE_W, 151, null)
    expect(problems).toEqual([])
    expect(records).toHaveLength(1)
    expect(records[0]?.rollNumber).toBe('236818')
    expect(records[0]?.candidateName).toBe('MUHAMMAD SHARIQ MIR')
    expect(records[0]?.rawResultStatus).toBe('621')
    expect(records[0]?.column).toBe(0)
  })

  it('reads a passing record from the right column, and keeps the columns apart', () => {
    const words = buildPage({
      left: [{ kind: 'pass', roll: '236818', name: 'AAA BBB', marks: '621' }],
      right: [{ kind: 'pass', roll: '236975', name: 'CCC DDD', marks: '680' }],
    })
    const { records } = parsePage(words, PAGE_W, 151, null)
    expect(records).toHaveLength(2)

    const left = records.find((r) => r.column === 0)
    const right = records.find((r) => r.column === 1)
    // Cross-column bleed is the failure this layout invites; assert the pairing
    // explicitly rather than trusting the count.
    expect(left?.rollNumber).toBe('236818')
    expect(left?.rawResultStatus).toBe('621')
    expect(right?.rollNumber).toBe('236975')
    expect(right?.rawResultStatus).toBe('680')
  })

  /*
   * THE REGRESSION THIS FILE EXISTS FOR.
   *
   * A failing candidate's result cell is two lines and its FIRST line prints
   * above its own roll number. Segmenting by line, or opening the row window at
   * the roll baseline, attaches "PI: ..." to the candidate ABOVE — silently,
   * and only for failures.
   */
  it('keeps a failed candidate’s overhanging first result line on its own row', () => {
    const words = buildPage({
      left: [
        { kind: 'pass', roll: '236824', name: 'HASNAIN AHMAD', marks: '704' },
        { kind: 'fail', roll: '236829', name: 'ALI RAZA', partI: 'ENG', partII: 'ENG' },
        { kind: 'pass', roll: '236833', name: 'BILAL KHAN', marks: '624' },
      ],
      right: [],
    })
    const { records, problems } = parsePage(words, PAGE_W, 151, null)
    expect(problems).toEqual([])
    expect(records).toHaveLength(3)

    const byRoll = new Map(records.map((r) => [r.rollNumber, r]))
    expect(byRoll.get('236824')?.rawResultStatus).toBe('704')
    expect(byRoll.get('236829')?.rawResultStatus).toBe('PI: ENG\nPII: ENG')
    expect(byRoll.get('236833')?.rawResultStatus).toBe('624')
  })

  it('orders words within a result line by position, not by baseline', () => {
    /*
     * "PI:" and its subject list sit on one visual line but at very slightly
     * different baselines. Sorting on raw y reordered them into
     * "ENG PI: ENG PII:" — found in a live census, not in review.
     */
    const words = buildPage({
      left: [
        { kind: 'fail', roll: '236900', name: 'TEST NAME', partI: 'MTH,PHY', partII: 'MTH,PHY-Th' },
      ],
      right: [],
    })
    const { records } = parsePage(words, PAGE_W, 200, null)
    expect(records[0]?.rawResultStatus).toBe('PI: MTH,PHY\nPII: MTH,PHY-Th')
  })

  it('reads a Part-II-only failure', () => {
    const words = buildPage({
      left: [{ kind: 'fail', roll: '236840', name: 'SOME ONE', partII: 'ENG' }],
      right: [],
    })
    const { records } = parsePage(words, PAGE_W, 151, null)
    expect(records[0]?.rawResultStatus).toBe('PII: ENG')
  })

  it('carries ABSENT through verbatim rather than mapping it to a failure', () => {
    const words = buildPage({
      left: [{ kind: 'fail', roll: '236841', name: 'SOME ONE', partII: 'ABSENT' }],
      right: [],
    })
    const { records } = parsePage(words, PAGE_W, 151, null)
    // The board's own word. Deciding what ABSENT means is not the parser's job.
    expect(records[0]?.rawResultStatus).toBe('PII: ABSENT')
  })

  it('keeps a long multi-word name in reading order', () => {
    const long = 'MUHAMMAD ABDUL REHMAN SHAHZAD ALI KHAN AWAN'
    const words = buildPage({
      left: [{ kind: 'pass', roll: '236850', name: long, marks: '812' }],
      right: [],
    })
    const { records } = parsePage(words, PAGE_W, 151, null)
    expect(records[0]?.candidateName).toBe(long)
  })

  it('applies an institution heading to the rows that follow it', () => {
    const words = buildPage({
      left: [
        { kind: 'institution', text: '211002-GOVT. ISLAMIA COLLEGE, GUJRANWALA' },
        { kind: 'pass', roll: '236930', name: 'AAA BBB', marks: '665' },
      ],
      right: [],
    })
    const { records, problems, institution } = parsePage(words, PAGE_W, 151, null)
    expect(problems).toEqual([])
    expect(records[0]?.institution).toBe('211002-GOVT. ISLAMIA COLLEGE, GUJRANWALA')
    expect(institution).toBe('211002-GOVT. ISLAMIA COLLEGE, GUJRANWALA')
  })

  it('clears the institution on a PRIVATE heading instead of carrying it over', () => {
    const words = buildPage({
      left: [
        { kind: 'institution', text: 'PRIVATE' },
        { kind: 'pass', roll: '101861', name: 'AAA BBB', marks: '540' },
      ],
      right: [],
    })
    const { records } = parsePage(words, PAGE_W, 152, '211002-GOVT. ISLAMIA COLLEGE, GUJRANWALA')
    // A private candidate belongs to no institution; inheriting the previous
    // one would attach a college to someone who never attended it.
    expect(records[0]?.institution).toBeNull()
  })

  it('carries the institution across a page boundary', () => {
    const page1 = buildPage({
      left: [
        { kind: 'institution', text: '211002-GOVT. ISLAMIA COLLEGE, GUJRANWALA' },
        { kind: 'pass', roll: '236930', name: 'AAA BBB', marks: '665' },
      ],
      right: [],
    })
    const first = parsePage(page1, PAGE_W, 151, null)

    const page2 = buildPage({
      left: [{ kind: 'pass', roll: '236931', name: 'CCC DDD', marks: '600' }],
      right: [],
    })
    const second = parsePage(page2, PAGE_W, 152, first.institution)
    // The heading is printed once and applies until the next one, including
    // over the page break.
    expect(second.records[0]?.institution).toBe('211002-GOVT. ISLAMIA COLLEGE, GUJRANWALA')
  })

  it('rejects a malformed roll number rather than storing it', () => {
    const words = buildPage({
      left: [
        { kind: 'pass', roll: '236818', name: 'AAA BBB', marks: '621' },
        { kind: 'pass', roll: '2368', name: 'CCC DDD', marks: '622' },
        { kind: 'pass', roll: '236820', name: 'EEE FFF', marks: '623' },
      ],
      right: [],
    })
    const { records, problems } = parsePage(words, PAGE_W, 151, null)

    /*
     * The neighbours are not decoration. The roll column's x is measured from
     * the six-digit values actually on the page, so a page holding ONLY a
     * malformed row has no column to align to and the row is never anchored at
     * all. Two valid rows reproduce the real situation: the column is
     * established, the short roll anchors on it, and it is then rejected on its
     * own merits.
     */
    expect(records.map((r) => r.rollNumber)).toEqual(['236818', '236820'])
    expect(problems.map((p) => p.kind)).toContain('malformed-roll-number')

    // The rejected row keeps its verbatim text so it can be audited, and the
    // bad value must never appear among the accepted records.
    const rejected = problems.find((p) => p.kind === 'malformed-roll-number')
    expect(rejected?.raw).toContain('2368')
    expect(records.some((r) => r.rollNumber === '2368')).toBe(false)
  })

  it('rejects a row whose result cell is empty', () => {
    const words = [...headings(), word('236818', 56, 73), word('AAA', 92, 73), word('BBB', 120, 73)]
    const { records, problems } = parsePage(words, PAGE_W, 151, null)
    expect(records).toEqual([])
    expect(problems.map((p) => p.kind)).toContain('missing-result')
  })

  it('reports text no row claimed instead of attaching it to the nearest one', () => {
    const words = [
      ...buildPage({
        left: [{ kind: 'pass', roll: '236818', name: 'AAA BBB', marks: '621' }],
        right: [],
      }),
      // A stray fragment far below the last row.
      word('ORPHANFRAGMENT', 92, 400),
    ]
    const { problems } = parsePage(words, PAGE_W, 151, null)
    expect(problems.map((p) => p.kind)).toContain('unassigned-text')
    expect(problems.find((p) => p.kind === 'unassigned-text')?.raw).toContain('ORPHANFRAGMENT')
  })

  it('records every row it accepts with a page and column reference', () => {
    const words = buildPage({
      left: [{ kind: 'pass', roll: '236818', name: 'AAA BBB', marks: '621' }],
      right: [{ kind: 'pass', roll: '236975', name: 'CCC DDD', marks: '680' }],
    })
    const { records } = parsePage(words, PAGE_W, 4242, null)
    for (const record of records) {
      // Traceability back to the gazette is not optional: a disputed record has
      // to be findable on the page it came from.
      expect(record.page).toBe(4242)
      expect(record.bbox).toHaveLength(4)
      expect(record.raw).toContain(record.rollNumber)
    }
  })
})

describe('pdf word extraction', () => {
  it('flips pdf y so the parser can reason top-down', () => {
    const [w] = wordsFromItems(
      [{ str: 'Roll-No', width: 30, height: 8, transform: [1, 0, 0, 1, 50.4, 556] }],
      612,
    )
    expect(w?.y).toBe(612 - 556)
  })

  it('splits a multi-word run so each word keeps a usable x', () => {
    // pdf.js emits one item per show-text operation, which is sometimes a run.
    // Left whole, "1982 with" would place both words at the x of the "1".
    const words = wordsFromItems(
      [{ str: '1982 with', width: 45, height: 8, transform: [1, 0, 0, 1, 468, 501] }],
      612,
    )
    expect(words.map((w) => w.text)).toEqual(['1982', 'with'])
    expect(words[1]?.x).toBeGreaterThan(words[0]?.x ?? 0)
  })

  it('drops whitespace-only items', () => {
    expect(
      wordsFromItems([{ str: '   ', width: 9, height: 8, transform: [1, 0, 0, 1, 10, 10] }], 612),
    ).toEqual([])
  })
})

describe('row-boundary regression: the overhang is not a constant', () => {
  /*
   * Found by ingesting all 5,920 pages, not by review.
   *
   * A two-line result cell starts ABOVE its own roll number, and the overhang
   * is 3pt on page 151 but 5pt on page 4528. A lead measured in font-heights
   * (~4.5pt) covered the first and missed the second, dropping 29 subject lists
   * while keeping the identical construct everywhere else. Deriving the lead
   * from the row pitch covers both.
   */
  function pageWithOverhang(overhang: number): Word[] {
    const words = headings()
    const col = COLS[0]
    if (!col) return words
    // Three rows at the real 40.5pt pitch; the middle one fails, so its first
    // result line hangs above its own anchor by `overhang`.
    const ys = [FIRST_ROW_Y, FIRST_ROW_Y + ROW_PITCH, FIRST_ROW_Y + ROW_PITCH * 2]
    const rolls = ['112487', '112490', '112493']
    ys.forEach((y, i) => {
      words.push(word(rolls[i] ?? '000000', col.rollX, y))
      words.push(word('AAA', col.nameX, y))
      if (i === 1) {
        words.push(word('PI:', col.resultLabelX, y - overhang))
        words.push(word('U,ENG,IE,PHY,CH,BIO,THQ', col.resultX, y - overhang))
        words.push(word('PII:', col.resultLabelX, y + 16))
        words.push(word('MARKS', col.resultX, y + 16))
      } else {
        words.push(word('600', col.resultX, y + 17))
      }
    })
    return words
  }

  for (const overhang of [3, 5, 7]) {
    it(`claims a result line hanging ${overhang}pt above its own row`, () => {
      const { records, problems } = parsePage(pageWithOverhang(overhang), PAGE_W, 4528, null)
      expect(problems, `${overhang}pt overhang produced problems`).toEqual([])

      const middle = records.find((r) => r.rollNumber === '112490')
      expect(middle?.rawResultStatus).toContain('PI: U,ENG,IE,PHY,CH,BIO,THQ')

      // And it must NOT have been stolen from the row above.
      const first = records.find((r) => r.rollNumber === '112487')
      expect(first?.rawResultStatus).toBe('600')
    })
  }
})

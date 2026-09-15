/**
 * Source-vs-parsed QA.
 *
 *   npx tsx scripts/gazette/qa-sample.ts <pdf> <runDir> [samplesPerBucket]
 *
 * THIS DELIBERATELY DOES NOT USE THE PARSER.
 *
 * Re-running `parsePage` and comparing it with itself would prove nothing. The
 * verifier below re-reads the page and finds the record by a different method:
 * group text into visual lines, locate the line carrying the roll number, read
 * what sits to its right, and read the result band around it. Two independent
 * readings agreeing is evidence; one reading agreeing with itself is not.
 *
 * Verdicts are MATCH, MISMATCH or UNCERTAIN. UNCERTAIN means the independent
 * method could not read the page confidently — it is not a pass, and it is
 * reported separately so it can never be counted as one.
 *
 * A WRONG-CANDIDATE MAPPING IS THE BLOCKER. Everything else is a defect; a
 * roll number carrying another candidate's result is the thing that must never
 * reach a student, so the roll->name binding is checked on every sample.
 *
 * Output names candidates and is written to gazette-private/ only.
 */
import { createInterface } from 'node:readline'
import { createReadStream } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'

import type { GazetteRecord } from '@/lib/gazettes/normalize'

/**
 * pdf.js types `content.items` as `(TextItem | TextMarkedContent)[]`, but it
 * only ever yields `TextMarkedContent` when `includeMarkedContent: true` is
 * passed to `getTextContent`. It is not passed anywhere in this project, so
 * every item is a `TextItem`. One narrow cast, stated here, beats threading a
 * type guard through every call site.
 */
type PositionedText = { str: string; width: number; height: number; transform: number[] }

function positionedText(items: unknown[]): PositionedText[] {
  return items as PositionedText[]
}

type Verdict = 'MATCH' | 'MISMATCH' | 'UNCERTAIN'

type Check = {
  rollNumber: string
  page: number
  column: number
  bucket: string
  verdict: Verdict
  detail: string
}

async function main() {
  const [pdfPath, runDir, perBucketArg] = process.argv.slice(2)
  if (!pdfPath || !runDir) {
    console.error('usage: npx tsx scripts/gazette/qa-sample.ts <pdf> <runDir> [perBucket]')
    process.exit(2)
  }
  const perBucket = Number(perBucketArg ?? 12)

  // ---- choose the sample --------------------------------------------------
  const all: GazetteRecord[] = []
  const lines = createInterface({
    input: createReadStream(`${runDir}/records.jsonl`, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })
  for await (const line of lines) {
    if (line.trim() !== '') all.push(JSON.parse(line) as GazetteRecord)
  }
  if (all.length === 0) throw new Error('no records to check')

  // Reduce, not Math.min(...array): spreading 138,617 arguments overflows the
  // call stack, and the dataset only gets bigger from here.
  let minPage = Number.POSITIVE_INFINITY
  let maxPage = 0
  for (const record of all) {
    if (record.sourcePage < minPage) minPage = record.sourcePage
    if (record.sourcePage > maxPage) maxPage = record.sourcePage
  }
  const third = (maxPage - minPage) / 3

  /*
   * Buckets cover the failure modes this layout invites: position in the file,
   * which column a row sat in, the page boundaries where state carries over,
   * and every status form including the rare ones. Sampling only the common
   * case would confirm only the common case.
   */
  const buckets: { name: string; pick: (r: GazetteRecord) => boolean }[] = [
    { name: 'beginning', pick: (r) => r.sourcePage < minPage + third },
    {
      name: 'middle',
      pick: (r) => r.sourcePage >= minPage + third && r.sourcePage < minPage + third * 2,
    },
    { name: 'end', pick: (r) => r.sourcePage >= minPage + third * 2 },
    { name: 'left-column', pick: (r) => r.sourceColumn === 0 },
    { name: 'right-column', pick: (r) => r.sourceColumn === 1 },
    { name: 'first-page', pick: (r) => r.sourcePage === minPage },
    { name: 'last-page', pick: (r) => r.sourcePage === maxPage },
    { name: 'status-passed', pick: (r) => r.resultStatus === 'passed' },
    { name: 'status-failed', pick: (r) => r.resultStatus === 'failed' },
    { name: 'status-absent', pick: (r) => r.resultStatus === 'absent' },
    { name: 'status-unknown', pick: (r) => r.resultStatus === 'unknown' },
    { name: 'marks-improved', pick: (r) => (r.remarks ?? '').includes('MARKS IMP') },
    { name: 'pass-additional', pick: (r) => (r.remarks ?? '').includes('ADD. SUB') },
    { name: 'long-name', pick: (r) => r.candidateName.length >= 34 },
    { name: 'private-candidate', pick: (r) => r.institution === null },
    {
      name: 'both-parts-failed',
      pick: (r) => r.partIFailedSubjects.length > 0 && r.partIIFailedSubjects.length > 0,
    },
  ]

  const sample: { record: GazetteRecord; bucket: string }[] = []
  for (const bucket of buckets) {
    const matching = all.filter(bucket.pick)
    // Evenly spread within the bucket rather than taking the head.
    const step = Math.max(1, Math.floor(matching.length / perBucket))
    for (let i = 0, taken = 0; i < matching.length && taken < perBucket; i += step, taken += 1) {
      const record = matching[i]
      if (record) sample.push({ record, bucket: bucket.name })
    }
  }

  // ---- verify against the PDF, independently ------------------------------
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const data = new Uint8Array(await readFile(pdfPath))
  const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true })
  const doc = await loadingTask.promise

  const byPage = new Map<number, { record: GazetteRecord; bucket: string }[]>()
  for (const entry of sample) {
    const list = byPage.get(entry.record.sourcePage) ?? []
    list.push(entry)
    byPage.set(entry.record.sourcePage, list)
  }

  const checks: Check[] = []
  for (const [pageNumber, entries] of [...byPage].sort((a, b) => a[0] - b[0])) {
    const page = await doc.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()

    type Cell = { x: number; y: number; s: string }
    const cells: Cell[] = positionedText(content.items)
      .filter((i) => i.str.trim() !== '')
      .map((i) => ({
        x: i.transform[4] ?? 0,
        y: viewport.height - (i.transform[5] ?? 0),
        s: i.str.trim(),
      }))

    for (const { record, bucket } of entries) {
      checks.push(verify(record, bucket, cells, viewport.width))
    }
    page.cleanup()
  }
  await loadingTask.destroy()

  // ---- report -------------------------------------------------------------
  const counts = { MATCH: 0, MISMATCH: 0, UNCERTAIN: 0 }
  for (const check of checks) counts[check.verdict] += 1

  const byBucket = new Map<string, { MATCH: number; MISMATCH: number; UNCERTAIN: number }>()
  for (const check of checks) {
    const row = byBucket.get(check.bucket) ?? { MATCH: 0, MISMATCH: 0, UNCERTAIN: 0 }
    row[check.verdict] += 1
    byBucket.set(check.bucket, row)
  }

  console.log(`samples checked: ${checks.length}`)
  console.log(`  MATCH     ${counts.MATCH}`)
  console.log(`  MISMATCH  ${counts.MISMATCH}`)
  console.log(`  UNCERTAIN ${counts.UNCERTAIN}`)
  console.log('\nby bucket:')
  for (const [name, row] of byBucket) {
    console.log(
      `  ${name.padEnd(20)} match ${String(row.MATCH).padStart(3)}  mismatch ${String(row.MISMATCH).padStart(3)}  uncertain ${String(row.UNCERTAIN).padStart(3)}`,
    )
  }

  if (counts.MISMATCH > 0) {
    console.log('\nMISMATCHES (blocking):')
    for (const check of checks.filter((c) => c.verdict === 'MISMATCH').slice(0, 25)) {
      console.log(`  p${check.page} col${check.column} ${check.rollNumber}: ${check.detail}`)
    }
  }
  if (counts.UNCERTAIN > 0) {
    console.log('\nUNCERTAIN (not a pass):')
    for (const check of checks.filter((c) => c.verdict === 'UNCERTAIN').slice(0, 15)) {
      console.log(`  p${check.page} col${check.column} ${check.rollNumber}: ${check.detail}`)
    }
  }

  await writeFile(`${runDir}/qa-report.json`, JSON.stringify({ counts, checks }, null, 2), 'utf8')
  console.log(`\nfull report: ${runDir}/qa-report.json`)
  process.exit(counts.MISMATCH > 0 ? 1 : 0)
}

/**
 * The independent read. Finds the roll number's own visual line, takes the text
 * to its right as the name, and reads the result band beside it.
 */
function verify(
  record: GazetteRecord,
  bucket: string,
  cells: { x: number; y: number; s: string }[],
  pageWidth: number,
): Check {
  const base = {
    rollNumber: record.rollNumber,
    page: record.sourcePage,
    column: record.sourceColumn,
    bucket,
  }

  const hits = cells.filter((c) => c.s === record.rollNumber)
  if (hits.length === 0) {
    return {
      ...base,
      verdict: 'MISMATCH',
      detail: 'roll number is not on the page it was recorded from',
    }
  }
  if (hits.length > 1) {
    return {
      ...base,
      verdict: 'UNCERTAIN',
      detail: `roll number appears ${hits.length} times on this page`,
    }
  }
  const anchor = hits[0]
  if (!anchor) return { ...base, verdict: 'UNCERTAIN', detail: 'no anchor' }

  // Which half of the page is it on? Compared against the recorded column.
  const observedColumn = anchor.x < pageWidth / 2 ? 0 : 1
  if (observedColumn !== record.sourceColumn) {
    return {
      ...base,
      verdict: 'MISMATCH',
      detail: `recorded column ${record.sourceColumn}, found in column ${observedColumn}`,
    }
  }

  const columnCells = cells.filter((c) =>
    observedColumn === 0 ? c.x < pageWidth / 2 : c.x >= pageWidth / 2,
  )

  const resultBandX = observedColumn === 0 ? pageWidth * 0.26 : pageWidth * 0.72

  // Everything below is read strictly under the column headings, or an early
  // row's window reaches up and swallows "Roll-No" / "Result-I / Result-II".
  const headingY = Math.max(
    0,
    ...columnCells.filter((c) => c.s === 'Roll-No' || c.s.startsWith('Result-I')).map((c) => c.y),
  )
  const inRow = (c: { y: number }) =>
    c.y > anchor.y - 22 && c.y < anchor.y + 22 && c.y > headingY + 4

  /*
   * Institution headings print to the LEFT of the roll field and some run long
   * enough to cross the result band: "322528-DUKHTARAN-E-MILLAT HIGHER
   * SECONDARY SCHOOL, MANDEER, KHARIAN, GUJRAT" on page 4068 reaches past it
   * and was read as part of a candidate's result. Any visual line that starts
   * left of the roll column is a heading, not a data row, so it is dropped
   * whole.
   */
  const headingLineYs = new Set(
    columnCells.filter((c) => c.x < anchor.x - 5 && inRow(c)).map((c) => Math.round(c.y)),
  )
  const onHeadingLine = (c: { y: number }) => [...headingLineYs].some((y) => Math.abs(y - c.y) <= 3)

  /*
   * A long name WRAPS, and its two lines straddle the roll baseline the same
   * way a two-line result cell does. On page 514 a name prints five words at
   * y=475 and one at y=486 while its roll number sits at y=478.
   *
   * Reading only the roll's own line found five of those six words and
   * reported four "name differs" mismatches that were this verifier's fault,
   * not the parser's. The name band has to be as tall as the row.
   */
  const nameBand = columnCells.filter(
    (c) => c.x > anchor.x && c.x < resultBandX && inRow(c) && !onHeadingLine(c),
  )
  const observedName = joinByLine(nameBand)

  if (observedName !== record.candidateName) {
    return {
      ...base,
      verdict: 'MISMATCH',
      detail: `name differs — stored ${JSON.stringify(record.candidateName)}, page ${JSON.stringify(observedName)}`,
    }
  }

  /*
   * The result band. A result cell can be one line below the roll or two lines
   * straddling it, so a window of +-22pt is read.
   *
   * TWO THINGS THIS HAS TO GET RIGHT, both of which it got wrong at first:
   *
   * 1. Stop above the column heading. On an early row the window reaches into
   *    the header and swallows "Result-I / Result-II".
   * 2. Order by visual line, then by x. Sorting on raw y scrambles words that
   *    share a line — the same defect the parser had, reproduced here
   *    independently, which is its own small confirmation that the fix was
   *    needed.
   */
  const band = columnCells.filter((c) => c.x >= resultBandX && inRow(c) && !onHeadingLine(c))
  const observedStatus = joinByLine(band)
  const storedStatus = record.rawResultStatus.replace(/\s+/g, ' ').trim()

  if (observedStatus === '') {
    return {
      ...base,
      verdict: 'UNCERTAIN',
      detail: 'no result text found in the band beside the roll number',
    }
  }
  if (observedStatus !== storedStatus) {
    return {
      ...base,
      verdict: 'MISMATCH',
      detail: `status differs — stored ${JSON.stringify(storedStatus)}, page ${JSON.stringify(observedStatus)}`,
    }
  }

  return { ...base, verdict: 'MATCH', detail: 'roll, name and result all agree' }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

/**
 * Group cells into visual lines, order by x within each line, join with a
 * single space. Written here rather than imported: the whole point of this
 * script is to read the page by a second, independent route.
 */
function joinByLine(cells: { x: number; y: number; s: string }[]): string {
  const sorted = [...cells].sort((a, b) => a.y - b.y || a.x - b.x)
  const lines: { x: number; y: number; s: string }[][] = []
  for (const cell of sorted) {
    const current = lines[lines.length - 1]
    const head = current?.[0]
    if (current && head && Math.abs(head.y - cell.y) <= 3) current.push(cell)
    else lines.push([cell])
  }
  return lines
    .map((line) =>
      line
        .sort((a, b) => a.x - b.x)
        .map((c) => c.s)
        .join(' '),
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

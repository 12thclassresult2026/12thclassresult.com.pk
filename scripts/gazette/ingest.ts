/**
 * Gazette ingestion, pass one: PDF -> raw positioned records.
 *
 *   npx tsx scripts/gazette/ingest.ts <pdf> <manifest.json> <outDir>
 *
 * Parsing 5,920 pages is the expensive step and its output never changes, so it
 * is separated from normalisation. Normalising is cheap and its rules WILL
 * change as more gazettes are seen; re-running it must not mean re-reading the
 * PDF, and must not be able to alter what was read off the page.
 *
 * The run is immutable: it refuses to write into an existing directory, so a
 * report can always be traced to the exact bytes that produced it.
 *
 * OUTPUT CONTAINS CANDIDATE DATA. `outDir` must be inside `gazette-private/`.
 */
import { createHash } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { mkdir, readFile, stat } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'

import type { ParseProblem, RawRecord } from '@/lib/gazettes/parser/types'

import { wordsFromItems } from '@/lib/gazettes/parser/pdf-words'
import { parsePage } from '@/lib/gazettes/parser/rows'

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

export const PARSER_VERSION = 'grw-two-column-2.0.0'

type Manifest = {
  datasetId: string
  boardId: string
  year: number
  examination: string
  session: string
  examLevel: string
  sourceUrl: string
  provenanceVerified: boolean
  checksum: string
  sizeBytes: number
}

async function main() {
  const [pdfPath, manifestPath, outDir] = process.argv.slice(2)
  if (!pdfPath || !manifestPath || !outDir) {
    console.error('usage: npx tsx scripts/gazette/ingest.ts <pdf> <manifest.json> <outDir>')
    process.exit(2)
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as Manifest

  /*
   * Provenance gate. Nothing is parsed until the bytes on disk are proven to be
   * the bytes the registry recorded from the board's own domain. This exists
   * because the working tree really did contain a different gazette — a Lahore
   * file republished by an aggregator — sitting where the Gujranwala original
   * was supposed to be.
   */
  if (!manifest.provenanceVerified) throw new Error('manifest provenance is not verified')
  const bytes = await readFile(pdfPath)
  const actualSize = (await stat(pdfPath)).size
  const actualSum = createHash('sha256').update(bytes).digest('hex')
  if (actualSum !== manifest.checksum) {
    throw new Error(`checksum mismatch\n  on disk:  ${actualSum}\n  manifest: ${manifest.checksum}`)
  }
  if (actualSize !== manifest.sizeBytes) {
    throw new Error(`size mismatch: ${actualSize} vs ${manifest.sizeBytes}`)
  }

  await mkdir(outDir, { recursive: false })

  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(bytes), useSystemFonts: true })
  const doc = await loadingTask.promise

  // The source must identify itself. A correct checksum proves the file is
  // unchanged, not that it is the gazette the manifest claims.
  const cover = await (await doc.getPage(1)).getTextContent()
  const coverText = positionedText(cover.items)
    .map((i) => i.str)
    .join(' ')
    .toUpperCase()
  for (const token of ['GUJRANWALA', '2025', 'PART-II']) {
    if (!coverText.includes(token)) {
      throw new Error(`source identity mismatch: cover page does not mention ${token}`)
    }
  }

  const rawOut = createWriteStream(`${outDir}/raw.jsonl`, { encoding: 'utf8' })
  const problemOut = createWriteStream(`${outDir}/problems.jsonl`, { encoding: 'utf8' })

  const counts = new Map<string, number>()
  const statusShapes = new Map<string, number>()
  const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1)

  let institution: string | null = null
  let candidatePages = 0
  let otherPages = 0
  const splits = new Set<number>()
  const started = performance.now()

  for (let n = 1; n <= doc.numPages; n += 1) {
    const page = await doc.getPage(n)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()
    const words = wordsFromItems(content.items as never[], viewport.height)

    const result = parsePage(words, viewport.width, n, institution)
    institution = result.institution

    if (result.geometry) {
      candidatePages += 1
      splits.add(Math.round(result.geometry.split * 10) / 10)
    } else {
      otherPages += 1
    }

    for (const problem of result.problems as ParseProblem[]) {
      bump(counts, problem.kind)
      problemOut.write(JSON.stringify(problem) + '\n')
    }
    for (const record of result.records as RawRecord[]) {
      bump(counts, 'parsed')
      bump(statusShapes, record.rawResultStatus.replace(/\d/g, '9'))
      rawOut.write(JSON.stringify(record) + '\n')
    }

    page.cleanup()
    if (n % 500 === 0) process.stderr.write(`  page ${n}/${doc.numPages}\n`)
  }

  await Promise.all([closed(rawOut), closed(problemOut)])
  await loadingTask.destroy()

  const report = {
    datasetId: manifest.datasetId,
    parserVersion: PARSER_VERSION,
    sourceChecksum: manifest.checksum,
    sourceUrl: manifest.sourceUrl,
    pages: doc.numPages,
    candidatePages,
    otherPages,
    detectedSplits: [...splits].sort((a, b) => a - b),
    counts: Object.fromEntries([...counts].sort((a, b) => b[1] - a[1])),
    distinctStatusShapes: statusShapes.size,
    statusShapes: Object.fromEntries([...statusShapes].sort((a, b) => b[1] - a[1])),
    parseSeconds: Number(((performance.now() - started) / 1000).toFixed(1)),
    // Re-read after the run: proof the parser did not touch the original.
    originalUnchanged:
      createHash('sha256')
        .update(await readFile(pdfPath))
        .digest('hex') === manifest.checksum,
  }

  const { writeFile } = await import('node:fs/promises')
  await writeFile(`${outDir}/parse-report.json`, JSON.stringify(report, null, 2), 'utf8')
  await writeFile(`${outDir}/source.json`, JSON.stringify(manifest, null, 2), 'utf8')

  // The per-shape histogram is thousands of entries; the file keeps it, stdout does not.
  const summary = Object.fromEntries(Object.entries(report).filter(([k]) => k !== 'statusShapes'))
  console.log(JSON.stringify(summary, null, 2))
}

function closed(stream: import('node:fs').WriteStream): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.end()
    stream.on('finish', () => resolve())
    stream.on('error', reject)
  })
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

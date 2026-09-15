/**
 * What result statuses does this gazette actually print?
 *
 *   node scripts/gazette/status-census.ts <pdf> [maxPages]
 *
 * Run BEFORE writing the normaliser. Writing it from the two or three forms
 * visible on one sample page would mean inventing rules for everything else and
 * discovering the gaps in production.
 *
 * Prints shapes and counts only — a status like "621" is a mark, not an
 * identifier, and no roll number or name is emitted.
 */
import { readFile } from 'node:fs/promises'

import { parsePage } from '@/lib/gazettes/parser/rows'
import { wordsFromItems } from '@/lib/gazettes/parser/pdf-words'

async function main() {
  const [pdfPath, maxArg] = process.argv.slice(2)
  if (!pdfPath) {
    console.error('usage: node scripts/gazette/status-census.ts <pdf> [maxPages]')
    process.exit(2)
  }

  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const data = new Uint8Array(await readFile(pdfPath))
  const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true })
  const doc = await loadingTask.promise

  const limit = maxArg ? Number(maxArg) : doc.numPages
  const shapes = new Map<string, number>()
  const problems = new Map<string, number>()
  let records = 0
  let institution: string | null = null

  for (let n = 1; n <= Math.min(limit, doc.numPages); n += 1) {
    const page = await doc.getPage(n)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()
    const words = wordsFromItems(content.items as never[], viewport.height)
    const result = parsePage(words, viewport.width, n, institution)
    institution = result.institution

    for (const record of result.records) {
      records += 1
      shapes.set(
        shapeOf(record.rawResultStatus),
        (shapes.get(shapeOf(record.rawResultStatus)) ?? 0) + 1,
      )
    }
    for (const problem of result.problems) {
      problems.set(problem.kind, (problems.get(problem.kind) ?? 0) + 1)
    }
    page.cleanup()
  }

  console.log(`pages read: ${Math.min(limit, doc.numPages)}   records: ${records}`)
  console.log('\nresult-status SHAPES (digits -> 9, letters kept):')
  for (const [shape, count] of [...shapes].sort((a, b) => b[1] - a[1]).slice(0, 40)) {
    console.log(`  ${String(count).padStart(7)}  ${JSON.stringify(shape)}`)
  }
  console.log('\nproblems:')
  for (const [kind, count] of [...problems].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(7)}  ${kind}`)
  }

  await loadingTask.destroy()

  /** Collapse digits so "621" and "704" count as one shape, not two. */
  function shapeOf(status: string): string {
    return status.replace(/\d/g, '9').replace(/\n/g, ' ⏎ ')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

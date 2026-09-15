/**
 * Per-page geometry census -> JSONL, plus a summary of the outliers.
 *
 *   node scripts/gazette/census.mjs <pdf> <out.jsonl>
 *
 * The scan proved the column split is NOT constant across this gazette, which
 * is the single fact the parser design turns on. This records the geometry of
 * every page so the variants can be identified and handled deliberately rather
 * than averaged away.
 *
 * Emits structure only — heading positions and counts, never candidate text —
 * so the JSONL is safe to summarise in a report.
 */
import { createWriteStream } from 'node:fs'
import { readFile } from 'node:fs/promises'

const [pdfPath, outPath] = process.argv.slice(2)
if (!pdfPath || !outPath) {
  console.error('usage: node scripts/gazette/census.mjs <pdf> <out.jsonl>')
  process.exit(2)
}

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
const data = new Uint8Array(await readFile(pdfPath))
const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true })
const doc = await loadingTask.promise

const out = createWriteStream(outPath, { encoding: 'utf8' })
const shapes = new Map()

for (let n = 1; n <= doc.numPages; n += 1) {
  const page = await doc.getPage(n)
  const viewport = page.getViewport({ scale: 1 })
  const content = await page.getTextContent()
  const items = content.items
    .filter((i) => 'str' in i && i.str.trim() !== '')
    .map((i) => ({
      x: i.transform[4],
      y: viewport.height - i.transform[5],
      h: i.height,
      s: i.str.trim(),
    }))

  const pick = (re) => items.filter((i) => re.test(i.s)).sort((a, b) => a.x - b.x)
  const rolls = pick(/^Roll[-\s]?No/i)
  const names = pick(/^Name$/i)
  const results = pick(/^Result-I/i)

  // Six-digit tokens sitting on their own are the row anchors; their x spread
  // shows where the data columns really are, independent of the headings.
  const sixDigit = items.filter((i) => /^\d{6}$/.test(i.s))
  const xs = [...new Set(sixDigit.map((i) => Math.round(i.x)))].sort((a, b) => a - b)

  const record = {
    page: n,
    w: Math.round(viewport.width),
    h: Math.round(viewport.height),
    items: items.length,
    rollHeadings: rolls.map((r) => Math.round(r.x * 10) / 10),
    nameHeadings: names.map((r) => Math.round(r.x * 10) / 10),
    resultHeadings: results.map((r) => Math.round(r.x * 10) / 10),
    anchorXs: xs,
    anchorCount: sixDigit.length,
  }
  out.write(JSON.stringify(record) + '\n')

  const shape = `${record.w}x${record.h} rolls=[${record.rollHeadings.join('|')}]`
  shapes.set(shape, (shapes.get(shape) ?? 0) + 1)
  page.cleanup()
}

out.end()
await loadingTask.destroy()

console.log('distinct page shapes:')
for (const [shape, count] of [...shapes].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(5)}  ${shape}`)
}

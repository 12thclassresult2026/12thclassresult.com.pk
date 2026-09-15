/**
 * Full positioned dump of one page, grouped into geometric lines.
 *
 *   node scripts/gazette/dump-page.mjs <pdf> <page>
 *
 * CONTAINS CANDIDATE DATA. Write it only into `gazette-private/`, which is
 * gitignored, and never paste it into a report or a commit.
 */
import { readFile } from 'node:fs/promises'

const [pdfPath, pageArg] = process.argv.slice(2)
if (!pdfPath || !pageArg) {
  console.error('usage: node scripts/gazette/dump-page.mjs <pdf> <page>')
  process.exit(2)
}

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
const data = new Uint8Array(await readFile(pdfPath))
const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true })
const doc = await loadingTask.promise

const page = await doc.getPage(Number(pageArg))
const viewport = page.getViewport({ scale: 1 })
const content = await page.getTextContent()

const items = content.items
  .filter((i) => 'str' in i && i.str.trim() !== '')
  .map((i) => ({
    x: i.transform[4],
    y: viewport.height - i.transform[5],
    w: i.width,
    h: i.height,
    s: i.str.trim(),
  }))
  .sort((a, b) => a.y - b.y || a.x - b.x)

// Group into visual lines: same baseline within a small tolerance.
const rows = []
for (const item of items) {
  const last = rows[rows.length - 1]
  if (last && Math.abs(last[0].y - item.y) <= 2.5) last.push(item)
  else rows.push([item])
}

console.log(
  `page ${pageArg}  ${viewport.width} x ${viewport.height}  items ${items.length}  lines ${rows.length}`,
)
for (const row of rows) {
  const y = row[0].y.toFixed(0).padStart(4)
  const cells = row
    .sort((a, b) => a.x - b.x)
    .map((i) => `${i.x.toFixed(0)}:"${i.s}"`)
    .join('  ')
  console.log(`y${y} | ${cells}`)
}

await loadingTask.destroy()

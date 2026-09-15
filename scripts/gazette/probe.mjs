/**
 * Geometry probe. Read-only: it prints what the PDF actually looks like so the
 * parser can be written against evidence instead of an assumption.
 *
 * Run before touching the parser whenever a new gazette family appears.
 *
 *   node scripts/gazette/probe.mjs <pdf> [pageNumbers...]
 *
 * Output goes to stdout and may contain candidate data, so never redirect it
 * into the repository. `gazette-private/` is the gitignored scratch area.
 */
import { readFile } from 'node:fs/promises'

const [pdfPath, ...pageArgs] = process.argv.slice(2)
if (!pdfPath) {
  console.error('usage: node scripts/gazette/probe.mjs <pdf> [pages...]')
  process.exit(2)
}

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
const data = new Uint8Array(await readFile(pdfPath))
const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true })
const doc = await loadingTask.promise

console.log(`pages: ${doc.numPages}`)

const pages = pageArgs.length
  ? pageArgs.map(Number)
  : [1, 2, 3, Math.floor(doc.numPages / 2), doc.numPages - 1, doc.numPages]

for (const n of pages) {
  if (n < 1 || n > doc.numPages) continue
  const page = await doc.getPage(n)
  const viewport = page.getViewport({ scale: 1 })
  const content = await page.getTextContent()

  console.log(`\n${'='.repeat(78)}`)
  console.log(`PAGE ${n}  size ${viewport.width.toFixed(1)} x ${viewport.height.toFixed(1)}`)
  console.log(`items: ${content.items.length}`)

  // pdfjs gives a transform matrix per item; [4] and [5] are the device x/y.
  const items = content.items
    .filter((i) => 'str' in i && i.str.trim() !== '')
    .map((i) => ({
      x: i.transform[4],
      // PDF y grows upward; flip so y increases down the page like a reader.
      y: viewport.height - i.transform[5],
      w: i.width,
      h: i.height,
      s: i.str,
    }))

  console.log(`non-empty items: ${items.length}`)

  // Where do the repeated column headings sit? This is what the split is
  // inferred from, so it is the first thing worth seeing.
  for (const needle of ['Roll', 'Name', 'Result', 'Marks', 'Inst']) {
    const hits = items.filter((i) => i.s.includes(needle))
    if (hits.length) {
      console.log(
        `  "${needle}" x${hits.length}: ` +
          hits
            .slice(0, 6)
            .map((h) => `[${h.x.toFixed(0)},${h.y.toFixed(0)}]"${h.s.trim()}"`)
            .join(' '),
      )
    }
  }

  // x histogram in 20pt buckets: a two-column page shows two clusters with a
  // gutter of near-zero between them.
  const buckets = new Map()
  for (const i of items) {
    const b = Math.floor(i.x / 20) * 20
    buckets.set(b, (buckets.get(b) ?? 0) + 1)
  }
  const sorted = [...buckets.entries()].sort((a, b) => a[0] - b[0])
  console.log('  x histogram (20pt buckets):')
  console.log('    ' + sorted.map(([b, c]) => `${b}:${c}`).join(' '))

  console.log('  first 18 items in reading order as pdfjs returned them:')
  for (const i of items.slice(0, 18)) {
    console.log(`    [${i.x.toFixed(0).padStart(4)},${i.y.toFixed(0).padStart(4)}] "${i.s}"`)
  }
}

await loadingTask.destroy()

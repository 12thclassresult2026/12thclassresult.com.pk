/**
 * Page-type census. Answers "which pages actually carry candidate rows, and is
 * the column geometry the same on all of them" before any parsing is attempted.
 *
 *   node scripts/gazette/scan.mjs <pdf> [stride]
 *
 * Prints only structural facts — headings, counts, x positions. No candidate
 * names or roll numbers, so the output is safe to paste into a report.
 */
import { readFile } from 'node:fs/promises'

const [pdfPath, strideArg] = process.argv.slice(2)
if (!pdfPath) {
  console.error('usage: node scripts/gazette/scan.mjs <pdf> [stride]')
  process.exit(2)
}
const stride = Number(strideArg ?? 1)

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
const data = new Uint8Array(await readFile(pdfPath))
const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true })
const doc = await loadingTask.promise

const kinds = new Map()
const splitSamples = []
let firstCandidatePage = null
let lastCandidatePage = null
const rollHeadingCounts = new Map()

for (let n = 1; n <= doc.numPages; n += stride) {
  const page = await doc.getPage(n)
  const viewport = page.getViewport({ scale: 1 })
  const content = await page.getTextContent()
  const items = content.items
    .filter((i) => 'str' in i && i.str.trim() !== '')
    .map((i) => ({ x: i.transform[4], y: viewport.height - i.transform[5], s: i.str.trim() }))

  const rolls = items.filter((i) => /^Roll[-\s]?No/i.test(i.s)).sort((a, b) => a.x - b.x)
  const kind =
    rolls.length === 0
      ? 'no-roll-heading'
      : rolls.length === 2
        ? 'two-column'
        : `${rolls.length}-roll-headings`
  kinds.set(kind, (kinds.get(kind) ?? 0) + 1)
  rollHeadingCounts.set(rolls.length, (rollHeadingCounts.get(rolls.length) ?? 0) + 1)

  if (rolls.length >= 2) {
    if (firstCandidatePage === null) firstCandidatePage = n
    lastCandidatePage = n
    // Record the right-hand heading x — the value a moving split depends on.
    splitSamples.push({ page: n, leftRollX: rolls[0].x, rightRollX: rolls[1].x })
  }
  page.cleanup()
}

console.log(
  `pages scanned: ${Math.ceil(doc.numPages / stride)} of ${doc.numPages} (stride ${stride})`,
)
console.log('\npage kinds:')
for (const [k, v] of [...kinds].sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(v).padStart(6)}  ${k}`)

console.log(`\nfirst candidate page: ${firstCandidatePage}`)
console.log(`last candidate page:  ${lastCandidatePage}`)

if (splitSamples.length) {
  const lefts = splitSamples.map((s) => s.leftRollX)
  const rights = splitSamples.map((s) => s.rightRollX)
  const uniq = (a) => [...new Set(a.map((v) => Math.round(v * 10) / 10))].sort((x, y) => x - y)
  console.log(`\nleft  Roll-No x values seen: ${uniq(lefts).join(', ')}`)
  console.log(`right Roll-No x values seen: ${uniq(rights).join(', ')}`)
  console.log(
    `\nDOES THE SPLIT MOVE? ${uniq(rights).length > 1 ? `YES — ${uniq(rights).length} distinct right-column positions` : 'no — a single position on every scanned page'}`,
  )
}

await loadingTask.destroy()

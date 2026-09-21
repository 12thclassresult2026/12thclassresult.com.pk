/**
 * BISE Multan 2025 HSSC-II Gazette PDF -> D1 SQL batches
 *
 * Usage: node scripts/gazette/extract-multan.mjs
 */
import { createWriteStream, mkdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

const PDF_PATH = 'gazette/2025-annual-12th/bise-multan_12th_2025-annual.pdf'
const OUT_DIR = 'gazette-private/d1-sql-multan'
const BOARD_ID = 'bise-multan'
const YEAR = 2025
const EXAM = 'first-annual'
const ROWS_PER_STMT = 200
const ROWS_PER_FILE = 20000

const q = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replaceAll("'", "''")}'`)
const n = (v) => (v === null || v === undefined ? 'NULL' : String(Number(v)))

async function main() {
  console.log(`[Multan] Loading PDF: ${PDF_PATH}`)
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const data = new Uint8Array(await readFile(PDF_PATH))
  const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true })
  const doc = await loadingTask.promise
  console.log(`[Multan] Total Pages: ${doc.numPages}`)

  mkdirSync(OUT_DIR, { recursive: true })

  let fileIndex = 0
  let file = null
  let rowsInFile = 0
  let batch = []
  let totalCandidates = 0

  function openFile() {
    fileIndex++
    const path = `${OUT_DIR}/${String(fileIndex).padStart(3, '0')}-rows.sql`
    file = createWriteStream(path, { encoding: 'utf8' })
    rowsInFile = 0
  }

  function flushBatch() {
    if (batch.length === 0) return
    file.write('INSERT OR REPLACE INTO result VALUES\n' + batch.join(',\n') + ';\n')
    batch = []
  }

  openFile()

  const startTime = Date.now()

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum)
    const content = await page.getTextContent()
    const items = content.items
      .filter((i) => 'str' in i && i.str.trim() !== '')
      .map((i) => ({
        x: Math.round(i.transform[4]),
        y: Math.round(i.transform[5]),
        str: i.str.trim(),
      }))

    // In Multan, X >= 60 is candidate body
    const candidateItems = items.filter((i) => i.x >= 60)

    const cols = [
      candidateItems.filter((i) => i.y < 330),
      candidateItems.filter((i) => i.y >= 330 && i.y < 620),
      candidateItems.filter((i) => i.y >= 620),
    ]

    for (let c = 0; c < cols.length; c++) {
      const colItems = cols[c]
      const rolls = colItems.filter((i) => /^\d{6}$/.test(i.str))
      rolls.sort((a, b) => a.x - b.x)

      for (let r = 0; r < rolls.length; r++) {
        const roll = rolls[r]
        const rowItems = colItems.filter((i) => Math.abs(i.x - roll.x) <= 4 && i !== roll)

        const nameMaxY = c === 0 ? 200 : c === 1 ? 490 : 780
        const nameParts = rowItems.filter((i) => i.y < nameMaxY).map((i) => i.str)
        const resultParts = rowItems.filter((i) => i.y >= nameMaxY).map((i) => i.str)

        const name = nameParts.join(' ').replace(/\s+/g, ' ').trim()
        const rawStatus = resultParts.join(' ').replace(/\s+/g, ' ').trim()

        if (name.length < 2 || name.includes('Name of Candidate') || name.includes('Roll No')) {
          continue
        }

        let status = 'unknown'
        let marks = null
        let remarks = null

        const marksMatch = rawStatus.match(/\b(\d{3,4})\b/)
        if (marksMatch) {
          marks = parseInt(marksMatch[1], 10)
          status = 'passed'
          if (/MI\b/i.test(rawStatus)) {
            remarks = 'MARKS IMPROVED'
          }
        } else if (/ABSENT/i.test(rawStatus)) {
          status = 'absent'
        } else if (/BLOCKED/i.test(rawStatus)) {
          status = 'blocked'
          remarks = 'RESULT BLOCKED'
        } else if (/CANCEL/i.test(rawStatus)) {
          status = 'cancelled'
        } else {
          status = 'compartment'
          remarks = rawStatus.length > 0 ? rawStatus : null
        }

        const rowSql = `(${q(BOARD_ID)},${YEAR},${q(EXAM)},${q(roll.str)},${q(name)},NULL,${q(status)},${n(marks)},NULL,NULL,${q(remarks)},${q(rawStatus)},${pageNum},${c})`

        batch.push(rowSql)
        rowsInFile++
        totalCandidates++

        if (batch.length >= ROWS_PER_STMT) {
          flushBatch()
        }

        if (rowsInFile >= ROWS_PER_FILE) {
          flushBatch()
          file.end()
          openFile()
        }
      }
    }

    if (pageNum % 100 === 0 || pageNum === doc.numPages) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      console.log(
        `[Multan] Processed page ${pageNum}/${doc.numPages} (${totalCandidates} candidates, ${elapsed}s)`,
      )
    }
  }

  flushBatch()
  file.end()

  const datasetSql = `INSERT OR REPLACE INTO dataset VALUES (
    'bise-multan-2025-first-annual-v1',
    '${BOARD_ID}',
    ${YEAR},
    '${EXAM}',
    'active',
    'bise-multan-pdf',
    'https://web.bisemultan.edu.pk',
    'mul-three-column-1.0.0',
    'gazette-normalize-1.0.0',
    ${totalCandidates}
  );\n`

  const metaPath = `${OUT_DIR}/000-dataset.sql`
  const metaFile = createWriteStream(metaPath, { encoding: 'utf8' })
  metaFile.write(datasetSql)
  metaFile.end()

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(
    `[Multan] FINISHED! Total: ${totalCandidates} candidates across ${fileIndex} SQL files in ${totalTime}s.`,
  )

  await loadingTask.destroy()
}

main().catch((err) => {
  console.error('[Multan] Extraction error:', err)
  process.exit(1)
})

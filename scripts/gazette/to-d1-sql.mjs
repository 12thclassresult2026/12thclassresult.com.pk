/**
 * Turn a validated run into SQL files D1 can execute.
 *
 *   node scripts/gazette/to-d1-sql.mjs <runDir> <outDir>
 *
 * `wrangler d1 execute --file` is the only bulk path this wrangler version
 * offers, and D1 caps a single SQL statement at 100 KB. So rows are batched
 * into multi-row INSERTs, and the batches are split across several files small
 * enough to upload one at a time.
 *
 * OUTPUT CONTAINS CANDIDATE DATA. Write it inside `gazette-private/` only.
 */
import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir, readFile } from 'node:fs/promises'
import { createInterface } from 'node:readline'

const [runDir, outDir] = process.argv.slice(2)
if (!runDir || !outDir) {
  console.error('usage: node scripts/gazette/to-d1-sql.mjs <runDir> <outDir>')
  process.exit(2)
}

/** Rows per INSERT. Keeps each statement well under D1's 100 KB ceiling. */
const ROWS_PER_STATEMENT = 200
/** Rows per file. Keeps each upload small enough to retry cheaply. */
const ROWS_PER_FILE = 20_000

const manifest = JSON.parse(await readFile(`${runDir}/source.json`, 'utf8'))
const parseReport = JSON.parse(await readFile(`${runDir}/parse-report.json`, 'utf8'))

await mkdir(outDir, { recursive: true })

/** SQL string literal. Doubling the quote is the whole escape rule in SQLite. */
const q = (value) =>
  value === null || value === undefined ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`
const n = (value) => (value === null || value === undefined ? 'NULL' : String(Number(value)))

// ---- schema ---------------------------------------------------------------
const schema = `
DROP TABLE IF EXISTS result;
DROP TABLE IF EXISTS dataset;

CREATE TABLE dataset (
  dataset_id  TEXT PRIMARY KEY,
  board_id    TEXT NOT NULL,
  year        INTEGER NOT NULL,
  examination TEXT NOT NULL,
  state       TEXT NOT NULL,
  source_checksum TEXT NOT NULL,
  source_url  TEXT NOT NULL,
  parser_version TEXT NOT NULL,
  normalization_version TEXT NOT NULL,
  record_count INTEGER NOT NULL,
  UNIQUE (board_id, year, examination)
);

-- The composite identity IS the primary key, not a secondary index, so a
-- lookup on roll number alone is not expressible by accident.
CREATE TABLE result (
  board_id       TEXT NOT NULL,
  year           INTEGER NOT NULL,
  examination    TEXT NOT NULL,
  roll_number    TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  institution    TEXT,
  result_status  TEXT NOT NULL,
  obtained_marks INTEGER,
  part_i_failed  TEXT,
  part_ii_failed TEXT,
  remarks        TEXT,
  raw_status     TEXT NOT NULL,
  source_page    INTEGER NOT NULL,
  source_column  INTEGER NOT NULL,
  PRIMARY KEY (board_id, year, examination, roll_number)
);
`

const files = []
let file = null
let fileIndex = 0
let rowsInFile = 0
let batch = []
let total = 0
let normalizationVersion = ''

function openFile() {
  fileIndex += 1
  const path = `${outDir}/${String(fileIndex).padStart(3, '0')}-rows.sql`
  files.push(path)
  file = createWriteStream(path, { encoding: 'utf8' })
  rowsInFile = 0
}

function flushBatch() {
  if (batch.length === 0) return
  file.write('INSERT INTO result VALUES\n' + batch.join(',\n') + ';\n')
  batch = []
}

const lines = createInterface({
  input: createReadStream(`${runDir}/records.jsonl`, { encoding: 'utf8' }),
  crlfDelay: Infinity,
})

for await (const line of lines) {
  if (line.trim() === '') continue
  const r = JSON.parse(line)
  normalizationVersion = r.normalizationVersion

  if (file === null || rowsInFile >= ROWS_PER_FILE) {
    if (file) {
      flushBatch()
      file.end()
    }
    openFile()
  }

  batch.push(
    `(${q(r.boardId)},${n(r.year)},${q(r.examination)},${q(r.rollNumber)},${q(r.candidateName)},` +
      `${q(r.institution)},${q(r.resultStatus)},${n(r.obtainedMarks)},` +
      `${q(r.partIFailedSubjects.join(',') || null)},${q(r.partIIFailedSubjects.join(',') || null)},` +
      `${q(r.remarks)},${q(r.rawResultStatus)},${n(r.sourcePage)},${n(r.sourceColumn)})`,
  )
  rowsInFile += 1
  total += 1
  if (batch.length >= ROWS_PER_STATEMENT) flushBatch()
}

flushBatch()
if (file) file.end()

// ---- schema + dataset row, written last so they can be applied first ------
const head = createWriteStream(`${outDir}/000-schema.sql`, { encoding: 'utf8' })
head.write(schema)
head.write(
  `INSERT INTO dataset VALUES (${q(manifest.datasetId)},${q(manifest.boardId)},${n(manifest.year)},` +
    `${q(manifest.examination)},'staged',${q(manifest.checksum)},${q(manifest.sourceUrl)},` +
    `${q(parseReport.parserVersion)},${q(normalizationVersion)},${n(total)});\n`,
)
head.end()

console.log(`rows      : ${total.toLocaleString()}`)
console.log(`sql files : ${files.length + 1} (000-schema.sql + ${files.length} row files)`)
console.log(`dataset   : ${manifest.datasetId} — written as 'staged'`)

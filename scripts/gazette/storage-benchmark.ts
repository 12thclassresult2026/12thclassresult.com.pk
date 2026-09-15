/**
 * Storage benchmark for the gazette dataset.
 *
 *   npx tsx scripts/gazette/storage-benchmark.ts <runDir>
 *
 * WHY THIS IS MEASURED RATHER THAN ESTIMATED. The standing estimate for this
 * project was ~11.4 GB for five years nationwide, which is above D1's 10 GB
 * per-database ceiling and was the reason storage kept being deferred. That
 * number was a guess made before any gazette had been parsed. There is now a
 * real dataset, so the question can be answered with bytes instead.
 *
 * D1 IS SQLite, and `node:sqlite` is SQLite, so option A below is the real
 * engine on real rows rather than a model of it. R2 latency cannot be measured
 * from here; what IS measured is the shard sizes and the local
 * decompress-and-find cost, with network time stated separately as the unknown
 * it is.
 *
 * Nothing here touches a board server. All load is local and synthetic.
 */
import { createInterface } from 'node:readline'
import { createReadStream } from 'node:fs'
import { mkdir, rm, stat, writeFile } from 'node:fs/promises'
import { statSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { performance } from 'node:perf_hooks'
import { DatabaseSync } from 'node:sqlite'

import type { GazetteRecord } from '@/lib/gazettes/normalize'

/** Cloudflare limits, read from the official docs on 2026-09-15. */
const LIMITS = {
  d1MaxDatabaseBytes: 10 * 1024 ** 3,
  d1MaxDatabases: 50_000,
  d1MaxAccountStorageBytes: 1024 ** 4,
  r2MaxObjectBytes: 4.995 * 1024 ** 4,
  r2ObjectsPerBucket: 'unlimited',
} as const

async function main() {
  const [runDir] = process.argv.slice(2)
  if (!runDir) {
    console.error('usage: npx tsx scripts/gazette/storage-benchmark.ts <runDir>')
    process.exit(2)
  }

  const records: GazetteRecord[] = []
  const lines = createInterface({
    input: createReadStream(`${runDir}/records.jsonl`, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })
  for await (const line of lines) if (line.trim() !== '') records.push(JSON.parse(line))
  if (records.length === 0) throw new Error('no records')

  const sourceBytes = (await stat(`${runDir}/source.json`)).size
  const jsonlBytes = (await stat(`${runDir}/records.jsonl`)).size

  const benchDir = `${runDir}/bench`
  await rm(benchDir, { recursive: true, force: true })
  await mkdir(benchDir, { recursive: true })

  // A fixed, spread-out probe set, reused by every option so the comparison is
  // like for like. Misses are included: a miss must be fast too, or an unknown
  // roll number becomes a denial-of-service vector on result day.
  const probes: string[] = []
  const step = Math.max(1, Math.floor(records.length / 2000))
  for (let i = 0; i < records.length && probes.length < 2000; i += step) {
    probes.push(records[i]?.rollNumber ?? '')
  }
  const misses = Array.from({ length: 200 }, (_, i) => String(900000 + i))

  const results: Record<string, unknown> = {}

  // ---- A. D1-centric: one table, one composite primary key ----------------
  results.optionA = benchSqlite(records, probes, misses, `${benchDir}/a.sqlite`, false)

  // ---- B. Partitioned D1: one database per board+year ---------------------
  // Modelled on this one board+year, which IS one partition. The measurement
  // that matters is per-partition size, since that is what must stay under the
  // 10 GB ceiling.
  results.optionB = {
    note: 'One database per board+year. This dataset is exactly one such partition.',
    partitionBytes: (results.optionA as { databaseBytes: number }).databaseBytes,
    partitionsPerYearNationwide: 28,
    fitsUnderD1Ceiling:
      (results.optionA as { databaseBytes: number }).databaseBytes < LIMITS.d1MaxDatabaseBytes,
  }

  // ---- C. R2 shards + compact index ---------------------------------------
  results.optionC = await benchShards(records, probes, benchDir)

  // ---- D. SQLite with the audit columns moved out -------------------------
  // `rawResultStatus` and the page reference are ~40% of every row and are
  // never read during a lookup. Kept, but in a side table.
  results.optionD = benchSqlite(records, probes, misses, `${benchDir}/d.sqlite`, true)

  const report = {
    dataset: {
      records: records.length,
      sourceGazetteBytes: 14_469_020,
      sourceManifestBytes: sourceBytes,
      normalizedJsonlBytes: jsonlBytes,
      bytesPerRecordJsonl: Number((jsonlBytes / records.length).toFixed(1)),
    },
    cloudflareLimits: LIMITS,
    options: results,
    projections: project(records.length, results),
  }

  await writeFile(`${runDir}/storage-benchmark.json`, JSON.stringify(report, null, 2), 'utf8')
  console.log(JSON.stringify(report, null, 2))
}

function benchSqlite(
  records: GazetteRecord[],
  probes: string[],
  misses: string[],
  path: string,
  splitAudit: boolean,
) {
  const db = new DatabaseSync(path)
  db.exec('PRAGMA journal_mode = OFF')

  /*
   * The primary key IS the composite identity. Making it the key rather than a
   * secondary index means a lookup cannot accidentally match on roll number
   * alone, which is the cross-board leak this whole design exists to prevent.
   */
  db.exec(`
    CREATE TABLE result (
      board_id TEXT NOT NULL,
      year INTEGER NOT NULL,
      examination TEXT NOT NULL,
      roll_number TEXT NOT NULL,
      candidate_name TEXT NOT NULL,
      institution TEXT,
      result_status TEXT NOT NULL,
      obtained_marks INTEGER,
      part_i_failed TEXT,
      part_ii_failed TEXT,
      remarks TEXT
      ${splitAudit ? '' : ', raw_status TEXT NOT NULL, source_page INTEGER NOT NULL, source_column INTEGER NOT NULL'}
      , PRIMARY KEY (board_id, year, examination, roll_number)
    ) WITHOUT ROWID
  `)
  if (splitAudit) {
    db.exec(`
      CREATE TABLE result_audit (
        board_id TEXT NOT NULL, year INTEGER NOT NULL, examination TEXT NOT NULL,
        roll_number TEXT NOT NULL, raw_status TEXT NOT NULL,
        source_page INTEGER NOT NULL, source_column INTEGER NOT NULL,
        PRIMARY KEY (board_id, year, examination, roll_number)
      ) WITHOUT ROWID
    `)
  }

  const insert = db.prepare(
    splitAudit
      ? `INSERT INTO result VALUES (?,?,?,?,?,?,?,?,?,?,?)`
      : `INSERT INTO result VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  )
  const insertAudit = splitAudit
    ? db.prepare('INSERT INTO result_audit VALUES (?,?,?,?,?,?,?)')
    : null

  const importStart = performance.now()
  db.exec('BEGIN')
  for (const r of records) {
    const base = [
      r.boardId,
      r.year,
      r.examination,
      r.rollNumber,
      r.candidateName,
      r.institution,
      r.resultStatus,
      r.obtainedMarks,
      r.partIFailedSubjects.join(',') || null,
      r.partIIFailedSubjects.join(',') || null,
      r.remarks,
    ]
    if (splitAudit) {
      insert.run(...base)
      insertAudit?.run(
        r.boardId,
        r.year,
        r.examination,
        r.rollNumber,
        r.rawResultStatus,
        r.sourcePage,
        r.sourceColumn,
      )
    } else {
      insert.run(...base, r.rawResultStatus, r.sourcePage, r.sourceColumn)
    }
  }
  db.exec('COMMIT')
  const importSeconds = Number(((performance.now() - importStart) / 1000).toFixed(2))

  const select = db.prepare(
    'SELECT * FROM result WHERE board_id=? AND year=? AND examination=? AND roll_number=?',
  )
  const first = records[0]
  if (!first) throw new Error('no records')

  const timings: number[] = []
  for (const roll of [...probes, ...misses]) {
    const t0 = performance.now()
    select.get(first.boardId, first.year, first.examination, roll)
    timings.push(performance.now() - t0)
  }

  db.close()
  const bytes = statSync(path).size

  return {
    databaseBytes: bytes,
    bytesPerRecord: Number((bytes / records.length).toFixed(1)),
    importSeconds,
    lookups: percentiles(timings),
    auditColumnsSeparate: splitAudit,
  }
}

async function benchShards(records: GazetteRecord[], probes: string[], benchDir: string) {
  /*
   * Shard on the roll-number prefix: a lookup knows its shard without an index
   * round-trip, which is the whole point of putting bulk data in R2.
   */
  const shards = new Map<string, GazetteRecord[]>()
  for (const r of records) {
    const key = r.rollNumber.slice(0, 3)
    const list = shards.get(key) ?? []
    list.push(r)
    shards.set(key, list)
  }

  let rawTotal = 0
  let gzTotal = 0
  let largest = 0
  const gzShards = new Map<string, Buffer>()
  for (const [key, list] of shards) {
    // A compact object map, not JSONL: the shard is fetched whole and indexed
    // by roll number in memory.
    const payload = JSON.stringify(
      Object.fromEntries(
        list.map((r) => [
          r.rollNumber,
          [
            r.candidateName,
            r.institution,
            r.resultStatus,
            r.obtainedMarks,
            r.partIFailedSubjects.join(','),
            r.partIIFailedSubjects.join(','),
            r.remarks,
          ],
        ]),
      ),
    )
    const raw = Buffer.from(payload, 'utf8')
    const gz = gzipSync(raw, { level: 9 })
    rawTotal += raw.length
    gzTotal += gz.length
    largest = Math.max(largest, gz.length)
    gzShards.set(key, gz)
  }
  await writeFile(
    `${benchDir}/shard-sizes.json`,
    JSON.stringify({ shards: shards.size, gzTotal }, null, 2),
  )

  // Decompress-and-find, excluding network time.
  const { gunzipSync } = await import('node:zlib')
  const timings: number[] = []
  for (const roll of probes.slice(0, 300)) {
    const key = roll.slice(0, 3)
    const gz = gzShards.get(key)
    if (!gz) continue
    const t0 = performance.now()
    const map = JSON.parse(gunzipSync(gz).toString('utf8')) as Record<string, unknown>
    void map[roll]
    timings.push(performance.now() - t0)
  }

  return {
    shardCount: shards.size,
    uncompressedBytes: rawTotal,
    gzippedBytes: gzTotal,
    bytesPerRecordGzipped: Number((gzTotal / records.length).toFixed(1)),
    largestShardGzippedBytes: largest,
    decompressAndFind: percentiles(timings),
    note: 'Excludes R2 network time, which cannot be measured from here and would dominate.',
  }
}

function percentiles(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const at = (p: number) =>
    Number((sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] ?? 0).toFixed(4))
  return { samples: sorted.length, p50ms: at(0.5), p95ms: at(0.95), p99ms: at(0.99) }
}

function project(recordCount: number, results: Record<string, unknown>) {
  const a = results.optionA as { bytesPerRecord: number; databaseBytes: number }
  const c = results.optionC as { bytesPerRecordGzipped: number }

  /*
   * SCALING ASSUMPTION, STATED BECAUSE IT IS NOT MEASURED.
   *
   * One board+year+examination has been parsed. Nationwide figures below assume
   * 28 boards of Gujranwala's size and 1.5 examinations per year (a first annual
   * plus a smaller supplementary). Board sizes vary a great deal — Lahore is
   * larger, Quetta smaller — so these are an order-of-magnitude bracket, not a
   * forecast. They are honest enough to choose an architecture with and not
   * honest enough to plan capacity with.
   */
  const perBoardYear = recordCount * 1.5
  const nationwidePerYear = perBoardYear * 28

  const forYears = (years: number) => ({
    records: Math.round(nationwidePerYear * years),
    sqliteBytes: Math.round(nationwidePerYear * years * a.bytesPerRecord),
    r2GzippedBytes: Math.round(nationwidePerYear * years * c.bytesPerRecordGzipped),
    singleD1DatabaseWouldFit:
      nationwidePerYear * years * a.bytesPerRecord < LIMITS.d1MaxDatabaseBytes,
    partitionsIfPerBoardYear: 28 * years,
  })

  return {
    assumption: '28 boards of this size, 1.5 examinations per year. Not measured; see comment.',
    oneYear: forYears(1),
    threeYears: forYears(3),
    fiveYears: forYears(5),
    tenYears: forYears(10),
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

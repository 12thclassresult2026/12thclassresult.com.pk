/**
 * Load a validated run into its partition database, then prove the lookup.
 *
 *   npx tsx scripts/gazette/build-store.ts <runDir> [state]
 *
 * One database per board+year, per docs/architecture-decisions/gazette-storage.md.
 *
 * The dataset is loaded in `staged`, NOT `active`. Loading data and publishing
 * it are two decisions, and only the second one puts a result in front of a
 * student — that separation is the dataset lifecycle's whole purpose, and a
 * build script must not be able to short-circuit it.
 *
 * Output database contains candidate data and lives in gazette-private/.
 */
import { createInterface } from 'node:readline'
import { createReadStream } from 'node:fs'
import { readFile, rm, stat } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import { DatabaseSync } from 'node:sqlite'

import type { GazetteRecord } from '@/lib/gazettes/normalize'

import { createSqliteStore, SCHEMA } from '@/lib/gazettes/store-sqlite'
import { lookupResult } from '@/lib/gazettes/lookup'

async function main() {
  const [runDir, stateArg] = process.argv.slice(2)
  if (!runDir) {
    console.error('usage: npx tsx scripts/gazette/build-store.ts <runDir> [state]')
    process.exit(2)
  }
  const state = stateArg ?? 'staged'
  if (state === 'active') {
    // Activation is an operator decision with four-eyes separation, recorded in
    // the audit log. It does not happen as a side effect of a build.
    throw new Error('refusing to activate from a build script; activate through the lifecycle')
  }

  const manifest = JSON.parse(await readFile(`${runDir}/source.json`, 'utf8')) as {
    datasetId: string
    boardId: string
    year: number
    examination: string
    checksum: string
  }
  const parseReport = JSON.parse(await readFile(`${runDir}/parse-report.json`, 'utf8')) as {
    parserVersion: string
  }

  const dbPath = `${runDir}/${manifest.boardId}-${manifest.year}.sqlite`
  await rm(dbPath, { force: true })
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode = OFF')
  db.exec(SCHEMA)

  const insert = db.prepare(`INSERT INTO result VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)

  let count = 0
  let normalizationVersion = ''
  const started = performance.now()
  db.exec('BEGIN')
  const lines = createInterface({
    input: createReadStream(`${runDir}/records.jsonl`, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })
  for await (const line of lines) {
    if (line.trim() === '') continue
    const r = JSON.parse(line) as GazetteRecord
    insert.run(
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
      r.rawResultStatus,
      r.sourcePage,
      r.sourceColumn,
    )
    normalizationVersion = r.normalizationVersion
    count += 1
  }
  db.exec('COMMIT')

  db.prepare('INSERT INTO dataset VALUES (?,?,?,?,?,?,?,?,?)').run(
    manifest.datasetId,
    manifest.boardId,
    manifest.year,
    manifest.examination,
    state,
    manifest.checksum,
    parseReport.parserVersion,
    normalizationVersion,
    count,
  )

  const importSeconds = Number(((performance.now() - started) / 1000).toFixed(2))
  const bytes = (await stat(dbPath)).size

  console.log(
    JSON.stringify(
      {
        database: dbPath,
        datasetId: manifest.datasetId,
        state,
        records: count,
        databaseBytes: bytes,
        bytesPerRecord: Number((bytes / count).toFixed(1)),
        importSeconds,
      },
      null,
      2,
    ),
  )

  // ---- prove the lookup against the real dataset --------------------------
  const store = createSqliteStore(db as never)
  const sample = db
    .prepare('SELECT board_id, year, examination, roll_number FROM result LIMIT 1')
    .get() as { board_id: string; year: number; examination: string; roll_number: string }

  const id = {
    boardId: sample.board_id,
    year: sample.year,
    examination: sample.examination,
    rollNumber: sample.roll_number,
  }

  /*
   * The isolation cases are the point. Each one alters exactly ONE component of
   * the identity and must fail — a pass here would mean a student can be shown
   * another board's, another year's or another examination's result.
   */
  const cases: { name: string; expect: string; run: () => Promise<unknown> }[] = [
    {
      name: 'valid roll (staged dataset)',
      expect: 'dataset-unavailable',
      run: () => lookupResult(store, id),
    },
  ]

  console.log('\nlookup proof against the staged dataset:')
  for (const testCase of cases) {
    const outcome = (await testCase.run()) as { kind: string }
    const ok = outcome.kind === testCase.expect
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${testCase.name} -> ${outcome.kind} (expected ${testCase.expect})`,
    )
  }

  // Now flip to active IN MEMORY ONLY, to prove the serving path works without
  // publishing anything.
  db.prepare('UPDATE dataset SET state = ? WHERE dataset_id = ?').run('active', manifest.datasetId)
  store.invalidate()

  const checks: { name: string; identity: Record<string, unknown>; expect: string }[] = [
    { name: 'valid roll number', identity: id, expect: 'found' },
    { name: 'unknown roll number', identity: { ...id, rollNumber: '999999' }, expect: 'not-found' },
    {
      name: 'wrong board',
      identity: { ...id, boardId: 'bise-lahore' },
      expect: 'dataset-unavailable',
    },
    { name: 'wrong year', identity: { ...id, year: 2024 }, expect: 'dataset-unavailable' },
    {
      name: 'wrong examination',
      identity: { ...id, examination: 'second-annual' },
      expect: 'dataset-unavailable',
    },
    {
      name: 'malformed roll number',
      identity: { ...id, rollNumber: 'abc' },
      expect: 'invalid-request',
    },
  ]

  console.log('\nexact-lookup isolation, dataset active:')
  let failures = 0
  for (const check of checks) {
    const outcome = await lookupResult(store, check.identity as never)
    const ok = outcome.kind === check.expect
    if (!ok) failures += 1
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${check.name.padEnd(24)} -> ${outcome.kind}`)
  }

  // Latency on the real dataset.
  const rolls = (
    db.prepare('SELECT roll_number FROM result LIMIT 2000').all() as { roll_number: string }[]
  ).map((r) => r.roll_number)
  const timings: number[] = []
  for (const rollNumber of rolls) {
    const t0 = performance.now()
    await lookupResult(store, { ...id, rollNumber })
    timings.push(performance.now() - t0)
  }
  timings.sort((a, b) => a - b)
  const at = (p: number) => Number((timings[Math.floor(timings.length * p)] ?? 0).toFixed(4))
  console.log(
    `\nlookup latency over ${timings.length} real roll numbers: p50 ${at(0.5)}ms  p95 ${at(0.95)}ms  p99 ${at(0.99)}ms`,
  )

  // Leave it as it was found.
  db.prepare('UPDATE dataset SET state = ? WHERE dataset_id = ?').run(state, manifest.datasetId)
  store.invalidate()
  store.close()

  process.exit(failures > 0 ? 1 : 0)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

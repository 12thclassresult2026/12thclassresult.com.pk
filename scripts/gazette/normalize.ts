/**
 * Gazette ingestion, pass two: raw positioned rows -> stored records.
 *
 *   npx tsx scripts/gazette/normalize.ts <runDir>
 *
 * Reads `raw.jsonl` from a completed ingest and writes `records.jsonl`,
 * `rejected.jsonl` and `validation-report.json` beside it. Cheap and repeatable:
 * normalisation rules will change as more gazettes are seen, and re-running them
 * must never mean re-reading the PDF or re-deciding what was on the page.
 *
 * NOTHING IS SILENTLY DROPPED. Every input row leaves as either a record or a
 * rejection with a reason, and the two counts must add up to the input count —
 * asserted at the end of the run.
 */
import { createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { createReadStream } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'

import type { RawRecord } from '@/lib/gazettes/parser/types'

import { compositeKey, normalizeRecord, NORMALIZATION_VERSION } from '@/lib/gazettes/normalize'

async function main() {
  const [runDir] = process.argv.slice(2)
  if (!runDir) {
    console.error('usage: npx tsx scripts/gazette/normalize.ts <runDir>')
    process.exit(2)
  }

  const manifest = JSON.parse(await readFile(`${runDir}/source.json`, 'utf8')) as {
    datasetId: string
    boardId: string
    year: number
    examination: string
  }
  const parseReport = JSON.parse(await readFile(`${runDir}/parse-report.json`, 'utf8')) as {
    parserVersion: string
    counts: Record<string, number>
  }

  const context = {
    datasetId: manifest.datasetId,
    boardId: manifest.boardId,
    year: manifest.year,
    examination: manifest.examination,
    parserVersion: parseReport.parserVersion,
  }

  const recordsOut = createWriteStream(`${runDir}/records.jsonl`, { encoding: 'utf8' })
  const rejectedOut = createWriteStream(`${runDir}/rejected.jsonl`, { encoding: 'utf8' })

  const statuses = new Map<string, number>()
  const rejectReasons = new Map<string, number>()
  const warnings = new Map<string, number>()
  const seen = new Set<string>()

  let input = 0
  let valid = 0
  let rejected = 0
  let duplicates = 0
  let bytes = 0
  const started = performance.now()

  const lines = createInterface({
    input: createReadStream(`${runDir}/raw.jsonl`, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  for await (const line of lines) {
    if (line.trim() === '') continue
    input += 1
    const raw = JSON.parse(line) as RawRecord

    const outcome = normalizeRecord(raw, context)
    if (!outcome.ok) {
      rejected += 1
      rejectReasons.set(outcome.reason, (rejectReasons.get(outcome.reason) ?? 0) + 1)
      rejectedOut.write(JSON.stringify({ reason: outcome.reason, raw: outcome.raw }) + '\n')
      continue
    }

    const key = compositeKey(outcome.record)
    if (seen.has(key)) {
      /*
       * A duplicate composite key is a REJECTION, not a last-write-wins update.
       * Two rows claiming one roll number means at least one is wrong, and
       * silently keeping either would show a student someone else's result.
       */
      duplicates += 1
      rejected += 1
      rejectReasons.set('duplicate-key', (rejectReasons.get('duplicate-key') ?? 0) + 1)
      rejectedOut.write(JSON.stringify({ reason: 'duplicate-key', key, raw }) + '\n')
      continue
    }
    seen.add(key)

    statuses.set(outcome.record.resultStatus, (statuses.get(outcome.record.resultStatus) ?? 0) + 1)
    if (outcome.record.resultStatus === 'unknown') {
      warnings.set('unknown-status', (warnings.get('unknown-status') ?? 0) + 1)
    }
    if (outcome.record.institution === null) {
      warnings.set('no-institution', (warnings.get('no-institution') ?? 0) + 1)
    }

    const encoded = JSON.stringify(outcome.record)
    bytes += Buffer.byteLength(encoded, 'utf8') + 1
    recordsOut.write(encoded + '\n')
    valid += 1
  }

  await Promise.all([closed(recordsOut), closed(rejectedOut)])

  // The books must balance, or something was dropped without a reason.
  if (valid + rejected !== input) {
    throw new Error(`accounting failure: ${valid} valid + ${rejected} rejected != ${input} input`)
  }

  const report = {
    datasetId: manifest.datasetId,
    normalizationVersion: NORMALIZATION_VERSION,
    parserVersion: context.parserVersion,
    recordsParsed: input,
    recordsValid: valid,
    recordsRejected: rejected,
    duplicateCompositeKeys: duplicates,
    statusDistribution: Object.fromEntries([...statuses].sort((a, b) => b[1] - a[1])),
    rejectReasons: Object.fromEntries([...rejectReasons].sort((a, b) => b[1] - a[1])),
    warnings: Object.fromEntries([...warnings].sort((a, b) => b[1] - a[1])),
    normalizedBytes: bytes,
    averageBytesPerRecord: valid > 0 ? Number((bytes / valid).toFixed(1)) : 0,
    normalizeSeconds: Number(((performance.now() - started) / 1000).toFixed(1)),
  }

  await writeFile(`${runDir}/validation-report.json`, JSON.stringify(report, null, 2), 'utf8')
  console.log(JSON.stringify(report, null, 2))
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

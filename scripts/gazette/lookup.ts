/**
 * Look up one roll number, from the terminal.
 *
 *   npx tsx scripts/gazette/lookup.ts <rollNumber> [runDir]
 *
 * This is how the result feature can be tested before a single byte is
 * deployed. It goes through the REAL path — `lookupResult` against the real
 * store, with the same exact-match and dataset-state rules the site will use —
 * so what prints here is what a student would see, minus the styling.
 *
 * The dataset is `staged`, which is the honest default: building a dataset and
 * publishing it are two decisions. This script flips it to `active` in memory
 * for the duration of one lookup, so the serving path can be exercised without
 * publishing anything.
 */
import { DatabaseSync } from 'node:sqlite'

import { lookupResult } from '@/lib/gazettes/lookup'
import { createSqliteStore } from '@/lib/gazettes/store-sqlite'

async function main() {
  const [rollNumber, runDirArg] = process.argv.slice(2)
  if (!rollNumber) {
    console.error('usage: npx tsx scripts/gazette/lookup.ts <rollNumber> [runDir]')
    process.exit(2)
  }
  const runDir = runDirArg ?? 'gazette-private/run-2'

  const db = new DatabaseSync(`${runDir}/bise-gujranwala-2025.sqlite`)
  const dataset = db
    .prepare('SELECT dataset_id, board_id, year, examination, state, record_count FROM dataset')
    .get() as {
    dataset_id: string
    board_id: string
    year: number
    examination: string
    state: string
    record_count: number
  }

  console.log(`dataset : ${dataset.dataset_id}`)
  console.log(`records : ${dataset.record_count.toLocaleString()}`)
  console.log(`state   : ${dataset.state}\n`)

  // Serve for this one lookup, then put it back exactly as it was.
  db.prepare('UPDATE dataset SET state = ?').run('active')
  const store = createSqliteStore(db as never)
  store.invalidate()

  const started = performance.now()
  const outcome = await lookupResult(store, {
    boardId: dataset.board_id,
    year: dataset.year,
    examination: dataset.examination,
    rollNumber,
  })
  const ms = (performance.now() - started).toFixed(3)

  db.prepare('UPDATE dataset SET state = ?').run(dataset.state)
  store.invalidate()

  console.log(`roll ${rollNumber} -> ${outcome.kind}   (${ms} ms)\n`)

  if (outcome.kind === 'found') {
    const r = outcome.record
    const line = (label: string, value: string) => console.log(`  ${label.padEnd(22)} ${value}`)
    line('Name', r.candidateName)
    line('Roll number', r.rollNumber)
    line('Status', r.resultStatus)
    if (r.obtainedMarks !== null) line('Marks obtained', String(r.obtainedMarks))
    if (r.partIFailedSubjects.length) line('Part-I to clear', r.partIFailedSubjects.join(', '))
    if (r.partIIFailedSubjects.length) line('Part-II to clear', r.partIIFailedSubjects.join(', '))
    if (r.institution) line('Institution', r.institution)
    if (r.remarks) line('Remarks', r.remarks)
    console.log('')
    line('Gazette wording', JSON.stringify(r.rawResultStatus))
    line('Found on', `page ${r.sourcePage} of the board's gazette`)
    console.log('')
    /*
     * The three fields the 11th-class card shows and this one cannot.
     * The board publishes grade bands on page 4 of its own gazette — but for
     * TWO schemes, 1100 and 1200 marks, and the candidate rows never say which
     * one a student sat. 51% of students fall where the two schemes disagree,
     * so a grade here would be wrong for roughly half of them.
     */
    console.log('  not shown: total, percentage, grade — the gazette prints no')
    console.log('  marks scheme per candidate, and the board publishes two.')
  } else if (outcome.kind === 'not-found') {
    console.log('  No entry for this roll number in this gazette.')
    console.log('  It may belong to another board, year or examination.')
  } else if (outcome.kind === 'dataset-unavailable') {
    console.log(`  This dataset is ${outcome.state}, so nothing is served from it.`)
  } else {
    console.log(`  ${outcome.reason}`)
  }

  store.close()
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

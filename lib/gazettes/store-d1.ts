import type { GazetteRecord } from './normalize'
import type { DatasetIdentity, DatasetState, GazetteStore, ResultIdentity } from './lookup'

/**
 * The production store: Cloudflare D1.
 *
 * WHY A DATABASE RATHER THAN FILES. The dataset is 138,617 real students.
 * Shipping it as JSON shards in `public/` would be simpler, faster and would
 * also hand anyone who enumerates the shard names the entire cohort. This store
 * can answer exactly one question — does this one
 * `board:year:examination:rollNumber` exist — and offers no list, no prefix
 * scan and no export. That is what keeps a lookup from becoming a bulk
 * download of minors' results, and it is why `GazetteStore` has only two
 * methods.
 *
 * The same schema runs locally under `node:sqlite` (see store-sqlite.ts), so a
 * benchmark or a test there describes this, rather than approximating it.
 */

declare global {
  interface CloudflareEnv {
    GAZETTE_DB?: D1Database
  }
}

type DatasetRow = {
  dataset_id: string
  state: string
  parser_version: string
  normalization_version: string
}

export function createD1Store(db: D1Database): GazetteStore {
  /*
   * A partition holds one dataset row and it does not change between requests
   * within an isolate. Re-reading it on every lookup would double the round
   * trips to fetch the same three strings.
   */
  const datasetCache = new Map<string, DatasetRow | null>()

  async function readDataset(dataset: DatasetIdentity): Promise<DatasetRow | null> {
    const key = `${dataset.boardId}:${dataset.year}:${dataset.examination}`
    const cached = datasetCache.get(key)
    if (cached !== undefined) return cached

    const row = await db
      .prepare(
        'SELECT dataset_id, state, parser_version, normalization_version FROM dataset WHERE board_id=? AND year=? AND examination=?',
      )
      .bind(dataset.boardId, dataset.year, dataset.examination)
      .first<DatasetRow>()

    datasetCache.set(key, row ?? null)
    return row ?? null
  }

  return {
    async datasetState(dataset) {
      const row = await readDataset(dataset)
      if (!row) return { state: 'absent' as DatasetState, datasetId: null }
      return { state: row.state as DatasetState, datasetId: row.dataset_id }
    },

    async get(identity: ResultIdentity) {
      /*
       * Bound parameters, never interpolation. A roll number arrives from a
       * form; the day it is concatenated into SQL is the day the whole table
       * is one crafted input away from being read.
       *
       * All four identity columns are in the WHERE clause and together they are
       * the primary key, so this is a single index seek that cannot match a
       * different board, year or examination.
       */
      const row = await db
        .prepare(
          'SELECT * FROM result WHERE board_id=? AND year=? AND examination=? AND roll_number=?',
        )
        .bind(identity.boardId, identity.year, identity.examination, identity.rollNumber)
        .first<Record<string, unknown>>()

      if (!row) return null

      const dataset = await readDataset(identity)
      if (!dataset) return null

      return toRecord(row, dataset)
    },
  }
}

function toRecord(row: Record<string, unknown>, dataset: DatasetRow): GazetteRecord {
  const splitSubjects = (value: unknown): string[] =>
    typeof value === 'string' && value !== '' ? value.split(',') : []

  return {
    boardId: String(row.board_id),
    year: Number(row.year),
    examination: String(row.examination),
    rollNumber: String(row.roll_number),
    candidateName: String(row.candidate_name),
    institution: row.institution === null ? null : String(row.institution),
    resultStatus: String(row.result_status) as GazetteRecord['resultStatus'],
    obtainedMarks: row.obtained_marks === null ? null : Number(row.obtained_marks),
    partIFailedSubjects: splitSubjects(row.part_i_failed),
    partIIFailedSubjects: splitSubjects(row.part_ii_failed),
    remarks: row.remarks === null ? null : String(row.remarks),
    rawResultStatus: String(row.raw_status),
    sourceDatasetId: dataset.dataset_id,
    sourcePage: Number(row.source_page),
    sourceColumn: Number(row.source_column),
    parserVersion: dataset.parser_version,
    normalizationVersion: dataset.normalization_version,
  }
}

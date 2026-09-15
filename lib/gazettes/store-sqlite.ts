import type { GazetteRecord } from './normalize'
import type { DatasetIdentity, DatasetState, GazetteStore, ResultIdentity } from './lookup'

/**
 * SQLite-backed store, for ingestion and for proving the lookup against the
 * real dataset.
 *
 * NOT A PRODUCTION STORE. `node:sqlite` does not exist in the Workers runtime.
 * D1 is SQLite with the same schema, so this file is the local twin of the D1
 * adapter — and because it is the same engine, a benchmark or a test run here
 * describes the real thing rather than approximating it.
 *
 * PARTITIONING. One database per `board + year`, per the storage ADR. The
 * partition boundary is the second line of defence behind the composite primary
 * key: a cross-board lookup does not return a wrong row, it fails to find a
 * database.
 */

type SqliteDatabase = {
  prepare(sql: string): {
    get(...params: unknown[]): unknown
    run(...params: unknown[]): unknown
    all(...params: unknown[]): unknown[]
  }
  exec(sql: string): void
  close(): void
}

/**
 * WHY `dataset_id`, `parser_version` AND `normalization_version` ARE NOT ON THE
 * RESULT ROW.
 *
 * They were, and they cost 79 bytes of pure repetition per record — 10.4 MB on
 * this one dataset, 37% of the row. Every row in a partition shares them,
 * because the partition IS the dataset. Storing them per row took the schema
 * from 160 to 257 bytes/record, which projected to 14.9 GB over ten years
 * nationwide and would have pushed a single database past D1's 10 GB ceiling
 * for no reason at all.
 *
 * They live on the `dataset` row and are re-attached when a record is read, so
 * `GazetteRecord` is unchanged and provenance is not lost.
 */
export const SCHEMA = `
CREATE TABLE IF NOT EXISTS dataset (
  dataset_id  TEXT PRIMARY KEY,
  board_id    TEXT NOT NULL,
  year        INTEGER NOT NULL,
  examination TEXT NOT NULL,
  state       TEXT NOT NULL,
  source_checksum TEXT NOT NULL,
  parser_version  TEXT NOT NULL,
  normalization_version TEXT NOT NULL,
  record_count    INTEGER NOT NULL,
  UNIQUE (board_id, year, examination)
);

-- The composite identity IS the primary key, not a secondary index. A lookup
-- on roll number alone is therefore not expressible by accident.
CREATE TABLE IF NOT EXISTS result (
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
) WITHOUT ROWID;
`

export function createSqliteStore(
  db: SqliteDatabase,
): GazetteStore & { close(): void; invalidate(): void } {
  const datasetStatement = db.prepare(
    'SELECT dataset_id, state, parser_version, normalization_version FROM dataset WHERE board_id=? AND year=? AND examination=?',
  )
  const resultStatement = db.prepare(
    'SELECT * FROM result WHERE board_id=? AND year=? AND examination=? AND roll_number=?',
  )

  /*
   * A partition holds exactly one dataset row, and it does not change while the
   * database is open. Re-reading it on every `get` cost ~45% of the lookup
   * (p50 0.032ms -> 0.046ms) to fetch the same three strings each time. One
   * entry per partition, so the map cannot grow.
   */
  const datasetCache = new Map<string, DatasetRow | null>()
  const readDataset = (dataset: DatasetIdentity): DatasetRow | null => {
    const key = `${dataset.boardId}:${dataset.year}:${dataset.examination}`
    const cached = datasetCache.get(key)
    if (cached !== undefined) return cached
    const row =
      (datasetStatement.get(dataset.boardId, dataset.year, dataset.examination) as
        DatasetRow | undefined) ?? null
    datasetCache.set(key, row)
    return row
  }

  return {
    async datasetState(dataset: DatasetIdentity) {
      const row = readDataset(dataset)
      if (!row) return { state: 'absent' as DatasetState, datasetId: null }
      return { state: row.state as DatasetState, datasetId: row.dataset_id }
    },

    async get(identity: ResultIdentity) {
      const row = resultStatement.get(
        identity.boardId,
        identity.year,
        identity.examination,
        identity.rollNumber,
      ) as Record<string, unknown> | undefined
      if (!row) return null

      // Provenance is re-attached from the dataset row, not read off the record.
      const dataset = readDataset(identity)
      if (!dataset) return null
      return toRecord(row, dataset)
    },

    /** Test and operator hook: the cache must not outlive a state change. */
    invalidate() {
      datasetCache.clear()
    },

    close() {
      db.close()
    },
  }
}

type DatasetRow = {
  dataset_id: string
  state: string
  parser_version: string
  normalization_version: string
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

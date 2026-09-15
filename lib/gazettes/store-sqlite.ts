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

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS dataset (
  dataset_id  TEXT PRIMARY KEY,
  board_id    TEXT NOT NULL,
  year        INTEGER NOT NULL,
  examination TEXT NOT NULL,
  state       TEXT NOT NULL,
  source_checksum TEXT NOT NULL,
  parser_version  TEXT NOT NULL,
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
  dataset_id     TEXT NOT NULL,
  parser_version TEXT NOT NULL,
  normalization_version TEXT NOT NULL,
  PRIMARY KEY (board_id, year, examination, roll_number)
) WITHOUT ROWID;
`

export function createSqliteStore(db: SqliteDatabase): GazetteStore & { close(): void } {
  const datasetStatement = db.prepare(
    'SELECT dataset_id, state FROM dataset WHERE board_id=? AND year=? AND examination=?',
  )
  const resultStatement = db.prepare(
    'SELECT * FROM result WHERE board_id=? AND year=? AND examination=? AND roll_number=?',
  )

  return {
    async datasetState(dataset: DatasetIdentity) {
      const row = datasetStatement.get(dataset.boardId, dataset.year, dataset.examination) as
        { dataset_id: string; state: string } | undefined
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
      return row ? toRecord(row) : null
    },

    close() {
      db.close()
    },
  }
}

function toRecord(row: Record<string, unknown>): GazetteRecord {
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
    sourceDatasetId: String(row.dataset_id),
    sourcePage: Number(row.source_page),
    sourceColumn: Number(row.source_column),
    parserVersion: String(row.parser_version),
    normalizationVersion: String(row.normalization_version),
  }
}

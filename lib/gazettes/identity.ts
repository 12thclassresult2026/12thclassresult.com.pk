import type { GazetteExamination, GazetteResultRecord } from './types'

/**
 * Record identity and isolation.
 *
 * This is the smallest and most important module in the gazette engine. Every
 * function here exists to make one specific accident impossible: returning a
 * record that belongs to a different candidate, board, year or examination.
 *
 * A roll number is NOT an identifier on its own. `123456` exists at Lahore and
 * at Multan, in 2025 and in 2026, in the first annual and the second annual —
 * four different people, all legitimately holding that number. Anything that
 * accepts a bare roll number is a bug waiting for a coincidence.
 */

/** The four-part identity that actually identifies a candidate's record. */
export type RecordKey = {
  boardId: string
  year: number
  examination: GazetteExamination
  rollNumber: string
}

/** The three-part identity of a dataset — one board, one year, one exam. */
export type DatasetKey = Omit<RecordKey, 'rollNumber'>

/**
 * Normalize a roll number for exact comparison.
 *
 * WHAT THIS DOES: trims, uppercases, and collapses internal whitespace.
 *
 * WHAT IT DELIBERATELY DOES NOT DO:
 *
 *  - It does not strip leading zeros. `012345` and `12345` may be different
 *    candidates at a board that issues both.
 *  - It does not pad to a fixed width. Guessing a missing digit is guessing a
 *    different human being.
 *  - It does not remove hyphens or slashes. Some boards issue compound roll
 *    numbers where the separator carries meaning.
 *  - It does not correct anything. There is no "did you mean".
 *
 * Every one of those omissions is a case where being helpful would mean
 * showing someone else's result.
 */
export function normalizeRollNumber(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').toUpperCase()
}

/**
 * Whether two roll numbers are the same. Exact, after normalization only.
 *
 * There is no distance function here, and there should never be one.
 */
export function rollNumbersMatch(a: string, b: string): boolean {
  return normalizeRollNumber(a) === normalizeRollNumber(b)
}

/** Stable string form of a dataset identity. */
export function datasetKey(key: DatasetKey): string {
  return `${key.boardId}:${key.year}:${key.examination}`
}

/** Stable string form of a record identity — the composite unique key. */
export function recordKey(key: RecordKey): string {
  return `${datasetKey(key)}:${normalizeRollNumber(key.rollNumber)}`
}

/**
 * Whether a record genuinely belongs to the dataset it is being served from.
 *
 * Called on the way OUT, not only on the way in. An index built correctly can
 * still be queried wrongly, a dataset pointer can be stale, and a parser
 * regression can write a record under the wrong dataset id. This is the last
 * check before a human reads a result, and it is cheap.
 */
export function belongsToDataset(record: GazetteResultRecord, key: DatasetKey): boolean {
  return (
    record.boardId === key.boardId &&
    record.year === key.year &&
    record.examination === key.examination
  )
}

/**
 * Assert isolation, throwing rather than returning a mismatched record.
 *
 * Failing loudly is correct here. A thrown error degrades to the fallback
 * ladder and an incident; a returned mismatch is shown to a student as their
 * own result.
 */
export class RecordIsolationError extends Error {
  constructor(
    readonly expected: DatasetKey,
    readonly got: Pick<GazetteResultRecord, 'boardId' | 'year' | 'examination'>,
  ) {
    super(
      `Record isolation violated: expected ${datasetKey(expected)}, got ` +
        `${got.boardId}:${got.year}:${got.examination}`,
    )
    this.name = 'RecordIsolationError'
  }
}

export function assertBelongsToDataset(
  record: GazetteResultRecord,
  key: DatasetKey,
): GazetteResultRecord {
  if (!belongsToDataset(record, key)) {
    throw new RecordIsolationError(key, record)
  }
  return record
}

/**
 * Find a record by exact composite key.
 *
 * Deliberately takes the full key and verifies the match on every axis rather
 * than trusting that the caller handed us the right collection. Two datasets
 * accidentally merged upstream would otherwise be undetectable here.
 */
export function findExact(
  records: readonly GazetteResultRecord[],
  key: RecordKey,
): GazetteResultRecord | null {
  const wanted = normalizeRollNumber(key.rollNumber)
  for (const record of records) {
    if (record.boardId !== key.boardId) continue
    if (record.year !== key.year) continue
    if (record.examination !== key.examination) continue
    if (normalizeRollNumber(record.rollNumber) !== wanted) continue
    return record
  }
  return null
}

/**
 * Duplicate composite keys within a parsed dataset.
 *
 * A duplicate is never silently dropped. It means one of: the source lists a
 * candidate twice, the parser emitted a row twice, a page boundary was crossed
 * incorrectly, or the board issued a correction inline. Those have different
 * remedies, and picking one at random would hide the parser bug.
 */
export function findDuplicateKeys(records: readonly GazetteResultRecord[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const record of records) {
    const key = recordKey({
      boardId: record.boardId,
      year: record.year,
      examination: record.examination,
      rollNumber: record.rollNumber,
    })
    if (seen.has(key)) duplicates.add(key)
    seen.add(key)
  }
  return [...duplicates]
}

import type { ExamLevel } from '@/lib/result-sources/types'

/**
 * The gazette data engine's contract.
 *
 * THE FAILURE MODE THIS FILE EXISTS TO PREVENT:
 *
 *   showing one candidate's marks under another candidate's roll number.
 *
 * That is P0. It is worse than any outage, worse than missing coverage, and
 * worse than being last to publish — because the reader believes it. Every
 * decision below is shaped by making that outcome structurally hard rather
 * than merely unlikely.
 *
 * Three things follow from it:
 *
 *  1. The lookup key is COMPOSITE. A roll number is not globally unique — it
 *     is unique only within one board, one year and one examination. The key
 *     type makes it impossible to look up by roll number alone.
 *
 *  2. Matching is EXACT. Never fuzzy, never padded, never "did you mean".
 *     A near-miss on a roll number is a different human being.
 *
 *  3. A dataset is not searchable until it is ACTIVE, and activation is a
 *     separate deliberate step from parsing. A parser that ran is not a
 *     dataset that is correct.
 */

export type GazetteExamination =
  'first-annual' | 'second-annual' | 'supplementary' | 'improvement' | 'special'

export const EXAMINATION_LABELS: Record<GazetteExamination, string> = {
  'first-annual': 'First Annual',
  'second-annual': 'Second Annual',
  supplementary: 'Supplementary',
  improvement: 'Improvement',
  special: 'Special',
}

/**
 * Source file formats observed or anticipated.
 *
 * `scanned-pdf` is separated from `text-pdf` because it carries an entirely
 * different risk profile: OCR can silently alter a digit in a roll number or a
 * mark, which is the P0 failure with extra steps.
 */
export type GazetteFormat =
  'text-pdf' | 'tabular-pdf' | 'scanned-pdf' | 'xlsx' | 'csv' | 'html' | 'unknown'

/**
 * Dataset lifecycle. Only `active` is ever searchable by a reader.
 *
 * The states between `parsed` and `active` are not bureaucracy — each one is a
 * gate that has caught a class of error somewhere in this problem domain.
 */
export type DatasetStatus =
  /** Registered, nothing read yet. */
  | 'unverified'
  /** Parsed, but nothing checked. */
  | 'parsed'
  /** Parsed and failed a validation rule. Cannot proceed. */
  | 'validation-failed'
  /** Passed validation; awaiting human sample comparison against the source. */
  | 'qa-required'
  /** Sample QA passed. Ready to activate, not yet serving. */
  | 'validated'
  /** Serving reader lookups. The ONLY searchable state. */
  | 'active'
  /** Withdrawn from serving — an incident, or superseded. Records retained. */
  | 'disabled'
  /** A previous version, kept for provenance. Never deleted. */
  | 'archived'

export function isSearchable(status: DatasetStatus): boolean {
  return status === 'active'
}

/**
 * A registered gazette source file.
 *
 * `checksum` is what makes a re-publication detectable. Boards do reissue
 * corrected gazettes without announcing it, and a silent content change under
 * a stable URL would otherwise go unnoticed.
 */
export type GazetteSourceFile = {
  /** Stable id: board-exam-year-session-vN. */
  datasetId: string
  boardId: string
  year: number
  examination: GazetteExamination
  examLevel: ExamLevel
  /** Where the file came from. Must be a board or government origin. */
  sourceUrl: string
  /** How the source was established as genuine, in prose. */
  provenanceNote: string
  format: GazetteFormat
  /** SHA-256 of the original bytes, lowercase hex. */
  checksum: string
  sizeBytes: number
  acquiredAt: string
  /**
   * Whether the file itself names the board, examination and year.
   *
   * Gujranwala's gazette prints "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION
   * GUJRANWALA — HSSC FIRST ANNUAL PART-II EXAMINATION, 2025" on page one, so
   * the document corroborates its own registry entry. Where it does not, the
   * binding between file and dataset rests entirely on where we downloaded it,
   * which is weaker and is recorded as such.
   */
  selfIdentifying: boolean
}

/** One candidate's record, normalized. Every field optional except identity. */
export type GazetteResultRecord = {
  boardId: string
  year: number
  examination: GazetteExamination
  /** Normalized, never padded or corrected. */
  rollNumber: string

  candidateName?: string
  fatherName?: string
  group?: string
  institution?: string

  obtainedMarks?: number
  totalMarks?: number
  grade?: string

  subjects?: GazetteSubjectRecord[]

  /**
   * The board's own status wording, kept verbatim.
   *
   * Boards do not share a status vocabulary, and mapping "R.L." or "U.F.M." or
   * a compartment annotation onto a guessed universal enum loses meaning and
   * risks inventing one. The raw value is authoritative; a normalized value is
   * added only where a board's own key defines it.
   */
  rawResultStatus?: string
  normalizedResultStatus?: 'pass' | 'fail' | 'absent' | 'withheld' | 'compartment'

  remarks?: string

  /** Provenance chain — required, so any displayed result is traceable. */
  datasetId: string
  sourceReference?: string
  parserVersion: string
}

export type GazetteSubjectRecord = {
  subjectName: string
  subjectCode?: string
  theoryMarks?: number
  practicalMarks?: number
  obtainedMarks?: number
  totalMarks?: number
  status?: string
}

/** The outcome of one ingestion run. Produced before activation is considered. */
export type ParseReport = {
  datasetId: string
  parserVersion: string
  parsedAt: string
  sourceUnits: number
  recordsParsed: number
  recordsValid: number
  recordsRejected: number
  duplicateKeys: number
  warnings: ParseWarning[]
}

export type ParseWarning = {
  kind:
    | 'unexpected-columns'
    | 'broken-layout'
    | 'truncated-row'
    | 'missing-roll-number'
    | 'unrecognized-status'
    | 'continuation-ambiguous'
    | 'ocr-low-confidence'
    | 'marks-out-of-range'
  count: number
  detail: string
}

/**
 * Operational coverage for one board, shown to readers as capability.
 *
 * Distinct from source health: our dataset can be serving perfectly while the
 * board's own portal is down, which is the entire point of this architecture.
 */
export type BoardCoverageStatus =
  | 'gazette-lookup-active'
  | 'dataset-processing'
  | 'fallback-only'
  | 'source-pending'
  | 'blocked'
  | 'unsupported'
  | 'unknown'

export const COVERAGE_LABELS: Record<BoardCoverageStatus, string> = {
  'gazette-lookup-active': 'Result lookup available here',
  'dataset-processing': 'Result data is being verified',
  'fallback-only': 'Check on the board’s own source',
  'source-pending': 'No gazette available yet',
  blocked: 'We cannot access this board’s data',
  unsupported: 'Not covered yet',
  unknown: 'Not verified',
}

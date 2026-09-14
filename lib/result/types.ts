/**
 * The normalized internal result contract (section 14).
 *
 * The frontend consumes this shape and never a board's HTML. Whatever a future
 * source adapter reads, it normalizes into these types, so adding a board never
 * requires touching a component.
 */

export type ExaminationType = 'annual' | 'second-annual' | 'supplementary'

export const EXAMINATION_LABELS: Record<ExaminationType, string> = {
  annual: 'First Annual',
  'second-annual': 'Second Annual',
  supplementary: 'Supplementary',
}

export type ResultStatus = 'pass' | 'fail' | 'absent' | 'withheld' | 'not-declared'

export type SubjectRecord = {
  name: string
  obtainedMarks: number | null
  totalMarks: number | null
  grade: string | null
}

/**
 * Nullability throughout is deliberate: a board that does not publish a field
 * yields `null`, never a guess and never a zero.
 */
export type ResultRecord = {
  boardId: string
  boardCode: string | null
  /** This site covers the final Intermediate year only. */
  className: '12'
  examination: ExaminationType
  year: number
  /** Normalized uppercase. */
  rollNumber: string
  candidateName: string | null
  fatherName: string | null
  group: string | null
  subjects: SubjectRecord[]
  obtainedMarks: number | null
  totalMarks: number | null
  grade: string | null
  status: ResultStatus
  declaredAt: string | null
  /** Provenance — required on every record (section 78). */
  sourceId: string
  sourceUrl: string
  fetchedAt: string
}

/**
 * A discriminated union with deliberately NO shape that lets a caller confuse
 * "the source is down" with "no such result", or return a fabricated record.
 *
 * There is no `{ found: boolean, record?: ResultRecord }` here, because that
 * shape permits `found: true` with no record, and permits a caller to render an
 * empty result card as though it were a real one.
 */
export type LookupOutcome =
  | { kind: 'found'; record: ResultRecord; alsoAtBoards?: string[] }
  | { kind: 'not-found'; message: string }
  | { kind: 'not-announced'; message: string; boardId: string }
  | { kind: 'unsupported'; message: string; boardId: string }
  | {
      kind: 'source-unavailable'
      message: string
      boardId: string
      retryAfterSeconds: number | null
    }
  | { kind: 'invalid-request'; message: string }

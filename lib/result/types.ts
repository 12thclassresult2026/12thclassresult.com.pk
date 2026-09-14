import type { GroupId } from '@/lib/board/types'
import type { ResultFallback } from './fallback'

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
  /**
   * The registry's group vocabulary, not the board's wording.
   *
   * Typed rather than `string` because a per-group board declares results one
   * group at a time: a record whose group cannot be matched to a known group
   * cannot be checked against that board's declaration state, and a free
   * string would let "Pre Medical" and "pre-medical" silently diverge.
   */
  group: GroupId | null
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
  | { kind: 'not-found'; message: string; boardId: string; fallbacks: ResultFallback[] }
  | { kind: 'not-announced'; message: string; boardId: string; fallbacks: ResultFallback[] }
  /**
   * The board declares group by group, and THIS group is not out yet.
   *
   * Distinct from `not-announced` because a board-level "announced" is false
   * comfort for a Commerce candidate when only Pre-Medical has been declared —
   * and telling that candidate "no result found" would be materially wrong.
   */
  | {
      kind: 'not-announced-for-group'
      message: string
      boardId: string
      group: GroupId
      fallbacks: ResultFallback[]
    }
  /**
   * The board has no online roll-number lookup AT ALL.
   *
   * Distinct from `unsupported` (we cannot do it) — this says the thing does
   * not exist, so no amount of retrying or waiting will produce it. Four boards
   * are in this state today, and conflating it with `not-found` would tell
   * those candidates their result is missing when it was never online.
   */
  | {
      kind: 'no-lookup-exists'
      message: string
      boardId: string
      gazetteSourceId?: string
      fallbacks: ResultFallback[]
    }
  | { kind: 'unsupported'; message: string; boardId: string; fallbacks: ResultFallback[] }
  | {
      kind: 'source-unavailable'
      message: string
      boardId: string
      retryAfterSeconds: number | null
      fallbacks: ResultFallback[]
    }
  | { kind: 'invalid-request'; message: string }

/**
 * Every outcome except `found` and `invalid-request` carries a fallback ladder.
 *
 * This is enforced by the type, not by convention: a reader who cannot get a
 * result here must always leave with somewhere real to go. `invalid-request` is
 * excluded because the fix is in the form the reader already has, and `found`
 * because they have what they came for.
 */
export type UnresolvedOutcome = Extract<LookupOutcome, { fallbacks: ResultFallback[] }>

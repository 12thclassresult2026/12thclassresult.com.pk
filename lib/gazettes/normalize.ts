import type { RawRecord } from './parser/types'

/**
 * Raw gazette row -> stored record.
 *
 * THE RULE THIS FILE OBEYS: nothing is added that the gazette did not print.
 *
 * A gazette line is not a DMC. It carries a roll number, a name, and either a
 * total or a list of subjects still to clear. It does NOT carry subject-wise
 * marks, a grade, a father's name, a percentage or a division, and this
 * normaliser must never manufacture any of them — those are the fields every
 * competitor invents, and inventing them is what makes a result page a lie.
 *
 * `rawResultStatus` is kept verbatim on every record, so anything the mapping
 * below gets wrong can still be seen and corrected.
 *
 * THE VOCABULARY IS MEASURED, NOT ASSUMED. Every form below was counted across
 * all 138,617 records of the Gujranwala 2025 gazette:
 *
 *   82,997  a bare total                     -> passed
 *   36,523  PI: subjects + PII: subjects     -> failed both parts
 *   11,279  PII: subjects                    -> failed Part-II
 *    2,754  PII: ABSENT                      -> absent
 *    2,638  total + "MARKS IMP."             -> passed, marks improved
 *    2,336  PI: subjects                     -> failed Part-I
 *       50  "PASS IN ADD. SUB(s)"            -> passed an additional subject
 *       29  "SN"                             -> UNKNOWN, see below
 *       11  "PASS"                           -> passed, no total printed
 *
 * No record carries both a total and a failed-subject list, so the states below
 * do not overlap.
 */

export const NORMALIZATION_VERSION = 'gazette-normalize-1.0.0'

/**
 * What the gazette says happened. `unknown` is a real state, not a fallback for
 * tidiness: 29 records read "SN", an abbreviation this gazette never expands and
 * which no board publication we hold defines. Guessing it — "Sine Nomine"?
 * "Subject Not …"? — would put an invented outcome in front of a student. It
 * stays unknown until a board document explains it.
 */
export type GazetteResultStatus = 'passed' | 'failed' | 'absent' | 'unknown'

export type GazetteRecord = {
  /** Composite identity. Lookup is exact on all four. */
  boardId: string
  year: number
  examination: string
  rollNumber: string

  candidateName: string
  institution: string | null

  resultStatus: GazetteResultStatus
  /** Total marks, only where a total was printed. Never derived. */
  obtainedMarks: number | null
  /**
   * Deliberately absent from this type: totalMarks, percentage, grade, division,
   * subject-wise marks, father's name. The gazette prints none of them.
   */
  partIFailedSubjects: string[]
  partIIFailedSubjects: string[]
  /** "MARKS IMP.", "PASS IN ADD. SUB(s)" and anything else printed alongside. */
  remarks: string | null

  /** Verbatim, always. The audit trail for every field above. */
  rawResultStatus: string
  sourceDatasetId: string
  sourcePage: number
  sourceColumn: number
  parserVersion: string
  normalizationVersion: string
}

export type NormalizeContext = {
  datasetId: string
  boardId: string
  year: number
  examination: string
  parserVersion: string
}

export type NormalizeOutcome =
  { ok: true; record: GazetteRecord } | { ok: false; reason: string; raw: RawRecord }

const MARKS_ONLY = /^(\d{3,4})$/
const MARKS_WITH_REMARK = /^(\d{3,4})\s+(MARKS (?:NOT )?IMP\.)$/
const PART_I = /^PI:\s*(.+)$/
const PART_II = /^PII:\s*(.+)$/
const PASS_ADDITIONAL = 'PASS IN ADD. SUB(s)'
const PASS_BARE = 'PASS'

/**
 * Plausible total for HSSC Part-I + Part-II combined. Observed range across the
 * whole gazette is 407-1159; the bound is wider than the data so a legitimate
 * outlier is not rejected, but a four-digit misread still is.
 */
const MARKS_MIN = 1
const MARKS_MAX = 1300

export function normalizeRecord(raw: RawRecord, context: NormalizeContext): NormalizeOutcome {
  const lines = raw.rawResultStatus
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')

  if (lines.length === 0) {
    return { ok: false, reason: 'empty-result-cell', raw }
  }

  let obtainedMarks: number | null = null
  let partI: string[] = []
  let partII: string[] = []
  const remarks: string[] = []
  let absent = false
  let sawPass = false
  let unrecognised = false

  for (const line of lines) {
    const marksOnly = MARKS_ONLY.exec(line)
    if (marksOnly?.[1]) {
      obtainedMarks = Number(marksOnly[1])
      continue
    }

    const marksRemark = MARKS_WITH_REMARK.exec(line)
    if (marksRemark?.[1] && marksRemark[2]) {
      obtainedMarks = Number(marksRemark[1])
      remarks.push(marksRemark[2])
      continue
    }

    const partIMatch = PART_I.exec(line)
    if (partIMatch?.[1]) {
      const subjects = splitSubjects(partIMatch[1])
      if (subjects.absent) absent = true
      else partI = subjects.list
      continue
    }

    const partIIMatch = PART_II.exec(line)
    if (partIIMatch?.[1]) {
      const subjects = splitSubjects(partIIMatch[1])
      if (subjects.absent) absent = true
      else partII = subjects.list
      continue
    }

    if (line === PASS_ADDITIONAL) {
      sawPass = true
      remarks.push(PASS_ADDITIONAL)
      continue
    }

    if (line === PASS_BARE) {
      sawPass = true
      continue
    }

    // "SN" lands here. The record is kept, with its text, and marked unknown.
    unrecognised = true
    remarks.push(line)
  }

  if (obtainedMarks !== null && (obtainedMarks < MARKS_MIN || obtainedMarks > MARKS_MAX)) {
    return { ok: false, reason: 'marks-out-of-range', raw }
  }

  const resultStatus = decideStatus({
    unrecognised,
    absent,
    failedAnySubject: partI.length > 0 || partII.length > 0,
    hasMarks: obtainedMarks !== null,
    sawPass,
  })

  return {
    ok: true,
    record: {
      boardId: context.boardId,
      year: context.year,
      examination: context.examination,
      rollNumber: raw.rollNumber,
      candidateName: raw.candidateName,
      institution: raw.institution,
      resultStatus,
      obtainedMarks,
      partIFailedSubjects: partI,
      partIIFailedSubjects: partII,
      remarks: remarks.length > 0 ? remarks.join('; ') : null,
      rawResultStatus: raw.rawResultStatus,
      sourceDatasetId: context.datasetId,
      sourcePage: raw.page,
      sourceColumn: raw.column,
      parserVersion: context.parserVersion,
      normalizationVersion: NORMALIZATION_VERSION,
    },
  }
}

function decideStatus(signals: {
  unrecognised: boolean
  absent: boolean
  failedAnySubject: boolean
  hasMarks: boolean
  sawPass: boolean
}): GazetteResultStatus {
  // Order matters. An unreadable line makes the whole record unknown rather
  // than letting the readable half decide an outcome for the candidate.
  if (signals.unrecognised) return 'unknown'
  if (signals.absent) return 'absent'
  if (signals.failedAnySubject) return 'failed'
  if (signals.hasMarks || signals.sawPass) return 'passed'
  return 'unknown'
}

/**
 * "U,ENG,P/A,BNK" -> ["U","ENG","P/A","BNK"].
 *
 * ABSENT is the board's own word in this field and is a status, not a subject —
 * listing it as one would put "ABSENT" in a student's failed-subject list.
 */
function splitSubjects(value: string): { list: string[]; absent: boolean } {
  const trimmed = value.trim()
  if (trimmed === 'ABSENT') return { list: [], absent: true }
  return {
    list: trimmed
      .split(',')
      .map((subject) => subject.trim())
      .filter((subject) => subject !== ''),
    absent: false,
  }
}

/** The one identity lookup is allowed to use. */
export function compositeKey(record: {
  boardId: string
  year: number
  examination: string
  rollNumber: string
}): string {
  return `${record.boardId}:${record.year}:${record.examination}:${record.rollNumber}`
}

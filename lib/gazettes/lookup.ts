import type { GazetteRecord } from './normalize'

/**
 * Exact result lookup.
 *
 * Board -> Year -> Examination -> Roll Number -> active dataset -> exact match.
 *
 * THREE RULES, ALL STRUCTURAL RATHER THAN POLICY.
 *
 * 1. NO FUZZY MATCHING, EVER. No trimming a digit, no nearest match, no
 *    "did you mean". A roll number that is not present is `not-found`. The
 *    failure mode of a helpful match here is showing one student another
 *    student's result.
 *
 * 2. THE DATASET IS SELECTED BEFORE THE ROLL NUMBER IS USED. The store is
 *    addressed by `board+year+examination` first and the roll number is only
 *    ever looked up inside the dataset that addressing returned. A roll number
 *    cannot reach across a board, a year or an examination because it is never
 *    given the chance — this is why `datasetKey` and `compositeKey` are separate
 *    functions and why the store interface takes the identity as a unit.
 *
 * 3. AN INACTIVE DATASET IS NOT A MISS. `dataset-unavailable` is distinct from
 *    `not-found`. Telling a student "no such roll number" when the truth is
 *    "this board's data is not published yet" is a different, wrong answer.
 */

export type ResultIdentity = {
  boardId: string
  year: number
  examination: string
  rollNumber: string
}

export type DatasetIdentity = Omit<ResultIdentity, 'rollNumber'>

/**
 * Mirrors the dataset lifecycle. Only `active` serves traffic; every other
 * state answers `dataset-unavailable` and says so.
 */
export type DatasetState = 'active' | 'staged' | 'suspended' | 'retired' | 'absent'

export type LookupOutcome =
  | { kind: 'found'; record: GazetteRecord; datasetId: string }
  | { kind: 'not-found'; datasetId: string }
  | { kind: 'dataset-unavailable'; state: DatasetState }
  | { kind: 'invalid-request'; reason: string }

/**
 * What a store must provide. Deliberately minimal, and deliberately NOT a query
 * interface: there is no "search", no "list", no "prefix". The only question a
 * store can be asked is whether one exact identity exists, which is what stops
 * this from becoming an enumeration API.
 */
export type GazetteStore = {
  datasetState(dataset: DatasetIdentity): Promise<{ state: DatasetState; datasetId: string | null }>
  get(identity: ResultIdentity): Promise<GazetteRecord | null>
}

/** Roll numbers are digits only. Length varies by board, so it is not fixed here. */
const ROLL_NUMBER = /^\d{4,12}$/
const EXAMINATION = /^[a-z0-9-]{3,40}$/
const BOARD_ID = /^[a-z0-9-]{3,40}$/

export function datasetKey(dataset: DatasetIdentity): string {
  return `${dataset.boardId}:${dataset.year}:${dataset.examination}`
}

export function compositeKey(identity: ResultIdentity): string {
  return `${datasetKey(identity)}:${identity.rollNumber}`
}

/**
 * Validates a request without touching the store.
 *
 * Rejecting malformed input before the store call is not only tidiness: it keeps
 * a probe that is not even shaped like a roll number from consuming a lookup, so
 * rate limiting is spent on plausible requests rather than on garbage.
 */
export function validateRequest(input: {
  boardId: string
  year: number
  examination: string
  rollNumber: string
}): { ok: true; identity: ResultIdentity } | { ok: false; reason: string } {
  const rollNumber = input.rollNumber.trim()

  if (!BOARD_ID.test(input.boardId)) return { ok: false, reason: 'unrecognised board' }
  if (!Number.isInteger(input.year) || input.year < 1990 || input.year > 2100) {
    return { ok: false, reason: 'year is out of range' }
  }
  if (!EXAMINATION.test(input.examination)) return { ok: false, reason: 'unrecognised examination' }
  if (!ROLL_NUMBER.test(rollNumber)) {
    return { ok: false, reason: 'a roll number is digits only' }
  }

  return {
    ok: true,
    identity: {
      boardId: input.boardId,
      year: input.year,
      examination: input.examination,
      rollNumber,
    },
  }
}

export async function lookupResult(
  store: GazetteStore,
  input: { boardId: string; year: number; examination: string; rollNumber: string },
): Promise<LookupOutcome> {
  const validated = validateRequest(input)
  if (!validated.ok) return { kind: 'invalid-request', reason: validated.reason }

  const identity = validated.identity

  /*
   * The dataset is resolved FIRST and the roll number is not used until an
   * active dataset has been found. Reversing these two steps is how a lookup
   * ends up scanning across boards.
   */
  const dataset = await store.datasetState({
    boardId: identity.boardId,
    year: identity.year,
    examination: identity.examination,
  })

  if (dataset.state !== 'active' || dataset.datasetId === null) {
    return { kind: 'dataset-unavailable', state: dataset.state }
  }

  const record = await store.get(identity)
  if (record === null) return { kind: 'not-found', datasetId: dataset.datasetId }

  /*
   * Belt and braces. The store is addressed by identity, so this should be
   * impossible — but "should be impossible" is exactly the assumption that
   * produces a wrong-candidate bug, and the cost of checking is nothing.
   */
  if (
    record.boardId !== identity.boardId ||
    record.year !== identity.year ||
    record.examination !== identity.examination ||
    record.rollNumber !== identity.rollNumber
  ) {
    return { kind: 'invalid-request', reason: 'store returned a record for a different identity' }
  }

  return { kind: 'found', record, datasetId: dataset.datasetId }
}

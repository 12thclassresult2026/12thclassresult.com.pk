import { describe, expect, it, vi } from 'vitest'

import type { GazetteRecord } from '@/lib/gazettes/normalize'
import type { DatasetState, GazetteStore } from '@/lib/gazettes/lookup'

import { compositeKey, datasetKey, lookupResult, validateRequest } from '@/lib/gazettes/lookup'

/**
 * Exact-lookup isolation.
 *
 * CROSS-BOARD, CROSS-YEAR OR CROSS-EXAMINATION LEAKAGE IS AN ABSOLUTE FAILURE.
 * Every test below that changes one component of the identity is asserting that
 * a student cannot be shown someone else's result — which is the only defect in
 * this system that would be worse than having no system.
 */

const GUJRANWALA: GazetteRecord = {
  boardId: 'bise-gujranwala',
  year: 2025,
  examination: 'first-annual',
  rollNumber: '236818',
  candidateName: 'TEST CANDIDATE',
  institution: '211002-A COLLEGE',
  resultStatus: 'passed',
  obtainedMarks: 621,
  partIFailedSubjects: [],
  partIIFailedSubjects: [],
  remarks: null,
  rawResultStatus: '621',
  sourceDatasetId: 'bise-gujranwala-2025-first-annual-v1',
  sourcePage: 151,
  sourceColumn: 0,
  parserVersion: 'grw-two-column-2.0.0',
  normalizationVersion: 'gazette-normalize-1.0.0',
}

/**
 * A store that holds exactly one dataset and one record.
 *
 * It answers `get` from a map keyed on the FULL composite key, so if the lookup
 * ever asked using a partial identity the test would fail rather than quietly
 * matching. That is the property under test, so the fake must not be forgiving.
 */
function storeWith(state: DatasetState, records: GazetteRecord[] = [GUJRANWALA]): GazetteStore {
  const byKey = new Map(records.map((r) => [compositeKey(r), r]))
  return {
    async datasetState(dataset) {
      const matches =
        dataset.boardId === GUJRANWALA.boardId &&
        dataset.year === GUJRANWALA.year &&
        dataset.examination === GUJRANWALA.examination
      if (!matches) return { state: 'absent', datasetId: null }
      return { state, datasetId: state === 'absent' ? null : GUJRANWALA.sourceDatasetId }
    },
    async get(identity) {
      return byKey.get(compositeKey(identity)) ?? null
    },
  }
}

const VALID = {
  boardId: 'bise-gujranwala',
  year: 2025,
  examination: 'first-annual',
  rollNumber: '236818',
}

describe('request validation', () => {
  it('accepts a well-formed request', () => {
    expect(validateRequest(VALID).ok).toBe(true)
  })

  it.each([
    ['letters in the roll number', { ...VALID, rollNumber: '23a818' }],
    ['an empty roll number', { ...VALID, rollNumber: '' }],
    ['a roll number that is far too long', { ...VALID, rollNumber: '1'.repeat(40) }],
    ['a year out of range', { ...VALID, year: 1200 }],
    ['a non-integer year', { ...VALID, year: 2025.5 }],
    ['a board id with a path separator', { ...VALID, boardId: '../etc' }],
    ['an examination with a space', { ...VALID, examination: 'first annual' }],
  ])('rejects %s', (_name, input) => {
    expect(validateRequest(input).ok).toBe(false)
  })

  it('trims surrounding whitespace from a roll number', () => {
    const result = validateRequest({ ...VALID, rollNumber: '  236818  ' })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.identity.rollNumber).toBe('236818')
  })
})

describe('exact lookup', () => {
  it('finds a record when the dataset is active', async () => {
    const outcome = await lookupResult(storeWith('active'), VALID)
    expect(outcome.kind).toBe('found')
    if (outcome.kind === 'found') expect(outcome.record.rollNumber).toBe('236818')
  })

  it('returns not-found for an unknown roll number in an active dataset', async () => {
    const outcome = await lookupResult(storeWith('active'), { ...VALID, rollNumber: '999999' })
    expect(outcome.kind).toBe('not-found')
  })

  it('never fuzzy-matches a roll number that is one digit off', async () => {
    // 236818 exists; 23681 and 2368180 must not reach it.
    for (const rollNumber of ['23681', '2368180', '236819', '236817']) {
      const outcome = await lookupResult(storeWith('active'), { ...VALID, rollNumber })
      expect(outcome.kind, `${rollNumber} matched something`).toBe('not-found')
    }
  })

  describe('isolation — each of these would be a wrong result for a real student', () => {
    it('does not reach another board’s data', async () => {
      const outcome = await lookupResult(storeWith('active'), { ...VALID, boardId: 'bise-lahore' })
      expect(outcome.kind).toBe('dataset-unavailable')
    })

    it('does not reach another year', async () => {
      const outcome = await lookupResult(storeWith('active'), { ...VALID, year: 2024 })
      expect(outcome.kind).toBe('dataset-unavailable')
    })

    it('does not reach another examination', async () => {
      const outcome = await lookupResult(storeWith('active'), {
        ...VALID,
        examination: 'second-annual',
      })
      expect(outcome.kind).toBe('dataset-unavailable')
    })

    it('never asks the store for a roll number before a dataset is resolved', async () => {
      /*
       * The ordering IS the isolation. If `get` were called first, or called at
       * all on an unavailable dataset, a store bug could return a row from
       * somewhere else. Assert the call never happens.
       */
      const store = storeWith('active')
      const get = vi.fn(store.get)
      const outcome = await lookupResult({ ...store, get }, { ...VALID, boardId: 'bise-lahore' })

      expect(outcome.kind).toBe('dataset-unavailable')
      expect(get).not.toHaveBeenCalled()
    })

    it('rejects a record whose identity does not match the request', async () => {
      // A deliberately broken store, standing in for a future D1 query bug.
      const wrong: GazetteStore = {
        async datasetState() {
          return { state: 'active', datasetId: 'x' }
        },
        async get() {
          return { ...GUJRANWALA, rollNumber: '111111' }
        },
      }
      const outcome = await lookupResult(wrong, VALID)
      // Not 'found'. The last line of defence catches the store lying.
      expect(outcome.kind).toBe('invalid-request')
    })
  })

  describe('dataset availability is not a miss', () => {
    it.each<[DatasetState]>([['staged'], ['suspended'], ['retired'], ['absent']])(
      'answers dataset-unavailable, not not-found, when the dataset is %s',
      async (state) => {
        const outcome = await lookupResult(storeWith(state), VALID)
        expect(outcome.kind).toBe('dataset-unavailable')
        if (outcome.kind === 'dataset-unavailable') expect(outcome.state).toBe(state)
      },
    )

    it('does not consult the store at all for an unpublished dataset', async () => {
      const store = storeWith('staged')
      const get = vi.fn(store.get)
      await lookupResult({ ...store, get }, VALID)
      expect(get).not.toHaveBeenCalled()
    })
  })

  it('rejects a malformed request without touching the store', async () => {
    const store = storeWith('active')
    const datasetState = vi.fn(store.datasetState)
    const get = vi.fn(store.get)
    const outcome = await lookupResult({ datasetState, get }, { ...VALID, rollNumber: 'abc' })

    expect(outcome.kind).toBe('invalid-request')
    // Rate limiting should be spent on plausible requests, not on garbage.
    expect(datasetState).not.toHaveBeenCalled()
    expect(get).not.toHaveBeenCalled()
  })
})

describe('keys', () => {
  it('builds the dataset and composite keys from the identity', () => {
    expect(datasetKey(GUJRANWALA)).toBe('bise-gujranwala:2025:first-annual')
    expect(compositeKey(GUJRANWALA)).toBe('bise-gujranwala:2025:first-annual:236818')
  })

  it('gives different composite keys to the same roll number in different datasets', () => {
    // The property the whole isolation model rests on.
    const a = compositeKey({ ...GUJRANWALA })
    const b = compositeKey({ ...GUJRANWALA, year: 2024 })
    const c = compositeKey({ ...GUJRANWALA, boardId: 'bise-lahore' })
    const d = compositeKey({ ...GUJRANWALA, examination: 'second-annual' })
    expect(new Set([a, b, c, d]).size).toBe(4)
  })
})

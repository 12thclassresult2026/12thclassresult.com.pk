import { describe, expect, it } from 'vitest'

import {
  RecordIsolationError,
  assertBelongsToDataset,
  belongsToDataset,
  datasetKey,
  findDuplicateKeys,
  findExact,
  normalizeRollNumber,
  recordKey,
  rollNumbersMatch,
} from '@/lib/gazettes/identity'
import { isSearchable, type DatasetStatus, type GazetteResultRecord } from '@/lib/gazettes/types'

/**
 * Isolation and exact-match tests.
 *
 * Every test here is an attempt to make the engine return a record belonging to
 * someone other than the person who asked. That is the P0 failure of a gazette
 * result platform, and it is the reason this module exists.
 *
 * All data below is synthetic. No record from a real gazette is committed to
 * this repository.
 */

function record(over: Partial<GazetteResultRecord> = {}): GazetteResultRecord {
  return {
    boardId: 'bise-gujranwala',
    year: 2025,
    examination: 'first-annual',
    rollNumber: '123456',
    datasetId: 'bise-gujranwala-hssc2-2025-first-annual-v1',
    parserVersion: 'test',
    ...over,
  }
}

describe('a roll number is not an identifier on its own', () => {
  it('distinguishes the same roll number across boards', () => {
    const records = [
      record({ boardId: 'bise-gujranwala', candidateName: 'A' }),
      record({ boardId: 'bise-multan', candidateName: 'B' }),
    ]
    const found = findExact(records, {
      boardId: 'bise-multan',
      year: 2025,
      examination: 'first-annual',
      rollNumber: '123456',
    })
    expect(found?.candidateName).toBe('B')
  })

  it('distinguishes the same roll number across years', () => {
    const records = [
      record({ year: 2024, candidateName: 'A' }),
      record({ year: 2025, candidateName: 'B' }),
    ]
    const found = findExact(records, {
      boardId: 'bise-gujranwala',
      year: 2024,
      examination: 'first-annual',
      rollNumber: '123456',
    })
    expect(found?.candidateName).toBe('A')
  })

  it('distinguishes first annual from second annual', () => {
    const records = [
      record({ examination: 'first-annual', candidateName: 'A' }),
      record({ examination: 'second-annual', candidateName: 'B' }),
    ]
    const found = findExact(records, {
      boardId: 'bise-gujranwala',
      year: 2025,
      examination: 'second-annual',
      rollNumber: '123456',
    })
    expect(found?.candidateName).toBe('B')
  })

  it('returns null rather than the wrong dataset’s record', () => {
    // The dangerous version of this returns "the only record with that roll
    // number" when the requested dataset has none.
    const records = [record({ boardId: 'bise-lahore', candidateName: 'A' })]
    const found = findExact(records, {
      boardId: 'bise-multan',
      year: 2025,
      examination: 'first-annual',
      rollNumber: '123456',
    })
    expect(found).toBeNull()
  })
})

describe('matching is exact and never helpful', () => {
  it.each([
    ['a neighbouring number', '123457'],
    ['a missing digit', '12345'],
    ['an extra digit', '1234567'],
    ['a transposition', '123465'],
  ])('does not match %s', (_label, candidate) => {
    expect(rollNumbersMatch('123456', candidate)).toBe(false)
  })

  it('does not strip leading zeros', () => {
    // A board may issue both. Treating them as equal would merge two people.
    expect(rollNumbersMatch('012345', '12345')).toBe(false)
    expect(normalizeRollNumber('012345')).toBe('012345')
  })

  it('does not remove separators', () => {
    // Some boards issue compound roll numbers where the separator has meaning.
    expect(rollNumbersMatch('12-3456', '123456')).toBe(false)
  })

  it('normalizes only whitespace and case', () => {
    expect(normalizeRollNumber('  12a 345  ')).toBe('12A 345')
    expect(rollNumbersMatch(' 12a345 ', '12A345')).toBe(true)
  })

  it('never pads a short roll number to a fixed width', () => {
    expect(normalizeRollNumber('99')).toBe('99')
    expect(normalizeRollNumber('99')).not.toBe('000099')
  })
})

describe('composite keys', () => {
  it('builds a key from all four axes', () => {
    expect(
      recordKey({
        boardId: 'bise-gujranwala',
        year: 2025,
        examination: 'first-annual',
        rollNumber: ' 123456 ',
      }),
    ).toBe('bise-gujranwala:2025:first-annual:123456')
  })

  it('gives different datasets different keys', () => {
    const base = { boardId: 'bise-gujranwala', year: 2025, examination: 'first-annual' } as const
    expect(datasetKey(base)).not.toBe(datasetKey({ ...base, year: 2024 }))
    expect(datasetKey(base)).not.toBe(datasetKey({ ...base, examination: 'second-annual' }))
    expect(datasetKey(base)).not.toBe(datasetKey({ ...base, boardId: 'bise-multan' }))
  })
})

describe('isolation is re-checked on the way out', () => {
  const key = { boardId: 'bise-gujranwala', year: 2025, examination: 'first-annual' } as const

  it('accepts a record that belongs', () => {
    expect(belongsToDataset(record(), key)).toBe(true)
    expect(assertBelongsToDataset(record(), key)).toBeDefined()
  })

  it.each([
    ['a different board', { boardId: 'bise-multan' }],
    ['a different year', { year: 2024 }],
    ['a different examination', { examination: 'second-annual' as const }],
  ])('throws rather than serve %s', (_label, over) => {
    // Throwing degrades to the fallback ladder and raises an incident.
    // Returning would show a student someone else's result.
    expect(() => assertBelongsToDataset(record(over), key)).toThrow(RecordIsolationError)
  })
})

describe('duplicates are surfaced, never silently resolved', () => {
  it('reports a duplicate composite key', () => {
    const dupes = findDuplicateKeys([record(), record({ candidateName: 'other' })])
    expect(dupes).toEqual(['bise-gujranwala:2025:first-annual:123456'])
  })

  it('does not treat the same roll in another dataset as a duplicate', () => {
    expect(findDuplicateKeys([record(), record({ year: 2024 })])).toEqual([])
    expect(findDuplicateKeys([record(), record({ examination: 'second-annual' })])).toEqual([])
  })
})

describe('only an active dataset is searchable', () => {
  it.each([
    'unverified',
    'parsed',
    'validation-failed',
    'qa-required',
    'validated',
    'disabled',
    'archived',
  ] satisfies DatasetStatus[])('does not serve a %s dataset', (status) => {
    // `validated` is included deliberately: passing QA is not the same as
    // being activated, and activation must stay a separate decision.
    expect(isSearchable(status)).toBe(false)
  })

  it('serves only active', () => {
    expect(isSearchable('active')).toBe(true)
  })
})

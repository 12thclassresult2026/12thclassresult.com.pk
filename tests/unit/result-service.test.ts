import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { allBoards } from '@/lib/board/registry'
import {
  BOARD_ADAPTERS,
  __clearTestAdapters,
  __registerTestAdapter,
  assertAllowedUrl,
  disableAdapter,
  enableAdapter,
  type BoardAdapter,
} from '@/lib/result-sources/adapter'
import { ResultSourceError } from '@/lib/result-sources/errors'
import {
  CIRCUIT_BREAKER_THRESHOLD,
  circuitState,
  clearHealthCache,
  resetCircuitBreakers,
} from '@/lib/result-sources/health'
import { lookupResult } from '@/lib/result-sources/service'
import type { ResultRecord } from '@/lib/result/types'

/**
 * Tests for the result engine.
 *
 * These are written around one question: can this system tell a student
 * something false about their own result? Every test below is an attempt to
 * make it do so.
 */

const VALID = { board: 'lahore-board', year: 2026, examination: 'annual', rollNumber: '123456' }

function syntheticRecord(overrides: Partial<ResultRecord> = {}): ResultRecord {
  return {
    boardId: 'bise-lahore',
    boardCode: null,
    className: '12',
    examination: 'annual',
    year: 2026,
    rollNumber: '123456',
    candidateName: null,
    fatherName: null,
    group: null,
    subjects: [],
    obtainedMarks: null,
    totalMarks: null,
    grade: null,
    status: 'pass',
    declaredAt: null,
    sourceId: 'lahore-result-portal',
    sourceUrl: 'https://biselahore.com/',
    fetchedAt: '2026-09-14T00:00:00.000Z',
    ...overrides,
  }
}

function testAdapter(lookup: BoardAdapter['lookup']): BoardAdapter {
  return {
    boardId: 'bise-lahore',
    sourceId: 'lahore-result-portal',
    allowedHosts: ['biselahore.com'],
    canLookup: () => true,
    lookup,
  }
}

beforeEach(() => {
  resetCircuitBreakers()
  clearHealthCache()
  __clearTestAdapters()
  enableAdapter('bise-lahore')
})

afterEach(() => {
  __clearTestAdapters()
})

describe('the policy state', () => {
  it('registers no production adapter', () => {
    /*
     * This is a policy assertion, not a coverage metric. No board publishes an
     * API or has granted automated access; six sources across five boards sit
     * behind CAPTCHAs. Adding an entry here without that permission is the
     * change this test exists to make someone justify.
     */
    expect(BOARD_ADAPTERS).toHaveLength(0)
  })

  it('never performs a direct lookup for any registered board', async () => {
    for (const board of allBoards()) {
      const outcome = await lookupResult({ ...VALID, board: board.slug })
      expect(outcome.kind, `${board.slug} attempted a direct lookup`).not.toBe('found')
      expect(outcome.kind, `${board.slug} claimed a missing record`).not.toBe('not-found')
    }
  })
})

describe('input validation', () => {
  it.each([
    ['unknown board', { ...VALID, board: 'not-a-board' }],
    ['roll number with a script payload', { ...VALID, rollNumber: '<script>' }],
    ['year before records exist', { ...VALID, year: 1990 }],
    ['missing roll number', { board: 'lahore-board', year: 2026, examination: 'annual' }],
    ['not an object', 'lahore-board'],
  ])('refuses %s', async (_label, input) => {
    const outcome = await lookupResult(input)
    expect(outcome.kind).toBe('invalid-request')
  })

  it('leaks no internal field paths in the rejection message', async () => {
    const outcome = await lookupResult({ ...VALID, rollNumber: '!' })
    expect(outcome.kind).toBe('invalid-request')
    if (outcome.kind !== 'invalid-request') return
    expect(outcome.message).not.toMatch(/rollNumber|zod|regex|String must/i)
  })
})

describe('every board leaves the reader somewhere to go', () => {
  it('attaches at least one real fallback to every unresolved outcome', async () => {
    for (const board of allBoards()) {
      const outcome = await lookupResult({ ...VALID, board: board.slug })
      if (outcome.kind === 'found' || outcome.kind === 'invalid-request') continue

      expect(outcome.fallbacks.length, `${board.slug} is a dead end`).toBeGreaterThan(0)
      for (const fallback of outcome.fallbacks) {
        if (fallback.type === 'retry' || fallback.type === 'sms') continue
        expect(fallback.url, `${board.slug} has a non-https fallback`).toMatch(/^https:\/\//)
      }
    }
  })

  it('offers no SMS fallback anywhere, because no board publishes a shortcode', async () => {
    /*
     * Aggregators circulate 5050, 800291, 800299 and others, mutually
     * inconsistent, none traceable to a board's own domain. An SMS is charged,
     * so publishing a wrong code costs a student money and returns nothing.
     * This test fails the day a shortcode is added without a source.
     */
    for (const board of allBoards()) {
      const outcome = await lookupResult({ ...VALID, board: board.slug })
      if (outcome.kind === 'found' || outcome.kind === 'invalid-request') continue
      expect(
        outcome.fallbacks.some((f) => f.type === 'sms'),
        `${board.slug} offered an unverified SMS route`,
      ).toBe(false)
    }
  })

  it('always ends the ladder with the board’s own website', async () => {
    /*
     * The commonest way a student is misled here is landing on an aggregator
     * that looks official. The board's real domain is useful even when every
     * other route works, and it is the only rung left if they all break.
     */
    for (const board of allBoards()) {
      const outcome = await lookupResult({ ...VALID, board: board.slug })
      if (outcome.kind === 'found' || outcome.kind === 'invalid-request') continue
      const last = outcome.fallbacks.at(-1)
      expect(last?.type, `${board.slug} does not end with its own website`).toBe('board-website')
    }
  })

  it('never offers the same link twice', async () => {
    for (const board of allBoards()) {
      const outcome = await lookupResult({ ...VALID, board: board.slug })
      if (outcome.kind === 'found' || outcome.kind === 'invalid-request') continue
      const urls = outcome.fallbacks
        .filter((f) => f.type !== 'retry' && f.type !== 'sms')
        .map((f) => f.url)
      expect(new Set(urls).size, `${board.slug} repeats a link`).toBe(urls.length)
    }
  })

  it('never suggests retrying where retrying cannot help', async () => {
    for (const board of allBoards()) {
      const outcome = await lookupResult({ ...VALID, board: board.slug })
      if (outcome.kind !== 'no-lookup-exists' && outcome.kind !== 'not-announced-for-group')
        continue
      expect(
        outcome.fallbacks.some((f) => f.type === 'retry'),
        `${board.slug} told a reader to retry something that will not change`,
      ).toBe(false)
    }
  })
})

describe('access models route differently', () => {
  it('returns no-lookup-exists for a gazette-only board, with its gazette', async () => {
    const outcome = await lookupResult({ ...VALID, board: 'karachi-board' })
    expect(outcome.kind).toBe('no-lookup-exists')
    if (outcome.kind !== 'no-lookup-exists') return
    expect(outcome.gazetteSourceId).toBe('biek-gazette')
    expect(outcome.fallbacks[0]?.type).toBe('gazette')
    // The gazette is the route, not a consolation prize.
    expect(outcome.fallbacks[0]).toMatchObject({ primary: true })
  })

  it('does not tell a gazette-only board reader that no record was found', async () => {
    const outcome = await lookupResult({ ...VALID, board: 'karachi-board' })
    expect(outcome.kind).not.toBe('not-found')
    if (outcome.kind === 'no-lookup-exists') {
      expect(outcome.message).not.toMatch(/not found|no result|does not exist/i)
    }
  })

  it('explains a session-rotating portal instead of storing a stale URL', async () => {
    const outcome = await lookupResult({ ...VALID, board: 'peshawar-board' })
    expect(outcome.kind).toBe('unsupported')
    if (outcome.kind !== 'unsupported') return
    expect(outcome.message).toMatch(/each session/i)
  })

  it('says plainly that an unverified board is unverified', async () => {
    const outcome = await lookupResult({ ...VALID, board: 'federal-board' })
    expect(outcome.kind).toBe('unsupported')
    if (outcome.kind !== 'unsupported') return
    expect(outcome.message).toMatch(/not been able to verify/i)
  })

  it('sends a roll-number-portal board to its own portal', async () => {
    const outcome = await lookupResult(VALID)
    expect(outcome.kind).toBe('unsupported')
    if (outcome.kind !== 'unsupported') return
    expect(outcome.fallbacks.some((f) => f.type === 'official-portal')).toBe(true)
  })
})

describe('per-group declaration', () => {
  it('does not claim an undeclared group from a board-level state', async () => {
    const outcome = await lookupResult({
      ...VALID,
      board: 'karachi-board',
      group: 'commerce',
    })
    expect(outcome.kind).toBe('not-announced-for-group')
    if (outcome.kind !== 'not-announced-for-group') return
    expect(outcome.group).toBe('commerce')
    // Observational phrasing: we saw the board not declare it, which is not
    // the same as the board saying it is not out.
    expect(outcome.message).toMatch(/when we last checked/i)
    expect(outcome.message).toMatch(/Commerce/)
  })

  it('routes a declared group to the gazette rather than claiming it is pending', async () => {
    const outcome = await lookupResult({
      ...VALID,
      board: 'karachi-board',
      group: 'pre-medical',
    })
    expect(outcome.kind).toBe('no-lookup-exists')
  })

  it('does not substitute one group’s state for another', async () => {
    const commerce = await lookupResult({ ...VALID, board: 'karachi-board', group: 'commerce' })
    const preMedical = await lookupResult({
      ...VALID,
      board: 'karachi-board',
      group: 'pre-medical',
    })
    expect(commerce.kind).not.toBe(preMedical.kind)
  })
})

describe('a broken parser must never look like a missing result', () => {
  it('classifies a thrown parse error as unavailable, not not-found', async () => {
    __registerTestAdapter(
      testAdapter(() => {
        throw new ResultSourceError('PARSER_FAILURE', { detail: 'selector .result-table missing' })
      }),
    )
    const outcome = await lookupResult(VALID)
    expect(outcome.kind).toBe('source-unavailable')
    expect(outcome.kind).not.toBe('not-found')
  })

  it('classifies an unexpected exception as a parser failure, not a missing result', async () => {
    __registerTestAdapter(
      testAdapter(() => {
        throw new Error('Cannot read properties of undefined (reading textContent)')
      }),
    )
    const outcome = await lookupResult(VALID)
    expect(outcome.kind).toBe('source-unavailable')
  })

  it('never surfaces internal failure detail to the reader', async () => {
    __registerTestAdapter(
      testAdapter(() => {
        throw new ResultSourceError('SOURCE_BAD_RESPONSE', {
          detail: 'VIEWSTATE mismatch at /Result/ResultCard.aspx line 412',
        })
      }),
    )
    const outcome = await lookupResult(VALID)
    if (outcome.kind === 'found' || outcome.kind === 'invalid-request')
      throw new Error('unexpected')
    expect(outcome.message).not.toMatch(/VIEWSTATE|aspx|line \d+/i)
  })

  it('rejects a record with no provenance instead of displaying it', async () => {
    __registerTestAdapter(testAdapter(async () => syntheticRecord({ sourceId: '', sourceUrl: '' })))
    const outcome = await lookupResult(VALID)
    expect(outcome.kind).not.toBe('found')
    expect(outcome.kind).toBe('source-unavailable')
  })

  it('rejects a record citing a source that is not in the registry', async () => {
    __registerTestAdapter(
      testAdapter(async () => syntheticRecord({ sourceId: 'some-aggregator-site' })),
    )
    const outcome = await lookupResult(VALID)
    expect(outcome.kind).not.toBe('found')
  })

  it('returns not-found ONLY from an adapter that completed and reported none', async () => {
    __registerTestAdapter(testAdapter(async () => null))
    const outcome = await lookupResult(VALID)
    expect(outcome.kind).toBe('not-found')
    if (outcome.kind !== 'not-found') return
    // Even here the reader is told to confirm on the board's own portal, and
    // is never told they failed.
    expect(outcome.message).not.toMatch(/\bfail/i)
    expect(outcome.fallbacks.length).toBeGreaterThan(0)
  })

  it('passes a well-formed record through with its provenance intact', async () => {
    __registerTestAdapter(testAdapter(async () => syntheticRecord()))
    const outcome = await lookupResult(VALID)
    expect(outcome.kind).toBe('found')
    if (outcome.kind !== 'found') return
    expect(outcome.record.sourceId).toBe('lahore-result-portal')
    expect(outcome.record.sourceUrl).toMatch(/^https:\/\//)
  })
})

describe('the circuit breaker protects the board, not us', () => {
  it('opens after repeated upstream failures and stops calling', async () => {
    let calls = 0
    __registerTestAdapter(
      testAdapter(() => {
        calls += 1
        throw new ResultSourceError('SOURCE_TIMEOUT')
      }),
    )

    for (let i = 0; i < CIRCUIT_BREAKER_THRESHOLD; i += 1) {
      await lookupResult(VALID)
    }
    expect(circuitState('lahore-result-portal')).toBe('open')

    const callsBefore = calls
    const outcome = await lookupResult(VALID)
    expect(calls, 'kept calling an overloaded board').toBe(callsBefore)
    expect(outcome.kind).toBe('source-unavailable')
  })

  it('does not let malformed input take a healthy source offline', async () => {
    __registerTestAdapter(testAdapter(async () => syntheticRecord()))
    for (let i = 0; i < CIRCUIT_BREAKER_THRESHOLD + 2; i += 1) {
      await lookupResult({ ...VALID, rollNumber: '!' })
    }
    expect(circuitState('lahore-result-portal')).toBe('closed')
  })

  it('recovers to half-open after the cooldown', async () => {
    __registerTestAdapter(
      testAdapter(() => {
        throw new ResultSourceError('SOURCE_OFFLINE')
      }),
    )
    const start = new Date('2026-09-14T00:00:00.000Z')
    for (let i = 0; i < CIRCUIT_BREAKER_THRESHOLD; i += 1) {
      await lookupResult(VALID, { now: start })
    }
    expect(circuitState('lahore-result-portal', start.getTime())).toBe('open')
    expect(circuitState('lahore-result-portal', start.getTime() + 10 * 60 * 1000)).toBe('half-open')
  })
})

describe('the kill switch', () => {
  it('stops upstream calls without removing the page or its fallbacks', async () => {
    __registerTestAdapter(testAdapter(async () => syntheticRecord()))
    expect((await lookupResult(VALID)).kind).toBe('found')

    disableAdapter('bise-lahore')
    const outcome = await lookupResult(VALID)
    expect(outcome.kind).toBe('unsupported')
    if (outcome.kind !== 'unsupported') return
    expect(outcome.fallbacks.length).toBeGreaterThan(0)

    enableAdapter('bise-lahore')
    expect((await lookupResult(VALID)).kind).toBe('found')
  })
})

describe('SSRF guard', () => {
  const adapter = testAdapter(async () => null)

  it('accepts an allowlisted https host', () => {
    expect(assertAllowedUrl(adapter, 'https://biselahore.com/result').hostname).toBe(
      'biselahore.com',
    )
  })

  it.each([
    ['http', 'http://biselahore.com/result'],
    ['an internal address', 'https://169.254.169.254/latest/meta-data/'],
    ['localhost', 'https://localhost:8080/'],
    ['a look-alike host', 'https://biselahore.com.evil.test/result'],
    ['a file URL', 'file:///etc/passwd'],
    ['garbage', 'not a url'],
  ])('refuses %s', (_label, url) => {
    expect(() => assertAllowedUrl(adapter, url)).toThrow()
  })
})

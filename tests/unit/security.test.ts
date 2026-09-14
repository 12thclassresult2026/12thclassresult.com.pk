import { beforeEach, describe, expect, it } from 'vitest'

import { __resetRateLimitState, clientKey, rateLimit } from '@/lib/security/rate-limit'
import { MAX_LOOKUP_BODY_BYTES, resultQuerySchema } from '@/lib/validation/result-query'

beforeEach(() => {
  __resetRateLimitState()
})

describe('rateLimit', () => {
  it('allows up to the limit and refuses beyond it', () => {
    const now = 1_000_000
    for (let i = 0; i < 3; i += 1) {
      expect(rateLimit('k', 3, 60_000, now).allowed).toBe(true)
    }
    expect(rateLimit('k', 3, 60_000, now).allowed).toBe(false)
  })

  it('opens a fresh window once the old one expires', () => {
    const now = 1_000_000
    rateLimit('k', 1, 60_000, now)
    expect(rateLimit('k', 1, 60_000, now).allowed).toBe(false)
    expect(rateLimit('k', 1, 60_000, now + 60_001).allowed).toBe(true)
  })
})

describe('clientKey', () => {
  it('prefers the Cloudflare client address', () => {
    const request = new Request('https://x/', {
      headers: { 'cf-connecting-ip': '203.0.113.9', 'x-forwarded-for': '198.51.100.1' },
    })
    expect(clientKey(request, 'result')).toBe('result:203.0.113.9')
  })

  it('never includes a candidate identifier', () => {
    const request = new Request('https://x/', {
      headers: { 'cf-connecting-ip': '203.0.113.9' },
    })
    const key = clientKey(request, 'result')
    expect(key).not.toMatch(/\d{6,}/)
  })
})

describe('resultQuerySchema', () => {
  it('accepts a known board and normalizes the roll number', () => {
    const parsed = resultQuerySchema.parse({
      board: 'Lahore-Board',
      year: '2026',
      examination: 'annual',
      rollNumber: ' ab-12345 ',
    })
    expect(parsed.board).toBe('lahore-board')
    expect(parsed.rollNumber).toBe('AB-12345')
    expect(parsed.year).toBe(2026)
  })

  it('rejects a well-formed slug that is not a registered board', () => {
    const result = resultQuerySchema.safeParse({
      board: 'not-a-real-board',
      year: 2026,
      examination: 'annual',
      rollNumber: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an out-of-range year', () => {
    expect(
      resultQuerySchema.safeParse({
        board: 'lahore-board',
        year: 1990,
        examination: 'annual',
        rollNumber: '123456',
      }).success,
    ).toBe(false)
  })

  it('rejects a roll number containing punctuation used for injection', () => {
    expect(
      resultQuerySchema.safeParse({
        board: 'lahore-board',
        year: 2026,
        examination: 'annual',
        rollNumber: "1234' OR '1'='1",
      }).success,
    ).toBe(false)
  })

  it('caps the request body well below anything a real query needs', () => {
    expect(MAX_LOOKUP_BODY_BYTES).toBeLessThanOrEqual(8192)
  })
})

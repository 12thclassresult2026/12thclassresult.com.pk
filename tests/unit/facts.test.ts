import { describe, expect, it } from 'vitest'

import {
  capabilityLabel,
  identifierRequirementSentence,
  isAdvertisable,
} from '@/lib/result/capability-label'
import {
  factQualifier,
  isConfirmed,
  isSourced,
  supportsCountdown,
  unknownFact,
} from '@/lib/result/verified-fact'

describe('unknownFact', () => {
  it('is the safe default: no value, no source', () => {
    const fact = unknownFact<string>()
    expect(fact.value).toBeNull()
    expect(fact.status).toBe('unknown')
    expect(fact.sourceId).toBeNull()
    expect(isConfirmed(fact)).toBe(false)
  })
})

describe('isConfirmed', () => {
  it('requires a value and a source, not just the status', () => {
    expect(
      isConfirmed({
        value: null,
        status: 'confirmed',
        sourceId: 'x',
        sourceUrl: 'https://x',
        sourcePublishedAt: null,
        checkedAt: '2026-09-14',
      }),
    ).toBe(false)
  })

  it('is false for a tentative fact', () => {
    expect(
      isConfirmed({
        value: '2026-10-22',
        status: 'tentative',
        sourceId: 'x',
        sourceUrl: 'https://x',
        sourcePublishedAt: '2026-03-01',
        checkedAt: '2026-09-14',
      }),
    ).toBe(false)
  })
})

describe('supportsCountdown', () => {
  it('refuses a tentative date — a countdown is an unqualified promise', () => {
    expect(
      supportsCountdown({
        value: '2026-10-22',
        status: 'tentative',
        sourceId: 'pbcc',
        sourceUrl: 'https://example.gov',
        sourcePublishedAt: '2026-03-01',
        checkedAt: '2026-09-14',
      }),
    ).toBe(false)
  })

  it('refuses an unknown date', () => {
    expect(supportsCountdown(unknownFact<string>())).toBe(false)
  })
})

describe('isSourced', () => {
  it('narrows away the nulls so a caller cannot render an empty source link', () => {
    const fact = {
      value: '2026-10-22',
      status: 'tentative' as const,
      sourceId: 'pbcc',
      sourceUrl: 'https://example.gov',
      sourcePublishedAt: '2026-03-01',
      checkedAt: '2026-09-14',
    }
    expect(isSourced(fact)).toBe(true)
    if (isSourced(fact)) {
      expect(fact.sourceUrl.startsWith('https://')).toBe(true)
    }
  })

  it('rejects an unknown fact', () => {
    expect(isSourced(unknownFact<string>())).toBe(false)
  })
})

describe('factQualifier', () => {
  it('never calls a tentative fact official', () => {
    expect(factQualifier('tentative')).toBe('Tentative')
    expect(factQualifier('confirmed')).toBe('Official')
    expect(factQualifier('expected')).toBe('Expected')
    expect(factQualifier('unknown')).toBe('Not announced')
  })
})

describe('capabilityLabel', () => {
  it('renders an unverified capability as "Not verified", never "No"', () => {
    expect(capabilityLabel(null)).toBe('Not verified')
    expect(capabilityLabel(false)).toBe('No')
    expect(capabilityLabel(true)).toBe('Yes')
  })

  it('only advertises an explicit true', () => {
    expect(isAdvertisable(null)).toBe(false)
    expect(isAdvertisable(false)).toBe(false)
    expect(isAdvertisable(true)).toBe(true)
  })
})

describe('identifierRequirementSentence', () => {
  it('says nothing when nothing is verified', () => {
    expect(
      identifierRequirementSentence({
        requiresAdditionalIdentifier: null,
        hasCaptcha: null,
      }),
    ).toBeNull()
  })

  it('warns only about what was actually observed', () => {
    const sentence = identifierRequirementSentence({
      requiresAdditionalIdentifier: true,
      hasCaptcha: null,
    })
    expect(sentence).toContain('B-Form')
    expect(sentence).not.toContain('security check')
  })
})

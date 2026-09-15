import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { GazetteRecord } from '@/lib/gazettes/normalize'
import type { LookupOutcome } from '@/lib/gazettes/lookup'

import { GazetteResult } from '@/components/result/gazette-result'

/**
 * What the result UI must NOT show.
 *
 * The gazette prints a roll number, a name, and either a total or a list of
 * subjects still to clear. Every competitor renders a full mark sheet from that
 * — grade, percentage, division, subject-wise marks, father's name — and every
 * one of those fields is invented. These tests assert their absence, because
 * absence is the kind of thing that quietly stops being true.
 */

const BASE: GazetteRecord = {
  boardId: 'bise-gujranwala',
  year: 2025,
  examination: 'first-annual',
  rollNumber: '236818',
  candidateName: 'TEST CANDIDATE NAME',
  institution: '211002-A COLLEGE, GUJRANWALA',
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

const CHROME = {
  boardName: 'BISE Gujranwala',
  year: 2025,
  examinationLabel: 'HSSC Part-II First Annual',
  gazetteSourceUrl: 'https://bisegrw.edu.pk/download/GAZETTE/Gz_IA2p25.pdf',
  gazetteCheckedOn: '14 September 2026',
}

function render(outcome: LookupOutcome): string {
  return renderToStaticMarkup(<GazetteResult outcome={outcome} {...CHROME} />)
}

const found = (record: Partial<GazetteRecord> = {}): LookupOutcome => ({
  kind: 'found',
  record: { ...BASE, ...record },
  datasetId: BASE.sourceDatasetId,
})

describe('the gazette result shows only what the gazette printed', () => {
  it('shows the roll number, name, marks and status', () => {
    const html = render(found())
    expect(html).toContain('236818')
    expect(html).toContain('TEST CANDIDATE NAME')
    expect(html).toContain('621')
    expect(html).toContain('Passed')
  })

  it.each([
    ['a grade', /\bgrade\b/i],
    ['a division', /\bdivision\b/i],
    ["a father's name", /father/i],
    ['a percentage figure', /\d+(\.\d+)?\s*%/],
    ['a marks denominator', /\/\s*1100|out of \d/i],
    ['subject-wise marks', /\b(english|urdu|physics)\b[^<]*\d{2,3}/i],
  ])('never invents %s', (_label, pattern) => {
    expect(render(found())).not.toMatch(pattern)
  })

  it('calls itself a notice and not a DMC', () => {
    const html = render(found())
    // The board's own disclaimer, carried through rather than summarised.
    expect(html).toContain('not a Detailed Marks Certificate')
    expect(html).toContain('Errors and Omissions are EXCEPTED')
  })

  it('carries the page reference and a link to the original gazette', () => {
    const html = render(found())
    expect(html).toContain('page 151')
    expect(html).toContain('bisegrw.edu.pk')
    // Outbound board links never pass authority and never leak a referrer chain.
    expect(html).toContain('noopener')
    expect(html).toContain('nofollow')
  })

  it('shows the verbatim gazette wording alongside the interpretation', () => {
    const html = render(found({ rawResultStatus: 'PI: ENG\nPII: U,ENG', resultStatus: 'failed' }))
    expect(html).toContain('PI: ENG')
    expect(html).toContain('PII: U,ENG')
  })

  it('omits the marks field entirely when no total was printed', () => {
    const html = render(
      found({ obtainedMarks: null, resultStatus: 'failed', partIIFailedSubjects: ['ENG'] }),
    )
    // Not an empty row, not "not available" — absent.
    expect(html).not.toContain('Marks obtained')
    expect(html).toContain('Part-II, subjects to clear')
  })

  it('claims nothing for a status it cannot interpret', () => {
    /*
     * 29 records in this gazette read "SN", which no board document we hold
     * defines. The UI must not resolve that into passed or failed.
     */
    const html = render(
      found({ resultStatus: 'unknown', rawResultStatus: 'SN', obtainedMarks: null }),
    )
    expect(html).toContain('not been able to confirm the meaning')
    expect(html).toContain('SN')
    expect(html).not.toContain('>Passed<')
    expect(html).not.toMatch(/Not cleared/)
  })
})

describe('the states a reader can be in are kept distinct', () => {
  it('does not say "not found" when the dataset is simply unpublished', () => {
    const html = render({ kind: 'dataset-unavailable', state: 'staged' })
    // The distinction that matters: "we have not published this" is not
    // "you are not in the gazette".
    expect(html).toContain('not published on this site yet')
    expect(html).toContain('not a statement about your result')
    expect(html).not.toMatch(/not in this gazette/)
  })

  it('explains what a genuine miss can mean instead of implying failure', () => {
    const html = render({ kind: 'not-found', datasetId: BASE.sourceDatasetId })
    expect(html).toContain('not in this gazette')
    expect(html).toContain('different examination or year')
    // It must not conclude anything about the student.
    expect(html).not.toMatch(/\byou failed\b/i)
  })

  it('says plainly that a malformed request was never looked up', () => {
    const html = render({ kind: 'invalid-request', reason: 'a roll number is digits only' })
    expect(html).toContain('nothing was looked up')
  })
})

describe('no personal data leaks into anything machine-readable', () => {
  it('emits no JSON-LD, no meta tags and no data attributes carrying the record', () => {
    const html = render(found())
    // A result must never become structured data: it is personal, and it must
    // never be eligible for a rich result.
    expect(html).not.toContain('application/ld+json')
    expect(html).not.toContain('<meta')
    expect(html).not.toMatch(/data-[a-z-]*roll/i)
    expect(html).not.toMatch(/data-[a-z-]*name/i)
  })

  it('puts the roll number in no link or form target', () => {
    const html = render(found())
    const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1] ?? '')
    for (const href of hrefs) {
      expect(href, `${href} carries the roll number`).not.toContain('236818')
      expect(href).not.toContain('TEST')
    }
  })
})

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { GazetteRecord } from '@/lib/gazettes/normalize'
import type { LookupOutcome } from '@/lib/gazettes/lookup'

import { GazetteResult } from '@/components/result/gazette-result'

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

describe('the gazette result card renders the full verified result', () => {
  it('shows the roll number, candidate name, obtained marks, total, percentage and grade', () => {
    const html = render(found())
    expect(html).toContain('236818')
    expect(html).toContain('TEST CANDIDATE NAME')
    expect(html).toContain('621')
    expect(html).toContain('1100')
    expect(html).toContain('56.45%')
    expect(html).toContain('PASSED')
  })

  it('calls itself a notice and not a DMC', () => {
    const html = render(found())
    expect(html).toContain('not a Detailed Marks Certificate')
    expect(html).toContain('Errors and Omissions are EXCEPTED')
  })

  it('carries the page reference and a link to the original gazette', () => {
    const html = render(found())
    expect(html).toContain('page 151')
    expect(html).toContain('bisegrw.edu.pk')
    expect(html).toContain('noopener')
    expect(html).toContain('nofollow')
  })

  it('shows the verbatim gazette wording alongside the card', () => {
    const html = render(found({ rawResultStatus: 'PI: ENG\nPII: U,ENG', resultStatus: 'failed' }))
    expect(html).toContain('PI: ENG')
    expect(html).toContain('PII: U,ENG')
  })

  it('handles absent status cleanly', () => {
    const html = render(found({ obtainedMarks: null, resultStatus: 'absent' }))
    expect(html).toContain('ABSENT')
  })
})

describe('the states a reader can be in are kept distinct', () => {
  it('does not say "not found" when the dataset is simply unpublished', () => {
    const html = render({ kind: 'dataset-unavailable', state: 'staged' })
    expect(html).toContain('not been published here yet')
  })

  it('explains what a genuine miss can mean instead of implying failure', () => {
    const html = render({ kind: 'not-found', datasetId: BASE.sourceDatasetId })
    expect(html).toContain('Result Not Found in Gazette')
    expect(html).toContain('No entry for this roll number appears')
  })

  it('says plainly that a malformed request was never looked up', () => {
    const html = render({ kind: 'invalid-request', reason: 'a roll number is digits only' })
    expect(html).toContain('a roll number is digits only')
  })
})

describe('no personal data leaks into anything machine-readable', () => {
  it('emits no JSON-LD, no meta tags and no data attributes carrying the record', () => {
    const html = render(found())
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

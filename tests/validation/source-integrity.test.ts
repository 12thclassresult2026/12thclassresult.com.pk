import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { BOARDS, datasetsFor, gazetteOnlyBoards, getBoardById } from '@/lib/board/registry'
import { isConfirmed } from '@/lib/result/verified-fact'
import {
  RESULT_SOURCES,
  getSource,
  linkableSources,
  rollNumberSources,
  serverIntegrableSources,
} from '@/lib/result-sources/registry'

describe('board registry', () => {
  it('has unique ids and slugs', () => {
    expect(new Set(BOARDS.map((b) => b.id)).size).toBe(BOARDS.length)
    expect(new Set(BOARDS.map((b) => b.slug)).size).toBe(BOARDS.length)
  })

  it('keeps Dera Ghazi Khan unmistakable from Dera Ismail Khan', () => {
    const slugs = BOARDS.map((b) => b.slug)
    for (const slug of slugs) {
      for (const other of slugs) {
        if (slug === other) continue
        expect(slug.includes(other)).toBe(false)
      }
    }
  })

  it('does not register the Karachi secondary board, which is matric only', () => {
    // Sending a 12th-class reader to a board that does not award HSSC would be
    // a serious error. `karachi-board` is the INTERMEDIATE board.
    const karachi = BOARDS.find((b) => b.slug === 'karachi-board')
    expect(karachi?.id).toBe('biek')
    expect(BOARDS.some((b) => b.id === 'bsek')).toBe(false)
  })

  it('registers no Gilgit-Baltistan board, because none awards HSSC', () => {
    expect(BOARDS.some((b) => b.province === 'gilgit-baltistan')).toBe(false)
  })

  it('gives every board an https official website', () => {
    for (const board of BOARDS) {
      expect(board.officialWebsite.startsWith('https://')).toBe(true)
    }
  })

  it('resolves every referenced source id', () => {
    for (const board of BOARDS) {
      for (const id of board.sourceIds) {
        expect(getSource(id), `${board.id} references missing source ${id}`).toBeDefined()
      }
    }
  })
})

describe('board access model', () => {
  it('assigns every board an access model', () => {
    for (const board of BOARDS) {
      expect(board.accessModel, `${board.id} has no access model`).toBeTruthy()
      expect(board.declarationModel, `${board.id} has no declaration model`).toBeTruthy()
    }
  })

  it('never claims roll-number support for a gazette-only board', () => {
    // The central correctness rule of this architecture. Karachi, Hyderabad and
    // AJK have no lookup form at all; offering one would be a lie.
    for (const board of gazetteOnlyBoards()) {
      for (const dataset of board.resultDatasets) {
        expect(
          dataset.methodsConfirmed.rollNumber,
          `${board.id} claims roll-number support but is gazette-only`,
        ).not.toBe('verified-supported')
      }
      expect(rollNumberSources(board.id)).toEqual([])
    }
  })

  it('gives a per-group board more than one dataset for a declared year', () => {
    for (const board of BOARDS.filter((b) => b.declarationModel === 'per-group')) {
      const declared = board.resultDatasets.filter((d) => d.released.status === 'confirmed')
      if (declared.length > 0) {
        expect(
          board.resultDatasets.length,
          `${board.id} declares per group but has one flattened dataset`,
        ).toBeGreaterThan(1)
      }
    }
  })

  it('never gives a per-group board a board-wide confirmed result date', () => {
    // A board that declares group by group has no single board-wide date. One
    // Karachi group was still undeclared while six others were out.
    for (const board of BOARDS.filter((b) => b.declarationModel === 'per-group')) {
      expect(isConfirmed(board.resultDate)).toBe(false)
    }
  })

  it('records Karachi group declarations as separate dated facts', () => {
    const datasets = datasetsFor('biek', 2026)
    expect(datasets.length).toBeGreaterThanOrEqual(6)
    const declared = datasets.filter((d) => d.released.status === 'confirmed')
    const undeclared = datasets.filter((d) => d.released.status !== 'confirmed')
    expect(declared.length).toBeGreaterThan(0)
    // The whole point: at least one group had NOT declared while others had.
    expect(undeclared.length).toBeGreaterThan(0)
    // Declared groups carry genuinely different dates, not one copied value.
    const dates = new Set(declared.map((d) => d.declaredAt.value))
    expect(dates.size).toBeGreaterThan(1)
    for (const d of declared) {
      expect(d.declaredAt.sourceId).not.toBeNull()
      expect(d.group).not.toBeNull()
    }
  })
})

describe('volatile fact policy', () => {
  it('never reports a confirmed fact without a source and a check timestamp', () => {
    for (const board of BOARDS) {
      for (const fact of [board.resultDate, board.smsCode, board.gazetteAvailable]) {
        if (fact.status === 'confirmed') {
          expect(fact.sourceId).not.toBeNull()
          expect(fact.sourceUrl).not.toBeNull()
          expect(fact.checkedAt).not.toBeNull()
        }
      }
    }
  })

  it('never lets an unknown fact carry a value', () => {
    for (const board of BOARDS) {
      for (const fact of [board.resultDate, board.smsCode, board.gazetteAvailable]) {
        if (fact.status === 'unknown') expect(fact.value).toBeNull()
      }
    }
  })

  it('publishes NO SMS shortcode, because none was found on any board domain', () => {
    for (const board of BOARDS) {
      expect(isConfirmed(board.smsCode)).toBe(false)
      expect(board.smsCode.value).toBeNull()
    }
  })

  it('claims a confirmed 2026 result date only where a board published a notification', () => {
    // Exactly one board was observed to have declared its HSSC 2026 result.
    // Every other board's date stays unknown — including the nine Punjab boards
    // for which the market publishes three mutually contradictory dates.
    const confirmed = BOARDS.filter((b) => isConfirmed(b.resultDate)).map((b) => b.id)
    expect(confirmed).toEqual(['bbise'])

    const quetta = getBoardById('bbise')!
    expect(quetta.resultDate.sourceId).not.toBeNull()
    expect(quetta.resultDate.sourceUrl).not.toBeNull()
    expect(quetta.resultDate.sourcePublishedAt).not.toBeNull()
    expect(quetta.resultDate.checkedAt).not.toBeNull()
  })

  it('never infers a dataset method from a portal’s form options', () => {
    // Engine capability must never inherit down to the dataset: a dropdown
    // offering "12th" and "2026" is a cross-product of options, not evidence
    // that a dataset exists behind it.
    for (const board of BOARDS) {
      for (const dataset of board.resultDatasets) {
        if (dataset.released.status !== 'confirmed') {
          const claimed = Object.entries(dataset.methodsConfirmed).filter(
            ([, v]) => v === 'verified-supported',
          )
          expect(claimed, `${board.id} claims a method for an unconfirmed dataset`).toEqual([])
        }
      }
    }
  })
})

describe('source registry', () => {
  it('has unique ids and https URLs', () => {
    expect(new Set(RESULT_SOURCES.map((s) => s.id)).size).toBe(RESULT_SOURCES.length)
    for (const source of RESULT_SOURCES) {
      expect(source.url.startsWith('https://')).toBe(true)
    }
  })

  it('points every source at a registered board', () => {
    for (const source of RESULT_SOURCES) {
      expect(getBoardById(source.boardId), `orphan source ${source.id}`).toBeDefined()
    }
  })

  it('never labels a source official without proven ownership', () => {
    for (const source of RESULT_SOURCES) {
      if (source.isOfficial) expect(source.ownershipStatus).toBe('verified')
    }
  })

  it('never claims a capability on a source that was not observed', () => {
    for (const source of RESULT_SOURCES.filter((s) => s.observedVia === 'not-observed')) {
      for (const cap of [
        source.supportsRollNumber,
        source.supportsName,
        source.supportsSms,
        source.supportsGazette,
        source.hasCaptcha,
      ]) {
        expect(cap, `${source.id} claims a capability it never observed`).not.toBe(
          'verified-supported',
        )
        expect(cap).not.toBe('verified-unsupported')
      }
      expect(source.examLevelsObserved).toEqual([])
      expect(source.yearsObserved).toEqual([])
    }
  })

  it('marks a source blocked rather than unknown when the host refuses us', () => {
    // "We have not checked" and "the board prevents us from checking" are
    // different facts, and the second is what needs a human with a browser.
    for (const source of RESULT_SOURCES.filter((s) => s.status === 'blocked')) {
      expect(source.supportsRollNumber, `${source.id} should be blocked`).toBe('blocked')
      expect(source.hasCaptcha).toBe('blocked')
    }
  })

  it('never records a successful check on a source that was never reached', () => {
    for (const source of RESULT_SOURCES) {
      if (source.observedVia === 'not-observed') {
        expect(source.lastSuccessfulCheckAt).toBeNull()
      }
    }
  })

  it('requires a provenance note on every source', () => {
    for (const source of RESULT_SOURCES) {
      expect(source.provenanceNote.length).toBeGreaterThan(40)
    }
  })

  it('never server-integrates a source with a confirmed CAPTCHA', () => {
    for (const source of RESULT_SOURCES) {
      if (source.hasCaptcha === 'verified-supported') {
        expect(source.integrationMode).not.toBe('server-integration')
      }
    }
  })

  it('server-integrates nothing until a CAPTCHA absence is positively verified', () => {
    // A CAPTCHA that did not appear in a markdown-converted fetch is NOT a
    // CAPTCHA that was verified absent. This is a policy state, not a gap.
    expect(serverIntegrableSources()).toEqual([])
  })

  it('offers a roll-number route only from a real result endpoint', () => {
    for (const board of BOARDS) {
      for (const source of rollNumberSources(board.id)) {
        expect(source.sourceType).toBe('official-result')
        expect(source.supportsRollNumber).toBe('verified-supported')
        expect(source.examLevelsObserved).toContain('hssc-part-2')
      }
    }
  })

  it('never puts an unverified host in front of a reader as official', () => {
    for (const board of BOARDS) {
      for (const source of linkableSources(board.id)) {
        expect(source.ownershipStatus).toBe('verified')
        expect(source.isOfficial).toBe(true)
      }
    }
  })
})

/** Walks app/ and components/ as text, with comments stripped. */
function renderedSources(): { file: string; code: string }[] {
  const out: { file: string; code: string }[] = []
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.tsx?$/.test(entry.name)) {
        const raw = readFileSync(full, 'utf8')
        const code = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
        out.push({ file: full, code })
      }
    }
  }
  for (const root of ['app', 'components']) walk(root)
  return out
}

describe('integrity regressions', () => {
  it('hard-codes no SMS shortcode anywhere in rendered output', () => {
    // Every code circulating for these boards on aggregator sites. None was
    // found published on a board domain, so none may appear in the UI.
    const circulating = [
      '5050',
      '80029',
      '800291',
      '80092',
      '8583',
      '800293',
      '800290',
      '8002',
      '800299',
      '800240',
      '800292',
      '800298',
      '800295',
      '800296',
      '9818',
    ]
    for (const { file, code } of renderedSources()) {
      for (const shortcode of circulating) {
        expect(code.includes(shortcode), `${file} contains shortcode ${shortcode}`).toBe(false)
      }
    }
  })

  it('contains no browser-disguise or CAPTCHA-bypass code', () => {
    for (const { file, code } of renderedSources()) {
      expect(code.toLowerCase().includes('user-agent:'), file).toBe(false)
      expect(code.toLowerCase().includes('bypass'), file).toBe(false)
    }
  })

  it('coerces no capability status to a boolean in rendered output', () => {
    // `value ? 'Yes' : 'No'` is the bug the capability module exists to make
    // impossible. It must not reappear in a component.
    for (const { file, code } of renderedSources()) {
      expect(/\?\s*'Yes'\s*:\s*'No'/.test(code), `${file} coerces a capability`).toBe(false)
    }
  })
})

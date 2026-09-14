import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { BOARDS, getBoardById } from '@/lib/board/registry'
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

  it('publishes NO SMS shortcode, because none was found on a board domain', () => {
    for (const board of BOARDS) {
      expect(isConfirmed(board.smsCode)).toBe(false)
      expect(board.smsCode.value).toBeNull()
    }
  })

  it('claims no confirmed HSSC Part-II 2026 result date for any board', () => {
    for (const board of BOARDS) {
      expect(isConfirmed(board.resultDate)).toBe(false)
    }
  })

  it('never infers a dataset method from a portal’s form options', () => {
    for (const board of BOARDS) {
      for (const dataset of board.resultDatasets) {
        if (dataset.released.status !== 'confirmed') {
          const methods = Object.values(dataset.methodsConfirmed)
          expect(methods.every((m) => m === null)).toBe(true)
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
      expect(source.supportsRollNumber).toBeNull()
      expect(source.supportsName).toBeNull()
      expect(source.hasCaptcha).toBeNull()
      expect(source.examLevelsObserved).toEqual([])
      expect(source.yearsObserved).toEqual([])
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
      if (source.hasCaptcha === true) {
        expect(source.integrationMode).not.toBe('server-integration')
      }
    }
  })

  it('server-integrates nothing until a CAPTCHA absence is positively verified', () => {
    // A CAPTCHA that did not appear in a markdown-converted fetch is NOT a
    // CAPTCHA that was verified absent (section 144).
    expect(serverIntegrableSources()).toEqual([])
    for (const source of RESULT_SOURCES) {
      expect(source.hasCaptcha).not.toBe(false)
    }
  })

  it('offers a roll-number route only from a real result endpoint', () => {
    for (const board of BOARDS) {
      for (const source of rollNumberSources(board.id)) {
        expect(source.sourceType).toBe('official-result')
        expect(source.supportsRollNumber).toBe(true)
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
    const circulating = ['5050', '80029', '800291', '80092', '8583', '800293', '800290', '8002']
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
})

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { BOARDS } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import {
  formatBytes,
  GAZETTE_FILES,
  GAZETTE_INDEX_PAGES,
  gazetteFileFor,
} from '@/lib/gazettes/files'

/**
 * A download button must download something.
 *
 * THE FAILURE THIS GUARDS AGAINST HAS HAPPENED TWICE HERE.
 *
 * First, twenty-four "Download Gazette" buttons shipped with invented file
 * sizes beside boards whose gazettes the site did not hold. Then, after that
 * was cleaned up, the button survived but pointed at
 * `/results/<board>/12th-class#gazette` — an anchor on one of our own pages.
 * A student tapping "Download Gazette" got a page about gazettes.
 *
 * Both versions looked completely fine in a screenshot, which is why they
 * lasted. The rules below check the thing a screenshot cannot show: that the
 * href leaves for the board's own server, and that the number beside it was
 * measured rather than guessed.
 */

const REPO_ROOT = process.cwd()

function userFacingSources(): string[] {
  const out: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (entry.endsWith('.tsx')) out.push(full)
    }
  }
  for (const dir of ['app', 'components']) walk(join(REPO_ROOT, dir))
  return out
}

const read = (path: string) => readFileSync(join(REPO_ROOT, path), 'utf8')

describe('every gazette download points at a real file on a board domain', () => {
  it('registers only absolute https URLs', () => {
    for (const file of GAZETTE_FILES) {
      expect(file.url, `${file.boardId} gazette URL is not absolute https`).toMatch(/^https:\/\//)
      // An internal path here is the exact bug that shipped: a "download" that
      // navigates to one of our own pages.
      expect(file.url).not.toContain('12thclassresult.com.pk')
    }
  })

  it('names a board this site actually knows', () => {
    const known = new Set(BOARDS.map((b) => b.id))
    for (const file of GAZETTE_FILES) {
      expect(known, `${file.boardId} is not a registered board`).toContain(file.boardId)
    }
    for (const page of GAZETTE_INDEX_PAGES) {
      expect(known, `${page.boardId} is not a registered board`).toContain(page.boardId)
    }
  })

  it('carries a measured byte count and a date it was checked', () => {
    /*
     * `bytes` must be the Content-Length the board's own server returned. A
     * round number is the signature of an estimate, and an estimate is how
     * "4.2 MB" ended up under twenty-four boards.
     */
    for (const file of GAZETTE_FILES) {
      expect(file.bytes, `${file.boardId} has no file size`).toBeGreaterThan(100_000)
      expect(file.verifiedAt, `${file.boardId} has no check date`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('serves each board at most one file, so no two rows contradict', () => {
    const seen = new Set<string>()
    for (const file of GAZETTE_FILES) {
      expect(seen, `${file.boardId} has two gazette files registered`).not.toContain(file.boardId)
      seen.add(file.boardId)
    }
  })

  it('formats sizes from the real number rather than a literal', () => {
    expect(formatBytes(14_469_020)).toBe('14 MB')
    expect(formatBytes(29_366_704)).toBe('28 MB')
    // Small files keep a decimal, so a 900 KB file does not read as "1 MB".
    expect(formatBytes(1_572_864)).toBe('1.5 MB')
  })
})

describe('no component invents a gazette download', () => {
  it('hard-codes no file size in visible copy', () => {
    /*
     * A size may only reach a page through `formatBytes(file.bytes)`. Typed,
     * it is a claim about a file nobody measured — and it reads as precise
     * exactly because it has a decimal point in it.
     */
    const TYPED_SIZE = /\b\d+(?:\.\d+)?\s*(?:MB|KB|GB)\b/
    const offenders: string[] = []

    for (const file of userFacingSources()) {
      const copy = readFileSync(file, 'utf8')
        .replace(/\{?\/\*[\s\S]*?\*\/\}?/g, '')
        .replace(/^\s*\/\/.*$/gm, '')
      const match = TYPED_SIZE.exec(copy)
      if (match) {
        offenders.push(
          `${file.replace(REPO_ROOT, '').replace(/\\/g, '/')}: ${JSON.stringify(match[0])}`,
        )
      }
    }

    expect(
      offenders,
      `a file size is typed into a component:\n  ${offenders.join('\n  ')}\n` +
        `Sizes must come from lib/gazettes/files.ts, where each one is the Content-Length the board's server returned.`,
    ).toEqual([])
  })

  it('labels a download button only where a file exists', () => {
    /*
     * The homepage card and the /gazette page both decide this from
     * `gazetteFileFor`. If either starts rendering the words "Download
     * Gazette" or "Download PDF" without consulting it, boards with no file
     * get a button that goes nowhere useful again.
     */
    for (const path of ['components/home/gazette-section.tsx', 'app/gazette/page.tsx']) {
      const source = read(path)
      if (!/Download\s+(?:Gazette|PDF|gazette)/i.test(source)) continue
      expect(source, `${path} offers a download without checking gazetteFileFor`).toMatch(
        /gazetteFileFor/,
      )
    }
  })

  it('opens board files in a new tab without passing link equity', () => {
    // These are other people's servers, and their URLs get renamed without
    // notice; `nofollow` keeps the site from vouching for a moving target.
    const page = read('app/gazette/page.tsx')
    const anchors = [...page.matchAll(/<a\s[^>]*href=\{[^}]*\}[^>]*>/g)].map((m) => m[0])
    expect(anchors.length, 'the downloads page has no outbound links at all').toBeGreaterThan(0)
    for (const anchor of anchors) {
      expect(anchor, `an outbound link is missing rel: ${anchor.slice(0, 80)}`).toContain(
        'nofollow',
      )
      expect(anchor).toContain('noopener')
    }
  })
})

describe('the downloads page is reachable and honest', () => {
  it('is registered, published and indexable', () => {
    const page = requirePage('gazette-downloads')
    expect(page.path).toBe('/gazette')
    expect(page.status).toBe('published')
    expect(page.index).toBe(true)
  })

  it('is linked from the navigation rather than orphaned', () => {
    /*
     * The nav already said "Gazette — Download official gazettes" while
     * pointing at `/#gazette`, an anchor on the homepage. The page existing is
     * no use if the menu still sends people to the old anchor.
     */
    for (const path of [
      'components/layout/header-mega-menu.tsx',
      'components/layout/mobile-nav.tsx',
    ]) {
      const source = read(path)
      expect(source, `${path} still links to the old homepage anchor`).not.toContain("'/#gazette'")
    }
  })

  it('tells the truth about boards with no file', () => {
    /*
     * Ten datasets are loaded but only a couple of boards publish a gazette
     * file that can be opened. The page must not imply otherwise — every board
     * without a file is listed as not published here, with somewhere real to
     * go instead.
     */
    const withoutFile = BOARDS.filter((b) => gazetteFileFor(b.id) === null)
    expect(withoutFile.length, 'this rule is passing vacuously').toBeGreaterThan(0)

    const page = read('app/gazette/page.tsx')
    expect(page).toContain('Not published here')
    // Every board without a file still needs a destination: its own website.
    for (const board of withoutFile) {
      expect(
        board.officialWebsite,
        `${board.shortName} has no official website to fall back to`,
      ).toBeTruthy()
    }
  })
})

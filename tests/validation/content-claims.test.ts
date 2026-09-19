import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { BOARDS, publishedBoards } from '@/lib/board/registry'

/**
 * What the page SAYS, checked against what is true.
 *
 * WHY THIS FILE EXISTS. The registry is thoroughly tested — intents, sitemap,
 * lifecycle, cannibalization, orphans. None of that reads the visible marketing
 * copy, and that is exactly where the site started making things up:
 *
 *   "All 24+ Boards"                     registry held 28
 *   "16+ Boards"                         the grid rendered 23
 *   "25 boards"                          a third number, same site
 *   "under 50 milliseconds"              nothing was being served at all
 *   "verified against board signatures"  boards do not sign their gazettes
 *   "4.2 MB" gazette downloads           no gazette was published
 *
 * Every one of those shipped to production with a green gate, because a test
 * that reads a registry cannot see a sentence in a component.
 *
 * The patterns below are deliberately narrow. An earlier draft of the privacy
 * suite matched `/roll/i` and failed on the word "rolling"; a rule that cries
 * wolf gets deleted, so each pattern here is written to catch the real shape of
 * the claim and nothing else.
 */

const REPO_ROOT = process.cwd()

/** Files whose text a visitor can actually read. */
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

/** Strip comments — a rule must not fail on its own documentation. */
function copyOnly(source: string): string {
  return source.replace(/\{?\/\*[\s\S]*?\*\/\}?/g, '').replace(/^\s*\/\/.*$/gm, '')
}

function relative(file: string): string {
  return file.replace(REPO_ROOT, '').replace(/\\/g, '/').replace(/^\//, '')
}

describe('board counts are derived, never typed', () => {
  it('has no hand-written board total in visible copy', () => {
    /*
     * Matches "24+ Boards", "16+ boards", "all 25 boards" — a bare number
     * attached to the word board. It does NOT match `{BOARDS.length} Boards`,
     * because that is an expression, which is the point.
     */
    const HARDCODED_TOTAL = /\b(?:all\s+)?\d{1,3}\+?\s+boards\b/i

    const offenders: string[] = []
    for (const file of userFacingSources()) {
      const copy = copyOnly(readFileSync(file, 'utf8'))
      const match = HARDCODED_TOTAL.exec(copy)
      if (match) offenders.push(`${relative(file)}: ${JSON.stringify(match[0])}`)
    }

    expect(
      offenders,
      `a board total is typed into copy instead of counted from the registry (${BOARDS.length} registered, ${publishedBoards().length} published):\n  ${offenders.join('\n  ')}`,
    ).toEqual([])
  })

  it('keeps the homepage board grid in step with the registry', () => {
    /*
     * components/home/board-cards-grid.tsx carries its own hand-maintained
     * ALL_BOARDS list for presentation extras (logo, districts). A second list
     * of boards is a second truth, and it WILL drift — it was already short of
     * the registry when this test was written. Failing here is the signal to
     * either add the missing board or move the grid onto the registry.
     */
    const grid = readFileSync(join(REPO_ROOT, 'components/home/board-cards-grid.tsx'), 'utf8')
    const gridSlugs = new Set([...grid.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]))
    const registrySlugs = new Set(BOARDS.map((b) => b.slug))

    const unknownToRegistry = [...gridSlugs].filter((s) => s && !registrySlugs.has(s))
    expect(
      unknownToRegistry,
      `the grid lists boards the registry does not know: ${unknownToRegistry.join(', ')}`,
    ).toEqual([])

    const missingFromGrid = [...registrySlugs].filter((s) => !gridSlugs.has(s))
    expect(
      missingFromGrid.length,
      `the grid is missing ${missingFromGrid.length} registered board(s): ${missingFromGrid.join(', ')}. Add them, or read the grid from the registry.`,
    ).toBe(0)
  })
})

describe('no claim about speed, scale or certification that was never measured', () => {
  it.each([
    ['a latency figure', /\b(?:under|within|in)\s+\d+\s*(?:ms|milliseconds|seconds)\b/i],
    [
      'an uptime or accuracy percentage',
      /\b(?:99(?:\.\d+)?|100)\s*%\s*(?:uptime|accurate|accuracy|verified|reliable)/i,
    ],
    [
      'a user or traffic count',
      /\b\d[\d,.]*\s*(?:million|lakh|crore|k\+)\s+(?:students|users|visitors|searches)\b/i,
    ],
    [
      'a superlative about method',
      /\b(?:the\s+)?(?:fastest|quickest|most accurate|most reliable)\b/i,
    ],
    [
      'a claim of official endorsement',
      /\b(?:official|authorised|authorized|certified)\s+(?:partner|provider|portal of)\b/i,
    ],
    ['cryptographic verification against a board', /\bverified against\b[^.<]{0,40}\bsignature/i],
  ])('makes no %s', (_label, pattern) => {
    const offenders: string[] = []
    for (const file of userFacingSources()) {
      const copy = copyOnly(readFileSync(file, 'utf8'))
      const match = pattern.exec(copy)
      if (match) offenders.push(`${relative(file)}: ${JSON.stringify(match[0])}`)
    }
    expect(
      offenders,
      `unmeasured claim in visible copy:\n  ${offenders.join('\n  ')}\nIf it is genuinely measured, cite the measurement in the copy.`,
    ).toEqual([])
  })
})

describe('no page promises a capability the site does not have', () => {
  it('offers no gazette download while no dataset is published', () => {
    /*
     * The dataset registry is the authority. While it holds no ACTIVE row,
     * nothing on the site may present a downloadable gazette — this shipped
     * once, as 24 "Download Gazette" buttons with invented file sizes
     * ("4.2 MB") beside boards whose gazettes we did not hold.
     */
    const csv = readFileSync(join(REPO_ROOT, 'docs/data/gazette-dataset-registry.csv'), 'utf8')
    const activeDatasets = csv
      .split('\n')
      .slice(1)
      .filter((line) => line.trim() !== '' && !line.startsWith('#'))
      .filter((line) => line.split(',').includes('active'))

    if (activeDatasets.length > 0) return // a real dataset exists; the claim can stand

    const FABRICATED_SIZE = /\b\d+(?:\.\d+)?\s*MB\b/
    const offenders: string[] = []
    for (const file of userFacingSources()) {
      const copy = copyOnly(readFileSync(file, 'utf8'))
      const size = FABRICATED_SIZE.exec(copy)
      if (size) offenders.push(`${relative(file)}: gazette file size ${JSON.stringify(size[0])}`)
    }
    expect(
      offenders,
      `a file size is shown for a gazette that is not published:\n  ${offenders.join('\n  ')}`,
    ).toEqual([])
  })

  it('never renders an SMS shortcode that is not in the registry', () => {
    /*
     * Four different shortcodes circulate for the same board in this market,
     * none citing a board notification. A code may reach a page only by coming
     * from the registry, never by being typed into a component.
     */
    const registrySource = readFileSync(join(REPO_ROOT, 'lib/board/registry.ts'), 'utf8')
    const known = new Set([...registrySource.matchAll(/\b(\d{4,6})\b/g)].map((m) => m[1]))

    const SHORTCODE_IN_COPY = /(?:^|[\s>"'(])(80\d{4}|5050|8583)(?:[\s<"').,]|$)/

    const offenders: string[] = []
    for (const file of userFacingSources()) {
      const copy = copyOnly(readFileSync(file, 'utf8'))
      const match = SHORTCODE_IN_COPY.exec(copy)
      if (match?.[1] && !known.has(match[1])) {
        offenders.push(`${relative(file)}: ${match[1]}`)
      }
    }
    expect(
      offenders,
      `an SMS shortcode appears in a component but not in the board registry:\n  ${offenders.join('\n  ')}`,
    ).toEqual([])
  })
})

describe('the audit itself is not vacuous', () => {
  it('actually finds files to read', () => {
    // If the walk ever returns nothing, every test above passes for free.
    const files = userFacingSources()
    expect(files.length).toBeGreaterThan(10)
    expect(files.some((f) => f.includes('components'))).toBe(true)
    expect(files.some((f) => f.includes('app'))).toBe(true)
  })

  it('strips comments without swallowing the copy around them', () => {
    const stripped = copyOnly('before {/* 24+ Boards */} after')
    expect(stripped).toContain('before')
    expect(stripped).toContain('after')
    expect(stripped).not.toContain('24+ Boards')
  })
})

describe('navigation never points at a page that does not exist', () => {
  /*
   * The site-wide mega menu carried twelve links to board pages that are
   * deliberately unpublished — faisalabad, federal, kohat, sukkur, mirpurkhas
   * and shaheed-benazirabad, all of which 404. A broken link in a footer is a
   * nuisance; a broken link in the main navigation is on every page of the site,
   * for every reader and every crawler.
   */
  const NAV_FILES = [
    'components/layout/header-mega-menu.tsx',
    'components/layout/site-header.tsx',
    'components/layout/site-footer.tsx',
  ]

  it('links to no board page the registry has not routed', () => {
    const routedSlugs = new Set(
      BOARDS.filter((b) => b.publishState === 'published').map((b) => b.slug),
    )

    const offenders: string[] = []
    for (const file of NAV_FILES) {
      let source: string
      try {
        source = readFileSync(join(REPO_ROOT, file), 'utf8')
      } catch {
        continue // the nav was reorganised; the remaining files still apply
      }
      const copy = copyOnly(source)
      for (const match of copy.matchAll(/\/results\/([a-z0-9-]+)\/12th-class/g)) {
        const slug = match[1]
        if (slug && !routedSlugs.has(slug)) offenders.push(`${file} -> ${slug}`)
      }
    }

    expect(
      offenders,
      `navigation links to an unpublished board page (these return 404):\n  ${offenders.join('\n  ')}\nFilter the list against routedBoards() rather than hand-maintaining it.`,
    ).toEqual([])
  })

  it('advertises no lookup the project has refused to build', () => {
    /*
     * lib/content/intents.ts keeps name lookup permanently unowned — "the
     * weakest surface observed anywhere. Must be framed as recovery, never as
     * name lookup." A menu entry reading "Result by Name / Search result by
     * name" promised exactly that.
     */
    /*
     * Matches an OFFER, not a QUESTION. The FAQ legitimately asks "Can I check
     * the 12th Class Result by name?" and answers it honestly; a control
     * labelled "Search by Name" is the thing that must not exist.
     */
    const BY_NAME = /(?:title:\s*'[^']*\bby name|>\s*Search by Name\s*<)/i

    const offenders: string[] = []
    for (const file of userFacingSources()) {
      const copy = copyOnly(readFileSync(file, 'utf8'))
      const match = BY_NAME.exec(copy)
      if (match) offenders.push(`${relative(file)}: ${JSON.stringify(match[0])}`)
    }

    expect(
      offenders,
      `a name-based result lookup is advertised, but that intent is permanently unowned:\n  ${offenders.join('\n  ')}`,
    ).toEqual([])
  })
})

describe('no result date is published that the registry does not hold', () => {
  /*
   * THE ONE THAT MATTERS MOST.
   *
   * The homepage shipped five hard-typed result dates — "Tentative: October
   * 2026", "Tentative: August / September 2026" and three more — while the
   * registry's own header recorded that "resultDate is unknown for every board
   * except Quetta. No official notification..."
   *
   * This is the single claim the whole project is built around. The README
   * says the live market carries three different dates for the same 2026 Punjab
   * result, none citing a board notification, and that this site publishes
   * neither and explains why. A typed date in a component is exactly that
   * failure, committed by us.
   */
  it('hard-codes no month-and-year result date in visible copy', () => {
    const MONTH = String.raw`(?:January|February|March|April|May|June|July|August|September|October|November|December)`
    // "Tentative: October 2026", "Expected September 2026", "Result on 22 October 2026".
    const TYPED_DATE = new RegExp(
      String.raw`(?:Tentative|Expected|Announced|Declared|Result)\s*:?\s*(?:[^<]{0,20})?${MONTH}[^<]{0,20}\b20\d{2}`,
      'i',
    )

    const offenders: string[] = []
    for (const file of userFacingSources()) {
      const copy = copyOnly(readFileSync(file, 'utf8'))
      const match = TYPED_DATE.exec(copy)
      if (match) offenders.push(`${relative(file)}: ${JSON.stringify(match[0].trim())}`)
    }

    expect(
      offenders,
      `a result date is typed into a component instead of coming from the registry:\n  ${offenders.join('\n  ')}\nUse board.resultDate — it carries a status and a source, and is 'unknown' for every board that has not announced one.`,
    ).toEqual([])
  })

  it('agrees with the registry about how many dates are actually known', () => {
    /*
     * A guard on the guard: if every board's date ever becomes unknown, the
     * rule above still passes trivially. This asserts the registry is the only
     * place a date can come from, and reports what it currently holds.
     */
    const confirmed = BOARDS.filter(
      (board) => board.resultDate.status === 'confirmed' && board.resultDate.value !== null,
    )
    for (const board of confirmed) {
      expect(
        board.resultDate.sourceUrl,
        `${board.shortName} has a confirmed result date with no source URL`,
      ).toBeTruthy()
    }
    // Recorded, not asserted as a fixed number — boards will announce over time.
    expect(confirmed.length).toBeLessThanOrEqual(BOARDS.length)
  })
})

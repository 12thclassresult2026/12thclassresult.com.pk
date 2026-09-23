import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { BOARDS, boardPageHref, publishedBoards } from '@/lib/board/registry'
import { PUNJAB_HSSC_PART2_ANNOUNCEMENT } from '@/lib/result/announcement'

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
      /*
       * Region hubs share the board-page URL shape — `/results/punjab/
       * 12th-class` reads exactly like `/results/lahore-board/12th-class` —
       * but they are static routes with pages of their own, and Next resolves
       * a static segment before a dynamic one. They are not board slugs and
       * must not be measured against the board registry.
       */
      const REGION_HUBS = new Set(['punjab', 'kpk', 'sindh'])

      const copy = copyOnly(source)
      for (const match of copy.matchAll(/\/results\/([a-z0-9-]+)\/12th-class/g)) {
        const slug = match[1]
        if (!slug || REGION_HUBS.has(slug)) continue
        if (!routedSlugs.has(slug)) offenders.push(`${file} -> ${slug}`)
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

  it('hard-codes no calendar date at all, keyword or not', () => {
    /*
     * THE RULE ABOVE WAS NOT ENOUGH, and the site shipped a wrong date for a
     * week because of the gap.
     *
     * The header read `Official PBCC Date (Tentative): {' '}` followed by
     * `<strong>22 October 2026</strong>`, and the ticker held
     * `const dateFormatted = '22 October 2026'`. Neither matched: the rule
     * above wants a keyword within twenty characters of the month and refuses
     * to cross a `<`, so a date in its own element or its own variable walked
     * straight past it. Students were told the result was a month later than
     * it was, under the word "Official".
     *
     * So this one takes no view on wording. Any `22 October 2026` or `October
     * 2026` in a component is a date somebody typed, and a typed date has no
     * status, no source and no way to be re-verified. They belong in
     * lib/result/announcement.ts or the board registry, where they carry both.
     */
    const MONTH = String.raw`(?:January|February|March|April|May|June|July|August|September|October|November|December)`
    const ANY_DATE = new RegExp(String.raw`(?:\b\d{1,2}\s+)?${MONTH}\s+20\d{2}`, 'g')

    /*
     * ONE EXEMPTION, AND IT IS NOT A LOOPHOLE. "Checked on 14 September 2026"
     * is a statement about when WE read a source — our own provenance, which is
     * the opposite of an unsourced claim and which the methodology pages are
     * built on. A date about the boards' calendar is the thing being guarded.
     *
     * The test for it is what comes immediately BEFORE the date, so the
     * exemption cannot be claimed by putting the word somewhere else in the
     * file. A fallback like `return '14 September 2026'` has no such lead-in
     * and is still caught — that one shipped, inventing a day on which we were
     * supposed to have checked the sources.
     */
    const PROVENANCE = /\b(?:checked|verified|read|reviewed|updated|published|as of)\b[^.<]{0,40}$/i

    const offenders: string[] = []
    for (const file of userFacingSources()) {
      const copy = copyOnly(readFileSync(file, 'utf8'))
      const flagged = new Set<string>()
      for (const match of copy.matchAll(ANY_DATE)) {
        const lead = copy.slice(Math.max(0, match.index - 60), match.index)
        if (PROVENANCE.test(lead)) continue
        flagged.add(match[0])
      }
      if (flagged.size > 0) offenders.push(`${relative(file)}: ${[...flagged].join(', ')}`)
    }

    expect(
      offenders,
      `a calendar date is typed into a component:\n  ${offenders.join('\n  ')}\n` +
        `Move it to lib/result/announcement.ts or the board registry, where a date carries a status, a source URL and the date that source was published.`,
    ).toEqual([])
  })

  it('carries a source and an honest status for the announcement it does publish', () => {
    /*
     * The site publishes ONE date site-wide, in the header and the ticker. It
     * is press reporting of a PBCC common calendar, checked against BISE
     * Lahore's own site on 2026-09-22 and not found there.
     *
     * `tentative` is what that is. The word "Official" must not appear beside
     * it — the previous copy managed to say "Official ... (Tentative)" in one
     * breath, which tells a reader nothing except that it is official.
     */
    expect(PUNJAB_HSSC_PART2_ANNOUNCEMENT.value, 'the announcement has no date').toBeTruthy()
    expect(
      PUNJAB_HSSC_PART2_ANNOUNCEMENT.sourceUrl,
      'the announcement date cites no source; an unsourced date is not a date',
    ).toBeTruthy()
    expect(PUNJAB_HSSC_PART2_ANNOUNCEMENT.sourcePublishedAt).toBeTruthy()
    expect(PUNJAB_HSSC_PART2_ANNOUNCEMENT.checkedAt).toBeTruthy()

    // `confirmed` is reserved for a notification read on a board's own domain.
    expect(
      ['tentative', 'expected', 'confirmed'],
      'the announcement status is not one a reader can be shown',
    ).toContain(PUNJAB_HSSC_PART2_ANNOUNCEMENT.status)

    if (PUNJAB_HSSC_PART2_ANNOUNCEMENT.status !== 'confirmed') {
      for (const file of ['components/layout/site-header.tsx']) {
        const copy = copyOnly(readFileSync(join(REPO_ROOT, file), 'utf8'))
        expect(
          copy,
          `${file} calls an unconfirmed date official; say "Expected" until a board publishes it`,
        ).not.toMatch(/Official[^<]{0,40}Date/i)
      }
    }
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

/** Strip comments, so the note explaining a rule cannot trip the rule. */
function codeOnly(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}
describe('the result card states only what the gazette states', () => {
  /*
   * This rule exists because the card once failed it in production.
   *
   * A redesign brought over a sibling site's card and with it a literal
   * `const totalMarks = 1100` and a hand-written A+/A/B/C/D/E ladder. A real
   * student's card then read `758 / 1100`, `68.91%`, grade `B` — one figure
   * from the gazette and three from this file.
   *
   * The gazette prints its grade table for two mark schemes and never records
   * which one a candidate was marked under, and 51% of this dataset sits where
   * the two disagree. So the numbers are not merely unsourced, they are wrong
   * for about half the students who would screenshot them.
   */
  const CARD = join(REPO_ROOT, 'components/result/gazette-result.tsx')

  it('hard-codes no total-marks figure', () => {
    const source = codeOnly(readFileSync(CARD, 'utf8'))
    expect(source, 'the card is asserting a marks total the gazette does not state').not.toMatch(
      /\b(totalMarks|total_marks)\s*=\s*\d/,
    )
    expect(source).not.toMatch(/\b1100\b|\b1200\b/)
  })

  it('derives no grade or percentage from marks', () => {
    const source = codeOnly(readFileSync(CARD, 'utf8'))
    expect(source, 'a grade ladder is back in the result card').not.toMatch(
      /\bgrade\s*=\s*['\"`]A\+?['\"`]/i,
    )
    expect(source, 'the card is computing a percentage').not.toMatch(/\*\s*100\s*\)?\.toFixed/)
  })
})

describe('every board link resolves to a page that exists', () => {
  /*
   * Found by driving the live homepage: Next prefetched
   * `/results/faisalabad-board/12th-class` on every visit and got a 404,
   * because three components built that URL straight from a slug while
   * faisalabad's publishState is `planned`.
   *
   * The href must come from `boardPageHref`, which falls back to `/boards`.
   */
  it('builds no board result URL from a raw slug', () => {
    const offenders: string[] = []
    for (const file of userFacingSources()) {
      const source = codeOnly(readFileSync(file, 'utf8'))
      for (const line of source.split(/\r?\n/)) {
        if (!/href\s*=\s*\{?`\/results\/\$\{/.test(line)) continue
        /*
         * TWO LEGITIMATE FORMS OF THE GUARD, and this rule accepts both.
         *
         * Either the href itself resolves through `boardPageHref`, or the list
         * being mapped was already filtered — `routedBoards()` cannot yield a
         * board without a page. `mobile-nav.tsx` uses the second form, and an
         * earlier version of this test failed it, which would have taught the
         * next person that the filter at the source does not count.
         */
        if (/hasPage|boardPageHref/.test(line)) continue
        if (/routedBoards|publishedBoards/.test(source)) continue
        offenders.push(`${relative(file)} :: ${line.trim()}`)
      }
    }
    expect(
      offenders,
      `these build a board URL without checking the board has a page:\n  ${offenders.join('\n  ')}`,
    ).toEqual([])
  })

  it('sends an unrouted board to the directory', () => {
    for (const board of BOARDS) {
      const href = boardPageHref(board.slug)
      if (board.publishState === 'planned') {
        expect(href, `${board.slug} is planned but links to a result page`).toBe('/boards')
      } else {
        expect(href).toBe(`/results/${board.slug}/12th-class`)
      }
    }
  })
})

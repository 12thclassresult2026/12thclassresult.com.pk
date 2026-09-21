import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  AD_ORIGINS,
  BANNER_KEY,
  BANNER_SRC,
  NATIVE_BANNER_CONTAINER,
  NATIVE_BANNER_FRAME,
  NATIVE_BANNER_SRC,
  POPUNDER_SRC,
  SOCIAL_BAR_SRC,
} from '@/components/ads/adsterra'

/**
 * THE RULE THAT KEEPS THE ADS MOUNTED.
 *
 * The site owner reports ad tags vanishing from the head on some weekends and
 * does not know what removes them. Nothing in this repository removes anything
 * on a schedule — the tags are source code, committed and deployed, and a
 * Worker serves the same bytes on Sunday as on Tuesday.
 *
 * What CAN remove them is an edit. This project has already seen a redesign
 * rewrite the result card and an agent "clean up" markup it did not recognise;
 * four unlabelled third-party script tags are exactly the kind of thing that
 * gets tidied away by someone who cannot tell what they are for. There is no
 * way to make an edit impossible. There is a way to make it impossible to ship
 * unnoticed, which is this file: remove any of the four and `npm run check`
 * fails before anything reaches production.
 *
 * Each rule below states what would break in revenue terms if it were gone, so
 * the next person can tell a real failure from a stale assertion.
 */

const REPO_ROOT = process.cwd()

function sourceFiles(dirs: string[]): string[] {
  const out: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (/\.tsx?$/.test(entry)) out.push(full)
    }
  }
  for (const dir of dirs) walk(join(REPO_ROOT, dir))
  return out
}

const read = (path: string) => readFileSync(join(REPO_ROOT, path), 'utf8')

/** Strip comments, so a rule cannot pass on its own documentation. */
function codeOnly(source: string): string {
  return source.replace(/\{?\/\*[\s\S]*?\*\/\}?/g, '').replace(/^\s*\/\/.*$/gm, '')
}

describe('all four Adsterra units stay mounted', () => {
  const layout = () => codeOnly(read('app/layout.tsx'))
  const homepage = () => codeOnly(read('app/page.tsx'))

  it('keeps the Popunder and Social Bar site-wide, in the layout', () => {
    // Gone from here and they are gone from every page at once — the two units
    // that earn on traffic the banners never see, because they do not depend
    // on a reader scrolling to a slot.
    expect(layout(), 'the site-wide ad scripts are no longer mounted').toContain(
      '<AdsterraSiteScripts />',
    )

    const scripts = codeOnly(read('components/ads/adsterra-site-scripts.tsx'))
    expect(scripts).toContain('POPUNDER_SRC')
    expect(scripts).toContain('SOCIAL_BAR_SRC')
  })

  it('keeps a banner on every page, declared once in the layout', () => {
    /*
     * Declared in the layout rather than per page on purpose: a route added
     * later inherits the slot instead of being forgotten. If this moves into
     * the individual pages, every new page becomes an unpaid page.
     */
    expect(layout(), 'the every-page banner is no longer in the layout').toContain(
      '<LayoutAdBanner />',
    )
  })

  it('runs at most one 300x250 per document', () => {
    /*
     * THE CONSTRAINT THAT SHAPES EVERY PLACEMENT DECISION HERE.
     *
     * The Adsterra banner loader reads a GLOBAL atOptions when it evaluates.
     * Two banners in one document are two scripts racing over one variable,
     * and the usual outcome is a slot that looks placed and earns nothing.
     *
     * So the shared layout banner steps aside on any path that renders its
     * own. A page listed in PLACES_ITS_OWN must render exactly one AdBanner;
     * a page not listed must render none, because it inherits the layout one.
     */
    const shared = codeOnly(read('components/ads/layout-ad-banner.tsx'))
    expect(shared, 'the shared banner no longer steps aside anywhere').toContain('PLACES_ITS_OWN')
    expect(shared, 'the homepage is no longer exempt, so it would run two banners').toMatch(
      /PLACES_ITS_OWN = new Set\(\[[^\]]*'\/'/,
    )

    for (const file of sourceFiles(['app'])) {
      const count = codeOnly(readFileSync(file, 'utf8')).split('<AdBanner').length - 1
      expect(count, `${file} renders ${count} banners; only one may run per page`).toBeLessThan(2)
    }
  })

  it('keeps both homepage placements', () => {
    /*
     * The homepage takes most of the traffic and carries two in-page units:
     * a 300x250 under the hero, where the lookup tool is, and a native unit
     * mid-page. The Social Bar and Popunder run over those from the layout,
     * so all four units are live on this one page.
     */
    const page = homepage()
    expect(page, 'the below-hero banner is gone').toMatch(/<AdBanner[^>]*slot="home-below-hero"/)
    expect(page, 'the mid-page native banner is gone').toContain('<AdNativeBanner')
  })

  it('places the below-hero banner after the hero, not inside it', () => {
    /*
     * Two separate reasons, and both matter.
     *
     * Placement: it must sit UNDER the roll-number tool, which is what the
     * hero renders — not beside or above it.
     *
     * Privacy: hero-section.tsx renders the result card, so it is a file that
     * handles a candidate record. The rule below forbids ad code in such a
     * file, and this keeps the two consistent.
     */
    const page = homepage()
    const hero = page.indexOf('<HeroSection')
    const banner = page.indexOf('<AdBanner')
    expect(hero, 'the hero is no longer on the homepage').toBeGreaterThan(-1)
    expect(banner, 'the below-hero banner is gone').toBeGreaterThan(-1)
    expect(banner, 'the banner no longer follows the hero').toBeGreaterThan(hero)
  })

  it('renders the Native Banner at most once in any one page', () => {
    // Its container id is fixed by Adsterra. Two copies means a duplicate id
    // and the loader fills only the first, so the second slot silently earns
    // nothing while looking like a placement.
    for (const file of sourceFiles(['app'])) {
      const occurrences = codeOnly(readFileSync(file, 'utf8')).split('<AdNativeBanner').length - 1
      expect(occurrences, `${file} renders the native banner ${occurrences} times`).toBeLessThan(2)
    }
  })
})

describe('the unit ids are the ones Adsterra issued', () => {
  /*
   * A mistyped key does not throw — it renders an empty box. These four values
   * are checked against the publisher dashboard for site 6067805 and must not
   * drift.
   */
  it('carries the exact four unit sources', () => {
    expect(POPUNDER_SRC).toBe(
      'https://pl31446134.profitableratecpmnetwork.com/c2/11/4f/c2114f49261fceebffaad59b8cea9cc2.js',
    )
    expect(SOCIAL_BAR_SRC).toBe(
      'https://pl31446135.profitableratecpmnetwork.com/fe/e0/e9/fee0e9ef585a7d784eae0a822fcd8126.js',
    )
    expect(BANNER_KEY).toBe('39443b44123048a657629c63f017ef58')
    expect(BANNER_SRC).toBe(
      'https://www.highrevenueformat.com/39443b44123048a657629c63f017ef58/invoke.js',
    )
    expect(NATIVE_BANNER_SRC).toBe(
      'https://pl31446137.profitableratecpmnetwork.com/50156e7baa67ad87f69475093bc71a7f/invoke.js',
    )
    expect(NATIVE_BANNER_CONTAINER).toBe('container-50156e7baa67ad87f69475093bc71a7f')
  })

  it('allows every ad origin through the CSP', () => {
    /*
     * The failure this catches is the confusing one: the tags are present, the
     * markup is correct, and every slot is blank because the browser refused
     * the script. It shows up only in a console nobody has open.
     */
    const config = read('next.config.ts')
    const scriptSrc = /"script-src ([^"]*)"/.exec(config)?.[1] ?? ''
    const connectSrc = /"connect-src ([^"]*)"/.exec(config)?.[1] ?? ''

    /*
     * PERMITTED, NOT NAMED. An earlier version required each origin to appear
     * literally, and failed the moment connect-src became `'self' https:` —
     * which permits every one of them. A rule that fails on a policy strictly
     * more permissive than the one it was written for is testing the spelling,
     * not the behaviour.
     */
    const permits = (directive: string, origin: string): boolean => {
      const tokens = directive.split(/\s+/).filter(Boolean)
      if (tokens.includes('https:') || tokens.includes('*')) return true
      const domain = new URL(origin).hostname.split('.').slice(-2).join('.')
      return tokens.includes(origin) || tokens.includes(`https://*.${domain}`)
    }

    for (const origin of AD_ORIGINS) {
      expect(
        permits(scriptSrc, origin),
        `${origin} is blocked by script-src, so its unit will render blank`,
      ).toBe(true)
      expect(
        permits(connectSrc, origin),
        `${origin} is blocked by connect-src, so its unit cannot report back`,
      ).toBe(true)
    }
  })
})

describe('the ad frame is the only place script-src is open', () => {
  /*
   * THE WHOLE SECURITY ARGUMENT FOR THE NATIVE BANNER RESTS ON THIS FILE.
   *
   * Adsterra rotates its delivery domains on purpose, so that unit cannot run
   * under a named allow-list. Rather than open script-src on every page — the
   * homepage included, which renders a named student's result — the unit is
   * framed from /ads/native.html, a static file with a CSP of its own.
   *
   * If any part of that arrangement drifts, the result is not a broken ad. It
   * is either a silently blank unit, or a site-wide policy far looser than
   * anyone intended. Each rule below guards one part of it.
   */
  const headers = () => read('public/_headers')

  it('gives /ads/* its own policy, declared after the catch-all', () => {
    const source = headers()
    const catchAll = source.indexOf('/*')
    const adsRule = source.indexOf('/ads/*')

    expect(
      adsRule,
      'the /ads/* header block is gone; the frame cannot run a script',
    ).toBeGreaterThan(-1)
    // Cloudflare applies matching rules in order, so a block declared BEFORE
    // the catch-all would be overwritten by it and the frame would inherit
    // default-src 'none' and X-Frame-Options: DENY.
    expect(adsRule, 'the /ads/* block moved above /*, so /* overrides it').toBeGreaterThan(catchAll)
  })

  it('lets this site frame it, and no one else', () => {
    const block = headers().slice(headers().indexOf('/ads/*'))
    expect(block).toContain('X-Frame-Options: SAMEORIGIN')
    expect(block).toContain("frame-ancestors 'self'")
    // An ad page anyone could embed is an open redirect for someone else's
    // traffic, billed to this publisher account.
    expect(block).not.toContain('frame-ancestors *')
  })

  it('keeps the frame out of search results', () => {
    expect(headers().slice(headers().indexOf('/ads/*'))).toContain('X-Robots-Tag: noindex')
  })

  it('serves the native unit from a static file holding no data', () => {
    const frame = read('public/ads/native.html')

    expect(frame, 'the frame no longer loads the native unit').toContain(NATIVE_BANNER_SRC)
    expect(frame, 'the container id the loader looks up is gone').toContain(
      `id="${NATIVE_BANNER_CONTAINER}"`,
    )

    /*
     * The frame's looser CSP is only defensible while the file is inert. The
     * moment it reads a query string it becomes a way to get attacker-chosen
     * content into a document where any https host may execute script.
     */
    expect(frame, 'the ad frame is reading the URL').not.toMatch(
      /location\s*\.\s*(search|href|hash)|URLSearchParams|document\s*\.\s*referrer/,
    )
    expect(frame, 'the ad frame is reaching into the page that framed it').not.toMatch(
      /\b(parent|top)\s*\./,
    )
  })

  it('points the component at that file and nothing else', () => {
    expect(NATIVE_BANNER_FRAME).toBe('/ads/native.html')
    const component = codeOnly(read('components/ads/ad-native-banner.tsx'))
    expect(component).toContain('NATIVE_BANNER_FRAME')
    // A query string here is the same hole as one inside the frame.
    expect(component, 'the frame src is being built with a query string').not.toMatch(
      /NATIVE_BANNER_FRAME\s*\+|\$\{NATIVE_BANNER_FRAME\}[^`'"]/,
    )
  })

  it('still allows the site itself to frame it', () => {
    // frame-src governs the parent page, not the frame: 'self' is what lets
    // /ads/native.html be embedded at all.
    const frameSrc = /"frame-src ([^"]*)"/.exec(read('next.config.ts'))?.[1] ?? ''
    const tokens = frameSrc.split(/\s+/).filter(Boolean)
    expect(tokens.includes("'self'") || tokens.includes('https:')).toBe(true)
  })
})

describe('ads never touch a student record', () => {
  const AD_IMPORT = /from '@\/components\/ads\//

  it('imports no ad component into a file that handles a record', () => {
    /*
     * Popunder and Social Bar run as script in the top-level document, so this
     * is not a claim that ad code cannot see the page — it can, and that is
     * inherent to running an ad network. What this rule prevents is the
     * specific, avoidable mistake: a component that has a `GazetteRecord` in
     * scope also importing an ad, which is how a record ends up passed to an
     * ad call as a targeting parameter.
     */
    const RECORD_MODULES = /from '@\/lib\/gazettes\/(lookup|normalize|parser|store)/

    const offenders: string[] = []
    for (const file of sourceFiles(['app', 'components', 'lib'])) {
      const source = codeOnly(readFileSync(file, 'utf8'))
      const handlesRecord = RECORD_MODULES.test(source) || /\bGazetteRecord\b/.test(source)
      if (handlesRecord && AD_IMPORT.test(source)) {
        offenders.push(file.replace(REPO_ROOT, '').replace(/\\/g, '/'))
      }
    }
    expect(
      offenders,
      `these files handle a candidate record AND import an ad:\n  ${offenders.join('\n  ')}`,
    ).toEqual([])
  })

  it('passes no candidate field to any ad script', () => {
    const FORBIDDEN = /\b(rollNumber|candidateName|obtainedMarks|institution)\b/
    for (const file of sourceFiles(['components/ads'])) {
      const source = codeOnly(readFileSync(file, 'utf8'))
      expect(source, `${file} references a candidate field`).not.toMatch(FORBIDDEN)
    }
  })

  it('labels every visible slot as an advertisement', () => {
    // A creative styled to look like a result notification, sitting under the
    // lookup tool, is indistinguishable from the product without this.
    expect(codeOnly(read('components/ads/ad-slot.tsx'))).toContain('Advertisement')
    for (const file of ['components/ads/ad-banner.tsx', 'components/ads/ad-native-banner.tsx']) {
      expect(codeOnly(read(file)), `${file} renders outside the labelled slot`).toContain('AdSlot')
    }
  })
})

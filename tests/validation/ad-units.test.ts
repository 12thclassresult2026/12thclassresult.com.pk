import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  AD_ORIGINS,
  BANNER_KEY,
  BANNER_SRC,
  NATIVE_BANNER_CONTAINER,
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
    expect(layout(), 'the every-page banner is no longer in the layout').toMatch(
      /<AdBanner[^>]*slot=/,
    )
  })

  it('keeps three distinct placements on the homepage', () => {
    /*
     * The homepage takes most of the traffic, so it carries three: one under
     * the hero where the lookup tool is, a native unit mid-page, and the
     * layout's banner above the footer. Two here plus one inherited.
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

    for (const origin of AD_ORIGINS) {
      const host = new URL(origin).hostname
      const domain = host.split('.').slice(-2).join('.')
      const allowed = scriptSrc.includes(origin) || scriptSrc.includes(`https://*.${domain}`)
      expect(allowed, `${origin} is blocked by script-src, so its unit will render blank`).toBe(
        true,
      )
    }

    // The banner's srcdoc iframe INHERITS this policy, so the loader host has
    // to be here too or the 300x250 never renders.
    expect(scriptSrc).toContain('highrevenueformat.com')
    expect(connectSrc).toContain('profitableratecpmnetwork.com')
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

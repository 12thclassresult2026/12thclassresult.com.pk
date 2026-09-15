import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { indexablePages, PAGES } from '@/lib/content/registry'
import { clientKey, rateLimit, __resetRateLimitState } from '@/lib/security/rate-limit'
import { compositeKey, validateRequest } from '@/lib/gazettes/lookup'

/**
 * Privacy and abuse invariants for the gazette engine.
 *
 * The dataset is 138,617 real students. The rules below are not preferences —
 * each one, if broken, publishes a named minor's examination result to the open
 * web or hands a scraper the whole cohort.
 *
 * These are repository-wide assertions on purpose. A rule enforced only inside
 * the component that currently renders results stops being enforced the moment
 * a second route is added.
 */

const REPO_ROOT = process.cwd()
const CODE_DIRS = ['app', 'lib', 'components']

function sourceFiles(): string[] {
  const out: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (/\.tsx?$/.test(entry)) out.push(full)
    }
  }
  for (const dir of CODE_DIRS) walk(join(REPO_ROOT, dir))
  return out
}

describe('no personal result data can be indexed', () => {
  it('registers no page whose path carries a roll number', () => {
    for (const page of PAGES) {
      // A per-student URL is the thing that turns a result service into a
      // directory of minors. There must be no route shape that can produce one.
      expect(page.path, `${page.path} looks like a per-candidate page`).not.toMatch(/roll/i)
      expect(page.path).not.toMatch(/\d{5,}/)
    }
  })

  it('puts no result page in the sitemap', () => {
    for (const page of indexablePages()) {
      expect(page.path).not.toMatch(/roll|candidate|student/i)
    }
  })

  it('defines no route that takes a roll number as a path segment', () => {
    const walk = (dir: string, acc: string[] = []): string[] => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) {
          expect(entry, `${full} is a dynamic route over a candidate identifier`).not.toMatch(
            /\[.*(roll|candidate|student).*\]/i,
          )
          walk(full, acc)
        }
      }
      return acc
    }
    walk(join(REPO_ROOT, 'app'))
  })
})

describe('no bulk access and no enumeration surface', () => {
  it('exposes no store method that can list or scan records', () => {
    /*
     * The store interface is the whole attack surface. It answers exactly one
     * question — does this one identity exist — and gaining a `list`, `search`,
     * `prefix` or `all` would turn a lookup into a bulk export of 138,617
     * students.
     */
    const lookupSource = readFileSync(join(REPO_ROOT, 'lib/gazettes/lookup.ts'), 'utf8')
    const storeBlock = lookupSource.slice(
      lookupSource.indexOf('export type GazetteStore'),
      lookupSource.indexOf('/** Roll numbers are digits only'),
    )
    expect(storeBlock).toContain('datasetState')
    expect(storeBlock).toContain('get(')
    for (const forbidden of ['list(', 'all(', 'search(', 'prefix(', 'scan(', 'export(']) {
      expect(storeBlock, `GazetteStore gained ${forbidden}`).not.toContain(forbidden)
    }
  })

  it('ships no API route at all', () => {
    // Only the two sitemap routes exist. An endpoint returning JSON results
    // would be enumerable in a way a rendered page is not.
    const routes: string[] = []
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) walk(full)
        else if (entry === 'route.ts') routes.push(full.replace(REPO_ROOT, '').replace(/\\/g, '/'))
      }
    }
    walk(join(REPO_ROOT, 'app'))
    expect(routes.sort()).toEqual(['/app/sitemap.xml/route.ts', '/app/sitemaps/[segment]/route.ts'])
  })

  it('has a rate limiter that actually refuses', () => {
    __resetRateLimitState()
    const key = 'test-scope:1.2.3.4'
    let refused = false
    for (let i = 0; i < 200; i += 1) {
      const result = rateLimit(key, 10, 60_000)
      if (!result.allowed) refused = true
    }
    expect(refused, 'the rate limiter never refused over 200 attempts').toBe(true)
  })

  it('keys the rate limiter on the client, never on the roll number', () => {
    /*
     * CODE ONLY, COMMENTS STRIPPED.
     *
     * Two things defeated a naive scan here. A bare /roll/i hits "rolling
     * window", which is what this limiter legitimately is. And the file's own
     * line 67 reads "NEVER include the roll number or any candidate identifier
     * here" — a test that fails on the documentation of the rule it enforces
     * teaches the next person to delete the documentation.
     */
    const source = codeOnly(readFileSync(join(REPO_ROOT, 'lib/security/rate-limit.ts'), 'utf8'))
    expect(source).not.toMatch(/\broll[-_ ]?numbers?\b/i)
    expect(source).not.toMatch(/\bcandidate(Name)?\b/i)

    const request = new Request('https://12thclassresult.com.pk/', {
      headers: { 'cf-connecting-ip': '1.2.3.4' },
    })
    const key = clientKey(request, 'gazette-lookup')
    // A key containing the roll number would both leak it into memory and make
    // the limit per-roll instead of per-client, defeating it entirely.
    expect(key).not.toContain('236818')
  })
})

/** Strip block and line comments, so a rule's own documentation cannot trip it. */
function codeOnly(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

/**
 * Files that genuinely handle a candidate record.
 *
 * TWO THINGS THIS DELIBERATELY EXCLUDES, both of which broke a looser version:
 *
 * - `rollNumber` as a word. It is also the name of a capability flag on
 *   `DatasetMethods` ("does this board offer roll-number lookup"), which appears
 *   across the board registry and the public pages with no personal data near
 *   it.
 * - `lib/gazettes/coverage` and `lib/gazettes/types`. Those describe which
 *   boards publish a gazette at all; the homepage and the board directory import
 *   them and must keep their page metadata.
 *
 * What is left is the set of modules that can hold an actual student's result.
 */
const RECORD_MODULES = /from '@\/lib\/gazettes\/(lookup|normalize|parser|store)/

function recordHandlingFiles(): string[] {
  return sourceFiles().filter((file) => {
    const source = readFileSync(file, 'utf8')
    return RECORD_MODULES.test(source) || /\bGazetteRecord\b/.test(source)
  })
}

describe('personal data never reaches analytics, logs or metadata', () => {
  it('scopes these checks to files that actually handle a record', () => {
    // If this ever returns nothing, the three tests below are passing vacuously.
    expect(recordHandlingFiles().length).toBeGreaterThan(0)
  })

  it('sends no result field to any analytics call', () => {
    /*
     * Matched as CALL SHAPES, not as words, and with comments stripped. A bare
     * /plausible/i matched this file's own sentence about spending rate limits
     * on "plausible requests" — the sort of false positive that gets a real
     * rule deleted for being noisy.
     */
    const forbidden = /\b(gtag\s*\(|dataLayer\s*\.|posthog\s*\.|plausible\s*\(|mixpanel\s*\.)/i
    for (const file of recordHandlingFiles()) {
      const source = codeOnly(readFileSync(file, 'utf8'))
      expect(source, `${file} mixes analytics with result data`).not.toMatch(forbidden)
    }
  })

  it('logs no record field anywhere in app, lib or components', () => {
    // Deliberately scanned across ALL sources, not just record-handling ones:
    // a log statement naming these fields is wrong wherever it appears.
    for (const file of sourceFiles()) {
      const source = readFileSync(file, 'utf8')
      const logs = [...source.matchAll(/console\.(log|info|warn|error)\(([^)]*)\)/g)]
      for (const [, , args] of logs) {
        expect(args ?? '', `${file} logs a candidate field`).not.toMatch(
          /rollNumber|candidateName|obtainedMarks|rawResultStatus/,
        )
      }
    }
  })

  it('builds no metadata or JSON-LD from a record', () => {
    /*
     * A result must never become a page title or structured data — one is a
     * named minor's outcome in a browser tab and in history, the other makes it
     * eligible for a rich result.
     */
    for (const file of recordHandlingFiles()) {
      const source = readFileSync(file, 'utf8')
      expect(source, `${file} may put a candidate in metadata`).not.toMatch(
        /export const metadata|generateMetadata|jsonLdGraph|application\/ld\+json/,
      )
    }
  })
})

describe('the lookup contract itself', () => {
  it('cannot be asked a question without all four identity components', () => {
    // TypeScript enforces this at compile time; this asserts the runtime guard
    // too, since a request can arrive as untyped form input.
    for (const missing of [
      { boardId: '', year: 2025, examination: 'first-annual', rollNumber: '236818' },
      { boardId: 'bise-gujranwala', year: 0, examination: 'first-annual', rollNumber: '236818' },
      { boardId: 'bise-gujranwala', year: 2025, examination: '', rollNumber: '236818' },
      { boardId: 'bise-gujranwala', year: 2025, examination: 'first-annual', rollNumber: '' },
    ]) {
      expect(validateRequest(missing).ok).toBe(false)
    }
  })

  it('gives one roll number four different keys across four datasets', () => {
    const base = {
      boardId: 'bise-gujranwala',
      year: 2025,
      examination: 'first-annual',
      rollNumber: '236818',
    }
    const keys = new Set([
      compositeKey(base),
      compositeKey({ ...base, boardId: 'bise-lahore' }),
      compositeKey({ ...base, year: 2024 }),
      compositeKey({ ...base, examination: 'second-annual' }),
    ])
    expect(keys.size).toBe(4)
  })
})

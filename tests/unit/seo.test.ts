import { describe, expect, it } from 'vitest'

import { jsonLdGraph, organizationSchema, webPageSchema } from '@/lib/schema/json-ld'
import { TITLE_MAX, brandedTitle, buildMetadata } from '@/lib/seo/metadata'
import { SITE_ORIGIN, canonicalUrl, isProductionHost, normalizePath } from '@/lib/seo/site'

describe('normalizePath', () => {
  it('forces a leading slash and strips a trailing one', () => {
    expect(normalizePath('boards/')).toBe('/boards')
    expect(normalizePath('/boards/')).toBe('/boards')
  })

  it('keeps the root as a single slash', () => {
    expect(normalizePath('/')).toBe('/')
    expect(normalizePath('')).toBe('/')
  })

  it('lowercases and collapses duplicate slashes', () => {
    expect(normalizePath('/Results//12th-Class')).toBe('/results/12th-class')
  })

  it('strips query and hash so they cannot create duplicate URLs', () => {
    expect(normalizePath('/boards?utm_source=x')).toBe('/boards')
    expect(normalizePath('/boards#section')).toBe('/boards')
  })

  it('reduces a full URL to its pathname', () => {
    expect(normalizePath('https://12thclassresult.com.pk/boards')).toBe('/boards')
  })
})

describe('isProductionHost', () => {
  it('accepts the apex, with or without a port', () => {
    expect(isProductionHost('12thclassresult.com.pk')).toBe(true)
    expect(isProductionHost('12thclassresult.com.pk:443')).toBe(true)
  })

  it('rejects www so a fail-open redirect cannot duplicate the site', () => {
    expect(isProductionHost('www.12thclassresult.com.pk')).toBe(false)
  })

  it('rejects preview and local hosts', () => {
    expect(isProductionHost('12thclassresult-com-pk.workers.dev')).toBe(false)
    expect(isProductionHost('localhost')).toBe(false)
    expect(isProductionHost(null)).toBe(false)
  })
})

describe('canonicalUrl', () => {
  it('always builds on the production origin', () => {
    expect(canonicalUrl('/boards')).toBe(`${SITE_ORIGIN}/boards`)
  })
})

describe('brandedTitle', () => {
  it('appends the brand when the result still fits', () => {
    const short = 'Boards'
    expect(brandedTitle(short)).toContain('12thClassResult.com.pk')
    expect(brandedTitle(short).length).toBeLessThanOrEqual(TITLE_MAX)
  })

  it('leaves a long title alone rather than truncating what it names', () => {
    const long = '12th Class Result 2026 — Boards, Dates & Official Sources'
    expect(brandedTitle(long)).toBe(long)
  })
})

describe('buildMetadata', () => {
  it('marks a noindex page follow:true, never nofollow', () => {
    const meta = buildMetadata({
      path: '/x',
      title: 'X',
      description: 'd',
      index: false,
    })
    const robots = meta.robots as { index: boolean; follow: boolean }
    expect(robots.index).toBe(false)
    // nofollow would also discard the official board links on a held page.
    expect(robots.follow).toBe(true)
  })

  it('omits the canonical when a page has no address of its own', () => {
    const meta = buildMetadata({
      path: '/404',
      title: 'Not found',
      description: 'd',
      canonical: false,
    })
    expect(meta.alternates?.canonical).toBeUndefined()
  })

  it('points the OG url at the canonical', () => {
    const meta = buildMetadata({ path: '/boards', title: 'Boards', description: 'd' })
    expect(meta.openGraph?.url).toBe(canonicalUrl('/boards'))
  })
})

describe('jsonLdGraph', () => {
  it('escapes < so a string cannot close the script element early', () => {
    const output = jsonLdGraph([
      webPageSchema({ path: '/x', name: '</script><img onerror=alert(1)>', description: 'd' }),
    ])
    expect(output).not.toContain('</script>')
    expect(output).toContain('\\u003c')
  })

  it('emits no rating, review or award claim', () => {
    const output = jsonLdGraph([organizationSchema()])
    expect(output).not.toContain('aggregateRating')
    expect(output).not.toContain('ratingValue')
    expect(output).not.toContain('reviewCount')
    expect(output).not.toContain('award')
  })
})

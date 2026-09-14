import { describe, expect, it } from 'vitest'

import {
  PAGES,
  findBrokenInternalLinks,
  findKeywordConflicts,
  findOrphanPages,
  findRouteCollisions,
  indexablePages,
  populatedSegments,
} from '@/lib/content/registry'
import { SITEMAP_SEGMENTS } from '@/lib/content/types'
import { allSitemapUrls, buildSitemapIndex, oversizedSegments } from '@/lib/seo/sitemap'
import { SITE_ORIGIN, normalizePath } from '@/lib/seo/site'

describe('registry integrity', () => {
  it('has unique page ids', () => {
    const ids = PAGES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has no route collisions', () => {
    expect(findRouteCollisions()).toEqual([])
  })

  it('stores every path already normalized', () => {
    for (const page of PAGES) {
      expect(page.path).toBe(normalizePath(page.path))
    }
  })

  it('assigns every page a known sitemap segment', () => {
    for (const page of PAGES) {
      expect(SITEMAP_SEGMENTS).toContain(page.sitemapSegment)
    }
  })

  it('starts every breadcrumb at the root and ends it at the page itself', () => {
    for (const page of PAGES) {
      expect(page.breadcrumb[0]?.path).toBe('/')
      expect(page.breadcrumb.at(-1)?.path).toBe(page.path)
    }
  })
})

describe('metadata uniqueness across the whole inventory', () => {
  it('has no duplicate titles', () => {
    const titles = PAGES.map((p) => p.title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('has no duplicate descriptions', () => {
    const descriptions = PAGES.map((p) => p.description)
    expect(new Set(descriptions).size).toBe(descriptions.length)
  })

  it('has no duplicate H1s', () => {
    const h1s = PAGES.map((p) => p.h1)
    expect(new Set(h1s).size).toBe(h1s.length)
  })

  it('keeps titles and descriptions within a length a search result can show', () => {
    for (const page of PAGES) {
      expect(page.title.length).toBeLessThanOrEqual(70)
      expect(page.description.length).toBeGreaterThanOrEqual(50)
      expect(page.description.length).toBeLessThanOrEqual(200)
    }
  })
})

describe('cannibalization control', () => {
  it('gives every primary keyword exactly one canonical owner', () => {
    expect(findKeywordConflicts()).toEqual([])
  })

  it('never lists a page’s own primary keyword among its query variants', () => {
    for (const page of PAGES) {
      const primary = page.seoTarget.primaryKeyword.toLowerCase()
      const variants = page.seoTarget.queryVariants.map((v) => v.toLowerCase())
      expect(variants).not.toContain(primary)
    }
  })

  it('keeps the homepage out of the head result race', () => {
    const home = PAGES.find((p) => p.path === '/')
    const headTerms = ['12th class result', '2nd year result', 'hssc part 2 result']
    expect(headTerms).not.toContain(home?.seoTarget.primaryKeyword.toLowerCase())
  })

  it('consolidates the synonym set onto one canonical owner', () => {
    const hub = PAGES.find((p) => p.path === '/results/12th-class')
    expect(hub?.seoTarget.primaryKeyword).toBe('12th class result')
    // The synonyms are variants of this page, not pages of their own.
    expect(hub?.seoTarget.queryVariants).toContain('2nd year result')
    expect(hub?.seoTarget.queryVariants).toContain('hssc part 2 result')
  })
})

describe('internal link graph', () => {
  it('has no link pointing at a path no page owns', () => {
    expect(findBrokenInternalLinks()).toEqual([])
  })

  it('has no orphan pages', () => {
    expect(findOrphanPages().map((p) => p.path)).toEqual([])
  })
})

describe('publication and indexation', () => {
  it('never marks a planned page indexable', () => {
    for (const page of PAGES.filter((p) => p.status === 'planned')) {
      expect(page.index).toBe(false)
    }
  })

  it('requires a review timestamp on every published volatile page', () => {
    for (const page of PAGES.filter((p) => p.status === 'published')) {
      if (page.freshnessClass === 'A' || page.freshnessClass === 'B') {
        expect(page.lastReviewedAt).not.toBeNull()
      }
    }
  })

  it('registers a source for every page that owns a factual claim directly', () => {
    for (const page of PAGES.filter((p) => p.sourceRequirementMode === 'direct')) {
      expect(page.sourceIds.length).toBeGreaterThan(0)
    }
  })
})

describe('sitemap', () => {
  it('contains only published, indexable pages', () => {
    const sitemapPaths = indexablePages().map((p) => p.path)
    for (const page of PAGES) {
      if (page.status !== 'published' || !page.index) {
        expect(sitemapPaths).not.toContain(page.path)
      }
    }
  })

  it('emits only production-origin URLs', () => {
    for (const url of allSitemapUrls()) {
      expect(url.startsWith(SITE_ORIGIN)).toBe(true)
    }
  })

  it('never lists an API route or the search endpoint', () => {
    for (const url of allSitemapUrls()) {
      expect(url).not.toContain('/api/')
      expect(url).not.toContain('/search')
    }
  })

  it('indexes only populated segments', () => {
    const index = buildSitemapIndex()
    for (const segment of SITEMAP_SEGMENTS) {
      if (populatedSegments().includes(segment)) {
        expect(index).toContain(`/sitemaps/${segment}.xml`)
      } else {
        expect(index).not.toContain(`/sitemaps/${segment}.xml`)
      }
    }
  })

  it('keeps every segment within the protocol limit', () => {
    expect(oversizedSegments()).toEqual([])
  })
})

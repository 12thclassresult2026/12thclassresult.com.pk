import { SITEMAP_SEGMENTS, type SitemapSegment } from '@/lib/content/types'
import { indexablePages, pagesInSegment, populatedSegments } from '@/lib/content/registry'

import { SITE_ORIGIN, canonicalUrl } from './site'

/**
 * Segmented sitemap generation (section 164).
 *
 * `/sitemap.xml` is an INDEX pointing at `/sitemaps/{segment}.xml`. Splitting
 * by segment keeps each file small and lets a growing inventory scale without
 * restructuring anything.
 */

/** Protocol limit per sitemap file. */
export const MAX_URLS_PER_SITEMAP = 50_000

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function segmentUrl(segment: SitemapSegment): string {
  return `${SITE_ORIGIN}/sitemaps/${segment}.xml`
}

export function isSitemapSegment(value: string): value is SitemapSegment {
  return (SITEMAP_SEGMENTS as readonly string[]).includes(value)
}

/**
 * Newest content date in a segment.
 * Taken from page content dates, NEVER from build time — otherwise every
 * rebuild would falsely claim every URL had just changed.
 */
function segmentLastModified(segment: SitemapSegment): string | null {
  const dates = pagesInSegment(segment)
    .map((p) => p.contentUpdatedAt.slice(0, 10))
    .sort()
  return dates.at(-1) ?? null
}

export function buildSitemapIndex(): string {
  const entries = populatedSegments()
    .map((segment) => {
      const lastmod = segmentLastModified(segment)
      return [
        '  <sitemap>',
        `    <loc>${escapeXml(segmentUrl(segment))}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        '  </sitemap>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</sitemapindex>',
    '',
  ].join('\n')
}

/**
 * Returns null for an empty segment, so the route can answer 404 rather than
 * serve a valid-but-empty urlset that says nothing.
 */
export function buildSegmentSitemap(segment: SitemapSegment): string | null {
  const pages = pagesInSegment(segment)
  if (pages.length === 0) return null

  const entries = pages
    .map((page) =>
      [
        '  <url>',
        `    <loc>${escapeXml(canonicalUrl(page.path))}</loc>`,
        `    <lastmod>${page.contentUpdatedAt.slice(0, 10)}</lastmod>`,
        '  </url>',
      ].join('\n'),
    )
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n')
}

export function oversizedSegments(): { segment: SitemapSegment; count: number }[] {
  return populatedSegments()
    .map((segment) => ({ segment, count: pagesInSegment(segment).length }))
    .filter((entry) => entry.count > MAX_URLS_PER_SITEMAP)
}

/** Every URL the sitemap system would emit. Used by the validation gates. */
export function allSitemapUrls(): string[] {
  return indexablePages().map((page) => canonicalUrl(page.path))
}

import { populatedSegments } from '@/lib/content/registry'
import { buildSegmentSitemap, isSitemapSegment } from '@/lib/seo/sitemap'

export const dynamic = 'force-static'

/**
 * Only populated segments are generated. Anything else 404s rather than serving
 * a valid-but-empty <urlset>, which tells a crawler nothing and invites it back.
 */
export const dynamicParams = false

export function generateStaticParams(): { segment: string }[] {
  return populatedSegments().map((segment) => ({ segment: `${segment}.xml` }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ segment: string }> },
): Promise<Response> {
  const { segment: raw } = await params
  const segment = raw.replace(/\.xml$/, '')

  if (!isSitemapSegment(segment)) {
    return new Response('Not found', { status: 404 })
  }

  const xml = buildSegmentSitemap(segment)
  if (!xml) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

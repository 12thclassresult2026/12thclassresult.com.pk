import { buildSitemapIndex } from '@/lib/seo/sitemap'

export const dynamic = 'force-static'

/** The sitemap INDEX. Per-segment urlsets live at /sitemaps/{segment}.xml. */
export function GET(): Response {
  return new Response(buildSitemapIndex(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

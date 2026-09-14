import type { MetadataRoute } from 'next'

import { SITE_ORIGIN } from '@/lib/seo/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /*
       * Personal result endpoints are excluded from CRAWLING (section 79).
       *
       * Note what is NOT here: pages that must be seen as `noindex` are never
       * blocked. A blocked page can never have its noindex tag read, so
       * blocking it is the one reliable way to keep an unwanted page in the
       * index (sections 25, 79).
       *
       * CSS and JS are not blocked either — a crawler that cannot render the
       * page cannot judge it.
       */
      disallow: ['/api/', '/search'],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  }
}

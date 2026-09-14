import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN, canonicalUrl } from '@/lib/seo/site'

/**
 * Structured data builders (section 26, 156).
 *
 * There are builders ONLY for types whose claims are visible on the page.
 * There is deliberately no builder for AggregateRating, Review, award counts,
 * pass percentages or student counts — not because they are hard, but because
 * this site has no honest value to put in them, and a schema field is a factual
 * claim to search engines exactly as a sentence is to a reader.
 */

export type JsonLd = Record<string, unknown>

export function organizationSchema(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    description: SITE_DESCRIPTION,
  }
}

export function webSiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-PK',
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    /*
     * No `potentialAction` / SearchAction. That markup advertises a site search
     * endpoint to search engines; this site does not perform one, and pointing
     * it at a URL that does not exist is a claim we cannot honour.
     */
  }
}

export function webPageSchema(input: {
  path: string
  name: string
  description: string
  dateModified?: string
}): JsonLd {
  const url = canonicalUrl(input.path)
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: 'en-PK',
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path),
    })),
  }
}

/**
 * FAQ markup is emitted only where real questions are answered in visible page
 * copy. Never generate questions to obtain the schema (section 27).
 */
export function faqSchema(items: { question: string; answer: string }[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function itemListSchema(input: { name: string; items: Crumb[] }): JsonLd {
  return {
    '@type': 'ItemList',
    name: input.name,
    itemListElement: input.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: canonicalUrl(item.path),
    })),
  }
}

/**
 * Wraps nodes in a single `@graph` and serializes them safely.
 *
 * `<` is escaped to `<` so that a string containing `</script>` — a board
 * name, a quoted notice, anything sourced — cannot close the script element
 * early and inject markup into the page.
 */
export function jsonLdGraph(nodes: JsonLd[]): string {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
  return JSON.stringify(graph).replace(/</g, '\\u003c')
}

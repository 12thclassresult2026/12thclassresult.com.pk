import type { Metadata } from 'next'

import {
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_ORIGIN,
  canonicalUrl,
  normalizePath,
} from './site'

/**
 * The centralized metadata system (section 21). Routes never assemble metadata
 * by hand, so boilerplate cannot drift between pages.
 */

/**
 * Search results cut titles off at roughly 60 characters (about 560px).
 * This is a target, not a hard limit — clarity wins over the count.
 */
export const TITLE_MAX = 60

const BRAND_SUFFIX = ` | ${SITE_NAME}`

/*
 * No default OG image yet, deliberately.
 *
 * Referencing `/og/default.png` before that file exists would put a 404 into
 * every page's Open Graph metadata, which is worse than having no image tag at
 * all. A real branded OG image needs brand assets the owner has not supplied,
 * so this stays unset until one exists and is committed.
 */
const DEFAULT_OG_IMAGE: string | null = null

/**
 * Appends the brand ONLY when the result still fits.
 *
 * There is deliberately no root `title.template`. An unconditional suffix
 * pushes every descriptive title past the cut-off, and the part that gets
 * truncated is the end — which is where the board name lives. A title that has
 * to choose between naming the board and naming the site should name the board.
 */
export function brandedTitle(title: string): string {
  return title.length + BRAND_SUFFIX.length <= TITLE_MAX ? `${title}${BRAND_SUFFIX}` : title
}

export type PageMetadataInput = {
  path: string
  title: string
  description: string
  /** Defaults to true. */
  index?: boolean
  /** Defaults to true. False ONLY for the 404, which has no address of its own. */
  canonical?: boolean
  ogImagePath?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

export function buildMetadata(input: PageMetadataInput): Metadata {
  const {
    path,
    title,
    description,
    index = true,
    canonical = true,
    ogImagePath = DEFAULT_OG_IMAGE,
    type = 'website',
    publishedTime,
    modifiedTime,
  } = input

  const url = canonicalUrl(path)
  const image = ogImagePath ? canonicalUrl(ogImagePath) : null

  return {
    title: brandedTitle(title),
    description,
    ...(canonical ? { alternates: { canonical: url } } : {}),
    robots: {
      index,
      /*
       * NOINDEX MEANS `follow: true`, NOT `nofollow`.
       *
       * A held draft board page still links to that board's official result
       * portal. Telling crawlers to ignore every link on the page as well
       * helps nobody — it does not protect anything, and it discards the one
       * genuinely useful signal the page carries.
       */
      follow: true,
      ...(index ? {} : { nocache: true }),
      googleBot: {
        index,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: brandedTitle(title),
      description,
      locale: SITE_LOCALE,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: brandedTitle(title),
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

/**
 * The route-facing API. Routes call THIS, never `buildMetadata` directly (the
 * 404 is the one exception, since it has no registry entry).
 *
 * Indexability is re-derived here rather than trusted, so a page whose status
 * is `draft` or `planned` can never be indexable even if its registry row says
 * `index: true`.
 */
export function metadataForPage(page: {
  path: string
  title: string
  description: string
  index: boolean
  status: 'published' | 'draft' | 'planned'
}): Metadata {
  return buildMetadata({
    path: page.path,
    title: page.title,
    description: page.description,
    index: page.index && page.status === 'published',
  })
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: canonicalUrl('/') },
  // Icons are served by `app/icon.svg`, which Next.js wires up automatically.
  // No `/favicon.ico` or apple-touch-icon is declared until those files exist.
  formatDetection: { telephone: false, address: false, email: false },
}

/** Re-exported so callers need only one import for path handling. */
export { normalizePath }

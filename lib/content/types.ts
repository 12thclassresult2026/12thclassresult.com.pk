/**
 * The typed page registry contract (sections 116, 132, 165).
 *
 * ONE registry, many consumers. Routes resolve their entry from it, metadata is
 * built from it, sitemaps are generated from it, the internal-link graph is
 * derived from it, and the validation gates read it. A page therefore cannot
 * exist in one system while being invisible to the others.
 *
 * Board data is deliberately typed TypeScript rather than a database: it is
 * small, it is reviewed in pull requests, and it belongs under version control
 * with its provenance. D1 is reserved for genuinely dynamic state (section 17).
 */

export type PageType =
  | 'home'
  | 'result-hub'
  | 'result-board'
  | 'result-province'
  | 'result-year'
  | 'result-method'
  | 'board-hub'
  | 'board-directory'
  | 'gazette'
  | 'subject'
  | 'group'
  | 'study-material'
  | 'past-paper'
  | 'exam-prep'
  | 'guide'
  | 'update'
  | 'tool'
  | 'legal'
  | 'utility'

/** Sitemap segmentation (section 164). Split further when a segment grows. */
export const SITEMAP_SEGMENTS = [
  'core',
  'results',
  'boards',
  'gazettes',
  'subjects',
  'study-material',
  'past-papers',
  'exam-prep',
  'guides',
  'updates',
  'tools',
] as const

export type SitemapSegment = (typeof SITEMAP_SEGMENTS)[number]

/**
 *  - `published` live and indexable when `index` is also true
 *  - `draft`     route exists and serves, never indexed, never publicly linked
 *  - `review`    built and awaiting publication review. Serves, never indexed.
 *  - `archived`  a past session, still valuable and indexable, no longer on a
 *                volatile review cadence.
 *  - `planned`   inventory only. No route is built. Never indexable.
 */
export type PublishStatus = 'published' | 'archived' | 'review' | 'draft' | 'planned'

/**
 * One canonical owner per real intent (section 115). A primary keyword must
 * never be assigned to two competing canonical pages.
 */
export type SeoTarget = {
  primaryKeyword: string
  secondaryKeywords: string[]
  semanticEntities: string[]
  searchIntent: string
  /** Synonyms consolidated INTO this page rather than given their own URL. */
  queryVariants: string[]
  parentTopic?: string
}

/**
 *  - `none`     the page asserts no volatile factual claim of its own
 *  - `direct`   the page OWNS a claim and must register the source for it
 *  - `derived`  every fact is rendered from a provenance-carrying registry, and
 *               the page must hard-code NO factual claim that bypasses it
 */
export type SourceRequirementMode = 'none' | 'direct' | 'derived'

/**
 * Editorial review cadence — explicitly NOT a crawler schedule (section 159).
 *   A = 3 days    (live: result status during a season)
 *   B = 30 days   (seasonal: dates, announcements)
 *   C = 90 days   (periodic: board procedure, methods)
 *   D = 365 days  (evergreen: how grading works)
 */
export type FreshnessClass = 'A' | 'B' | 'C' | 'D'

export type Crumb = {
  name: string
  path: string
}

export type PageEntry = {
  /** Stable id referenced by routes via `requirePage`. */
  id: string
  /** Normalized path. Must already satisfy `normalizePath`. */
  path: string
  pageType: PageType
  /**
   * The canonical intent this page owns, from `lib/content/intents.ts`.
   *
   * For entity families (board pages) the intent is scoped by `boardId` and
   * `year` — see `intentKey()` in the registry. Two published pages may never
   * share a scoped intent key.
   */
  intentId: string
  /** Set for pages about one board. Scopes the intent key. */
  boardId?: string
  /** Set for pages about one session. Scopes the intent key. */
  year?: number
  sitemapSegment: SitemapSegment
  status: PublishStatus
  /** False means noindex AND excluded from the sitemap. */
  index: boolean
  title: string
  h1: string
  description: string
  seoTarget: SeoTarget
  /** Starts at '/' and ends at this page itself. */
  breadcrumb: Crumb[]
  sourceRequirementMode: SourceRequirementMode
  /** Ids into the result-source registry. Required when mode is 'direct'. */
  sourceIds: string[]
  freshnessClass: FreshnessClass
  /** Drives sitemap `lastmod`. Never build time. */
  contentUpdatedAt: string
  /** Last time the facts on this page were verified against sources. */
  lastVerifiedAt: string | null
  /**
   * Last time a human re-checked this page. A review can confirm that nothing
   * changed, which is itself worth recording — and is why the UI says "last
   * reviewed" rather than "last updated".
   */
  lastReviewedAt: string | null
  /** Outbound internal links, used to detect orphans and broken links. */
  internalLinksOut: string[]
  /** True for pages legitimately reachable without an inbound internal link. */
  isEntryPoint?: boolean
}

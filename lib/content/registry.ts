import type { PageEntry, SitemapSegment } from './types'

import { BOARDS } from '@/lib/board/registry'
import { isKnownIntent } from './intents'
import { normalizePath } from '@/lib/seo/site'

/**
 * The page registry — one source of truth for routing metadata, sitemap
 * membership, internal linking and the validation gates.
 *
 * CANONICAL INTENT CONSOLIDATION. Live search results show that "12th class
 * result", "2nd year result", "HSSC Part-II result" and "inter part 2 result"
 * return the same domains and frequently the same URLs. That is ONE intent, not
 * four, so it gets ONE canonical owner — the evergreen hub — and the synonyms
 * are recorded as query variants rather than given their own URLs.
 *
 * The homepage deliberately does NOT own the head result term. A homepage that
 * competes with its own hub for the same query splits the signal between two
 * URLs and wins with neither.
 *
 * BOARD PAGES ARE YEARLESS (ADR-004). No competitor maintains year-stamped
 * archive URLs — theirs 404 while the yearless page resolves and carries the
 * year in its title. The yearless page is the durable asset; a year-specific
 * board page is created only when a past session has durable value of its own.
 */

const UPDATED_AT = '2026-09-14'

const BUILT_PAGES: PageEntry[] = [
  {
    id: 'home',
    path: '/',
    pageType: 'home',
    intentId: 'site.brand',
    sitemapSegment: 'core',
    status: 'published',
    index: true,
    title: '12th Class Result 2026 — Boards, Dates & Official Sources',
    h1: 'Check your 12th class result',
    description:
      'Find your 12th class (HSSC Part-II) result board by board, with the official portal for each, what each board actually asks for, and what has and has not been announced.',
    seoTarget: {
      primaryKeyword: '12thclassresult.com.pk',
      secondaryKeywords: ['12th class result website', 'hssc part 2 result portal'],
      semanticEntities: ['HSSC Part-II', 'Pakistan education boards', 'Intermediate result'],
      searchIntent: 'Navigational — reach this site and route to the right board or guide.',
      queryVariants: [],
    },
    breadcrumb: [{ name: 'Home', path: '/' }],
    sourceRequirementMode: 'derived',
    sourceIds: [],
    freshnessClass: 'B',
    contentUpdatedAt: UPDATED_AT,
    lastVerifiedAt: UPDATED_AT,
    lastReviewedAt: UPDATED_AT,
    internalLinksOut: ['/results/12th-class', '/boards'],
    isEntryPoint: true,
  },
  {
    id: 'result-evergreen',
    path: '/results/12th-class',
    pageType: 'result-hub',
    intentId: 'result.head',
    sitemapSegment: 'results',
    status: 'published',
    index: true,
    title: '12th Class Result — HSSC Part-II Result by Board',
    h1: '12th Class Result (HSSC Part-II)',
    description:
      'The 12th class result explained board by board: which official portal serves each board, what it asks for, and how to tell an announced result from an expected one.',
    seoTarget: {
      // THE head term for this site. Owned here and nowhere else.
      primaryKeyword: '12th class result',
      secondaryKeywords: [
        '12th class result check online',
        'hssc part 2 result by roll number',
        'intermediate part 2 result',
      ],
      semanticEntities: [
        'HSSC Part-II',
        'Second Year',
        'Intermediate Part-II',
        'Pakistan education boards',
      ],
      searchIntent:
        'Informational and transactional — find and check a 12th class result for a specific board.',
      // Synonyms consolidated INTO this page rather than given their own URLs.
      queryVariants: [
        '2nd year result',
        'second year result',
        'hssc part 2 result',
        'hssc part ii result',
        'inter part 2 result',
        '12 class result',
      ],
    },
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: '12th Class Result', path: '/results/12th-class' },
    ],
    sourceRequirementMode: 'derived',
    sourceIds: [],
    freshnessClass: 'B',
    contentUpdatedAt: UPDATED_AT,
    lastVerifiedAt: UPDATED_AT,
    lastReviewedAt: UPDATED_AT,
    internalLinksOut: ['/boards', '/'],
  },
  {
    id: 'boards-directory',
    path: '/boards',
    pageType: 'board-directory',
    intentId: 'board.directory',
    sitemapSegment: 'boards',
    status: 'published',
    index: true,
    title: 'Pakistan Education Boards — 12th Class Result Portals',
    h1: 'Education Boards',
    description:
      'Every board covered here, with its official website, the portal that actually serves HSSC Part-II results, and an honest note on what has been verified for each.',
    seoTarget: {
      primaryKeyword: 'education boards pakistan 12th class result',
      secondaryKeywords: ['bise boards list', 'punjab boards result portals'],
      semanticEntities: ['BISE', 'FBISE', 'Punjab boards'],
      searchIntent: 'Navigational — find the right board and its official portal.',
      queryVariants: ['bise board list', 'all boards 12th class result'],
    },
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Boards', path: '/boards' },
    ],
    sourceRequirementMode: 'derived',
    sourceIds: [],
    freshnessClass: 'C',
    contentUpdatedAt: UPDATED_AT,
    lastVerifiedAt: UPDATED_AT,
    lastReviewedAt: UPDATED_AT,
    internalLinksOut: ['/results/12th-class'],
  },
]

/**
 * Inventory only — no route is built for these, and none is indexable.
 *
 * They exist so the uniqueness, cannibalization and source-requirement gates run
 * against the full planned inventory rather than only what happens to be built
 * today. A page moves out of this list when its route ships.
 */
const PLANNED: PageEntry[] = [
  {
    id: 'result-2026',
    path: '/results/12th-class/2026',
    pageType: 'result-year',
    intentId: 'result.session.current',
    year: 2026,
    sitemapSegment: 'results',
    status: 'planned',
    index: false,
    title: '12th Class Result 2026 — Board-by-Board Status',
    h1: '12th Class Result 2026',
    description:
      'Board-by-board status for the 2026 HSSC Part-II result: what each board has officially announced, what is still unannounced, and where to check.',
    seoTarget: {
      primaryKeyword: '12th class result 2026',
      secondaryKeywords: ['2nd year result 2026', 'hssc part 2 result 2026'],
      semanticEntities: ['HSSC Part-II 2026'],
      searchIntent: 'Transactional — check the current session result.',
      queryVariants: ['12 class result 2026', 'inter part 2 result 2026'],
      parentTopic: '12th class result',
    },
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: '12th Class Result', path: '/results/12th-class' },
      { name: '2026', path: '/results/12th-class/2026' },
    ],
    sourceRequirementMode: 'derived',
    sourceIds: [],
    freshnessClass: 'A',
    contentUpdatedAt: UPDATED_AT,
    lastVerifiedAt: null,
    lastReviewedAt: null,
    internalLinksOut: ['/results/12th-class'],
  },
  /*
   * One planned page per registered board, generated from the board registry so
   * a board can never exist in one system and be missing from the other.
   *
   * Yearless by design: the current session's status renders on this page with
   * the year in the title, and a past session earns its own URL only if it has
   * durable value.
   */
  ...BOARDS.map<PageEntry>((board) => ({
    id: `result-board-${board.id}`,
    path: `/results/${board.slug}/12th-class`,
    pageType: 'result-board',
    intentId: 'result.board',
    boardId: board.id,
    sitemapSegment: 'results',
    status: board.publishState,
    index: false,
    title: `${board.shortName} 12th Class Result`,
    h1: `${board.shortName} 12th Class Result`,
    description: `${board.officialName}: where its HSSC Part-II result is published, what the official portal asks for, and what has actually been verified.`,
    seoTarget: {
      primaryKeyword: `${board.shortName.toLowerCase()} 12th class result`,
      secondaryKeywords: [`${board.shortName.toLowerCase()} 2nd year result`],
      semanticEntities: [board.officialName, 'HSSC Part-II'],
      searchIntent: 'Transactional — check this board’s 12th class result.',
      queryVariants: [`${board.shortName.toLowerCase()} hssc part 2 result`],
      parentTopic: '12th class result',
    },
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: '12th Class Result', path: '/results/12th-class' },
      { name: board.shortName, path: `/results/${board.slug}/12th-class` },
    ],
    sourceRequirementMode: 'derived',
    sourceIds: board.sourceIds,
    freshnessClass: 'A',
    contentUpdatedAt: UPDATED_AT,
    lastVerifiedAt: null,
    lastReviewedAt: null,
    internalLinksOut: ['/results/12th-class', '/boards'],
  })),
]

export const PAGES: readonly PageEntry[] = [...BUILT_PAGES, ...PLANNED]

const PAGE_BY_ID = new Map(PAGES.map((p) => [p.id, p]))
const PAGE_BY_PATH = new Map(PAGES.map((p) => [normalizePath(p.path), p]))

/**
 * The intent key a page occupies.
 *
 * A family intent like `result.board` is legitimately shared by every board —
 * what must be unique is the intent *scoped to its entity*. Scoping by board
 * and year means two Lahore pages for the same session collide, while Lahore
 * and Multan do not.
 */
export function intentKey(page: PageEntry): string {
  return [page.intentId, page.boardId ?? '', page.year ?? ''].join(':')
}

export function getPage(id: string): PageEntry | undefined {
  return PAGE_BY_ID.get(id)
}

export function getPageByPath(path: string): PageEntry | undefined {
  return PAGE_BY_PATH.get(normalizePath(path))
}

/**
 * Resolve a page or fail the build.
 *
 * Routes call this rather than `getPage`, so a route referencing an id that is
 * not in the registry cannot silently render without metadata.
 */
export function requirePage(id: string): PageEntry {
  const page = PAGE_BY_ID.get(id)
  if (!page) throw new Error(`Unknown page id: ${id}`)
  return page
}

/** Pages with a route that serves — published, archived, in review, or draft. */
export function routedPages(): PageEntry[] {
  return PAGES.filter((p) => p.status !== 'planned')
}

export function livePages(): PageEntry[] {
  return PAGES.filter((p) => p.status === 'published' || p.status === 'archived')
}

/** The only pages that may appear in a sitemap. */
export function indexablePages(): PageEntry[] {
  return PAGES.filter((p) => (p.status === 'published' || p.status === 'archived') && p.index)
}

export function pagesInSegment(segment: SitemapSegment): PageEntry[] {
  return indexablePages().filter((p) => p.sitemapSegment === segment)
}

export function populatedSegments(): SitemapSegment[] {
  const segments = new Set(indexablePages().map((p) => p.sitemapSegment))
  return [...segments]
}

/** Two entries resolving to the same normalized path. */
export function findRouteCollisions(): string[] {
  const seen = new Set<string>()
  const collisions: string[] = []
  for (const page of PAGES) {
    const path = normalizePath(page.path)
    if (seen.has(path)) collisions.push(path)
    seen.add(path)
  }
  return collisions
}

/** Two published pages claiming the same entity-scoped intent. */
export function findIntentConflicts(): { key: string; paths: string[] }[] {
  const owners = new Map<string, string[]>()
  for (const page of livePages()) {
    const key = intentKey(page)
    owners.set(key, [...(owners.get(key) ?? []), page.path])
  }
  return [...owners.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([key, paths]) => ({ key, paths }))
}

/** Pages declaring an intent that is not in the intent registry. */
export function findUnknownIntents(): { path: string; intentId: string }[] {
  return PAGES.filter((p) => !isKnownIntent(p.intentId)).map((p) => ({
    path: p.path,
    intentId: p.intentId,
  }))
}

export function inboundLinkCounts(): Map<string, number> {
  const counts = new Map<string, number>()
  for (const page of PAGES) {
    for (const target of page.internalLinksOut) {
      const path = normalizePath(target)
      counts.set(path, (counts.get(path) ?? 0) + 1)
    }
  }
  return counts
}

/** Indexable pages with no inbound internal link and no entry-point exemption. */
export function findOrphanPages(): PageEntry[] {
  const counts = inboundLinkCounts()
  return indexablePages().filter(
    (p) => !p.isEntryPoint && (counts.get(normalizePath(p.path)) ?? 0) === 0,
  )
}

/** Internal links pointing at a path no registry entry owns. */
export function findBrokenInternalLinks(): { from: string; to: string }[] {
  const broken: { from: string; to: string }[] = []
  for (const page of PAGES) {
    for (const target of page.internalLinksOut) {
      if (!PAGE_BY_PATH.has(normalizePath(target))) {
        broken.push({ from: page.path, to: target })
      }
    }
  }
  return broken
}

/** Primary keywords claimed by more than one page. */
export function findKeywordConflicts(): { keyword: string; paths: string[] }[] {
  const owners = new Map<string, string[]>()
  for (const page of PAGES) {
    const keyword = page.seoTarget.primaryKeyword.toLowerCase()
    owners.set(keyword, [...(owners.get(keyword) ?? []), page.path])
  }
  return [...owners.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([keyword, paths]) => ({ keyword, paths }))
}

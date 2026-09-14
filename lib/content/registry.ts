import type { PageEntry, SitemapSegment } from './types'

import { BOARDS } from '@/lib/board/registry'
import { normalizePath } from '@/lib/seo/site'

/**
 * The page registry — one source of truth for routing metadata, sitemap
 * membership, internal linking and the validation gates (section 116).
 *
 * CANONICAL INTENT CONSOLIDATION (sections 125, 173A). Live search results show
 * that "12th class result", "2nd year result", "HSSC Part-II result" and "inter
 * part 2 result" return the same domains and frequently the same URLs. That is
 * ONE intent, not four, so it gets ONE canonical owner — the evergreen hub — and
 * the synonyms are recorded as query variants rather than given their own URLs.
 *
 * The homepage deliberately does NOT own the head result term. A homepage that
 * competes with its own hub for the same query splits the signal between two
 * URLs and wins with neither.
 */

const UPDATED_AT = '2026-09-14'

const BUILT_PAGES: PageEntry[] = [
  {
    id: 'home',
    path: '/',
    pageType: 'home',
    sitemapSegment: 'core',
    status: 'published',
    index: true,
    title: '12th Class Result 2026 — Boards, Dates & Official Sources',
    /*
     * NOT "12th Class Result 2026", which belongs to the year hub.
     *
     * The homepage is navigational — it routes a reader to the right board or
     * guide. Giving it the year hub's heading made two pages claim the same
     * H1, which the content gate rejected. A task-first heading is also the
     * more useful one here: the reader's goal is to check a result, not to read
     * a page title back to themselves.
     */
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
 * They exist here so the uniqueness, cannibalization and source-requirement
 * gates run against the full planned inventory rather than only what happens to
 * be built today. A page moves out of this list when its route ships.
 */
const PLANNED: PageEntry[] = [
  {
    id: 'result-2026',
    path: '/results/12th-class/2026',
    pageType: 'result-year',
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
  // One planned page per registered board. Generated from the board registry so
  // a board can never exist in one system and be missing from the other.
  ...BOARDS.map<PageEntry>((board) => ({
    id: `result-2026-${board.id}`,
    path: `/results/${board.slug}/12th-class/2026`,
    pageType: 'result-board',
    sitemapSegment: 'results',
    status: 'planned',
    index: false,
    title: `${board.shortName} 12th Class Result 2026`,
    h1: `${board.shortName} 12th Class Result 2026`,
    description: `${board.officialName}: the official portal that serves its HSSC Part-II result, what it asks for, and what has been verified about the 2026 session.`,
    seoTarget: {
      primaryKeyword: `${board.shortName.toLowerCase()} 12th class result 2026`,
      secondaryKeywords: [`${board.shortName.toLowerCase()} 2nd year result 2026`],
      semanticEntities: [board.officialName, 'HSSC Part-II 2026'],
      searchIntent: 'Transactional — check this board’s 12th class result.',
      queryVariants: [`${board.shortName.toLowerCase()} hssc part 2 result 2026`],
      parentTopic: '12th class result 2026',
    },
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: '12th Class Result', path: '/results/12th-class' },
      { name: board.shortName, path: `/results/${board.slug}/12th-class/2026` },
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

/** Pages with a route that serves — published or held as a draft. */
export function routedPages(): PageEntry[] {
  return PAGES.filter((p) => p.status !== 'planned')
}

export function livePages(): PageEntry[] {
  return PAGES.filter((p) => p.status === 'published')
}

/** The only pages that may appear in a sitemap. */
export function indexablePages(): PageEntry[] {
  return PAGES.filter((p) => p.status === 'published' && p.index)
}

export function pagesInSegment(segment: SitemapSegment): PageEntry[] {
  return indexablePages().filter((p) => p.sitemapSegment === segment)
}

export function populatedSegments(): SitemapSegment[] {
  const segments = new Set(indexablePages().map((p) => p.sitemapSegment))
  return [...segments]
}

/** Two pages resolving to the same normalized path. */
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

/** Primary keywords claimed by more than one page (section 115). */
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

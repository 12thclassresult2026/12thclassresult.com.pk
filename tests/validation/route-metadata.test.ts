import { describe, expect, it } from 'vitest'

import { metadata as boardsMetadata } from '@/app/boards/page'
import { metadata as notFoundMetadata } from '@/app/not-found'
import { metadata as homeMetadata } from '@/app/page'
import { metadata as hubMetadata } from '@/app/results/12th-class/page'
import { metadata as recheckingMetadata } from '@/app/guides/rechecking/page'
import { getPageByPath, indexablePages } from '@/lib/content/registry'
import { canonicalUrl } from '@/lib/seo/site'

/**
 * The route-to-registry drift gate.
 *
 * ADDING AN INDEXABLE ROUTE MEANS ADDING IT HERE. The final test asserts that
 * every indexable registry page appears in this list, so a new route cannot
 * ship uncovered.
 */
const ROUTE_MODULES = [
  { path: '/', metadata: homeMetadata },
  { path: '/results/12th-class', metadata: hubMetadata },
  { path: '/boards', metadata: boardsMetadata },
  { path: '/guides/rechecking', metadata: recheckingMetadata },
] as const

describe('route metadata matches the registry', () => {
  for (const route of ROUTE_MODULES) {
    it(`${route.path} renders its registry title and description`, () => {
      const page = getPageByPath(route.path)
      expect(page, `no registry entry for ${route.path}`).toBeDefined()
      expect(route.metadata.title).toContain(page!.title)
      expect(route.metadata.description).toBe(page!.description)
    })

    it(`${route.path} canonicalizes to its registry path on the production origin`, () => {
      expect(route.metadata.alternates?.canonical).toBe(canonicalUrl(route.path))
    })

    it(`${route.path} aligns its OG url with its canonical`, () => {
      expect(route.metadata.openGraph?.url).toBe(canonicalUrl(route.path))
    })

    it(`${route.path} is marked indexable`, () => {
      const robots = route.metadata.robots as { index: boolean }
      expect(robots.index).toBe(true)
    })
  }

  it('serves the 404 as noindex with no canonical of its own', () => {
    const robots = notFoundMetadata.robots as { index: boolean; follow: boolean }
    expect(robots.index).toBe(false)
    expect(robots.follow).toBe(true)
    expect(notFoundMetadata.alternates?.canonical).toBeUndefined()
  })

  it('covers every indexable page with a built route', () => {
    const covered = ROUTE_MODULES.map((r) => r.path)
    for (const page of indexablePages()) {
      expect(covered, `indexable page ${page.path} has no route in ROUTE_MODULES`).toContain(
        page.path,
      )
    }
  })
})

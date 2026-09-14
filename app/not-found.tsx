import type { Metadata } from 'next'
import Link from 'next/link'

import { buildMetadata } from '@/lib/seo/metadata'

/**
 * `canonical: false` is the interesting part.
 *
 * A 404 is served at whatever address was mistyped, so it has no address of its
 * own. Declaring `/404` as its canonical would point at a URL that does not
 * exist on this site.
 */
export const metadata: Metadata = buildMetadata({
  path: '/404',
  title: 'Page not found',
  description: 'That page does not exist on this site.',
  index: false,
  canonical: false,
})

export default function NotFound() {
  return (
    <div className="container-wide py-20">
      <p className="text-primary-700 text-sm font-semibold">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-2xl text-[var(--text-body)]">
        That address does not exist here. It may have been mistyped, or it may be a page this site
        has not published.
      </p>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
        <li>
          <Link href="/" className="text-primary-700 underline underline-offset-4">
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/results/12th-class"
            className="text-primary-700 underline underline-offset-4"
          >
            12th class result
          </Link>
        </li>
        <li>
          <Link href="/boards" className="text-primary-700 underline underline-offset-4">
            All boards
          </Link>
        </li>
      </ul>
    </div>
  )
}

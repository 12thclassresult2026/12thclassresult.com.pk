import Link from 'next/link'

import type { Crumb } from '@/lib/content/types'

/**
 * Visible breadcrumbs, rendered from the same registry array that feeds
 * `breadcrumbSchema`. Visible and structured-data breadcrumbs therefore cannot
 * disagree — they are one source.
 *
 * A validation gate asserts each trail starts at `/` and ends at the page
 * itself, so no invented level can appear.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  if (trail.length < 2) return null
  const last = trail.length - 1

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--text-muted)]">
        {trail.map((crumb, i) => (
          <li key={crumb.path} className="flex items-center gap-2">
            {i === last ? (
              <span aria-current="page" className="font-medium text-[var(--text-body)]">
                {crumb.name}
              </span>
            ) : (
              <Link href={crumb.path} className="hover:text-primary-700">
                {crumb.name}
              </Link>
            )}
            {i < last ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}

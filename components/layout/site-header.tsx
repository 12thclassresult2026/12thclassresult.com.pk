import Link from 'next/link'

import { SITE_SHORT_NAME } from '@/lib/seo/site'

/**
 * Site header. A server component: it holds no state and needs no JavaScript.
 *
 * The navigation deliberately stays small while the inventory is small. The
 * mega-menu architecture in sections 100-112 is built when there are pages to
 * put in it — a menu advertising sections that do not exist is a worse
 * experience than a short one that works.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--surface)]">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--text-strong)]">
          {SITE_SHORT_NAME}
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link
                href="/results/12th-class"
                className="hover:text-primary-700 text-[var(--text-body)]"
              >
                Results
              </Link>
            </li>
            <li>
              <Link href="/boards" className="hover:text-primary-700 text-[var(--text-body)]">
                Boards
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

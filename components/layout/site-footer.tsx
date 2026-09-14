import Link from 'next/link'

import { SITE_NAME } from '@/lib/seo/site'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
      <div className="container-wide py-10">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link
                href="/results/12th-class"
                className="hover:text-primary-700 text-[var(--text-body)]"
              >
                12th Class Result
              </Link>
            </li>
            <li>
              <Link href="/boards" className="hover:text-primary-700 text-[var(--text-body)]">
                Boards
              </Link>
            </li>
            {/*
              The trust links sit in the footer of every page on purpose. A
              reader deciding whether to believe a date, and a journalist
              deciding whether to cite one, both need them reachable from
              wherever they landed — not only from the homepage.
            */}
            <li>
              <Link href="/methodology" className="hover:text-primary-700 text-[var(--text-body)]">
                How we verify
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary-700 text-[var(--text-body)]">
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/*
          This disclaimer is not boilerplate. Several sites in this market use
          board-like names and board-like branding; being unambiguous about what
          this site is protects the reader, not us.
        */}
        <p className="mt-6 max-w-3xl text-sm text-[var(--text-muted)]">
          {SITE_NAME} is an independent information service. It is not an education board and is not
          affiliated with any board. Results and notifications are published by the boards
          themselves — every board’s own official website is linked here so you can confirm anything
          you read on this site at its source.
        </p>
      </div>
    </footer>
  )
}

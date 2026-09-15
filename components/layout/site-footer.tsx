import Link from 'next/link'

import { BOARDS } from '@/lib/board/registry'
import { SITE_NAME } from '@/lib/seo/site'

/**
 * Site footer, laid out as the column grid the sibling site uses.
 *
 * TWO THINGS THE SIBLING'S FOOTER HAS THAT THIS ONE DOES NOT, deliberately:
 *
 *  - A contact address and support hours. No mailbox exists for this domain
 *    yet. Printing `contact@…` would put a dead address on all 26 pages and
 *    silently swallow every correction a reader tried to send — the opposite
 *    of what a corrections policy is for. The column links to the pages that
 *    say how verification works instead, and the address goes in the same
 *    commit that creates the mailbox.
 *  - Social icons. There are no accounts to link.
 */

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Results',
    links: [
      { href: '/results/12th-class', label: '12th Class Result 2026' },
      { href: '/results/lahore-board/12th-class', label: 'Lahore Board' },
      { href: '/results/karachi-board/12th-class', label: 'Karachi Board' },
      { href: '/results/rawalpindi-board/12th-class', label: 'Rawalpindi Board' },
    ],
  },
  {
    heading: 'Boards',
    links: [
      { href: '/boards', label: 'All education boards' },
      { href: '/results/multan-board/12th-class', label: 'Multan Board' },
      { href: '/results/gujranwala-board/12th-class', label: 'Gujranwala Board' },
      { href: '/results/peshawar-board/12th-class', label: 'Peshawar Board' },
    ],
  },
  {
    heading: 'Guides & tools',
    links: [
      { href: '/tools/percentage-calculator', label: 'Percentage calculator' },
      { href: '/guides/how-percentage-is-calculated', label: 'How percentage is calculated' },
      { href: '/guides/rechecking', label: 'Rechecking and rechecking fees' },
    ],
  },
  {
    heading: 'Trust & info',
    links: [
      { href: '/methodology', label: 'How we verify' },
      { href: '/about', label: 'About this site' },
    ],
  },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark mt-16 bg-[var(--surface-hero)]">
      <div className="container-wide py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand column */}
          <div>
            <p className="text-base font-bold tracking-tight text-[var(--text-on-dark)]">
              12th<span className="text-accent-300">Class</span>Result
              <span className="text-[var(--text-on-dark-muted)]">.com.pk</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-[var(--text-on-dark-muted)]">
              {BOARDS.length} education boards across Pakistan, with the official source for each
              one and the date it was last checked.
            </p>
            <p lang="ur" dir="rtl" className="text-urdu text-accent-300 mt-5 text-[0.9375rem]">
              تعلیم سے روشن پاکستان
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-xs font-semibold tracking-[0.08em] text-[var(--text-on-dark)] uppercase">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-accent-300 text-[var(--text-on-dark-muted)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/*
          This disclaimer is not boilerplate. Several sites in this market use
          board-like names and board-like branding; being unambiguous about what
          this site is protects the reader, not us.
        */}
        <div className="mt-12 border-t border-[var(--border-on-dark)] pt-8">
          <p className="max-w-3xl text-sm text-[var(--text-on-dark-muted)]">
            {SITE_NAME} is an independent information service. It is not an education board and is
            not affiliated with any board. Results and notifications are published by the boards
            themselves — every board’s own official website is linked here so you can confirm
            anything you read on this site at its source.
          </p>
          <p className="mt-6 text-sm text-[var(--text-on-dark-muted)]">
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  )
}

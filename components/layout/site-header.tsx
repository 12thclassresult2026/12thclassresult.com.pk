import Link from 'next/link'

import { SITE_SHORT_NAME } from '@/lib/seo/site'

/**
 * Site header. Still a server component: it holds no state and ships no
 * JavaScript. The mobile menu is a native `<details>`, which opens and closes
 * on its own and stays operable if a script fails to load — the header is the
 * one component that must never depend on hydration to be usable.
 *
 * NAVIGATION RULE: every entry here points at a page that exists. The sibling
 * site's menu carries "Date Schedule", "Gazette 2026" and "SMS Codes"; those
 * pages have not been built here, and advertising them would put a 404 behind
 * the most-clicked element on the site. They get added to this list in the same
 * commit that adds the page, not before.
 */

type NavItem = { href: string; label: string }

const NAV: NavItem[] = [
  { href: '/results/12th-class', label: '12th Result 2026' },
  { href: '/boards', label: 'Boards' },
  { href: '/guides/rechecking', label: 'Rechecking' },
  { href: '/tools/percentage-calculator', label: 'Percentage Calculator' },
  { href: '/methodology', label: 'How we verify' },
]

export function SiteHeader() {
  return (
    <header className="on-dark bg-[var(--surface-header)]">
      {/*
        Utility strip. The tagline is the family's, shared with the sibling
        site; `lang` and `dir` are on the element so a screen reader switches
        voice rather than reading Urdu letters as Latin.
      */}
      <div className="border-b border-[var(--border-on-dark)]">
        <div className="container-wide flex h-9 items-center justify-between gap-4">
          <p
            lang="ur"
            dir="rtl"
            className="text-urdu text-accent-300 text-[0.8125rem] whitespace-nowrap"
          >
            تعلیم سے روشن پاکستان
          </p>
          <p className="hidden text-xs text-[var(--text-on-dark-muted)] sm:block">
            Independent · not a board · every claim linked to its source
          </p>
        </div>
      </div>

      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[var(--text-on-dark)]"
          aria-label={`${SITE_SHORT_NAME} — home`}
        >
          <Mark />
          <span className="text-base leading-tight font-bold tracking-tight sm:text-lg">
            12th<span className="text-accent-300">Class</span>Result
            <span className="text-[var(--text-on-dark-muted)]">.com.pk</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-accent-300 text-[var(--text-on-dark)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/results/12th-class"
            className="bg-accent-600 hover:bg-accent-700 hidden min-h-10 items-center rounded-[var(--radius-button)] px-4 text-sm font-semibold text-white transition-colors sm:inline-flex"
          >
            Check your result
          </Link>

          {/*
            Mobile menu. `group` + `group-open:` gives the open/closed icon
            swap without a line of script.
          */}
          <details className="group relative lg:hidden">
            <summary
              className="flex min-h-10 min-w-10 cursor-pointer list-none items-center justify-center rounded-[var(--radius-button)] border border-[var(--border-on-dark)] text-[var(--text-on-dark)] [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" className="group-open:hidden" />
                <path d="M6 6l12 12M18 6L6 18" className="hidden group-open:block" />
              </svg>
            </summary>

            <nav
              aria-label="Mobile"
              className="absolute right-0 z-50 mt-2 w-64 rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface)] p-2 shadow-[var(--shadow-elevated)]"
            >
              <ul className="text-sm font-medium">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="hover:bg-primary-50 hover:text-primary-800 flex min-h-11 items-center rounded-[var(--radius-button)] px-3 text-[var(--text-body)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-[var(--border-subtle)] pt-1">
                  <Link
                    href="/about"
                    className="hover:bg-primary-50 hover:text-primary-800 flex min-h-11 items-center rounded-[var(--radius-button)] px-3 text-[var(--text-body)]"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}

/** Wordmark glyph. Inline SVG so the header needs no image request. */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 shrink-0">
      <rect width="32" height="32" rx="8" className="fill-accent-600" />
      <path
        d="M9 16.5l4.5 4.5L23 11.5"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

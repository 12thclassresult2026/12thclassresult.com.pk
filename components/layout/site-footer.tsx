import Image from 'next/image'
import Link from 'next/link'

import { BOARDS } from '@/lib/board/registry'
import { SITE_NAME } from '@/lib/seo/site'

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
    <footer className="relative mt-24 w-full">
      {/* ── 1. Top Floating Trust & Value Proposition Banner ──────────────── */}
      <div className="relative z-20 mx-auto -mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-primary-200 bg-primary-50/95 flex flex-col items-stretch justify-between gap-6 rounded-2xl border p-5 shadow-lg backdrop-blur-xs sm:rounded-3xl sm:p-7 lg:flex-row lg:items-center">
          {/* 4 Feature Items */}
          <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {/* 1: Trusted & Accurate */}
            <div className="flex items-center gap-3.5">
              <div className="bg-primary-800 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-xs">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Trusted &amp; Accurate</h4>
                <p className="text-xs text-slate-500">Direct links to official board portals</p>
              </div>
            </div>

            {/* 2: Fast & Easy Access */}
            <div className="flex items-center gap-3.5">
              <div className="bg-primary-800 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-xs">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Fast &amp; Easy Access</h4>
                <p className="text-xs text-slate-500">Know your board route in seconds</p>
              </div>
            </div>

            {/* 3: Your Privacy Matters */}
            <div className="flex items-center gap-3.5">
              <div className="bg-primary-800 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-xs">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Privacy First</h4>
                <p className="text-xs text-slate-500">Zero student data logged or tracked</p>
              </div>
            </div>

            {/* 4: All Pakistan Boards */}
            <div className="flex items-center gap-3.5">
              <div className="bg-primary-800 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-xs">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">All Pakistan Boards</h4>
                <p className="text-xs text-slate-500">{BOARDS.length} education boards covered</p>
              </div>
            </div>
          </div>

          {/* Far Right Handwritten Slogan */}
          <div className="hidden shrink-0 text-right xl:block">
            <span
              className="text-primary-800 block -rotate-3 text-lg leading-snug font-black tracking-wide italic"
              style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '22px' }}
            >
              Education
              <br />
              Builds a Stronger
              <br />
              Pakistan
            </span>
            <svg
              width="110"
              height="10"
              viewBox="0 0 110 10"
              fill="none"
              className="text-primary-700 mt-1 ml-auto"
            >
              <path
                d="M2 7C30 3 80 2 108 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── 2. Deep Navy Main Footer Body ──────────────────────────────────── */}
      <div className="on-dark relative overflow-hidden bg-[var(--surface-hero)] pt-24 pb-12">
        {/* Minar-e-Pakistan Image - Right Side Watermark Decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-12 z-0 hidden opacity-20 select-none lg:block"
          style={{ width: '280px' }}
        >
          <Image
            src="/images/minar-footer.jpg"
            alt=""
            width={280}
            height={374}
            className="h-auto w-full object-contain"
            unoptimized
          />
          <div className="mt-2 text-center">
            <span
              className="text-accent-300 italic"
              style={{
                fontFamily: 'var(--font-caveat), cursive',
                fontSize: '22px',
                fontWeight: 700,
                opacity: 0.9,
              }}
            >
              Proud of
              <br />
              Pakistan&apos;s Students
            </span>
            <div className="bg-accent-300/40 mx-auto mt-1 h-0.5 w-24 rounded-full" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="container-wide relative z-10">
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

          <div className="mt-12 border-t border-[var(--border-on-dark)] pt-8">
            <p className="max-w-3xl text-sm text-[var(--text-on-dark-muted)]">
              {SITE_NAME} is an independent information service. It is not an education board and is
              not affiliated with any board. Results and notifications are published by the boards
              themselves — every board&apos;s own official website is linked here so you can confirm
              anything you read on this site at its source.
            </p>
            <p className="mt-6 text-sm text-[var(--text-on-dark-muted)]">
              © {year} {SITE_NAME}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

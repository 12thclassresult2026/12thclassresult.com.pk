'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'

import { ChevronRightIcon, MenuIcon, XIcon } from '@/components/ui/icons'
import { routedBoards } from '@/lib/board/registry'

/**
 * The navigation a phone actually gets.
 * Redesigned into a premium mobile card drawer matching the exact Result Command Center design.
 */
const SECTIONS = [
  {
    title: 'RESULTS',
    links: [
      {
        label: '12th Class Result 2026',
        href: '/results/12th-class',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
          </svg>
        ),
      },
      {
        label: 'Check your result',
        href: '/#check-result',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        ),
      },
      {
        label: 'Gazette lookup',
        href: '/gazette',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'BOARDS',
    links: [
      /*
        REGIONS FIRST, AND KPK IS NOT OPTIONAL HERE.

        Most of this site's readers are on a phone, and the only board entry in
        this menu was a list of twenty-eight. A student in Peshawar whose result
        was already out had to recognise their board in that list; a student in
        Lahore had to do the same on the morning nine boards declare at once.
        Both now have one tap to their own region.
      */
      {
        label: 'Punjab 12th results',
        href: '/results/punjab/12th-class',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0V3m9 9H3"
            />
          </svg>
        ),
      },
      {
        label: 'KPK 12th results',
        href: '/results/kpk/12th-class',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0V3m9 9H3"
            />
          </svg>
        ),
      },
      {
        label: 'Sindh 12th results',
        href: '/results/sindh/12th-class',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0V3m9 9H3"
            />
          </svg>
        ),
      },
      {
        label: 'All Pakistan boards',
        href: '/boards',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 8h20l-10-5z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    /*
      WHAT THE DESKTOP NAV DROPS BELOW xl LIVES HERE.

      Between 1024 and 1279 the header shows the six core items and tiers the
      rest away, so this drawer is the only route to them at those widths —
      which is why its toggle is xl:hidden rather than lg:hidden.
    */
    title: 'DATES & METHODS',
    links: [
      {
        label: 'Result date schedule',
        href: '/results/12th-class',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        label: 'Check result by SMS',
        href: '/#check-result',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.9 9.9 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        ),
      },
      {
        label: 'Frequently asked questions',
        href: '/#faq-section',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'GUIDES & TOOLS',
    links: [
      {
        label: 'Rechecking',
        href: '/guides/rechecking',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        ),
      },
      {
        label: 'How percentage is calculated',
        href: '/guides/how-percentage-is-calculated',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth={2} />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2"
            />
          </svg>
        ),
      },
      {
        label: 'Percentage calculator',
        href: '/tools/percentage-calculator',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'TRUST & INFO',
    links: [
      {
        label: 'How we verify',
        href: '/methodology',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
      },
      {
        label: 'About',
        href: '/about',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        label: 'FAQs',
        href: '/#faq-section',
        icon: (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
    ],
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const boards = routedBoards()

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition-colors hover:border-[#007054] hover:text-[#007054] active:scale-95 xl:hidden"
      >
        {open ? <XIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
      </button>

      {open ? (
        <div
          id={panelId}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-2.5 backdrop-blur-xs sm:p-5 xl:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false)
              buttonRef.current?.focus()
            }
          }}
        >
          <div className="animate-in fade-in zoom-in-95 my-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl duration-150">
            {/* Header: Title + Domain Subtitle & Circular Close Button */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 sm:px-5 sm:pt-5 sm:pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Menu</h2>
                <p className="text-xs font-medium text-slate-400">12thclassresult.com.pk</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  buttonRef.current?.focus()
                }}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 transition-colors hover:bg-emerald-100 active:scale-95"
              >
                <XIcon width={18} height={18} />
              </button>
            </div>

            <nav aria-label="Mobile" className="px-4 pb-5 sm:px-5 sm:pb-6">
              {/* Primary "Check Result →" Button */}
              <Link
                href="/#check-result"
                onClick={() => setOpen(false)}
                className="mb-3.5 flex items-center justify-center gap-2 rounded-xl bg-[#005B4C] py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#00473B] active:scale-98 sm:py-3"
              >
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Check Result</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>

              {/* Categorized Sections with Icon Pills and Right Chevrons */}
              {SECTIONS.map((section) => (
                <div key={section.title} className="mb-3">
                  {/* Section Title Pill Bar */}
                  <div className="mb-0.5 rounded-md bg-slate-100/75 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase sm:text-[11px]">
                    {section.title}
                  </div>
                  <ul className="divide-y divide-slate-100/80">
                    {section.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between px-1 py-2 text-sm font-semibold text-slate-800 transition-colors hover:text-[#005B4C]"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 sm:h-8 sm:w-8">
                              {link.icon}
                            </span>
                            <span className="text-[13px] font-semibold text-slate-800 sm:text-sm">
                              {link.label}
                            </span>
                          </div>
                          <ChevronRightIcon width={15} height={15} className="text-slate-400" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Board Pages 2-Column Section */}
              <div className="mt-3.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2 sm:p-2.5">
                <div className="mb-1.5 flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase sm:text-[11px]">
                    <svg
                      className="h-3.5 w-3.5 text-emerald-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>Board Pages ({boards.length})</span>
                  </div>
                  <Link
                    href="/boards"
                    onClick={() => setOpen(false)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    View all &rarr;
                  </Link>
                </div>

                <ul className="grid grid-cols-2 gap-1 sm:gap-1.5">
                  {boards.map((board) => (
                    <li key={board.id}>
                      <Link
                        href={`/results/${board.slug}/12th-class`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 shadow-2xs transition-colors hover:bg-emerald-50/60 hover:text-[#005B4C] sm:px-2.5 sm:py-2 sm:text-[12px]"
                      >
                        <span className="truncate">{board.shortName}</span>
                        <ChevronRightIcon
                          width={11}
                          height={11}
                          className="ml-1 shrink-0 text-slate-300"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  )
}

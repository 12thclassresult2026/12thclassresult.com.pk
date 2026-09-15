'use client'

import Image from 'next/image'
import Link from 'next/link'

import { CalendarIcon, StarIcon } from '@/components/ui/icons'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/results/12th-class', label: '12th Result 2026' },
  { href: '/boards', label: 'All Boards' },
  { href: '/guides/rechecking', label: 'Rechecking' },
  { href: '/tools/percentage-calculator', label: 'Percentage Calculator' },
  { href: '/methodology', label: 'How we verify' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 shadow-sm transition-colors">
      {/* Tier 1: Dark Evergreen Top Utility Bar */}
      <div className="border-b border-[#00382E] bg-[#00473B] text-white">
        <div className="container-wide flex h-9 items-center justify-between gap-2 text-[11px] sm:h-10 sm:text-xs">
          <div className="flex items-center gap-1.5 font-medium text-emerald-100">
            <StarIcon width={13} height={13} className="shrink-0 fill-amber-300 text-amber-300" />
            <span className="truncate">Pakistan&apos;s Most Trusted Result Portal</span>
          </div>

          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-black/20 px-3 py-0.5 font-semibold text-white md:inline-flex">
            <CalendarIcon width={12} height={12} className="shrink-0 text-emerald-300" />
            <span>12th Class Result 2026 (HSSC Part-II)</span>
          </div>

          <div className="text-urdu text-xs text-emerald-200" dir="rtl">
            تعلیم سے روشن پاکستان
          </div>
        </div>
      </div>

      {/* Tier 2: Main White Navigation Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-wide flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5"
            aria-label="12thClassResult — home"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 p-1">
              <Image
                src="/icons/crest.svg"
                unoptimized
                alt="12thClassResult.com.pk crest"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                12thClassResult<span className="text-[#007054]">.com.pk</span>
              </div>
              <div className="hidden text-[9px] font-bold tracking-wider text-emerald-800 uppercase sm:block">
                All Pakistan Education Boards
              </div>
            </div>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-6 text-sm font-semibold">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-700 transition-colors hover:text-[#007054]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/results/12th-class"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#007054] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#005a43] hover:shadow-md sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <span>Check Result</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  GridIcon,
  SearchIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  UsersIcon,
  ZapIcon,
} from '@/components/ui/icons'
import type { BoardOption } from '@/components/result/board-finder'

const BOARD_CHIPS = [
  {
    code: 'LHR',
    name: 'BISE',
    city: 'Lahore',
    slug: 'lahore-board',
    logo: '/logos/bise-lahore.webp',
  },
  {
    code: 'GRW',
    name: 'BISE',
    city: 'Gujranwala',
    slug: 'gujranwala-board',
    logo: '/logos/bise-gujranwala.webp',
  },
  {
    code: 'FSD',
    name: 'BISE',
    city: 'Faisalabad',
    slug: 'faisalabad-board',
    logo: '/logos/bise-faisalabad.webp',
  },
  {
    code: 'MUL',
    name: 'BISE',
    city: 'Multan',
    slug: 'multan-board',
    logo: '/logos/bise-multan.webp',
  },
  {
    code: 'RWP',
    name: 'BISE',
    city: 'Rawalpindi',
    slug: 'rawalpindi-board',
    logo: '/logos/bise-rawalpindi.webp',
  },
  {
    code: 'SGD',
    name: 'BISE',
    city: 'Sargodha',
    slug: 'sargodha-board',
    logo: '/logos/bise-sargodha.webp',
  },
  {
    code: 'SAW',
    name: 'BISE',
    city: 'Sahiwal',
    slug: 'sahiwal-board',
    logo: '/logos/bise-sahiwal.webp',
  },
  {
    code: 'BWP',
    name: 'BISE',
    city: 'Bahawalpur',
    slug: 'bahawalpur-board',
    logo: '/logos/bise-bahawalpur.webp',
  },
  {
    code: 'DGK',
    name: 'BISE',
    city: 'DG Khan',
    slug: 'dg-khan-board',
    logo: '/logos/bise-dg-khan.webp',
  },
  {
    code: 'FBI',
    name: 'FBISE',
    city: '(Federal)',
    slug: 'federal-board',
    logo: '/logos/fbise.png',
  },
  {
    code: 'PEW',
    name: 'BISE',
    city: 'Peshawar',
    slug: 'peshawar-board',
    logo: '/logos/bise-peshawar.png',
  },
] as const

export function HeroSection({ boards }: { boards: BoardOption[] }) {
  const router = useRouter()
  const [selectedSlug, setSelectedSlug] = useState('')

  const withPage = boards.filter((b) => b.hasPage)
  const withoutPage = boards.filter((b) => !b.hasPage)
  const chosen = boards.find((b) => b.slug === selectedSlug)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!chosen) return
    router.push(chosen.hasPage ? `/results/${chosen.slug}/12th-class` : '/boards')
  }

  return (
    <section className="relative overflow-hidden bg-[#F8FAF9] bg-[url('/images/hero-bg-campus.jpg')] bg-cover bg-center bg-no-repeat pt-10 pb-20 sm:pt-14 sm:pb-28 lg:pt-16 lg:pb-32">
      {/* Soft daylight gradient overlay: keeps campus image visible while making text pop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/95 lg:from-white/80 lg:via-white/55 lg:to-white/95"
      />

      {/* Left Flank Calligraphy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-6 z-10 hidden text-right select-none lg:block xl:top-20 xl:left-12 2xl:left-20"
      >
        <span
          className="text-urdu block font-serif text-2xl leading-snug font-black text-[#004D3F] xl:text-3xl"
          dir="rtl"
        >
          تعلیم
          <br />
          ترقی
          <br />
          روشن پاکستان
        </span>
      </div>

      {/* Right Flank Slogan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 right-14 z-10 hidden text-left select-none lg:block xl:top-20 xl:right-20 2xl:right-28"
      >
        <span
          className="block text-xs leading-relaxed font-black tracking-[0.25em] text-[#004D3F] uppercase xl:text-sm"
          style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '20px' }}
        >
          EDUCATION
          <br />
          BUILDS A
          <br />
          STRONGER
          <br />
          PAKISTAN
        </span>
        <div className="mt-2 h-1 w-12 rounded-full bg-[#007054]" />
      </div>

      {/* Center Content Container */}
      <div className="container-wide relative z-20">
        <div className="mx-auto max-w-3xl text-center xl:max-w-4xl">
          {/* Tagline Pill Badge */}
          <div className="inline-flex items-center rounded-full border border-emerald-200/80 bg-emerald-50/90 px-4 py-1.5 shadow-xs backdrop-blur-xs">
            <span className="text-[10px] font-black tracking-[0.18em] text-[#007054] uppercase sm:text-[11px]">
              INTERMEDIATE &amp; SECONDARY EDUCATION RESULTS
            </span>
          </div>

          {/* Main Heading H1 */}
          <h1 className="mt-3 text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Check your 12th class result
          </h1>

          {/* Sub-heading */}
          <p className="mt-2 text-center text-lg font-bold text-slate-700 sm:text-xl md:text-2xl">
            12th Class Result <span className="text-[#007054]">2026</span> Pakistan
          </p>

          {/* Subtitle Description */}
          <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-relaxed text-slate-600 sm:text-sm">
            Pakistan&apos;s most trusted and independent portal for 12th Class (HSSC Part-II)
            examination results. Find your board, check announcement dates, official portals, and
            verified result instructions.
          </p>

          {/* Floating Result Checker Card */}
          <div className="mx-auto mt-6 max-w-2xl sm:mt-8">
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-xl backdrop-blur-md sm:rounded-3xl sm:p-7">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#007054]">
                    <SearchIcon width={16} height={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    Find Your Education Board Result
                  </span>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  All 28 Boards
                </span>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <select
                    value={selectedSlug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    aria-label="Select education board"
                    className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-medium text-slate-800 transition-colors focus:border-[#007054] focus:bg-white focus:ring-2 focus:ring-[#007054]/20 focus:outline-none"
                  >
                    <option value="">Select your education board...</option>
                    <optgroup label="Boards with Published Guide">
                      {withPage.map((b) => (
                        <option key={b.slug} value={b.slug}>
                          {b.shortName} — {b.region}
                        </option>
                      ))}
                    </optgroup>
                    {withoutPage.length > 0 && (
                      <optgroup label="Registered Boards">
                        {withoutPage.map((b) => (
                          <option key={b.slug} value={b.slug}>
                            {b.shortName} — {b.region}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!chosen}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#007054] px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-[#005a43] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Check Result</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </form>

              {chosen ? (
                <p className="mt-3 rounded-lg bg-emerald-50/80 p-2 text-left text-xs font-medium text-emerald-800">
                  ✓ Selected: <strong>{chosen.shortName}</strong> ({chosen.region}). Click
                  &quot;Check Result&quot; to open the verified portal guide.
                </p>
              ) : (
                <p className="mt-3 text-center text-xs text-slate-500">
                  Select any Punjab, KPK, Sindh, Balochistan, Federal or AJK board to view result
                  status &amp; official links.
                </p>
              )}
            </div>
          </div>

          {/* 4 Feature Trust Badges Row */}
          <div className="mt-8 grid grid-cols-2 gap-3 text-slate-700 sm:grid-cols-4 sm:gap-4">
            {/* 1: Official Board Links */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/90 p-3 shadow-xs backdrop-blur-xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <ShieldCheckIcon width={18} height={18} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  Official Links
                </span>
                <span className="block truncate text-[10px] text-slate-500">
                  Direct &amp; safe access
                </span>
              </div>
            </div>

            {/* 2: Fast & Easy */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/90 p-3 shadow-xs backdrop-blur-xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <ZapIcon width={18} height={18} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  Fast &amp; Easy
                </span>
                <span className="block truncate text-[10px] text-slate-500">Find in seconds</span>
              </div>
            </div>

            {/* 3: All Pakistan Boards */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/90 p-3 shadow-xs backdrop-blur-xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <UsersIcon width={18} height={18} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  All 28 Boards
                </span>
                <span className="block truncate text-[10px] text-slate-500">
                  All provinces covered
                </span>
              </div>
            </div>

            {/* 4: Mobile Friendly */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/90 p-3 shadow-xs backdrop-blur-xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <SmartphoneIcon width={18} height={18} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  Mobile Ready
                </span>
                <span className="block truncate text-[10px] text-slate-500">Any smartphone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Board Chips Ribbon */}
        <div className="relative z-30 mt-10 -mb-28 sm:mt-12 sm:-mb-36 lg:-mb-40">
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-xl backdrop-blur-md sm:rounded-3xl sm:p-4">
            <div className="flex scrollbar-none items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
              {BOARD_CHIPS.map((b) => (
                <Link
                  key={b.slug}
                  href={`/results/${b.slug}/12th-class`}
                  className="group flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all hover:bg-slate-50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white p-1 shadow-2xs transition-all duration-200 group-hover:scale-110 group-hover:border-[#007054]/40 group-hover:shadow-md sm:h-12 sm:w-12">
                    <Image
                      src={b.logo}
                      alt={`${b.name} ${b.city} official logo`}
                      width={42}
                      height={42}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold whitespace-nowrap text-slate-700 transition-colors group-hover:text-[#007054]">
                    {b.name}
                  </span>
                  <span className="text-[9px] whitespace-nowrap text-slate-500">{b.city}</span>
                </Link>
              ))}

              <Link
                href="/boards"
                className="group flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-2 text-[#007054] shadow-xs transition-all hover:bg-emerald-100/80"
              >
                <GridIcon
                  width={18}
                  height={18}
                  className="text-[#007054] transition-transform group-hover:scale-110"
                />
                <span className="text-[11px] font-bold whitespace-nowrap">All Boards &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

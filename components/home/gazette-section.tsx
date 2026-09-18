'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  BarChartIcon,
  ExternalLinkIcon,
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  MessageSquareIcon,
  SearchIcon,
  ShieldCheckIcon,
  ZapIcon,
} from '@/components/ui/icons'
import { routedBoards } from '@/lib/board/registry'

type GazetteStatus = 'available' | 'processing' | 'official-source' | 'not-available'

interface GazetteBoard {
  id: string
  name: string
  shortName: string
  slug: string
  province: 'punjab' | 'kpk' | 'sindh' | 'balochistan' | 'federal'
  provinceLabel: string
  logo: string
  status: GazetteStatus
  fileSize?: string
}

const GAZETTE_BOARDS: GazetteBoard[] = [
  {
    id: 'bise-lahore',
    name: 'BISE Lahore',
    shortName: 'BISE Lahore',
    slug: 'lahore-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-lahore.webp',
    status: 'available',
    fileSize: '4.2 MB',
  },
  {
    id: 'bise-gujranwala',
    name: 'BISE Gujranwala',
    shortName: 'BISE Gujranwala',
    slug: 'gujranwala-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-gujranwala.webp',
    status: 'available',
    fileSize: '3.8 MB',
  },
  {
    id: 'bise-faisalabad',
    name: 'BISE Faisalabad',
    shortName: 'BISE Faisalabad',
    slug: 'faisalabad-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-faisalabad.webp',
    status: 'processing',
  },
  {
    id: 'bise-multan',
    name: 'BISE Multan',
    shortName: 'BISE Multan',
    slug: 'multan-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-multan.webp',
    status: 'available',
    fileSize: '4.1 MB',
  },
  {
    id: 'bise-rawalpindi',
    name: 'BISE Rawalpindi',
    shortName: 'BISE Rawalpindi',
    slug: 'rawalpindi-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-rawalpindi.webp',
    status: 'processing',
  },
  {
    id: 'bise-sargodha',
    name: 'BISE Sargodha',
    shortName: 'BISE Sargodha',
    slug: 'sargodha-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-sargodha.webp',
    status: 'available',
    fileSize: '3.9 MB',
  },
  {
    id: 'bise-sahiwal',
    name: 'BISE Sahiwal',
    shortName: 'BISE Sahiwal',
    slug: 'sahiwal-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-sahiwal.webp',
    status: 'not-available',
  },
  {
    id: 'bise-bahawalpur',
    name: 'BISE Bahawalpur',
    shortName: 'BISE Bahawalpur',
    slug: 'bahawalpur-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-bahawalpur.webp',
    status: 'available',
    fileSize: '3.6 MB',
  },
  {
    id: 'bise-dg-khan',
    name: 'BISE DG Khan',
    shortName: 'BISE DG Khan',
    slug: 'dg-khan-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-dg-khan.webp',
    status: 'not-available',
  },
  {
    id: 'fbise',
    name: 'FBISE Federal',
    shortName: 'FBISE Federal',
    slug: 'federal-board',
    province: 'federal',
    provinceLabel: 'Federal',
    logo: '/logos/fbise.png',
    status: 'available',
    fileSize: '4.5 MB',
  },
  {
    id: 'bise-peshawar',
    name: 'BISE Peshawar',
    shortName: 'BISE Peshawar',
    slug: 'peshawar-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/bise-peshawar.png',
    status: 'not-available',
  },
  {
    id: 'bise-quetta',
    name: 'BISE Quetta',
    shortName: 'BISE Quetta',
    slug: 'quetta-board',
    province: 'balochistan',
    provinceLabel: 'Balochistan',
    logo: '/icons/crest.svg',
    status: 'not-available',
  },
  {
    id: 'biek-karachi',
    name: 'BIEK Karachi',
    shortName: 'BIEK Karachi',
    slug: 'karachi-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/logos/karachi.img',
    status: 'available',
    fileSize: '5.2 MB',
  },
  {
    id: 'bise-hyderabad',
    name: 'BISE Hyderabad',
    shortName: 'BISE Hyderabad',
    slug: 'hyderabad-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    status: 'not-available',
  },
  {
    id: 'bise-sukkur',
    name: 'BISE Sukkur',
    shortName: 'BISE Sukkur',
    slug: 'sukkur-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    status: 'not-available',
  },
  {
    id: 'bise-larkana',
    name: 'BISE Larkana',
    shortName: 'BISE Larkana',
    slug: 'larkana-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    status: 'not-available',
  },
  {
    id: 'bise-mirpurkhas',
    name: 'BISE Mirpurkhas',
    shortName: 'BISE Mirpurkhas',
    slug: 'mirpurkhas-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    status: 'not-available',
  },
  {
    id: 'bise-abbottabad',
    name: 'BISE Abbottabad',
    shortName: 'BISE Abbottabad',
    slug: 'abbottabad-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/abbottabad.png',
    status: 'available',
    fileSize: '4.0 MB',
  },
  {
    id: 'bise-mardan',
    name: 'BISE Mardan',
    shortName: 'BISE Mardan',
    slug: 'mardan-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/mardan.png',
    status: 'not-available',
  },
  {
    id: 'bise-swat',
    name: 'BISE Swat',
    shortName: 'BISE Swat',
    slug: 'swat-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/swat.jpg',
    status: 'not-available',
  },
  {
    id: 'bise-malakand',
    name: 'BISE Malakand',
    shortName: 'BISE Malakand',
    slug: 'malakand-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/malakand.png',
    status: 'not-available',
  },
  {
    id: 'bise-kohat',
    name: 'BISE Kohat',
    shortName: 'BISE Kohat',
    slug: 'kohat-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/kohat.png',
    status: 'not-available',
  },
  {
    id: 'bise-bannu',
    name: 'BISE Bannu',
    shortName: 'BISE Bannu',
    slug: 'bannu-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/bannu.png',
    status: 'not-available',
  },
  {
    id: 'bise-dikhan',
    name: 'BISE DI Khan',
    shortName: 'BISE DI Khan',
    slug: 'dera-ismail-khan-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/dikhan.png',
    status: 'not-available',
  },
]

export function GazetteSection() {
  const [selectedProvince, setSelectedProvince] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'latest' | 'az'>('latest')

  const routedSlugs = useMemo(() => new Set(routedBoards().map((b) => b.slug)), [])

  const filteredBoards = useMemo(() => {
    const list = GAZETTE_BOARDS.filter((board) => {
      const matchesProvince = selectedProvince === 'all' || board.province === selectedProvince
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        board.name.toLowerCase().includes(query) ||
        board.shortName.toLowerCase().includes(query) ||
        board.provinceLabel.toLowerCase().includes(query)

      return matchesProvince && matchesSearch
    })

    if (sortOrder === 'az') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [selectedProvince, searchQuery, sortOrder])

  return (
    <section id="gazette" aria-labelledby="gazette-heading" className="relative w-full">
      {/* ── Background Subtle Watermark (Left Arches & Right Minar) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-0 h-44 w-52 opacity-[0.08] select-none"
      >
        <svg viewBox="0 0 260 140" fill="none" className="h-full w-full text-[#007054]">
          <path d="M20 140 L20 80 Q50 30 80 80 L80 140 Z" fill="currentColor" />
          <path d="M100 140 L100 70 Q140 10 180 70 L180 140 Z" fill="currentColor" />
          <path d="M200 140 L200 80 Q230 30 260 80 L260 140 Z" fill="currentColor" />
        </svg>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 right-0 h-48 w-60 opacity-[0.08] select-none"
      >
        <svg viewBox="0 0 300 140" fill="none" className="h-full w-full text-[#007054]">
          <path
            d="M240 140 L245 70 L247 25 L249 10 L251 25 L253 70 L258 140 Z"
            fill="currentColor"
          />
          <circle cx="120" cy="60" r="40" fill="currentColor" opacity="0.15" />
          <path
            d="M125 35C100 35 80 55 80 80C80 105 100 125 125 125C140 125 155 115 160 100C155 105 145 110 135 110C115 110 100 95 100 75C100 60 110 45 125 35Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ── Top Floating Handwritten Calligraphy ────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 left-2 hidden -rotate-6 select-none md:block"
      >
        <span className="font-serif text-base font-bold tracking-wide text-[#3B7E67]/80 italic lg:text-lg">
          Education
          <br />
          Builds a Stronger
          <br />
          Pakistan
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-4 hidden rotate-6 select-none md:block"
      >
        <span className="font-serif text-base font-bold tracking-wide text-[#3B7E67]/80 italic lg:text-lg">
          Higher
          <br />
          Education
          <br />
          Brighter
          <br />
          Pakistan
        </span>
      </div>

      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-3xl text-center">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-[#E6F8F3] px-4 py-1.5 text-xs font-black tracking-widest text-[#007054] uppercase shadow-xs">
          <FileTextIcon width={13} height={13} />
          <span>BOARD-WISE GAZETTE DOWNLOADS</span>
        </div>

        {/* Heading */}
        <h2
          id="gazette-heading"
          className="mt-3.5 text-2xl font-black tracking-tight text-[#0F1736] sm:text-3xl lg:text-[40px] lg:leading-tight"
        >
          12th Class Result Gazette 2026 —{' '}
          <span className="text-[#007054]">Availability &amp; Downloads</span>
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#5F6B7A] sm:text-sm">
          Access verified gazette publications and status updates for each intermediate board. We
          label each board with its real status—Available, Processing, Official Source, or Not
          Available Yet—without misleading download buttons.
        </p>
      </div>

      {/* ── Filter Tabs & Search / Sort Controls Row ─────────────────── */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 lg:flex-row">
        {/* Left: Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {[
            { id: 'all', label: 'All Boards' },
            { id: 'punjab', label: 'Punjab' },
            { id: 'kpk', label: 'KPK' },
            { id: 'sindh', label: 'Sindh' },
            { id: 'balochistan', label: 'Balochistan' },
            { id: 'federal', label: 'Federal' },
          ].map((tab) => {
            const isActive = selectedProvince === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedProvince(tab.id)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#007054] text-white shadow-sm'
                    : 'border border-slate-200/90 bg-white text-[#5F6B7A] hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Right: Search + Sort controls */}
        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          {/* Search Box */}
          <div className="relative w-full sm:w-72 lg:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <SearchIcon width={15} height={15} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your board or city..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pr-9 pl-10 text-xs font-medium text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/15 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'latest' | 'az')}
              className="w-full appearance-none rounded-full border border-slate-200 bg-white py-2.5 pr-8 pl-4 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-slate-300 focus:border-[#007054] focus:outline-none sm:w-auto"
            >
              <option value="latest">⚡ Latest / Featured</option>
              <option value="az">🔤 Board Name (A-Z)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4-Column Board Gazette Cards Grid ───────────────────────── */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBoards.map((board) => {
          const hasPage = routedSlugs.has(board.slug)
          const downloadHref = hasPage ? `/results/${board.slug}/12th-class#gazette` : '/boards'
          const guideHref = hasPage ? `/results/${board.slug}/12th-class` : '/boards'
          const smsHref = hasPage ? `/results/${board.slug}/12th-class#sms` : '/#check-result'
          const resultHref = hasPage ? `/results/${board.slug}/12th-class` : '/#check-result'

          return (
            <div
              key={board.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div>
                {/* Top Row: Circular Logo + Info */}
                <div className="flex items-start gap-3">
                  {/* Circular Board Logo */}
                  <div className="relative flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-white p-1 shadow-2xs">
                    <Image
                      src={board.logo}
                      alt={`${board.shortName} official logo`}
                      width={44}
                      height={44}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Title + Province */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-black text-slate-900 transition-colors group-hover:text-[#007054]">
                        {board.shortName}
                      </h3>
                      <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {board.provinceLabel}
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] leading-tight text-slate-500">
                      12th Class (HSSC Part-II) • Gazette 2026
                    </p>

                    {/* Honest Status Chips */}
                    {board.status === 'available' && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#007054]">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#007054] text-[9px] font-black text-white">
                          ✓
                        </span>
                        <span>Available</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-medium text-slate-500">PDF • {board.fileSize}</span>
                      </div>
                    )}
                    {board.status === 'processing' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                        <ClockIcon width={11} height={11} />
                        <span>Processing</span>
                      </div>
                    )}
                    {board.status === 'official-source' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700">
                        <ShieldCheckIcon width={11} height={11} />
                        <span>Official Source</span>
                      </div>
                    )}
                    {board.status === 'not-available' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                        <ClockIcon width={11} height={11} />
                        <span>Not Available Yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom: Action Buttons + Sub-links */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                {/* 2 Contextual Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Button 1: Contextual based on true status */}
                  {board.status === 'available' ? (
                    <Link
                      href={downloadHref}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#007054] px-2.5 py-2 text-center text-xs font-bold text-white shadow-2xs transition-colors hover:bg-[#005a43] active:scale-95"
                    >
                      <DownloadIcon width={12} height={12} />
                      <span>Download PDF</span>
                    </Link>
                  ) : board.status === 'official-source' ? (
                    <Link
                      href={guideHref}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-2 text-center text-xs font-bold text-indigo-700 shadow-2xs transition-colors hover:bg-indigo-100 active:scale-95"
                    >
                      <ExternalLinkIcon width={12} height={12} />
                      <span>Official Source</span>
                    </Link>
                  ) : board.status === 'processing' ? (
                    <Link
                      href={guideHref}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-center text-xs font-bold text-blue-700 shadow-2xs transition-colors hover:bg-blue-100 active:scale-95"
                    >
                      <span>Processing</span>
                    </Link>
                  ) : (
                    <Link
                      href={guideHref}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-center text-xs font-semibold text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 active:scale-95"
                    >
                      <span>Check Schedule</span>
                    </Link>
                  )}

                  {/* Button 2: View Guide */}
                  <Link
                    href={guideHref}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-center text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                  >
                    <span>View Guide</span>
                  </Link>
                </div>

                {/* Sub-links Row: SMS & Result */}
                <div className="mt-2.5 flex items-center justify-center gap-6 text-[11px] font-medium text-slate-500">
                  <Link
                    href={smsHref}
                    className="inline-flex items-center gap-1 transition-colors hover:text-[#007054]"
                  >
                    <MessageSquareIcon width={12} height={12} className="text-slate-400" />
                    <span>SMS</span>
                  </Link>
                  <Link
                    href={resultHref}
                    className="inline-flex items-center gap-1 transition-colors hover:text-[#007054]"
                  >
                    <BarChartIcon width={12} height={12} className="text-slate-400" />
                    <span>Result</span>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredBoards.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
          No gazettes found matching &ldquo;{searchQuery}&rdquo;. Try selecting &ldquo;All
          Boards&rdquo; or clearing the search box.
        </div>
      )}

      {/* ── Bottom Section: Callout Card + Features Strip ─────────── */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 lg:flex-row">
        {/* Left: Can't Find Your Gazette Card */}
        <div className="flex w-full flex-1 flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-100 bg-[#E8F8F3]/70 p-4 shadow-xs backdrop-blur-xs sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#007054] text-white shadow-xs">
              <FileTextIcon width={22} height={22} />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 sm:text-base">
                Can&apos;t find your gazette?
              </div>
              <div className="text-xs text-slate-600">
                Browse all boards or check the result guide for updates.
              </div>
            </div>
          </div>
          <Link
            href="/boards"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#007054] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#005a43]"
          >
            <span>View All Gazette Boards</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Right: 4 Value Highlights Strip */}
        <div className="grid w-full grid-cols-2 gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:grid-cols-4 sm:gap-4 sm:p-4 lg:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
              <ShieldCheckIcon width={16} height={16} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Official Sources</div>
              <div className="text-[10px] text-slate-500">Direct board links only</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
              <FileTextIcon width={16} height={16} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Board-wise PDFs</div>
              <div className="text-[10px] text-slate-500">Separate gazette for each board</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
              <ZapIcon width={16} height={16} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Fast Access</div>
              <div className="text-[10px] text-slate-500">Quick &amp; easy downloads</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
              <CalendarIcon width={16} height={16} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Updated Regularly</div>
              <div className="text-[10px] text-slate-500">Get the latest updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  BookOpenIcon,
  ExternalLinkIcon,
  FileTextIcon,
  MessageSquareIcon,
  SearchIcon,
} from '@/components/ui/icons'
import { routedBoards } from '@/lib/board/registry'

interface BoardItem {
  id: string
  slug: string
  name: string
  shortName: string
  province: 'punjab' | 'kpk' | 'federal' | 'sindh'
  provinceLabel: string
  logo: string
  districts: string
}

const ALL_BOARDS: BoardItem[] = [
  {
    id: 'bise-lahore',
    slug: 'lahore-board',
    name: 'BISE Lahore',
    shortName: 'BISE Lahore',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-lahore.webp',
    districts: 'Lahore, Kasur, Sheikhupura, Nankana Sahib',
  },
  {
    id: 'bise-gujranwala',
    slug: 'gujranwala-board',
    name: 'BISE Gujranwala',
    shortName: 'BISE Gujranwala',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-gujranwala.webp',
    districts: 'Gujranwala, Gujrat, Sialkot, Hafizabad, Mandi Bahauddin, Narowal',
  },
  {
    id: 'bise-faisalabad',
    slug: 'faisalabad-board',
    name: 'BISE Faisalabad',
    shortName: 'BISE Faisalabad',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-faisalabad.webp',
    districts: 'Faisalabad, Chiniot, Jhang, Toba Tek Singh',
  },
  {
    id: 'bise-multan',
    slug: 'multan-board',
    name: 'BISE Multan',
    shortName: 'BISE Multan',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-multan.webp',
    districts: 'Multan, Khanewal, Vehari, Lodhran',
  },
  {
    id: 'bise-rawalpindi',
    slug: 'rawalpindi-board',
    name: 'BISE Rawalpindi',
    shortName: 'BISE Rawalpindi',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-rawalpindi.webp',
    districts: 'Rawalpindi, Attock, Chakwal, Jhelum',
  },
  {
    id: 'bise-sargodha',
    slug: 'sargodha-board',
    name: 'BISE Sargodha',
    shortName: 'BISE Sargodha',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-sargodha.webp',
    districts: 'Sargodha, Khushab, Mianwali, Bhakkar',
  },
  {
    id: 'bise-sahiwal',
    slug: 'sahiwal-board',
    name: 'BISE Sahiwal',
    shortName: 'BISE Sahiwal',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-sahiwal.webp',
    districts: 'Sahiwal, Okara, Pakpattan',
  },
  {
    id: 'bise-bahawalpur',
    slug: 'bahawalpur-board',
    name: 'BISE Bahawalpur',
    shortName: 'BISE Bahawalpur',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-bahawalpur.webp',
    districts: 'Bahawalpur, Bahawalnagar, Rahim Yar Khan',
  },
  {
    id: 'bise-dg-khan',
    slug: 'dg-khan-board',
    name: 'BISE Dera Ghazi Khan',
    shortName: 'BISE DG Khan',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-dg-khan.webp',
    districts: 'Dera Ghazi Khan, Muzaffargarh, Layyah, Rajanpur',
  },
  {
    id: 'fbise',
    slug: 'federal-board',
    name: 'FBISE Federal',
    shortName: 'FBISE Federal',
    province: 'federal',
    provinceLabel: 'Federal',
    logo: '/logos/fbise.png',
    districts: 'Islamabad, Cantonment areas, Overseas, Pakistan schools',
  },
  {
    id: 'bise-abbottabad',
    slug: 'abbottabad-board',
    name: 'BISE Abbottabad',
    shortName: 'BISE Abbottabad',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/abbottabad.png',
    districts: 'Abbottabad, Haripur, Mansehra, Battagram, Kohistan',
  },
  {
    id: 'bise-kohat',
    slug: 'kohat-board',
    name: 'BISE Kohat',
    shortName: 'BISE Kohat',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/kohat.png',
    districts: 'Kohat, Karak, Hangu, Kurram, Orakzai',
  },
  {
    id: 'bise-malakand',
    slug: 'malakand-board',
    name: 'BISE Malakand',
    shortName: 'BISE Malakand',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/malakand.png',
    districts: 'Malakand, Dir Lower, Dir Upper, Bajaur',
  },
  {
    id: 'bise-peshawar',
    slug: 'peshawar-board',
    name: 'BISE Peshawar',
    shortName: 'BISE Peshawar',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/bise-peshawar.png',
    districts: 'Peshawar, Charsadda, Nowshera, Khyber, Mohmand',
  },
  {
    id: 'bise-mardan',
    slug: 'mardan-board',
    name: 'BISE Mardan',
    shortName: 'BISE Mardan',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/mardan.png',
    districts: 'Mardan, Swabi',
  },
  {
    id: 'bise-dikhan',
    slug: 'dera-ismail-khan-board',
    name: 'BISE DI Khan',
    shortName: 'BISE DI Khan',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/dikhan.png',
    districts: 'Dera Ismail Khan, Tank, South Waziristan',
  },
  {
    id: 'bise-swat',
    slug: 'swat-board',
    name: 'BISE Swat',
    shortName: 'BISE Swat',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/swat.jpg',
    districts: 'Swat, Shangla, Buner',
  },
  {
    id: 'bise-bannu',
    slug: 'bannu-board',
    name: 'BISE Bannu',
    shortName: 'BISE Bannu',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/bannu.png',
    districts: 'Bannu, Lakki Marwat, North Waziristan',
  },
  {
    id: 'biek-karachi',
    slug: 'karachi-board',
    name: 'BIEK Karachi',
    shortName: 'BIEK Karachi',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/logos/karachi.img',
    districts: 'Karachi Division (Central, East, South, West, Korangi, Malir, Keamari)',
  },
  {
    id: 'bise-hyderabad',
    slug: 'hyderabad-board',
    name: 'BISE Hyderabad',
    shortName: 'BISE Hyderabad',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    districts:
      'Hyderabad, Jamshoro, Matiari, Tando Allahyar, Tando Muhammad Khan, Badin, Thatta, Sujawal, Dadu',
  },
  {
    id: 'bise-sukkur',
    slug: 'sukkur-board',
    name: 'BISE Sukkur',
    shortName: 'BISE Sukkur',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    districts: 'Sukkur, Ghotki, Khairpur',
  },
  {
    id: 'bise-larkana',
    slug: 'larkana-board',
    name: 'BISE Larkana',
    shortName: 'BISE Larkana',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    districts: 'Larkana, Kambar Shahdadkot, Shikarpur, Jacobabad, Kashmore',
  },
  {
    id: 'bise-mirpurkhas',
    slug: 'mirpurkhas-board',
    name: 'BISE Mirpurkhas',
    shortName: 'BISE Mirpurkhas',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    districts: 'Mirpurkhas, Umerkot, Tharparkar',
  },
]

export function BoardCardsGrid({ year = 2026 }: { year?: number }) {
  const [selectedProvince, setSelectedProvince] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const routedSlugs = useMemo(() => new Set(routedBoards().map((b) => b.slug)), [])

  // Filter logic matching the UI tabs & search bar
  const filteredBoards = useMemo(() => {
    return ALL_BOARDS.filter((board) => {
      const matchesProvince = selectedProvince === 'all' || board.province === selectedProvince
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        board.name.toLowerCase().includes(query) ||
        board.shortName.toLowerCase().includes(query) ||
        board.districts.toLowerCase().includes(query) ||
        board.provinceLabel.toLowerCase().includes(query)

      return matchesProvince && matchesSearch
    })
  }, [selectedProvince, searchQuery])

  return (
    <section id="boards" aria-labelledby="boards-grid-heading" className="relative w-full">
      {/* ── Background Subtle Watermark (Flag & Skyline) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-2 h-44 w-44 opacity-[0.06] select-none sm:opacity-[0.08]"
      >
        <svg viewBox="0 0 200 200" fill="none" className="h-full w-full text-[#007054]">
          <circle cx="100" cy="100" r="90" fill="currentColor" opacity="0.2" />
          <path
            d="M110 40C70 40 40 70 40 110C40 150 70 180 110 180C140 180 165 162 175 135C165 145 150 150 135 150C100 150 75 125 75 90C75 65 90 45 110 40Z"
            fill="currentColor"
          />
          <polygon
            points="140,75 145,90 160,90 148,100 152,115 140,105 128,115 132,100 120,90 135,90"
            fill="currentColor"
          />
        </svg>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 right-4 h-48 w-60 opacity-[0.06] select-none"
      >
        <svg viewBox="0 0 300 120" fill="none" className="h-full w-full text-[#007054]">
          <path d="M40 120 L45 70 L47 25 L49 10 L51 25 L53 70 L58 120 Z" fill="currentColor" />
          <path d="M120 120 L120 85 Q135 60 150 85 L150 120 Z" fill="currentColor" />
          <polygon points="220,120 250,55 280,120" fill="currentColor" />
        </svg>
      </div>

      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="relative text-center">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-[#E6F8F3] px-4 py-1.5 text-xs font-black tracking-widest text-[#007054] uppercase shadow-xs">
          <span className="h-2 w-2 rounded-full bg-[#007054]" />
          <span>ALL PAKISTAN BOARDS</span>
        </div>

        {/* Heading */}
        <h2
          id="boards-grid-heading"
          className="mt-3.5 text-2xl font-black tracking-tight text-[#0F1736] sm:text-3xl lg:text-[40px] lg:leading-tight"
        >
          All Punjab, KPK, Sindh &amp; Federal Boards
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#5F6B7A] sm:text-sm">
          Tap a board for its result date, official website, SMS code, districts and gazette. Search
          12th Class {year} by roll number using the checker above.
        </p>
      </div>

      {/* ── Filter Tabs & Search Bar Row ────────────────────────────── */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 lg:flex-row">
        {/* Left: Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'punjab', label: 'Punjab' },
            { id: 'kpk', label: 'KPK' },
            { id: 'sindh', label: 'Sindh' },
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

        {/* Right: Rounded Search Input */}
        <div className="relative w-full sm:w-80 lg:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <SearchIcon width={16} height={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your board (e.g. Lahore, Peshawar, DG Khan...)"
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
      </div>

      {/* ── 4-Column Board Cards Grid (100% Matching Uploaded Mockup) ─ */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBoards.map((board) => {
          const hasPage = routedSlugs.has(board.slug)
          const href = hasPage ? `/results/${board.slug}/12th-class` : '/boards'
          const gazetteHref = hasPage ? `/results/${board.slug}/12th-class#gazette` : '/boards'
          const smsHref = hasPage ? `/results/${board.slug}/12th-class#sms` : '/#check-result'

          return (
            <div
              key={board.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              {/* Top Row: Logo + Names + Province + Districts */}
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

                {/* Board Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-black text-slate-900 transition-colors group-hover:text-[#007054]">
                    {board.shortName}
                  </h3>
                  <span className="mt-0.5 inline-block rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                    {board.provinceLabel}
                  </span>
                  <p
                    className="mt-1 line-clamp-1 text-[11px] leading-tight text-slate-500"
                    title={board.districts}
                  >
                    {board.districts}
                  </p>
                </div>
              </div>

              {/* Bottom Row: 3 Distinct Action Buttons */}
              <div className="mt-4 grid grid-cols-3 gap-1.5 border-t border-slate-100 pt-3">
                {/* Button 1: Solid Green "Check Result →" */}
                <Link
                  href={href}
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#007054] px-2 py-1.5 text-center text-[11px] font-bold text-white shadow-2xs transition-colors hover:bg-[#005a43] active:scale-95"
                >
                  <span>Check Result</span>
                  <span className="text-xs">&rarr;</span>
                </Link>

                {/* Button 2: Outline "Gazette" */}
                <Link
                  href={gazetteHref}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-[11px] font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                >
                  <FileTextIcon width={11} height={11} className="text-slate-500" />
                  <span>Gazette</span>
                </Link>

                {/* Button 3: Outline "SMS Code" */}
                <Link
                  href={smsHref}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-[11px] font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                >
                  <MessageSquareIcon width={11} height={11} className="text-slate-500" />
                  <span>SMS Code</span>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {filteredBoards.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
          No boards found matching &ldquo;{searchQuery}&rdquo;. Try clearing filters or searching
          for Lahore, Rawalpindi, or Peshawar.
        </div>
      )}

      {/* ── Bottom Feature Highlights Strip ─────────────────────────── */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-emerald-100 bg-[#E8F8F3]/70 p-4 shadow-xs backdrop-blur-xs sm:p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {/* Feature 1: 16+ Boards */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-[#007054]">
              <BookOpenIcon width={20} height={20} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">16+ Boards</div>
              <div className="text-[11px] text-slate-500">All major boards in one place</div>
            </div>
          </div>

          {/* Feature 2: Official Links */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-[#007054]">
              <ExternalLinkIcon width={20} height={20} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Official Links</div>
              <div className="text-[11px] text-slate-500">Direct access to official websites</div>
            </div>
          </div>

          {/* Feature 3: SMS Codes */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-[#007054]">
              <MessageSquareIcon width={20} height={20} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">SMS Codes</div>
              <div className="text-[11px] text-slate-500">Get result via SMS easily</div>
            </div>
          </div>

          {/* Feature 4: Gazette Access */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-[#007054]">
              <FileTextIcon width={20} height={20} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Gazette Access</div>
              <div className="text-[11px] text-slate-500">View and download result gazettes</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Slogan: Pakistan Emblem ──────────────────────────── */}
      <div className="mt-6 flex items-center justify-center gap-3 text-center">
        <div className="h-px w-16 bg-slate-200 sm:w-24" />
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
          <span className="text-base">🇵🇰</span>
          <span>Education for a Brighter Pakistan</span>
        </div>
        <div className="h-px w-16 bg-slate-200 sm:w-24" />
      </div>
    </section>
  )
}

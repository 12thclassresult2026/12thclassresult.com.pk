'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  SearchIcon,
  ShieldCheckIcon,
  ZapIcon,
} from '@/components/ui/icons'
import { routedBoards } from '@/lib/board/registry'
import { formatBytes, gazetteFileFor } from '@/lib/gazettes/files'

export type GazetteState =
  'gazette-available' | 'lookup-active' | 'processing' | 'official-source-only' | 'not-yet-verified'

interface GazetteBoard {
  id: string
  name: string
  shortName: string
  slug: string
  province: 'punjab' | 'kpk' | 'sindh' | 'balochistan' | 'federal'
  provinceLabel: string
  logo: string
  recordRef: string
  status: GazetteState
  formatLabel: string
  capabilityLabel: string
  hasVerifiedDownload?: boolean
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
    recordRef: 'GZ-LHR-26',
    status: 'processing',
    formatLabel: 'Gazette PDF',
    capabilityLabel: 'Extraction Pipeline',
  },
  {
    id: 'bise-gujranwala',
    name: 'BISE Gujranwala',
    shortName: 'BISE Gujranwala',
    slug: 'gujranwala-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-gujranwala.webp',
    recordRef: 'GZ-GRW-26',
    status: 'processing',
    formatLabel: 'Gazette PDF',
    capabilityLabel: 'Extraction Pipeline',
  },
  {
    id: 'bise-faisalabad',
    name: 'BISE Faisalabad',
    shortName: 'BISE Faisalabad',
    slug: 'faisalabad-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-faisalabad.webp',
    recordRef: 'GZ-FSD-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-multan',
    name: 'BISE Multan',
    shortName: 'BISE Multan',
    slug: 'multan-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-multan.webp',
    recordRef: 'GZ-MLN-26',
    status: 'official-source-only',
    formatLabel: 'Official Portal',
    capabilityLabel: 'Board Portal Only',
  },
  {
    id: 'bise-rawalpindi',
    name: 'BISE Rawalpindi',
    shortName: 'BISE Rawalpindi',
    slug: 'rawalpindi-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-rawalpindi.webp',
    recordRef: 'GZ-RWP-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-sargodha',
    name: 'BISE Sargodha',
    shortName: 'BISE Sargodha',
    slug: 'sargodha-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-sargodha.webp',
    recordRef: 'GZ-SGD-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-sahiwal',
    name: 'BISE Sahiwal',
    shortName: 'BISE Sahiwal',
    slug: 'sahiwal-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-sahiwal.webp',
    recordRef: 'GZ-SWL-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-bahawalpur',
    name: 'BISE Bahawalpur',
    shortName: 'BISE Bahawalpur',
    slug: 'bahawalpur-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-bahawalpur.webp',
    recordRef: 'GZ-BWP-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-dg-khan',
    name: 'BISE DG Khan',
    shortName: 'BISE DG Khan',
    slug: 'dg-khan-board',
    province: 'punjab',
    provinceLabel: 'Punjab',
    logo: '/logos/bise-dg-khan.webp',
    recordRef: 'GZ-DGK-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'fbise',
    name: 'FBISE Federal',
    shortName: 'FBISE Federal',
    slug: 'federal-board',
    province: 'federal',
    provinceLabel: 'Federal',
    logo: '/logos/fbise.png',
    recordRef: 'GZ-ISL-26',
    status: 'official-source-only',
    formatLabel: 'FBISE Online System',
    capabilityLabel: 'Official Source Only',
  },
  {
    id: 'biek-karachi',
    name: 'BIEK Karachi',
    shortName: 'BIEK Karachi',
    slug: 'karachi-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/logos/karachi.img',
    recordRef: 'GZ-KHI-26',
    status: 'official-source-only',
    formatLabel: 'BIEK Portal',
    capabilityLabel: 'Official Source Only',
  },
  {
    id: 'bise-hyderabad',
    name: 'BISE Hyderabad',
    shortName: 'BISE Hyderabad',
    slug: 'hyderabad-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    recordRef: 'GZ-HYD-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-sukkur',
    name: 'BISE Sukkur',
    shortName: 'BISE Sukkur',
    slug: 'sukkur-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    recordRef: 'GZ-SKR-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-larkana',
    name: 'BISE Larkana',
    shortName: 'BISE Larkana',
    slug: 'larkana-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    recordRef: 'GZ-LRK-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-mirpurkhas',
    name: 'BISE Mirpurkhas',
    shortName: 'BISE Mirpurkhas',
    slug: 'mirpurkhas-board',
    province: 'sindh',
    provinceLabel: 'Sindh',
    logo: '/icons/crest.svg',
    recordRef: 'GZ-MPK-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-peshawar',
    name: 'BISE Peshawar',
    shortName: 'BISE Peshawar',
    slug: 'peshawar-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/bise-peshawar.png',
    recordRef: 'GZ-PEW-26',
    status: 'official-source-only',
    formatLabel: 'Official Portal',
    capabilityLabel: 'Official Source Only',
  },
  {
    id: 'bise-abbottabad',
    name: 'BISE Abbottabad',
    shortName: 'BISE Abbottabad',
    slug: 'abbottabad-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/abbottabad.png',
    recordRef: 'GZ-ATD-26',
    status: 'official-source-only',
    formatLabel: 'Official Portal',
    capabilityLabel: 'Official Source Only',
  },
  {
    id: 'bise-mardan',
    name: 'BISE Mardan',
    shortName: 'BISE Mardan',
    slug: 'mardan-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/mardan.png',
    recordRef: 'GZ-MDN-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-swat',
    name: 'BISE Swat',
    shortName: 'BISE Swat',
    slug: 'swat-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/swat.jpg',
    recordRef: 'GZ-SWT-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-malakand',
    name: 'BISE Malakand',
    shortName: 'BISE Malakand',
    slug: 'malakand-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/malakand.png',
    recordRef: 'GZ-MKD-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-kohat',
    name: 'BISE Kohat',
    shortName: 'BISE Kohat',
    slug: 'kohat-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/kohat.png',
    recordRef: 'GZ-KHT-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-bannu',
    name: 'BISE Bannu',
    shortName: 'BISE Bannu',
    slug: 'bannu-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/bannu.png',
    recordRef: 'GZ-BNU-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-dikhan',
    name: 'BISE DI Khan',
    shortName: 'BISE DI Khan',
    slug: 'dera-ismail-khan-board',
    province: 'kpk',
    provinceLabel: 'KPK',
    logo: '/logos/dikhan.png',
    recordRef: 'GZ-DIK-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
  },
  {
    id: 'bise-quetta',
    name: 'BISE Quetta',
    shortName: 'BISE Quetta',
    slug: 'quetta-board',
    province: 'balochistan',
    provinceLabel: 'Balochistan',
    logo: '/icons/crest.svg',
    recordRef: 'GZ-QTA-26',
    status: 'not-yet-verified',
    formatLabel: 'Gazette Document',
    capabilityLabel: 'Awaiting Release',
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

  function renderStatusBadge(status: GazetteState) {
    switch (status) {
      case 'gazette-available':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-[#007054]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#007054]" />
            Gazette Available
          </span>
        )
      case 'lookup-active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[10.5px] font-bold text-teal-800">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            Lookup Active
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10.5px] font-bold text-blue-700">
            <ClockIcon width={11} height={11} />
            Processing
          </span>
        )
      case 'official-source-only':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[10.5px] font-bold text-purple-700">
            <ShieldCheckIcon width={11} height={11} />
            Official Source Only
          </span>
        )
      case 'not-yet-verified':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-bold text-slate-600">
            <ClockIcon width={11} height={11} />
            Not Yet Verified
          </span>
        )
    }
  }

  return (
    <section id="gazette" aria-labelledby="gazette-heading" className="relative w-full">
      {/* Background Watermarks */}
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

      {/* Section Header */}
      <div className="relative mx-auto max-w-3xl text-center">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-[#E6F8F3] px-4 py-1.5 text-xs font-black tracking-widest text-[#007054] uppercase shadow-xs">
          <FileTextIcon width={13} height={13} />
          <span>OFFICIAL GAZETTE DIRECTORY</span>
        </div>

        {/* Heading */}
        <h2
          id="gazette-heading"
          className="mt-3.5 text-2xl font-black tracking-tight text-[#0F1736] sm:text-3xl lg:text-[40px] lg:leading-tight"
        >
          12th Class Result Gazette 2026
        </h2>

        {/* Intro */}
        <div className="mx-auto mt-4 max-w-3xl space-y-2.5 text-center text-xs leading-relaxed text-[#5F6B7A] sm:text-sm">
          <p>
            A 12th Class Result Gazette is a board result document that may contain candidate
            records for a particular examination. Depending on the board and Gazette format, it may
            include roll numbers, candidate names, total marks, result status and other examination
            information.
          </p>
          <p>
            Use this platform to check Gazette availability by board, year and examination. A
            Gazette should only be shown as searchable when its dataset has been successfully
            processed and validated.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search / Sort Controls Row */}
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
              <option value="latest">Latest / Featured</option>
              <option value="az">Board Name (A-Z)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gazette Cards Grid (Document / Data Records Aesthetic) */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBoards.map((board) => {
          const hasPage = routedSlugs.has(board.slug)
          const targetHref = hasPage ? `/results/${board.slug}/12th-class#gazette` : '/boards'
          const officialHref = hasPage
            ? `/results/${board.slug}/12th-class#official-source`
            : '/boards'
          const guideHref = hasPage ? `/results/${board.slug}/12th-class` : '/boards'

          const isOfficialSource = board.status === 'official-source-only'
          const gazetteFile = gazetteFileFor(board.id)
          const primaryHref = isOfficialSource ? officialHref : targetHref

          return (
            <div
              key={board.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            >
              {/* Document Dossier Top Strip */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-[#F8FAF9] px-4 py-2.5 text-[11px]">
                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-700">
                  <FileTextIcon width={13} height={13} className="text-[#007054]" />
                  <span>{board.recordRef}</span>
                </div>
                <span className="rounded-md border border-slate-200/70 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {board.provinceLabel}
                </span>
              </div>

              {/* Document Body */}
              <div className="p-4">
                {/* Publishing Authority */}
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1 shadow-2xs">
                    <Image
                      src={board.logo}
                      alt={`${board.shortName} official logo`}
                      width={36}
                      height={36}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-black text-slate-900 transition-colors group-hover:text-[#007054]">
                      {board.shortName}
                    </h3>
                    {/*
                      THE YEAR MUST MATCH THE FILE. This line read
                      "12th Class • HSSC Part-II • 2026" on every card while
                      the button beneath it downloaded a 2025 gazette — the
                      2026 session is not announced until 23 September 2026 and
                      no board has published its gazette yet. A card that
                      labels a 2025 file as 2026 is telling a student the
                      document covers an examination it does not.
                    */}
                    <p className="text-[11px] font-medium text-slate-500">
                      {gazetteFile
                        ? `${gazetteFile.examinationLabel} • ${gazetteFile.year}`
                        : '12th Class • HSSC Part-II'}
                    </p>
                  </div>
                </div>

                {/* Document Specification Ledger Box */}
                <div className="mt-3.5 space-y-2 rounded-xl border border-slate-100 bg-[#F9FBFA] p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">Document Status</span>
                    {renderStatusBadge(board.status)}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/40 pt-1.5">
                    <span className="text-[11px] font-medium text-slate-500">Dataset Format</span>
                    <span className="text-[11px] font-bold text-slate-700">
                      {board.formatLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/40 pt-1.5">
                    <span className="text-[11px] font-medium text-slate-500">
                      Lookup Capability
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      {board.capabilityLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="border-t border-slate-100 bg-[#FAFCFB] px-4 py-3">
                <div className="flex items-center gap-2">
                  {/*
                    Primary Action Button.

                    "Download Gazette" now means a download. It used to point
                    at `/results/<board>/12th-class#gazette` — an anchor on one
                    of our own pages — so a student who tapped it got a page
                    about the gazette instead of the gazette. The button only
                    appears when `lib/gazettes/files.ts` holds a URL that was
                    fetched and confirmed to return a PDF, and it carries the
                    real size because these files run to tens of megabytes and
                    most of this audience is on mobile data.
                  */}
                  {gazetteFile ? (
                    <a
                      href={gazetteFile.url}
                      target="_blank"
                      rel="noopener nofollow"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#007054] px-3 py-2 text-center text-xs font-bold text-white shadow-2xs transition-colors hover:bg-[#005a43] active:scale-95"
                    >
                      <DownloadIcon width={13} height={13} />
                      <span>Download PDF · {formatBytes(gazetteFile.bytes)}</span>
                    </a>
                  ) : isOfficialSource ? (
                    <Link
                      href={primaryHref}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-center text-xs font-bold text-purple-700 shadow-2xs transition-colors hover:bg-purple-100 active:scale-95"
                    >
                      <ExternalLinkIcon width={13} height={13} />
                      <span>View Official Source</span>
                    </Link>
                  ) : (
                    <Link
                      href={primaryHref}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:border-[#007054] hover:bg-slate-50 hover:text-[#007054] active:scale-95"
                    >
                      <ArrowRightIcon width={13} height={13} />
                      <span>View Gazette Status</span>
                    </Link>
                  )}

                  {/* Secondary Action Link */}
                  <Link
                    href={guideHref}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                  >
                    <span>Board Guide</span>
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

      {/* Bottom Callout & Features Strip */}
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
              <div className="text-xs font-black text-slate-900">Board Gazettes</div>
              <div className="text-[10px] text-slate-500">Separate records per board</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
              <ZapIcon width={16} height={16} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Verified Pipeline</div>
              <div className="text-[10px] text-slate-500">Accurate status tracking</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
              <CalendarIcon width={16} height={16} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Updated Regularly</div>
              <div className="text-[10px] text-slate-500">Latest examination data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

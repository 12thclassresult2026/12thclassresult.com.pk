'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface BoardEntry {
  id: string
  slug: string
  name: string
  shortName: string
  officialName: string
  province:
    'punjab' | 'sindh' | 'khyber-pakhtunkhwa' | 'balochistan' | 'federal' | 'azad-jammu-kashmir'
  provinceLabel: string
  logo: string
  description: string
  officialWebsite: string
  coverageLabel?: string
  requirement?: string
  cautions?: string[]
  order?: number
}

export interface RegionSection {
  province:
    'punjab' | 'sindh' | 'khyber-pakhtunkhwa' | 'balochistan' | 'federal' | 'azad-jammu-kashmir'
  title: string
  subtitle: string
  boards: BoardEntry[]
}

interface BoardsDirectoryClientProps {
  sections: RegionSection[]
  totalBoardsCount: number
  totalRegionsCount: number
}

export function BoardsDirectoryClient({
  sections,
  totalBoardsCount,
  totalRegionsCount,
}: BoardsDirectoryClientProps) {
  const [activeTab, setActiveTab] = useState<string>('punjab')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const PROVINCE_TABS = [
    { id: 'punjab', label: 'Punjab' },
    { id: 'sindh', label: 'Sindh' },
    { id: 'khyber-pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
    { id: 'balochistan', label: 'Balochistan' },
    { id: 'federal', label: 'Federal' },
    { id: 'azad-jammu-kashmir', label: 'Azad Jammu & Kashmir' },
  ]

  // Filter sections and boards based on search query
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return sections

    return sections
      .map((section) => {
        const matchedBoards = section.boards.filter((b) => {
          return (
            b.name.toLowerCase().includes(q) ||
            b.shortName.toLowerCase().includes(q) ||
            b.officialName.toLowerCase().includes(q) ||
            b.provinceLabel.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q)
          )
        })

        if (matchedBoards.length === 0) return null

        return {
          ...section,
          boards: matchedBoards,
        }
      })
      .filter((s): s is RegionSection => Boolean(s))
  }, [sections, searchQuery])

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    const el = document.getElementById(tabId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-800">
      {/* Top Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-2 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-medium text-slate-400"
        >
          <Link href="/" className="transition-colors hover:text-emerald-700">
            Home
          </Link>
          <span className="text-slate-300">›</span>
          <span className="font-semibold text-slate-600">Boards</span>
        </nav>
      </div>

      {/* Hero Header Section */}
      <header className="mx-auto max-w-7xl px-4 pt-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Column: Title, Subtitle, Search, Stats */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[44px]">
              Education <span className="text-[#007054]">Boards</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Find and explore all BISE boards across Pakistan with official sources, verified links
              and the latest updates.
            </p>

            {/* Search Bar */}
            <div className="mt-6 flex max-w-xl items-center rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all focus-within:border-[#007054] focus-within:ring-2 focus-within:ring-[#007054]/10">
              <div className="pr-2 pl-3 text-slate-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your board (e.g. Lahore, Karachi, Peshawar...)"
                className="w-full bg-transparent px-2 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                aria-label="Search for your board"
              />
              <button
                type="button"
                className="shrink-0 rounded-xl bg-[#005944] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#004837] sm:text-sm"
              >
                Search Boards
              </button>
            </div>

            {/* 3 Stats Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-6 sm:gap-8">
              {/* Stat 1 */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B6E8D5] bg-[#E8F8F2] text-[#007054]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-base leading-tight font-extrabold text-slate-900">
                    {totalBoardsCount}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">Total Boards</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B6E8D5] bg-[#E8F8F2] text-[#007054]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-base leading-tight font-extrabold text-slate-900">
                    {totalRegionsCount}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">Regions</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B6E8D5] bg-[#E8F8F2] text-[#007054]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-base leading-tight font-extrabold text-slate-900">100%</div>
                  <div className="text-[11px] font-medium text-slate-500">
                    Official & Verified Sources
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Minar-e-Pakistan & Architectural Illustration */}
          <div className="relative hidden items-center justify-end lg:col-span-5 lg:flex xl:col-span-4">
            <div className="relative flex w-full max-w-[340px] flex-col items-center">
              {/* Cursive slogan with underline */}
              <div className="mb-1 w-full pr-6 text-right">
                <div className="font-serif text-lg leading-tight font-semibold tracking-tight text-[#007054] italic sm:text-xl">
                  Education
                </div>
                <div className="font-serif text-sm leading-snug font-semibold tracking-tight text-[#007054] italic sm:text-base">
                  Builds a Stronger
                </div>
                <div className="font-serif text-lg leading-tight font-semibold tracking-tight text-[#007054] italic sm:text-xl">
                  Pakistan
                </div>
                <div className="mt-0.5 flex justify-end">
                  <svg className="h-2 w-24 text-[#007054]" viewBox="0 0 100 8" fill="none">
                    <path
                      d="M2 5C30 2 70 2 98 5C75 7 40 7 15 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Minar-e-Pakistan + Arched Façade SVG */}
              <div className="relative h-60 w-72 opacity-90">
                <svg
                  viewBox="0 0 300 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                >
                  <line
                    x1="10"
                    y1="225"
                    x2="290"
                    y2="225"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Historic University / Façade on right */}
                  <g stroke="#94a3b8" strokeWidth="1.2" fill="none">
                    <rect
                      x="150"
                      y="110"
                      width="135"
                      height="115"
                      rx="3"
                      fill="#f8fafc"
                      stroke="#cbd5e1"
                    />
                    <path d="M150 110L217 75L285 110Z" fill="#f1f5f9" stroke="#94a3b8" />
                    <circle
                      cx="217"
                      cy="94"
                      r="6"
                      stroke="#007054"
                      strokeWidth="1"
                      fill="#e8f8f2"
                    />
                    <path d="M165 180V150C165 142 175 142 175 150V180" stroke="#64748b" />
                    <path d="M185 180V150C185 142 195 142 195 150V180" stroke="#64748b" />
                    <path
                      d="M205 180V145C205 135 229 135 229 145V180"
                      stroke="#007054"
                      strokeWidth="1.5"
                    />
                    <path d="M239 180V150C239 142 249 142 249 150V180" stroke="#64748b" />
                    <path d="M259 180V150C259 142 269 142 269 150V180" stroke="#64748b" />
                    <line x1="200" y1="180" x2="234" y2="180" stroke="#64748b" strokeWidth="2" />
                    <line x1="198" y1="184" x2="236" y2="184" stroke="#94a3b8" />
                    <line x1="196" y1="188" x2="238" y2="188" stroke="#94a3b8" />
                    <rect x="165" y="122" width="10" height="15" rx="2" stroke="#94a3b8" />
                    <rect x="185" y="122" width="10" height="15" rx="2" stroke="#94a3b8" />
                    <rect x="239" y="122" width="10" height="15" rx="2" stroke="#94a3b8" />
                    <rect x="259" y="122" width="10" height="15" rx="2" stroke="#94a3b8" />
                  </g>

                  {/* Minar-e-Pakistan Monument on left */}
                  <g stroke="#007054" strokeWidth="1.2" fill="none">
                    <path
                      d="M45 225C48 200 68 190 85 190C102 190 122 200 125 225"
                      fill="#f0fdf4"
                      stroke="#007054"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M55 225C58 206 72 198 85 198C98 198 112 206 115 225"
                      stroke="#10b981"
                    />
                    <rect
                      x="74"
                      y="180"
                      width="22"
                      height="10"
                      rx="1.5"
                      fill="#dcfce7"
                      stroke="#007054"
                    />
                    <path
                      d="M76 180L81 50H89L94 180"
                      fill="#f8fafc"
                      stroke="#007054"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="83"
                      y1="180"
                      x2="84"
                      y2="50"
                      stroke="#059669"
                      strokeWidth="0.8"
                      strokeDasharray="4 2"
                    />
                    <line x1="85" y1="180" x2="85" y2="50" stroke="#007054" strokeWidth="1" />
                    <line
                      x1="87"
                      y1="180"
                      x2="86"
                      y2="50"
                      stroke="#059669"
                      strokeWidth="0.8"
                      strokeDasharray="4 2"
                    />
                    <rect x="78" y="110" width="14" height="4" rx="1" fill="#007054" />
                    <rect x="77" y="47" width="16" height="5" rx="1" fill="#007054" />
                    <path d="M79 47V34H91V47" stroke="#007054" strokeWidth="1.2" />
                    <line x1="83" y1="47" x2="83" y2="34" stroke="#059669" strokeWidth="0.8" />
                    <line x1="87" y1="47" x2="87" y2="34" stroke="#059669" strokeWidth="0.8" />
                    <path
                      d="M78 34C78 26 85 22 85 15C85 22 92 26 92 34Z"
                      fill="#dcfce7"
                      stroke="#007054"
                      strokeWidth="1.2"
                    />
                    <line x1="85" y1="15" x2="85" y2="5" stroke="#007054" strokeWidth="1.5" />
                    <circle cx="85" cy="5" r="1.5" fill="#007054" />
                  </g>

                  <path d="M25 225C25 215 35 210 42 225" fill="#e2e8f0" />
                  <path d="M125 225C130 216 142 216 148 225" fill="#e2e8f0" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Province Filter Pills Bar */}
        <div className="mt-8 flex scrollbar-none items-center gap-2.5 overflow-x-auto pb-2">
          {PROVINCE_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all sm:text-sm ${
                  isActive
                    ? 'border border-[#0d4e3f] bg-[#0d4e3f] text-white shadow-sm'
                    : 'border border-slate-200/90 bg-white text-slate-700 shadow-xs hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                <svg
                  className={`h-4 w-4 ${isActive ? 'text-white' : 'text-emerald-700'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {tab.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Boards Section */}
      <main className="mx-auto max-w-7xl space-y-12 px-4 pb-16 sm:px-6 lg:px-8">
        {filteredSections.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 py-16 text-center">
            <p className="text-base font-medium text-slate-600">
              No boards found matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveTab('punjab')
              }}
              className="mt-4 rounded-lg bg-[#007054] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#005944]"
            >
              Reset Search
            </button>
          </div>
        ) : (
          filteredSections.map((section) => (
            <section key={section.province} id={section.province} className="scroll-mt-6">
              {/* Section Header */}
              <div className="mb-6 flex flex-col justify-between border-b border-slate-200 pb-3 sm:flex-row sm:items-baseline">
                <div className="flex items-center gap-2.5">
                  <div className="text-[#007054]">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {section.title}{' '}
                    <span className="text-sm font-normal text-slate-500">
                      ({section.boards.length} {section.boards.length === 1 ? 'board' : 'boards'})
                    </span>
                  </h2>
                </div>
                <div className="mt-1 text-xs font-medium text-slate-400 sm:mt-0">
                  {section.subtitle}
                </div>
              </div>

              {/* Boards 4-column Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {section.boards.map((board) => {
                  const boardHref = `/results/${board.slug}/12th-class`

                  return (
                    <div
                      key={board.id}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_6px_rgba(0,0,0,0.02)] transition-all hover:border-emerald-400 hover:shadow-lg"
                    >
                      <div>
                        {/* Top Row: Logo and Chevron */}
                        <div className="flex items-start justify-between">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1">
                            {board.logo ? (
                              <Image
                                src={board.logo}
                                alt={`${board.name} official emblem`}
                                width={44}
                                height={44}
                                className="max-h-10 max-w-10 object-contain"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                                {board.shortName.slice(0, 3)}
                              </div>
                            )}
                          </div>
                          <span className="pr-1 text-lg leading-none text-slate-300 transition-colors group-hover:text-emerald-600">
                            ›
                          </span>
                        </div>

                        {/* Board Name & Region */}
                        <div className="mt-3">
                          <h3 className="text-[15px] leading-snug font-bold text-slate-900 transition-colors group-hover:text-emerald-800">
                            {board.name}
                          </h3>
                          <div className="mt-0.5 text-xs font-medium text-slate-400">
                            {board.provinceLabel}
                          </div>
                        </div>

                        {/* Verified Pill Badge */}
                        <div className="mt-2.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#B6E8D5] bg-[#E8F8F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#007054]">
                            <svg
                              className="h-3 w-3 text-[#007054]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Verified
                          </span>
                        </div>

                        {/* Regional Description */}
                        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-500">
                          {board.description}
                        </p>

                        {/* Official Website link */}
                        <div className="mt-2">
                          <a
                            href={board.officialWebsite}
                            target="_blank"
                            rel="noopener nofollow"
                            className="text-[11px] text-slate-400 underline underline-offset-2 transition-colors hover:text-emerald-700"
                          >
                            Official website
                          </a>
                        </div>
                      </div>

                      {/* Bottom Link: View Board Details */}
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <Link
                          href={boardHref}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#007054] transition-transform group-hover:translate-x-0.5 hover:text-[#00523d]"
                        >
                          View Board Details
                          <span className="text-sm">→</span>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))
        )}

        {/* Bottom Trust & Verified Strip */}
        <section className="mt-12 rounded-2xl border border-[#C5EBDC] bg-[#EBF7F2] p-6 shadow-xs sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Trusted & Verified Sources</div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  All links are official board websites
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Up-to-Date Information</div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  Always accurate and reliable
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Complete Coverage</div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  All Pakistan boards in one place
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Students First</div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  Supporting a brighter future
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Backlink to Hub */}
        <div className="pt-4">
          <Link
            href="/results/12th-class"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#007054] underline underline-offset-4 hover:text-[#00523d]"
          >
            <span>←</span> Back to the 12th class result hub
          </Link>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { ExternalLinkIcon, ShieldCheckIcon } from '@/components/ui/icons'
import { BOARDS, routedBoards } from '@/lib/board/registry'
import { ACCESS_MODEL_LABELS, PROVINCE_LABELS } from '@/lib/board/types'

const BOARD_LOGOS: Record<string, string> = {
  'lahore-board': '/logos/bise-lahore.webp',
  'gujranwala-board': '/logos/bise-gujranwala.webp',
  'faisalabad-board': '/logos/bise-faisalabad.webp',
  'multan-board': '/logos/bise-multan.webp',
  'rawalpindi-board': '/logos/bise-rawalpindi.webp',
  'sargodha-board': '/logos/bise-sargodha.webp',
  'sahiwal-board': '/logos/bise-sahiwal.webp',
  'bahawalpur-board': '/logos/bise-bahawalpur.webp',
  'dg-khan-board': '/logos/bise-dg-khan.webp',
  'federal-board': '/logos/fbise.png',
  'peshawar-board': '/logos/bise-peshawar.png',
  'abbottabad-board': '/logos/abbottabad.png',
  'mardan-board': '/logos/mardan.png',
  'swat-board': '/logos/swat.jpg',
  'malakand-board': '/logos/malakand.png',
  'kohat-board': '/logos/kohat.png',
  'bannu-board': '/logos/bannu.png',
  'dera-ismail-khan-board': '/logos/dikhan.png',
  'karachi-board': '/logos/karachi.img',
}

const PROVINCE_FILTERS = [
  { id: 'all', label: 'All Pakistan' },
  { id: 'punjab', label: 'Punjab (9)' },
  { id: 'khyber-pakhtunkhwa', label: 'KPK (8)' },
  { id: 'sindh', label: 'Sindh (6)' },
  { id: 'other', label: 'Federal & Others' },
] as const

export function BoardCardsGrid() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const routedSlugs = useMemo(() => new Set(routedBoards().map((b) => b.slug)), [])

  const filtered = useMemo(() => {
    if (activeTab === 'all') return BOARDS
    if (activeTab === 'other') {
      return BOARDS.filter((b) =>
        ['federal', 'balochistan', 'azad-jammu-kashmir', 'gilgit-baltistan'].includes(b.province),
      )
    }
    return BOARDS.filter((b) => b.province === activeTab)
  }, [activeTab])

  return (
    <div id="board-cards-grid" className="w-full">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-[#007054]">
          <ShieldCheckIcon width={14} height={14} />
          <span>OFFICIAL EDUCATION BOARDS DIRECTORY</span>
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Select Your Intermediate Education Board
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Click on any board below to check its 12th Class Result announcement, official portal
          guide, and verification facts.
        </p>

        {/* Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {PROVINCE_FILTERS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#007054] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Column Cards Grid */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((board) => {
          const hasPage = routedSlugs.has(board.slug)
          const targetHref = hasPage ? `/results/${board.slug}/12th-class` : '/boards'
          const logo = BOARD_LOGOS[board.slug] || '/icons/crest.svg'

          return (
            <div
              key={board.slug}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div>
                {/* Top Row: Logo + Province Tag */}
                <div className="flex items-start justify-between gap-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-1.5 transition-transform duration-200 group-hover:scale-105 group-hover:bg-white">
                    <Image
                      src={logo}
                      alt={`${board.shortName} official logo`}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 uppercase">
                    {PROVINCE_LABELS[board.province] || board.province}
                  </span>
                </div>

                {/* Board Names */}
                <h3 className="mt-4 text-base font-black text-slate-900 transition-colors group-hover:text-[#007054]">
                  {board.shortName}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{board.officialName}</p>

                {/* Access Model Badge */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {ACCESS_MODEL_LABELS[board.accessModel]}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <Link
                  href={targetHref}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-[#007054] transition-all hover:bg-[#007054] hover:text-white"
                >
                  <span>{hasPage ? 'Check 12th Result' : 'View Details'}</span>
                  <ExternalLinkIcon width={13} height={13} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

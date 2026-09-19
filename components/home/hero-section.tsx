'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  GridIcon,
  HashIcon,
  LandmarkIcon,
  MessageSquareIcon,
  SearchIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  UserIcon,
  UsersIcon,
  ZapIcon,
} from '@/components/ui/icons'
import type { BoardOption } from '@/components/result/board-finder'
import { getBoardSmsInfo, buildSmsHref } from '@/lib/board/sms-directory'

/* -- 9 Popular Punjab Boards Matching Reference Screenshot -- */
const PUNJAB_TOP_BOARDS = [
  { name: 'BISE', city: 'Lahore', slug: 'lahore-board', logo: '/logos/bise-lahore.webp' },
  { name: 'BISE', city: 'Multan', slug: 'multan-board', logo: '/logos/bise-multan.webp' },
  {
    name: 'BISE',
    city: 'Faisalabad',
    slug: 'faisalabad-board',
    logo: '/logos/bise-faisalabad.webp',
  },
  {
    name: 'BISE',
    city: 'Rawalpindi',
    slug: 'rawalpindi-board',
    logo: '/logos/bise-rawalpindi.webp',
  },
  { name: 'BISE', city: 'Sargodha', slug: 'sargodha-board', logo: '/logos/bise-sargodha.webp' },
  {
    name: 'BISE',
    city: 'Gujranwala',
    slug: 'gujranwala-board',
    logo: '/logos/bise-gujranwala.webp',
  },
  {
    name: 'BISE',
    city: 'Bahawalpur',
    slug: 'bahawalpur-board',
    logo: '/logos/bise-bahawalpur.webp',
  },
  { name: 'BISE', city: 'D.G. Khan', slug: 'dg-khan-board', logo: '/logos/bise-dg-khan.webp' },
  { name: 'BISE', city: 'Sahiwal', slug: 'sahiwal-board', logo: '/logos/bise-sahiwal.webp' },
] as const

type TabType = 'roll' | 'name' | 'sms'

export function HeroSection({ boards }: { boards: BoardOption[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('roll')
  const [selectedSlug, setSelectedSlug] = useState('lahore-board')
  const [rollNumber, setRollNumber] = useState('')
  const [studentName, setStudentName] = useState('')
  const [smsRollNumber, setSmsRollNumber] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)

  const chosen = boards.find((b) => b.slug === selectedSlug) || boards[0]
  const targetHref = chosen?.hasPage ? `/results/${chosen.slug}/12th-class` : '/boards'
  const smsInfo = getBoardSmsInfo(selectedSlug)

  function handleRollSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chosen) return
    router.push(targetHref)
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chosen) return
    router.push(targetHref)
  }

  function handleCopyCode(code: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopiedCode(true)
          setTimeout(() => setCopiedCode(false), 2000)
        })
        .catch(() => {
          try {
            const textArea = document.createElement('textarea')
            textArea.value = code
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopiedCode(true)
            setTimeout(() => setCopiedCode(false), 2000)
          } catch {
            // ignore
          }
        })
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#F8FAF9] bg-[url('/images/hero-bg.webp')] bg-cover bg-center bg-no-repeat pt-8 pb-20 sm:pt-10 sm:pb-24 lg:pt-12 lg:pb-32">
      {/* Soft gradient wash for crisp contrast and readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/45 to-white/95 lg:from-white/20 lg:via-transparent lg:to-white/90"
      />

      {/* -- Left Flank: Campus Banner & Brick Inscription (Desktop) -- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-14 left-6 z-10 hidden text-left select-none lg:block xl:top-16 xl:left-10 2xl:left-16"
      >
        {/* Green Hanging Banner */}
        <div className="flex flex-col items-center rounded-b-xl bg-[#005B44] px-3.5 py-4 text-white shadow-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <LandmarkIcon width={16} height={16} />
          </div>
          <span className="mt-2 text-[10px] font-black tracking-widest uppercase">ESTD</span>
          <span className="font-mono text-xs font-black">2026</span>
          <div className="mt-2 h-6 w-px bg-white/30" />
          <span className="mt-1 text-[9px] font-semibold text-emerald-100">HSSC-II</span>
        </div>

        {/* Traditional Brick Wall Inscription Motif */}
        <div className="mt-4 rounded-xl border border-[#005B44]/20 bg-white/70 p-3 shadow-xs backdrop-blur-xs">
          <span className="block text-[10px] font-bold tracking-widest text-[#005B44] uppercase">
            Official Archives
          </span>
          <span className="mt-0.5 block text-xs font-black text-slate-800">24 Pakistan Boards</span>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Verified Gazette Hub</span>
          </div>
        </div>
      </div>

      {/* -- Right Flank: Urdu Slogan & Motivation (Desktop) -- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-14 right-6 z-10 hidden text-right select-none lg:block xl:top-16 xl:right-10 2xl:right-16"
      >
        {/* Urdu Calligraphy Badge: 'علم روشنی ہے' / 'تعلیم روشن مستقبل' */}
        <div className="inline-block rounded-2xl border border-emerald-600/25 bg-white/85 px-4 py-3 shadow-md backdrop-blur-xs">
          <span className="block font-serif text-sm leading-tight font-black text-[#007054]">
            علم
          </span>
          <span className="block font-serif text-xl leading-tight font-black text-[#005B44] xl:text-2xl">
            روشنی
          </span>
          <span className="block font-serif text-2xl leading-tight font-black text-[#005B44] xl:text-3xl">
            تعلیم روشن پاکستان
          </span>
          <svg
            className="mt-1 inline-block h-2.5 w-24 text-[#007054]"
            viewBox="0 0 100 10"
            fill="none"
          >
            <path
              d="M2 8C30 2 70 2 98 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Engraved wall text */}
        <div className="mt-4 pr-1 text-right text-[10px] font-black tracking-[0.2em] text-[#004D3F]/75 uppercase">
          Brighter
          <br />
          Minds
          <br />
          A Stronger
          <br />
          Pakistan
        </div>
      </div>

      {/* -- Center Content Container -- */}
      <div className="container-wide relative z-20">
        <div className="mx-auto max-w-3xl text-center xl:max-w-4xl">
          {/* Eyebrow with horizontal accent lines */}
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-emerald-600/50 sm:w-12" />
            <span className="text-[10px] font-black tracking-[0.2em] text-[#007054] uppercase sm:text-[11px]">
              INTERMEDIATE &amp; SECONDARY EDUCATION RESULTS
            </span>
            <span className="h-px w-8 bg-emerald-600/50 sm:w-12" />
          </div>

          {/* Main Heading H1 */}
          <h1 className="mt-3.5 text-center text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-5xl md:text-[54px]">
            12th Class Result <span className="text-[#007054]">2026</span> Pakistan
          </h1>

          {/* 2-line Semantic Intro */}
          <p className="mx-auto mt-2.5 max-w-2xl text-center text-xs leading-relaxed font-semibold text-slate-700 sm:text-sm md:text-base">
            Check 12th Class, 2nd Year and HSSC Part-II results across Pakistan by board, roll
            number and verified Gazette where available.
          </p>

          {/* Sub-heading */}
          <p className="mt-1.5 text-center text-base font-bold text-slate-800 sm:text-xl">
            Check by <span className="font-black text-[#007054]">Roll Number</span>,{' '}
            <span className="font-black text-[#007054]">Name</span> or{' '}
            <span className="font-black text-[#007054]">SMS</span>
          </p>

          {/* Floating Result Checker Card */}
          <div id="check-result" className="mx-auto mt-6 max-w-3xl sm:mt-7">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-xl transition-all sm:p-6 md:p-7">
              {/* 3-Tab Pill Bar */}
              <div className="mx-auto grid w-full max-w-lg grid-cols-3 gap-1 rounded-2xl bg-slate-100/90 p-1 sm:gap-1.5 sm:p-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('roll')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold whitespace-nowrap transition-all sm:gap-2 sm:px-3.5 sm:text-sm ${
                    activeTab === 'roll'
                      ? 'bg-[#007054] text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <HashIcon width={15} height={15} className="shrink-0" />
                  <span className="hidden sm:inline">By Roll Number</span>
                  <span className="sm:hidden">Roll No</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('name')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold whitespace-nowrap transition-all sm:gap-2 sm:px-3.5 sm:text-sm ${
                    activeTab === 'name'
                      ? 'bg-[#007054] text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <UserIcon width={15} height={15} className="shrink-0" />
                  <span className="hidden sm:inline">By Name</span>
                  <span className="sm:hidden">By Name</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sms')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold whitespace-nowrap transition-all sm:gap-2 sm:px-3.5 sm:text-sm ${
                    activeTab === 'sms'
                      ? 'bg-[#007054] text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <MessageSquareIcon width={15} height={15} className="shrink-0" />
                  <span className="hidden sm:inline">By SMS</span>
                  <span className="sm:hidden">By SMS</span>
                </button>
              </div>

              {/* -- Tab 1: By Roll Number -- */}
              {activeTab === 'roll' && (
                <form onSubmit={handleRollSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 md:grid-cols-[1.2fr_1.2fr_auto]">
                    {/* Field 1: Select Board */}
                    <div className="text-left">
                      <label
                        htmlFor="board-select"
                        className="mb-1.5 block text-xs font-bold text-slate-800"
                      >
                        Select Board
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <LandmarkIcon width={16} height={16} />
                        </div>
                        <select
                          id="board-select"
                          value={selectedSlug}
                          onChange={(e) => setSelectedSlug(e.target.value)}
                          className="h-[48px] w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pr-8 pl-10 text-xs font-semibold text-slate-900 shadow-2xs transition-all focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        >
                          {boards.map((b) => (
                            <option key={b.slug} value={b.slug}>
                              {b.shortName} ({b.region})
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                          <ChevronDownIcon width={15} height={15} />
                        </div>
                      </div>
                    </div>

                    {/* Field 2: Enter Roll Number */}
                    <div className="text-left">
                      <label
                        htmlFor="roll-number-input"
                        className="mb-1.5 block text-xs font-bold text-slate-800"
                      >
                        Enter Roll Number
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <HashIcon width={16} height={16} />
                        </div>
                        <input
                          id="roll-number-input"
                          type="text"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          placeholder="e.g. 123456"
                          className="h-[48px] w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-3 pl-10 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Field 3: Submit Button */}
                    <div className="sm:col-span-2 md:col-span-1">
                      <button
                        type="submit"
                        className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#007054] px-7 text-xs font-bold whitespace-nowrap text-white shadow-sm transition-all hover:bg-[#005842] sm:text-sm md:w-auto"
                      >
                        <SearchIcon width={16} height={16} />
                        <span>Search Result</span>
                      </button>
                    </div>
                  </div>

                  {/* Anti-fraud / Trust Notice */}
                  <div className="flex items-center justify-center gap-2 pt-1 text-center text-[11px] text-slate-500 sm:text-xs">
                    <ShieldCheckIcon width={15} height={15} className="shrink-0 text-[#007054]" />
                    <span>
                      Takes you to your board&rsquo;s page, where its official portal link and
                      verified status are. Your roll number is entered on the board&rsquo;s own
                      site, never here.
                    </span>
                  </div>
                </form>
              )}

              {/* -- Tab 2: By Name -- */}
              {activeTab === 'name' && (
                <form onSubmit={handleNameSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 md:grid-cols-[1.2fr_1.2fr_auto]">
                    <div className="text-left">
                      <label
                        htmlFor="name-board-select"
                        className="mb-1.5 block text-xs font-bold text-slate-800"
                      >
                        Select Board
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <LandmarkIcon width={16} height={16} />
                        </div>
                        <select
                          id="name-board-select"
                          value={selectedSlug}
                          onChange={(e) => setSelectedSlug(e.target.value)}
                          className="h-[48px] w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pr-8 pl-10 text-xs font-semibold text-slate-900 shadow-2xs transition-all focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        >
                          {boards.map((b) => (
                            <option key={b.slug} value={b.slug}>
                              {b.shortName} ({b.region})
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                          <ChevronDownIcon width={15} height={15} />
                        </div>
                      </div>
                    </div>

                    <div className="text-left">
                      <label
                        htmlFor="student-name-input"
                        className="mb-1.5 block text-xs font-bold text-slate-800"
                      >
                        Enter Student Name
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <UserIcon width={16} height={16} />
                        </div>
                        <input
                          id="student-name-input"
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Muhammad Ali"
                          className="h-[48px] w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-3 pl-10 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 md:col-span-1">
                      <button
                        type="submit"
                        className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#007054] px-7 text-xs font-bold whitespace-nowrap text-white shadow-sm transition-all hover:bg-[#005842] sm:text-sm md:w-auto"
                      >
                        <SearchIcon width={16} height={16} />
                        <span>Go to Board Page</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1 text-center text-[11px] text-slate-500 sm:text-xs">
                    <ShieldCheckIcon width={15} height={15} className="shrink-0 text-[#007054]" />
                    <span>
                      No board we track offers a name-based result search. This takes you to your
                      board&rsquo;s page; use your roll number on the board&rsquo;s own site.
                    </span>
                  </div>
                </form>
              )}

              {/* -- Tab 3: By SMS (Dynamic Shortcode, One-Click Copy & Direct SMS App Launch) -- */}
              {activeTab === 'sms' && (
                <div className="mt-6 space-y-4 text-left">
                  {/* Row 1: Board Selector and Optional Roll Number */}
                  <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2">
                    {/* Field 1: Select Board */}
                    <div>
                      <label
                        htmlFor="sms-board-select"
                        className="mb-1.5 block text-xs font-bold text-slate-800"
                      >
                        Select Board for SMS Details
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <LandmarkIcon width={16} height={16} />
                        </div>
                        <select
                          id="sms-board-select"
                          value={selectedSlug}
                          onChange={(e) => {
                            setSelectedSlug(e.target.value)
                            setCopiedCode(false)
                          }}
                          className="h-[48px] w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pr-8 pl-10 text-xs font-semibold text-slate-900 shadow-2xs transition-all focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        >
                          {boards.map((b) => (
                            <option key={b.slug} value={b.slug}>
                              {b.shortName} ({b.region})
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                          <ChevronDownIcon width={15} height={15} />
                        </div>
                      </div>
                    </div>

                    {/* Field 2: Optional Roll Number to Pre-fill SMS */}
                    <div>
                      <label
                        htmlFor="sms-roll-input"
                        className="mb-1.5 block text-xs font-bold text-slate-800"
                      >
                        Roll Number{' '}
                        <span className="font-normal text-slate-400">
                          (optional &mdash; pre-fills SMS)
                        </span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <HashIcon width={16} height={16} />
                        </div>
                        <input
                          id="sms-roll-input"
                          type="text"
                          value={smsRollNumber}
                          onChange={(e) => setSmsRollNumber(e.target.value)}
                          placeholder="e.g. 123456"
                          className="h-[48px] w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-3 pl-10 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Dynamic SMS Result Card for Selected Board */}
                  {smsInfo.supported && smsInfo.shortcode ? (
                    <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-[#F2FAF6] to-white p-4 shadow-sm sm:p-5">
                      {/* Top Header of Card */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007054] text-white shadow-xs">
                            <SmartphoneIcon width={16} height={16} />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900 sm:text-sm">
                              {smsInfo.boardName} Result SMS Service
                            </h4>
                            <p className="text-[11px] font-medium text-slate-500">
                              {smsInfo.networkCharges}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          <CheckIcon width={12} height={12} />
                          Verified Shortcode
                        </span>
                      </div>

                      {/* Code Box & Actions Row */}
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Shortcode & Format Instruction */}
                        <div className="flex items-center gap-3">
                          <div className="flex min-w-[120px] flex-col items-center justify-center rounded-xl border border-emerald-300/80 bg-white px-4 py-2 shadow-xs">
                            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                              Send SMS To
                            </span>
                            <span className="font-mono text-xl font-black tracking-widest text-[#007054] sm:text-2xl">
                              {smsInfo.shortcode}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-800">
                              Message Format:{' '}
                              <span className="font-mono font-bold text-emerald-800">
                                {smsRollNumber
                                  ? `${smsInfo.prefix || ''}${smsRollNumber}`
                                  : smsInfo.format}
                              </span>
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              Example: {smsInfo.example}
                            </span>
                          </div>
                        </div>

                        {/* Two Action Buttons: Copy Code + Direct SMS */}
                        <div className="flex items-center gap-2">
                          {/* Button 1: Copy Code */}
                          <button
                            type="button"
                            onClick={() => handleCopyCode(smsInfo.shortcode!)}
                            className={`flex h-[44px] items-center justify-center gap-1.5 rounded-xl border px-4 text-xs font-bold shadow-xs transition-all ${
                              copiedCode
                                ? 'border-emerald-600 bg-emerald-600 text-white shadow-emerald-500/20'
                                : 'border-slate-300 bg-white text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50'
                            }`}
                            title="Copy SMS Shortcode"
                          >
                            {copiedCode ? (
                              <>
                                <CheckIcon width={15} height={15} />
                                <span>Code Copied!</span>
                              </>
                            ) : (
                              <>
                                <CopyIcon width={15} height={15} />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>

                          {/* Button 2: Direct SMS */}
                          <a
                            href={buildSmsHref(smsInfo.shortcode, smsInfo.prefix, smsRollNumber)}
                            className="flex h-[44px] items-center justify-center gap-2 rounded-xl bg-[#007054] px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#005842] active:scale-95"
                            title="Open in Mobile Messages App"
                          >
                            <MessageSquareIcon width={16} height={16} />
                            <span>Direct SMS</span>
                          </a>
                        </div>
                      </div>

                      {/* Card Footer: Tip & Board Guide Link */}
                      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-100/70 pt-2.5 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheckIcon width={14} height={14} className="text-[#007054]" />
                          Tap &ldquo;Direct SMS&rdquo; to open your mobile SMS app instantly.
                        </span>
                        <Link
                          href={targetHref}
                          className="inline-flex items-center gap-1 font-semibold text-[#007054] hover:underline"
                        >
                          <span>Full Board Guide</span>
                          <ArrowRightIcon width={12} height={12} />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* Fallback for boards without SMS (e.g. Karachi / BIEK) */
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <AlertTriangleIcon
                          width={20}
                          height={20}
                          className="mt-0.5 shrink-0 text-amber-600"
                        />
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-amber-900 sm:text-sm">
                            {smsInfo.boardName} &mdash; Official SMS Service Not Available
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-amber-800">
                            {smsInfo.notes ||
                              'This board does not offer a verified SMS result service. Results are published via online portal and official Gazette.'}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveTab('roll')}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#007054] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#005842]"
                            >
                              <SearchIcon width={13} height={13} />
                              Search by Roll Number
                            </button>
                            <Link
                              href={targetHref}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-900 shadow-xs hover:bg-amber-50"
                            >
                              <span>Official Board Portal</span>
                              <ArrowRightIcon width={12} height={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Trust Note */}
                  <div className="flex items-center justify-center gap-2 pt-1 text-center text-[11px] text-slate-500 sm:text-xs">
                    <ShieldCheckIcon width={15} height={15} className="shrink-0 text-[#007054]" />
                    <span>
                      Official SMS shortcodes and formats are verified directly from board
                      notifications.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* -- 4 Feature Trust Badges Row (Emerald Circles) -- */}
          <div className="mt-8 grid grid-cols-2 gap-3 text-slate-700 sm:grid-cols-4 sm:gap-6">
            {/* 1: Official Board Links */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <ShieldCheckIcon width={19} height={19} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  Official Board Links
                </span>
                <span className="block truncate text-[11px] text-slate-500">
                  Direct &amp; secure access
                </span>
              </div>
            </div>

            {/* 2: Fast & Easy */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <ZapIcon width={19} height={19} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  Fast &amp; Easy
                </span>
                <span className="block truncate text-[11px] text-slate-500">
                  Get results in seconds
                </span>
              </div>
            </div>

            {/* 3: All Pakistan Boards */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <UsersIcon width={19} height={19} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  All Pakistan Boards
                </span>
                <span className="block truncate text-[11px] text-slate-500">
                  Punjab, KPK, Sindh &amp; Federal
                </span>
              </div>
            </div>

            {/* 4: Mobile Friendly */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <SmartphoneIcon width={19} height={19} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  Mobile Friendly
                </span>
                <span className="block truncate text-[11px] text-slate-500">
                  Access on any device
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* -- Bottom Popular Boards Strip (Matching Reference Screenshot) -- */}
        <div className="relative z-30 mt-10 -mb-24 sm:mt-12 sm:-mb-28 lg:-mb-32">
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-md sm:p-4">
            <div className="flex scrollbar-none items-center justify-between gap-3 overflow-x-auto py-1">
              {/* Left Title: Popular Boards */}
              <div className="shrink-0 border-r border-slate-200/80 pr-4 text-left">
                <span className="block text-xs font-extrabold whitespace-nowrap text-slate-900 sm:text-sm">
                  Popular Boards
                </span>
                <div className="mt-1 h-0.5 w-8 rounded-full bg-[#007054]" />
                <span className="mt-1 block text-[10px] whitespace-nowrap text-slate-500">
                  Quick access to top boards
                </span>
              </div>

              {/* 9 Punjab Boards */}
              <div className="flex items-center gap-2 sm:gap-3">
                {PUNJAB_TOP_BOARDS.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/results/${b.slug}/12th-class`}
                    className="group flex shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-all hover:bg-slate-50"
                  >
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white p-1 shadow-2xs transition-all duration-200 group-hover:scale-110 group-hover:border-[#007054] group-hover:shadow-xs sm:h-12 sm:w-12">
                      <Image
                        src={b.logo}
                        alt={`${b.name} ${b.city}`}
                        width={40}
                        height={40}
                        className="h-full w-full rounded-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <span className="block text-[11px] font-bold text-slate-800 group-hover:text-[#007054]">
                        {b.city}
                      </span>
                      <span className="block text-[9px] font-semibold text-slate-500">
                        {b.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Right View All Boards Button */}
              <div className="shrink-0 border-l border-slate-200/80 pl-4">
                <Link
                  href="/boards"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold whitespace-nowrap text-slate-800 transition-all hover:border-[#007054] hover:bg-[#007054] hover:text-white"
                >
                  <GridIcon width={14} height={14} />
                  <span>View All Boards</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

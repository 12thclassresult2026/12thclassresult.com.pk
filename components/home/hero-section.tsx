'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  GridIcon,
  HashIcon,
  LandmarkIcon,
  LockIcon,
  MessageSquareIcon,
  SearchIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  UserIcon,
  UsersIcon,
  ZapIcon,
} from '@/components/ui/icons'
import type { BoardOption } from '@/components/result/board-finder'

/* -- Top Boards with Authentic Official Logos & Live Slugs -- */
const BOARD_CHIPS = [
  { name: 'BISE', city: 'Lahore', slug: 'lahore-board', logo: '/logos/bise-lahore.webp' },
  {
    name: 'BISE',
    city: 'Gujranwala',
    slug: 'gujranwala-board',
    logo: '/logos/bise-gujranwala.webp',
  },
  {
    name: 'BISE',
    city: 'Faisalabad',
    slug: 'faisalabad-board',
    logo: '/logos/bise-faisalabad.webp',
  },
  { name: 'BISE', city: 'Multan', slug: 'multan-board', logo: '/logos/bise-multan.webp' },
  {
    name: 'BISE',
    city: 'Rawalpindi',
    slug: 'rawalpindi-board',
    logo: '/logos/bise-rawalpindi.webp',
  },
  { name: 'BISE', city: 'Sargodha', slug: 'sargodha-board', logo: '/logos/bise-sargodha.webp' },
  { name: 'BISE', city: 'Sahiwal', slug: 'sahiwal-board', logo: '/logos/bise-sahiwal.webp' },
  {
    name: 'BISE',
    city: 'Bahawalpur',
    slug: 'bahawalpur-board',
    logo: '/logos/bise-bahawalpur.webp',
  },
  { name: 'BISE', city: 'DG Khan', slug: 'dg-khan-board', logo: '/logos/bise-dg-khan.webp' },
  { name: 'FBISE', city: 'Federal', slug: 'federal-board', logo: '/logos/fbise.png' },
  { name: 'BISE', city: 'Peshawar', slug: 'peshawar-board', logo: '/logos/bise-peshawar.png' },
  { name: 'BISE', city: 'Abbottabad', slug: 'abbottabad-board', logo: '/logos/abbottabad.png' },
  { name: 'BISE', city: 'Swat', slug: 'swat-board', logo: '/logos/swat.jpg' },
  { name: 'BISE', city: 'Mardan', slug: 'mardan-board', logo: '/logos/mardan.png' },
  { name: 'BISE', city: 'Kohat', slug: 'kohat-board', logo: '/logos/kohat.png' },
  { name: 'BISE', city: 'Malakand', slug: 'malakand-board', logo: '/logos/malakand.png' },
  { name: 'BISE', city: 'Bannu', slug: 'bannu-board', logo: '/logos/bannu.png' },
  { name: 'BISE', city: 'DI Khan', slug: 'dera-ismail-khan-board', logo: '/logos/dikhan.png' },
] as const

type TabType = 'roll' | 'name' | 'sms'

export function HeroSection({ boards }: { boards: BoardOption[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('roll')
  const [selectedSlug, setSelectedSlug] = useState('lahore-board')
  const [rollNumber, setRollNumber] = useState('')
  const [studentName, setStudentName] = useState('')

  const withPage = boards.filter((b) => b.hasPage)
  const withoutPage = boards.filter((b) => !b.hasPage)
  const chosen = boards.find((b) => b.slug === selectedSlug) || boards[0]

  function handleRollSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chosen) return
    router.push(chosen.hasPage ? `/results/${chosen.slug}/12th-class` : '/boards')
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chosen) return
    router.push(chosen.hasPage ? `/results/${chosen.slug}/12th-class` : '/boards')
  }

  function handleSmsSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!chosen) return
    router.push(chosen.hasPage ? `/results/${chosen.slug}/12th-class` : '/boards')
  }

  return (
    <section className="relative overflow-hidden bg-[#F8FAF9] bg-[url('/images/hero-bg.webp')] bg-cover bg-center bg-no-repeat pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
      {/* Soft gradient wash for crisp contrast and readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/85 via-white/50 to-white/95 lg:from-white/30 lg:via-transparent lg:to-white/90"
      />

      {/* -- Left Flank: Urdu Heritage Calligraphy (Desktop) -- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-6 z-10 hidden text-right select-none lg:block xl:top-20 xl:left-12 2xl:left-20"
      >
        <span
          className="block font-serif text-2xl leading-snug font-black text-[#004D3F] xl:text-3xl"
          dir="rtl"
        >
          تعلیم
          <br />
          سے
          <br />
          روشن پاکستان
        </span>
      </div>

      {/* -- Right Flank: English Slogan with Green Accent (Desktop) -- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 right-14 z-10 hidden text-left select-none lg:block xl:top-20 xl:right-20 2xl:right-28"
      >
        <span className="block text-xs leading-relaxed font-black tracking-[0.25em] text-[#004D3F] uppercase xl:text-sm">
          EDUCATION
          <br />
          BUILDS A
          <br />
          STRONGER
          <br />
          PAKISTAN
        </span>
        <div className="mt-3 h-1 w-12 rounded-full bg-[#007054]" />
      </div>

      {/* -- Center Content Container -- */}
      <div className="container-wide relative z-20">
        <div className="mx-auto max-w-3xl text-center xl:max-w-4xl">
          {/* Tagline Pill Badge */}
          <div className="inline-flex items-center rounded-full border border-emerald-200/80 bg-emerald-50/90 px-4 py-1.5 shadow-xs backdrop-blur-xs">
            <span className="text-[10px] font-black tracking-[0.18em] text-[#007054] uppercase sm:text-[11px]">
              INTERMEDIATE &amp; SECONDARY EDUCATION RESULTS
            </span>
          </div>

          {/* Main Heading H1 */}
          <h1 className="mt-3 text-center text-2xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            12th Class Result <span className="text-[#007054]">2026</span> Pakistan
          </h1>

          {/* Sub-heading */}
          <p className="mt-2 text-center text-base font-bold text-slate-700 sm:text-xl md:text-2xl">
            Check by <span className="font-black text-slate-900">Roll Number</span>
            <span className="text-slate-400">, </span>
            <span className="font-black text-[#007054]">Name</span>{' '}
            <span className="font-medium text-slate-500">or</span>{' '}
            <span className="font-black text-slate-900">SMS</span>
          </p>

          {/* Subtitle Description */}
          <p className="mx-auto mt-2 max-w-xl text-center text-xs leading-relaxed text-slate-600 sm:text-sm">
            Pakistan&apos;s most trusted and independent portal for 12th Class (HSSC Part-II) annual
            examination results. Find your board, enter your details and get your result quickly.
          </p>

          {/* Floating Result Checker Card */}
          <div id="check-result" className="mx-auto mt-6 max-w-3xl sm:mt-7">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xl transition-all sm:rounded-3xl sm:p-7">
              {/* 3-Tab Pill Bar */}
              <div className="mx-auto flex max-w-md items-center justify-center gap-1.5 rounded-xl bg-slate-100/90 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('roll')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all sm:px-4 sm:text-sm ${
                    activeTab === 'roll'
                      ? 'bg-[#007054] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                  }`}
                >
                  <HashIcon width={15} height={15} />
                  <span>By Roll Number</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('name')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all sm:px-4 sm:text-sm ${
                    activeTab === 'name'
                      ? 'bg-[#007054] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                  }`}
                >
                  <UserIcon width={15} height={15} />
                  <span>By Name</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sms')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all sm:px-4 sm:text-sm ${
                    activeTab === 'sms'
                      ? 'bg-[#007054] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                  }`}
                >
                  <MessageSquareIcon width={15} height={15} />
                  <span>By SMS</span>
                </button>
              </div>

              {/* -- Tab 1: By Roll Number -- */}
              {activeTab === 'roll' && (
                <form onSubmit={handleRollSubmit} className="mt-5 space-y-3.5">
                  <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1.1fr_1.1fr_auto]">
                    {/* Field 1: Select Board */}
                    <div>
                      <label
                        htmlFor="board-select"
                        className="mb-1.5 block text-left text-xs font-bold text-slate-700"
                      >
                        Select Board
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <LandmarkIcon width={16} height={16} />
                        </div>
                        <select
                          id="board-select"
                          value={selectedSlug}
                          onChange={(e) => setSelectedSlug(e.target.value)}
                          className="h-[46px] w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pr-8 pl-9 text-xs font-medium text-slate-900 shadow-xs transition-all focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        >
                          <option value="" disabled>
                            -- Select Your Board --
                          </option>
                          <optgroup label="Boards with Result Guides">
                            {withPage.map((b) => (
                              <option key={b.slug} value={b.slug}>
                                {b.shortName} ({b.region})
                              </option>
                            ))}
                          </optgroup>
                          {withoutPage.length > 0 && (
                            <optgroup label="Other Pakistan Boards">
                              {withoutPage.map((b) => (
                                <option key={b.slug} value={b.slug}>
                                  {b.shortName} ({b.region})
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Field 2: Enter Roll Number */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label
                          htmlFor="roll-number-input"
                          className="block text-left text-xs font-bold text-slate-700"
                        >
                          Enter Roll Number
                        </label>
                        <Link
                          href="/boards"
                          className="text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                          Gazette
                        </Link>
                      </div>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <UserIcon width={16} height={16} />
                        </div>
                        <input
                          id="roll-number-input"
                          type="text"
                          inputMode="numeric"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          placeholder="e.g. 123456"
                          autoComplete="off"
                          maxLength={15}
                          className="h-[46px] w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-9 text-xs font-medium text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Field 3: Action Button */}
                    <div>
                      <button
                        type="submit"
                        className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#005B4C] px-6 text-xs font-bold whitespace-nowrap text-white shadow-sm transition-all hover:bg-[#00473B] active:scale-[0.98] sm:text-sm md:w-auto"
                      >
                        <SearchIcon width={16} height={16} />
                        <span>Check Result</span>
                      </button>
                    </div>
                  </div>

                  {/* Contextual Board Availability Helper */}
                  <p className="text-center text-[11px] text-slate-500">
                    Select your board to search online gazettes (BISE Multan, BISE Lahore, BISE
                    Bahawalpur, BISE Sargodha, BISE Sahiwal, BISE DG Khan) or access direct official
                    board links.
                  </p>

                  <p className="mt-2 text-center text-[11px] text-slate-500">
                    Use your official roll number as mentioned on your admit card. You will be
                    redirected to the official board website.
                  </p>
                </form>
              )}

              {/* -- Tab 2: By Name -- */}
              {activeTab === 'name' && (
                <form onSubmit={handleNameSubmit} className="mt-5 space-y-3.5">
                  <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1.1fr_1.1fr_auto]">
                    <div>
                      <label
                        htmlFor="name-board-select"
                        className="mb-1.5 block text-left text-xs font-bold text-slate-700"
                      >
                        Select Board
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <LandmarkIcon width={16} height={16} />
                        </div>
                        <select
                          id="name-board-select"
                          value={selectedSlug}
                          onChange={(e) => setSelectedSlug(e.target.value)}
                          className="h-[46px] w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pr-8 pl-9 text-xs font-medium text-slate-900 shadow-xs transition-all focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        >
                          {boards.map((b) => (
                            <option key={b.slug} value={b.slug}>
                              {b.shortName} ({b.region})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="student-name-input"
                        className="mb-1.5 block text-left text-xs font-bold text-slate-700"
                      >
                        Candidate Full Name
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <UserIcon width={16} height={16} />
                        </div>
                        <input
                          id="student-name-input"
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Muhammad Ali"
                          className="h-[46px] w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-9 text-xs font-medium text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#005B4C] px-6 text-xs font-bold whitespace-nowrap text-white shadow-sm transition-all hover:bg-[#00473B] active:scale-[0.98] sm:text-sm md:w-auto"
                      >
                        <SearchIcon width={16} height={16} />
                        <span>Search Gazette</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-center text-[11px] text-slate-500">
                    Official board gazettes contain complete candidate lists with names and marks.
                    Select your board to view the verified portal.
                  </p>
                </form>
              )}

              {/* -- Tab 3: By SMS -- */}
              {activeTab === 'sms' && (
                <form onSubmit={handleSmsSubmit} className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1.2fr_auto]">
                    <div>
                      <label
                        htmlFor="sms-board-select"
                        className="mb-1.5 block text-left text-xs font-bold text-slate-700"
                      >
                        Select Board for SMS Verification Method
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <LandmarkIcon width={16} height={16} />
                        </div>
                        <select
                          id="sms-board-select"
                          value={selectedSlug}
                          onChange={(e) => setSelectedSlug(e.target.value)}
                          className="h-[46px] w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pr-8 pl-9 text-xs font-medium text-slate-900 shadow-xs transition-all focus:border-[#007054] focus:ring-2 focus:ring-[#007054]/20 focus:outline-none sm:text-sm"
                        >
                          {boards.map((b) => (
                            <option key={b.slug} value={b.slug}>
                              {b.shortName} ({b.region})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#005B4C] px-6 text-xs font-bold whitespace-nowrap text-white shadow-sm transition-all hover:bg-[#00473B] sm:text-sm md:w-auto"
                      >
                        <SmartphoneIcon width={15} height={15} />
                        <span>View Board SMS Guide</span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-left">
                    <div className="text-xs font-bold text-slate-900">
                      {chosen?.shortName} SMS Instructions:
                    </div>
                    <div className="mt-1 text-xs text-slate-700">
                      Education boards announce designated telecom shortcodes on result day via
                      official notification. Click above to view verified announcement updates for
                      this board.
                    </div>
                  </div>
                </form>
              )}

              {/* Privacy and Trust Footer inside Card */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <LockIcon width={13} height={13} className="text-slate-400" />
                  <span>Privacy-safe search</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ExternalLinkIcon width={13} height={13} className="text-slate-400" />
                  <span>Official sources only</span>
                </div>
              </div>
            </div>
          </div>

          {/* -- 4 Feature Trust Badges Row -- */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-slate-700 sm:grid-cols-4 sm:gap-6">
            {/* 1: Official Board Links */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 shadow-xs backdrop-blur-xs sm:border-0 sm:bg-transparent sm:p-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <ShieldCheckIcon width={18} height={18} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  Official Board Links
                </span>
                <span className="block truncate text-[10px] text-slate-500">
                  Direct &amp; secure access
                </span>
              </div>
            </div>

            {/* 2: Fast & Easy */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 shadow-xs backdrop-blur-xs sm:border-0 sm:bg-transparent sm:p-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <ZapIcon width={18} height={18} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  Fast &amp; Easy
                </span>
                <span className="block truncate text-[10px] text-slate-500">
                  Get updates in seconds
                </span>
              </div>
            </div>

            {/* 3: All Pakistan Boards */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 shadow-xs backdrop-blur-xs sm:border-0 sm:bg-transparent sm:p-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <UsersIcon width={18} height={18} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  All Pakistan Boards
                </span>
                <span className="block truncate text-[10px] text-slate-500">
                  Punjab, KPK, Sindh &amp; Federal
                </span>
              </div>
            </div>

            {/* 4: Mobile Friendly */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-2.5 shadow-xs backdrop-blur-xs sm:border-0 sm:bg-transparent sm:p-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <SmartphoneIcon width={18} height={18} />
              </div>
              <div className="min-w-0 text-left">
                <span className="block truncate text-xs font-bold text-slate-900">
                  Mobile Friendly
                </span>
                <span className="block truncate text-[10px] text-slate-500">
                  Access on any device
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* -- Bottom Floating Official Board Logos Scrolling Ribbon -- */}
        <BoardScrollRibbon />
      </div>
    </section>
  )
}

function BoardScrollRibbon() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Continuous buttery-smooth auto-scroll with seamless loop
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animId: number
    let lastTime = performance.now()

    const step = (time: number) => {
      const delta = time - lastTime
      lastTime = time

      if (!isHovered && el) {
        // Smooth ~35px/sec continuous scrolling
        el.scrollLeft += delta * 0.035

        // When halfway through duplicated items, reset scroll position seamlessly
        const halfWidth = el.scrollWidth / 2
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth
        }
      }
      animId = requestAnimationFrame(step)
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [isHovered])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const offset = direction === 'left' ? -220 : 220
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  // Duplicate boards list for continuous infinite looping
  const displayBoards = [...BOARD_CHIPS, ...BOARD_CHIPS]

  return (
    <div className="relative z-30 mt-8 -mb-22 sm:mt-10 sm:-mb-24 lg:-mb-28">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white/95 p-2.5 shadow-xl backdrop-blur-md sm:rounded-3xl sm:p-3.5">
        <div className="relative flex items-center">
          {/* Left Arrow Button (Desktop) */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll boards left"
            className="absolute -left-2 z-20 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all hover:scale-110 hover:bg-emerald-50 hover:text-[#007054] active:scale-95 sm:-left-3.5 sm:flex"
          >
            <ChevronLeftIcon width={15} height={15} />
          </button>

          {/* Left Fade Gradient Mask */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-12"
          />

          {/* Scrollable Container with Official Logos */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsHovered(false), 2000)
            }}
            className="flex cursor-grab scrollbar-none items-center gap-1.5 overflow-x-auto px-3 py-1 select-none active:cursor-grabbing sm:px-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {displayBoards.map((b, idx) => (
              <Link
                key={`${b.slug}-${idx}`}
                href={`/results/${b.slug}/12th-class`}
                className="group flex shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-all hover:bg-emerald-50/60 sm:rounded-2xl sm:px-3"
              >
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white p-1 shadow-xs transition-all duration-200 group-hover:scale-110 group-hover:border-[#007054] group-hover:shadow-md sm:h-12 sm:w-12">
                  <Image
                    src={b.logo}
                    alt={`${b.name} ${b.city}`}
                    width={40}
                    height={40}
                    className="h-full w-full rounded-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold whitespace-nowrap text-slate-800 transition-colors group-hover:text-[#007054] sm:text-[11px]">
                  {b.name}
                </span>
                <span className="text-[9px] font-medium whitespace-nowrap text-slate-500 sm:text-[9.5px]">
                  {b.city}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Fade Gradient Mask */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-24 bottom-0 z-10 w-8 bg-gradient-to-l from-white via-white/80 to-transparent sm:right-32 sm:w-12"
          />

          {/* Right Arrow Button (Desktop) */}
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll boards right"
            className="absolute right-28 z-20 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all hover:scale-110 hover:bg-emerald-50 hover:text-[#007054] active:scale-95 sm:right-36 sm:flex"
          >
            <ChevronRightIcon width={15} height={15} />
          </button>

          {/* Fixed "View All Boards" CTA on Right */}
          <div className="relative z-20 shrink-0 border-l border-slate-200/80 pl-2 sm:pl-3">
            <Link
              href="/boards"
              className="group flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-3 py-2 text-[#007054] shadow-xs transition-all hover:bg-[#007054] hover:text-white hover:shadow-md sm:rounded-2xl sm:px-4"
            >
              <GridIcon
                width={17}
                height={17}
                className="text-[#007054] transition-transform group-hover:scale-110 group-hover:text-white"
              />
              <span className="text-[10px] font-bold whitespace-nowrap sm:text-[11px]">
                All Boards &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

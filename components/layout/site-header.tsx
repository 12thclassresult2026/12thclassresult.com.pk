'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { HeaderMegaMenu } from '@/components/layout/header-mega-menu'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ResultUpdateTicker } from '@/components/layout/result-update-ticker'
import {
  formatAnnouncementDate,
  PUNJAB_HSSC_PART2_ANNOUNCEMENT,
  PUNJAB_HSSC_PART2_ANNOUNCEMENT_TIME,
} from '@/lib/result/announcement'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FacebookIcon,
  FileTextIcon,
  InstagramIcon,
  SearchIcon,
  TwitterXIcon,
  UsersIcon,
  YouTubeIcon,
} from '@/components/ui/icons'

export function SiteHeader() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const sticks = () => {
      if (getComputedStyle(el).position !== 'sticky') return false
      for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
        const o = getComputedStyle(p)
        if (/auto|scroll|hidden/.test(`${o.overflowX} ${o.overflowY}`)) return false
      }
      return true
    }
    const publish = () =>
      document.documentElement.style.setProperty(
        '--site-header-h',
        sticks() ? `${Math.ceil(el.getBoundingClientRect().height)}px` : '0px',
      )
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header ref={headerRef} className="sticky top-0 z-50 shadow-sm transition-colors">
      {/* Tier 1: Dark Evergreen Top Utility Bar */}
      <div className="border-b border-[#00382E] bg-[#00473B] text-white">
        <div className="container-wide flex h-9 items-center justify-between gap-2 text-[11px] sm:h-10 sm:text-xs">
          {/* Left: Pakistan Flag & Trust Slogan */}
          <div className="flex items-center gap-2 font-medium text-emerald-100">
            <svg
              className="h-3.5 w-5 shrink-0 rounded-xs shadow-2xs"
              viewBox="0 0 900 600"
              aria-hidden="true"
            >
              <rect width="900" height="600" fill="#01411C" />
              <rect width="225" height="600" fill="#ffffff" />
              <circle cx="562.5" cy="300" r="180" fill="#ffffff" />
              <circle cx="612.5" cy="275" r="165" fill="#01411C" />
              <polygon
                points="630,225 640,255 670,255 645,275 655,305 630,285 605,305 615,275 590,255 620,255"
                fill="#ffffff"
              />
            </svg>
            <span className="truncate">Pakistan&apos;s Most Trusted Result Portal</span>
          </div>

          {/* Center: PBCC Official Announcement Date Badge */}
          <Link
            href="/results/12th-class"
            className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-black/25 px-3.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-black/35 md:inline-flex"
          >
            <CalendarIcon width={12} height={12} className="shrink-0 text-emerald-300" />
            {/*
              NOT "Official". This read "Official PBCC Date (Tentative): 22
              October 2026" — a contradiction on its face, wrapped around a
              date that cited nothing and was a month wrong.

              The date now comes from lib/result/announcement.ts, where its
              status is `tentative` because it is press reporting of a PBCC
              calendar, not a notification read on a board's own domain. The
              wording has to match that: "Expected" is what we can support, and
              the badge links to the page where the source is named.
            */}
            <span>
              Expected:{' '}
              <strong className="font-bold text-emerald-300">
                {formatAnnouncementDate(PUNJAB_HSSC_PART2_ANNOUNCEMENT.value ?? '')} ·{' '}
                {PUNJAB_HSSC_PART2_ANNOUNCEMENT_TIME}
              </strong>
            </span>
          </Link>

          {/* Right: Info Links + Social Icons */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2.5 text-[11px] font-medium text-emerald-100/90 lg:flex">
              <Link href="/about" className="transition-colors hover:text-white">
                About
              </Link>
              <span className="text-emerald-500/50">|</span>
              <Link href="/about" className="transition-colors hover:text-white">
                Contact
              </Link>
              <span className="text-emerald-500/50">|</span>
              <Link href="/methodology" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </div>

            {/* Social Media Cluster */}
            <div className="flex items-center gap-1.5">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-white transition-all hover:scale-110 hover:bg-[#1877F2]"
              >
                <FacebookIcon width={11} height={11} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-white transition-all hover:scale-110 hover:bg-black"
              >
                <TwitterXIcon width={11} height={11} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-white transition-all hover:scale-110 hover:bg-[#FF0000]"
              >
                <YouTubeIcon width={11} height={11} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-white transition-all hover:scale-110 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]"
              >
                <InstagramIcon width={11} height={11} />
              </a>

              {/* Search Icon */}
              <Link
                href="/boards"
                aria-label="Search all boards"
                className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/25 text-white transition-all hover:scale-110 hover:bg-emerald-600"
              >
                <SearchIcon width={12} height={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2: Pure White Primary Navigation Bar */}
      <div className="relative border-b border-slate-200/80 bg-white">
        <div className="container-wide flex h-[62px] items-center justify-between gap-4">
          {/* Brand Logo (Official Master Graphic Logo) */}
          <Link
            href="/"
            className="group flex shrink-0 items-center transition-opacity hover:opacity-95"
            aria-label="12thClassResult.com.pk — Homepage"
          >
            <Image
              src="/logo.png"
              alt="12thClassResult.com.pk — Pakistan's Education Results Portal"
              width={953}
              height={225}
              className="h-[44px] w-auto max-w-[210px] object-contain transition-transform duration-200 group-hover:scale-[1.02] sm:h-[48px] sm:max-w-[230px]"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {/*
              `whitespace-nowrap` IS THE WHOLE FIX FOR THE WRAPPING.

              Seven of the ten items rendered on two lines at EVERY desktop
              width, 1920 included — "Punjab / Boards", "Date / Schedule" — so
              this was never a question of screen size. The labels were simply
              allowed to break, and a flex row will happily squeeze its items
              and let the text wrap rather than overflow.

              With breaking off, the row needs a real plan for narrow screens,
              which is the tiering below.
            */}
            <ul className="flex items-center gap-0.5 whitespace-nowrap xl:gap-1">
              {/* Home */}
              <li>
                <Link
                  href="/"
                  className="relative px-3 py-2 text-[13px] font-bold text-[#007054] transition-colors hover:text-[#00473B]"
                >
                  Home
                  <span className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-[#007054]" />
                </Link>
              </li>

              {/* 12th Result 2026 Dropdown */}
              <li
                className="relative"
                onMouseEnter={() => setOpenDropdown('results')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'results' ? null : 'results')}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-bold transition-all ${
                    openDropdown === 'results'
                      ? 'rounded-t-2xl bg-[#EAF7F2] text-[#007054]'
                      : 'rounded-md text-slate-700 hover:bg-slate-50 hover:text-[#007054]'
                  }`}
                >
                  <span>12th Result 2026</span>
                  <ChevronDownIcon
                    width={12}
                    height={12}
                    className={`transition-colors ${
                      openDropdown === 'results' ? 'text-[#007054]' : 'text-slate-400'
                    }`}
                  />
                </button>

                {openDropdown === 'results' && (
                  <div className="animate-in fade-in slide-in-from-top-1 absolute top-full left-0 z-50 w-[340px] rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xl">
                    {/* Header: Quick Access & Find Your Result Faster */}
                    <div className="mb-2.5 flex items-center justify-between px-1.5 pt-0.5">
                      <span className="text-xs font-bold text-slate-800">Quick Access</span>
                      <span className="text-[11px] font-medium text-slate-400 italic">
                        Find Your Result Faster
                      </span>
                    </div>

                    {/* 5 Result Quick Navigation Items */}
                    <div className="space-y-1">
                      {/* Item 1: 12th Class Result Hub 2026 (Active style) */}
                      <Link
                        href="/results/12th-class"
                        onClick={() => setOpenDropdown(null)}
                        className="group flex items-center justify-between rounded-xl border-l-4 border-[#007054] bg-[#EBF7F2] p-2.5 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                            <FileTextIcon width={16} height={16} />
                          </div>
                          <span className="text-xs font-bold text-[#007054]">
                            12th Class Result Hub 2026
                          </span>
                        </div>
                        <ChevronRightIcon
                          width={14}
                          height={14}
                          className="text-[#007054] transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>

                      {/* Item 2: Roll Number & SMS Search */}
                      <Link
                        href="/#check-result"
                        onClick={() => setOpenDropdown(null)}
                        className="group flex items-center justify-between rounded-xl p-2.5 transition-all hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                            <SearchIcon width={16} height={16} />
                          </div>
                          <span className="text-xs font-bold text-slate-800 transition-colors group-hover:text-[#007054]">
                            Roll Number &amp; SMS Search
                          </span>
                        </div>
                        <ChevronRightIcon
                          width={14}
                          height={14}
                          className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#007054]"
                        />
                      </Link>

                      {/* Item 3: Result Date Schedule */}
                      <Link
                        href="/results/12th-class"
                        onClick={() => setOpenDropdown(null)}
                        className="group flex items-center justify-between rounded-xl p-2.5 transition-all hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                            <CalendarIcon width={16} height={16} />
                          </div>
                          <span className="text-xs font-bold text-slate-800 transition-colors group-hover:text-[#007054]">
                            Result Date Schedule
                          </span>
                        </div>
                        <ChevronRightIcon
                          width={14}
                          height={14}
                          className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#007054]"
                        />
                      </Link>

                      {/* Item 4: Board-wise Result Guides */}
                      <Link
                        href="/boards"
                        onClick={() => setOpenDropdown(null)}
                        className="group flex items-center justify-between rounded-xl p-2.5 transition-all hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                            <UsersIcon width={16} height={16} />
                          </div>
                          <span className="text-xs font-bold text-slate-800 transition-colors group-hover:text-[#007054]">
                            Board-wise Result Guides
                          </span>
                        </div>
                        <ChevronRightIcon
                          width={14}
                          height={14}
                          className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#007054]"
                        />
                      </Link>

                      {/* Item 5: Result Gazette Archives */}
                      <Link
                        href="/gazette"
                        onClick={() => setOpenDropdown(null)}
                        className="group flex items-center justify-between rounded-xl p-2.5 transition-all hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                            <FileTextIcon width={16} height={16} />
                          </div>
                          <span className="text-xs font-bold text-slate-800 transition-colors group-hover:text-[#007054]">
                            Result Gazette Archives
                          </span>
                        </div>
                        <ChevronRightIcon
                          width={14}
                          height={14}
                          className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#007054]"
                        />
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              {/*
                Punjab Boards — A REAL LINK, NOT A BARE BUTTON.

                This was a `<button>` with no href, so the region it names had
                no destination: a keyboard user could open the menu but never
                reach a Punjab page, and a crawler saw nothing at all. It now
                goes to the Punjab hub and still opens the mega menu on hover
                or click, which is the same pattern All Boards already used.
              */}
              <li className="relative" onMouseEnter={() => setOpenDropdown('punjab')}>
                <Link
                  href="/results/punjab/12th-class"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'punjab'}
                  onClick={() => setOpenDropdown(null)}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                    openDropdown === 'punjab'
                      ? 'rounded-t-xl bg-emerald-50 text-[#007054] shadow-xs'
                      : 'rounded-md text-slate-700 hover:bg-slate-50 hover:text-[#007054]'
                  }`}
                >
                  <span>Punjab Boards</span>
                  <ChevronDownIcon
                    width={12}
                    height={12}
                    className={openDropdown === 'punjab' ? 'text-[#007054]' : 'text-slate-400'}
                  />
                </Link>
              </li>

              {/*
                KPK and Sindh, BESIDE PUNJAB AND BUILT THE SAME WAY.

                KPK had no header item at all while its results were already
                out — Peshawar declared on 21 September and others followed on
                their own dates — so a student in Mardan or Bannu found Punjab
                in the navigation and their own region nowhere. Sindh had the
                same gap while Hyderabad was publishing HSC-II 2026 group by
                group.

                Each is a link AND a menu trigger: the link is what a keyboard
                user and a crawler get, the menu is the shortcut for a mouse.
                A trigger with no href gives the first two nothing, which is
                what Punjab used to be.
              */}
              <li className="relative" onMouseEnter={() => setOpenDropdown('kpk')}>
                <Link
                  href="/results/kpk/12th-class"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'kpk'}
                  onClick={() => setOpenDropdown(null)}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                    openDropdown === 'kpk'
                      ? 'rounded-t-xl bg-emerald-50 text-[#007054] shadow-xs'
                      : 'rounded-md text-slate-700 hover:bg-slate-50 hover:text-[#007054]'
                  }`}
                >
                  <span>KPK Boards</span>
                  <ChevronDownIcon
                    width={12}
                    height={12}
                    className={openDropdown === 'kpk' ? 'text-[#007054]' : 'text-slate-400'}
                  />
                </Link>
              </li>

              <li className="relative" onMouseEnter={() => setOpenDropdown('sindh')}>
                <Link
                  href="/results/sindh/12th-class"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'sindh'}
                  onClick={() => setOpenDropdown(null)}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                    openDropdown === 'sindh'
                      ? 'rounded-t-xl bg-emerald-50 text-[#007054] shadow-xs'
                      : 'rounded-md text-slate-700 hover:bg-slate-50 hover:text-[#007054]'
                  }`}
                >
                  <span>Sindh Boards</span>
                  <ChevronDownIcon
                    width={12}
                    height={12}
                    className={openDropdown === 'sindh' ? 'text-[#007054]' : 'text-slate-400'}
                  />
                </Link>
              </li>

              {/* All Boards - Triggers Mega Menu with all provinces */}
              <li className="relative" onMouseEnter={() => setOpenDropdown('all-boards')}>
                <Link
                  href="/boards"
                  onClick={() => setOpenDropdown(null)}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                    openDropdown === 'all-boards'
                      ? 'rounded-t-xl bg-emerald-50 text-[#007054] shadow-xs'
                      : 'rounded-md text-slate-700 hover:bg-slate-50 hover:text-[#007054]'
                  }`}
                >
                  <span>All Boards</span>
                  <ChevronDownIcon
                    width={12}
                    height={12}
                    className={openDropdown === 'all-boards' ? 'text-[#007054]' : 'text-slate-400'}
                  />
                </Link>
              </li>

              {/* Date Schedule */}
              <li
                className="relative hidden xl:block"
                onMouseEnter={() => setOpenDropdown('schedule')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href="/results/12th-class"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#007054]"
                >
                  <span>Date Schedule</span>
                  <ChevronDownIcon width={12} height={12} className="text-slate-400" />
                </Link>
              </li>

              {/* Gazette */}
              <li
                className="relative hidden xl:block"
                onMouseEnter={() => setOpenDropdown('gazette')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href="/gazette"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#007054]"
                >
                  <span>Gazette</span>
                  <ChevronDownIcon width={12} height={12} className="text-slate-400" />
                </Link>
              </li>

              {/* SMS Codes */}
              <li
                className="relative hidden xl:block"
                onMouseEnter={() => setOpenDropdown('sms')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href="/#check-result"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#007054]"
                >
                  <span>SMS Codes</span>
                  <ChevronDownIcon width={12} height={12} className="text-slate-400" />
                </Link>
              </li>

              {/* FAQs */}
              <li
                className="relative hidden xl:block"
                onMouseEnter={() => setOpenDropdown('faqs')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href="/#faq-section"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#007054]"
                >
                  <span>FAQs</span>
                  <ChevronDownIcon width={12} height={12} className="text-slate-400" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Action Button (Check Result) + the menu a phone gets */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/#check-result"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#005B4C] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#00473B] hover:shadow-md active:scale-95"
            >
              <span>Check Result</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <MobileNav />
          </div>

          {/*
            Full Mega Menu Dropdown.

            One menu, opened on the province the trigger names. The menu
            already filtered itself to boards that have a page, so a region
            with nothing published cannot open an empty panel.
          */}
          {(['punjab', 'kpk', 'sindh', 'all-boards'] as const).some(
            (id) => openDropdown === id,
          ) && (
            <HeaderMegaMenu
              initialProvince={openDropdown === 'all-boards' ? 'all' : (openDropdown ?? 'punjab')}
              /*
                Only "All Boards" gets the province switcher. A reader who
                clicked "Punjab Boards" has already answered that question, and
                showing it again puts four provinces they did not ask for above
                the boards they did.
              */
              showProvinceSwitcher={openDropdown === 'all-boards'}
              onClose={() => setOpenDropdown(null)}
            />
          )}
        </div>
      </div>

      {/* Tier 3: Scrolling Result Update Ticker */}
      <ResultUpdateTicker />
    </header>
  )
}

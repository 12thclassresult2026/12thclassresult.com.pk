'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { HeaderMegaMenu } from '@/components/layout/header-mega-menu'
import { ResultUpdateTicker } from '@/components/layout/result-update-ticker'
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
            <span>
              Official PBCC Date (Tentative):{' '}
              <strong className="font-bold text-emerald-300">22 October 2026</strong>
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
          {/* Brand Logo with Cap Emblem */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-95"
            aria-label="12thClassResult.com.pk � Homepage"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#007054] text-white shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                <path d="M22 10v6" />
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[17px] leading-none font-black tracking-tight text-slate-900 sm:text-lg">
                12thclassresult<span className="text-[#007054]">.com.pk</span>
              </span>
              <span className="mt-1 text-[10px] font-medium tracking-tight text-slate-500">
                Your Guide to Board Results in Pakistan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            <ul className="flex items-center gap-0.5 xl:gap-1">
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
                        href="/#gazette"
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

              {/* Punjab Boards - Triggers Mega Menu */}
              <li className="relative" onMouseEnter={() => setOpenDropdown('punjab')}>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'punjab' ? null : 'punjab')}
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
                </button>
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
                className="relative"
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
                className="relative"
                onMouseEnter={() => setOpenDropdown('gazette')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href="/#gazette"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#007054]"
                >
                  <span>Gazette</span>
                  <ChevronDownIcon width={12} height={12} className="text-slate-400" />
                </Link>
              </li>

              {/* SMS Codes */}
              <li
                className="relative"
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
                className="relative"
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

          {/* Right Action Button (Check Result) */}
          <div className="flex items-center gap-3">
            <Link
              href="/#check-result"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#005B4C] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#00473B] hover:shadow-md active:scale-95"
            >
              <span>Check Result</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Full Mega Menu Dropdown */}
          {(openDropdown === 'punjab' || openDropdown === 'all-boards') && (
            <HeaderMegaMenu
              initialProvince={openDropdown === 'all-boards' ? 'all' : 'punjab'}
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

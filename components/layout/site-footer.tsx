'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from '@/components/ui/icons'
import { routedBoards } from '@/lib/board/registry'

/*
 * Footer board links, resolved through the registry.
 *
 * This was a hand-written map, and two of its ten entries — `bise-faisalabad`
 * and `fbise` — pointed at board pages that are deliberately unpublished and
 * return 404. A dead link in a footer sits on every page of the site.
 *
 * Asking `routedBoards()` means a board is linked only once it has a page, and
 * anything else falls back to the directory, where it is still named honestly.
 */
const BOARD_HREF = (boardId: string) => {
  const board = routedBoards().find((candidate) => candidate.id === boardId)
  return board ? `/results/${board.slug}/12th-class` : '/boards'
}

export function SiteFooter() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="w-full">
      {/* -- 1. Full-Width Top Trust & Value Proposition Banner -- */}
      <div className="w-full border-t border-[#B4D5CC]/80 bg-[#EDF8F5] py-5 sm:py-6">
        <div className="container-wide flex flex-col items-center justify-between gap-6 xl:flex-row">
          {/* 4 Feature Columns with Dividers */}
          <div className="grid flex-1 grid-cols-1 divide-y divide-[#B4D5CC]/60 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {/* 1: Trusted & Accurate */}
            <div className="flex items-center gap-3.5 px-3 py-2 sm:px-4 sm:py-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#005B4C] text-white shadow-xs">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Trusted &amp; Accurate</h4>
                <p className="text-xs text-slate-500">Direct links to official board websites</p>
              </div>
            </div>

            {/* 2: Fast & Easy Access */}
            <div className="flex items-center gap-3.5 px-3 py-2 sm:px-4 sm:py-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#005B4C] text-white shadow-xs">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Fast &amp; Easy Access</h4>
                <p className="text-xs text-slate-500">Get your result in seconds</p>
              </div>
            </div>

            {/* 3: Your Privacy Matters */}
            <div className="flex items-center gap-3.5 px-3 py-2 sm:px-4 sm:py-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#005B4C] text-white shadow-xs">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Your Privacy Matters</h4>
                <p className="text-xs text-slate-500">Your information is secure</p>
              </div>
            </div>

            {/* 4: All Pakistan Boards */}
            <div className="flex items-center gap-3.5 px-3 py-2 sm:px-4 sm:py-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#005B4C] text-white shadow-xs">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">All Pakistan Boards</h4>
                <p className="text-xs text-slate-500">Punjab, KPK, Sindh &amp; Federal</p>
              </div>
            </div>
          </div>

          {/* Far Right Handwritten Slogan */}
          <div className="hidden shrink-0 pr-2 text-right xl:block">
            <span
              className="block -rotate-3 text-lg leading-snug font-black tracking-wide text-[#007054] italic"
              style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '24px' }}
            >
              Education
              <br />
              Builds a Stronger
              <br />
              Pakistan
            </span>
            <svg
              width="110"
              height="10"
              viewBox="0 0 110 10"
              fill="none"
              className="mt-1 ml-auto text-[#007054]"
            >
              <path
                d="M2 7C30 3 80 2 108 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* -- 2. Deep Forest Green Main Footer Body -- */}
      <div className="relative overflow-hidden bg-[#002B20] py-14 text-slate-300">
        {/* Minar-e-Pakistan & Crescent Artwork on Right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 bottom-14 z-0 hidden opacity-45 mix-blend-screen select-none lg:block xl:right-10"
          style={{ width: '280px' }}
        >
          <Image
            src="/images/minar-footer.jpg"
            alt=""
            width={320}
            height={427}
            className="h-auto w-full object-contain"
            unoptimized
          />
          {/* Motivational handwritten script below image */}
          <div className="mt-2 text-center">
            <span
              className="text-[#00E599] italic"
              style={{
                fontFamily: 'var(--font-caveat), cursive',
                fontSize: '24px',
                fontWeight: 700,
                opacity: 0.95,
              }}
            >
              Proud of
              <br />
              Pakistan&apos;s Students
            </span>
            <div className="mx-auto mt-1 h-0.5 w-32 rounded-full bg-[#00E599]/60" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* -- Column 1: Brand Info & Social (lg:col-span-3) -- */}
            <div className="lg:col-span-3">
              {/* Logo Lockup (Official Master Graphic Logo) */}
              <Link
                href="/"
                className="group inline-flex items-center transition-opacity hover:opacity-95"
                aria-label="12thClassResult.com.pk — Homepage"
              >
                <div className="inline-flex rounded-xl bg-white p-2.5 shadow-md transition-transform group-hover:scale-[1.02]">
                  <Image
                    src="/logo.png"
                    alt="12thClassResult.com.pk"
                    width={953}
                    height={225}
                    className="h-10 w-auto max-w-[210px] object-contain"
                  />
                </div>
              </Link>

              {/* Tagline Description */}
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-300 sm:text-[13px]">
                Pakistan&apos;s most trusted and independent portal for 12th Class (HSSC Part-II)
                results. Get the latest updates, result dates, gazette, SMS codes and direct links
                to all official board websites.
              </p>

              {/* Social Media Circular Buttons */}
              <div className="mt-6 flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-xs transition-transform hover:scale-110"
                >
                  <FacebookIcon width={16} height={16} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black text-white shadow-xs transition-transform hover:scale-110"
                >
                  <TwitterXIcon width={14} height={14} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] text-white shadow-xs transition-transform hover:scale-110"
                >
                  <InstagramIcon width={15} height={15} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-xs transition-transform hover:scale-110"
                >
                  <YouTubeIcon width={16} height={16} />
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs transition-transform hover:scale-110"
                >
                  <WhatsAppIcon width={16} height={16} />
                </a>
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                Stay connected for the latest updates and important announcements.
              </p>
            </div>

            {/* -- Column 2: Quick Links (lg:col-span-2) -- */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-black tracking-wide text-white uppercase">Quick Links</h3>
              <ul className="mt-4 space-y-2 text-xs">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 font-bold text-[#00E599] transition-colors hover:underline"
                  >
                    <span>&rsaquo;</span>
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/results/12th-class"
                    className="flex items-center gap-1.5 font-bold text-[#00E599] transition-colors hover:underline"
                  >
                    <span>&rsaquo;</span>
                    <span>12th Class Result 2026</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/results/12th-class"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Punjab Boards</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/boards"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>All Boards</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/results/12th-class"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Date Schedule</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/boards"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Gazette 2026</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#check-result"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>SMS Codes</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#faq-section"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>FAQs</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* -- Column 3: Boards (lg:col-span-2) -- */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-black tracking-wide text-white uppercase">Boards</h3>
              <ul className="mt-4 space-y-2 text-xs">
                <li>
                  <Link
                    href={BOARD_HREF('bise-lahore')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>BISE Lahore</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={BOARD_HREF('bise-gujranwala')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>BISE Gujranwala</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={BOARD_HREF('bise-faisalabad')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>BISE Faisalabad</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={BOARD_HREF('bise-multan')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>BISE Multan</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={BOARD_HREF('bise-rawalpindi')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>BISE Rawalpindi</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={BOARD_HREF('bise-sargodha')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>BISE Sargodha</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={BOARD_HREF('bise-sahiwal')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>BISE Sahiwal</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={BOARD_HREF('bise-bahawalpur')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>BISE Bahawalpur</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={BOARD_HREF('bise-dg-khan')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>BISE DG Khan</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={BOARD_HREF('fbise')}
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>FBISE (Federal)</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* -- Column 4: Support (lg:col-span-2) -- */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-black tracking-wide text-white uppercase">Support</h3>
              <ul className="mt-4 space-y-2 text-xs">
                <li>
                  <Link
                    href="/about"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/methodology"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Disclaimer</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap.xml"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Sitemap</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/methodology"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>How we verify</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* -- Column 5: Get Result Updates (Newsletter) (lg:col-span-3) -- */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-black tracking-wide text-white uppercase">
                Get Result Updates
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                Subscribe to get the latest news, result dates and announcements.
              </p>

              {/* Form */}
              <form onSubmit={(e) => e.preventDefault()} className="mt-4 space-y-2.5">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pr-3 pl-9 text-xs text-white placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white/10 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#00875A] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#007048] active:scale-95"
                >
                  <span>Subscribe</span>
                  <span>&rarr;</span>
                </button>
              </form>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>We respect your privacy. No spam.</span>
              </div>
            </div>
          </div>
        </div>

        {/* -- 3. Bottom Legal, Copyright & Scroll-to-Top Bar -- */}
        <div className="container-wide relative z-10 mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-400 md:flex-row">
            {/* Left Copyright */}
            <div>&copy; 2026 12thclassresult.com.pk. All rights reserved.</div>

            {/* Center Policy Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
              <Link href="/methodology" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/methodology" className="transition-colors hover:text-white">
                Terms of Use
              </Link>
              <span>|</span>
              <Link href="/methodology" className="transition-colors hover:text-white">
                Disclaimer
              </Link>
              <span>|</span>
              <Link href="/sitemap.xml" className="transition-colors hover:text-white">
                Sitemap
              </Link>
              <span>|</span>
              <Link href="/about" className="transition-colors hover:text-white">
                Contact Us
              </Link>
            </div>

            {/* Right: Made with Love & Scroll Button */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[11px]">
                Made with <span className="text-[#00E599]">&hearts;</span> for Pakistan&apos;s
                Students
              </span>

              {/* Scroll to Top Button */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B4D5CC] text-[#002B20] shadow-sm transition-all hover:scale-110 hover:bg-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

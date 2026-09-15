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

const BOARD_HREF = (slug: string) => {
  const map: Record<string, string> = {
    'bise-lahore': '/results/lahore-board/12th-class',
    'bise-gujranwala': '/results/gujranwala-board/12th-class',
    'bise-faisalabad': '/results/faisalabad-board/12th-class',
    'bise-multan': '/results/multan-board/12th-class',
    'bise-rawalpindi': '/results/rawalpindi-board/12th-class',
    'bise-sargodha': '/results/sargodha-board/12th-class',
    'bise-sahiwal': '/results/sahiwal-board/12th-class',
    'bise-bahawalpur': '/results/bahawalpur-board/12th-class',
    'bise-dg-khan': '/results/dg-khan-board/12th-class',
    fbise: '/results/federal-board/12th-class',
  }
  return map[slug] || '/boards'
}

export function SiteFooter() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative mt-24 w-full">
      {/* ── 1. Top Floating Trust & Value Proposition Banner ───────── */}
      <div className="relative z-20 mx-auto -mb-14 max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
        <div className="flex flex-col items-stretch justify-between gap-6 rounded-2xl border border-[#B4D5CC] bg-[#EDF8F5] p-5 shadow-lg backdrop-blur-xs sm:rounded-3xl sm:p-7 lg:flex-row lg:items-center">
          {/* 4 Feature Columns */}
          <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {/* 1: Trusted & Accurate */}
            <div className="flex items-center gap-3.5">
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
            <div className="flex items-center gap-3.5">
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
            <div className="flex items-center gap-3.5">
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
            <div className="flex items-center gap-3.5">
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
          <div className="hidden shrink-0 text-right xl:block">
            <span
              className="block -rotate-3 text-lg leading-snug font-black tracking-wide text-[#007054] italic"
              style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '22px' }}
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

      {/* ── 2. Deep Forest Green Main Footer Body ───────────────────── */}
      <div className="relative overflow-hidden bg-[#002B20] pt-28 pb-10 text-slate-300">
        {/* Minar-e-Pakistan Image - Right Side Decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-16 z-0 hidden opacity-30 mix-blend-screen select-none lg:block"
          style={{ width: '320px' }}
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
          <div className="mt-3 text-center">
            <span
              className="text-[#00E599] italic"
              style={{
                fontFamily: 'var(--font-caveat), cursive',
                fontSize: '24px',
                fontWeight: 700,
                opacity: 0.9,
              }}
            >
              Proud of
              <br />
              Pakistan&apos;s Students
            </span>
            <div className="mx-auto mt-1 h-0.5 w-32 rounded-full bg-[#00E599]/50" />
          </div>
        </div>

        {/* ── Main Content Grid ─────────────────────────────────────── */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* ── Column 1: Brand Info & Social (lg:col-span-3) ──────── */}
            <div className="lg:col-span-3">
              {/* Logo Lockup */}
              <Link href="/" className="group inline-flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-500/30 bg-white/5 p-1 shadow-sm">
                  <Image
                    src="/icons/crest.svg"
                    unoptimized
                    alt="12thClassResult.com.pk crest"
                    width={44}
                    height={44}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-xl font-black tracking-tight text-white sm:text-[22px]">
                    12thclassresult<span className="text-[#00E599]">.com.pk</span>
                  </div>
                  <div className="text-[10px] font-bold tracking-wider text-emerald-300/80 uppercase">
                    Your Guide to Board Results in Pakistan
                  </div>
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
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-xs transition-transform hover:scale-110"
                >
                  <FacebookIcon width={16} height={16} />
                </a>
                {/* Twitter / X */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black text-white shadow-xs transition-transform hover:scale-110"
                >
                  <TwitterXIcon width={14} height={14} />
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] text-white shadow-xs transition-transform hover:scale-110"
                >
                  <InstagramIcon width={15} height={15} />
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-xs transition-transform hover:scale-110"
                >
                  <YouTubeIcon width={16} height={16} />
                </a>
                {/* WhatsApp */}
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

            {/* ── Column 2: Quick Links (lg:col-span-2) ─────────────── */}
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
                    href="/results/12th-class/2026"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>12th Class Result 2026</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/results/punjab/12th-class/2026"
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
                    href="/results/12th-class/2026/date"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Date Schedule</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/results/12th-class/2026/gazette"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Gazette 2026</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#sms-codes"
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

            {/* ── Column 3: Boards (lg:col-span-2) ──────────────────── */}
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

            {/* ── Column 4: Support (lg:col-span-2) ─────────────────── */}
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
                    href="/contact"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    <span>&rsaquo;</span>
                    <span>Terms of Use</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disclaimer"
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
              </ul>
            </div>

            {/* ── Column 5: Get Result Updates (Newsletter) (lg:col-span-3) */}
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
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#007054] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#005B44] active:scale-95"
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

        {/* ── 3. Bottom Legal, Copyright & Scroll-to-Top Bar ─────────── */}
        <div className="relative z-10 mt-16 border-t border-white/10 pt-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-400 sm:px-6 md:flex-row lg:px-8 2xl:max-w-[1600px]">
            {/* Left Copyright */}
            <div>&copy; 2026 12thclassresult.com.pk. All rights reserved.</div>

            {/* Center Policy Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms of Use
              </Link>
              <span>|</span>
              <Link href="/disclaimer" className="transition-colors hover:text-white">
                Disclaimer
              </Link>
              <span>|</span>
              <Link href="/sitemap.xml" className="transition-colors hover:text-white">
                Sitemap
              </Link>
              <span>|</span>
              <Link href="/contact" className="transition-colors hover:text-white">
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

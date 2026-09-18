import Link from 'next/link'

import {
  ArrowRightIcon,
  CalendarIcon,
  FileTextIcon,
  LandmarkIcon,
  SearchIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons'

interface CurrentStatusSectionProps {
  lastVerifiedAt?: string | null
}

function formatVerifiedDate(isoDate?: string | null): string {
  if (!isoDate) return '14 September 2026'
  try {
    const parts = isoDate.split('-').map(Number)
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]
    if (!year || !month || !day) return isoDate
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const monthName = months[month - 1]
    if (!monthName) return isoDate
    return `${day} ${monthName} ${year}`
  } catch {
    return isoDate
  }
}

function GraduationCapIcon({
  width = 20,
  height = 20,
  className = '',
}: {
  width?: number
  height?: number
  className?: string
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

function ExamListIcon({
  width = 20,
  height = 20,
  className = '',
}: {
  width?: number
  height?: number
  className?: string
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  )
}

function BellIcon({
  width = 18,
  height = 18,
  className = '',
}: {
  width?: number
  height?: number
  className?: string
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function MinarPakistanWatermark() {
  return (
    <svg
      viewBox="0 0 160 400"
      fill="currentColor"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 h-[320px] w-auto text-[#007054]/[0.07] select-none sm:h-[380px] lg:h-[420px]"
    >
      <path d="M10 395 C40 380 120 380 150 395 L160 400 L0 400 Z" />
      <path d="M25 385 C45 365 115 365 135 385 L145 390 L15 390 Z" />
      <path d="M40 370 C55 350 105 350 120 370 L130 376 L30 376 Z" />
      <path d="M45 350 C50 300 65 260 70 230 C72 260 75 300 78 350 Z" />
      <path d="M82 350 C85 300 88 260 90 230 C95 260 110 300 115 350 Z" />
      <path d="M30 355 C40 310 55 270 70 230 C58 270 42 310 30 355 Z" />
      <path d="M130 355 C120 310 105 270 90 230 C102 270 118 310 130 355 Z" />
      <rect x="62" y="222" width="36" height="8" rx="2" />
      <path d="M66 222 L70 85 L90 85 L94 222 Z" />
      <rect x="65" y="78" width="30" height="7" rx="2" />
      <path d="M68 78 L72 50 L88 50 L92 78 Z" />
      <rect x="69" y="47" width="22" height="4" rx="1" />
      <path d="M71 47 C71 30 89 30 89 47 Z" />
      <line
        x1="80"
        y1="30"
        x2="80"
        y2="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="80" cy="8" r="3" />
    </svg>
  )
}

function AcademicCapBooksIllustration() {
  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Dot matrix pattern background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 -left-6 -z-10 grid grid-cols-6 gap-2 text-emerald-300/40"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400/30" />
        ))}
      </div>

      {/* Top Editorial Handwriting */}
      <div className="mb-2 self-end pr-1 text-right">
        <span
          className="inline-block -rotate-6 text-base font-bold text-emerald-700 sm:text-lg"
          style={{ fontFamily: 'var(--font-caveat), cursive' }}
        >
          Education Builds
          <br />
          Brighter Futures
        </span>
      </div>

      {/* 3D Cap & Books Vector Illustration */}
      <svg
        width="190"
        height="145"
        viewBox="0 0 200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md transition-transform duration-300 hover:scale-105"
        aria-hidden="true"
      >
        <ellipse cx="100" cy="142" rx="65" ry="7" fill="#007054" fillOpacity="0.12" />

        {/* BOTTOM BOOK (Dark Green Cover) */}
        <path d="M48 126 L152 118 L154 130 L50 138 Z" fill="#F8FAFC" />
        <path d="M152 118 L168 124 L168 134 L154 130 Z" fill="#E2E8F0" />
        <line x1="53" y1="131" x2="152" y2="123" stroke="#CBD5E1" strokeWidth="0.8" />
        <line x1="53" y1="134" x2="153" y2="126" stroke="#CBD5E1" strokeWidth="0.8" />
        <path
          d="M44 126 C44 126 44 140 48 141 C52 142 156 133 156 133 L154 130 L50 138 C47 138 46 132 46 126 Z"
          fill="#004D3A"
        />
        <path d="M44 126 L150 117 L168 124 L58 133 Z" fill="#005B44" />
        <path d="M156 133 L172 127 L168 124 L154 130 Z" fill="#004D3A" />

        {/* TOP BOOK (White/Mint Cover) */}
        <path d="M52 108 L148 101 L150 114 L54 121 Z" fill="#FFFFFF" />
        <path d="M148 101 L164 107 L164 118 L150 114 Z" fill="#E2E8F0" />
        <line x1="56" y1="113" x2="148" y2="106" stroke="#E2E8F0" strokeWidth="0.8" />
        <line x1="56" y1="117" x2="149" y2="110" stroke="#E2E8F0" strokeWidth="0.8" />
        <path
          d="M48 108 C48 108 48 122 52 123 C56 124 152 116 152 116 L150 114 L54 121 C51 121 50 115 50 108 Z"
          fill="#0F766E"
        />
        <path d="M48 108 L146 100 L164 107 L62 115 Z" fill="#E6F4EE" />
        <path d="M152 116 L168 110 L164 107 L150 114 Z" fill="#0D5F58" />

        {/* MORTARBOARD SKULL CAP */}
        <path d="M78 58 C78 58 78 82 100 82 C122 82 122 58 122 58 Z" fill="#004D3A" />
        <path d="M78 62 C85 75 115 75 122 62 L120 72 C115 80 85 80 80 72 Z" fill="#003D2E" />

        {/* DIAMOND BOARD */}
        <polygon
          points="100,24 156,48 100,70 44,48"
          fill="#005B44"
          stroke="#007054"
          strokeWidth="1.5"
        />
        <polygon points="44,48 100,70 100,73 44,51" fill="#004030" />
        <polygon points="100,70 156,48 156,51 100,73" fill="#003326" />

        {/* BUTTON & TASSEL */}
        <ellipse cx="100" cy="47" rx="3.5" ry="2" fill="#10B981" />
        <path
          d="M100 47 C112 49 130 54 135 68 C137 73 138 85 137 92"
          stroke="#34D399"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="137" cy="92" rx="2.5" ry="1.5" fill="#059669" />
        <polygon points="134,93 140,93 142,106 132,106" fill="#10B981" />
      </svg>

      {/* Slogan under illustration */}
      <div className="mt-1 text-center">
        <span className="block text-[9px] font-black tracking-[0.25em] text-slate-500 uppercase">
          RESULTS
        </span>
        <span className="block text-[9px] font-black tracking-[0.2em] text-slate-700 uppercase">
          FOR A BRIGHTER
        </span>
        <span className="block text-[10px] font-black tracking-[0.25em] text-[#007054] uppercase">
          PAKISTAN
        </span>
        <svg
          className="mx-auto mt-0.5 h-1.5 w-16 text-emerald-500/70"
          viewBox="0 0 60 6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 4 C20 1 40 1 58 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}

export function CurrentStatusSection({ lastVerifiedAt = '2026-09-14' }: CurrentStatusSectionProps) {
  const verifiedDateDisplay = formatVerifiedDate(lastVerifiedAt)

  return (
    <section
      aria-labelledby="current-status-heading"
      className="relative overflow-hidden bg-[#FAFCFB] py-14 sm:py-18 lg:py-22"
    >
      {/* Minar-e-Pakistan watermark silhouette on left */}
      <MinarPakistanWatermark />

      {/* Ambient background mint glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-1/4 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/3 h-72 w-72 rounded-full bg-teal-100/30 blur-3xl"
      />

      <div className="container-wide relative z-10">
        <div className="mx-auto max-w-6xl">
          {/* Top Header Row: Left Text Content + Right 3D Cap Illustration */}
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
            {/* Left Header & Paragraphs */}
            <div className="max-w-2xl text-left">
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
                <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
                  CURRENT RESULT STATUS
                </span>
              </div>

              {/* Heading */}
              <h2
                id="current-status-heading"
                className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
              >
                12th Class Result 2026 &mdash; Current Status
              </h2>

              {/* Green Underline Bar */}
              <div className="mt-3.5 h-1 w-12 rounded-full bg-[#007054]" />

              {/* Description Paragraphs */}
              <div className="mt-4.5 space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                <p>
                  The 12th Class Result 2026 is announced separately by education boards and
                  examination authorities across Pakistan. There is no single result date or
                  availability status that automatically applies to every board.
                </p>
                <p>
                  Select your board to see its latest available status, result method and Gazette
                  availability. Where an official announcement has not yet been verified, clearly
                  distinguish between confirmed, tentative, expected and awaiting-announcement
                  information.
                </p>
              </div>
            </div>

            {/* Right Academic Illustration Block */}
            <div className="hidden shrink-0 lg:block">
              <AcademicCapBooksIllustration />
            </div>
          </div>

          {/* White Card with 8 Feature Blocks + Notification Bar */}
          <div className="mt-9 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            {/* 8 Feature Blocks Grid (4 columns x 2 rows) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4">
              {/* 1: CLASS */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-[#F9FBFA] p-3.5 text-left transition-all hover:border-emerald-200 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <GraduationCapIcon width={20} height={20} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    CLASS
                  </span>
                  <span className="mt-0.5 block text-xs font-black text-slate-900 sm:text-sm">
                    12th Class / HSSC Part-II
                  </span>
                </div>
              </div>

              {/* 2: ALSO KNOWN AS */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-[#F9FBFA] p-3.5 text-left transition-all hover:border-emerald-200 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <FileTextIcon width={20} height={20} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    ALSO KNOWN AS
                  </span>
                  <span className="mt-0.5 block text-xs font-black text-slate-900 sm:text-sm">
                    2nd Year / Intermediate Part-II
                  </span>
                </div>
              </div>

              {/* 3: COVERAGE */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-[#F9FBFA] p-3.5 text-left transition-all hover:border-emerald-200 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <LandmarkIcon width={20} height={20} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    COVERAGE
                  </span>
                  <span className="mt-0.5 block text-xs font-black text-slate-900 sm:text-sm">
                    Pakistan Education Boards
                  </span>
                </div>
              </div>

              {/* 4: EXAMINATIONS */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-[#F9FBFA] p-3.5 text-left transition-all hover:border-emerald-200 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <ExamListIcon width={20} height={20} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    EXAMINATIONS
                  </span>
                  <span className="mt-0.5 block text-xs font-black text-slate-900 sm:text-sm">
                    First Annual / Second Annual where applicable
                  </span>
                </div>
              </div>

              {/* 5: RESULT LOOKUP */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-[#F9FBFA] p-3.5 text-left transition-all hover:border-emerald-200 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <SearchIcon width={20} height={20} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    RESULT LOOKUP
                  </span>
                  <span className="mt-0.5 block text-xs font-black text-slate-900 sm:text-sm">
                    Board dependent
                  </span>
                </div>
              </div>

              {/* 6: GAZETTE LOOKUP */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-[#F9FBFA] p-3.5 text-left transition-all hover:border-emerald-200 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <FileTextIcon width={20} height={20} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    GAZETTE LOOKUP
                  </span>
                  <span className="mt-0.5 block text-xs font-black text-slate-900 sm:text-sm">
                    Available where a validated dataset exists
                  </span>
                </div>
              </div>

              {/* 7: LAST VERIFIED */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-[#F9FBFA] p-3.5 text-left transition-all hover:border-emerald-200 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <CalendarIcon width={20} height={20} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    LAST VERIFIED
                  </span>
                  <span className="mt-0.5 block text-xs font-black text-slate-900 sm:text-sm">
                    {verifiedDateDisplay}
                  </span>
                </div>
              </div>

              {/* 8: HIGHLIGHTED CARD - Official Primary Sources Only */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-300/80 bg-[#EFF9F4] p-3.5 text-left shadow-2xs transition-all hover:border-emerald-400 sm:p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                  <ShieldCheckIcon width={20} height={20} />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-black text-[#007054] sm:text-sm">
                    Official Primary Sources Only
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row / CTA */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row">
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <BellIcon width={18} height={18} />
                </div>
                <p className="text-xs text-slate-600 sm:text-sm">
                  Official notifications and verified Gazette availability are continuously
                  monitored.
                </p>
              </div>

              <Link
                href="/results/12th-class"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#007054] px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#005842] active:scale-[0.98] sm:w-auto sm:text-sm"
              >
                <span>View Result Dates &amp; Status</span>
                <ArrowRightIcon width={16} height={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'

import {
  ArrowRightIcon,
  BarChartIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  FileTextIcon,
  LandmarkIcon,
  ShieldCheckIcon,
  ZapIcon,
} from '@/components/ui/icons'

function StethoscopeIcon({
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
      <path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3" />
      <path d="M6 3h-3" />
      <path d="M15 3h-3" />
      <path d="M9 12.5v2.5a5 5 0 0 0 10 0V11" />
      <circle cx="19" cy="10" r="2" />
    </svg>
  )
}

function GearIcon({
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function LaptopIcon({
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
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}

function AtomIcon({
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
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(150 12 12)" />
    </svg>
  )
}

function GraduationCapIcon({
  width = 22,
  height = 22,
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
function LaptopSearchIcon({
  width = 24,
  height = 24,
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
      <circle cx="12" cy="10" r="2.5" />
      <line x1="13.8" y1="11.8" x2="16" y2="14" />
    </svg>
  )
}

function ChatDotsIcon({
  width = 24,
  height = 24,
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="8.5" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="15.5" cy="10" r="1" fill="currentColor" />
    </svg>
  )
}

function PdfDocumentIcon({
  width = 24,
  height = 24,
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <text
        x="6.5"
        y="17"
        fontSize="6.2"
        fontWeight="800"
        fontFamily="sans-serif"
        fill="currentColor"
        stroke="none"
        letterSpacing="-0.2px"
      >
        PDF
      </text>
    </svg>
  )
}

function CertificateSealIcon({
  width = 24,
  height = 24,
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="15" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="13" y2="10" />
      <circle cx="16" cy="18" r="3.2" />
      <path d="M14.5 20.8L13 23l1.2-3" />
      <path d="M17.5 20.8L19 23l-1.2-3" />
    </svg>
  )
}

function MinarSkyline() {
  return (
    <svg
      width="84"
      height="26"
      viewBox="0 0 120 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-400/40"
      aria-hidden="true"
    >
      <path d="M5 38h110" />
      <path d="M15 38v-8c0-2 2-3 4-3s4 1 4 3v8" />
      <path d="M30 38v-12c0-4 4-6 8-6s8 2 8 6v12" />
      <path d="M68 38l2-26h2l2 26" />
      <path d="M67 24h8" />
      <path d="M69 12v-6l1-2 1 2v6" />
      <circle cx="71" cy="4" r="1.5" />
      <path d="M85 38v-9c0-3 3-4 6-4s6 1 6 4v9" />
      <path d="M102 38v-6c0-2 2-3 4-3s4 1 4 3v6" />
    </svg>
  )
}

const ACADEMIC_STREAMS = [
  {
    name: 'FSc Pre-Medical',
    icon: StethoscopeIcon,
    description:
      'Physics, Chemistry, Biology — Mandatory prerequisite for medical colleges (MBBS/BDS) and allied health sciences via MDCAT.',
  },
  {
    name: 'FSc Pre-Engineering',
    icon: GearIcon,
    description:
      'Physics, Chemistry, Mathematics — Required gateway for engineering universities, computing programs, and technology institutes via ECAT.',
  },
  {
    name: 'ICS (Computer Science)',
    icon: LaptopIcon,
    description:
      'Computer Science, Mathematics, Physics/Statistics — Standard track for software engineering, BS Computer Science, AI, and IT degrees.',
  },
  {
    name: 'I.Com (Commerce)',
    icon: BarChartIcon,
    description:
      'Accounting, Banking, Commercial Geography — Foundation for BBA, BS Accounting & Finance, CA, ACCA, and business management.',
  },
  {
    name: 'FA (Humanities / Arts)',
    icon: BookOpenIcon,
    description:
      'Economics, Political Science, Psychology, Languages — Gateway to Law (LLB), social sciences, public administration, and civil services.',
  },
  {
    name: 'General Science',
    icon: AtomIcon,
    description:
      'Mathematics, Statistics, Economics — Preferred preparation for data science, actuarial science, analytics, and economics.',
  },
]

export function SemanticContentSections() {
  return (
    <div className="relative border-b border-slate-200/80 bg-white py-16 sm:py-20">
      <div className="container-wide">
        <div className="mx-auto max-w-6xl space-y-16 lg:space-y-20">
          {/* ========================================================================= */}
          {/* SECTION 1: WHAT IS 12TH CLASS / 2ND YEAR / HSSC PART-II?                   */}
          {/* ========================================================================= */}
          <article
            id="about-12th-class"
            aria-labelledby="heading-what-is-12th"
            className="relative"
          >
            {/* Right side dot matrix pattern */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-4 -right-2 hidden grid-cols-4 gap-2 text-emerald-300/40 select-none lg:grid"
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400/30" />
              ))}
            </div>

            {/* Header Area */}
            <div className="mx-auto max-w-3xl text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center justify-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
                <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
                  ACADEMIC FRAMEWORK &amp; EQUIVALENCE
                </span>
              </div>

              {/* Heading */}
              <h2
                id="heading-what-is-12th"
                className="mt-3.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[36px] lg:leading-tight"
              >
                What is 12th Class, 2nd Year &amp;{' '}
                <span className="text-[#007054]">HSSC Part-II?</span>
              </h2>

              {/* Paragraphs */}
              <div className="mt-4.5 space-y-3.5 text-xs leading-relaxed text-slate-600 sm:text-sm md:text-[14.5px]">
                <p>
                  In Pakistan&apos;s national secondary education framework,{' '}
                  <strong>12th Class</strong>, <strong>2nd Year</strong>,{' '}
                  <strong>Intermediate Part-II</strong>, and{' '}
                  <strong>HSSC Part-II (Higher Secondary School Certificate Part-II)</strong> refer
                  to the concluding grade of intermediate schooling. Following the 11th Class (First
                  Year) examinations, 12th Class represents the definitive academic milestone that
                  determines a student&apos;s cumulative intermediate score, division, and
                  eligibility for higher education.
                </p>
                <p>
                  All 24+ Boards of Intermediate and Secondary Education (BISE) across Punjab,
                  Khyber Pakhtunkhwa (KPK), Sindh, Balochistan, Azad Jammu &amp; Kashmir (AJK), and
                  the Federal Board (FBISE Islamabad) administer this examination annually across
                  major study streams:
                </p>
              </div>
            </div>

            {/* Stream Breakdown Cards (3 columns x 2 rows) */}
            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ACADEMIC_STREAMS.map((stream) => {
                const Icon = stream.icon
                return (
                  <div
                    key={stream.name}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-emerald-300 hover:shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054] shadow-2xs">
                            <Icon width={20} height={20} />
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900">{stream.name}</h3>
                        </div>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
                          <ArrowRightIcon width={13} height={13} />
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                        {stream.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Callout Banner */}
            <div className="relative mt-7 flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-emerald-200/90 bg-[#EAF7F1]/80 p-4.5 text-left shadow-2xs sm:flex-row sm:p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100/90 text-[#007054] shadow-2xs">
                <GraduationCapIcon width={24} height={24} />
              </div>

              <div className="hidden h-10 w-px shrink-0 bg-emerald-200 sm:block" />

              <p className="relative z-10 text-xs leading-relaxed font-medium text-slate-700 sm:text-sm">
                Because 12th Class aggregate marks carry decisive weight in university admissions,
                entry test merit lists, and overseas degree equivalencies via IBCC (Inter Board
                Coordination Commission), obtaining authentic, error-free result records is
                essential for every candidate.
              </p>

              {/* Faint graduation cap watermark on the right */}
              <svg
                viewBox="0 0 120 120"
                fill="currentColor"
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 text-emerald-600/[0.08] select-none"
              >
                <path d="M110 50v30M10 50l50-25 50 25-50 25z" />
                <path d="M30 60v25c15 15 45 15 60 0v-25" />
              </svg>
            </div>
          </article>

          {/* ========================================================================= */}
          {/* SECTION 2: HOW TO CHECK 12TH CLASS RESULT 2026 ACROSS PAKISTAN              */}
          {/* ========================================================================= */}
          <article
            id="how-to-check"
            aria-labelledby="heading-how-to-check"
            className="relative px-2 pt-12 pb-4"
          >
            {/* Top-Left Corner: Stacked Editorial Text with horizontal line */}
            <div className="pointer-events-none absolute top-2 left-1 hidden flex-col items-start select-none md:flex lg:left-3">
              <div className="flex flex-col text-[10px] leading-[1.6] font-bold tracking-[0.22em] text-slate-400/90 uppercase">
                <span>EDUCATION</span>
                <span>DISCIPLINE</span>
                <span>OPPORTUNITY</span>
                <span>A BRIGHTER</span>
                <span>PAKISTAN</span>
              </div>
              <span className="mt-2.5 h-0.5 w-7 bg-emerald-600/50" />
            </div>

            {/* Top-Right Corner: Tilted Cursive "Your Future Counts" */}
            <div className="pointer-events-none absolute top-1 right-2 hidden flex-col items-end select-none md:flex lg:right-5">
              <span
                className="inline-block -rotate-12 text-2xl font-bold text-slate-400/80 sm:text-3xl"
                style={{ fontFamily: 'var(--font-caveat), cursive' }}
              >
                Your
                <br />
                Future
                <br />
                Counts
              </span>
            </div>

            {/* Centered Section Header */}
            <div className="mx-auto max-w-4xl text-center">
              {/* Eyebrow flanked by horizontal lines */}
              <div className="inline-flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-emerald-600/40 sm:w-14" />
                <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
                <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase sm:text-xs">
                  STEP-BY-STEP EXAMINATION ACCESS
                </span>
                <span className="h-px w-8 bg-emerald-600/40 sm:w-14" />
              </div>

              {/* Main Heading H2 */}
              <h2
                id="heading-how-to-check"
                className="mt-3.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-snug"
              >
                How to Check <span className="text-[#007054]">12th Class Result 2026</span> Across
                Pakistan
              </h2>

              {/* Subtitle / Intro paragraph */}
              <p className="mx-auto mt-3.5 max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm md:text-[14px]">
                Intermediate students in Pakistan can access their 2nd year results through four
                primary channels. Depending on whether your board has published a complete digital
                Gazette or relies on an online database server, use the method best suited to your
                needs.
              </p>
            </div>

            {/* 4 Numbered Cards in a 2x2 Grid */}
            <div className="mt-9 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
              {/* Card 1: Online Roll Number Lookup (Web & Verified Gazette) */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all duration-200 hover:border-emerald-300 hover:shadow-xs">
                {/* Large Ghost Watermark Number in Top-Right */}
                <div className="pointer-events-none absolute top-3 right-6 text-3xl font-black tracking-tighter text-slate-200/70 select-none sm:text-4xl">
                  01
                </div>

                <div className="flex items-start gap-4 sm:gap-5">
                  {/* Left Column: Number Circle + Icon Squircle stacked vertically */}
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    {/* Dark Emerald Number Circle */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#007054] text-base font-black text-white shadow-xs">
                      1
                    </div>
                    {/* Pastel Mint Squircle with Icon */}
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#e8f6f0] text-[#007054]">
                      <LaptopSearchIcon width={24} height={24} />
                    </div>
                  </div>

                  {/* Right Column: Title + Description */}
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                      Online Roll Number Lookup
                      <br className="hidden sm:inline" /> (Web &amp; Verified Gazette)
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      The most rapid and accurate method. Select your respective board, choose the
                      2026 Annual Examination, and input your official 6-digit roll number. Where a
                      verified board Gazette has been ingested, you can retrieve your marks even
                      when the board&apos;s main website is overloaded.
                    </p>

                    <div className="mt-4 pt-1">
                      <Link
                        href="#check-result"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-colors group-hover:gap-2 hover:text-[#005a43] hover:underline"
                      >
                        <span>Check Result Online</span>
                        <ArrowRightIcon width={13} height={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Official Board SMS Shortcode Service */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all duration-200 hover:border-emerald-300 hover:shadow-xs">
                {/* Large Ghost Watermark Number in Top-Right */}
                <div className="pointer-events-none absolute top-3 right-6 text-3xl font-black tracking-tighter text-slate-200/70 select-none sm:text-4xl">
                  02
                </div>

                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#007054] text-base font-black text-white shadow-xs">
                      2
                    </div>
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#e8f6f0] text-[#007054]">
                      <ChatDotsIcon width={24} height={24} />
                    </div>
                  </div>

                  <div className="flex-1 pt-0.5">
                    <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                      Official Board SMS Shortcode Service
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      For students in remote areas without stable internet connections on result
                      morning, each intermediate board operates a designated SMS gateway. Type your
                      roll number in an SMS message and send it to your board&apos;s verified SMS
                      code where officially announced. Because shortcode availability varies by
                      telecom carrier and examination cycle, always confirm the designated code
                      directly on your individual board directory page.
                    </p>

                    <div className="mt-4 pt-1">
                      <Link
                        href="#check-result"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-colors group-hover:gap-2 hover:text-[#005a43] hover:underline"
                      >
                        <span>View SMS Codes</span>
                        <ArrowRightIcon width={13} height={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Downloadable Official Gazette (PDF Archive) */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all duration-200 hover:border-emerald-300 hover:shadow-xs">
                {/* Large Ghost Watermark Number in Top-Right */}
                <div className="pointer-events-none absolute top-3 right-6 text-3xl font-black tracking-tighter text-slate-200/70 select-none sm:text-4xl">
                  03
                </div>

                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#007054] text-base font-black text-white shadow-xs">
                      3
                    </div>
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#e8f6f0] text-[#007054]">
                      <PdfDocumentIcon width={24} height={24} />
                    </div>
                  </div>

                  <div className="flex-1 pt-0.5">
                    <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                      Downloadable Official Gazette
                      <br className="hidden sm:inline" /> (PDF Archive)
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      The Gazette is the official comprehensive document released on CD and PDF
                      format by each board&apos;s Controller of Examinations. It catalogues all
                      candidate roll numbers, student names, subject marks, and pass/fail standings.
                      You can search within the Gazette by pressing{' '}
                      <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        Ctrl + F
                      </kbd>{' '}
                      on desktop or using the PDF viewer search bar on mobile.
                    </p>

                    <div className="mt-4 pt-1">
                      <Link
                        href="/boards"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-colors group-hover:gap-2 hover:text-[#005a43] hover:underline"
                      >
                        <span>Browse Gazette</span>
                        <ArrowRightIcon width={13} height={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Official Board Portal & Detailed Marks Certificate (DMC) */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all duration-200 hover:border-emerald-300 hover:shadow-xs">
                {/* Large Ghost Watermark Number in Top-Right */}
                <div className="pointer-events-none absolute top-3 right-6 text-3xl font-black tracking-tighter text-slate-200/70 select-none sm:text-4xl">
                  04
                </div>

                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#007054] text-base font-black text-white shadow-xs">
                      4
                    </div>
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#e8f6f0] text-[#007054]">
                      <CertificateSealIcon width={24} height={24} />
                    </div>
                  </div>

                  <div className="flex-1 pt-0.5">
                    <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                      Official Board Portal &amp; Detailed Marks Certificate (DMC)
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      While Gazette entries confirm pass/fail marks and grade breakdowns, students
                      who require an authenticated physical DMC or e-result card for university
                      admissions must download it directly from the board&apos;s official portal
                      using the verified direct links provided across our board directories.
                    </p>

                    <div className="mt-4 pt-1">
                      <Link
                        href="/boards"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-colors group-hover:gap-2 hover:text-[#005a43] hover:underline"
                      >
                        <span>Get Your DMC</span>
                        <ArrowRightIcon width={13} height={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Banner */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-100/80 bg-[#f0f9f5] px-5 py-3.5 shadow-2xs sm:flex-row">
              {/* Left Side: Cap Icon + Vertical Divider + Motto */}
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#007054] shadow-2xs">
                  <GraduationCapIcon width={22} height={22} />
                </div>
                <span className="hidden h-7 w-px bg-emerald-200/80 sm:block" />
                <div>
                  <p className="text-xs font-extrabold text-[#007054] sm:text-[13px]">
                    Same Results. A Brighter Tomorrow.
                  </p>
                  <p className="text-[11px] text-slate-500 sm:text-xs">
                    Trusted information. A stronger, smarter Pakistan.
                  </p>
                </div>
              </div>

              {/* Right Side: Skyline Silhouette + Knowledge Builds Nations */}
              <div className="flex items-center gap-3.5 select-none">
                <MinarSkyline />
                <div className="flex flex-col text-right text-[9px] leading-tight font-black tracking-[0.18em] text-slate-400 uppercase sm:text-[10px]">
                  <span>KNOWLEDGE</span>
                  <span>BUILDS</span>
                  <span>NATIONS</span>
                </div>
              </div>
            </div>
          </article>

          {/* ========================================================================= */}
          {/* SECTION 3: HOW GAZETTE LOOKUP & ARCHITECTURE WORKS                         */}
          {/* ========================================================================= */}
          <article id="gazette-architecture" aria-labelledby="heading-gazette-architecture">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#007054] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
              <span>FAILOVER INFRASTRUCTURE &amp; FIDELITY</span>
            </div>

            <h2
              id="heading-gazette-architecture"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
            >
              How Verified <span className="text-[#007054]">Gazette Lookup</span> Works
            </h2>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm md:text-[15px] md:leading-relaxed">
              <p>
                On result announcement morning, over 1.5 million intermediate students
                simultaneously access education board websites across Pakistan. This massive traffic
                surge frequently causes official board servers to crash or become unresponsive for
                hours.
              </p>
              <p>
                <strong>12thClassResult.com.pk</strong> was built with a specialized{' '}
                <em>Gazette-First Architecture</em> designed to solve this exact bottleneck. Here is
                how our verification pipeline operates:
              </p>

              <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-[#EDF8F5] p-4.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007054] text-white shadow-2xs">
                    <FileTextIcon width={18} height={18} />
                  </div>
                  <h3 className="mt-3 font-extrabold text-slate-900">
                    1. Sealed Gazette Ingestion
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Official gazette PDFs published by education boards are captured directly upon
                    release and cryptographically verified against board signatures.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-[#EDF8F5] p-4.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007054] text-white shadow-2xs">
                    <ZapIcon width={18} height={18} />
                  </div>
                  <h3 className="mt-3 font-extrabold text-slate-900">2. Deterministic Parsing</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Records are processed into structured index tables without modifying a single
                    character of candidate marks, names, grades, or board remarks.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-[#EDF8F5] p-4.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007054] text-white shadow-2xs">
                    <ShieldCheckIcon width={18} height={18} />
                  </div>
                  <h3 className="mt-3 font-extrabold text-slate-900">3. Edge-Cached Delivery</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    When official websites crash under load, candidates can query their roll number
                    against our globally distributed edge cache in under 50 milliseconds.
                  </p>
                </div>
              </div>

              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
                <strong className="text-slate-900">Privacy &amp; Data Ethics:</strong> We do not ask
                for student phone numbers, CNIC, or passwords. Roll numbers are queried strictly to
                retrieve public examination records published in the official gazette.
              </div>
            </div>
          </article>

          {/* ========================================================================= */}
          {/* SECTION 4: RESULT DATE SCHEDULE & BOARD STATUS 2026                       */}
          {/* ========================================================================= */}
          <article id="date-schedule" aria-labelledby="heading-date-schedule">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#007054] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
              <span>TIMELINE &amp; PROVINCIAL COORDINATION</span>
            </div>

            <h2
              id="heading-date-schedule"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
            >
              12th Class Result Date &amp;{' '}
              <span className="text-[#007054]">Board Schedule 2026</span>
            </h2>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm md:text-[15px] md:leading-relaxed">
              <p>
                A common misconception among students is that all education boards in Pakistan
                announce their 12th class results on the exact same date. In reality, announcement
                dates are determined by provincial coordination committees and board autonomy:
              </p>

              {/* Provincial Coordination Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
                <table className="w-full min-w-[540px] text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 font-extrabold text-slate-900">
                    <tr>
                      <th className="p-3.5 sm:p-4">Province / Board Group</th>
                      <th className="p-3.5 sm:p-4">Key Boards Included</th>
                      <th className="p-3.5 sm:p-4">Announcement Protocol</th>
                      <th className="p-3.5 sm:p-4">Expected Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">Punjab Boards</td>
                      <td className="p-3.5 sm:p-4">
                        Lahore, Gujranwala, Rawalpindi, Multan, Faisalabad, Sargodha, Sahiwal,
                        Bahawalpur, DG Khan
                      </td>
                      <td className="p-3.5 sm:p-4">
                        Unified PBCC Decision (Simultaneous 10:00 AM)
                      </td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: October 2026
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">
                        Federal Board (FBISE)
                      </td>
                      <td className="p-3.5 sm:p-4">
                        Islamabad, Cantonments, Overseas Pakistan Schools
                      </td>
                      <td className="p-3.5 sm:p-4">Autonomous Federal Ministry Notification</td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: August / September 2026
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">KPK Boards</td>
                      <td className="p-3.5 sm:p-4">
                        Peshawar, Abbottabad, Mardan, Swat, Malakand, Kohat, Bannu, DI Khan
                      </td>
                      <td className="p-3.5 sm:p-4">KPK Boards Committee Unified or Staggered</td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: September 2026
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">Sindh Boards</td>
                      <td className="p-3.5 sm:p-4">
                        BIEK Karachi, Hyderabad, Sukkur, Larkana, Mirpurkhas, SBA Nawabshah
                      </td>
                      <td className="p-3.5 sm:p-4">
                        Stream-wise (Pre-Medical &amp; Pre-Engineering first)
                      </td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: September – October 2026
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">Balochistan Board</td>
                      <td className="p-3.5 sm:p-4">BISE Quetta</td>
                      <td className="p-3.5 sm:p-4">Provincial Notification</td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: September 2026
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-600">
                We monitor official gazettes and controller press releases continuously. Confirmed
                dates are published strictly with direct citations to official board notifications.
              </p>
            </div>
          </article>

          {/* ========================================================================= */}
          {/* SECTION 5: WHY TRUST OUR RESULT DATA?                                     */}
          {/* ========================================================================= */}
          <article id="why-trust-us" aria-labelledby="heading-why-trust">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#007054] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
              <span>EDITORIAL GOVERNANCE &amp; ACCURACY</span>
            </div>

            <h2
              id="heading-why-trust"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
            >
              Why Trust Our <span className="text-[#007054]">Result Data?</span>
            </h2>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm md:text-[15px] md:leading-relaxed">
              <p>
                In an ecosystem often plagued by unverified rumors, speculative result dates, and
                clickbait headlines, <strong>12thClassResult.com.pk</strong> operates under a
                strict, transparent editorial standard:
              </p>

              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                <div className="flex gap-3 rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                    <CheckCircle2Icon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">Zero Speculation Policy</h3>
                    <p className="mt-1 text-xs text-slate-600">
                      We never publish &ldquo;breaking news&rdquo; about result dates unless
                      substantiated by an official press notification signed by the board&apos;s
                      Controller of Examinations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                    <ShieldCheckIcon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Deterministic Gazette Fidelity
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                      When checking a roll number against our local gazette database, the output is
                      an exact cryptographic replica of the board&apos;s physical gazette
                      publication.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                    <LandmarkIcon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Transparent Official Fallbacks
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                      If a board&apos;s gazette dataset has not yet been processed or verified, we
                      never show fake results; instead, we provide direct, secure links to the
                      official board portal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                    <BookOpenIcon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">Post-Result Academic Guidance</h3>
                    <p className="mt-1 text-xs text-slate-600">
                      Beyond raw marks, we publish comprehensive verified guides for paper
                      rechecking, marks percentage calculation, second annual improvements, and
                      university entry exams.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
                <span className="font-medium text-slate-500">
                  Have questions regarding result verification protocols?
                </span>
                <Link
                  href="/methodology"
                  className="font-bold text-[#007054] underline underline-offset-4 hover:text-[#005a43]"
                >
                  Read Our Full Verification Methodology &rarr;
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

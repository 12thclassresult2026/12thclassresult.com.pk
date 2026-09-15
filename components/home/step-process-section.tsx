import Link from 'next/link'

import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  FileTextIcon,
  SearchIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons'

/**
 * 4-Step Process Data matching the verified educational workflow.
 * Uses exact user-specified color palette:
 * - Soft blue: #4EA3FF
 * - Soft green: #31B77A
 * - Soft purple: #8E7CFF
 * - Soft orange: #F4A261
 */
const STEPS = [
  {
    number: '01',
    title: 'Select Your Board',
    actionText: 'Board Finder',
    href: '#board-cards-grid',
    description:
      'Choose your intermediate board (e.g. BISE Lahore, Gujranwala, Rawalpindi or Multan) in the finder above.',
    icon: SearchIcon,
    accentColor: '#4EA3FF',
    gradient: 'from-[#4EA3FF] to-[#2563EB]',
    numColor: 'text-[#4EA3FF]/40',
    iconBg: 'bg-[#EEF6FF]',
    iconRing: 'ring-[#D6EBFF]',
    iconColor: 'text-[#4EA3FF]',
    btnStyle: 'bg-[#EEF6FF] text-[#2563EB] border-[#D6EBFF] hover:bg-[#D6EBFF]',
  },
  {
    number: '02',
    title: 'Open Its Result Guide',
    actionText: 'Official Schedule',
    href: '/results/12th-class/2026/date',
    description:
      'Each guide records what that board’s own form asks for, which sessions its portal carries, and whether the 2026 result has been declared.',
    icon: CalendarIcon,
    accentColor: '#31B77A',
    gradient: 'from-[#31B77A] to-[#289371]',
    numColor: 'text-[#31B77A]/40',
    iconBg: 'bg-[#EBF9F3]',
    iconRing: 'ring-[#B4D5CC]',
    iconColor: 'text-[#289371]',
    btnStyle: 'bg-[#EBF9F3] text-[#289371] border-[#B4D5CC] hover:bg-[#DDF4EA]',
  },
  {
    number: '03',
    title: 'Go To The Official Portal',
    actionText: 'Verified Direct Link',
    href: '#sms-codes',
    description:
      'The guide links the board’s own verified result page. Keep your roll number slip to hand — the number is printed on it.',
    icon: FileTextIcon,
    accentColor: '#8E7CFF',
    gradient: 'from-[#8E7CFF] to-[#6366F1]',
    numColor: 'text-[#8E7CFF]/40',
    iconBg: 'bg-[#F4F1FF]',
    iconRing: 'ring-[#E4DCFF]',
    iconColor: 'text-[#8E7CFF]',
    btnStyle: 'bg-[#F4F1FF] text-[#6366F1] border-[#E4DCFF] hover:bg-[#EBE5FF]',
  },
  {
    number: '04',
    title: 'Look It Up On Board’s Site',
    actionText: 'Official Marksheet',
    href: '/results/12th-class/2026/gazette',
    description:
      'Your roll number is entered on the board’s portal, never here. That is also where the statement of marks is issued and printed.',
    icon: CheckCircleIcon,
    accentColor: '#F4A261',
    gradient: 'from-[#F4A261] to-[#E76F2A]',
    numColor: 'text-[#F4A261]/40',
    iconBg: 'bg-[#FFF6EE]',
    iconRing: 'ring-[#FEDDC5]',
    iconColor: 'text-[#E76F2A]',
    btnStyle: 'bg-[#FFF6EE] text-[#E76F2A] border-[#FEDDC5] hover:bg-[#FFEBDC]',
  },
]

/**
 * 4-Step Process Guide Section.
 * Exact recreation according to user's specified palette & layout:
 * - Background off-white: #F3F8F7
 * - Primary dark heading: #0F1736
 * - Main green: #289371
 * - Soft mint green: #98C8B2
 * - Border/light mint: #B4D5CC
 * - Soft blue accent: #4EA3FF
 * - Soft green accent: #31B77A
 * - Soft purple accent: #8E7CFF
 * - Soft orange accent: #F4A261
 * - Muted paragraph text: #5F6B7A
 * - Faded Pakistan flag in top-right
 * - Skyline silhouettes at bottom
 * - Handwritten motivational side text ("Simple Steps" & "Get Your Result Now")
 */
export function StepProcessSection() {
  return (
    <section
      aria-labelledby="steps-heading"
      className="relative w-full overflow-hidden rounded-3xl border border-[#B4D5CC]/80 bg-[#F3F8F7] px-4 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      {/* ── Background Silhouette: Pakistan Flag Watermark (Top Right) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 -right-8 h-64 w-64 opacity-[0.07] select-none"
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full text-[#289371]"
        >
          {/* Pakistan Flag Crescent and Star Silhouette */}
          <circle cx="100" cy="100" r="90" fill="currentColor" opacity="0.2" />
          <path
            d="M110 40C70 40 40 70 40 110C40 150 70 180 110 180C140 180 165 162 175 135C165 145 150 150 135 150C100 150 75 125 75 90C75 65 90 45 110 40Z"
            fill="currentColor"
          />
          <polygon
            points="140,75 145,90 160,90 148,100 152,115 140,105 128,115 132,100 120,90 135,90"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ── Background Silhouette: Pakistan Heritage Skyline (Bottom) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-28 w-full opacity-[0.06] select-none"
      >
        <svg
          viewBox="0 0 1200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full object-cover text-[#289371]"
          preserveAspectRatio="none"
        >
          {/* Minar-e-Pakistan silhouette */}
          <path
            d="M120 120 L123 70 L125 30 L127 10 L129 30 L131 70 L134 120 Z"
            fill="currentColor"
          />
          <path d="M115 120 Q127 95 139 120 Z" fill="currentColor" />
          {/* Badshahi Mosque Domes */}
          <path d="M350 120 L350 90 Q370 65 390 90 L390 120 Z" fill="currentColor" />
          <path d="M380 120 L380 80 Q405 50 430 80 L430 120 Z" fill="currentColor" />
          <path d="M420 120 L420 90 Q440 65 460 90 L460 120 Z" fill="currentColor" />
          {/* Minarets */}
          <rect x="335" y="45" width="4" height="75" fill="currentColor" />
          <rect x="470" y="45" width="4" height="75" fill="currentColor" />
          {/* Faisal Mosque Islamabad */}
          <polygon points="750,120 800,50 850,120" fill="currentColor" />
          <rect x="740" y="35" width="3" height="85" fill="currentColor" />
          <rect x="857" y="35" width="3" height="85" fill="currentColor" />
          {/* Bab-e-Khyber */}
          <path
            d="M1020 120 L1020 85 L1035 85 L1035 70 L1075 70 L1075 85 L1090 85 L1090 120 Z"
            fill="currentColor"
          />
          <path d="M1045 120 L1045 95 Q1055 85 1065 95 L1065 120 Z" fill="#F3F8F7" />
        </svg>
      </div>

      {/* Top Left & Bottom Right Subtle Dot Matrix Decor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 left-4 hidden opacity-40 md:block"
      >
        <svg width="70" height="70" fill="none" viewBox="0 0 70 70">
          <pattern
            id="dot-matrix-step-1"
            x="0"
            y="0"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2.5" cy="2.5" r="1.5" fill="#98C8B2" />
          </pattern>
          <rect width="70" height="70" fill="url(#dot-matrix-step-1)" />
        </svg>
      </div>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-3xl text-center">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#B4D5CC] bg-white/90 px-4 py-1.5 text-xs font-black tracking-widest text-[#289371] uppercase shadow-xs backdrop-blur-xs">
          <span className="text-sm">📖</span>
          <span>Simple &amp; Official Process</span>
        </div>

        {/* Main Title with decorative highlight */}
        <h2
          id="steps-heading"
          className="mt-4 text-3xl leading-tight font-black tracking-tight text-[#0F1736] sm:text-4xl lg:text-[44px]"
        >
          Check Your 12th Class Result{' '}
          <span className="relative inline-block whitespace-nowrap">
            in <span className="text-[#4EA3FF]">4</span>{' '}
            <span className="relative text-[#289371]">
              Easy Steps
              {/* Decorative Underline Swoosh */}
              <svg
                aria-hidden="true"
                viewBox="0 0 170 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-2.5 left-0 w-full text-[#98C8B2]"
              >
                <path
                  d="M2.5 10C45 3.5 125 2.5 167.5 8"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#5F6B7A] sm:text-base">
          Follow this straightforward official procedure to look up your 12th class marks quickly,
          safely, and accurately.
        </p>

        {/* Hand-drawn Left Annotation: "Simple Steps" */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 -left-16 hidden -rotate-12 select-none xl:block"
        >
          <span className="block font-serif text-sm font-bold tracking-wide text-[#4EA3FF] italic">
            Simple
            <br />
            Steps
          </span>
          <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            className="-mt-1 ml-4 text-[#4EA3FF]"
          >
            <path
              d="M10 6C16 16 24 28 32 32M32 32L22 32M32 32L30 22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Hand-drawn Right Annotation: "Get Your Result Now" */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-12 -right-20 hidden rotate-6 select-none xl:block"
        >
          <span className="block font-serif text-sm font-bold tracking-wide text-[#4EA3FF] italic">
            Get Your
            <br />
            Result Now
          </span>
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            className="mt-1 text-[#4EA3FF]"
          >
            <path
              d="M12 6C18 18 28 28 34 36M34 36L36 24M34 36L22 34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ── 4 Step Cards Grid ──────────────────────────────────────── */}
      <div className="relative mt-12">
        {/* Desktop connecting line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 right-[12%] left-[12%] hidden h-0.5 bg-gradient-to-r from-[#4EA3FF]/30 via-[#31B77A]/30 to-[#F4A261]/30 lg:block"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-[#B4D5CC]/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#98C8B2] hover:shadow-xl hover:shadow-[#289371]/8"
              >
                {/* Gradient Accent Bar — top edge */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${step.gradient}`} />

                {/* Connecting Arrow for Desktop (between cards) */}
                {index < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 -right-3.5 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#B4D5CC] bg-white text-[#5F6B7A] shadow-md transition-transform group-hover:scale-110 lg:flex"
                  >
                    <ArrowRightIcon width={14} height={14} className="text-[#289371]" />
                  </div>
                )}

                {/* Card Main Content */}
                <div className="p-6 pt-5 text-center sm:p-7 sm:pt-6">
                  {/* Large step number */}
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center">
                    <span className={`text-3xl font-black ${step.numColor}`}>{step.number}</span>
                  </div>

                  {/* Central Circular Icon */}
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ring-4 transition-all duration-300 group-hover:scale-110 ${step.iconBg} ${step.iconRing}`}
                  >
                    {step.number === '04' ? (
                      /* Target Checkmark Icon for Step 04 */
                      <div className="relative flex items-center justify-center">
                        <CheckCircleIcon width={28} height={28} className={step.iconColor} />
                        {/* Accent ring dashes */}
                        <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-[#F4A261]/50" />
                      </div>
                    ) : (
                      <Icon width={28} height={28} className={step.iconColor} />
                    )}
                  </div>

                  {/* Step Title */}
                  <h3 className="mt-5 text-base font-bold text-[#0F1736] sm:text-lg">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-2.5 text-xs leading-relaxed text-[#5F6B7A] sm:text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Action Pill Link */}
                <div className="px-6 pt-2 pb-6 text-center sm:px-7 sm:pb-7">
                  <Link
                    href={step.href}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${step.btnStyle}`}
                  >
                    <span>{step.actionText}</span>
                    <span className="text-sm">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Student Note Trust Banner ───────────────────────────────── */}
      <div className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-[#B4D5CC] bg-white/90 shadow-sm backdrop-blur-xs">
        <div className="h-1 w-full bg-gradient-to-r from-[#98C8B2] via-[#289371] to-[#0F1736]" />
        <div className="flex flex-col items-center gap-3.5 p-4 px-6 text-center sm:flex-row sm:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#289371] text-white shadow-xs">
            <ShieldCheckIcon width={20} height={20} />
          </div>
          <p className="text-xs leading-relaxed text-[#5F6B7A] sm:text-sm">
            <strong className="font-bold text-[#0F1736]">Student Note:</strong> Roll numbers must be
            entered directly on your respective BISE portal. This ensures 100% official gazette
            verification.
          </p>
        </div>
      </div>
    </section>
  )
}

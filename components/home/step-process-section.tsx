import Link from 'next/link'

import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  FileTextIcon,
  SearchIcon,
} from '@/components/ui/icons'

const STEPS = [
  {
    stepNumber: '01',
    title: 'Select Your Board',
    actionText: 'Board Finder',
    href: '#boards',
    description:
      'Choose your intermediate board (e.g. BISE Lahore, Gujranwala, Rawalpindi or Multan) from the list.',
    icon: SearchIcon,
    pillBg: 'bg-[#2F80ED]',
    iconBg: 'bg-sky-50',
    iconBorder: 'border-sky-100',
    iconColor: 'text-[#2F80ED]',
    btnStyle: 'bg-sky-50/90 text-[#2F80ED] border-sky-200 hover:bg-sky-100',
    cornerBlob: (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 text-sky-400/20"
      >
        <path d="M0 0 C40 10 90 40 100 100 L100 0 Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    stepNumber: '02',
    title: 'Choose Year & Exam',
    actionText: 'Official Schedule',
    href: '/results/12th-class',
    description:
      'Select examination year 2026 and choose the Annual or 2nd Annual HSSC Part-II intermediate session.',
    icon: CalendarIcon,
    pillBg: 'bg-[#10B981]',
    iconBg: 'bg-emerald-50',
    iconBorder: 'border-emerald-100',
    iconColor: 'text-[#10B981]',
    btnStyle: 'bg-emerald-50/90 text-[#10B981] border-emerald-200 hover:bg-emerald-100',
    cornerBlob: (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 text-emerald-400/20"
      >
        <path d="M0 0 C40 10 90 40 100 100 L100 0 Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    stepNumber: '03',
    title: 'Enter Roll Number',
    actionText: 'Input Roll No',
    href: '/#check-result',
    description:
      'Input your candidate roll number to search matching verified Gazette datasets and board record archives.',
    icon: FileTextIcon,
    pillBg: 'bg-[#8B5CF6]',
    iconBg: 'bg-purple-50',
    iconBorder: 'border-purple-100',
    iconColor: 'text-[#8B5CF6]',
    btnStyle: 'bg-purple-50/90 text-[#8B5CF6] border-purple-200 hover:bg-purple-100',
    cornerBlob: (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 text-purple-400/20"
      >
        <path d="M0 0 C40 10 90 40 100 100 L100 0 Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    stepNumber: '04',
    title: 'View Verified Result or Fallback',
    actionText: 'Verified Marksheet',
    href: '/#check-result',
    description:
      'Inspect your verified Gazette record marks instantly. If local lookup is unavailable for your board, use the verified official portal fallback.',
    icon: CheckCircleIcon,
    pillBg: 'bg-[#F59E0B]',
    iconBg: 'bg-amber-50',
    iconBorder: 'border-amber-100',
    iconColor: 'text-[#F59E0B]',
    btnStyle: 'bg-amber-50/90 text-[#F59E0B] border-amber-200 hover:bg-amber-100',
    cornerBlob: (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 text-amber-400/20"
      >
        <path d="M0 0 C40 10 90 40 100 100 L100 0 Z" fill="currentColor" />
      </svg>
    ),
  },
]

export function StepProcessSection() {
  return (
    <section aria-labelledby="steps-heading" className="relative w-full">
      {/* ── Background Silhouette: Pakistan Flag Crescent & Star (Top Right) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-4 h-48 w-48 opacity-20 select-none lg:right-8"
      >
        <svg viewBox="0 0 200 200" fill="none" className="h-full w-full text-[#007054]">
          <circle cx="100" cy="100" r="90" fill="currentColor" opacity="0.12" />
          <path
            d="M115 35C70 35 35 70 35 115C35 160 70 195 115 195C148 195 175 174 186 144C175 155 158 162 142 162C103 162 75 131 75 92C75 64 91 43 115 35Z"
            fill="currentColor"
          />
          <polygon
            points="152,65 157,80 172,80 160,90 164,105 152,95 140,105 144,90 132,80 147,80"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ── Top Floating Handwritten Calligraphy ────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 left-2 hidden -rotate-6 select-none md:block"
      >
        <span className="font-serif text-base font-bold tracking-wide text-[#3B7E67]/80 italic lg:text-lg">
          Education
          <br />
          Builds a Brighter
          <br />
          Pakistan
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-6 hidden rotate-6 select-none md:block"
      >
        <span className="font-serif text-base font-bold tracking-wide text-[#3B7E67]/80 italic lg:text-lg">
          Your Result
          <br />
          Our Commitment
        </span>
      </div>

      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-3xl text-center">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-white/95 px-4 py-1.5 text-xs font-bold text-[#0F1736] shadow-xs backdrop-blur-xs">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#007054] text-white">
            <CheckIcon width={10} height={10} />
          </div>
          <span>Simple &amp; Official Process</span>
        </div>

        {/* Heading */}
        <h2
          id="steps-heading"
          className="mt-4 text-3xl font-black tracking-tight text-[#0F1736] sm:text-4xl lg:text-[44px] lg:leading-tight"
        >
          Check Your 12th Class Result
          <br className="hidden sm:inline" /> in{' '}
          <span className="relative inline-block whitespace-nowrap text-[#007054]">
            4 Easy Steps
            <svg
              aria-hidden="true"
              viewBox="0 0 170 14"
              fill="none"
              className="absolute -bottom-2 left-0 w-full text-[#10B981]"
            >
              <path
                d="M2.5 10C45 3.5 125 2.5 167.5 8"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-[#5F6B7A] sm:text-sm">
          Follow this simple and official procedure to check your 12th class marks quickly, safely,
          and accurately.
        </p>
      </div>

      {/* ── 4 Step Cards Grid ──────────────────────────────────────── */}
      <div className="relative mt-12">
        {/* Desktop Connecting Dotted Line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[10%] left-[10%] -z-0 hidden -translate-y-1/2 border-t-2 border-dashed border-emerald-200/70 lg:block"
        />

        <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.stepNumber} className="relative flex">
                <div className="group relative flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl hover:shadow-[#007054]/5">
                  {/* Decorative Corner Wave Shape */}
                  {step.cornerBlob}

                  <div>
                    {/* Top Row: STEP Tag */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-block rounded-full ${step.pillBg} px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-2xs`}
                      >
                        STEP {step.stepNumber}
                      </span>
                    </div>

                    {/* Circular Icon in Tinted Badge */}
                    <div
                      className={`mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full border ${step.iconBorder} ${step.iconBg} ${step.iconColor} shadow-2xs transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon width={26} height={26} />
                    </div>

                    {/* Step Title */}
                    <h3 className="mt-5 text-center text-base font-black text-[#0F1736] transition-colors group-hover:text-[#007054]">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="mt-2.5 text-center text-xs leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Action Pill Button */}
                  <div className="mt-6 text-center">
                    <Link
                      href={step.href}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold shadow-2xs transition-all duration-200 active:scale-95 ${step.btnStyle}`}
                    >
                      <span>{step.actionText}</span>
                      <ArrowRightIcon width={12} height={12} />
                    </Link>
                  </div>
                </div>

                {/* Connecting Arrow for Desktop (between cards) */}
                {index < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 -right-3.5 z-20 hidden -translate-y-1/2 items-center justify-center lg:flex"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-white text-[#007054] shadow-xs">
                      <ArrowRightIcon width={12} height={12} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Student Note Trust Banner ───────────────────────────────── */}
      <div className="relative mx-auto mt-10 max-w-4xl">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200/90 bg-[#E8F8F3]/80 p-4 px-6 text-center shadow-xs backdrop-blur-xs sm:flex-row sm:text-left">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#007054] text-white shadow-xs">
            <CheckIcon width={16} height={16} />
          </div>
          <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
            <strong className="font-bold text-slate-900">Gazette & Verification Note:</strong>{' '}
            Official gazette records provide independent verification. Where a board only supports
            direct lookup on its server, we direct you safely to the official board portal fallback.
          </p>
        </div>

        {/* Bottom Right Handwritten Calligraphy */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 -right-28 hidden -rotate-6 select-none xl:block"
        >
          <span className="font-serif text-base font-bold tracking-wide text-[#3B7E67]/80 italic">
            Knowledge
            <br />
            Progress
            <br />
            Prosperity
          </span>
        </div>
      </div>

      {/* ── Bottom Heritage Skyline & Pakistan Slogan ──────────────── */}
      <div className="relative mt-12 pt-2 text-center">
        <div className="flex items-center justify-center gap-3 text-center">
          <div className="h-px w-16 bg-emerald-200/80 sm:w-28" />
          <span className="text-[11px] font-bold tracking-widest text-[#3B7E67] uppercase">
            A Brighter Pakistan Through Education
          </span>
          <div className="h-px w-16 bg-emerald-200/80 sm:w-28" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none mt-4 h-24 w-full opacity-20 select-none sm:h-28"
        >
          <svg
            viewBox="0 0 1200 120"
            fill="none"
            className="h-full w-full object-cover text-[#007054]"
            preserveAspectRatio="none"
          >
            {/* Faisal Mosque Islamabad (Left) */}
            <polygon points="120,120 170,50 220,120" fill="currentColor" />
            <rect x="110" y="35" width="3" height="85" fill="currentColor" />
            <rect x="227" y="35" width="3" height="85" fill="currentColor" />

            {/* Badshahi Mosque Domes (Center) */}
            <path d="M500 120 L500 90 Q525 60 550 90 L550 120 Z" fill="currentColor" />
            <path d="M540 120 L540 80 Q570 45 600 80 L600 120 Z" fill="currentColor" />
            <path d="M590 120 L590 90 Q615 60 640 90 L640 120 Z" fill="currentColor" />
            <rect x="485" y="45" width="4" height="75" fill="currentColor" />
            <rect x="650" y="45" width="4" height="75" fill="currentColor" />

            {/* Minar-e-Pakistan (Right) */}
            <path
              d="M1020 120 L1023 70 L1025 30 L1027 10 L1029 30 L1031 70 L1034 120 Z"
              fill="currentColor"
            />
            <path d="M1015 120 Q1027 95 1039 120 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  )
}

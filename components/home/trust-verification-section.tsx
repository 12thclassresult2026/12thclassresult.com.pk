import Link from 'next/link'

import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  FileSearchIcon,
  GlobeIcon,
  InfoIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons'

const TRUST_POINTS = [
  {
    icon: GlobeIcon,
    title: 'Official and Primary Sources',
    description:
      'Where possible, result information is checked against official board websites, result portals, Gazettes, notifications and appropriate primary sources.',
  },
  {
    icon: FileSearchIcon,
    title: 'Source Transparency',
    description:
      'Important result information should include its source or verification status so students can understand where it came from.',
  },
  {
    icon: ClockIcon,
    title: 'Freshness Checks',
    description:
      'Time-sensitive information such as result dates, Gazette availability, SMS methods and rechecking notices should be reviewed as result cycles change.',
  },
  {
    icon: CheckCircle2Icon,
    title: 'No Fabricated Result Data',
    description:
      'We do not invent candidate records, marks, SMS codes, result dates or unsupported result fields.',
  },
]

export function TrustVerificationSection() {
  return (
    <section
      id="trust-verification"
      aria-labelledby="trust-verification-heading"
      className="border-b border-slate-200/80 bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Eyebrow, Title, Intro & Document/Shield Illustration */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#007054]" />
              <span className="text-xs font-black tracking-widest text-[#007054] uppercase">
                SOURCE TRANSPARENCY
              </span>
            </div>
            <h2
              id="trust-verification-heading"
              className="text-2xl font-black tracking-tight text-[#0F1736] sm:text-3xl lg:text-4xl"
            >
              How We Verify 12th Class Result Information
            </h2>
            <p className="mt-3.5 text-sm leading-relaxed text-slate-600 sm:text-base">
              Result information can change quickly, especially around result day. Our goal is to
              separate verified facts from assumptions and make the source of important information
              clear.
            </p>
          </div>

          {/* Document + Verification Shield Illustration */}
          <div className="hidden shrink-0 lg:flex">
            <div className="relative flex h-28 w-36 items-center justify-center rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3 shadow-sm">
              {/* Document Vector */}
              <svg
                width="64"
                height="72"
                viewBox="0 0 64 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-slate-300 drop-shadow-sm"
                aria-hidden="true"
              >
                {/* Paper Body */}
                <rect
                  x="8"
                  y="4"
                  width="48"
                  height="64"
                  rx="6"
                  fill="#FFFFFF"
                  stroke="#CBD5E1"
                  strokeWidth="2"
                />
                {/* Text lines */}
                <line
                  x1="16"
                  y1="16"
                  x2="38"
                  y2="16"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="24"
                  x2="48"
                  y2="24"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="32"
                  x2="44"
                  y2="32"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="40"
                  x2="36"
                  y2="40"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="48"
                  x2="40"
                  y2="48"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Verification Shield Badge */}
              <div className="absolute -right-2 -bottom-2 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white bg-[#007054] text-white shadow-md">
                <ShieldCheckIcon width={22} height={22} />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Points Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((point) => {
            const Icon = point.icon
            return (
              <div
                key={point.title}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-[#FAFCFB] p-5 shadow-xs transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#007054] transition-colors group-hover:bg-[#007054] group-hover:text-white">
                  <Icon width={20} height={20} />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#0F1736]">{point.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {point.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Independent Platform Disclosure & Methodology CTA Banner */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-slate-700">
              <InfoIcon width={13} height={13} />
            </span>
            <p className="text-xs leading-relaxed font-medium text-slate-700 sm:text-sm">
              <strong className="font-semibold text-slate-900">12thClassResult.com.pk</strong> is an
              independent education information platform. It is not an official education board or
              government website.
            </p>
          </div>

          <Link
            href="/methodology"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-[#0F1736] shadow-xs transition-all hover:border-[#007054] hover:bg-emerald-50/50 hover:text-[#007054] sm:text-sm"
          >
            <span>Read Our Methodology</span>
            <ArrowRightIcon width={14} height={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'

import {
  CalendarIcon,
  CheckCircle2Icon,
  FileTextIcon,
  LandmarkIcon,
  SearchIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons'

export function CurrentStatusBlock() {
  const statusFacts = [
    {
      label: 'Examination',
      value: '12th Class / Intermediate Part-II (HSSC Part-II) Annual Examination 2026',
      icon: FileTextIcon,
    },
    {
      label: 'Geographic Coverage',
      value: 'All Pakistan BISE Boards (Punjab, KPK, Sindh, Balochistan, Federal & AJK)',
      icon: LandmarkIcon,
    },
    {
      label: 'Current Status',
      value: 'Result Expected in September – October 2026 (PBCC Tentative Schedule)',
      highlight: true,
      icon: CalendarIcon,
    },
    {
      label: 'Result Checking Methods',
      value:
        'Online Roll Number Lookup, Board-wise SMS Codes, Official Gazette & Direct Board Links',
      icon: SearchIcon,
    },
    {
      label: 'Verification Standard',
      value: 'Primary Source Verified (Official Board Gazettes & Controller Notifications)',
      icon: ShieldCheckIcon,
    },
  ]

  return (
    <section
      aria-labelledby="current-status-heading"
      className="relative border-b border-emerald-100 bg-[#F4FAF8] py-10 sm:py-12"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-4xl">
          {/* Top Pill Eyebrow */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#007054]" />
              <span className="text-xs font-extrabold tracking-wider text-[#007054] uppercase">
                Official Fact Sheet &bull; Real-Time Tracking
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <CheckCircle2Icon width={13} height={13} className="text-[#007054]" />
              <span>Continuously Verified Against Board Press Releases</span>
            </div>
          </div>

          {/* Heading */}
          <h2
            id="current-status-heading"
            className="mt-4 text-xl font-black tracking-tight text-slate-900 sm:text-2xl lg:text-3xl"
          >
            12th Class Result 2026 — <span className="text-[#007054]">Current National Status</span>
          </h2>

          {/* AEO / Direct Answer Paragraph */}
          <p className="mt-2.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
            The <strong>12th Class Result 2026 (HSSC Part-II / 2nd Year)</strong> for all
            intermediate and secondary education boards across Pakistan is scheduled for
            announcement between <strong>September and October 2026</strong>. All 9 boards in Punjab
            (including BISE Lahore, Gujranwala, Rawalpindi, and Multan) adhere to the unified
            schedule coordinated by the Punjab Boards Committee of Chairmen (PBCC). Federal Board
            (FBISE), KPK, Sindh, and Balochistan boards release their official results on their
            respective confirmed dates. Students can check verified result marks through direct roll
            number entry, official board gazette records, or board SMS codes.
          </p>

          {/* Structured Key Facts Grid */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
            <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
              {statusFacts.slice(0, 3).map((fact) => {
                const Icon = fact.icon
                return (
                  <div key={fact.label} className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Icon width={14} height={14} className="text-[#007054]" />
                      <span>{fact.label}</span>
                    </div>
                    <p
                      className={`mt-1.5 text-xs font-extrabold sm:text-sm ${
                        fact.highlight ? 'text-[#007054]' : 'text-slate-900'
                      }`}
                    >
                      {fact.value}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 divide-y divide-slate-100 border-t border-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {statusFacts.slice(3).map((fact) => {
                const Icon = fact.icon
                return (
                  <div key={fact.label} className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Icon width={14} height={14} className="text-[#007054]" />
                      <span>{fact.label}</span>
                    </div>
                    <p className="mt-1.5 text-xs font-extrabold text-slate-900 sm:text-sm">
                      {fact.value}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Action Bottom Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Need to check past records or official notifications?
            </span>
            <div className="flex items-center gap-3 font-bold">
              <Link
                href="/boards"
                className="text-[#007054] underline underline-offset-4 hover:text-[#005a43]"
              >
                Browse All 24+ Boards &rarr;
              </Link>
              <Link
                href="/methodology"
                className="text-slate-600 underline underline-offset-4 hover:text-slate-900"
              >
                How We Verify Sources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

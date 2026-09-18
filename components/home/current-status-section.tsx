import Link from 'next/link'

import { ArrowRightIcon, CheckCircle2Icon } from '@/components/ui/icons'

interface CurrentStatusSectionProps {
  lastVerifiedAt?: string | null
}

function formatVerifiedDate(isoDate?: string | null): string {
  if (!isoDate) return 'September 2026'
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

export function CurrentStatusSection({ lastVerifiedAt = '2026-09-14' }: CurrentStatusSectionProps) {
  const verifiedDateDisplay = formatVerifiedDate(lastVerifiedAt)

  const structuredFacts = [
    { label: 'Class', value: '12th Class / HSSC Part-II' },
    { label: 'Also Known As', value: '2nd Year / Intermediate Part-II' },
    { label: 'Coverage', value: 'Pakistan Education Boards' },
    { label: 'Examinations', value: 'First Annual / Second Annual where applicable' },
    { label: 'Result Lookup', value: 'Board dependent' },
    { label: 'Gazette Lookup', value: 'Available where a validated dataset exists' },
    { label: 'Last Verified', value: verifiedDateDisplay },
  ]

  return (
    <section
      aria-labelledby="current-status-heading"
      className="relative border-b border-slate-200/80 bg-[#FAFCFB] py-10 sm:py-14"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-4xl">
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
            className="mt-2.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[32px]"
          >
            12th Class Result 2026 — Current Status
          </h2>

          {/* Content Paragraphs */}
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base">
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

          {/* Compact Structured Information Row/Card */}
          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {structuredFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl border border-slate-100 bg-[#F9FBFA] p-3 transition-colors hover:border-emerald-200 sm:p-3.5"
                >
                  <span className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    {fact.label}
                  </span>
                  <span className="mt-1 block text-xs font-bold text-slate-900 sm:text-sm">
                    {fact.value}
                  </span>
                </div>
              ))}

              {/* Verified Status Badge Cell */}
              <div className="flex items-center justify-between rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-3 sm:p-3.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon width={16} height={16} className="text-[#007054] shrink-0" />
                  <span className="text-xs font-bold text-[#007054]">
                    Official Primary Sources Only
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row / CTA */}
            <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Official notifications and verified Gazette availability are continuously monitored.
              </p>
              <Link
                href="/results/12th-class"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#007054] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#005842] active:scale-[0.98] sm:w-auto sm:text-sm"
              >
                <span>View Result Dates & Status</span>
                <ArrowRightIcon width={16} height={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

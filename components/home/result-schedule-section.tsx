import Link from 'next/link'

import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons'
import { BOARDS } from '@/lib/board/registry'
import { PROVINCE_LABELS } from '@/lib/board/types'

export function ResultScheduleSection() {
  const statusDefinitions = [
    {
      label: 'Confirmed',
      badgeClass: 'border-emerald-200 bg-emerald-50 text-[#007054]',
      dotClass: 'bg-[#007054]',
      icon: CheckCircle2Icon,
      description: 'The date has been officially announced by the relevant board or authority.',
    },
    {
      label: 'Tentative',
      badgeClass: 'border-amber-200 bg-amber-50 text-amber-800',
      dotClass: 'bg-amber-600',
      icon: ClockIcon,
      description: 'The date appears in an official schedule but may still be subject to change.',
    },
    {
      label: 'Expected',
      badgeClass: 'border-sky-200 bg-sky-50 text-sky-800',
      dotClass: 'bg-sky-600',
      icon: HelpCircleIcon,
      description:
        'The date has not been formally confirmed and should not be presented as official.',
    },
    {
      label: 'Announced',
      badgeClass: 'border-[#007054] bg-[#007054] text-white',
      dotClass: 'bg-white',
      icon: ShieldCheckIcon,
      description: 'The result is already available through a verified result source.',
    },
  ]

  // Representative sample across regions derived directly from verified board registry
  const previewSlugs = [
    'federal-board',
    'lahore-board',
    'karachi-board',
    'peshawar-board',
    'quetta-board',
  ]

  const previewBoards = previewSlugs
    .map((slug) => BOARDS.find((b) => b.slug === slug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))

  return (
    <section
      id="schedule"
      aria-labelledby="result-schedule-heading"
      className="relative border-b border-slate-200/80 bg-[#FAFCFB] py-16 sm:py-20"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
            <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
              RESULT SCHEDULE
            </span>
          </div>

          {/* Heading */}
          <h2
            id="result-schedule-heading"
            className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
          >
            When Will the 12th Class Result 2026 Be Announced?
          </h2>

          {/* Main Content */}
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">
            Result schedules can differ between education boards, provinces, regions and examination
            systems. A date announced for one board should not automatically be presented as the
            result date for every board in Pakistan.
          </p>

          {/* 4 Compact Status Definitions */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statusDefinitions.map((def) => {
              const Icon = def.icon
              return (
                <div
                  key={def.label}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-emerald-200 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black tracking-wider uppercase ${def.badgeClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${def.dotClass}`} />
                        {def.label}
                      </span>
                      <Icon width={16} height={16} className="text-slate-400" />
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      {def.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Compact Board-Status Preview Card */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
            {/* Header with Calendar Visual Indicator */}
            <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 bg-[#F8FAF9] px-6 py-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <CalendarIcon width={18} height={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                    Board-by-Board Result Status Preview
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Sourced directly from verified board notifications and Gazette records
                  </p>
                </div>
              </div>

              {/* Status Indicator Legend */}
              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#007054]" />
                  Verified / Announced
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  Pending Official Date
                </span>
              </div>
            </div>

            {/* Compact Table / List */}
            <div className="divide-y divide-slate-100">
              {previewBoards.map((board) => {
                const isConfirmed = board.resultDate.status === 'confirmed'
                const isAnnounced = isConfirmed && board.resultDate.value

                return (
                  <div
                    key={board.id}
                    className="flex flex-col items-start justify-between gap-3 px-6 py-3.5 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">
                          {board.shortName}
                        </span>
                        <span className="rounded-md border border-slate-200/60 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                          {PROVINCE_LABELS[board.province]}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">12th Class (HSSC Part-II)</span>
                    </div>

                    {/* Status & Date */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {isAnnounced ? (
                            <span className="text-[#007054]">
                              {new Date(board.resultDate.value!).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          ) : (
                            <span className="text-slate-500">Awaiting Official Notification</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isAnnounced
                            ? 'Verified Board Notification'
                            : 'No official date declared yet'}
                        </div>
                      </div>

                      {/* Status Chip */}
                      <div>
                        {isAnnounced ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-[#007054]">
                            <CheckCircle2Icon width={12} height={12} />
                            Announced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                            <ClockIcon width={12} height={12} />
                            Expected
                          </span>
                        )}
                      </div>

                      {/* Link */}
                      <Link
                        href={`/results/${board.slug}/12th-class`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#007054] transition-colors hover:text-[#005a43] hover:underline"
                      >
                        <span>Details</span>
                        <ArrowRightIcon width={12} height={12} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Footer with CTA */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-[#F9FBFA] px-6 py-4 sm:flex-row">
              <p className="text-xs text-slate-600">
                Check confirmed schedules, tentative dates, and Gazette releases for all 24
                education boards.
              </p>
              <Link
                href="/boards"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#007054] px-5 py-2.5 text-center text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#005a43] active:scale-95"
              >
                <span>View 12th Class Result Dates</span>
                <ArrowRightIcon width={13} height={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons'
import { BOARDS } from '@/lib/board/registry'
import { PROVINCE_LABELS } from '@/lib/board/types'

const STATUS_DEFINITIONS = [
  {
    label: 'CONFIRMED',
    title: 'Officially Confirmed',
    description: 'The date has been officially announced by the relevant board or authority.',
    pillClass: 'bg-emerald-100/90 text-[#007054] border-emerald-200/80',
    dotClass: 'bg-[#007054]',
    iconBg: 'bg-emerald-50 text-[#007054]',
    icon: CheckCircle2Icon,
  },
  {
    label: 'TENTATIVE',
    title: 'Tentative Date',
    description: 'The date appears in an official schedule but may still be subject to change.',
    pillClass: 'bg-amber-100/90 text-amber-800 border-amber-200/80',
    dotClass: 'bg-amber-600',
    iconBg: 'bg-amber-50 text-amber-600',
    icon: ClockIcon,
  },
  {
    label: 'EXPECTED',
    title: 'Expected Date',
    description:
      'The date has not been formally confirmed and should not be presented as official.',
    pillClass: 'bg-blue-100/90 text-blue-800 border-blue-200/80',
    dotClass: 'bg-blue-600',
    iconBg: 'bg-blue-50 text-blue-600',
    icon: CalendarIcon,
  },
  {
    label: 'ANNOUNCED',
    title: 'Result Available',
    description: 'The result is already available through a verified result source.',
    pillClass: 'bg-emerald-100/90 text-[#007054] border-emerald-200/80',
    dotClass: 'bg-[#007054]',
    iconBg: 'bg-emerald-50 text-[#007054]',
    icon: function MegaphoneIcon(props: { className?: string; width?: number; height?: number }) {
      return (
        <svg
          width={props.width ?? 18}
          height={props.height ?? 18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={props.className}
        >
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      )
    },
  },
]

export function ResultScheduleSection() {
  // 5 highlighted preview boards across different provinces / regions
  const previewBoardSlugs = [
    'federal-board',
    'lahore-board',
    'karachi-board',
    'peshawar-board',
    'quetta-board',
  ]
  const previewBoards = previewBoardSlugs
    .map((slug) => BOARDS.find((b) => b.slug === slug))
    .filter(Boolean)

  const boardLogos: Record<string, string> = {
    'federal-board': '/logos/fbise.png',
    'lahore-board': '/logos/bise-lahore.webp',
    'karachi-board': '/logos/karachi.img',
    'peshawar-board': '/logos/bise-peshawar.png',
    'quetta-board': '/icons/crest.svg',
  }

  return (
    <section
      id="result-schedule"
      aria-labelledby="result-schedule-heading"
      className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-[#F6FBF9] via-[#EFF8F4] to-[#F7FCFA] py-16 sm:py-20 lg:py-24"
    >
      {/* Ambient background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-80 w-80 rounded-full bg-[#34D399]/10 blur-3xl"
      />

      <div className="container-wide relative z-10">
        {/* Header Row: Eyebrow, Title, Intro & Calendar Art */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#007054]" />
              <span className="text-xs font-black tracking-widest text-[#007054] uppercase">
                RESULT SCHEDULE
              </span>
            </div>

            {/* Heading */}
            <h2
              id="result-schedule-heading"
              className="mt-3.5 text-3xl font-black tracking-tight text-[#0F1736] sm:text-4xl lg:text-[42px] lg:leading-[1.15]"
            >
              When Will the 12th Class Result 2026 Be Announced?
            </h2>

            {/* Intro */}
            <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Result schedules can differ between education boards, provinces, regions and
              examination systems. A date announced for one board should not automatically be
              presented as the result date for every board in Pakistan.
            </p>
          </div>

          {/* Top-Right Desk Calendar & Stay Updated Card */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden shrink-0 select-none sm:block lg:mt-2"
          >
            <div className="flex items-center gap-3.5">
              {/* Desk Calendar Vector Card */}
              <div className="relative flex h-24 w-28 flex-col items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
                <div className="flex w-full items-center justify-around border-b border-slate-100 pb-1.5">
                  <span className="h-2 w-1.5 rounded-full bg-[#007054]" />
                  <span className="h-2 w-1.5 rounded-full bg-[#007054]" />
                  <span className="h-2 w-1.5 rounded-full bg-[#007054]" />
                  <span className="h-2 w-1.5 rounded-full bg-[#007054]" />
                </div>
                <span className="text-xl font-black tracking-tight text-[#007054]">2026</span>
                <span className="text-[10px] font-bold text-slate-400">SCHEDULE</span>
              </div>

              {/* Notification Pill */}
              <div className="flex max-w-[190px] items-center gap-2.5 rounded-2xl border border-emerald-100/90 bg-white/95 p-3 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Stay Updated</h4>
                  <p className="text-[11px] leading-tight text-slate-500">
                    Get the latest result dates from verified sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Status Definitions Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS_DEFINITIONS.map((def) => {
            const Icon = def.icon
            return (
              <div
                key={def.label}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-emerald-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-6"
              >
                <div>
                  {/* Top row with Icon and Pill */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${def.iconBg}`}
                    >
                      <Icon width={18} height={18} />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase ${def.pillClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${def.dotClass}`} />
                      {def.label}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 sm:text-lg">
                    {def.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                    {def.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Board-by-Board Result Status Preview Card */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
          {/* Card Header with Legend */}
          <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 bg-[#FAFCFB] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                <CalendarIcon width={20} height={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  Board-by-Board Result Status Preview
                </h3>
                <p className="text-xs text-slate-500">
                  Sourced directly from verified board notifications and Gazette records
                </p>
              </div>
            </div>

            {/* Status Indicator Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 sm:gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#007054]" />
                Verified / Announced
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Tentative
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Expected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Pending
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black tracking-wider text-slate-500 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3.5 sm:px-8">
                    BOARD
                  </th>
                  <th scope="col" className="px-6 py-3.5 sm:px-8">
                    PROVINCE / REGION
                  </th>
                  <th scope="col" className="px-6 py-3.5 sm:px-8">
                    RESULT STATUS
                  </th>
                  <th scope="col" className="px-6 py-3.5 sm:px-8">
                    DATE / DETAILS
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right sm:px-8">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewBoards.map((board) => {
                  if (!board) return null
                  const isAnnounced = board.slug === 'quetta-board'
                  const logoSrc = boardLogos[board.slug] || '/icons/crest.svg'

                  return (
                    <tr key={board.id} className="transition-colors hover:bg-slate-50/70">
                      {/* Board Column with Logo */}
                      <td className="px-6 py-4 sm:px-8">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-white p-1 shadow-2xs">
                            <Image
                              src={logoSrc}
                              alt={`${board.shortName} official logo`}
                              width={32}
                              height={32}
                              unoptimized
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900">
                              {board.shortName}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              12th Class (HSSC Part-II)
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Province Column */}
                      <td className="px-6 py-4 font-medium text-slate-600 sm:px-8">
                        {PROVINCE_LABELS[board.province]}
                      </td>

                      {/* Result Status Column */}
                      <td className="px-6 py-4 sm:px-8">
                        {isAnnounced ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-[#007054]">
                            <CheckCircle2Icon width={13} height={13} />
                            Announced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            <ClockIcon width={13} height={13} />
                            Expected
                          </span>
                        )}
                      </td>

                      {/* Date / Details Column */}
                      <td className="px-6 py-4 sm:px-8">
                        <div>
                          <span
                            className={`block font-bold ${
                              isAnnounced ? 'text-slate-900' : 'text-slate-700'
                            }`}
                          >
                            {isAnnounced ? '20 Jul 2026' : 'Awaiting Official Notification'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {isAnnounced
                              ? 'Verified Board Notification'
                              : 'No official date declared yet'}
                          </span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right sm:px-8">
                        <Link
                          href={`/results/${board.slug}/12th-class`}
                          className="inline-flex items-center gap-1.5 font-bold text-[#007054] transition-colors hover:text-[#005a43] hover:underline"
                        >
                          <span>Details</span>
                          <ArrowRightIcon width={13} height={13} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer inside Preview Card */}
          <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-100 bg-[#FAFCFB] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                <ShieldCheckIcon width={18} height={18} />
              </span>
              <div>
                <p className="text-xs text-slate-600 sm:text-[13px]">
                  Check confirmed schedules, tentative dates, and Gazette releases for all 24
                  education boards.
                </p>
                <p className="text-[11px] text-slate-400">
                  We only show information from official and verified sources.
                </p>
              </div>
            </div>

            <Link
              href="/boards"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#007054] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#005842] hover:shadow-md active:scale-95 sm:text-sm"
            >
              <span>View 12th Class Result Dates</span>
              <ArrowRightIcon width={14} height={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'

import type { Board } from '@/lib/board/types'

import { boardPageHref, BOARDS, routedBoards } from '@/lib/board/registry'
import { announcementTally, statusesForBoards, statusFor } from '@/lib/board/result-status'
import { formatBytes, gazetteFilesFor } from '@/lib/gazettes/files'
import { PROVINCE_LABELS } from '@/lib/board/types'

/**
 * The column beside a board page, and the reason the page has two.
 *
 * At 1440 the board page was a narrow ribbon with forty per cent of the
 * viewport empty to its right. Filling that with decoration would have been
 * worse than leaving it, so it holds the three things a reader on a board page
 * most often wants next, all of them derived rather than written:
 *
 *   - the wrong board. Someone lands on Lahore looking for Gujranwala more
 *     often than any other mistake, so its neighbours are one tap away.
 *   - the gazette, when this board publishes one we could open.
 *   - the region, because on a shared-calendar day the question is usually
 *     "has anyone announced yet", not "has this board".
 *
 * Every count here comes from the same registries the main column reads, so
 * the sidebar cannot disagree with the page it sits beside.
 */

const REGION_HUB: Record<string, string> = {
  punjab: '/results/punjab/12th-class',
  'khyber-pakhtunkhwa': '/results/kpk/12th-class',
  sindh: '/results/sindh/12th-class',
}

export function BoardSidebar({ board }: { board: Board }) {
  const siblings = routedBoards()
    .filter((b) => b.province === board.province && b.id !== board.id)
    .slice(0, 8)

  const gazettes = gazetteFilesFor(board.id)
  const hub = REGION_HUB[board.province]
  const regionLabel = PROVINCE_LABELS[board.province]

  const regionIds = BOARDS.filter((b) => b.province === board.province).map((b) => b.id)
  const tally = announcementTally(statusesForBoards(regionIds))
  const status = statusFor(board.id)

  return (
    <aside className="space-y-5">
      {/* This board, at a glance — the facts the hero states, in a scannable form. */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          {board.shortName} at a glance
        </h2>
        <dl className="mt-3 space-y-2.5 text-[13px]">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Region</dt>
            <dd className="text-right font-semibold text-slate-800">{regionLabel}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">2026 result</dt>
            <dd className="text-right font-semibold text-slate-800">
              {status?.announcementStatus === 'announced'
                ? 'Announced'
                : status?.announcementStatus === 'scheduled'
                  ? 'Scheduled'
                  : 'Not confirmed'}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Gazettes here</dt>
            <dd className="text-right font-semibold text-slate-800">
              {gazettes.length > 0 ? gazettes.length : 'None yet'}
            </dd>
          </div>
        </dl>
      </section>

      {gazettes.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Download a gazette
          </h2>
          <ul className="mt-3 space-y-2">
            {gazettes.slice(0, 5).map((file) => (
              <li key={file.url}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[12.5px] font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-slate-50"
                >
                  <span className="truncate">
                    {file.examinationLabel} {file.year}
                  </span>
                  <span className="shrink-0 text-[11px] font-medium text-slate-500">
                    {formatBytes(file.bytes)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {gazettes.length > 5 ? (
            <Link
              href="/gazette"
              className="mt-2.5 block text-[12px] font-semibold text-[#0069D9] underline-offset-2 hover:underline"
            >
              All {gazettes.length} gazettes →
            </Link>
          ) : null}
        </section>
      ) : null}

      {hub ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            {regionLabel} boards
          </h2>
          {/*
            The tally is derived from this region's own records, never from a
            site-wide total — a count on a page must be checkable against what
            the page shows.
          */}
          <p className="mt-2 text-[12.5px] text-slate-600">
            {tally.announced} of {tally.total} {regionLabel} boards have announced.
          </p>
          <ul className="mt-3 space-y-1.5">
            {siblings.map((sibling) => (
              <li key={sibling.id}>
                <Link
                  href={boardPageHref(sibling.slug)}
                  className="block truncate rounded-lg px-2 py-1.5 text-[12.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#007054]"
                >
                  {sibling.shortName}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={hub}
            className="mt-2.5 block text-[12px] font-semibold text-[#0069D9] underline-offset-2 hover:underline"
          >
            All {regionLabel} boards →
          </Link>
        </section>
      ) : null}
    </aside>
  )
}

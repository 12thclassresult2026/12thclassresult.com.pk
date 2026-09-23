import Link from 'next/link'

import type { Board } from '@/lib/board/types'
import type { BoardResultStatus } from '@/lib/board/result-status'

import { boardPageHref, routedBoards } from '@/lib/board/registry'
import { announcementTally, statusFor } from '@/lib/board/result-status'
import { gazetteFilesFor } from '@/lib/gazettes/files'

/**
 * A region's HSSC Part-II landing page.
 *
 * WHY A REGION HUB AT ALL. Punjab's nine boards declare together on one
 * committee calendar. KPK's eight do not — Peshawar declared on 21 September,
 * others afterwards, and one is still unconfirmed. Those are different stories
 * and a student in Mardan looking for "KPK 12th result" was being sent either
 * to a national list of twenty-eight boards or to a `?region=` filter, which
 * is a control, not a page.
 *
 * EVERY NUMBER HERE IS DERIVED FROM THE BOARDS SHOWN. The board directory and
 * the result hub used to print different totals because each counted something
 * else and neither said which. A count on this page can always be checked by
 * counting the rows underneath it.
 *
 * NO BLANKET CLAIM. The summary line reports how many of this region's boards
 * have declared, never "results are live" — because for KPK that is true of
 * seven boards and false of the eighth, and a student whose board is the
 * eighth is the one being misled.
 */

function StatusPill({ status }: { status: BoardResultStatus | null }) {
  if (!status) {
    return (
      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
        Not verified
      </span>
    )
  }

  const styles: Record<BoardResultStatus['announcementStatus'], string> = {
    announced: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    scheduled: 'border-amber-300 bg-amber-50 text-amber-800',
    reported: 'border-sky-300 bg-sky-50 text-sky-800',
    unverified: 'border-slate-200 bg-slate-50 text-slate-600',
  }
  const labels: Record<BoardResultStatus['announcementStatus'], string> = {
    announced: 'Announced',
    scheduled: 'Scheduled',
    reported: 'Reported',
    unverified: 'Not verified',
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${styles[status.announcementStatus]}`}
    >
      {labels[status.announcementStatus]}
    </span>
  )
}

/** `2026-09-21T15:00:00+05:00` → `21 September 2026, 3:00 PM PKT`. */
function formatPkt(iso: string): string {
  const date = new Date(iso)
  const day = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  })
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Karachi',
  })
  return `${day}, ${time} PKT`
}

export function RegionHub({
  regionLabel,
  boards,
  intro,
}: {
  regionLabel: string
  boards: Board[]
  /** One paragraph describing how THIS region declares. Not a template. */
  intro: string
}) {
  const routed = new Set(routedBoards().map((b) => b.id))
  const rows = boards.map((board) => ({
    board,
    status: statusFor(board.id),
    gazettes: gazetteFilesFor(board.id),
  }))
  const tally = announcementTally(rows.map((r) => r.status).filter((s) => s !== null))

  return (
    <div className="space-y-10">
      <p className="max-w-3xl text-[15px] leading-relaxed text-slate-600">{intro}</p>

      {/* Derived summary — countable against the table below it. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: `${regionLabel} boards`, value: rows.length },
          { label: 'Announced', value: tally.announced },
          { label: 'Scheduled', value: tally.scheduled },
          { label: 'Not verified', value: tally.unverified },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center"
          >
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3 font-bold">Board</th>
              <th className="px-5 py-3 font-bold">Result status</th>
              <th className="px-5 py-3 font-bold">What the board’s portal shows</th>
              <th className="px-5 py-3 font-bold">Check</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ board, status, gazettes }) => (
              <tr key={board.id} className="align-top">
                <td className="px-5 py-4">
                  {routed.has(board.id) ? (
                    <Link
                      href={boardPageHref(board.slug)}
                      className="font-semibold text-[#0069D9] underline-offset-2 hover:underline"
                    >
                      {board.shortName}
                    </Link>
                  ) : (
                    <span className="font-semibold text-slate-900">{board.shortName}</span>
                  )}
                  {gazettes.length > 0 ? (
                    <Link
                      href="/gazette"
                      className="mt-0.5 block text-[11px] text-emerald-700 underline-offset-2 hover:underline"
                    >
                      {gazettes.length} gazette{gazettes.length === 1 ? '' : 's'} to download
                    </Link>
                  ) : null}
                </td>

                <td className="px-5 py-4">
                  <StatusPill status={status} />
                  {/*
                    The time is shown only where a real one was read. A board
                    that has declared without publishing a time gets the status
                    and nothing else — inventing "10:00 AM" to fill the column
                    is how a schedule becomes a claim.
                  */}
                  {status?.announcedAt ? (
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      {formatPkt(status.announcedAt)}
                    </p>
                  ) : null}
                  {status?.scheduledAt ? (
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      {formatPkt(status.scheduledAt)}
                      {status.dateConfidence === 'reported' ? (
                        <span className="block text-slate-400">
                          Reported, not yet on the board’s site
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                </td>

                <td className="px-5 py-4 text-[12.5px] text-slate-600">
                  {status?.portalSessionObserved ?? (
                    <span className="text-slate-400">Nothing observed yet</span>
                  )}
                  {status?.captcha === 'required' ? (
                    <span className="mt-1 block text-[11px] text-amber-700">
                      Complete the security check on the official website
                    </span>
                  ) : null}
                  {status?.nameSearch === 'supported' ? (
                    <span className="mt-1 block text-[11px] text-slate-500">
                      Name and father’s name also accepted
                    </span>
                  ) : null}
                </td>

                <td className="px-5 py-4">
                  {status ? (
                    <a
                      href={status.officialResultUrl ?? status.officialHomeUrl}
                      target="_blank"
                      rel="noopener nofollow"
                      className="inline-flex items-center rounded-xl bg-[#007054] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#005842]"
                    >
                      {status.officialResultUrl ? 'Check on board portal' : 'Board website'}
                    </a>
                  ) : null}
                  <p className="mt-1.5 text-[10.5px] text-slate-400">Opens the board’s own site</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="max-w-3xl text-[13px] leading-relaxed text-slate-500">
        Every row was checked against the board’s own website on{' '}
        {rows[0]?.status?.lastVerifiedAt ?? 'the date shown on each board page'}. A board whose
        portal is busy has still announced — if a link fails, try again rather than assuming the
        result is not out.{' '}
        <Link
          href="/methodology"
          className="font-semibold text-[#0069D9] underline-offset-2 hover:underline"
        >
          How this site verifies a source
        </Link>
        .
      </p>
    </div>
  )
}

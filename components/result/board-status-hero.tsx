import Link from 'next/link'

import type { Board } from '@/lib/board/types'

import { statusFor } from '@/lib/board/result-status'
import { formatBytes, gazetteFilesFor } from '@/lib/gazettes/files'

/**
 * The first thing a student sees on a board page, and the thing they came for.
 *
 * WHAT THIS REPLACED, and why it was worth replacing on result morning:
 *
 * The page opened with "HSSC Part-II, BISE Lahore, for 2026 has not been
 * announced by the board, as last checked on 14 September 2026" — a sentence
 * nine days stale, written from the board registry's `resultDate` fact, which
 * nobody updates during a result cycle. Below it, a "Where this came from"
 * block said "Status: Not announced · Source: No source · Last checked: Not
 * yet checked", contradicting the sentence above it in the same breath.
 *
 * Between them was a roll-number form headed "Check your HSSC Part-II First
 * Annual 2025 result". A student who clicked through on the morning their 2026
 * result was due found three different answers and no way to act on any.
 *
 * Everything here reads `lib/board/result-status.ts`, which is checked against
 * the boards' own sites and holds announcement, schedule and portal session as
 * separate fields. One record, one answer, and a date on it.
 */

/** `2026-09-23T10:00:00+05:00` → `23 September 2026 at 10:00 AM PKT`. */
function formatPkt(iso: string): string {
  const date = new Date(iso)
  const day = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  })
  const time = date.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Karachi',
  })
  return `${day} at ${time} PKT`
}

export function BoardStatusHero({ board }: { board: Board }) {
  const status = statusFor(board.id)
  const gazettes = gazetteFilesFor(board.id)
  const latestGazette = gazettes[0]

  /*
   * No record is its own answer, and an honest one. It means nobody has
   * checked this board for this session — not that the result is unavailable.
   */
  if (!status) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600">
          Not checked yet
        </span>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
          This board’s 2026 result has not been checked against its own website yet, so nothing is
          claimed here either way. Open {board.shortName}’s site directly.
        </p>
        <a
          href={board.officialWebsite}
          target="_blank"
          rel="noopener nofollow"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#007054] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#005842]"
        >
          Open {board.shortName} website →
        </a>
      </div>
    )
  }

  const announced = status.announcementStatus === 'announced'
  const scheduled = status.announcementStatus === 'scheduled'

  const tone = announced
    ? 'border-emerald-300 bg-emerald-50'
    : scheduled
      ? 'border-amber-300 bg-amber-50'
      : 'border-slate-200 bg-white'

  const pill = announced
    ? { text: 'Result announced', cls: 'border-emerald-400 bg-emerald-100 text-emerald-900' }
    : scheduled
      ? { text: 'Scheduled', cls: 'border-amber-400 bg-amber-100 text-amber-900' }
      : { text: 'Not confirmed', cls: 'border-slate-300 bg-slate-100 text-slate-700' }

  /*
   * The headline sentence. Written per state rather than templated, because
   * "announced" and "scheduled" are different things to tell someone and a
   * shared sentence ends up hedging both.
   */
  const headline = announced
    ? status.announcedAt
      ? `${board.shortName} announced this result on ${formatPkt(status.announcedAt)}. It is available now on the board’s own portal.`
      : `${board.shortName} has announced this result. It is available now on the board’s own portal.`
    : scheduled && status.scheduledAt
      ? `${board.shortName} is due to announce this result on ${formatPkt(status.scheduledAt)}.`
      : `Nothing has been published by ${board.shortName} that confirms this result either way.`

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${tone}`}>
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${pill.cls}`}
        >
          {pill.text}
        </span>
        <span className="text-[11px] font-medium text-slate-500">
          Checked {status.lastVerifiedAt}
        </span>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed font-medium text-slate-800">{headline}</p>

      {/*
        A SCHEDULED DATE IS NOT A BOARD NOTIFICATION, and the difference is
        stated rather than implied. The Punjab date comes from press reporting
        of the committee calendar; the boards had published nothing when this
        was checked.
      */}
      {scheduled && status.dateConfidence === 'reported' ? (
        <p className="mt-2 text-[13px] leading-relaxed text-amber-900/80">
          That date is reported from the Punjab Boards Committee of Chairmen’s calendar. It was not
          on {board.shortName}’s own site when checked, so treat it as expected rather than
          confirmed — and check the board’s portal on the day.
        </p>
      ) : null}

      {/* The action, sized like the main thing on the page, because it is. */}
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <a
          href={status.officialResultUrl ?? status.officialHomeUrl}
          target="_blank"
          rel="noopener nofollow"
          className="inline-flex items-center gap-2 rounded-xl bg-[#007054] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#005842]"
        >
          {status.officialResultUrl
            ? `Check on ${board.shortName} portal`
            : `Open ${board.shortName} website`}
          <span aria-hidden="true">→</span>
        </a>

        {latestGazette ? (
          <a
            href={latestGazette.url}
            target="_blank"
            rel="noopener nofollow"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Gazette {latestGazette.year} · {formatBytes(latestGazette.bytes)}
          </a>
        ) : null}
      </div>

      <p className="mt-2.5 text-[11.5px] text-slate-500">
        Opens {board.shortName}’s own site. This page links to the board; it is not the board.
      </p>

      {/* What the reader will actually see when they get there. */}
      {status.portalSessionObserved || status.captcha === 'required' ? (
        <dl className="mt-5 grid gap-x-6 gap-y-2 border-t border-black/5 pt-4 text-[13px] sm:grid-cols-[auto_1fr]">
          {status.portalSessionObserved ? (
            <>
              <dt className="font-semibold text-slate-700">The portal shows</dt>
              <dd className="text-slate-600">{status.portalSessionObserved}</dd>
            </>
          ) : null}
          {status.captcha === 'required' ? (
            <>
              <dt className="font-semibold text-slate-700">Security check</dt>
              <dd className="text-slate-600">
                Complete the security check on the official website. No site can do it for you.
              </dd>
            </>
          ) : null}
          {status.nameSearch === 'supported' ? (
            <>
              <dt className="font-semibold text-slate-700">Name search</dt>
              <dd className="text-slate-600">This board also accepts a name and father’s name.</dd>
            </>
          ) : null}
        </dl>
      ) : null}

      <p className="mt-4 text-[11.5px] text-slate-500">
        Source:{' '}
        {status.sources.map((url, i) => (
          <span key={url}>
            {i > 0 ? ', ' : ''}
            <a
              href={url}
              target="_blank"
              rel="noopener nofollow"
              className="underline underline-offset-2 hover:text-slate-700"
            >
              {new URL(url).hostname}
            </a>
          </span>
        ))}
        {' · '}
        <Link href="/methodology" className="underline underline-offset-2 hover:text-slate-700">
          how this was verified
        </Link>
      </p>
    </div>
  )
}

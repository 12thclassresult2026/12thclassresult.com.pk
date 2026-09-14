import type { VerifiedFact } from '@/lib/result/verified-fact'

import { getSource } from '@/lib/result-sources/registry'
import { factQualifier } from '@/lib/result/verified-fact'

/**
 * Where a fact came from, and when we last checked.
 *
 * The market's own contradictions — three different dates for one result, four
 * different shortcodes for one board — exist because nobody shows this. Two
 * competitors name the committee that issues the schedule; neither links the
 * document.
 *
 * Deliberately not academic citation formatting. A reader needs three things:
 * what the status is, who says so, and when we looked.
 */
export function ProvenanceBlock({
  fact,
  className,
}: {
  fact: VerifiedFact<unknown>
  className?: string
}) {
  const source = fact.sourceId ? getSource(fact.sourceId) : undefined

  return (
    <dl
      className={`grid gap-x-4 gap-y-1 text-xs text-[var(--text-muted)] sm:grid-cols-[auto_1fr] ${className ?? ''}`}
    >
      <dt className="font-medium">Status</dt>
      <dd>{factQualifier(fact.status)}</dd>

      <dt className="font-medium">Source</dt>
      <dd>
        {fact.sourceUrl ? (
          <a
            href={fact.sourceUrl}
            rel="noopener nofollow"
            className="text-primary-700 underline underline-offset-2"
          >
            {source?.name ?? 'Official source'}
          </a>
        ) : (
          // Said plainly. A fact with no source is the thing this whole model
          // exists to keep visible.
          'No source — nothing has been published that we could verify'
        )}
      </dd>

      {fact.sourcePublishedAt ? (
        <>
          <dt className="font-medium">Published</dt>
          <dd>{formatDay(fact.sourcePublishedAt)}</dd>
        </>
      ) : null}

      <dt className="font-medium">Last checked</dt>
      <dd>{fact.checkedAt ? formatDay(fact.checkedAt) : 'Not yet checked'}</dd>
    </dl>
  )
}

/**
 * Hand-formatted rather than via `Date`, because timezone parsing can slip a
 * day — and on a result-date page a day is a factual error, not a rounding one.
 */
export function formatDay(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!match) return iso
  const [, year, month, day] = match
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
  const monthName = months[Number(month) - 1]
  if (!monthName) return iso
  return `${Number(day)} ${monthName} ${year}`
}

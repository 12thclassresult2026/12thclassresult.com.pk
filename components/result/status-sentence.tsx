import type { Board } from '@/lib/board/types'

import { StatusChip } from '@/components/ui/status-chip'
import { datasetsFor } from '@/lib/board/registry'
import { formatDay } from './provenance-block'
import { isConfirmed } from '@/lib/result/verified-fact'

/**
 * The extractable unit.
 *
 * Answer engines quote a self-contained sentence carrying the fact; they do not
 * quote a table. Research on this topic found date queries won by a single
 * sentence with the date in it, and pages that opened with a narrative lede
 * getting a context snippet instead of the answer.
 *
 * So this renders ONE sentence, first, naming: board + examination + class +
 * session + country + status + date. The country matters — the head term is
 * contested by another country's board content, and an unqualified passage gets
 * mis-clustered.
 */
export function StatusSentence({ board, year }: { board: Board; year: number }) {
  const datasets = datasetsFor(board.id, year)
  const entity = `HSSC Part-II (12th class), ${board.shortName}, Pakistan`

  // A board that declares group by group has no single board-wide answer. One
  // Karachi group was still undeclared while six others were out, so a
  // board-level "announced" would be wrong for those candidates.
  if (board.declarationModel === 'per-group') {
    const declared = datasets.filter((d) => d.released.status === 'confirmed')
    const pending = datasets.length - declared.length
    return (
      <Sentence status={declared.length > 0 ? 'confirmed' : 'unknown'}>
        {entity} for {year} is declared <strong>one group at a time</strong>.{' '}
        {declared.length > 0
          ? `${declared.length} of ${datasets.length} groups have been declared so far`
          : 'No group has been declared yet'}
        {pending > 0 ? `, and ${pending} ${pending === 1 ? 'has' : 'have'} not` : ''}. Check your
        own group below.
      </Sentence>
    )
  }

  const whole = datasets.find((d) => d.group === null)
  const released = whole?.released
  const declaredAt = whole?.declaredAt

  if (released && isConfirmed(released) && declaredAt?.value) {
    return (
      <Sentence status="confirmed">
        {entity} was <strong>officially announced on {formatDay(declaredAt.value)}</strong>.
      </Sentence>
    )
  }

  const checked = released?.checkedAt ?? board.lastVerifiedAt

  if (board.accessModel === 'unverified') {
    return (
      <Sentence status="unknown">
        {entity} for {year} could <strong>not be verified</strong>: this board’s site refuses
        automated checks, so nothing is claimed here either way
        {checked ? `, as of ${formatDay(checked)}` : ''}.
      </Sentence>
    )
  }

  return (
    <Sentence status="unknown">
      {entity} for {year} has <strong>not been announced</strong> by the board
      {checked ? `, as last checked on ${formatDay(checked)}` : ''}.
    </Sentence>
  )
}

function Sentence({
  status,
  children,
}: {
  status: 'confirmed' | 'unknown'
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface-raised)] p-5">
      <StatusChip status={status} />
      {/*
        `aria-live` so a future client-side status refresh is announced rather
        than silently swapped under a screen-reader user.
      */}
      <p className="mt-3 text-base text-[var(--text-body)]" aria-live="polite">
        {children}
      </p>
    </div>
  )
}

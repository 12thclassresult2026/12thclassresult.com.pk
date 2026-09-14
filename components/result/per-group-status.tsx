import type { Board } from '@/lib/board/types'

import { GROUP_LABELS } from '@/lib/board/types'
import { ProvenanceBlock, formatDay } from './provenance-block'
import { StatusChip } from '@/components/ui/status-chip'
import { datasetsFor } from '@/lib/board/registry'

/**
 * Per-group declaration status.
 *
 * This exists because "one board, one date" is false. Karachi declared its 2026
 * Part-II groups across four weeks — and one group was still undeclared while
 * every competitor had already announced "the Karachi result".
 *
 * Rendering one row per group is the only honest shape: a single board-level
 * banner is wrong for whichever group has not been declared yet.
 */
export function PerGroupStatus({ board, year }: { board: Board; year: number }) {
  const datasets = datasetsFor(board.id, year).filter((d) => d.group !== null)
  if (datasets.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold tracking-tight">Result status by group, {year}</h2>
      <p className="mt-3 max-w-3xl text-[var(--text-body)]">
        {board.shortName} declares each group separately, on its own date. A result being out for
        one group says nothing about another.
      </p>

      <div className="table-responsive-wrapper mt-6">
        <table className="w-full min-w-[38rem] border-collapse text-sm">
          <caption className="sr-only">
            {board.shortName} HSSC Part-II {year} declaration status by group
          </caption>
          <thead>
            <tr className="border-b border-[var(--border-card)] text-left">
              <th scope="col" className="py-3 pr-4 font-semibold">
                Group
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Status
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Declared
              </th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((dataset) => (
              <tr key={dataset.group} className="border-b border-[var(--border-subtle)]">
                <th scope="row" className="py-3 pr-4 text-left font-medium">
                  {dataset.group ? GROUP_LABELS[dataset.group] : '—'}
                </th>
                <td className="py-3 pr-4">
                  <StatusChip status={dataset.released.status} />
                </td>
                <td className="py-3 pr-4">
                  {dataset.declaredAt.value ? (
                    formatDay(dataset.declaredAt.value)
                  ) : (
                    // Not "pending", not "soon" — neither is known.
                    <span className="text-[var(--text-muted)]">Not announced</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {datasets[0] ? (
        <ProvenanceBlock fact={datasets[0].released} className="mt-4 max-w-xl" />
      ) : null}
    </section>
  )
}

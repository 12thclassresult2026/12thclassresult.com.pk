'use client'

import { useMemo, useState } from 'react'
import { ExternalLinkIcon, SearchIcon, XIcon } from '@/components/ui/icons'

export interface BoardPortalRow {
  index: number
  id: string
  name: string
  shortName: string
  portalUrl: string | null
  portalName: string | null
  rollNumberLookup: string
  securityCheck: string
  status: 'Verified' | 'Available' | 'Not Verified'
}

export function BoardPortalsTable({ rows }: { rows: readonly BoardPortalRow[] }) {
  const [query, setQuery] = useState('')

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) =>
        r.shortName.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        (r.portalName && r.portalName.toLowerCase().includes(q)),
    )
  }, [rows, query])

  return (
    <div className="mt-8">
      {/* Header and Search Filter */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f6f0] text-[#007054]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
                <path d="M6 14h6" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Where to Check, Board by Board
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-[13.5px]">
            Each board publishes its own result. The table records what each portal was observed to
            ask for when it was last loaded. Where something has not been verified, it says so
            rather than guessing.
          </p>
        </div>

        {/* Search Bar matching mockup */}
        <div className="relative w-full shrink-0 sm:w-72">
          <label htmlFor="board-search" className="sr-only">
            Search your board
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <SearchIcon width={15} height={15} />
          </div>
          <input
            id="board-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your board..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#007054] focus:ring-1 focus:ring-[#007054] focus:outline-none sm:text-[13px]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <XIcon width={14} height={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs sm:text-[13.5px]">
            <caption className="sr-only">
              Official HSSC Part-II result portals by board, with observed requirements
            </caption>
            <thead className="border-b border-slate-200/90 bg-[#f8fbf9] text-xs font-extrabold text-slate-900">
              <tr>
                <th scope="col" className="w-12 py-3.5 pr-2 pl-5 sm:pl-6">
                  #
                </th>
                <th scope="col" className="px-3 py-3.5 font-extrabold">
                  Board
                </th>
                <th scope="col" className="px-3 py-3.5 font-extrabold">
                  Official result portal
                </th>
                <th scope="col" className="px-3 py-3.5 font-extrabold">
                  Roll number lookup
                </th>
                <th scope="col" className="px-3 py-3.5 font-extrabold">
                  Security check
                </th>
                <th scope="col" className="py-3.5 pr-5 pl-3 text-left font-extrabold sm:pr-6">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No board found matching &ldquo;{query}&rdquo;
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="py-3.5 pr-2 pl-5 font-semibold text-slate-400 sm:pl-6">
                      {row.index}
                    </td>
                    <th scope="row" className="px-3 py-3.5 text-left font-bold text-slate-900">
                      {row.shortName}
                    </th>
                    <td className="px-3 py-3.5">
                      {row.portalUrl ? (
                        <a
                          href={row.portalUrl}
                          rel="noopener nofollow"
                          target="_blank"
                          className="inline-flex items-center gap-1 font-semibold text-[#007054] hover:underline"
                        >
                          <span>{row.portalName}</span>
                          <ExternalLinkIcon width={12} height={12} className="shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400">Not verified</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">{row.rollNumberLookup}</td>
                    <td className="px-3 py-3.5 text-slate-600">{row.securityCheck}</td>
                    <td className="py-3.5 pr-5 pl-3 sm:pr-6">
                      {row.status === 'Verified' ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-0.5 text-[11px] font-bold text-[#007054]">
                          Verified
                        </span>
                      ) : row.status === 'Available' ? (
                        <span className="inline-flex items-center rounded-full border border-blue-200/80 bg-blue-50 px-3 py-0.5 text-[11px] font-bold text-blue-700">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-rose-200/80 bg-rose-50 px-3 py-0.5 text-[11px] font-bold text-rose-700">
                          Not Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Footer Callout */}
      <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-emerald-100/80 bg-[#f0f9f5] px-4 py-3 text-xs text-slate-600 sm:text-[13px]">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#007054] text-[11px] font-bold text-white">
          i
        </span>
        <p>
          <strong className="font-semibold text-slate-800">&ldquo;Not verified&rdquo;</strong> means
          exactly that — not that the board lacks the feature. Where a board&apos;s site refused an
          automated check, nothing is claimed about it either way.
        </p>
      </div>
    </div>
  )
}

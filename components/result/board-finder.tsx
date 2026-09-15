'use client'

import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'

/**
 * The hero's primary control: pick your board, go to its page.
 *
 * WHY THIS IS A BOARD PICKER AND NOT A ROLL-NUMBER BOX.
 *
 * The sibling site's hero takes a roll number, and so does every competitor's.
 * Behind it, none of them can look anything up: no board in Pakistan publishes
 * an API or permits automated lookup, and `BOARD_ADAPTERS` is empty here by
 * policy. A box that accepts a roll number and cannot answer is a promise the
 * page cannot keep — and on a gazette-only board like Karachi there is no
 * roll-number lookup to route to at all.
 *
 * So the control does the thing that is actually true: it is the fastest path
 * to the one page that tells you where YOUR board publishes, what its portal
 * will ask you for, and whether anything has been declared yet.
 *
 * Boards without a page are listed in their own group rather than hidden. A
 * reader looking for Sukkur should see that we know it exists, not conclude
 * the site has never heard of it.
 */

export type BoardOption = {
  slug: string
  shortName: string
  region: string
  hasPage: boolean
}

export function BoardFinder({ boards }: { boards: BoardOption[] }) {
  const router = useRouter()
  const selectId = useId()
  const [slug, setSlug] = useState('')

  const withPage = boards.filter((board) => board.hasPage)
  const withoutPage = boards.filter((board) => !board.hasPage)
  const chosen = boards.find((board) => board.slug === slug)

  function go() {
    if (!chosen) return
    router.push(chosen.hasPage ? `/results/${chosen.slug}/12th-class` : '/boards')
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-elevated)] sm:p-5">
      <label htmlFor={selectId} className="block text-sm font-semibold text-[var(--text-strong)]">
        Which board are you looking for?
      </label>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <select
          id={selectId}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="min-h-12 flex-1 rounded-[var(--radius-button)] border border-[var(--border-card)] bg-white px-3 text-base text-[var(--text-strong)]"
        >
          <option value="">Select your education board…</option>
          <optgroup label="Boards with a result page">
            {withPage.map((board) => (
              <option key={board.slug} value={board.slug}>
                {board.shortName} — {board.region}
              </option>
            ))}
          </optgroup>
          {withoutPage.length > 0 ? (
            <optgroup label="Registered, no page yet">
              {withoutPage.map((board) => (
                <option key={board.slug} value={board.slug}>
                  {board.shortName} — {board.region}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>

        <button
          type="button"
          onClick={go}
          disabled={!chosen}
          // shrink-0 + nowrap: without both, the select's flex-1 squeezes the
          // label onto three lines at common desktop widths.
          className="bg-accent-600 hover:bg-accent-700 inline-flex min-h-12 shrink-0 items-center justify-center rounded-[var(--radius-button)] px-6 text-sm font-semibold whitespace-nowrap text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          Go to my board
        </button>
      </div>

      {/*
        The message changes with the selection rather than warning in advance,
        so a reader who picked a published board is not told about a limitation
        that does not apply to them.
      */}
      <p aria-live="polite" className="mt-3 text-xs text-[var(--text-muted)]">
        {chosen && !chosen.hasPage
          ? `${chosen.shortName} is registered, but not enough has been verified about how it publishes its result to give it a page yet. The directory shows what is known.`
          : 'Takes you to your board’s own page — its official portal, what that portal asks for, and what has actually been announced.'}
      </p>
    </div>
  )
}

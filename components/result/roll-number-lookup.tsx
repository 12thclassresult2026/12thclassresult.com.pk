'use client'

import { useActionState } from 'react'

import type { LookupActionState } from '@/app/results/[board]/12th-class/lookup-action'

import { GazetteResult } from '@/components/result/gazette-result'
import { lookupRollNumber } from '@/app/results/[board]/12th-class/lookup-action'

/**
 * The roll-number form, on a board page that has a published dataset.
 *
 * It is a plain `<form action={...}>` bound to a Server Action, so the roll
 * number is POSTed in the request body. It never becomes a query string, which
 * means it is never in browser history, a referrer header, a shared link or a
 * server log — and this page can never be indexed with someone's identity in
 * it.
 *
 * This component is rendered ONLY for boards whose dataset is published. A
 * gazette-only board with no dataset must not show an input at all: a box you
 * cannot answer is an instruction a reader cannot follow, which is the rule
 * `tests/e2e/core-journeys.spec.ts` has guarded from the start.
 */

const INITIAL: LookupActionState = { status: 'idle' }

export function RollNumberLookup({
  boardSlug,
  boardName,
  year,
  examinationLabel,
  gazetteSourceUrl,
  gazetteCheckedOn,
}: {
  boardSlug: string
  boardName: string
  year: number
  examinationLabel: string
  gazetteSourceUrl: string
  gazetteCheckedOn: string
}) {
  const [state, formAction, pending] = useActionState(lookupRollNumber, INITIAL)

  return (
    <section id="check-result" className="mt-10">
      <h2 className="text-2xl font-bold tracking-tight">
        Check your {examinationLabel} {year} result
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--text-body)]">
        Read from {boardName}’s own gazette. Your roll number is sent once to look it up and is not
        stored, logged, or put in the page address.
      </p>

      <form action={formAction} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="board" value={boardSlug} />
        <div className="sm:w-64">
          <label
            htmlFor="rollNumber"
            className="mb-1.5 block text-sm font-semibold text-[var(--text-strong)]"
          >
            Roll number
          </label>
          <input
            id="rollNumber"
            name="rollNumber"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            placeholder="e.g. 236818"
            className="h-12 w-full rounded-[var(--radius-button)] border border-[var(--border-card)] bg-[var(--surface)] px-3 text-base tabular-nums"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="bg-primary-700 hover:bg-primary-800 inline-flex h-12 items-center justify-center rounded-[var(--radius-button)] px-6 text-sm font-bold text-white disabled:opacity-60"
        >
          {pending ? 'Looking up…' : 'Find my result'}
        </button>
      </form>

      {/*
        `aria-live` so the outcome is announced rather than silently replacing
        the page for anyone not watching the form.
      */}
      <div aria-live="polite">
        {state.status === 'rate-limited' ? (
          <p className="mt-6 rounded-[var(--radius-card)] border border-[var(--color-status-expected)]/30 bg-[var(--color-status-expected-bg)] p-4 text-sm">
            That is a lot of lookups in a short time. Please wait {state.retryAfterSeconds} seconds
            and try again — the limit is there to stop automated collection of other students’
            results.
          </p>
        ) : null}

        {state.status === 'unconfigured' ? (
          <p className="mt-6 rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--color-status-unknown-bg)] p-4 text-sm">
            The result store is not available in this environment, so nothing was looked up. This is
            not a statement about your result.
          </p>
        ) : null}

        {state.status === 'done' ? (
          <GazetteResult
            outcome={state.outcome}
            boardName={boardName}
            year={year}
            examinationLabel={examinationLabel}
            gazetteSourceUrl={gazetteSourceUrl}
            gazetteCheckedOn={gazetteCheckedOn}
          />
        ) : null}
      </div>
    </section>
  )
}

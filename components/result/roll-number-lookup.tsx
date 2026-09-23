'use client'

import { useState } from 'react'
import { useActionState } from 'react'

import type { LookupActionState } from '@/app/results/[board]/12th-class/lookup-action'
import type { ResultSession } from '@/lib/gazettes/datasets'

import { GazetteResult } from '@/components/result/gazette-result'
import { lookupRollNumber } from '@/app/results/[board]/12th-class/lookup-action'
import { CURRENT_SESSION, datasetFor, RESULT_SESSIONS } from '@/lib/gazettes/datasets'

/**
 * The roll-number form on a board page.
 *
 * It is a plain `<form action={...}>` bound to a Server Action, so the roll
 * number is POSTed in the request body. It never becomes a query string, which
 * means it is never in browser history, a referrer header, a shared link or a
 * server log — and this page can never be indexed with someone's identity in
 * it.
 *
 * THE SESSION IS ASKED FOR HERE TOO, and this page was the one still getting
 * it wrong. The homepage form was fixed to name its session; this one kept a
 * heading that read "Check your HSSC Part-II First Annual 2025 result" while
 * the board page around it was about the 2026 result. A student on result
 * morning read a 2025 heading, typed a 2026 roll number, and got either a
 * stranger's record or nothing — the same defect, one page later.
 */

const INITIAL: LookupActionState = { status: 'idle' }

export function RollNumberLookup({
  boardSlug,
  boardName,
}: {
  boardSlug: string
  boardName: string
}) {
  const [state, formAction, pending] = useActionState(lookupRollNumber, INITIAL)
  const [session, setSession] = useState<ResultSession>(CURRENT_SESSION)

  const dataset = datasetFor(boardSlug, session)

  return (
    <section id="check-result" className="mt-10">
      <h2 className="text-2xl font-bold tracking-tight">Search {boardName}’s gazette</h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--text-body)]">
        Choose the examination, then enter your roll number. It is sent once to look it up and is
        not stored, logged, or put in the page address.
      </p>

      <form action={formAction} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="board" value={boardSlug} />
        {/*
          The chosen session travels with the request and is validated on the
          server against the list this site actually offers, so a crafted form
          cannot ask for an arbitrary year.
        */}
        <input type="hidden" name="year" value={session.year} />
        <input type="hidden" name="examination" value={session.examination} />

        <div className="sm:w-56">
          <label
            htmlFor="session"
            className="mb-1.5 block text-sm font-semibold text-[var(--text-strong)]"
          >
            Examination
          </label>
          <select
            id="session"
            value={`${session.year}:${session.examination}`}
            onChange={(e) => {
              const next = RESULT_SESSIONS.find(
                (s) => `${s.year}:${s.examination}` === e.target.value,
              )
              if (next) setSession(next)
            }}
            className="h-12 w-full rounded-[var(--radius-button)] border border-[var(--border-card)] bg-[var(--surface)] px-3 text-base"
          >
            {RESULT_SESSIONS.map((s) => (
              <option key={`${s.year}:${s.examination}`} value={`${s.year}:${s.examination}`}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

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
        Said before the search, not after it. A student who picks a session
        this site holds no gazette for should know that before typing a roll
        number, rather than reading it in a result card.
      */}
      <p className="mt-3 max-w-2xl text-[13px] text-[var(--text-muted)]">
        {dataset
          ? `Read from ${boardName}’s own ${session.label} gazette, checked ${dataset.checkedAt}.`
          : `No ${session.label} gazette is published here for ${boardName} yet. Search anyway — the answer will say so, with a link to the board’s own portal.`}
      </p>

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
            /* The session the SERVER searched, not whatever the select shows now. */
            year={state.session.year}
            examinationLabel={
              datasetFor(boardSlug, state.session)?.examinationLabel ?? state.session.examLabel
            }
            gazetteSourceUrl={datasetFor(boardSlug, state.session)?.sourceUrl ?? ''}
            gazetteCheckedOn={datasetFor(boardSlug, state.session)?.checkedAt ?? ''}
          />
        ) : null}
      </div>
    </section>
  )
}

'use client'

import { useId, useMemo, useState } from 'react'

import {
  COMMON_HSSC_TOTAL,
  PERCENTAGE_ERROR_MESSAGES,
  calculatePercentage,
  formatPercentage,
} from '@/lib/marks/percentage'

/**
 * The percentage calculator.
 *
 * A small client island — the only interactive component on the site — because
 * a calculator that requires a round trip to show a number is not a calculator.
 * Everything around it stays a server component.
 *
 * Accessibility decisions that are not optional here:
 *  - Every field has a real <label>, not a placeholder standing in for one.
 *  - `inputMode="numeric"` so a phone shows a number pad. Most of this
 *    market's traffic is mobile.
 *  - Errors are announced via role="alert" and are conveyed in TEXT, never by
 *    colour alone.
 *  - The result is in an aria-live region, so it is announced when it changes
 *    rather than silently updating.
 */
export function PercentageCalculator() {
  const obtainedId = useId()
  const totalId = useId()
  const errorId = useId()

  const [obtained, setObtained] = useState('')
  const [total, setTotal] = useState(String(COMMON_HSSC_TOTAL))

  const result = useMemo(() => {
    // Nothing is asserted until the reader has actually entered a figure.
    if (obtained.trim() === '') return null
    return calculatePercentage({ obtained: Number(obtained), total: Number(total) })
  }, [obtained, total])

  const error = result?.kind === 'invalid' ? PERCENTAGE_ERROR_MESSAGES[result.reason] : null

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface-raised)] p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={obtainedId}
            className="block text-sm font-medium text-[var(--text-strong)]"
          >
            Marks you obtained
          </label>
          <input
            id={obtainedId}
            type="number"
            inputMode="numeric"
            min={0}
            value={obtained}
            onChange={(event) => setObtained(event.target.value)}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            className="mt-2 min-h-11 w-full rounded-[var(--radius-button)] border border-[var(--border-card)] bg-[var(--surface)] px-3 text-base"
          />
        </div>

        <div>
          <label htmlFor={totalId} className="block text-sm font-medium text-[var(--text-strong)]">
            Total marks
          </label>
          <input
            id={totalId}
            type="number"
            inputMode="numeric"
            min={1}
            value={total}
            onChange={(event) => setTotal(event.target.value)}
            aria-describedby={`${totalId}-hint`}
            className="mt-2 min-h-11 w-full rounded-[var(--radius-button)] border border-[var(--border-card)] bg-[var(--surface)] px-3 text-base"
          />
          {/*
            1100 is pre-filled because it is the common HSSC total, but the
            field is editable and the hint says to check. The total is a
            scheme fact, not a safe default.
          */}
          <p id={`${totalId}-hint`} className="mt-2 text-xs text-[var(--text-muted)]">
            {COMMON_HSSC_TOTAL} is the usual HSSC total (Part-I and Part-II together). Check your
            own result card — schemes differ.
          </p>
        </div>
      </div>

      <div aria-live="polite" className="mt-5">
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-sm font-medium text-[var(--color-status-unknown)]"
          >
            {error}
          </p>
        ) : result?.kind === 'ok' ? (
          <div>
            <p className="text-sm text-[var(--text-muted)]">Your percentage</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-[var(--text-strong)]">
              {formatPercentage(result.percentage)}
            </p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {result.obtained} out of {result.total}
            </p>
            {/*
              THE DELIBERATE OMISSION.

              No grade and no division is printed, because grade bands could
              not be verified — competitors publish mutually inconsistent
              tables. Saying so is more useful than guessing, since the grade
              is the number a student would most likely act on.
            */}
            <p className="mt-4 text-sm text-[var(--text-body)]">
              No grade or division is shown here. Boards publish different grade bands and none
              could be verified from a board’s own source, so the only figure stated is the one the
              arithmetic actually supports.
            </p>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            Enter your obtained marks to see your percentage.
          </p>
        )}
      </div>
    </div>
  )
}

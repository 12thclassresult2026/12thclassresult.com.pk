import type { GazetteRecord } from '@/lib/gazettes/normalize'
import type { LookupOutcome } from '@/lib/gazettes/lookup'

/**
 * Renders one gazette result.
 *
 * WHAT IS NOT HERE IS THE POINT.
 *
 * There is no grade, no percentage, no division, no subject-wise marks, no
 * father's name, no total-marks denominator and no DMC layout. The gazette
 * prints none of them, so this component cannot show them — not styled as
 * "not available", not as an empty row, not at all. Every competitor in this
 * market renders a full mark sheet from a source that does not contain one, and
 * that is the behaviour this component exists to refuse.
 *
 * A gazette line is a NOTICE. The board's own cover page says so: "This Result
 * Gazette is issued as a notice only. Errors and Omissions are EXCEPTED." That
 * sentence is carried onto the page rather than summarised away.
 */

export function GazetteResult({
  outcome,
  boardName,
  year,
  examinationLabel,
  gazetteSourceUrl,
  gazetteCheckedOn,
  boardPageHref,
}: {
  outcome: LookupOutcome
  boardName: string
  year: number
  examinationLabel: string
  gazetteSourceUrl: string
  gazetteCheckedOn: string
  /**
   * Where this board's own page is. Supplied from the homepage, where the
   * reader has not been to that page and "linked above" would be a lie.
   */
  boardPageHref?: string
}) {
  if (outcome.kind === 'invalid-request') {
    return (
      <Notice tone="warning" heading="That does not look like a roll number">
        {outcome.reason}. Check it against your admission slip and try again — nothing was looked
        up.
      </Notice>
    )
  }

  if (outcome.kind === 'dataset-unavailable') {
    /*
     * Deliberately NOT "no result found". The difference matters enormously to
     * the person reading it: one means "you are not in the gazette", the other
     * means "we have not published this gazette yet". Saying the first when the
     * second is true tells a student they failed to appear.
     */
    return (
      <Notice tone="info" heading="This result is not published on this site yet">
        <p>
          {boardName}’s {examinationLabel} {year} gazette has not been published here. This is not a
          statement about your result — it means we have no verified dataset for this board, year
          and examination.
        </p>
        {/*
          The reader may be on the homepage, where nothing is "linked above".
          An honest dead end is still a dead end; point at the page that does
          carry this board's official portal link and verified status.
        */}
        {boardPageHref ? (
          <p className="mt-3">
            Your result may still be available from the board itself.{' '}
            <a
              href={boardPageHref}
              className="text-primary-700 font-semibold underline underline-offset-4"
            >
              Open {boardName}’s page
            </a>{' '}
            for its official portal link and what has actually been announced.
          </p>
        ) : (
          <p className="mt-3">
            Your result may still be available from the board itself. The board’s own gazette and
            portal are linked above.
          </p>
        )}
      </Notice>
    )
  }

  if (outcome.kind === 'not-found') {
    return (
      <Notice tone="warning" heading="That roll number is not in this gazette">
        <p>
          No entry for this roll number appears in {boardName}’s {examinationLabel} {year} gazette.
        </p>
        <p className="mt-3">
          That can mean the roll number belongs to a different examination or year, that it was
          entered incorrectly, or that the entry is genuinely absent from the gazette. The board’s
          gazette is the authority — check it directly before drawing any conclusion.
        </p>
      </Notice>
    )
  }

  const record = outcome.record

  return (
    <section
      className="mt-8 rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface)]"
      aria-label="Gazette result"
    >
      <header className="border-b border-[var(--border-subtle)] px-6 py-5">
        <p className="eyebrow">Gazette entry</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">{record.candidateName}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Roll number {record.rollNumber} · {boardName} · {examinationLabel} {year}
        </p>
      </header>

      <div className="px-6 py-5">
        <StatusLine record={record} />

        <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          {/* Marks appear ONLY when the gazette printed a total. */}
          {record.obtainedMarks !== null ? (
            <Field label="Marks obtained">
              <span className="text-xl font-bold text-[var(--text-strong)] tabular-nums">
                {record.obtainedMarks}
              </span>
              {/*
                No denominator. The gazette prints a total and not what it is out
                of, and "621 / 1100" would be our arithmetic presented as the
                board's.
              */}
              <span className="mt-1 block text-xs text-[var(--text-muted)]">
                The gazette prints this total without stating what it is out of.
              </span>
            </Field>
          ) : null}

          {record.partIFailedSubjects.length > 0 ? (
            <Field label="Part-I, subjects to clear">{record.partIFailedSubjects.join(', ')}</Field>
          ) : null}

          {record.partIIFailedSubjects.length > 0 ? (
            <Field label="Part-II, subjects to clear">
              {record.partIIFailedSubjects.join(', ')}
            </Field>
          ) : null}

          {record.institution !== null ? (
            <Field label="Institution">{record.institution}</Field>
          ) : null}

          {record.remarks !== null ? <Field label="Remarks">{record.remarks}</Field> : null}
        </dl>

        {/*
          The board's own words, verbatim. If anything above is a misreading of
          the page, this is the line that lets a reader catch it.
        */}
        <details className="mt-6 rounded-[var(--radius-button)] bg-[var(--surface-sunken)] px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-[var(--text-strong)]">
            Show the gazette’s exact wording
          </summary>
          <pre className="mt-3 text-sm whitespace-pre-wrap text-[var(--text-body)]">
            {record.rawResultStatus}
          </pre>
        </details>
      </div>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-raised)] px-6 py-4 text-xs text-[var(--text-muted)]">
        <p className="font-semibold text-[var(--text-body)]">
          This is a gazette notice, not a Detailed Marks Certificate.
        </p>
        <p className="mt-2">
          {boardName}’s gazette states that it “is issued as a notice only. Errors and Omissions are
          EXCEPTED.” Your DMC from the board is the document that counts for admission and
          employment.
        </p>
        <p className="mt-3">
          Read from {boardName}’s own gazette, page {record.sourcePage}, checked {gazetteCheckedOn}.{' '}
          <a
            href={gazetteSourceUrl}
            rel="noopener nofollow"
            className="text-primary-700 font-semibold underline underline-offset-4"
          >
            Open the original gazette
          </a>
        </p>
      </footer>
    </section>
  )
}

function StatusLine({ record }: { record: GazetteRecord }) {
  const config = {
    passed: {
      label: 'Passed',
      className: 'bg-[var(--color-status-confirmed-bg)] text-[var(--color-status-confirmed)]',
    },
    failed: {
      label: 'Not cleared — subjects remain',
      className: 'bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger)]',
    },
    absent: {
      label: 'Recorded absent',
      className: 'bg-[var(--color-status-expected-bg)] text-[var(--color-status-expected)]',
    },
    unknown: {
      label: 'The gazette’s wording here is not one we can interpret',
      className: 'bg-[var(--color-status-unknown-bg)] text-[var(--color-status-unknown)]',
    },
  }[record.resultStatus]

  return (
    <div>
      <span
        className={`inline-flex rounded-[var(--radius-badge)] px-3 py-1 text-sm font-semibold ${config.className}`}
      >
        {config.label}
      </span>
      {record.resultStatus === 'unknown' ? (
        /*
         * 29 records in the Gujranwala 2025 gazette read "SN", which no board
         * document we hold defines. Guessing would put an invented outcome in
         * front of a student, so the exact text is shown and nothing is claimed.
         */
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-body)]">
          Your entry exists in the gazette, but its result code is one we have not been able to
          confirm the meaning of. The exact wording is shown below — please read it on the board’s
          own gazette rather than relying on any interpretation here.
        </p>
      ) : null}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-medium text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-1 text-[var(--text-strong)]">{children}</dd>
    </div>
  )
}

function Notice({
  tone,
  heading,
  children,
}: {
  tone: 'info' | 'warning'
  heading: string
  children: React.ReactNode
}) {
  const className =
    tone === 'warning'
      ? 'border-[var(--color-status-expected)]/30 bg-[var(--color-status-expected-bg)]'
      : 'border-[var(--border-card)] bg-[var(--color-status-unknown-bg)]'

  return (
    <section className={`mt-8 rounded-[var(--radius-card)] border p-6 ${className}`}>
      <h2 className="font-semibold text-[var(--text-strong)]">{heading}</h2>
      <div className="mt-3 max-w-2xl text-sm text-[var(--text-body)]">{children}</div>
    </section>
  )
}

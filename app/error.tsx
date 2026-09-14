'use client'

/**
 * Root error boundary.
 *
 * Logs ONLY `error.digest` — never the stack or the payload (section 36). The
 * digest is shown to the reader as a correlation reference so a report can be
 * matched to a server log without any internal detail reaching the page.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  if (error.digest) {
    console.error(`Unhandled error. digest=${error.digest}`)
  }

  return (
    <div className="container-wide py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Something went wrong</h1>
      <p className="mt-4 max-w-2xl text-[var(--text-body)]">
        This page could not be displayed. Nothing is wrong with your result — this is a fault on
        this site. Please try again.
      </p>
      {error.digest ? (
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          Reference: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="bg-primary-700 hover:bg-primary-800 mt-8 inline-flex min-h-11 items-center rounded-[var(--radius-button)] px-5 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  )
}

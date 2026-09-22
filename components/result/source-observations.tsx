import type { Board } from '@/lib/board/types'
import type { ResultSource } from '@/lib/result-sources/types'

import { statusFor } from '@/lib/board/result-status'
import { linkableSources } from '@/lib/result-sources/registry'

/**
 * What this board's portal actually offers, in the board's own words.
 *
 * WHY THIS EXISTS: a similarity check across the board pages found some of them
 * 73% alike — the boards with the least rendered data were near-copies of each
 * other with a name swapped. That is doorway-page shape, and the honest fix is
 * not synonyms; it is showing the verified board-specific facts that were
 * already collected and were sitting unused in the source registry.
 *
 * Every field here was OBSERVED on the board's own page and is rendered
 * VERBATIM. Rawalpindi's dropdown says "HSSC Second Annual Examination" while
 * Larkana's says "HSC-II" and adds a group selector — normalising those into a
 * house style would destroy exactly the information a student needs to
 * recognise the screen in front of them.
 */
export function SourceObservations({ board }: { board: Board }) {
  const status = statusFor(board.id)
  const sources = linkableSources(board.id).filter(
    (source) => source.observedVia !== 'not-observed' && hasSomethingToShow(source),
  )
  if (sources.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold tracking-tight">What the portal will ask you for</h2>
      <p className="mt-3 max-w-3xl text-[var(--text-body)]">
        Recorded from {board.shortName}’s own page. The wording below is the board’s, not ours — it
        is what you will see on screen.
      </p>

      <div className="mt-6 space-y-6">
        {sources.map((source) => (
          <article
            key={source.id}
            className="rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface-raised)] p-5"
          >
            <h3 className="font-semibold text-[var(--text-strong)]">{source.name}</h3>

            <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
              {source.lookupModesObserved.length > 0 ? (
                <>
                  <dt className="font-medium text-[var(--text-strong)]">Options it offers</dt>
                  <dd className="text-[var(--text-body)]">
                    {/* Verbatim. A board that writes "Inter Supplementary" is
                        not describing the same thing as one writing "HSC-II". */}
                    {source.lookupModesObserved.map((mode) => `“${mode}”`).join(', ')}
                  </dd>
                </>
              ) : null}

              {source.yearsObserved.length > 0 ? (
                <>
                  <dt className="font-medium text-[var(--text-strong)]">Years available</dt>
                  <dd className="text-[var(--text-body)]">{yearSpan(source.yearsObserved)}</dd>
                </>
              ) : null}

              {source.additionalIdentifiersObserved.length > 0 ? (
                <>
                  <dt className="font-medium text-[var(--text-strong)]">Also asks for</dt>
                  <dd className="text-[var(--text-body)]">
                    {source.additionalIdentifiersObserved.join(', ')}
                    {/* Worth flagging before a reader leaves the site: a B-Form
                        or CNIC is not something every candidate has to hand. */}
                    <span className="mt-1 block text-xs text-[var(--text-muted)]">
                      Have this ready before you open the portal.
                    </span>
                  </dd>
                </>
              ) : null}
            </dl>

            {/*
              WHAT USED TO BE HERE: `source.provenanceNote`, rendered raw.
              That field is an operator's working note — it carries field names
              in backticks, redirect chains and parser caveats — and on the
              Peshawar page it told students, in our voice:

                "The portal exposes ONE session at a time and was serving SSC
                 Annual-I 2026, so no HSSC entry point was present at all.
                 `examLevelsObserved` is therefore empty"

              A student wanting their 12th result read that as "there is no
              12th result here". It was also, by then, wrong: the board had
              been serving HSSC Annual-I 2026 since 21 September.

              The operator note stays in the registry where it belongs. What a
              reader gets instead is the session observed on that board's
              portal today, which is the thing they are actually trying to
              recognise on screen.
            */}
            {status?.portalSessionObserved ? (
              <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
                <p className="text-xs text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--text-strong)]">
                    Currently showing:
                  </span>{' '}
                  {status.portalSessionObserved}
                  <span className="block">Checked {status.lastVerifiedAt}.</span>
                </p>
                {status.captcha === 'required' ? (
                  <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                    Complete the security check on the official website.
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function hasSomethingToShow(source: ResultSource): boolean {
  return (
    source.lookupModesObserved.length > 0 ||
    source.yearsObserved.length > 0 ||
    source.additionalIdentifiersObserved.length > 0 ||
    source.provenanceNote.length > 0
  )
}

/**
 * Render observed years as a span where they are contiguous, and as a list
 * where they are not — because a gap is itself information about which
 * sessions a board keeps online.
 */
function yearSpan(years: number[]): string {
  const sorted = [...years].sort((a, b) => a - b)
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  if (first === undefined || last === undefined) return ''
  const contiguous = sorted.length === last - first + 1
  return contiguous && sorted.length > 2 ? `${first}–${last}` : sorted.join(', ')
}

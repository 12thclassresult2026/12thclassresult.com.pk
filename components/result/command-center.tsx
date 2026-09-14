import type { Board } from '@/lib/board/types'
import type { ResultFallback } from '@/lib/result/fallback'

import { AccessModelAction } from './access-model-action'
import { SourceHealthNote } from './source-health-note'
import { buildFallbacks, primarySourceFor } from '@/lib/result/fallback'

/**
 * The Result Command Center.
 *
 * One block that answers "what can I actually do right now?" for this board,
 * built only from that board's verified capabilities. It has three parts, in
 * this order:
 *
 *   1. The primary route — whatever this board's access model makes it.
 *   2. Every other legitimate route, ordered by how likely it is to work.
 *   3. When the primary source was last checked, and whether that is stale.
 *
 * WHAT IS NOT HERE IS THE POINT. There is no roll-number input, because this
 * site does not hold anyone's result and cannot query a board that has not
 * permitted it. Rendering a box that posts nowhere — or worse, posts to a
 * board that never agreed to it — would be the dishonest version of this
 * component, and it is the version every competitor ships.
 *
 * The ladder is deduplicated against the primary route, so a reader is never
 * offered the same link twice under two headings.
 */
export function ResultCommandCenter({ board }: { board: Board }) {
  const primary = primarySourceFor(board)
  const ladder = buildFallbacks(board).filter((fallback) => {
    if (fallback.type === 'retry' || fallback.type === 'sms') return true
    return fallback.url !== primary?.url
  })

  return (
    <section aria-labelledby="how-to-check">
      <h2 id="how-to-check" className="sr-only">
        How to check this result
      </h2>

      <AccessModelAction board={board} />

      {ladder.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-[var(--text-strong)]">If that does not work</h3>
          <ul className="mt-3 space-y-3">
            {ladder.map((fallback) => (
              <li key={fallbackKey(fallback)}>
                <FallbackRow fallback={fallback} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {primary ? <SourceHealthNote sourceId={primary.id} className="mt-5" /> : null}
    </section>
  )
}

function fallbackKey(fallback: ResultFallback): string {
  switch (fallback.type) {
    case 'sms':
      return `sms:${fallback.shortcode}`
    case 'retry':
      return 'retry'
    default:
      return `${fallback.type}:${fallback.url}`
  }
}

/**
 * One rung of the ladder.
 *
 * The `switch` is exhaustive, so a new fallback kind cannot be added to the
 * model without a deliberate decision about how a reader sees it.
 */
function FallbackRow({ fallback }: { fallback: ResultFallback }) {
  switch (fallback.type) {
    case 'gazette':
      return (
        <FallbackLink
          href={fallback.url}
          label={fallback.name}
          detail="Open the gazette file for your group and search it for your roll number."
        />
      )

    case 'official-portal':
      return (
        <FallbackLink
          href={fallback.url}
          label={fallback.name}
          detail={fallback.note ?? 'The board’s own result portal.'}
        />
      )

    case 'board-website':
      return (
        <FallbackLink
          href={fallback.url}
          label={fallback.name}
          detail="Go to the board’s own site rather than a third-party link."
        />
      )

    case 'sms':
      /*
       * Reachable only from a shortcode confirmed on a board's own domain. No
       * board was observed publishing one, so this does not render today — and
       * a test asserts that. The codes circulating on aggregator sites
       * contradict each other and an SMS is charged, so a wrong one costs a
       * student money and returns nothing.
       */
      return (
        <div className="text-sm">
          <p className="font-medium text-[var(--text-strong)]">SMS: send to {fallback.shortcode}</p>
          <p className="mt-1 text-[var(--text-muted)]">{fallback.messageFormat}</p>
          <a
            href={fallback.sourceUrl}
            rel="noopener nofollow"
            className="text-primary-700 mt-1 inline-block text-xs underline underline-offset-4"
          >
            Where this code came from
          </a>
        </div>
      )

    case 'retry':
      return <p className="text-sm text-[var(--text-muted)]">{fallback.message}</p>

    default: {
      const exhaustive: never = fallback
      return exhaustive
    }
  }
}

function FallbackLink({ href, label, detail }: { href: string; label: string; detail: string }) {
  return (
    <div className="text-sm">
      <a
        href={href}
        rel="noopener nofollow"
        className="text-primary-700 font-medium underline underline-offset-4"
      >
        {label}
      </a>
      <p className="mt-1 text-[var(--text-muted)]">{detail}</p>
    </div>
  )
}

import type { Board } from '@/lib/board/types'
import type { ResultSource } from '@/lib/result-sources/types'

import { gazetteSources, linkableSources, rollNumberSources } from '@/lib/result-sources/registry'
import { isSourced } from './verified-fact'

/**
 * The single definition of "the route this board's reader should take first".
 *
 * Both the primary call to action and the fallback ladder derive from this, so
 * the button at the top of a board page and the list below it cannot disagree
 * about which source is primary — and the page cannot offer the same link
 * twice under two different headings.
 */
export function primarySourceFor(board: Board): ResultSource | undefined {
  switch (board.accessModel) {
    case 'gazette-only':
      return gazetteSources(board.id)[0] ?? linkableSources(board.id)[0]
    case 'roll-number-portal':
    case 'session-rotating-portal':
      return rollNumberSources(board.id)[0] ?? linkableSources(board.id)[0]
    case 'unverified':
      // Deliberately the homepage and nothing deeper: we could not verify how
      // this board publishes results, so a deep link would be a guess.
      return linkableSources(board.id).find((source) => source.sourceType === 'official-homepage')
    default: {
      const exhaustive: never = board.accessModel
      return exhaustive
    }
  }
}

/**
 * The fallback ladder.
 *
 * When a direct lookup is unavailable — which today is every board — the site
 * must still be useful. This builds the ordered list of things a reader can
 * actually do, **from that board's verified capabilities only**.
 *
 * The ordering is the priority from the research:
 *
 *   direct lookup → official portal → verified SMS → verified gazette → retry
 *
 * Two rules make this honest rather than decorative:
 *
 *  1. An SMS entry is emitted ONLY from a `confirmed` fact carrying a source.
 *     No board in Pakistan was observed publishing a shortcode on its own
 *     domain, so today this branch never fires — and a test asserts it. The
 *     codes circulating on aggregator sites contradict each other, and an SMS
 *     is charged: a wrong shortcode costs a student money and returns nothing.
 *
 *  2. A gazette entry is emitted only from a verified gazette source. For a
 *     `gazette-only` board it is not a fallback at all — it is the primary
 *     route, and it is ordered first.
 */

export type ResultFallback =
  | { type: 'official-portal'; url: string; name: string; note?: string }
  | { type: 'gazette'; url: string; name: string; primary: boolean }
  | { type: 'sms'; shortcode: string; messageFormat: string; sourceUrl: string }
  | { type: 'board-website'; url: string; name: string }
  | { type: 'retry'; message: string }

export function buildFallbacks(board: Board): ResultFallback[] {
  const fallbacks: ResultFallback[] = []
  const gazetteFirst = board.accessModel === 'gazette-only'

  const gazettes = gazetteSources(board.id)
    .filter((source) => source.status !== 'offline')
    .map<ResultFallback>((source) => ({
      type: 'gazette',
      url: source.url,
      name: source.name,
      primary: gazetteFirst,
    }))

  // For a gazette-only board the gazette IS the route, so it leads.
  if (gazetteFirst) fallbacks.push(...gazettes)

  for (const source of rollNumberSources(board.id)) {
    fallbacks.push({
      type: 'official-portal',
      url: source.url,
      name: source.name,
      ...(source.hasCaptcha === 'verified-supported'
        ? { note: 'This portal asks you to complete a security check yourself.' }
        : {}),
    })
  }

  /*
   * SMS: gated on a confirmed, sourced fact. `isSourced` narrows away the
   * nulls, so an unsourced shortcode cannot reach a reader even by mistake.
   */
  if (board.smsCode.status === 'confirmed' && isSourced(board.smsCode)) {
    fallbacks.push({
      type: 'sms',
      shortcode: board.smsCode.value,
      messageFormat: board.smsCode.validFor ?? 'Send your roll number to this number.',
      sourceUrl: board.smsCode.sourceUrl,
    })
  }

  if (!gazetteFirst) fallbacks.push(...gazettes)

  /*
   * The board's own website, always last and always present.
   *
   * The reason it is unconditional: the single most common way a student is
   * misled in this market is by landing on an aggregator that looks official.
   * Knowing the board's real domain is useful even when every other route
   * works, and it is the only rung that still helps if all of them break.
   *
   * `officialWebsite` is registry-verified identity data, not an inference.
   */
  const homepage =
    linkableSources(board.id).find((source) => source.sourceType === 'official-homepage') ?? null

  fallbacks.push({
    type: 'board-website',
    url: homepage?.url ?? board.officialWebsite,
    name: homepage?.name ?? `${board.shortName} official website`,
  })

  // Deduplicate by URL, keeping the earliest (highest-priority) occurrence, so
  // a board whose homepage IS its result page is not listed twice.
  const seen = new Set<string>()
  return fallbacks.filter((fallback) => {
    if (fallback.type === 'retry' || fallback.type === 'sms') return true
    if (seen.has(fallback.url)) return false
    seen.add(fallback.url)
    return true
  })
}

/**
 * Adds a retry suggestion, but only where retrying could plausibly help.
 *
 * Never offered when the board has no lookup at all, or when the result has not
 * been announced — telling someone to try again for something that does not
 * exist yet wastes their time on the one morning it matters.
 */
export function withRetry(fallbacks: ResultFallback[], message: string): ResultFallback[] {
  return [...fallbacks, { type: 'retry', message }]
}

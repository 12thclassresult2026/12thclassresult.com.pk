import type { Board } from '@/lib/board/types'
import type { LookupOutcome, ResultRecord } from '@/lib/result/types'
import type { ResultQuery } from '@/lib/validation/result-query'

import { GROUP_LABELS } from '@/lib/board/types'
import { datasetFor, datasetsFor, getBoardBySlug } from '@/lib/board/registry'
import { buildFallbacks, withRetry, type ResultFallback } from '@/lib/result/fallback'
import { resultQuerySchema } from '@/lib/validation/result-query'
import { getAdapterForBoard } from './adapter'
import { ResultSourceError, publicMessageFor, type ResultErrorCode } from './errors'
import {
  SOURCE_TIMEOUT_MS,
  availabilityForError,
  cacheHealth,
  canAttempt,
  recordFailure,
  recordSuccess,
} from './health'
import { getSource, gazetteSources } from './registry'

/**
 * THE RESULT SERVICE.
 *
 * One entry point, one return type, and no path that can produce a result the
 * system did not actually obtain. Callers get a `LookupOutcome` and nothing
 * else — no thrown errors, no partial records, no `null` meaning four things.
 *
 * The order of checks below is a product decision, not an implementation
 * detail:
 *
 *   validate → declaration state → route availability → upstream call
 *
 * Declaration state comes BEFORE route availability because it is the more
 * useful answer. A Karachi Commerce candidate whose group has not been declared
 * is better served by "Commerce has not been declared yet" than by "this board
 * has no online checker" — both are true, but only one tells them what to do
 * next, and only one stops them re-checking every hour for a fortnight.
 *
 * Nothing here ever fabricates a record. Every `found` outcome carries the
 * source id and URL it came from.
 */

export type LookupOptions = {
  /** Injectable for tests. Never varied in production. */
  now?: Date
  /** Upstream budget. A reader is better served a link than a long spinner. */
  timeoutMs?: number
}

export async function lookupResult(
  input: unknown,
  options: LookupOptions = {},
): Promise<LookupOutcome> {
  const parsed = resultQuerySchema.safeParse(input)
  if (!parsed.success) {
    /*
     * The Zod issue text is deliberately not returned. It names internal field
     * paths and constraints, and a reader gains nothing from "String must
     * contain at least 4 character(s) at rollNumber".
     */
    return { kind: 'invalid-request', message: publicMessageFor('VALIDATION_ERROR') }
  }

  const query = parsed.data
  const board = getBoardBySlug(query.board)
  if (!board) {
    // Unreachable while the schema refines on the registry; kept because
    // "unreachable" is a property of today's code, not a guarantee.
    return { kind: 'invalid-request', message: publicMessageFor('BOARD_UNSUPPORTED') }
  }

  const fallbacks = buildFallbacks(board)

  const notAnnounced = declarationOutcome(board, query, fallbacks)
  if (notAnnounced) return notAnnounced

  return routeLookup(board, query, fallbacks, options)
}

/**
 * Decide whether we can positively say the result is NOT out yet.
 *
 * Returns `null` when we do not know — and "we do not know" is the common case,
 * because only one board has a confirmed HSSC Part-II 2026 date. Falling
 * through to the board's own portal is the right behaviour there: the board is
 * authoritative about its own declaration, and we are not.
 *
 * This function NEVER claims a result is not announced from missing data.
 * Absence of a dataset is absence of evidence.
 */
function declarationOutcome(
  board: Board,
  query: ResultQuery,
  fallbacks: ResultFallback[],
): LookupOutcome | null {
  if (board.declarationModel === 'per-group') {
    // Without a group we cannot resolve a per-group board's state, and we will
    // not substitute another group's date for the candidate's own.
    if (!query.group) return null

    const dataset = datasetFor(board.id, query.year, query.group)
    if (!dataset) return null

    if (isPositivelyUnreleased(dataset.released)) {
      return {
        kind: 'not-announced-for-group',
        message: `The ${GROUP_LABELS[query.group]} result for ${board.shortName} ${query.year} has not been announced yet.`,
        boardId: board.id,
        group: query.group,
        fallbacks,
      }
    }

    /*
     * The comparative case, and the one that actually occurs.
     *
     * A board that declares group by group gives us real evidence when it
     * declares some and not others: we have seen it announce five of seven
     * groups, and this candidate's group was not among them. That is worth
     * saying, and saying it stops a Commerce candidate concluding from a
     * board-level "result announced" that their own result is missing.
     *
     * The phrasing is observational on purpose. We did not see the board say
     * "Commerce is not out"; we saw it not declare Commerce. Those are
     * different claims and only the second one is ours to make.
     */
    if (dataset.released.status !== 'confirmed') {
      const siblings = datasetsFor(board.id, query.year).filter((d) => d.group !== null)
      const declared = siblings.filter((d) => d.released.value === true)
      if (declared.length > 0 && declared.length < siblings.length) {
        return {
          kind: 'not-announced-for-group',
          message: `${board.shortName} had declared ${declared.length} of its ${siblings.length} ${query.year} groups when we last checked, and ${GROUP_LABELS[query.group]} was not among them.`,
          boardId: board.id,
          group: query.group,
          fallbacks,
        }
      }
    }
    return null
  }

  const dataset = datasetFor(board.id, query.year, null)
  if (!dataset) return null
  if (isPositivelyUnreleased(dataset.released)) {
    return {
      kind: 'not-announced',
      message: `The ${board.shortName} ${query.year} result has not been announced yet.`,
      boardId: board.id,
      fallbacks,
    }
  }
  return null
}

/**
 * A released-flag counts as "not announced" only when it is CONFIRMED false.
 *
 * A tentative or expected flag is someone's estimate, and an estimate must
 * never become a statement to a candidate refreshing the page on result day.
 */
function isPositivelyUnreleased(released: { value: boolean | null; status: string }): boolean {
  return released.value === false && released.status === 'confirmed'
}

/**
 * Route the lookup according to how the board actually publishes results.
 *
 * The `switch` is exhaustive by compiler check. A new access model cannot be
 * added to the registry without the compiler demanding a decision here — which
 * is the guard that stopped the original single-model design from shipping a
 * roll-number box to a board that has no roll-number lookup.
 */
async function routeLookup(
  board: Board,
  query: ResultQuery,
  fallbacks: ResultFallback[],
  options: LookupOptions,
): Promise<LookupOutcome> {
  switch (board.accessModel) {
    case 'gazette-only': {
      const gazette = gazetteSources(board.id)[0]
      return {
        kind: 'no-lookup-exists',
        message: `${board.shortName} does not publish an online roll-number result check. Its results are released as a gazette.`,
        boardId: board.id,
        ...(gazette ? { gazetteSourceId: gazette.id } : {}),
        fallbacks,
      }
    }

    case 'session-rotating-portal':
      /*
       * The portal exists but its address changes each session, so any URL we
       * stored would eventually send a candidate somewhere wrong — or nowhere.
       * Linking the board's own results index is the only durable answer.
       */
      return {
        kind: 'unsupported',
        message: `${board.shortName} publishes a new result portal for each session, so it has to be opened from the board's own site.`,
        boardId: board.id,
        fallbacks,
      }

    case 'unverified':
      return {
        kind: 'unsupported',
        message: `We have not been able to verify how ${board.shortName} publishes its results, so we will not guess.`,
        boardId: board.id,
        fallbacks,
      }

    case 'roll-number-portal':
      return attemptDirectLookup(board, query, fallbacks, options)

    default: {
      const exhaustive: never = board.accessModel
      return {
        kind: 'unsupported',
        message: publicMessageFor('BOARD_UNSUPPORTED'),
        boardId: String(exhaustive),
        fallbacks,
      }
    }
  }
}

/**
 * The direct path — used only where an adapter is registered AND permitted.
 *
 * No adapter is registered today, so in production this returns `unsupported`
 * with the board's official portal attached. That is the correct outcome, not a
 * stub: no board has granted automated access, and fetching a candidate's name,
 * father's name and marks from a portal that has not permitted it is not a
 * feature we are entitled to ship.
 */
async function attemptDirectLookup(
  board: Board,
  query: ResultQuery,
  fallbacks: ResultFallback[],
  options: LookupOptions,
): Promise<LookupOutcome> {
  const adapter = getAdapterForBoard(board.id)
  if (!adapter) {
    return {
      kind: 'unsupported',
      message: `${board.shortName} results have to be checked on the board's own portal.`,
      boardId: board.id,
      fallbacks,
    }
  }

  const now = options.now?.getTime() ?? Date.now()
  if (!canAttempt(adapter.sourceId, now)) {
    // The breaker is open: the board is already struggling. Adding load would
    // make its outage worse for everyone, including the candidates we serve.
    return {
      kind: 'source-unavailable',
      message: publicMessageFor('SOURCE_OFFLINE'),
      boardId: board.id,
      retryAfterSeconds: 120,
      fallbacks: withRetry(fallbacks, 'The board’s portal is under heavy load. Try again shortly.'),
    }
  }

  const timeoutMs = options.timeoutMs ?? SOURCE_TIMEOUT_MS

  try {
    const record = await adapter.lookup(query, AbortSignal.timeout(timeoutMs))
    recordSuccess(adapter.sourceId)
    noteHealth(adapter.sourceId, 'online', options)

    if (record === null) {
      /*
       * A genuine "no such record" — and the ONLY place `not-found` is
       * produced. It can be reached only from an adapter that completed
       * successfully and explicitly reported no record. A parse failure throws
       * instead, so a redesigned page can never masquerade as a missing result.
       */
      return {
        kind: 'not-found',
        message: `No ${query.year} record was returned for that roll number at ${board.shortName}. Check the digits, or confirm on the board's portal.`,
        boardId: board.id,
        fallbacks,
      }
    }

    return { kind: 'found', record: assertProvenance(record) }
  } catch (error) {
    return failureOutcome(board, adapter.sourceId, error, fallbacks, options)
  }
}

/**
 * Provenance is not optional.
 *
 * A record without a source id and URL cannot be shown, because a reader cannot
 * check it and we cannot defend it. Throwing here converts a silent data defect
 * into a visible failure that falls back to the official link.
 */
function assertProvenance(record: ResultRecord): ResultRecord {
  if (!record.sourceId || !record.sourceUrl) {
    throw new ResultSourceError('PARSER_FAILURE', {
      detail: 'adapter returned a record without provenance',
    })
  }
  if (!getSource(record.sourceId)) {
    throw new ResultSourceError('PARSER_FAILURE', {
      detail: `adapter returned unknown sourceId ${record.sourceId}`,
    })
  }
  return record
}

function failureOutcome(
  board: Board,
  sourceId: string,
  error: unknown,
  fallbacks: ResultFallback[],
  options: LookupOptions,
): LookupOutcome {
  const code = classify(error)
  recordFailure(sourceId, code, options.now?.getTime() ?? Date.now())
  noteHealth(sourceId, availabilityForError(code), options)

  if (code === 'CAPTCHA_REQUIRED') {
    /*
     * The board asks a human to prove they are one. That request is legitimate
     * and we do not attempt to satisfy it programmatically — we hand the reader
     * the link and let them answer it themselves, which is the only correct
     * response to a control a board has deliberately put in place.
     */
    return {
      kind: 'unsupported',
      message: publicMessageFor('CAPTCHA_REQUIRED'),
      boardId: board.id,
      fallbacks,
    }
  }

  const retryable = code === 'SOURCE_TIMEOUT' || code === 'SOURCE_OFFLINE'
  return {
    kind: 'source-unavailable',
    message: publicMessageFor(code),
    boardId: board.id,
    retryAfterSeconds: retryable ? 60 : null,
    fallbacks: retryable
      ? withRetry(fallbacks, 'This is usually temporary. Your result is not affected.')
      : fallbacks,
  }
}

/**
 * Classify an unknown thrown value.
 *
 * An unrecognised throw becomes `PARSER_FAILURE` rather than `INTERNAL_ERROR`
 * deliberately: an unexpected exception during a lookup most often means the
 * page shape changed under us, and that classification fails toward the
 * official link instead of toward a confident wrong answer.
 */
function classify(error: unknown): ResultErrorCode {
  if (error instanceof ResultSourceError) return error.code
  if (error instanceof Error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') return 'SOURCE_TIMEOUT'
    if (error.name === 'TypeError') return 'SOURCE_OFFLINE'
  }
  return 'PARSER_FAILURE'
}

/**
 * Record availability only — never result state.
 *
 * A successful fetch says the server answered. It says nothing about whether a
 * result has been declared, so `resultState` is carried over from the registry
 * and is never promoted by a probe.
 */
function noteHealth(
  sourceId: string,
  availability: ReturnType<typeof availabilityForError>,
  options: LookupOptions,
): void {
  cacheHealth({
    sourceId,
    checkedAt: (options.now ?? new Date()).toISOString(),
    availability,
    // Hard-coded `unknown`, and it must stay that way. A lookup tells us the
    // server responded; it does not tell us the board has declared anything.
    // Only a verified declaration may set a result state.
    resultState: 'unknown',
  })
}

/**
 * Whether a board can be looked up here at all.
 *
 * Used by the UI to decide whether to render a lookup form — the check that
 * keeps a roll-number box off a board that has no roll-number lookup.
 */
export function supportsDirectLookup(boardId: string): boolean {
  return getAdapterForBoard(boardId) !== undefined
}

export function isUpstreamOutcome(outcome: LookupOutcome): boolean {
  return outcome.kind === 'source-unavailable'
}

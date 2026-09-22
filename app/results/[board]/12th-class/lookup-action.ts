'use server'

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { headers } from 'next/headers'

import type { LookupOutcome } from '@/lib/gazettes/lookup'

import type { ResultSession } from '@/lib/gazettes/datasets'

import { getBoardBySlug } from '@/lib/board/registry'
import { CURRENT_SESSION, resolveSession } from '@/lib/gazettes/datasets'
import { lookupResult } from '@/lib/gazettes/lookup'
import { createD1Store } from '@/lib/gazettes/store-d1'
import { clientKey, rateLimit } from '@/lib/security/rate-limit'

/**
 * Look up one student's result.
 *
 * A SERVER ACTION, NOT A ROUTE WITH A QUERY STRING. The roll number travels in
 * the request body and never enters a URL — so it is never in a browser's
 * history, a referrer header, a server access log or an analytics hit, and the
 * page can never be shared or indexed with someone's identity in it.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO:
 *  - It logs nothing. Not the roll number, not the name, not a hit counter
 *    keyed on either.
 *  - It rate-limits on the CLIENT, never on the roll number. Limiting per roll
 *    number would both store the identifier and let one client walk the whole
 *    cohort one number at a time.
 *  - It returns one record or none. There is no list, prefix or range to ask
 *    for, because `GazetteStore` cannot express one.
 */

/** Generous for a person checking a few siblings, useless for enumerating 138,617. */
const LOOKUPS_PER_WINDOW = 12
const WINDOW_MS = 60_000

export type LookupActionState =
  | { status: 'idle' }
  | { status: 'rate-limited'; retryAfterSeconds: number }
  | { status: 'unconfigured' }
  /** The session that was actually searched travels back with the answer. */
  | { status: 'done'; outcome: LookupOutcome; session: ResultSession }

export async function lookupRollNumber(
  _previous: LookupActionState,
  formData: FormData,
): Promise<LookupActionState> {
  const boardSlug = String(formData.get('board') ?? '')
  const rollNumber = String(formData.get('rollNumber') ?? '')

  /*
   * THE SESSION COMES FROM THE FORM AND IS VALIDATED, never assumed.
   *
   * This used to read `year: 2025, examination: 'first-annual'` as literals
   * while every page around it was headed "12th Class Result 2026". A student
   * checking on result morning would have had the 2025 gazette searched under
   * their 2026 roll number — which either finds a different candidate who held
   * that number last year, or reports "no result" for one that has just been
   * declared. Neither answer looks wrong on screen.
   *
   * `resolveSession` accepts only a session this site offers, so a crafted
   * form cannot ask for an arbitrary year.
   */
  const session = resolveSession(formData.get('year'), formData.get('examination'))
  if (!session) {
    return {
      status: 'done',
      outcome: { kind: 'invalid-request', reason: 'unrecognised examination session' },
      session: CURRENT_SESSION,
    }
  }

  const board = getBoardBySlug(boardSlug)
  if (!board) {
    return {
      status: 'done',
      outcome: { kind: 'invalid-request', reason: 'unrecognised board' },
      session,
    }
  }

  /*
   * Rate limit BEFORE touching the database, keyed on the client. `clientKey`
   * hashes the connecting IP with a scope; the roll number is never part of it.
   */
  const requestHeaders = await headers()
  const request = new Request('https://12thclassresult.com.pk/', {
    headers: {
      'cf-connecting-ip': requestHeaders.get('cf-connecting-ip') ?? '',
      'x-forwarded-for': requestHeaders.get('x-forwarded-for') ?? '',
    },
  })
  const limit = rateLimit(clientKey(request, 'gazette-lookup'), LOOKUPS_PER_WINDOW, WINDOW_MS)
  if (!limit.allowed) {
    return { status: 'rate-limited', retryAfterSeconds: limit.retryAfterSeconds }
  }

  const { env } = getCloudflareContext()
  const db = env.GAZETTE_DB
  if (!db) {
    // Local `next dev` without the binding. Saying so beats a misleading
    // "no result found", which would read as a statement about the student.
    return { status: 'unconfigured' }
  }

  const outcome = await lookupResult(createD1Store(db), {
    boardId: board.id,
    year: session.year,
    examination: session.examination,
    rollNumber,
  })

  return { status: 'done', outcome, session }
}

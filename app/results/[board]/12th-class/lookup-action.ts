'use server'

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { headers } from 'next/headers'

import type { LookupOutcome } from '@/lib/gazettes/lookup'

import { getBoardBySlug } from '@/lib/board/registry'
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
  | { status: 'done'; outcome: LookupOutcome }

export async function lookupRollNumber(
  _previous: LookupActionState,
  formData: FormData,
): Promise<LookupActionState> {
  const boardSlug = String(formData.get('board') ?? '')
  const rollNumber = String(formData.get('rollNumber') ?? '')

  const board = getBoardBySlug(boardSlug)
  if (!board) {
    return { status: 'done', outcome: { kind: 'invalid-request', reason: 'unrecognised board' } }
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
    year: 2025,
    examination: 'first-annual',
    rollNumber,
  })

  return { status: 'done', outcome }
}

import { z } from 'zod'

import { isKnownBoardSlug } from '@/lib/board/registry'

/**
 * The single wire contract for result lookup input (section 36).
 *
 * Bounds are explicit and tight so malformed or abusive input is rejected at
 * the edge, before any upstream work happens. Every limit here exists to make
 * a specific attack or accident cheap to refuse.
 */

export const MIN_RESULT_YEAR = 2000

/** Current year plus one: a board may publish next session's route early. */
export function maxResultYear(now: Date = new Date()): number {
  return now.getUTCFullYear() + 1
}

/**
 * A board slug must not merely LOOK like a slug — it must exist in the
 * registry. Without the `.refine`, an arbitrary well-formed string would reach
 * the service layer and be used to build an outbound URL.
 */
export const boardSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Board must be a lowercase hyphenated slug.')
  .refine(isKnownBoardSlug, 'Unknown board.')

export const yearSchema = z.coerce.number().int().min(MIN_RESULT_YEAR).max(maxResultYear())

export const examinationSchema = z
  .enum(['annual', 'second-annual', 'supplementary'])
  .default('annual')

/**
 * Roll numbers vary in shape across boards, so this validates the envelope
 * rather than a single board's format: uppercase alphanumerics and hyphens,
 * within a length no board exceeds.
 */
export const rollNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(4)
  .max(15)
  .regex(/^[A-Z0-9-]+$/, 'Roll number may contain only letters, digits and hyphens.')

export const resultQuerySchema = z.object({
  board: boardSlugSchema,
  year: yearSchema,
  examination: examinationSchema,
  rollNumber: rollNumberSchema,
})

export type ResultQuery = z.infer<typeof resultQuerySchema>

/**
 * Hard cap on request body size, enforced before parsing (section 36).
 * A valid query is a few dozen bytes; anything approaching this is abuse.
 */
export const MAX_LOOKUP_BODY_BYTES = 8192

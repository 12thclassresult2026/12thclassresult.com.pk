import type { ExamLevel } from '@/lib/result-sources/types'
import type { VerifiedFact } from '@/lib/result/verified-fact'

/**
 * The rechecking fact model.
 *
 * THE FIELD THAT MATTERS MOST IS `observedFor`.
 *
 * Every rechecking fee this project could verify was read from a board's **SSC**
 * portal or an undated rulebook. Not one board has deployed an HSSC Part-II
 * rechecking portal for 2026 — Gujranwala's HSSC options are commented out of
 * its own HTML, Lahore's HSSC rechecking subdomain 404s, and Rawalpindi's portal
 * is currently serving 9th class.
 *
 * So a figure carried here is a real, officially published number that may or
 * may not be the number an HSSC candidate will pay. Making `observedFor`
 * required means a renderer cannot show one without knowing which it is, and
 * the guide states the gap rather than quietly implying an HSSC rate.
 *
 * This is the whole differentiator for this page. Every competitor publishes a
 * bare "HSSC rechecking fee" with no examination attached and no source.
 */

export type RecheckingMode =
  /** Applied for and paid entirely online. */
  | 'fully-online'
  /** Online form plus a bank challan and/or a posted hard copy. */
  | 'hybrid'
  /** No online route at all — a form delivered in person. */
  | 'manual-only'
  | 'unverified'

export const RECHECKING_MODE_LABELS: Record<RecheckingMode, string> = {
  'fully-online': 'Fully online',
  hybrid: 'Online, plus paperwork',
  'manual-only': 'Manual only',
  unverified: 'Not verified',
}

/**
 * One officially published figure.
 *
 * A board may publish several that disagree. All of them are genuine; none is
 * "the wrong one" for us to discard, so each is carried with the document it
 * came from and the guide shows the disagreement.
 */
/**
 * The examination a fee document actually governs.
 *
 * Deliberately wider than `ExamLevel`. Two boards named the examination on the
 * page itself — Rawalpindi was serving 9th class, Gujranwala's only active
 * option was 10th Annual — while the rest published a fee without saying which
 * examination it belongs to. Inventing a precise level for those would be
 * manufacturing certainty; `ssc-unspecified` and `undated-document` record
 * exactly how much is known.
 */
export type FeeObservedFor = ExamLevel | 'ssc-unspecified' | 'undated-document'

export const FEE_OBSERVED_LABELS: Record<FeeObservedFor, string> = {
  'hssc-part-1': 'HSSC Part-I (11th class)',
  'hssc-part-2': 'HSSC Part-II (12th class)',
  'ssc-part-1': 'SSC Part-I (9th class)',
  'ssc-part-2': 'SSC Part-II (10th class)',
  'ssc-matric-tech': 'SSC (Matric Tech)',
  other: 'another examination',
  'ssc-unspecified': 'an SSC (matric) portal',
  'undated-document': 'an undated board document',
}

/** True only for a figure a board published for the 12th-class examination. */
export function isHsscFee(observedFor: FeeObservedFor): boolean {
  return observedFor === 'hssc-part-1' || observedFor === 'hssc-part-2'
}

export type PublishedFee = {
  /** PKR per paper or per subject, as the board expresses it. */
  amount: number
  /** A separate form or processing charge, where the board levies one. */
  formFee: number | null
  /** Which board document this figure was read from, in plain words. */
  readFrom: string
  /** The examination the document itself governs. Never inferred. */
  observedFor: FeeObservedFor
  note?: string
}

export type BoardRechecking = {
  boardId: string
  /**
   * The board's OWN word for the process, kept verbatim.
   *
   * DG Khan calls it "re-tallying", which is a more accurate name for what
   * actually happens than "rechecking" is. Normalising that away would lose
   * the board's own, clearer framing.
   */
  boardTerm: string
  /**
   * Published fees, in the order they should be shown. More than one entry
   * means the board's own sources disagree.
   */
  fees: PublishedFee[]
  /** Days from declaration of result to apply. */
  deadlineDays: VerifiedFact<number>
  mode: RecheckingMode
  modeNote: string
  /**
   * Whether the board states in its own words that rechecking is NOT
   * re-marking. `false` means the board does not publish this, NOT that the
   * board permits re-marking.
   */
  statesNotReMarking: boolean
  /** Whether the board publishes that the fee is refunded if an error is found. */
  refundIfErrorFound: VerifiedFact<boolean>
  /** Prose recording what was seen, when, and what was NOT seen. */
  provenanceNote: string
  sourceUrl: string
  checkedAt: string
}

/** What a recheck actually verifies. Identical across every board that publishes it. */
export type RecheckingCheckpoint = {
  claim: string
  attributedTo: string
}

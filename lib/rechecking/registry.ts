import type { BoardRechecking, RecheckingCheckpoint } from './types'

import { unknownFact, type VerifiedFact } from '@/lib/result/verified-fact'

/**
 * Per-board rechecking facts, from the boards' own published documents.
 *
 * This is the highest-value content surface found in Phase 1 research: searches
 * for Pakistani HSSC rechecking return Indian board content almost exclusively,
 * while at least four Pakistani boards publish detailed rules nobody has
 * collected.
 *
 * SIX BOARDS ONLY. Every other board either publishes nothing at HSSC level or
 * could not be read. A board is absent here rather than filled in by analogy
 * with its neighbours — Punjab boards are centrally synchronised for
 * *scheduling* and are not uniform for fees or rules.
 */

const CHECKED_AT = '2026-09-14T00:00:00.000Z'

function confirmed<T>(value: T, sourceId: string, sourceUrl: string, validFor: string) {
  return {
    value,
    status: 'confirmed' as const,
    sourceId,
    sourceUrl,
    sourcePublishedAt: null,
    checkedAt: CHECKED_AT,
    validFor,
  }
}

/**
 * What a recheck verifies — and, just as importantly, what it does not.
 *
 * This leads the guide because it is the single most consequential thing a
 * candidate can misunderstand. A student who pays Rs 1,300 expecting their
 * paper to be marked again has bought something else entirely.
 */
export const RECHECKING_CHECKPOINTS: readonly RecheckingCheckpoint[] = [
  {
    claim: 'No part of the paper was left unmarked, and no answer was skipped.',
    attributedTo: 'Rawalpindi instructions; Gujranwala Rule 11',
  },
  {
    claim: 'The marks for each question were added up correctly.',
    attributedTo: 'Rawalpindi instructions; Gujranwala Rule 11',
  },
  {
    claim: 'Those totals were carried correctly to the title page of the answer book.',
    attributedTo: 'Rawalpindi instructions; Gujranwala Rule 11',
  },
  {
    claim: 'The total on the title page matches the total on the result card.',
    attributedTo: 'Rawalpindi instructions; Gujranwala Rule 11',
  },
] as const

/**
 * The board's own words, quoted rather than paraphrased.
 *
 * Rawalpindi attributes the prohibition not only to board rules but to the
 * decisions of the superior courts, which is a materially stronger statement
 * than "we do not offer that service" and is worth carrying verbatim.
 */
export const NOT_RE_MARKING_QUOTE = {
  text: 're-marking of the answer book cannot be done under any circumstances',
  attributedTo: 'BISE Rawalpindi’s own rechecking instructions',
  basis: 'board rules and the decisions of the superior courts',
} as const

export const BOARD_RECHECKING: readonly BoardRechecking[] = [
  {
    boardId: 'bise-gujranwala',
    boardTerm: 'Rechecking',
    /*
     * THREE OFFICIAL FIGURES THAT DISAGREE.
     *
     * All three are genuine board publications. Silently picking one would be
     * inventing an answer the board has not given; the guide shows all three
     * and says which one a student actually pays today.
     */
    fees: [
      {
        amount: 1500,
        formFee: 100,
        readFrom: 'the live rechecking portal’s own fee calculation',
        observedFor: 'ssc-part-2',
        note: 'A late fine of Rs 2,000 applies after a stated date. This is what the portal charges today.',
      },
      {
        amount: 1000,
        formFee: 100,
        readFrom: 'the board’s published fee table',
        observedFor: 'ssc-unspecified',
      },
      {
        amount: 600,
        formFee: null,
        readFrom: 'Rule 11 of the board’s statutory regulations',
        observedFor: 'undated-document',
        note: 'The figure written into the rulebook itself.',
      },
    ],
    deadlineDays: confirmed(
      15,
      'gujranwala-rechecking-portal',
      'https://services.bisegrw.edu.pk/Rechecking/',
      'Rule 11 — within 15 days of the declaration of result',
    ),
    mode: 'fully-online',
    modeNote: 'Applied for and paid entirely through the board’s rechecking portal.',
    statesNotReMarking: true,
    refundIfErrorFound: confirmed(
      true,
      'gujranwala-rechecking-portal',
      'https://services.bisegrw.edu.pk/Rechecking/',
      'Rule 11 — fee refunded if a mistake is found',
    ),
    provenanceNote:
      'Loaded 2026-09-14. The portal offers 10th Annual as an active option while 9th, 11th, 12th Annual and 12th Supplementary are commented out of the page’s own HTML — so the HSSC route is not deployed. This board publishes a full 180-page statutory rulebook, the most complete documentation found anywhere in this market. Rule 11 also entitles a candidate to see the answer book in the presence of an authorised board officer.',
    sourceUrl: 'https://services.bisegrw.edu.pk/Rechecking/',
    checkedAt: CHECKED_AT,
  },
  {
    boardId: 'bise-rawalpindi',
    boardTerm: 'Rechecking',
    fees: [
      {
        amount: 1300,
        formFee: null,
        readFrom: 'the live rechecking portal’s own fields',
        observedFor: 'ssc-part-1',
        note: 'No separate processing fee is charged.',
      },
    ],
    deadlineDays: unknownFact<number>('No rechecking deadline was published on the board’s site.'),
    mode: 'hybrid',
    modeNote:
      'An online form, a bank challan, and a printed hard copy delivered by hand or by post. Completing only the online step is not an application.',
    statesNotReMarking: true,
    refundIfErrorFound: confirmed(
      true,
      'rawalpindi-rechecking-portal',
      'https://rechecking.biserawalpindi.edu.pk/',
      'Clause 9 — fee refunded if a mistake is found',
    ),
    provenanceNote:
      'Loaded 2026-09-14. The portal was serving "SSC PART-I (9TH) ANNUAL, 2026" at the time of checking, so no HSSC Part-II route was available. This board publishes the clearest statement of the re-marking prohibition found anywhere, attributing it to the decisions of the superior courts. Only the candidate personally may view the answer book.',
    sourceUrl: 'https://rechecking.biserawalpindi.edu.pk/',
    checkedAt: CHECKED_AT,
  },
  {
    boardId: 'bise-sahiwal',
    boardTerm: 'Rechecking',
    fees: [
      {
        amount: 1300,
        formFee: 100,
        readFrom: 'the board’s published rechecking instructions',
        observedFor: 'ssc-unspecified',
      },
    ],
    deadlineDays: confirmed(
      15,
      'sahiwal-rechecking-instructions',
      'https://bisesahiwal.edu.pk/',
      'Within 15 days of the declaration of result',
    ),
    mode: 'hybrid',
    modeNote: 'An online application followed by a posted hard copy.',
    statesNotReMarking: true,
    refundIfErrorFound: unknownFact<boolean>('The board does not publish a refund rule.'),
    provenanceNote:
      'Loaded 2026-09-14. This board states the limit most plainly of any in Pakistan, in its own words: rechecking absolutely does not mean re-marking of the paper, and marked scripts cannot under any circumstances be re-evaluated or re-marked. Only the candidate personally may view the script. A lost script entitles the candidate to either the award-list marks or a re-sit of that paper.',
    sourceUrl: 'https://bisesahiwal.edu.pk/',
    checkedAt: CHECKED_AT,
  },
  {
    boardId: 'bise-dg-khan',
    // The board's own term, and a more accurate description of the process.
    boardTerm: 'Re-tallying',
    fees: [
      {
        amount: 750,
        formFee: 50,
        readFrom: 'the board’s published rechecking rules',
        observedFor: 'undated-document',
        note: 'The Rs 50 form fee may have been superseded by a revised-fee notification dated 28 August 2026 introducing a Rs 100 form fee. The Rs 750 per-script charge is unaffected.',
      },
    ],
    deadlineDays: confirmed(
      15,
      'dg-khan-rechecking-rules',
      'https://bisedgkhan.edu.pk/',
      'Within 15 days of the declaration of result',
    ),
    mode: 'manual-only',
    modeNote:
      'There is no online rechecking route. The form is submitted manually, which makes the deadline harder to meet than at boards with a portal.',
    statesNotReMarking: true,
    refundIfErrorFound: confirmed(
      true,
      'dg-khan-rechecking-rules',
      'https://bisedgkhan.edu.pk/',
      'That subject’s fee is refunded where an error is found',
    ),
    provenanceNote:
      'Loaded 2026-09-14. This board uses the term "re-tallying" rather than rechecking and restricts the exercise to four verification points. Only the candidate personally may view the script. A lost script entitles the candidate to either the award-list marks or a re-sit of that paper.',
    sourceUrl: 'https://bisedgkhan.edu.pk/',
    checkedAt: CHECKED_AT,
  },
  {
    boardId: 'bise-lahore',
    boardTerm: 'Rechecking',
    fees: [
      {
        amount: 1200,
        formFee: 100,
        readFrom: 'the live rechecking portal’s own fields',
        observedFor: 'ssc-unspecified',
      },
    ],
    /*
     * The "15 days" figure so widely repeated for Lahore appears ONLY on SEO
     * sites. It could not be found anywhere on the board's own site, so it is
     * `unknown` here. Carrying it would be laundering an aggregator's guess
     * into an apparently sourced fact.
     */
    deadlineDays: unknownFact<number>(
      'The widely repeated "15 days" figure appears only on third-party sites and could not be verified on the board’s own site.',
    ),
    mode: 'hybrid',
    modeNote: 'An online application, with viewing of the answer book in person.',
    statesNotReMarking: false,
    refundIfErrorFound: unknownFact<boolean>('The board does not publish a refund rule.'),
    provenanceNote:
      'Loaded 2026-09-14. The SSC rechecking portal is live; the HSSC rechecking subdomain returns 404. This board publishes its rules as PDFs on a host that refuses non-browser requests, so the documents were located by title and URL but could not be read — every figure inside them is unverified. The board’s older fee-schedule PDF now 404s after a site rebuild.',
    sourceUrl: 'https://biselahore.com/',
    checkedAt: CHECKED_AT,
  },
  {
    boardId: 'bise-bahawalpur',
    boardTerm: 'Rechecking',
    fees: [
      {
        amount: 1300,
        formFee: null,
        readFrom: 'the board’s dedicated rechecking portal',
        observedFor: 'ssc-unspecified',
      },
    ],
    deadlineDays: unknownFact<number>('No rechecking deadline was published on the board’s site.'),
    mode: 'hybrid',
    modeNote: 'A dedicated online rechecking portal.',
    statesNotReMarking: false,
    refundIfErrorFound: unknownFact<boolean>('The board does not publish a refund rule.'),
    provenanceNote:
      'Loaded 2026-09-14. A portal and a fee, but no published rules, no deadline and no definition of what rechecking covers. NOTE: this board’s Rule 35 — "No candidate will be allowed to appear for improvement of marks after passing the examination" — sits under the chapter heading "RULES FOR PROFESSIONAL EXAMINATIONS" and governs PTC, CT, OT and Art & Crafts. It is NOT an Intermediate rule and must never be cited as one.',
    sourceUrl: 'https://www.bisebwp.edu.pk/',
    checkedAt: CHECKED_AT,
  },
] as const

export function recheckingFor(boardId: string): BoardRechecking | undefined {
  return BOARD_RECHECKING.find((entry) => entry.boardId === boardId)
}

export function boardsWithRechecking(): readonly BoardRechecking[] {
  return BOARD_RECHECKING
}

/** Boards whose own sources publish more than one fee. */
export function boardsWithFeeConflicts(): readonly BoardRechecking[] {
  return BOARD_RECHECKING.filter((entry) => entry.fees.length > 1)
}

/**
 * Whether ANY board has published an HSSC-level rechecking fee.
 *
 * Currently false, and the guide's central caveat depends on it. If a board
 * ever deploys an HSSC rechecking portal and this becomes true, the caveat
 * stops rendering automatically rather than being left stale.
 */
export function hasAnyHsscFee(): boolean {
  return BOARD_RECHECKING.some((entry) =>
    entry.fees.some(
      (fee) => fee.observedFor === 'hssc-part-2' || fee.observedFor === 'hssc-part-1',
    ),
  )
}

export function feeRange(): { min: number; max: number } | null {
  const amounts = BOARD_RECHECKING.flatMap((entry) => entry.fees.map((fee) => fee.amount))
  if (amounts.length === 0) return null
  return { min: Math.min(...amounts), max: Math.max(...amounts) }
}

export type { VerifiedFact }

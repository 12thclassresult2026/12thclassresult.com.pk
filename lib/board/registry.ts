import type { Board, Province } from './types'

import { unknownFact } from '@/lib/result/verified-fact'

/**
 * The board registry (section 20).
 *
 * Centralized board configuration so no component ever hard-codes board logic,
 * and a re-verification moves one constant rather than twenty literals.
 *
 * EVERY BOARD HERE IS `planned`. That is the honest state today: the source
 * registry records a verified official portal for most of them, but no board
 * page has been built, reviewed or published yet. `planned` means the board is
 * registered — so a directory can name it and point at its official source —
 * with no route and no indexable page in existence (section 168, registry-first
 * rollout).
 *
 * WHAT IS DELIBERATELY UNKNOWN, AND WHY:
 *
 *  - `resultDate` is `unknown` for every board. No official HSSC Part-II 2026
 *    announcement was found on any board domain on 2026-09-14. The live search
 *    results carry 23, 18 and 13 September 2026 for the same Punjab result, and
 *    not one of those pages cites a board notification. An unsourced date is
 *    not a date.
 *
 *  - `smsCode` is `unknown` for every board. No SMS shortcode was found
 *    published on ANY official board domain. Competitors print Lahore's code as
 *    80029, 800291, 80092 and 8583 — mutually contradictory, all traceable to
 *    aggregators rather than a board. An SMS message is charged: a student who
 *    texts a wrong shortcode on result morning pays for nothing and gets
 *    nothing. No code ships without a board source.
 *
 *  - `methodsConfirmed` is all-null for every 2026 dataset. A portal whose
 *    dropdown offers "12th" and "2026" has described a cross-product of form
 *    options, not confirmed that a 2026 Part-II dataset sits behind it.
 */

const VERIFIED_AT = '2026-09-14T00:00:00.000Z'

/** The examination year this project currently serves. */
export const CURRENT_RESULT_YEAR = 2026

/** One shared 2026 Part-II dataset shape: nothing about it is verified yet. */
function unverifiedPartTwoDataset(year: number = CURRENT_RESULT_YEAR) {
  return {
    examLevel: 'hssc-part-2' as const,
    year,
    methodsConfirmed: { rollNumber: null, name: null, sms: null, gazette: null },
    released: unknownFact<boolean>(
      `HSSC Part-II ${year}. No official declaration was found on any board domain as of 2026-09-14.`,
    ),
  }
}

const BOARDS: readonly Board[] = [
  {
    id: 'bise-lahore',
    slug: 'lahore-board',
    officialName: 'Board of Intermediate and Secondary Education, Lahore',
    shortName: 'BISE Lahore',
    province: 'punjab',
    officialWebsite: 'https://biselahore.com/',
    sourceIds: ['lahore-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwoDataset()],
    studentCautions: [
      'This board runs several sites and only one of them serves results: result.biselahore.com. Its main site refuses automated checks, so if a search result sends you somewhere that will not load, the result host is the one to try.',
      'The result portal presents a security check you must complete yourself. No site can complete it for you.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-gujranwala',
    slug: 'gujranwala-board',
    officialName: 'Board of Intermediate and Secondary Education, Gujranwala',
    shortName: 'BISE Gujranwala',
    province: 'punjab',
    officialWebsite: 'https://bisegrw.edu.pk/',
    sourceIds: ['gujranwala-result-portal', 'gujranwala-gazette'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: {
      value: true,
      status: 'confirmed',
      sourceId: 'gujranwala-gazette',
      sourceUrl: 'https://bisegrw.edu.pk/result-gazatte.html',
      sourcePublishedAt: null,
      checkedAt: VERIFIED_AT,
      validFor:
        'HSSC Part-II annual gazettes are published on the board’s own gazette page up to and including 2025. No 2026 Part-II gazette was listed there on 2026-09-14.',
    },
    resultDatasets: [unverifiedPartTwoDataset()],
    studentCautions: [
      'The live result checker renders through JavaScript. If it does not load, the board serves the same form on its previous-years result page.',
      'The result portal presents a security check you must complete yourself.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-faisalabad',
    slug: 'faisalabad-board',
    officialName: 'Board of Intermediate and Secondary Education, Faisalabad',
    shortName: 'BISE Faisalabad',
    province: 'punjab',
    officialWebsite: 'https://bisefsd.edu.pk/',
    sourceIds: ['faisalabad-official-base'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwoDataset()],
    studentCautions: [
      'This board’s site refused every automated check on 2026-09-14, so its Part-II result route could not be confirmed here. It very likely works normally in an ordinary browser — open the board’s own website directly rather than trusting a third-party link.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-multan',
    slug: 'multan-board',
    officialName: 'Board of Intermediate and Secondary Education, Multan',
    shortName: 'BISE Multan',
    province: 'punjab',
    officialWebsite: 'https://web.bisemultan.edu.pk/',
    sourceIds: ['multan-result-archive', 'multan-gazette'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: {
      value: true,
      status: 'historical',
      sourceId: 'multan-gazette',
      sourceUrl: 'https://web.bisemultan.edu.pk/result-gazette-inter/',
      sourcePublishedAt: null,
      checkedAt: VERIFIED_AT,
      validFor:
        'Part-II appears only inside the board’s combined 2017 and 2018 intermediate gazettes. This is a historical archive, not a current Part-II gazette series.',
    },
    resultDatasets: [unverifiedPartTwoDataset()],
    studentCautions: [
      'The board’s older /results-12/ address now redirects to its result archive. If you have an old bookmark, expect to land somewhere different.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-rawalpindi',
    slug: 'rawalpindi-board',
    officialName: 'Board of Intermediate and Secondary Education, Rawalpindi',
    shortName: 'BISE Rawalpindi',
    province: 'punjab',
    officialWebsite: 'https://biserawalpindi.edu.pk/',
    sourceIds: ['rawalpindi-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwoDataset()],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-sargodha',
    slug: 'sargodha-board',
    officialName: 'Board of Intermediate and Secondary Education, Sargodha',
    shortName: 'BISE Sargodha',
    province: 'punjab',
    officialWebsite: 'https://bisesargodha.edu.pk/',
    sourceIds: ['sargodha-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwoDataset()],
    studentCautions: [
      'This board asks for a B-Form number as well as a roll number. Have it with you before you start, or the lookup cannot be completed.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-bahawalpur',
    slug: 'bahawalpur-board',
    officialName: 'Board of Intermediate and Secondary Education, Bahawalpur',
    shortName: 'BISE Bahawalpur',
    province: 'punjab',
    officialWebsite: 'https://bisebwp.edu.pk/',
    sourceIds: ['bahawalpur-result-portal', 'bahawalpur-result-portal-second-annual'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwoDataset()],
    studentCautions: [
      'This board asks for a B-Form or CNIC number as well as a roll number, and presents a security check.',
      'It publishes separate addresses for the first annual and the second annual Part-II result — make sure you are on the one for your session.',
      'The www form of this board’s address serves a certificate that does not match it. Use the address without www.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-sahiwal',
    slug: 'sahiwal-board',
    officialName: 'Board of Intermediate and Secondary Education, Sahiwal',
    shortName: 'BISE Sahiwal',
    province: 'punjab',
    officialWebsite: 'https://bisesahiwal.edu.pk/',
    sourceIds: ['sahiwal-result-portal', 'sahiwal-gazette'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: {
      value: true,
      status: 'confirmed',
      sourceId: 'sahiwal-gazette',
      sourceUrl: 'https://bisesahiwal.edu.pk/result-stats-gazzet.php',
      sourcePublishedAt: null,
      checkedAt: VERIFIED_AT,
      validFor:
        'The board publishes a combined result-statistics and gazette page. The 2026 entry observed there was a statistics sheet for the intermediate second annual session — a statistics sheet is not a per-candidate gazette.',
    },
    resultDatasets: [unverifiedPartTwoDataset()],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-dg-khan',
    /*
     * SLUG SAFETY. This is Dera Ghazi Khan, in Punjab. There is a separate
     * board for Dera Ismail Khan in Khyber Pakhtunkhwa. If that board is ever
     * registered here it must be spelled out in full as
     * `dera-ismail-khan-board` and never abbreviated to `di-khan-board`, which
     * is one character from this slug. A reader who lands on the wrong one gets
     * a plausible-looking page for the wrong province and the wrong board.
     */
    slug: 'dg-khan-board',
    officialName: 'Board of Intermediate and Secondary Education, Dera Ghazi Khan',
    shortName: 'BISE DG Khan',
    province: 'punjab',
    officialWebsite: 'https://bisedgkhan.edu.pk/',
    sourceIds: ['dg-khan-result-directory'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwoDataset()],
    studentCautions: [
      'This board publishes a separate result address for each session rather than one permanent checker. As of 2026-09-14 the most recent Part-II link on its results page was for 2025 — no 2026 link had appeared yet.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'fbise',
    slug: 'federal-board',
    officialName: 'Federal Board of Intermediate and Secondary Education',
    shortName: 'FBISE',
    province: 'federal',
    officialWebsite: 'https://fbise.edu.pk/',
    sourceIds: ['fbise-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwoDataset()],
    studentCautions: [
      'The Federal Board’s site refused every automated check on 2026-09-14, so nothing about its Part-II 2026 result could be confirmed here. Open the board’s own website directly.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
] as const

const BOARD_BY_SLUG = new Map(BOARDS.map((b) => [b.slug, b]))
const BOARD_BY_ID = new Map(BOARDS.map((b) => [b.id, b]))

export { BOARDS }

export function allBoards(): Board[] {
  return [...BOARDS]
}

export function getBoardBySlug(slug: string): Board | undefined {
  return BOARD_BY_SLUG.get(slug.toLowerCase())
}

export function getBoardById(id: string): Board | undefined {
  return BOARD_BY_ID.get(id)
}

/** Boards whose page has been reviewed and published. Currently none. */
export function publishedBoards(): Board[] {
  return BOARDS.filter((b) => b.publishState === 'published')
}

/** Boards with a route that serves, published or held. Currently none. */
export function routedBoards(): Board[] {
  return BOARDS.filter((b) => b.publishState !== 'planned')
}

export function boardsByProvince(province: Province): Board[] {
  return BOARDS.filter((b) => b.province === province)
}

/** Used by the request schema so an unknown board never reaches the service. */
export function isKnownBoardSlug(slug: string): boolean {
  return BOARD_BY_SLUG.has(slug.toLowerCase())
}

import type {
  Board,
  DatasetMethods,
  DeclarationModel,
  GroupId,
  Province,
  ResultAccessModel,
  ResultDataset,
} from './types'

import { unknownFact } from '@/lib/result/verified-fact'

/**
 * The board registry.
 *
 * Centralized board configuration so no component ever hard-codes board logic,
 * and a re-verification moves one constant rather than twenty literals.
 *
 * WHAT IS DELIBERATELY UNKNOWN, AND WHY:
 *
 *  - `resultDate` is `unknown` for every board except Quetta. No official
 *    HSSC Part-II 2026 announcement was found on any other board domain on
 *    2026-09-14. The live search results carry 13, 18 and 23 September 2026 for
 *    the same Punjab result, and not one of those pages cites a board
 *    notification. An unsourced date is not a date.
 *
 *  - `smsCode` is `unknown` for EVERY board, nationally. No shortcode was found
 *    published on any board's own domain. Competitors print contradictory codes
 *    for the same boards. An SMS is charged: a student who texts a wrong
 *    shortcode on result morning pays for nothing and gets nothing.
 *
 *  - Most `methodsConfirmed` are all-`unknown`. A portal whose dropdown offers
 *    "12th" and "2026" has described a cross-product of form options, not
 *    confirmed that a dataset sits behind them.
 */

const VERIFIED_AT = '2026-09-14T00:00:00.000Z'

/** The examination year this project currently serves. */
export const CURRENT_RESULT_YEAR = 2026

const UNKNOWN_METHODS: DatasetMethods = {
  rollNumber: 'unknown',
  name: 'unknown',
  sms: 'unknown',
  gazette: 'unknown',
}

const BLOCKED_METHODS: DatasetMethods = {
  rollNumber: 'blocked',
  name: 'blocked',
  sms: 'blocked',
  gazette: 'blocked',
}

/** A 2026 Part-II dataset about which nothing is yet verified. */
function unverifiedPartTwo(year: number = CURRENT_RESULT_YEAR): ResultDataset {
  return {
    examLevel: 'hssc-part-2',
    year,
    group: null,
    declaredAt: unknownFact<string>(`HSSC Part-II ${year}`),
    methodsConfirmed: UNKNOWN_METHODS,
    released: unknownFact<boolean>(
      `HSSC Part-II ${year}. No official declaration was found on this board's own domain as of 2026-09-14.`,
    ),
  }
}

/** A dataset for a board whose site refuses automated checks. */
function blockedPartTwo(year: number = CURRENT_RESULT_YEAR): ResultDataset {
  return {
    examLevel: 'hssc-part-2',
    year,
    group: null,
    declaredAt: unknownFact<string>(`HSSC Part-II ${year}`),
    methodsConfirmed: BLOCKED_METHODS,
    released: unknownFact<boolean>(
      `HSSC Part-II ${year}. This board's site refuses automated requests, so nothing could be established either way.`,
    ),
  }
}

/**
 * A Karachi group declaration, confirmed from the board's own results page.
 * Seven of these replace what a single-model registry would flatten into one
 * boolean — and one of them is still undeclared.
 */
function karachiGroup(group: GroupId, declaredOn: string | null, note: string): ResultDataset {
  const source = {
    sourceId: 'biek-gazette',
    sourceUrl: 'https://www.biek.edu.pk/results.asp',
    sourcePublishedAt: null,
    checkedAt: VERIFIED_AT,
  }
  return {
    examLevel: 'hssc-part-2',
    year: 2026,
    group,
    gazetteSourceId: 'biek-gazette',
    declaredAt: declaredOn
      ? { value: declaredOn, status: 'confirmed', ...source, validFor: note }
      : unknownFact<string>(note),
    methodsConfirmed: {
      // The board publishes a gazette per group. There is no lookup form at
      // all, so roll-number and name are verified ABSENT, not unknown.
      rollNumber: 'verified-unsupported',
      name: 'verified-unsupported',
      sms: 'unknown',
      gazette: declaredOn ? 'verified-supported' : 'unknown',
    },
    released: declaredOn
      ? { value: true, status: 'confirmed', ...source, validFor: note }
      : unknownFact<boolean>(note),
  }
}

const BOARDS: readonly Board[] = [
  // ------------------------------------------------------------------ Punjab
  {
    id: 'bise-lahore',
    slug: 'lahore-board',
    officialName: 'Board of Intermediate and Secondary Education, Lahore',
    shortName: 'BISE Lahore',
    province: 'punjab',
    officialWebsite: 'https://biselahore.com/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['lahore-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
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
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
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
    resultDatasets: [unverifiedPartTwo()],
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
    accessModel: 'unverified',
    declarationModel: 'unknown',
    sourceIds: ['faisalabad-official-base'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [blockedPartTwo()],
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
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
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
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'The board’s older /results-12/ address now redirects to its result archive. If you have an old bookmark, expect to land somewhere different.',
      'The result portal presents a security check you must complete yourself.',
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
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['rawalpindi-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-sargodha',
    slug: 'sargodha-board',
    officialName: 'Board of Intermediate and Secondary Education, Sargodha',
    shortName: 'BISE Sargodha',
    province: 'punjab',
    officialWebsite: 'https://bisesargodha.edu.pk/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['sargodha-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
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
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['bahawalpur-result-portal', 'bahawalpur-result-portal-second-annual'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
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
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
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
    resultDatasets: [unverifiedPartTwo()],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-dg-khan',
    /*
     * SLUG SAFETY. This is Dera Ghazi Khan, in Punjab. There is a separate
     * board for Dera Ismail Khan in Khyber Pakhtunkhwa, registered below as
     * `dera-ismail-khan-board` and never abbreviated. A reader who lands on the
     * wrong one gets a plausible-looking page for the wrong province and the
     * wrong board. A validation gate asserts neither slug contains the other.
     */
    slug: 'dg-khan-board',
    officialName: 'Board of Intermediate and Secondary Education, Dera Ghazi Khan',
    shortName: 'BISE DG Khan',
    province: 'punjab',
    officialWebsite: 'https://bisedgkhan.edu.pk/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['dg-khan-result-directory'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This board publishes a separate result address for each session rather than one permanent checker. As of 2026-09-14 the most recent Part-II link on its results page was for 2025 — no 2026 link had appeared yet.',
      'Rechecking at this board is applied for on paper, not online.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },

  // ----------------------------------------------------------------- Federal
  {
    id: 'fbise',
    slug: 'federal-board',
    officialName: 'Federal Board of Intermediate and Secondary Education',
    shortName: 'FBISE',
    province: 'federal',
    officialWebsite: 'https://fbise.edu.pk/',
    accessModel: 'unverified',
    declarationModel: 'unknown',
    sourceIds: ['fbise-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [blockedPartTwo()],
    studentCautions: [
      'The Federal Board’s site refused every automated check on 2026-09-14, so nothing about its Part-II 2026 result could be confirmed here. Open the board’s own website directly.',
      'Candidates in Gilgit-Baltistan sit under this board: Gilgit-Baltistan has no HSSC board of its own.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },

  // ------------------------------------------------------- Khyber Pakhtunkhwa
  {
    id: 'bise-peshawar',
    slug: 'peshawar-board',
    officialName: 'Board of Intermediate and Secondary Education, Peshawar',
    shortName: 'BISE Peshawar',
    province: 'khyber-pakhtunkhwa',
    officialWebsite: 'https://www.bisep.edu.pk/',
    accessModel: 'session-rotating-portal',
    declarationModel: 'whole-board',
    sourceIds: ['peshawar-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This board’s portal shows one examination session at a time. When it is serving a different class, there is no Part-II entry point on it at all — that is the portal rotating, not your result being missing.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-mardan',
    slug: 'mardan-board',
    officialName: 'Board of Intermediate and Secondary Education, Mardan',
    shortName: 'BISE Mardan',
    province: 'khyber-pakhtunkhwa',
    officialWebsite: 'https://web.bisemdn.edu.pk/',
    accessModel: 'session-rotating-portal',
    declarationModel: 'whole-board',
    sourceIds: ['mardan-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: ['This board’s portal shows one examination session at a time.'],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-abbottabad',
    slug: 'abbottabad-board',
    officialName: 'Board of Intermediate and Secondary Education, Abbottabad',
    shortName: 'BISE Abbottabad',
    province: 'khyber-pakhtunkhwa',
    officialWebsite: 'https://www.biseatd.edu.pk/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['abbottabad-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-swat',
    slug: 'swat-board',
    officialName: 'Board of Intermediate and Secondary Education, Saidu Sharif Swat',
    shortName: 'BISE Swat',
    province: 'khyber-pakhtunkhwa',
    officialWebsite: 'https://www.bisess.edu.pk/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['swat-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-kohat',
    slug: 'kohat-board',
    officialName: 'Board of Intermediate and Secondary Education, Kohat',
    shortName: 'BISE Kohat',
    province: 'khyber-pakhtunkhwa',
    officialWebsite: 'https://www.bisekt.edu.pk/',
    accessModel: 'unverified',
    declarationModel: 'unknown',
    sourceIds: [],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [blockedPartTwo()],
    studentCautions: [
      'Every address on this board’s site refused automated checks on 2026-09-14, so nothing about its result route could be confirmed here. Open the board’s own website directly.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-bannu',
    slug: 'bannu-board',
    officialName: 'Board of Intermediate and Secondary Education, Bannu',
    shortName: 'BISE Bannu',
    province: 'khyber-pakhtunkhwa',
    officialWebsite: 'https://www.biseb.edu.pk/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['bannu-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This board’s result search presents a security check you must complete yourself.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-malakand',
    slug: 'malakand-board',
    officialName: 'Board of Intermediate and Secondary Education, Malakand',
    shortName: 'BISE Malakand',
    province: 'khyber-pakhtunkhwa',
    officialWebsite: 'https://www.bisemalakand.edu.pk/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['malakand-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-dera-ismail-khan',
    /*
     * Spelled out in full, deliberately. See the slug-safety note on
     * `bise-dg-khan` above.
     */
    slug: 'dera-ismail-khan-board',
    officialName: 'Board of Intermediate and Secondary Education, Dera Ismail Khan',
    shortName: 'BISE D.I. Khan',
    province: 'khyber-pakhtunkhwa',
    officialWebsite: 'https://www.bisedik.edu.pk/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['dera-ismail-khan-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    lastVerifiedAt: VERIFIED_AT,
  },

  // ------------------------------------------------------------------- Sindh
  {
    id: 'biek',
    /*
     * `karachi-board` means the INTERMEDIATE board. The Karachi secondary board
     * is matric-only and is deliberately not registered at all — sending a
     * 12th-class reader there would be a serious error.
     */
    slug: 'karachi-board',
    officialName: 'Board of Intermediate Education Karachi',
    shortName: 'BIEK',
    province: 'sindh',
    officialWebsite: 'https://www.biek.edu.pk/',
    accessModel: 'gazette-only',
    declarationModel: 'per-group',
    sourceIds: ['biek-gazette'],
    publishState: 'draft',
    resultDate: unknownFact<string>(
      'This board declares per group, so there is no single board-wide result date. See the per-group datasets.',
    ),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: {
      value: true,
      status: 'confirmed',
      sourceId: 'biek-gazette',
      sourceUrl: 'https://www.biek.edu.pk/results.asp',
      sourcePublishedAt: null,
      checkedAt: VERIFIED_AT,
      validFor:
        'The board publishes one result gazette PDF per group. This is not a supplementary route — it is the only route, because no roll-number lookup exists on this board’s domain.',
    },
    /*
     * SEVEN datasets for one session. This is the shape a single-model registry
     * cannot hold: six groups declared between 31 July and 27 August 2026, and
     * Commerce still undeclared when every competitor had already announced
     * "the Karachi result".
     */
    resultDatasets: [
      karachiGroup('pre-medical', '2026-07-31', 'Science Pre-Medical Part-II, Annual 2026.'),
      karachiGroup('home-economics', '2026-07-31', 'Home Economics Part-II, Annual 2026.'),
      karachiGroup(
        'humanities',
        '2026-08-07',
        'Humanities Regular Part-II, Annual 2026. Humanities Private and Special Candidates declared earlier, on 2026-07-31.',
      ),
      karachiGroup(
        'pre-engineering',
        '2026-08-17',
        'Science Pre-Engineering Part-II, Annual 2026.',
      ),
      karachiGroup('science-general', '2026-08-27', 'Science General Part-II, Annual 2026.'),
      karachiGroup(
        'commerce',
        null,
        'Commerce Part-II, Annual 2026. NOT declared as of 2026-09-14, while six other groups had been. A board-level "result announced" would be wrong for these candidates.',
      ),
      karachiGroup(
        'medical-technology',
        null,
        'Medical Technology Part-II, Annual 2026. The board lists this faculty but no 2026 declaration was observed.',
      ),
    ],
    studentCautions: [
      'Each group is declared on its own date, and they can be several weeks apart. If another group’s result is out, that says nothing about yours.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-hyderabad',
    slug: 'hyderabad-board',
    officialName: 'Board of Intermediate and Secondary Education, Hyderabad Sindh',
    shortName: 'BISE Hyderabad',
    province: 'sindh',
    officialWebsite: 'https://www.biseh.edu.pk/',
    accessModel: 'gazette-only',
    declarationModel: 'per-group',
    sourceIds: ['hyderabad-result-index'],
    publishState: 'planned',
    resultDate: unknownFact<string>(
      'This board publishes per-group result files and prints no declaration dates at all.',
    ),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: {
      value: true,
      status: 'confirmed',
      sourceId: 'hyderabad-result-index',
      sourceUrl: 'https://www.biseh.edu.pk/',
      sourcePublishedAt: null,
      checkedAt: VERIFIED_AT,
      validFor:
        'The board publishes per-group HSC-II result files, position holders and statistics from its homepage.',
    },
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This board publishes results per group, as files, and prints no declaration date against them. A date quoted elsewhere for "the Hyderabad result" is not from this board.',
      'The board’s working address is biseh.edu.pk. Another address listed in some directories serves an expired certificate.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-larkana',
    slug: 'larkana-board',
    officialName: 'Board of Intermediate and Secondary Education Larkano',
    shortName: 'BISE Larkana',
    province: 'sindh',
    officialWebsite: 'https://biselrk.edu.pk/',
    accessModel: 'roll-number-portal',
    declarationModel: 'unknown',
    sourceIds: ['larkana-result-portal'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-sukkur',
    slug: 'sukkur-board',
    officialName: 'Board of Intermediate and Secondary Education, Sukkur',
    shortName: 'BISE Sukkur',
    province: 'sindh',
    officialWebsite: 'https://bisesuksindh.edu.pk/',
    accessModel: 'unverified',
    declarationModel: 'unknown',
    sourceIds: [],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This board’s official domain served only a placeholder page on 2026-09-14 and no result route could be found on it at all. Contact the board directly.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-mirpurkhas',
    slug: 'mirpurkhas-board',
    officialName: 'Board of Intermediate and Secondary Education, Mirpurkhas',
    shortName: 'BISE Mirpurkhas',
    province: 'sindh',
    officialWebsite: 'https://bisempk.edu.pk/',
    accessModel: 'unverified',
    declarationModel: 'unknown',
    sourceIds: [],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This board’s result page exposed no working form on 2026-09-14, and its notifications page was several years out of date.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'bise-shaheed-benazirabad',
    slug: 'shaheed-benazirabad-board',
    officialName: 'Board of Intermediate and Secondary Education Shaheed Benazirabad',
    shortName: 'BISE Shaheed Benazirabad',
    province: 'sindh',
    officialWebsite: 'https://bisesba.edu.pk/',
    accessModel: 'unverified',
    declarationModel: 'unknown',
    sourceIds: [],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This board’s public website was returning a server error on 2026-09-14, so no result route could be confirmed.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },

  // ------------------------------------------------------------- Balochistan
  {
    id: 'bbise',
    slug: 'quetta-board',
    officialName: 'The Balochistan Board of Intermediate and Secondary Education, Quetta',
    shortName: 'BBISE Quetta',
    province: 'balochistan',
    officialWebsite: 'https://bbise.edu.pk/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['quetta-result-portal', 'quetta-gazette'],
    publishState: 'planned',
    /*
     * THE ONLY CONFIRMED HSSC PART-II 2026 RESULT DATE IN THE REGISTRY.
     * Every other board's is `unknown`, and that asymmetry is the point: this
     * one is confirmed because the board published a notification saying so.
     */
    resultDate: {
      value: '2026-07-20',
      status: 'confirmed',
      sourceId: 'quetta-gazette',
      sourceUrl: 'https://bbise.edu.pk/Notifications',
      sourcePublishedAt: '2026-07-20',
      checkedAt: VERIFIED_AT,
      validFor:
        'HSSC Annual 2026. The board published notifications titled "HSSC ANNUAL RESULT 2026 ANNOUNCED" and "HSSC RESULT 2026 NOTIFICATION", both dated 20 July 2026, alongside its Part-I and Part-II gazettes.',
    },
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: {
      value: true,
      status: 'confirmed',
      sourceId: 'quetta-gazette',
      sourceUrl: 'https://bbise.edu.pk/Notifications',
      sourcePublishedAt: '2026-07-20',
      checkedAt: VERIFIED_AT,
      validFor:
        'Part-I and Part-II HSSC annual 2026 gazettes are published on the board’s own notifications page. The files are scanned images, so their contents are not machine-readable.',
    },
    resultDatasets: [
      {
        examLevel: 'hssc-part-2',
        year: 2026,
        group: null,
        gazetteSourceId: 'quetta-gazette',
        declaredAt: {
          value: '2026-07-20',
          status: 'confirmed',
          sourceId: 'quetta-gazette',
          sourceUrl: 'https://bbise.edu.pk/Notifications',
          sourcePublishedAt: '2026-07-20',
          checkedAt: VERIFIED_AT,
          validFor: 'HSSC Part-II Annual 2026.',
        },
        methodsConfirmed: {
          rollNumber: 'verified-supported',
          name: 'unknown',
          sms: 'unknown',
          gazette: 'verified-supported',
        },
        released: {
          value: true,
          status: 'confirmed',
          sourceId: 'quetta-gazette',
          sourceUrl: 'https://bbise.edu.pk/Notifications',
          sourcePublishedAt: '2026-07-20',
          checkedAt: VERIFIED_AT,
          validFor: 'HSSC Part-II Annual 2026, announced by the board on 20 July 2026.',
        },
      },
    ],
    studentCautions: [
      'The second annual examination for this session was scheduled to begin on 13 October 2026, per the board’s own date sheet.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },

  // ------------------------------------------------------ Azad Jammu & Kashmir
  {
    id: 'ajkbise',
    slug: 'mirpur-board',
    officialName: 'AJK Board of Intermediate and Secondary Education, Mirpur',
    shortName: 'AJK BISE',
    province: 'azad-jammu-kashmir',
    officialWebsite: 'https://www.ajkbise.net/',
    accessModel: 'gazette-only',
    declarationModel: 'whole-board',
    sourceIds: ['ajk-gazette'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: {
      value: true,
      status: 'confirmed',
      sourceId: 'ajk-gazette',
      sourceUrl: 'https://www.ajkbise.net/results.php',
      sourcePublishedAt: null,
      checkedAt: VERIFIED_AT,
      validFor:
        'The board publishes HSSC Part-II result gazettes for past sessions on its own results page. Its online result form could not be reached, so the gazette is the verified route.',
    },
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This board’s online result form refused automated checks. Its published gazettes are the route we could verify.',
      'One address that looks like this board’s result site serves a hosting placeholder page and is not a result route. Use the board’s own results page.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },

  // ----------------------------------------------------------------- Private
  {
    id: 'aku-eb',
    slug: 'aku-eb',
    officialName: 'The Aga Khan University Examination Board',
    shortName: 'AKU-EB',
    province: 'sindh',
    officialWebsite: 'https://examinationboard.aku.edu/',
    accessModel: 'roll-number-portal',
    declarationModel: 'whole-board',
    sourceIds: ['aku-eb-results'],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This is a private examination board. Its result lookup selects an examination session and a date of birth rather than a plain roll number.',
    ],
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'zueb',
    slug: 'zueb',
    officialName: 'Ziauddin University Examination Board',
    shortName: 'ZUEB',
    province: 'sindh',
    officialWebsite: 'https://zueb.edu.pk/',
    accessModel: 'gazette-only',
    declarationModel: 'per-group',
    sourceIds: [],
    publishState: 'planned',
    resultDate: unknownFact<string>('HSSC Part-II 2026'),
    smsCode: unknownFact<string>('HSSC Part-II 2026'),
    gazetteAvailable: unknownFact<boolean>('HSSC Part-II gazette'),
    resultDatasets: [unverifiedPartTwo()],
    studentCautions: [
      'This is a private examination board. It publishes results as stream-wise gazette files, split between regular and private candidates.',
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

/** Boards whose page has been reviewed and published. */
export function publishedBoards(): Board[] {
  return BOARDS.filter((b) => b.publishState === 'published')
}

/** Boards with a route that serves — published, in review, or held as draft. */
export function routedBoards(): Board[] {
  return BOARDS.filter((b) => b.publishState !== 'planned')
}

export function boardsByProvince(province: Province): Board[] {
  return BOARDS.filter((b) => b.province === province)
}

export function boardsByAccessModel(model: ResultAccessModel): Board[] {
  return BOARDS.filter((b) => b.accessModel === model)
}

/** Boards where the gazette is the only official route, not a fallback. */
export function gazetteOnlyBoards(): Board[] {
  return boardsByAccessModel('gazette-only')
}

/** Boards that declare one group at a time. */
export function perGroupBoards(): Board[] {
  return BOARDS.filter((b) => b.declarationModel === 'per-group')
}

/** Every dataset for a board and year, across all groups. */
export function datasetsFor(boardId: string, year: number): ResultDataset[] {
  return (getBoardById(boardId)?.resultDatasets ?? []).filter((d) => d.year === year)
}

/** One dataset. Pass `null` for a whole-board declaration. */
export function datasetFor(
  boardId: string,
  year: number,
  group: GroupId | null,
): ResultDataset | undefined {
  return datasetsFor(boardId, year).find((d) => d.group === group)
}

export function declarationModelOf(boardId: string): DeclarationModel {
  return getBoardById(boardId)?.declarationModel ?? 'unknown'
}

/** Used by the request schema so an unknown board never reaches the service. */
export function isKnownBoardSlug(slug: string): boolean {
  return BOARD_BY_SLUG.has(slug.toLowerCase())
}

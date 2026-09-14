import type { ResultSource } from './types'

/**
 * The official result-source registry (sections 28, 66, 87).
 *
 * EVERY record here was produced by loading the URL on the date recorded in
 * `lastCheckedAt`. Nothing was copied from a competitor, a search snippet or a
 * previous year's file. Where a page could not be loaded, the record says so
 * and claims no capabilities — an unreachable source is registered with
 * `observedVia: 'not-observed'` rather than filled in from expectation.
 *
 * THE CAPTCHA RULE (section 144). `hasCaptcha` is `true` or `null`, never
 * `false`, unless a CAPTCHA's absence was positively established. The fetch
 * pipeline used for this research converts pages to markdown, which drops
 * <script> tags and form controls — so "no CAPTCHA appeared in the text" is
 * weak evidence of absence, not proof. Several boards therefore carry `null`
 * even though the research pass saw no challenge, and none of them is eligible
 * for server integration on that evidence.
 */

const CHECKED_AT = '2026-09-14T00:00:00.000Z'

/** Inclusive year list, for portals whose year dropdown was read in full. */
function yearRange(from: number, to: number): number[] {
  const years: number[] = []
  for (let y = to; y >= from; y -= 1) years.push(y)
  return years
}

export const RESULT_SOURCES: readonly ResultSource[] = [
  // ---------------------------------------------------------------- Lahore
  {
    id: 'lahore-result-portal',
    boardId: 'bise-lahore',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2'],
    yearsObserved: yearRange(2007, 2026),
    lookupModesObserved: ['Part-I (ANNUAL)', 'Part-II (ANNUAL)', 'Supplementary'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Lahore result portal',
    url: 'https://result.biselahore.com/',
    isOfficial: true,
    supportsRollNumber: true,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: true,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. The form takes a roll number, an exam-type dropdown offering Part-I (ANNUAL), Part-II (ANNUAL) and Supplementary, and a year dropdown running 2026 down to 2007. A CAPTCHA is present, which forecloses server integration permanently. The year dropdown listing 2026 says only that the option exists — it is not evidence that a 2026 Part-II dataset sits behind it.',
  },
  // ----------------------------------------------------------- Gujranwala
  {
    id: 'gujranwala-result-portal',
    boardId: 'bise-gujranwala',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: ['12th Annual', '12th Supplementary', '12th Special'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Gujranwala result portal',
    url: 'https://bisegrw.edu.pk/prev-years-result.html',
    isOfficial: true,
    supportsRollNumber: true,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: true,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. The live checker at result.bisegrw.edu.pk renders through JavaScript and could not be read as text; the same form is served statically at prev-years-result.html, which is the URL recorded here. Fields observed: roll number, year, and a class dropdown offering 12th Annual, 12th Supplementary and 12th Special. A CAPTCHA is present.',
  },
  {
    id: 'gujranwala-gazette',
    boardId: 'bise-gujranwala',
    sourceType: 'official-gazette',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: [],
    additionalIdentifiersObserved: [],
    resourceKinds: ['gazette'],
    observedVia: 'automated-fetch',
    name: 'BISE Gujranwala result gazette',
    url: 'https://bisegrw.edu.pk/result-gazatte.html',
    isOfficial: true,
    supportsRollNumber: null,
    supportsName: null,
    supportsSms: null,
    supportsGazette: true,
    hasCaptcha: null,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'gazette-guidance',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. Publishes HSSC Part-II annual gazettes up to and including 2025. No 2026 Part-II gazette was listed on the page at the time of checking.',
  },
  // ------------------------------------------------------------ Faisalabad
  {
    id: 'faisalabad-official-base',
    boardId: 'bise-faisalabad',
    sourceType: 'official-homepage',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: [],
    yearsObserved: [],
    lookupModesObserved: [],
    additionalIdentifiersObserved: [],
    resourceKinds: [],
    observedVia: 'not-observed',
    name: 'BISE Faisalabad official website',
    url: 'https://bisefsd.edu.pk/',
    isOfficial: true,
    supportsRollNumber: null,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: null,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'manual-verification-only',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: null,
    status: 'blocked',
    provenanceNote:
      'NOT OBSERVED. On 2026-09-14 seven hosts were tried (www, apex, result., results., slip., duty., iradmission.) plus static .pdf and .html assets; every one returned 403 except results.bisefsd.edu.pk, which is NXDOMAIN. result.bisefsd.edu.pk answering 403 rather than NXDOMAIN proves the host exists. This is a WAF user-agent block, not an outage, and was not evaded. bisefsd.edu.pk/InterResults.aspx is the likely Part-II portal but is UNVERIFIED and is therefore not registered as a result source. Needs a human with an ordinary browser.',
  },
  // ---------------------------------------------------------------- Multan
  {
    id: 'multan-result-archive',
    boardId: 'bise-multan',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: ['Part-II / Combined Results'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker', 'result-archive'],
    observedVia: 'automated-fetch',
    name: 'BISE Multan result archive',
    url: 'https://results.bisemultan.edu.pk/archive',
    isOfficial: true,
    supportsRollNumber: true,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: null,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. This is where web.bisemultan.edu.pk/results-12/ now 301-redirects to; the old path should not be published as the portal. Fields observed: roll number plus an exam-session dropdown, with "Part-II / Combined Results — 11 sessions available". Separately, the board\'s trace-12 admission-status dropdown lists "HSSC (P-II/Combined) 1st Annual 2026", which confirms the 2026 Part-II session exists administratively but is NOT evidence that its result is declared. No CAPTCHA appeared in the fetched text, which is not the same as verifying that none is present.',
  },
  {
    id: 'multan-gazette',
    boardId: 'bise-multan',
    sourceType: 'official-gazette',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: [],
    additionalIdentifiersObserved: [],
    resourceKinds: ['gazette'],
    observedVia: 'automated-fetch',
    name: 'BISE Multan intermediate result gazette',
    url: 'https://web.bisemultan.edu.pk/result-gazette-inter/',
    isOfficial: true,
    supportsRollNumber: null,
    supportsName: null,
    supportsSms: null,
    supportsGazette: true,
    hasCaptcha: null,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'gazette-guidance',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. Part-II appears only inside combined gazettes for 2017 and 2018 — this is not a current Part-II gazette archive, and must not be presented to a reader as one.',
  },
  // ----------------------------------------------------------- Rawalpindi
  {
    id: 'rawalpindi-result-portal',
    boardId: 'bise-rawalpindi',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: yearRange(2015, 2026),
    lookupModesObserved: [
      '12th',
      'HSSC Second Annual Examination',
      'Inter Supplementary',
      'HSSC Special',
    ],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Rawalpindi result portal',
    url: 'https://results.biserawalpindi.edu.pk/',
    isOfficial: true,
    supportsRollNumber: true,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: null,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. Fields observed: roll number, a class dropdown offering 12th, HSSC Second Annual Examination, Inter Supplementary and HSSC Special, and a year dropdown from 2026 back to 2015. No CAPTCHA appeared in the fetched text. That is NOT verified absence — the fetch converts pages to markdown and drops form controls — so this source stays on official-link mode and is not eligible for server integration.',
  },
  // -------------------------------------------------------------- Sargodha
  {
    id: 'sargodha-result-portal',
    boardId: 'bise-sargodha',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: ['1st Annual', '2nd Annual-Supplementary'],
    additionalIdentifiersObserved: ['B-Form No.'],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Sargodha result portal',
    url: 'https://results.bisesargodha.edu.pk/',
    isOfficial: true,
    supportsRollNumber: true,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: null,
    requiresAdditionalIdentifier: true,
    additionalIdentifierNote:
      'Asks for a B-Form number in addition to the roll number. A reader who does not have one to hand cannot complete this lookup.',
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. Fields observed: roll number, B-Form No., a class dropdown (Inter 11th / 12th), a year dropdown and a session dropdown offering 1st Annual and 2nd Annual-Supplementary, behind a "VIEW RESULT" control. No CAPTCHA appeared in the fetched text, which is not verified absence.',
  },
  // ------------------------------------------------------------ Bahawalpur
  {
    id: 'bahawalpur-result-portal',
    boardId: 'bise-bahawalpur',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: ['HSSC Part-II 1st Annual'],
    additionalIdentifiersObserved: ['B-Form Number', 'CNIC'],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Bahawalpur HSSC Part-II result',
    url: 'https://results.bisebwp.pk/indexHSSC_PII.aspx',
    isOfficial: true,
    supportsRollNumber: true,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: true,
    requiresAdditionalIdentifier: true,
    additionalIdentifierNote:
      'Asks for a B-Form or CNIC number in addition to the roll number, and presents a security check.',
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. The page is still headed 2025 — it is the Part-II 1st Annual route, not a 2026 result. A companion route for the second annual session exists at indexHSSC_PIIs.aspx. A CAPTCHA is present, which forecloses server integration.',
  },
  {
    id: 'bahawalpur-result-portal-second-annual',
    boardId: 'bise-bahawalpur',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: ['HSSC Part-II 2nd Annual'],
    additionalIdentifiersObserved: ['B-Form Number', 'CNIC'],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Bahawalpur HSSC Part-II second annual result',
    url: 'https://results.bisebwp.pk/indexHSSC_PIIs.aspx',
    isOfficial: true,
    supportsRollNumber: true,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: true,
    requiresAdditionalIdentifier: true,
    additionalIdentifierNote:
      'Asks for a B-Form or CNIC number in addition to the roll number, and presents a security check.',
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. The board publishes separate routes per session; this is the Part-II second annual route. Still headed 2025 at the time of checking.',
  },
  // --------------------------------------------------------------- Sahiwal
  {
    id: 'sahiwal-result-portal',
    boardId: 'bise-sahiwal',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: yearRange(2012, 2026),
    lookupModesObserved: ['Annual', '2nd Annual'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Sahiwal result portal',
    url: 'https://bisesahiwal.edu.pk/allresult/',
    isOfficial: true,
    supportsRollNumber: true,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: null,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. Fields observed: a class dropdown (9, 10, 11, 12), a year dropdown from 2026 back to 2012, and a session dropdown offering Annual and 2nd Annual. No CAPTCHA appeared in the fetched text, which is not verified absence.',
  },
  {
    id: 'sahiwal-gazette',
    boardId: 'bise-sahiwal',
    sourceType: 'official-gazette',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: [],
    additionalIdentifiersObserved: [],
    resourceKinds: ['gazette'],
    observedVia: 'automated-fetch',
    name: 'BISE Sahiwal result statistics and gazette',
    url: 'https://bisesahiwal.edu.pk/result-stats-gazzet.php',
    isOfficial: true,
    supportsRollNumber: null,
    supportsName: null,
    supportsSms: null,
    supportsGazette: true,
    hasCaptcha: null,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'gazette-guidance',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. Publishes result statistics and gazette documents, including an entry labelled "Stats Inter 2nd Annual 2026". A statistics sheet is not a per-candidate gazette and must not be described as one.',
  },
  // -------------------------------------------------------------- DG Khan
  {
    id: 'dg-khan-result-directory',
    boardId: 'bise-dg-khan',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [2025],
    lookupModesObserved: ['Intermediate (Part-II & Combined) 1st Annual Examination, 2025'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker', 'result-archive'],
    observedVia: 'automated-fetch',
    name: 'BISE DG Khan HSSC result links',
    url: 'https://bisedgkhan.edu.pk/results-hssc.php',
    isOfficial: true,
    supportsRollNumber: true,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: null,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. This is a directory of per-year result portals rather than a single checker. The most recent Part-II entry is "Online Result For Intermediate (Part-II & Combined) 1st Annual Examination, 2025", which takes a roll number only. NO 2026 link existed on the page at the time of checking, so nothing here supports a 2026 claim.',
  },
  // ----------------------------------------------------------------- FBISE
  {
    id: 'fbise-result-portal',
    boardId: 'fbise',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'linked-from-verified',
    examLevelsObserved: [],
    yearsObserved: [],
    lookupModesObserved: [],
    additionalIdentifiersObserved: [],
    resourceKinds: [],
    observedVia: 'not-observed',
    name: 'FBISE result portal',
    url: 'https://portal.fbise.edu.pk/fbise-conduct/result/',
    isOfficial: true,
    supportsRollNumber: null,
    supportsName: null,
    supportsSms: null,
    supportsGazette: null,
    hasCaptcha: null,
    requiresAdditionalIdentifier: null,
    additionalIdentifierNote: null,
    integrationMode: 'manual-verification-only',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: null,
    status: 'blocked',
    provenanceNote:
      "NOT OBSERVED. On 2026-09-14 result.fbise.edu.pk returned a 301 to this address, which establishes where the portal lives on the board's own domain; the destination itself returned 403, as did fbise.edu.pk across six paths. This is a WAF user-agent block, not an outage, and was not evaded. A name= parameter appears in search-engine index entries for the board, but that was never seen live and is NOT treated as evidence that name lookup is supported.",
  },
] as const

const SOURCE_BY_ID = new Map(RESULT_SOURCES.map((s) => [s.id, s]))

export function getSource(id: string): ResultSource | undefined {
  return SOURCE_BY_ID.get(id)
}

export function getSourcesForBoard(boardId: string): ResultSource[] {
  return RESULT_SOURCES.filter((s) => s.boardId === boardId)
}

/**
 * Sources whose ownership is proven. Anything else must never be labelled
 * official in the UI, however plausible the domain looks.
 */
export function verifiedSources(boardId: string): ResultSource[] {
  return getSourcesForBoard(boardId).filter((s) => s.ownershipStatus === 'verified')
}

/**
 * Verified official sources safe to put in front of a reader as a link.
 * Excludes anything observed to be offline.
 */
export function linkableSources(boardId: string): ResultSource[] {
  return verifiedSources(boardId).filter((s) => s.isOfficial && s.status !== 'offline')
}

/**
 * Sources safe to present as a direct result-checking route for a student.
 *
 * Excludes gazette and guidance-only records, so the primary call to action
 * never sends someone to a document archive expecting a roll-number lookup.
 */
export function rollNumberSources(boardId: string): ResultSource[] {
  return getSourcesForBoard(boardId).filter(
    (s) =>
      s.supportsRollNumber === true &&
      s.sourceType === 'official-result' &&
      s.ownershipStatus === 'verified' &&
      s.examLevelsObserved.includes('hssc-part-2') &&
      s.status !== 'offline',
  )
}

/**
 * Sources this project is allowed to contact from the server.
 *
 * Currently empty by construction: no board has had a CAPTCHA's absence
 * positively verified, and section 144 permits server integration only where it
 * has been. This is a policy gate, not an oversight.
 */
export function serverIntegrableSources(): ResultSource[] {
  return RESULT_SOURCES.filter((s) => s.integrationMode === 'server-integration')
}

/** Gazette routes verified on a board's own domain. */
export function gazetteSources(boardId: string): ResultSource[] {
  return getSourcesForBoard(boardId).filter(
    (s) => s.sourceType === 'official-gazette' && s.ownershipStatus === 'verified',
  )
}

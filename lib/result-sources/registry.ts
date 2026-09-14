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
    supportsRollNumber: 'verified-supported',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'verified-supported',
    requiresAdditionalIdentifier: 'unknown',
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
    supportsRollNumber: 'verified-supported',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'verified-supported',
    requiresAdditionalIdentifier: 'unknown',
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
    supportsRollNumber: 'unknown',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'verified-supported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'unknown',
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
    supportsRollNumber: 'blocked',
    supportsName: 'blocked',
    supportsSms: 'blocked',
    supportsGazette: 'blocked',
    hasCaptcha: 'blocked',
    requiresAdditionalIdentifier: 'blocked',
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
    supportsRollNumber: 'verified-supported',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'verified-supported',
    requiresAdditionalIdentifier: 'unknown',
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
    supportsRollNumber: 'unknown',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'verified-supported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'unknown',
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
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-supported',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'unknown',
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
    supportsRollNumber: 'verified-supported',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-supported',
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
    supportsRollNumber: 'verified-supported',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'verified-supported',
    requiresAdditionalIdentifier: 'verified-supported',
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
    supportsRollNumber: 'verified-supported',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'verified-supported',
    requiresAdditionalIdentifier: 'verified-supported',
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
    supportsRollNumber: 'verified-supported',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'unknown',
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
    supportsRollNumber: 'unknown',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'verified-supported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'unknown',
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
    supportsRollNumber: 'verified-supported',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'unknown',
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
    supportsRollNumber: 'blocked',
    supportsName: 'blocked',
    supportsSms: 'blocked',
    supportsGazette: 'blocked',
    hasCaptcha: 'blocked',
    requiresAdditionalIdentifier: 'blocked',
    additionalIdentifierNote: null,
    integrationMode: 'manual-verification-only',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: null,
    status: 'blocked',
    provenanceNote:
      "NOT OBSERVED. On 2026-09-14 result.fbise.edu.pk returned a 301 to this address, which establishes where the portal lives on the board's own domain; the destination itself returned 403, as did fbise.edu.pk across six paths. This is a WAF user-agent block, not an outage, and was not evaded. A name= parameter appears in search-engine index entries for the board, but that was never seen live and is NOT treated as evidence that name lookup is supported.",
  },
  // ------------------------------------------------------- Khyber Pakhtunkhwa
  {
    id: 'peshawar-result-portal',
    boardId: 'bise-peshawar',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'linked-from-verified',
    examLevelsObserved: [],
    yearsObserved: [],
    lookupModesObserved: ['Roll No'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Peshawar result portal',
    url: 'https://cloud.bisep.edu.pk/',
    isOfficial: true,
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-unsupported',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14, reached by a 301 from the board’s own /results/ path, which is itself linked from a provincial government department page. A single roll-number field with search and reset; no name, CNIC, year, session or class selector. The portal exposes ONE session at a time and was serving SSC Annual-I 2026, so no HSSC entry point was present at all. `examLevelsObserved` is therefore empty: the rotation means a level seen today is not a level offered tomorrow.',
  },
  {
    id: 'mardan-result-portal',
    boardId: 'bise-mardan',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: [],
    yearsObserved: [],
    lookupModesObserved: ['Roll No'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Mardan result portal',
    url: 'https://result.bisemdn.edu.pk/',
    isOfficial: true,
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-unsupported',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. A required roll-number field only. Like Peshawar it offers one session at a time and was serving SSC Annual-I 2026. The board’s most recent HSSC result notice was for the Annual-II 2025 session, declared 5 February 2026 — no HSSC Annual-I 2026 result notice existed.',
  },
  {
    id: 'abbottabad-result-portal',
    boardId: 'bise-abbottabad',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2', 'ssc-part-1', 'ssc-part-2'],
    yearsObserved: yearRange(2012, 2026),
    lookupModesObserved: ['SSC (9th & 10th)', 'HSSC (11th & 12th)'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker', 'result-archive'],
    observedVia: 'automated-fetch',
    name: 'BISE Abbottabad result portal',
    url: 'https://www.biseatd.edu.pk/all_results.php',
    isOfficial: true,
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-unsupported',
    supportsSms: 'unknown',
    supportsGazette: 'verified-unsupported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. The deepest HSSC route observed in Khyber Pakhtunkhwa: a class dropdown offering SSC and HSSC, a year dropdown from 2026 back to 2012, a session dropdown and a roll-number field. The page carries the board’s own disclaimer that the result is issued provisionally as a notice only. No gazette was found anywhere on the domain.',
  },
  {
    id: 'swat-result-portal',
    boardId: 'bise-swat',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2', 'ssc-part-1', 'ssc-part-2'],
    yearsObserved: yearRange(2005, 2026),
    lookupModesObserved: ['Matric', 'Intermediate', 'Annual-I', 'Annual-II'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker', 'result-archive'],
    observedVia: 'automated-fetch',
    name: 'BISE Swat results section',
    url: 'https://www.bisess.edu.pk/site/home/results-section',
    isOfficial: true,
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-supported',
    supportsSms: 'unknown',
    supportsGazette: 'verified-unsupported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. Class, examination (9th to 12th, Annual-I and Annual-II), roll number, and a year dropdown from 2026 back to 2005. A separate latest-result page additionally offers search by name and by institute — recorded because a reader deserves to know, not because name lookup is promoted. The page carries the board’s own instruction to verify against the original DMC.',
  },
  {
    id: 'bannu-result-portal',
    boardId: 'bise-bannu',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: ['HSSC (11th & 12th) Annual-II 2025'],
    additionalIdentifiersObserved: ['Father Name'],
    resourceKinds: ['result-checker', 'result-archive'],
    observedVia: 'automated-fetch',
    name: 'BISE Bannu result search',
    url: 'https://www.biseb.edu.pk/result-search.php',
    isOfficial: true,
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-supported',
    supportsSms: 'unknown',
    supportsGazette: 'verified-unsupported',
    hasCaptcha: 'verified-supported',
    requiresAdditionalIdentifier: 'unknown',
    additionalIdentifierNote:
      'The name-based search asks for a father’s name alongside the candidate name.',
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. A result archive running back to 2017, including HSSC Annual-I and Annual-II sessions. TWO search methods, each guarded by its own CAPTCHA image with a refresh control — this is the only Khyber Pakhtunkhwa board where a CAPTCHA was positively established rather than merely suspected. The board’s downloads page holds no gazette.',
  },
  {
    id: 'malakand-result-portal',
    boardId: 'bise-malakand',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: ['11th', '12th'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Malakand result page',
    url: 'https://www.bisemalakand.edu.pk/result/latest-supply',
    isOfficial: true,
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-unsupported',
    supportsSms: 'unknown',
    supportsGazette: 'verified-unsupported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14 showing "Result: SSC & HSSC Annual-II 2025", with a class dropdown offering 11th and 12th plus a roll-number field. NOTE: the board also exposes a generic "latest annual" path which rendered a 9th/10th result — that path must never be published as an HSSC link, because what it serves changes with the session. Its overall-results page is a statistics and toppers listing, not a gazette.',
  },
  {
    id: 'dera-ismail-khan-result-portal',
    boardId: 'bise-dera-ismail-khan',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2', 'ssc-part-1', 'ssc-part-2'],
    yearsObserved: yearRange(2016, 2026),
    lookupModesObserved: [
      'HSSC Annual / Annual-I',
      'HSSC Supply / Annual-II',
      'SSC Annual / Annual-I',
      'SSC Supply / Annual-II',
    ],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker', 'result-archive'],
    observedVia: 'automated-fetch',
    name: 'BISE D.I. Khan result portal',
    url: 'https://www.bisedik.edu.pk/results',
    isOfficial: true,
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-unsupported',
    supportsSms: 'unknown',
    supportsGazette: 'verified-unsupported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. Class, year 2016 to 2026, an exam-code dropdown naming HSSC Annual-I and HSSC Annual-II explicitly, and a roll-number field. One of the three cleanest HSSC Part-II routes in Khyber Pakhtunkhwa. This is Dera ISMAIL Khan, in Khyber Pakhtunkhwa — not Dera Ghazi Khan, in Punjab.',
  },

  // ------------------------------------------------------------------- Sindh
  {
    id: 'biek-gazette',
    boardId: 'biek',
    sourceType: 'official-gazette',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [2022, 2026],
    lookupModesObserved: [],
    additionalIdentifiersObserved: [],
    resourceKinds: ['gazette'],
    observedVia: 'automated-fetch',
    name: 'BIEK Karachi result gazettes',
    url: 'https://www.biek.edu.pk/results.asp',
    isOfficial: true,
    supportsRollNumber: 'verified-unsupported',
    supportsName: 'verified-unsupported',
    supportsSms: 'unknown',
    supportsGazette: 'verified-supported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'gazette-guidance',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. THIS BOARD HAS NO ROLL-NUMBER LOOKUP ANYWHERE ON ITS DOMAIN — the result pages are lists of gazette PDF links with no input fields at all, so roll number and name are recorded as verified ABSENT rather than unknown. The board’s own statutory history page records that a 1972 ordinance split the former combined board, giving intermediate examinations to this board; that is why the Karachi SECONDARY board is not registered here. Part-II Annual 2026 is published per group across seven separate declarations between 31 July and 27 August 2026, with Commerce still undeclared on the date checked. The same per-group pattern is visible in its 2022 archive.',
  },
  {
    id: 'hyderabad-result-index',
    boardId: 'bise-hyderabad',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [2026],
    lookupModesObserved: [],
    additionalIdentifiersObserved: [],
    resourceKinds: ['gazette', 'result-archive'],
    observedVia: 'automated-fetch',
    name: 'BISE Hyderabad result index',
    url: 'https://www.biseh.edu.pk/',
    isOfficial: true,
    supportsRollNumber: 'verified-unsupported',
    supportsName: 'verified-unsupported',
    supportsSms: 'unknown',
    supportsGazette: 'verified-supported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'gazette-guidance',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. No roll-number lookup exists on this domain; HSC-II Annual 2026 results are published as per-group files with position holders and statistics, and Commerce, Home Economics and Medical were present while Pre-Engineering, Science General and Humanities were not. THE BOARD PRINTS NO DECLARATION DATES against any of them, so any date quoted elsewhere for "the Hyderabad result" did not come from this board. The board’s governance page names the provincial chief minister as its controlling authority and its history page records establishment under a 1961 ordinance. A domain listed for this board in a federal directory serves an expired certificate; the host recorded here is the working one.',
  },
  {
    id: 'larkana-result-portal',
    boardId: 'bise-larkana',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'linked-from-verified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2', 'ssc-part-1', 'ssc-part-2'],
    yearsObserved: [],
    lookupModesObserved: ['HSC-I', 'HSC-II', 'Science', 'General'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BISE Larkana result portal',
    url: 'https://results.biselrk.edu.pk/',
    isOfficial: true,
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-supported',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14 and reached from the board’s own results page, so ownership is properly chained — the only interior-Sindh board for which that was true. A class selector offering HSC-I and HSC-II, a GROUP selector offering Science and General, and search by roll number, name or institution code. The board’s history page records establishment in December 1995 under a provincial ordinance, with jurisdiction over five districts. Its notifications and date-sheet pages are JavaScript-driven and returned nothing, so no 2026 declaration could be established.',
  },

  // ------------------------------------------------------------- Balochistan
  {
    id: 'quetta-result-portal',
    boardId: 'bbise',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2'],
    yearsObserved: [2025, 2026, 2027],
    lookupModesObserved: ['Annual', 'Supplementary', '11th', '12th'],
    additionalIdentifiersObserved: [],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'BBISE Quetta HSSC result portal',
    url: 'https://result.bbise.edu.pk/Results/HSSC',
    isOfficial: true,
    supportsRollNumber: 'verified-supported',
    supportsName: 'verified-unsupported',
    supportsSms: 'unknown',
    supportsGazette: 'unknown',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. A roll-number field, a year dropdown, a session dropdown offering Annual and Supplementary, and a class dropdown offering 11th and 12th. The board’s own about page gives its full name and province-wide jurisdiction under a 1976 ordinance, and an older domain listed in a federal directory redirects here. One caveat recorded honestly: a second page on the same site rendered a wider set of year and session options, and which is authoritative was not established.',
  },
  {
    id: 'quetta-gazette',
    boardId: 'bbise',
    sourceType: 'official-gazette',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2'],
    yearsObserved: [2026],
    lookupModesObserved: [],
    additionalIdentifiersObserved: [],
    resourceKinds: ['gazette', 'result-archive'],
    observedVia: 'automated-fetch',
    name: 'BBISE Quetta notifications and gazettes',
    url: 'https://bbise.edu.pk/Notifications',
    isOfficial: true,
    supportsRollNumber: 'verified-unsupported',
    supportsName: 'verified-unsupported',
    supportsSms: 'unknown',
    supportsGazette: 'verified-supported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-unsupported',
    additionalIdentifierNote: null,
    integrationMode: 'gazette-guidance',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. THE ONLY BOARD IN THE COUNTRY OBSERVED TO HAVE DECLARED ITS HSSC 2026 RESULT. Two notifications dated 20 July 2026, titled "HSSC ANNUAL RESULT 2026 ANNOUNCED" and "HSSC RESULT 2026 NOTIFICATION", alongside Part-I and Part-II annual 2026 gazettes and an unfair-means list. The gazette PDFs load but are scanned images, so their contents are not machine-readable and no per-candidate data is claimed from them. A second-annual date sheet published 11 September 2026 gives examinations commencing 13 October 2026.',
  },

  // ------------------------------------------------------ Azad Jammu & Kashmir
  {
    id: 'ajk-gazette',
    boardId: 'ajkbise',
    sourceType: 'official-gazette',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-2'],
    yearsObserved: [2018, 2019, 2020, 2024],
    lookupModesObserved: [],
    additionalIdentifiersObserved: [],
    resourceKinds: ['gazette', 'result-archive'],
    observedVia: 'automated-fetch',
    name: 'AJK BISE result gazettes',
    url: 'https://www.ajkbise.net/results.php',
    isOfficial: true,
    supportsRollNumber: 'unknown',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'verified-supported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'unknown',
    additionalIdentifierNote: null,
    integrationMode: 'gazette-guidance',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. A result-gazettes section carrying HSSC Part-II files for 2018, 2019 including a supplementary session, a 2020 special session, and both 2024 annual sessions; one file was fetched and confirmed to load. The board’s online HSSC result form sits on a separate host that refused automated requests, so the gazette is the route that could be verified rather than merely assumed. CAUTION recorded for downstream use: another subdomain of this board resolves but serves a hosting-panel default page, and must never be presented as a result URL. The board publishes no about page, so its statutory name and establishing instrument remain unverified.',
  },

  // ----------------------------------------------------------------- Private
  {
    id: 'aku-eb-results',
    boardId: 'aku-eb',
    sourceType: 'official-result',
    ownershipStatus: 'verified',
    ownershipVerification: 'self-identified',
    examLevelsObserved: ['hssc-part-1', 'hssc-part-2', 'ssc-part-1', 'ssc-part-2'],
    yearsObserved: [2024, 2025, 2026],
    lookupModesObserved: ['Candidate', 'School', 'HSSC Part II Annual Examinations 2026'],
    additionalIdentifiersObserved: ['Date of Birth'],
    resourceKinds: ['result-checker'],
    observedVia: 'automated-fetch',
    name: 'AKU-EB online results',
    url: 'https://examinationboard.aku.edu/services/Pages/online-results.aspx',
    isOfficial: true,
    supportsRollNumber: 'unknown',
    supportsName: 'unknown',
    supportsSms: 'unknown',
    supportsGazette: 'verified-unsupported',
    hasCaptcha: 'unknown',
    requiresAdditionalIdentifier: 'verified-supported',
    additionalIdentifierNote:
      'The lookup asks for a date of birth alongside the examination session.',
    integrationMode: 'official-link',
    lastCheckedAt: CHECKED_AT,
    lastSuccessfulCheckAt: CHECKED_AT,
    status: 'online',
    provenanceNote:
      'Loaded 2026-09-14. A private examination board established in 2002 under a federal ordinance, per its own about page. The lookup offers a candidate or school toggle, an examination dropdown that explicitly lists "HSSC Part II Annual Examinations 2026", and a date-of-birth selector. Whether a candidate identifier field is revealed after choosing "Candidate" was NOT observed across two reads, so roll-number support is recorded as unknown rather than assumed. The board’s news listing and forms listing were both empty, so no 2026 announcement, gazette or rechecking process could be established.',
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
      s.supportsRollNumber === 'verified-supported' &&
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

/**
 * Boards with an official RESULT source that was actually loaded.
 *
 * Replaces a string match on source ids (`id.includes('result')`), which was a
 * heuristic being rendered to readers as a verified count. This asks the three
 * questions the claim actually makes: the source is official, it is a result
 * source rather than a homepage, and someone or something genuinely fetched it.
 */
export function boardsWithObservedResultPortal(): string[] {
  const boardIds = new Set<string>()
  for (const source of RESULT_SOURCES) {
    if (!source.isOfficial) continue
    if (source.sourceType !== 'official-result') continue
    if (source.observedVia === 'not-observed') continue
    boardIds.add(source.boardId)
  }
  return [...boardIds]
}

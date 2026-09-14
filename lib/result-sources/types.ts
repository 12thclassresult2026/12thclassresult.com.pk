/**
 * The official-source registry contract (sections 66, 69, 87, 144).
 *
 * Every claim this site makes about a board traces back to a record of this
 * shape. The doc comments here are the specification — the invariants they
 * describe are enforced in tests/validation.
 */

export type SourceType =
  | 'official-result'
  /** A result CARD download, which is not a result checker. */
  | 'official-result-card'
  | 'official-notice'
  | 'official-gazette'
  | 'official-homepage'
  | 'secondary-reference'

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  'official-result': 'Result lookup',
  'official-result-card': 'Result card',
  'official-notice': 'Board notice',
  'official-gazette': 'Gazette',
  'official-homepage': 'Board website',
  'secondary-reference': 'Reference',
}

/**
 * What a resource actually IS, kept apart from what it is about.
 *
 *  - `result-checker`  a live lookup: you give an identifier, it returns a result
 *  - `result-card`     a downloadable card, issued AFTER a result is declared
 *  - `result-archive`  past sessions; proves history, never the current one
 *  - `gazette`         an institution-wide list, published on its own schedule
 *  - `roll-slip`       an EXAM document. Proves an exam happened, not a result
 *  - `trace-record`    a record-tracing tool, not necessarily a public result
 */
export type ResultResourceKind =
  'result-checker' | 'result-card' | 'result-archive' | 'gazette' | 'roll-slip' | 'trace-record'

/** How an observation was made. `not-observed` forbids any capability claim. */
export type ObservedVia = 'automated-fetch' | 'manual-browser' | 'not-observed'

/**
 * A repo-wide, machine-checkable statement of the access policy (section 68).
 * No user agent is spoofed, no browser is emulated, no CAPTCHA is touched, no
 * form is submitted, no identifier is entered, and no URL is constructed by
 * editing a year token in someone else's address.
 */
export const AUTOMATED_FETCH_POLICY = 'do-not-bypass' as const

export type SourceAvailability = 'unknown' | 'online' | 'degraded' | 'offline' | 'blocked'

/** Whether we have proven the entity behind a domain is really the board. */
export type OwnershipStatus = 'verified' | 'candidate' | 'unverified'

export type OwnershipVerification = 'self-identified' | 'linked-from-verified' | 'owner-attested'

export type ExamLevel =
  'hssc-part-1' | 'hssc-part-2' | 'ssc-part-1' | 'ssc-part-2' | 'ssc-matric-tech' | 'other'

/** This project's subject: Class 12 / Second Year / HSSC Part-II. */
export const PRIMARY_EXAM_LEVEL = 'hssc-part-2' as const

export const EXAM_LEVEL_LABELS: Record<ExamLevel, string> = {
  'hssc-part-1': 'HSSC Part-I (11th Class)',
  'hssc-part-2': 'HSSC Part-II (12th Class)',
  'ssc-part-1': 'SSC Part-I (9th Class)',
  'ssc-part-2': 'SSC Part-II (10th Class)',
  'ssc-matric-tech': 'SSC (Matric Tech)',
  other: 'Other examination',
}

export type ResultState =
  'unknown' | 'not-announced' | 'expected' | 'announced' | 'live' | 'archived'

/**
 * How this project is permitted to interact with a source.
 * `official-link` is the safe default and the ONLY mode allowed for a source
 * behind a CAPTCHA (section 144).
 */
export type IntegrationMode =
  | 'official-link'
  | 'cached-status-only'
  | 'server-integration'
  | 'sms-guidance'
  | 'gazette-guidance'
  | 'manual-verification-only'

/**
 * THE CAPABILITY TRI-STATE.
 *
 * `true`  = directly observed on the live page.
 * `false` = verified absent on the pages actually fetched.
 * `null`  = NOT VERIFIED. Absence of evidence, not evidence of absence.
 *
 * The UI advertises a method only when the flag is explicitly `true`.
 */
export type ResultSource = {
  id: string
  boardId: string
  sourceType: SourceType
  ownershipStatus: OwnershipStatus
  ownershipVerification: OwnershipVerification | null
  /** Exam levels the source was OBSERVED to offer. Never inferred. */
  examLevelsObserved: ExamLevel[]
  /** Years the source was OBSERVED to enumerate. Never inferred. */
  yearsObserved: number[]
  /** The board's OWN wording for its lookup modes, e.g. "By Form No.". */
  lookupModesObserved: string[]
  /** Kept verbatim, never normalised, e.g. "B-Form Number". */
  additionalIdentifiersObserved: string[]
  resourceKinds: ResultResourceKind[]
  observedVia: ObservedVia
  name: string
  url: string
  isOfficial: boolean
  supportsRollNumber: boolean | null
  supportsName: boolean | null
  supportsSms: boolean | null
  supportsGazette: boolean | null
  hasCaptcha: boolean | null
  requiresAdditionalIdentifier: boolean | null
  additionalIdentifierNote: string | null
  integrationMode: IntegrationMode
  lastCheckedAt: string | null
  lastSuccessfulCheckAt: string | null
  status: SourceAvailability
  /** Prose recording exactly what was seen, when, and what was NOT seen. */
  provenanceNote: string
}

export type SourceHealth = {
  sourceId: string
  checkedAt: string
  httpStatus?: number
  latencyMs?: number
  availability: SourceAvailability
  /**
   * Never inferred from an HTTP 200 alone (section 69). A board homepage
   * returns 200 all year; that says nothing about whether a result is out.
   */
  resultState: ResultState
}

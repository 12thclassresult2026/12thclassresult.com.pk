import type { CapabilityStatus } from '@/lib/result/capability'
import type { ExamLevel } from '@/lib/result-sources/types'
import type { VerifiedFact } from '@/lib/result/verified-fact'

/**
 * The board data model (ADR-005).
 *
 * THE CENTRAL FACT THIS MODEL ENCODES:
 *
 *   There is not one board model in Pakistan. There are four, and they are
 *   orthogonal.
 *
 * Karachi has no roll-number lookup at all and declares group by group across
 * four weeks. Hyderabad publishes per group with no dates. AJK's route is the
 * gazette. Peshawar and Mardan expose one examination session at a time, so a
 * deep link built today points at a different class next month.
 *
 * Every competitor in this market assumes a single model — a roll-number form
 * with one declaration per year — and is therefore structurally wrong about
 * roughly a fifth of the country.
 */

/**
 * HOW a candidate reaches their result at this board.
 *
 * This drives the primary call to action. A `gazette-only` board must never be
 * shown a roll-number prompt: it does not have one.
 */
export type ResultAccessModel =
  /** A form accepts a roll number. */
  | 'roll-number-portal'
  /** No lookup form exists; the gazette IS the route. */
  | 'gazette-only'
  /** The portal exposes one session at a time, so deep links rot. */
  | 'session-rotating-portal'
  /** We could not establish how this board publishes results. */
  | 'unverified'

export const ACCESS_MODEL_LABELS: Record<ResultAccessModel, string> = {
  'roll-number-portal': 'Roll number lookup',
  'gazette-only': 'Gazette only',
  'session-rotating-portal': 'Rotating session portal',
  unverified: 'Not verified',
}

/** WHETHER the board declares every group together. */
export type DeclarationModel =
  /** One declaration covers every group. */
  | 'whole-board'
  /** Each group declares separately, on its own date. */
  | 'per-group'
  | 'unknown'

/**
 * Study groups. A real entity: groups determine subject sets, marks
 * distribution and admission eligibility — and in Sindh they determine the
 * declaration date too.
 */
export type GroupId =
  | 'pre-medical'
  | 'pre-engineering'
  | 'science-general'
  | 'commerce'
  | 'humanities'
  | 'home-economics'
  | 'medical-technology'

export const GROUP_LABELS: Record<GroupId, string> = {
  'pre-medical': 'Pre-Medical',
  'pre-engineering': 'Pre-Engineering',
  'science-general': 'Science General',
  commerce: 'Commerce',
  humanities: 'Humanities',
  'home-economics': 'Home Economics',
  'medical-technology': 'Medical Technology',
}

/**
 * Methods confirmed for ONE examination, ONE year and ONE group.
 *
 * Deliberately separate from a source's capability flags. A portal whose form
 * offers "HSSC Part-II" in one dropdown and "2026" in another has described a
 * cross-product of form options — NOT that a 2026 Part-II dataset exists behind
 * them. Engine capability must never inherit down to the dataset.
 */
export type DatasetMethods = {
  rollNumber: CapabilityStatus
  name: CapabilityStatus
  sms: CapabilityStatus
  gazette: CapabilityStatus
}

export type ResultDataset = {
  examLevel: ExamLevel
  year: number
  /** `null` means a whole-board declaration covering every group. */
  group: GroupId | null
  /** Per-group declaration date. Karachi's groups differ by about four weeks. */
  declaredAt: VerifiedFact<string>
  /** Methods confirmed for THIS exam, year and group. Never inherited. */
  methodsConfirmed: DatasetMethods
  released: VerifiedFact<boolean>
  /** For a gazette-only board this is the access route, not an extra. */
  gazetteSourceId?: string
}

export type Province =
  | 'punjab'
  | 'sindh'
  | 'khyber-pakhtunkhwa'
  | 'balochistan'
  | 'federal'
  | 'azad-jammu-kashmir'
  | 'gilgit-baltistan'

export const PROVINCE_LABELS: Record<Province, string> = {
  punjab: 'Punjab',
  sindh: 'Sindh',
  'khyber-pakhtunkhwa': 'Khyber Pakhtunkhwa',
  balochistan: 'Balochistan',
  federal: 'Federal',
  'azad-jammu-kashmir': 'Azad Jammu & Kashmir',
  'gilgit-baltistan': 'Gilgit-Baltistan',
}

/**
 * Four states, and the middle two matter.
 *
 *  - `planned`   registered so a directory can name the board honestly and
 *                link its official source — but NO page exists at all.
 *  - `draft`     a page exists and serves at its route, held `noindex`.
 *  - `review`    built and awaiting publication review.
 *  - `published` reviewed, indexable, in the sitemap.
 *
 * Collapsing `planned` into `draft` would make eighteen registered boards look
 * like eighteen held pages — a different and much worse claim about how much of
 * this site exists.
 */
export type PublishState = 'published' | 'review' | 'draft' | 'planned'

export type Board = {
  /** Stable internal id. Never derived from a URL. */
  id: string
  /** URL slug. Lowercase, hyphenated, unique. Always `{city}-board`. */
  slug: string
  /** Full official name, exactly as the board writes it. */
  officialName: string
  /** Short display name used in compact UI. */
  shortName: string
  province: Province
  /** Board homepage. An empty string is not permitted — omit the board instead. */
  officialWebsite: string

  /** How a candidate reaches their result here. Drives the primary action. */
  accessModel: ResultAccessModel
  /** Whether every group declares together. */
  declarationModel: DeclarationModel

  /** Ids into the result-source registry. */
  sourceIds: string[]
  publishState: PublishState

  resultDate: VerifiedFact<string>
  smsCode: VerifiedFact<string>
  gazetteAvailable: VerifiedFact<boolean>

  resultDatasets: ResultDataset[]

  /** Cautions that apply to THIS board and no other, in student-facing words. */
  studentCautions?: string[]
  /** ISO 8601 timestamp of the last review of this board record. */
  lastVerifiedAt: string | null
}

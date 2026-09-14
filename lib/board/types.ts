import type { ExamLevel } from '@/lib/result-sources/types'
import type { VerifiedFact } from '@/lib/result/verified-fact'

/**
 * The board data model (section 20). Board facts live in one typed registry, so
 * no component ever hard-codes board logic and a re-verification moves one
 * value rather than twenty.
 */

/**
 * Methods confirmed for ONE examination and ONE year.
 *
 * Deliberately separate from a source's capability flags. A portal whose form
 * offers "HSSC Part-II" in one dropdown and "2026" in another has told you it
 * is a cross-product of options — NOT that a 2026 HSSC Part-II dataset exists
 * behind it. Engine capability must never inherit down to the dataset.
 */
export type DatasetMethods = {
  rollNumber: boolean | null
  name: boolean | null
  sms: boolean | null
  gazette: boolean | null
}

export type ResultDataset = {
  examLevel: ExamLevel
  year: number
  /** Methods confirmed for THIS exam and year. Engine support does not imply these. */
  methodsConfirmed: DatasetMethods
  released: VerifiedFact<boolean>
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
 * Three states, not two, and the middle one matters.
 *
 *  - `planned`   registered so a directory can name the board honestly and
 *                record its official source — but NO page exists at all.
 *  - `draft`     a page exists and serves at its route, held `noindex`.
 *  - `published` reviewed, indexable, in the sitemap.
 *
 * Collapsing `planned` into `draft` would make a dozen registered boards look
 * like a dozen held pages — a different and much worse claim about how much of
 * this site actually exists.
 */
export type PublishState = 'published' | 'draft' | 'planned'

export type Board = {
  /** Stable internal id. Never derived from a URL. */
  id: string
  /** URL slug. Lowercase, hyphenated, unique (section 21). */
  slug: string
  /** Full official board name, exactly as the board writes it. */
  officialName: string
  /** Short display name used in compact UI. */
  shortName: string
  province: Province
  /** Board homepage. An empty string is not permitted — omit the board instead. */
  officialWebsite: string
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

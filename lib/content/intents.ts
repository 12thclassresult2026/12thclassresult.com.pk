/**
 * The canonical intent registry.
 *
 * One search intent, one owning page. This is the machine-checkable form of
 * `docs/seo/cannibalization-map.csv`: a validation gate asserts that no two
 * published pages declare the same `intentId`, so consolidation decisions
 * cannot quietly rot as pages are added.
 *
 * An intent with no owner is recorded here deliberately rather than omitted.
 * "We are not building this, and here is why" is a decision worth keeping.
 */

export type IntentOwnership =
  /** A page owns this intent. */
  | 'owned'
  /** Deliberately unowned: the facts cannot be verified. */
  | 'blocked'
  /** Deliberately unowned: building it would be cannibalization or dishonest. */
  | 'rejected'
  /** Awaiting evidence before a decision. */
  | 'deferred'

export type Intent = {
  id: string
  /** What the reader is trying to do. */
  description: string
  ownership: IntentOwnership
  /** Why, for anything not owned. Required when ownership is not 'owned'. */
  reason?: string
}

export const INTENTS: readonly Intent[] = [
  {
    /*
     * The trust layer. A site that does not say who runs it, how it verifies a
     * fact, or how to report an error is hard for a journalist or an educator
     * to cite — and the footer already makes an independence claim that needs a
     * page behind it.
     */
    id: 'site.about',
    description: 'Find out who operates this site and whether it can be trusted.',
    ownership: 'owned',
  },
  {
    id: 'site.methodology',
    description: 'Understand how a fact on this site was verified, and what is never published.',
    ownership: 'owned',
  },
  {
    id: 'site.brand',
    description: 'Reach this site by name and route onward.',
    ownership: 'owned',
  },
  {
    /*
     * A separate intent from the roll-number lookup, not a variant of it. The
     * student searching "gazette download" wants the board's own file — to
     * check a sibling's roll number without typing each one, or to hand a
     * college the board's document. A lookup result does not answer that, and
     * the two should not compete for the same query.
     */
    id: 'gazette.downloads',
    description:
      'Get the education board’s own result gazette file, rather than looking up one roll number.',
    ownership: 'owned',
  },
  {
    id: 'result.head',
    description:
      'The head result intent: 12th class result, 2nd year result, HSSC Part-II result, inter part 2 result. Live search returns the same domains and frequently the same URLs across all of them — one intent, not four.',
    ownership: 'owned',
  },
  {
    id: 'result.session.current',
    description: 'Board-by-board status for the current session.',
    ownership: 'owned',
  },
  {
    id: 'result.board',
    description: 'A specific board’s 12th class result: where to check and what is announced.',
    ownership: 'owned',
  },
  {
    id: 'board.directory',
    description: 'Find my board and its official portal.',
    ownership: 'owned',
  },
  {
    id: 'result.board.session',
    description: 'A specific board’s result for a past session.',
    ownership: 'deferred',
    reason:
      'A year-specific board page needs durable value: a verified declared date, a board gazette, verified statistics, or a session-specific method. Without two of those it is a section on the yearless board page, not a URL.',
  },
  {
    id: 'result.group.sindh',
    description: 'Pre-medical, pre-engineering, science general and humanities results in Sindh.',
    ownership: 'deferred',
    reason:
      'Genuinely distinct events — Karachi declares group by group across four weeks. Rendered as per-group sections on the board page first; a group earns its own URL only with durable unique content.',
  },
  {
    id: 'result.group.punjab',
    description: 'FSc, FA, ICS and ICom part 2 results.',
    ownership: 'rejected',
    reason:
      'Generic and group queries share zero URLs, so these are not simple synonyms — but Punjab, KPK and Federal boards have no group field and declare every group simultaneously. A group page would repeat one identical lookup and one identical date. Approve only with subject list, marks distribution, grading and pathways verified from a scheme of studies.',
  },
  {
    id: 'gazette.head',
    description: 'Find and search a 12th class result gazette.',
    ownership: 'deferred',
    reason: 'Approved family; scheduled after the first board pages so the journey exists.',
  },
  {
    id: 'post.rechecking',
    description: 'Understand rechecking: what it is, what it costs, and what it is not.',
    ownership: 'deferred',
    reason:
      'Approved and buildable today from primary sources for six boards. Scheduled as the first content batch.',
  },
  {
    id: 'post.second-annual',
    description: 'Second annual and supplementary — the same examination under two vocabularies.',
    ownership: 'deferred',
    reason: 'Approved; statutory evidence in hand.',
  },
  {
    id: 'post.improvement',
    description: 'Improvement of marks: eligibility and whether it is worth it.',
    ownership: 'deferred',
    reason:
      'Approved, but carries a supersession caveat: the one-chance-within-one-year rule may be overridden by an amending policy that could not be read.',
  },
  {
    id: 'post.dmc',
    description: 'Result card and DMC: obtaining, replacing and correcting it.',
    ownership: 'deferred',
    reason: 'Approved. Guidance only — never a generator, never a hosted candidate document.',
  },
  {
    id: 'trouble.roll-number',
    description: 'Recover a lost or forgotten roll number.',
    ownership: 'deferred',
    reason:
      'Approved: the weakest surface observed anywhere. Must be framed as recovery, never as name lookup.',
  },
  {
    id: 'compute.percentage',
    description: 'Turn HSSC marks into a percentage.',
    ownership: 'owned',
    reason:
      'Owned by the explainer. The currently ranking answer applies CBSE’s CGPA x 9.5, a foreign board’s formula that is wrong for Pakistan, where HSSC marks are out of 1100.',
  },
  {
    /*
     * Split from the explainer deliberately. "How is percentage calculated" and
     * "percentage calculator" are different tasks — one wants to understand the
     * rule, the other wants a number now — and Phase 2 approved both with
     * distinct primary keywords.
     */
    id: 'compute.percentage.tool',
    description: 'Compute an HSSC percentage from marks, without reading an explanation first.',
    ownership: 'owned',
  },
  {
    id: 'method.sms',
    description: 'Check a result by SMS.',
    ownership: 'blocked',
    reason:
      'BLOCKED. Not one board in Pakistan or AJK was observed publishing an SMS shortcode on its own domain, and the codes circulating on aggregator sites contradict each other. An SMS is charged: a wrong shortcode costs a student money and returns nothing.',
  },
  {
    id: 'method.name',
    description: 'Check a result by candidate name.',
    ownership: 'rejected',
    reason:
      'Most board portals have no name field. Where one exists it permits discovery without a roll number, which is an enumeration and privacy concern rather than a feature to promote. We document that it exists; we do not promise it.',
  },
  {
    id: 'result.position-holders',
    description: 'Board position holders and toppers.',
    ownership: 'rejected',
    reason:
      'No official source exists for the current session. Publishing would mean copying an unverified competitor list.',
  },
  {
    id: 'post.verification',
    description: 'Certificate verification, attestation and equivalence.',
    ownership: 'rejected',
    reason:
      'The statutory body owns half the first page of its own intent plus its portals. We route to it rather than compete for it.',
  },
  {
    id: 'post.entrytest',
    description: 'Entry-test aggregate calculation.',
    ownership: 'rejected',
    reason:
      'Crowded with established tools and a settled formula. Weightings change by institution and admission cycle, so maintaining them is a liability without a corresponding benefit.',
  },
] as const

const INTENT_BY_ID = new Map(INTENTS.map((i) => [i.id, i]))

export function getIntent(id: string): Intent | undefined {
  return INTENT_BY_ID.get(id)
}

export function isKnownIntent(id: string): boolean {
  return INTENT_BY_ID.has(id)
}

/** Intents a page may legitimately claim. */
export function ownableIntents(): Intent[] {
  return INTENTS.filter((i) => i.ownership === 'owned' || i.ownership === 'deferred')
}

/** Intents that must never acquire an owning page without a policy change. */
export function unownableIntents(): Intent[] {
  return INTENTS.filter((i) => i.ownership === 'blocked' || i.ownership === 'rejected')
}

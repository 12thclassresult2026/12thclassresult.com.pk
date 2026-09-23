/**
 * One authoritative record per board × class × year × session.
 *
 * WHY THIS FILE EXISTS. Status used to live in whichever component happened to
 * render it — a ticker here, a badge there, a sentence on a board page — and
 * they disagreed. The board directory and the result hub showed different
 * totals; Peshawar's page still described a 14 September SSC-only snapshot
 * while the board's own portal had been serving HSSC 2026 for a day.
 *
 * THE FOUR THINGS THAT ARE NOT THE SAME QUESTION, and were being conflated:
 *
 *   announcementStatus   has the board declared this result?
 *   portalSessionObserved what session is the board's portal actually serving?
 *   lookupMode           can THIS site answer, or only link onward?
 *   reachable            did the host respond when last checked?
 *
 * A portal that is temporarily down is still `announced`. A portal that
 * answers 200 with a year dropdown containing 2026 has NOT announced anything
 * — that is a form, not a result. A countdown reaching zero announces nothing
 * at all. Every one of those confusions ships a wrong headline on result day,
 * so they are separate fields and the UI must read the one it means.
 *
 * WHAT COUNTS AS EVIDENCE FOR `announced`: the board says so in its own words,
 * or the board publishes a result page naming that exact class and session —
 * "Result HSSC Annual-I Examination 2026" with a roll-number field is the
 * board publishing its result. A generic form whose year dropdown happens to
 * reach 2026 is not, and Swat below is exactly that case.
 *
 * NO REAL STUDENT'S ROLL NUMBER WAS SUBMITTED TO ANY BOARD to build this. A
 * portal being live is observed from the page the board publishes, never by
 * testing someone's result.
 */

/** Has the board declared this result? Reachability is a different field. */
export type AnnouncementStatus =
  /** Nothing found either way. */
  | 'unverified'
  /** A third party reports it; no board source read. */
  | 'reported'
  /** A date is set and has not arrived. */
  | 'scheduled'
  /** The board says so, or publishes a result page for this exact session. */
  | 'announced'

/** How well the DATE is sourced — independent of the status above. */
export type DateConfidence =
  /** Read on the board's own site. */
  | 'official'
  /** Press or committee reporting; no board notification read. */
  | 'reported'
  | 'unknown'

/** Can this site answer, or does it hand the student to the board? */
export type LookupMode =
  /** We hold a validated dataset for this exact session. */
  | 'local-dataset'
  /** We send the student to the board's own portal. */
  | 'official-link'

export type BoardResultStatus = {
  boardId: string
  class: 12
  year: number
  session: 'annual-1'
  announcementStatus: AnnouncementStatus
  dateConfidence: DateConfidence
  /** ISO 8601 with +05:00. Null unless a real time was read. */
  announcedAt: string | null
  /** Scheduled time, for a session that has not been declared yet. */
  scheduledAt: string | null
  officialHomeUrl: string
  /** The page that actually serves the result, when different from home. */
  officialResultUrl: string | null
  /** Quoted from the board's page, not paraphrased. */
  portalSessionObserved: string | null
  /** Observed on the board's form. `unverified` is not `unsupported`. */
  captcha: 'required' | 'not-observed' | 'unverified'
  nameSearch: 'supported' | 'not-observed' | 'unverified'
  lookupMode: LookupMode
  sources: string[]
  /** ISO date this record was checked against those sources. */
  lastVerifiedAt: string
}

const CHECKED = '2026-09-22'

/**
 * The Punjab common calendar. Reported by press citing the Punjab Boards
 * Committee of Chairmen; BISE Lahore's own site carried no HSSC Part-II 2026
 * notification when checked on 2026-09-22, the day before. So every Punjab row
 * is `scheduled` with `reported` confidence, never `announced`.
 *
 * See lib/result/announcement.ts, which holds the same date for the UI.
 */
const PUNJAB_SCHEDULED_AT = '2026-09-23T10:00:00+05:00'

function punjab(
  boardId: string,
  officialHomeUrl: string,
  officialResultUrl: string | null = null,
): BoardResultStatus {
  return {
    boardId,
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'scheduled',
    dateConfidence: 'reported',
    announcedAt: null,
    scheduledAt: PUNJAB_SCHEDULED_AT,
    officialHomeUrl,
    officialResultUrl,
    portalSessionObserved: null,
    captcha: 'unverified',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: [officialHomeUrl],
    lastVerifiedAt: CHECKED,
  }
}

export const BOARD_RESULT_STATUS: BoardResultStatus[] = [
  // ---- Punjab: nine boards, one common calendar, none declared yet --------
  punjab('bise-lahore', 'https://www.biselahore.com/', 'https://result.biselahore.com/'),
  {
    boardId: 'bise-gujranwala',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    /*
     * `announcedAt` stays null. The committee calendar said 10:00 AM and the
     * portals were serving the session when checked at 11:30 — but no board
     * published a time of its own, and copying the calendar’s time into a
     * per-board record would turn a schedule into a board statement.
     */
    dateConfidence: 'official',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://bisegrw.edu.pk/',
    officialResultUrl: 'https://result.bisegrw.edu.pk/Index.php',
    portalSessionObserved: 'HSSC Part-II (12th Class) — 1st Annual Examination 2026',
    captcha: 'required',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://result.bisegrw.edu.pk/Index.php'],
    lastVerifiedAt: '2026-09-23',
  },
  punjab(
    'bise-faisalabad',
    'https://www.bisefsd.edu.pk/',
    'https://www.bisefsd.edu.pk/InterResults.aspx',
  ),
  {
    boardId: 'bise-multan',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    /*
     * `announcedAt` stays null. The committee calendar said 10:00 AM and the
     * portals were serving the session when checked at 11:30 — but no board
     * published a time of its own, and copying the calendar’s time into a
     * per-board record would turn a schedule into a board statement.
     */
    dateConfidence: 'official',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://web.bisemultan.edu.pk/',
    officialResultUrl: 'https://results.bisemultan.edu.pk/',
    portalSessionObserved: 'Part-II / Combined Results — 1st Annual 2026',
    captcha: 'unverified',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://results.bisemultan.edu.pk/'],
    lastVerifiedAt: '2026-09-23',
  },
  {
    boardId: 'bise-rawalpindi',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    /*
     * `announcedAt` stays null. The committee calendar said 10:00 AM and the
     * portals were serving the session when checked at 11:30 — but no board
     * published a time of its own, and copying the calendar’s time into a
     * per-board record would turn a schedule into a board statement.
     */
    dateConfidence: 'official',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://www.biserawalpindi.edu.pk/',
    officialResultUrl: 'https://biserwp.edu.pk/',
    portalSessionObserved: 'RESULT OF HSSC FIRST ANNUAL EXAMINATION, 2026',
    captcha: 'unverified',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://www.biserawalpindi.edu.pk/', 'https://biserwp.edu.pk/'],
    lastVerifiedAt: '2026-09-23',
  },
  punjab('bise-sargodha', 'https://bisesargodha.edu.pk/', 'https://results.bisesargodha.edu.pk/'),
  {
    boardId: 'bise-bahawalpur',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    /*
     * `announcedAt` stays null. The committee calendar said 10:00 AM and the
     * portals were serving the session when checked at 11:30 — but no board
     * published a time of its own, and copying the calendar’s time into a
     * per-board record would turn a schedule into a board statement.
     */
    dateConfidence: 'official',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://bisebwp.edu.pk/',
    officialResultUrl: 'https://bisebwp.edu.pk/',
    portalSessionObserved: 'HIGHER SECONDARY SCHOOL (FIRST ANNUAL) EXAMINATION, 2026',
    captcha: 'required',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://bisebwp.edu.pk/'],
    lastVerifiedAt: '2026-09-23',
  },
  {
    boardId: 'bise-dg-khan',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    /*
     * `announcedAt` stays null. The committee calendar said 10:00 AM and the
     * portals were serving the session when checked at 11:30 — but no board
     * published a time of its own, and copying the calendar’s time into a
     * per-board record would turn a schedule into a board statement.
     */
    dateConfidence: 'official',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://www.bisedgkhan.edu.pk/',
    officialResultUrl: 'https://www.bisedgkhan.edu.pk/',
    portalSessionObserved: 'Part-II & Combined — 1st Annual Examination 2026',
    captcha: 'unverified',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://www.bisedgkhan.edu.pk/'],
    lastVerifiedAt: '2026-09-23',
  },
  punjab('bise-sahiwal', 'https://bisesahiwal.edu.pk/', 'https://bisesahiwal.edu.pk/result.php'),

  // ---- KPK: already out, and NOT on one shared date ----------------------
  {
    /*
     * The one board with a time. Its own site announced HSSC Annual-I for
     * 21 September at 3 PM, and its portal has been serving that session since.
     * This is why "all KPK results came out on 22 September" is wrong and the
     * KPK card must never make a blanket claim.
     */
    boardId: 'bise-peshawar',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    dateConfidence: 'official',
    announcedAt: '2026-09-21T15:00:00+05:00',
    scheduledAt: null,
    officialHomeUrl: 'https://www.bisep.edu.pk/',
    officialResultUrl: 'https://cloud.bisep.edu.pk/',
    portalSessionObserved: 'HSSC Annual-I Examination 2026 — 11th & 12th Classes',
    captcha: 'not-observed',
    nameSearch: 'not-observed',
    lookupMode: 'official-link',
    sources: ['https://www.bisep.edu.pk/', 'https://cloud.bisep.edu.pk/'],
    lastVerifiedAt: CHECKED,
  },
  {
    // The board's own homepage carries the words "Result Announced HSSC-A-I,
    // 2026". No time is published with it, so `announcedAt` stays null.
    boardId: 'bise-dera-ismail-khan',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    dateConfidence: 'official',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://www.bisedik.edu.pk/',
    officialResultUrl: 'https://www.bisedik.edu.pk/results/current_result',
    portalSessionObserved: 'HSSC Annual-I 2026 — board states "Result Announced"',
    captcha: 'unverified',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://www.bisedik.edu.pk/'],
    lastVerifiedAt: CHECKED,
  },
  {
    boardId: 'bise-bannu',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    dateConfidence: 'official',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://www.biseb.edu.pk/',
    officialResultUrl: 'https://www.biseb.edu.pk/result-search.php?id=61&rd_id=0',
    portalSessionObserved: 'HSSC 11th/12th Annual-I 2026',
    captcha: 'required',
    /*
     * Bannu's form genuinely offers name and father's name. That is a fact
     * about Bannu and must not be generalised — every other board here is
     * `unverified`, which is not the same as `not-observed` and certainly not
     * the same as unsupported.
     */
    nameSearch: 'supported',
    lookupMode: 'official-link',
    sources: [
      'https://www.biseb.edu.pk/news-events-view.php?id=209',
      'https://www.biseb.edu.pk/result-search.php?id=61&rd_id=0',
    ],
    lastVerifiedAt: CHECKED,
  },
  {
    boardId: 'bise-abbottabad',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    dateConfidence: 'unknown',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://www.biseatd.edu.pk/',
    officialResultUrl: 'https://www.biseatd.edu.pk/exams/r_hssc26_h/index.php',
    portalSessionObserved: 'Result HSSC Annual-I Examination 2026 — 11th & 12th',
    captcha: 'required',
    nameSearch: 'not-observed',
    lookupMode: 'official-link',
    sources: ['https://www.biseatd.edu.pk/exams/r_hssc26_h/index.php'],
    lastVerifiedAt: CHECKED,
  },
  {
    boardId: 'bise-mardan',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    dateConfidence: 'unknown',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://web.bisemdn.edu.pk/',
    officialResultUrl: 'https://result.bisemdn.edu.pk/?mode=SearchResult&module=hssc',
    portalSessionObserved: 'انٹرمیڈیٹ (پارٹ-١ و پارٹ-٢) سالانہ (اول) امتحان 2026',
    captcha: 'not-observed',
    nameSearch: 'not-observed',
    lookupMode: 'official-link',
    sources: ['https://result.bisemdn.edu.pk/?mode=SearchResult&module=hssc'],
    lastVerifiedAt: CHECKED,
  },
  {
    boardId: 'bise-malakand',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    dateConfidence: 'unknown',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://bisemalakand.edu.pk/',
    officialResultUrl: 'https://bisemalakand.edu.pk/results/latest-annual',
    portalSessionObserved: 'Result: HSSC Latest Annual-I 2026 — 11th & 12th',
    captcha: 'not-observed',
    nameSearch: 'not-observed',
    lookupMode: 'official-link',
    sources: ['https://bisemalakand.edu.pk/results/latest-annual'],
    lastVerifiedAt: CHECKED,
  },
  {
    boardId: 'bise-kohat',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    dateConfidence: 'unknown',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://www.bisekt.edu.pk/',
    officialResultUrl: 'https://bisekt.edu.pk/current_result/',
    // The board's own Urdu notice: "click here for Intermediate Annual 2026 results".
    portalSessionObserved: 'HSSC Annual-I 2026 — board links Intermediate Annual 2026 results',
    captcha: 'unverified',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://www.bisekt.edu.pk/', 'https://bisekt.edu.pk/current_result/'],
    lastVerifiedAt: CHECKED,
  },
  {
    /*
     * THE ONE KPK BOARD THAT IS NOT `announced`, and the reason the distinction
     * in this file is not academic.
     *
     * Swat's form is generic: a class selector, an exam selector and a year
     * dropdown running 2005 to 2026. A dropdown reaching 2026 is a form, not a
     * declared result — it is exactly what rule 6 of the brief warns against.
     * The board has a press release, but its contents are an image that was
     * not transcribed, so nothing here claims a date.
     */
    boardId: 'bise-swat',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'unverified',
    dateConfidence: 'unknown',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://www.bisess.edu.pk/site/',
    officialResultUrl: 'https://www.bisess.edu.pk/site/home/results-section',
    portalSessionObserved: '12th-Annual-I offered; year dropdown includes 2026',
    captcha: 'not-observed',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://www.bisess.edu.pk/site/home/results-section'],
    lastVerifiedAt: CHECKED,
  },

  // ---- Sindh: a different model again, and the third one on this site ----
  {
    /*
     * SINDH DECLARES GROUP BY GROUP, and Hyderabad is the proof. Its homepage
     * carries separate HSC-II Annual 2026 announcements for Commerce, Home
     * Economics and Medical, each with its own file. That is not a keyword
     * variant of one result — it is several declarations on several dates, and
     * a student in the group that has not gone yet is not served by a page
     * saying Sindh results are out.
     */
    boardId: 'bise-hyderabad',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'announced',
    dateConfidence: 'unknown',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://www.biseh.edu.pk/',
    officialResultUrl: 'https://www.biseh.edu.pk/',
    portalSessionObserved:
      'HSC-II Annual Examination 2026 — declared by group; Commerce, Home Economics and Medical published so far',
    captcha: 'unverified',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://www.biseh.edu.pk/'],
    lastVerifiedAt: '2026-09-23',
  },
  {
    // The intermediate board for Karachi. Its site still shows 2025 examination
    // activity and a 2024 supplementary declaration; nothing names HSSC 2026.
    boardId: 'biek',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'unverified',
    dateConfidence: 'unknown',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://www.biek.edu.pk/',
    officialResultUrl: null,
    portalSessionObserved: null,
    captcha: 'unverified',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://www.biek.edu.pk/'],
    lastVerifiedAt: '2026-09-23',
  },
  {
    /*
     * RECORDED WITH ITS REDIRECT. biselrk.edu.pk answers 301 to biselrk.com —
     * a .com for a government board, which is the shape of a hijacked domain
     * and is worth flagging. It is carried here only because the redirect
     * comes FROM the board’s own .edu.pk address, which is what authenticates
     * it. The board’s latest notices are Part-I bio-data and fee matters; no
     * Part-II 2026 result is announced.
     */
    boardId: 'bise-larkana',
    class: 12,
    year: 2026,
    session: 'annual-1',
    announcementStatus: 'unverified',
    dateConfidence: 'unknown',
    announcedAt: null,
    scheduledAt: null,
    officialHomeUrl: 'https://biselrk.edu.pk/',
    officialResultUrl: null,
    portalSessionObserved: null,
    captcha: 'unverified',
    nameSearch: 'unverified',
    lookupMode: 'official-link',
    sources: ['https://biselrk.edu.pk/'],
    lastVerifiedAt: '2026-09-23',
  },
]

export function statusFor(boardId: string, year = 2026): BoardResultStatus | null {
  return BOARD_RESULT_STATUS.find((s) => s.boardId === boardId && s.year === year) ?? null
}

export function statusesForBoards(boardIds: string[], year = 2026): BoardResultStatus[] {
  return BOARD_RESULT_STATUS.filter((s) => s.year === year && boardIds.includes(s.boardId))
}

/**
 * Counts for a region card.
 *
 * DERIVED FROM THE SUBSET IT DESCRIBES, never from a site-wide total. The
 * homepage and the board directory used to show different numbers because each
 * counted a different thing; a card that says "8 boards" must be able to name
 * which eight.
 */
export function announcementTally(statuses: BoardResultStatus[]) {
  return {
    total: statuses.length,
    announced: statuses.filter((s) => s.announcementStatus === 'announced').length,
    scheduled: statuses.filter((s) => s.announcementStatus === 'scheduled').length,
    unverified: statuses.filter(
      (s) => s.announcementStatus === 'unverified' || s.announcementStatus === 'reported',
    ).length,
  }
}

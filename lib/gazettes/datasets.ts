/**
 * Which gazette datasets are loaded into the store.
 *
 * TWO LAYERS, ON PURPOSE.
 *
 * This list decides whether a board page SHOWS a roll-number form. The dataset
 * row in D1 decides whether that form SERVES a result — `lookupResult` reads
 * `datasetState` before it will touch a roll number, and answers
 * `dataset-unavailable` for anything not `active`.
 *
 * So if this file ever drifts ahead of reality, the worst outcome is a form
 * that politely says the data is not published — never a wrong result, and
 * never a silent one. Drifting the other way just hides a form that would have
 * worked.
 *
 * A board appears here only after its gazette has been acquired from the
 * board's own domain, parsed, validated and sampled against the original.
 * `docs/data/gazette-dataset-registry.csv` is the operator-facing record of the
 * same thing.
 */

export type LoadedDataset = {
  boardId: string
  boardSlug: string
  year: number
  examination: string
  examinationLabel: string
  /** The board's own URL for the gazette this came from. */
  sourceUrl: string
  /** ISO date the source was last verified against that URL. */
  checkedAt: string
}

export const LOADED_DATASETS: LoadedDataset[] = [
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://bisegrw.edu.pk/download/GAZETTE/Gz_IA2p25.pdf',
    checkedAt: '2026-09-15',
  },
  {
    boardId: 'bise-lahore',
    boardSlug: 'lahore-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://www.biselahore.com/',
    checkedAt: '2026-09-21',
  },
  {
    boardId: 'bise-multan',
    boardSlug: 'multan-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://web.bisemultan.edu.pk/',
    checkedAt: '2026-09-21',
  },
  {
    boardId: 'bise-rawalpindi',
    boardSlug: 'rawalpindi-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://biserawalpindi.edu.pk/',
    checkedAt: '2026-09-21',
  },
  {
    boardId: 'bise-faisalabad',
    boardSlug: 'faisalabad-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://bisefsd.edu.pk/',
    checkedAt: '2026-09-21',
  },
  {
    boardId: 'bise-sahiwal',
    boardSlug: 'sahiwal-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://bisesahiwal.edu.pk/',
    checkedAt: '2026-09-21',
  },
  {
    boardId: 'bise-sargodha',
    boardSlug: 'sargodha-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://bisesargodha.edu.pk/',
    checkedAt: '2026-09-21',
  },
  {
    boardId: 'bise-bahawalpur',
    boardSlug: 'bahawalpur-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://bisebwp.edu.pk/',
    checkedAt: '2026-09-21',
  },
  {
    boardId: 'bise-dg-khan',
    boardSlug: 'dg-khan-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://bisedgkhan.edu.pk/',
    checkedAt: '2026-09-21',
  },
  {
    boardId: 'fbise',
    boardSlug: 'federal-board',
    year: 2025,
    examination: 'first-annual',
    examinationLabel: 'HSSC Part-II First Annual',
    sourceUrl: 'https://www.fbise.edu.pk/',
    checkedAt: '2026-09-21',
  },
]

/**
 * A session a student can ask about, whether or not we hold data for it.
 *
 * THE DEFECT THIS EXISTS TO CLOSE. The lookup used to hard-code
 * `year: 2025, examination: 'first-annual'` while the page around it said
 * "12th Class Result 2026". Nothing on the form named a year. So a student
 * arriving on result morning to check their 2026 result would have had a 2025
 * dataset searched instead — returning either a stranger's record under their
 * own roll number, or "not found" for a result that had just been declared.
 *
 * Both answers are wrong and neither looks wrong. A session must be something
 * the student chooses and the answer states back.
 */
export type ResultSession = {
  year: number
  examination: string
  /** What the student sees in the selector. */
  label: string
  /** True for the session currently being declared. */
  isCurrent: boolean
}

/**
 * Ordered newest first, because the current session is what almost everyone
 * wants and an archive year is a deliberate choice.
 *
 * 2026 CARRIES NO DATASET ON PURPOSE. The Punjab boards declare it on
 * 23 September 2026 and no gazette has been published for it. It is listed so
 * a student can ask, and `lookupResult` answers `dataset-unavailable` with the
 * board's own portal — which is the truthful answer, not a silent fallback to
 * last year.
 */
export const RESULT_SESSIONS: ResultSession[] = [
  { year: 2026, examination: 'first-annual', label: 'Annual 2026', isCurrent: true },
  { year: 2025, examination: 'first-annual', label: 'Annual 2025 (archive)', isCurrent: false },
]

export const CURRENT_SESSION: ResultSession =
  RESULT_SESSIONS.find((s) => s.isCurrent) ?? RESULT_SESSIONS[0]!

/** Accepts a session only if it is one we offer; never trusts form input. */
export function resolveSession(year: unknown, examination: unknown): ResultSession | null {
  const y = Number(year)
  return RESULT_SESSIONS.find((s) => s.year === y && s.examination === String(examination)) ?? null
}

export function datasetForBoard(boardSlug: string): LoadedDataset | null {
  return LOADED_DATASETS.find((dataset) => dataset.boardSlug === boardSlug) ?? null
}

/** The dataset for one board AND one session — the only safe way to ask. */
export function datasetFor(boardSlug: string, session: ResultSession): LoadedDataset | null {
  return (
    LOADED_DATASETS.find(
      (d) =>
        d.boardSlug === boardSlug &&
        d.year === session.year &&
        d.examination === session.examination,
    ) ?? null
  )
}

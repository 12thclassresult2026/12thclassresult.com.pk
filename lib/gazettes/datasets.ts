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

export function datasetForBoard(boardSlug: string): LoadedDataset | null {
  return LOADED_DATASETS.find((dataset) => dataset.boardSlug === boardSlug) ?? null
}

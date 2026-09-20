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
]

export function datasetForBoard(boardSlug: string): LoadedDataset | null {
  return LOADED_DATASETS.find((dataset) => dataset.boardSlug === boardSlug) ?? null
}

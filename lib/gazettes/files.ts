/**
 * Gazette files a student can actually download, and where to look when there
 * is none.
 *
 * WHY THIS IS NOT DERIVED FROM `LOADED_DATASETS`. That list's `sourceUrl` is
 * where a dataset came from, and for nine of its ten boards it is a bare
 * domain — `https://bisesargodha.edu.pk`, and so on. A bare domain is not a
 * download. Pointing a "Download Gazette" button at one gives a student a
 * homepage and a puzzle, which is worse than an honest "not published here".
 *
 * WHAT EARNS A ROW IN `GAZETTE_FILES`: a URL on the board's own domain that
 * answered `200` with `Content-Type: application/pdf`, checked on the date in
 * the row, with the byte count taken from that response's `Content-Length`.
 * Not a size anyone estimated — this site once shipped twenty-four download
 * buttons labelled "4.2 MB" for gazettes it did not hold, and
 * `tests/validation/content-claims.test.ts` exists because of it.
 *
 * ADDING A BOARD: fetch the URL, confirm it is a PDF, take the real length,
 * and record the date. If the file sits behind an interstitial or a login it
 * does not belong here — BISE Lahore's gazette host answers `401` to anything
 * but its own pages, so Lahore has no row despite its dataset being the
 * largest one loaded.
 */

/** A gazette PDF, confirmed downloadable on the board's own domain. */
export type GazetteFile = {
  boardId: string
  boardSlug: string
  /** Examination year the gazette covers. */
  year: number
  /** As the board itself labels it, not as we would phrase it. */
  examinationLabel: string
  url: string
  /** From the response's own Content-Length. Never estimated. */
  bytes: number
  /** ISO date the URL was last confirmed to serve a PDF. */
  verifiedAt: string
}

/**
 * Where a board publishes its gazettes, for boards whose file we cannot link
 * directly. A student gets the right page instead of a dead button.
 */
export type GazetteIndexPage = {
  boardId: string
  url: string
  /** What the page actually is — never overstated. */
  label: string
  verifiedAt: string
}

export const GAZETTE_FILES: GazetteFile[] = [
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2025,
    examinationLabel: 'HSSC Part-II Annual',
    url: 'https://bisegrw.edu.pk/download/GAZETTE/Gz_IA2p25.pdf',
    bytes: 14_469_020,
    verifiedAt: '2026-09-22',
  },
  {
    boardId: 'bise-rawalpindi',
    boardSlug: 'rawalpindi-board',
    year: 2025,
    examinationLabel: 'HSSC Annual',
    url: 'https://www.biserawalpindi.edu.pk/Content/Gazette/G-HSSC2K25A.PDF',
    bytes: 29_366_704,
    verifiedAt: '2026-09-22',
  },
]

export const GAZETTE_INDEX_PAGES: GazetteIndexPage[] = [
  {
    boardId: 'bise-gujranwala',
    url: 'https://www.bisegrw.edu.pk/result-gazatte.html',
    label: 'Gazette archive — every HSSC and SSC gazette back to 2012',
    verifiedAt: '2026-09-22',
  },
  {
    boardId: 'bise-faisalabad',
    url: 'https://www.bisefsd.edu.pk/Downloads.aspx',
    label: 'Board downloads section',
    verifiedAt: '2026-09-22',
  },
  {
    boardId: 'bise-sahiwal',
    url: 'https://bisesahiwal.edu.pk/result.php',
    label: 'Board results section',
    verifiedAt: '2026-09-22',
  },
  {
    boardId: 'bise-multan',
    /*
     * Labelled exactly as found. This page lists MATRIC gazettes; no HSSC
     * gazette was published on it when checked. Calling it "the gazette page"
     * would send a Part-II student looking for something that is not there.
     */
    url: 'https://web.bisemultan.edu.pk/result-gazette-matric/',
    label: 'Result gazette section — matric gazettes listed, HSSC not yet',
    verifiedAt: '2026-09-22',
  },
]

export function gazetteFileFor(boardId: string): GazetteFile | null {
  return GAZETTE_FILES.find((file) => file.boardId === boardId) ?? null
}

export function gazetteIndexFor(boardId: string): GazetteIndexPage | null {
  return GAZETTE_INDEX_PAGES.find((page) => page.boardId === boardId) ?? null
}

/**
 * `14469020` → `13.8 MB`.
 *
 * Shown so a student on mobile data knows what they are about to spend before
 * they tap. These gazettes run to tens of megabytes.
 */
export function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  if (mb >= 10) return `${Math.round(mb)} MB`
  return `${mb.toFixed(1)} MB`
}

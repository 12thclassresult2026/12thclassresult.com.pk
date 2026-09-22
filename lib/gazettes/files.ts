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
 * WHY ONLY TWO BOARDS APPEAR HERE, AND WHY THAT IS THE FINDING.
 *
 * Every board on this site was checked. Most publish no gazette file at all:
 * Faisalabad and Sargodha offer a roll-number portal and nothing else, FBISE
 * publishes notifications rather than gazettes, and Bahawalpur's site refused
 * the connection outright. Multan does publish gazettes, but hosts them on
 * Google Drive viewer pages rather than its own domain, so there is no file to
 * verify or size — its listing page is linked instead. BISE Lahore has the
 * largest dataset loaded here and still gets no button: its gazette host
 * answers `401` to anything that is not one of its own pages.
 *
 * Gujranwala and Rawalpindi keep real archives, so those are deep — nine years
 * of Part-II annuals from Gujranwala, plus its second annuals, and four years
 * from Rawalpindi.
 *
 * ADDING A FILE: fetch the URL, confirm it is a PDF, take the real length, and
 * record the date. If it sits behind an interstitial, a login, or a third-party
 * viewer, it does not belong here.
 */

/** A gazette PDF, confirmed downloadable on the board's own domain. */
export type GazetteFile = {
  boardId: string
  boardSlug: string
  /** Examination year the gazette covers. */
  year: number
  /** As the board itself labels it, not as we would phrase it. */
  examinationLabel: string
  /** Distinguishes the annual from the second annual in the same year. */
  session: 'annual' | 'second-annual'
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

const GRW = 'https://bisegrw.edu.pk/download/GAZETTE'
const RWP = 'https://www.biserawalpindi.edu.pk/Content/Gazette'
const CHECKED = '2026-09-22'

export const GAZETTE_FILES: GazetteFile[] = [
  /*
   * BISE GUJRANWALA — the deepest public archive found anywhere in this
   * market. Filenames are the board's own and are not consistent about case
   * (`Gz_IA2p23` but `Gz_Ia2p22`), so each one is written out rather than
   * generated from a pattern that would quietly 404.
   */
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2025,
    examinationLabel: 'HSSC Part-II Annual',
    session: 'annual',
    url: `${GRW}/Gz_IA2p25.pdf`,
    bytes: 14_469_020,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2024,
    examinationLabel: 'HSSC Part-II Annual',
    session: 'annual',
    url: `${GRW}/Gz_IA2p24.pdf`,
    bytes: 14_783_664,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2023,
    examinationLabel: 'HSSC Part-II Annual',
    session: 'annual',
    url: `${GRW}/Gz_IA2p23.pdf`,
    bytes: 10_241_607,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2022,
    examinationLabel: 'HSSC Part-II Annual',
    session: 'annual',
    url: `${GRW}/Gz_Ia2p22.pdf`,
    bytes: 6_919_449,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2021,
    examinationLabel: 'HSSC Part-II Annual',
    session: 'annual',
    url: `${GRW}/Gz_Ia2p21.pdf`,
    bytes: 8_940_725,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2020,
    examinationLabel: 'HSSC Part-II Annual',
    session: 'annual',
    url: `${GRW}/Gz_Ia2p20.pdf`,
    bytes: 8_074_845,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2019,
    examinationLabel: 'HSSC Part-II Annual',
    session: 'annual',
    url: `${GRW}/Gz_IA2p19.pdf`,
    bytes: 8_032_372,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2018,
    examinationLabel: 'HSSC Part-II Annual',
    session: 'annual',
    url: `${GRW}/Gz_IA2p18.pdf`,
    bytes: 6_013_038,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2017,
    examinationLabel: 'HSSC Part-II Annual',
    session: 'annual',
    url: `${GRW}/Gz_Ia2p17.pdf`,
    bytes: 8_980_190,
    verifiedAt: CHECKED,
  },

  // Second annual — the supplementary session, for candidates who cleared later.
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2025,
    examinationLabel: 'HSSC Second Annual',
    session: 'second-annual',
    url: `${GRW}/Gz_IS2p25.pdf`,
    bytes: 3_790_055,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2024,
    examinationLabel: 'HSSC Second Annual',
    session: 'second-annual',
    url: `${GRW}/Gz_IS2p24.pdf`,
    bytes: 3_946_488,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-gujranwala',
    boardSlug: 'gujranwala-board',
    year: 2023,
    examinationLabel: 'HSSC Second Annual',
    session: 'second-annual',
    url: `${GRW}/Gz_IS2p23.pdf`,
    bytes: 4_607_155,
    verifiedAt: CHECKED,
  },

  /*
   * BISE RAWALPINDI — `G-HSSC2K<yy>A.PDF`, annual only. No supplementary file
   * exists under the matching `S` suffix; it was checked and returns 404, so
   * no second-annual row is invented for this board.
   */
  {
    boardId: 'bise-rawalpindi',
    boardSlug: 'rawalpindi-board',
    year: 2025,
    examinationLabel: 'HSSC Annual',
    session: 'annual',
    url: `${RWP}/G-HSSC2K25A.PDF`,
    bytes: 29_366_704,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-rawalpindi',
    boardSlug: 'rawalpindi-board',
    year: 2024,
    examinationLabel: 'HSSC Annual',
    session: 'annual',
    url: `${RWP}/G-HSSC2K24A.PDF`,
    bytes: 33_741_206,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-rawalpindi',
    boardSlug: 'rawalpindi-board',
    year: 2023,
    examinationLabel: 'HSSC Annual',
    session: 'annual',
    url: `${RWP}/G-HSSC2K23A.PDF`,
    bytes: 27_800_921,
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-rawalpindi',
    boardSlug: 'rawalpindi-board',
    year: 2022,
    examinationLabel: 'HSSC Annual',
    session: 'annual',
    url: `${RWP}/G-HSSC2K22A.PDF`,
    bytes: 28_115_427,
    verifiedAt: CHECKED,
  },
]

export const GAZETTE_INDEX_PAGES: GazetteIndexPage[] = [
  {
    boardId: 'bise-gujranwala',
    url: 'https://www.bisegrw.edu.pk/result-gazatte.html',
    label: 'Gazette archive — every HSSC and SSC gazette back to 2012',
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-multan',
    /*
     * Multan DOES publish HSSC gazettes — but on Google Drive viewer pages,
     * not its own domain, so there is no file to verify or size. Its own
     * listing is the honest destination. This used to point at the MATRIC
     * gazette page, which sent Part-II students somewhere with nothing for
     * them.
     */
    url: 'https://web.bisemultan.edu.pk/result-gazette-inter/',
    label: 'Intermediate gazette archive — files hosted on Google Drive',
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-faisalabad',
    url: 'https://www.bisefsd.edu.pk/InterResults.aspx',
    label: 'Inter results — roll-number search, no gazette file published',
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-sahiwal',
    url: 'https://bisesahiwal.edu.pk/result.php',
    label: 'Board results section',
    verifiedAt: CHECKED,
  },
  {
    boardId: 'bise-sargodha',
    url: 'https://results.bisesargodha.edu.pk/',
    label: 'Online results portal — roll-number search only',
    verifiedAt: CHECKED,
  },
  {
    boardId: 'fbise',
    url: 'https://www.fbise.edu.pk/newsupdatenotification.php',
    label: 'Notifications and downloads — results issued as notifications',
    verifiedAt: CHECKED,
  },
]

/** Every gazette this board publishes, newest first. */
export function gazetteFilesFor(boardId: string): GazetteFile[] {
  return GAZETTE_FILES.filter((file) => file.boardId === boardId).sort(
    (a, b) => b.year - a.year || (a.session === 'annual' ? -1 : 1),
  )
}

/**
 * The one to offer when there is room for a single button — the most recent
 * annual, which is what a student arriving from a search almost always wants.
 */
export function gazetteFileFor(boardId: string): GazetteFile | null {
  return gazetteFilesFor(boardId)[0] ?? null
}

export function gazetteIndexFor(boardId: string): GazetteIndexPage | null {
  return GAZETTE_INDEX_PAGES.find((page) => page.boardId === boardId) ?? null
}

/** Board ids that have at least one downloadable gazette. */
export function boardsWithGazettes(): string[] {
  return [...new Set(GAZETTE_FILES.map((file) => file.boardId))]
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

import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { boardPageHref, BOARDS, routedBoards } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import { datasetForBoard } from '@/lib/gazettes/datasets'
import { formatBytes, GAZETTE_FILES, gazetteFilesFor, gazetteIndexFor } from '@/lib/gazettes/files'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('gazette-downloads')

export const metadata: Metadata = metadataForPage(PAGE)

/**
 * Gazette downloads, board by board.
 *
 * THE POINT OF THE PAGE. A gazette is the board's own published record of a
 * whole cohort's results. Students want it for two reasons the roll-number
 * lookup does not serve: checking a sibling's or a friend's roll number
 * without typing each one, and having the board's own document in hand when a
 * college or employer asks for proof.
 *
 * WHAT THIS PAGE REFUSES TO DO. Every download here points at a file on the
 * board's own domain that was fetched and confirmed to be a PDF, with the byte
 * count read from that response. Where no such file exists, the board gets an
 * honest row saying so and a link to where it publishes — never a button that
 * opens a homepage and leaves a student hunting.
 *
 * That distinction is the whole reason `lib/gazettes/files.ts` is separate
 * from `LOADED_DATASETS`: nine of the ten loaded datasets record a bare domain
 * as their source, and a bare domain cannot be a download.
 */
export default function GazetteDownloadsPage() {
  const routed = new Set(routedBoards().map((board) => board.id))

  /* Boards with a file first, then boards we can at least point somewhere. */
  const rows = BOARDS.map((board) => ({
    board,
    files: gazetteFilesFor(board.id),
    index: gazetteIndexFor(board.id),
    dataset: datasetForBoard(board.slug),
    routed: routed.has(board.id),
  })).sort((a, b) => {
    const rank = (r: typeof a) => (r.files.length > 0 ? 0 : r.index ? 1 : 2)
    return rank(a) - rank(b) || a.board.shortName.localeCompare(b.board.shortName)
  })

  const withFile = rows.filter((r) => r.files.length > 0)

  return (
    <>
      <JsonLdScript
        nodes={[
          webPageSchema({
            path: PAGE.path,
            name: PAGE.title,
            description: PAGE.description,
            dateModified: PAGE.contentUpdatedAt,
          }),
          breadcrumbSchema(PAGE.breadcrumb),
        ]}
      />

      <div className="bg-[#F8FAFC]">
        <div className="container-wide py-8 sm:py-12">
          <Breadcrumbs trail={PAGE.breadcrumb} />

          <header className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {PAGE.h1}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              A result gazette is the education board’s own published record of every candidate in
              an examination. The files below are hosted by the boards themselves — this page only
              links to them, and shows the size so you know what you are downloading on mobile data.
            </p>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
              <p className="text-[13px] leading-relaxed text-amber-900">
                <strong className="font-bold">These are large files.</strong> A gazette covers a
                whole board — tens of thousands of candidates — and runs to tens of megabytes. If
                you only need your own result,{' '}
                <Link
                  href="/"
                  className="font-semibold text-[#0069D9] underline-offset-2 hover:underline"
                >
                  search by roll number
                </Link>{' '}
                instead; it reads the same gazette and returns one record.
              </p>
            </div>
          </header>

          {/* ---- Boards with downloadable files -------------------------- */}
          <section className="mt-10">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Available to download now
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              {GAZETTE_FILES.length} gazette files across {withFile.length} board
              {withFile.length === 1 ? '' : 's'}, each one opened and confirmed to be a PDF.
            </p>

            <div className="mt-5 space-y-6">
              {withFile.map(({ board, files }) => (
                <article
                  key={board.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{board.shortName}</h3>
                      <p className="mt-0.5 text-[12px] text-slate-500">
                        {files.length} gazette{files.length === 1 ? '' : 's'} published on the
                        board’s own site
                      </p>
                    </div>
                    {routed.has(board.id) ? (
                      <Link
                        href={boardPageHref(board.slug)}
                        className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Search by roll number
                      </Link>
                    ) : null}
                  </div>

                  <ul className="divide-y divide-slate-100">
                    {files.map((file) => (
                      <li
                        key={file.url}
                        className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {file.examinationLabel} {file.year}
                          </p>
                          <p className="mt-0.5 text-[11.5px] text-slate-500">
                            PDF · {formatBytes(file.bytes)} · link checked {file.verifiedAt}
                          </p>
                        </div>
                        {/*
                          `rel="nofollow"` and a new tab: this is the board's
                          file on the board's server, not ours, and we do not
                          vouch for a URL that may be renamed without notice.
                        */}
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener nofollow"
                          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#007054] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#005842]"
                        >
                          Download · {formatBytes(file.bytes)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* ---- Every other board --------------------------------------- */}
          <section className="mt-12">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Every other board</h2>
            <p className="mt-1.5 max-w-3xl text-sm text-slate-600">
              No gazette file for these boards could be opened and confirmed. That does not mean the
              board has not published one — several publish gazettes behind a portal, and BISE
              Lahore’s gazette server refuses requests that do not come from its own pages. Where a
              board has a page that lists its gazettes, it is linked below.
            </p>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] tracking-wider text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-3 font-bold">Board</th>
                    <th className="px-5 py-3 font-bold">Gazette file</th>
                    <th className="px-5 py-3 font-bold">Where it publishes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows
                    .filter((r) => r.files.length === 0)
                    .map(({ board, index, dataset }) => (
                      <tr key={board.id} className="align-top">
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-slate-900">{board.shortName}</span>
                          {dataset ? (
                            <span className="mt-0.5 block text-[11px] text-emerald-700">
                              Roll-number search available
                            </span>
                          ) : null}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">Not published here</td>
                        <td className="px-5 py-3.5">
                          <a
                            href={index ? index.url : board.officialWebsite}
                            target="_blank"
                            rel="noopener nofollow"
                            className="font-semibold text-[#0069D9] underline-offset-2 hover:underline"
                          >
                            {index ? index.label : 'Board website'}
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              How these links were checked
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
              Each file above was requested directly from the board’s own domain and confirmed to
              return a PDF. The size shown is the one the board’s server reported, not an estimate.
              Nothing here is copied, mirrored or re-hosted — you download from the board.
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
              Boards move and rename these files without notice. If a link fails, the board’s own
              site is linked beside it, and you can{' '}
              <Link
                href="/methodology"
                className="font-semibold text-[#0069D9] underline-offset-2 hover:underline"
              >
                read how this site verifies a source
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

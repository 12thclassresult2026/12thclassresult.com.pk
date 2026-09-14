import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLdScript } from '@/components/seo/json-ld'
import { BOARDS } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import { capabilityLabel } from '@/lib/result/capability-label'
import { rollNumberSources } from '@/lib/result-sources/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('result-evergreen')

export const metadata: Metadata = metadataForPage(PAGE)

export default function TwelfthClassResultHub() {
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

      <div className="container-wide py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{PAGE.h1}</h1>

        {/*
          THE TERMINOLOGY EXPLAINER.

          Search behaviour shows "12th class result", "2nd year result", "HSSC
          Part-II result" and "inter part 2 result" are one intent — the same
          pages rank for all of them. Rather than build four near-duplicate
          pages, this page owns the intent and explains the vocabulary, which is
          a real question students ask when a board's own site uses a word their
          college never used.
        */}
        <p className="mt-5 max-w-3xl text-lg text-[var(--text-body)]">
          12th class, 2nd year, Intermediate Part-II and HSSC Part-II all name the same examination
          — the final year of Intermediate. Boards differ in which wording they print, so your
          result may appear under a heading you were not expecting.
        </p>

        <h2 className="mt-12 text-2xl font-bold tracking-tight">Where to check, board by board</h2>
        <p className="mt-3 max-w-3xl text-[var(--text-body)]">
          Each board publishes its own result. The table records what each portal was observed to
          ask for when it was last loaded. Where something has not been verified, it says so rather
          than guessing.
        </p>

        <div className="table-responsive-wrapper mt-6">
          <table className="w-full min-w-[46rem] border-collapse text-sm">
            <caption className="sr-only">
              Official HSSC Part-II result portals by board, with observed requirements
            </caption>
            <thead>
              <tr className="border-b border-[var(--border-card)] text-left">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Board
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Official result portal
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Roll number lookup
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Security check
                </th>
              </tr>
            </thead>
            <tbody>
              {BOARDS.map((board) => {
                const sources = rollNumberSources(board.id)
                const portal = sources[0]
                return (
                  <tr key={board.id} className="border-b border-[var(--border-subtle)]">
                    <th scope="row" className="py-3 pr-4 text-left font-medium">
                      {board.shortName}
                    </th>
                    <td className="py-3 pr-4">
                      {portal ? (
                        <a
                          href={portal.url}
                          rel="noopener nofollow"
                          className="text-primary-700 underline underline-offset-4"
                        >
                          {portal.name}
                        </a>
                      ) : (
                        <span className="text-[var(--text-muted)]">Not verified</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {capabilityLabel(portal?.supportsRollNumber ?? null)}
                    </td>
                    <td className="py-3 pr-4">{capabilityLabel(portal?.hasCaptcha ?? null)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-3xl text-sm text-[var(--text-muted)]">
          “Not verified” means exactly that — not that the board lacks the feature. Where a board’s
          site refused an automated check, nothing is claimed about it either way.
        </p>

        <h2 className="mt-12 text-2xl font-bold tracking-tight">Checking by SMS</h2>
        <p className="mt-3 max-w-3xl text-[var(--text-body)]">
          No SMS shortcode is listed on this site, because none could be found published on any
          board’s own website. Codes circulating elsewhere contradict each other, and an SMS is
          charged — texting a wrong shortcode costs money and returns nothing. A code will be
          published here only with a link to the board page that prints it.
        </p>

        <p className="mt-10">
          <Link
            href="/boards"
            className="text-primary-700 text-sm font-semibold underline underline-offset-4"
          >
            Board directory, with official websites
          </Link>
        </p>
      </div>
    </>
  )
}

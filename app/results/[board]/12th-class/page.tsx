import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BoardSidebar } from '@/components/result/board-sidebar'
import { BoardStatusHero } from '@/components/result/board-status-hero'
import { RollNumberLookup } from '@/components/result/roll-number-lookup'
import { SourceObservations } from '@/components/result/source-observations'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { PerGroupStatus } from '@/components/result/per-group-status'
import { CURRENT_RESULT_YEAR, getBoardBySlug, routedBoards } from '@/lib/board/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { capabilityLabel } from '@/lib/result/capability'
import { getPageByPath } from '@/lib/content/registry'
import { linkableSources } from '@/lib/result-sources/registry'
import { metadataForPage } from '@/lib/seo/metadata'

/**
 * The board result page — yearless by design (ADR-004).
 *
 * The current session's status renders here with the year in the title; a past
 * session earns its own URL only when it has durable value of its own. No
 * competitor maintains year-stamped archive URLs, and theirs 404 while the
 * yearless page resolves.
 *
 * `dynamicParams = false` with params enumerated from the registry means an
 * unregistered board returns a real 404 rather than rendering an empty shell.
 * The parameter space is closed, so there is no crawlable infinite surface.
 */

export const dynamicParams = false

export function generateStaticParams(): { board: string }[] {
  // Only boards whose page has actually been built. A `planned` board is named
  // in the directory and linked to its official source, but has no route.
  return routedBoards().map((board) => ({ board: board.slug }))
}

function pathFor(slug: string): string {
  return `/results/${slug}/12th-class`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string }>
}): Promise<Metadata> {
  const { board: slug } = await params
  const page = getPageByPath(pathFor(slug))
  if (!page) return {}
  return metadataForPage(page)
}

export default async function BoardResultPage({ params }: { params: Promise<{ board: string }> }) {
  const { board: slug } = await params
  const board = getBoardBySlug(slug)
  const page = board ? getPageByPath(pathFor(board.slug)) : undefined
  if (!board || !page) notFound()

  const sources = linkableSources(board.id)
  const year = CURRENT_RESULT_YEAR

  return (
    <>
      <JsonLdScript
        nodes={[
          webPageSchema({
            path: page.path,
            name: page.title,
            description: page.description,
            dateModified: page.contentUpdatedAt,
          }),
          breadcrumbSchema(page.breadcrumb),
        ]}
      />

      <div className="container-wide py-8">
        <Breadcrumbs trail={page.breadcrumb} />

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{page.h1}</h1>
        <p className="mt-3 text-[var(--text-muted)]">{board.officialName}</p>

        {/*
          TWO COLUMNS FROM lg, because one was leaving forty per cent of a
          1440 viewport empty beside a narrow ribbon of text. The sidebar holds
          what a reader on a board page wants next — the neighbouring boards,
          this board’s gazettes, its region — all derived from the same
          registries the main column reads, so the two cannot disagree.
        */}
        <div className="mt-2 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="min-w-0">
            {/*
          THE ANSWER FIRST, from lib/board/result-status.ts.

          This used to open with StatusSentence, which reads the board
          registry’s `resultDate` fact — a field nobody updates during a result
          cycle, so on result morning it still read “has not been announced, as
          last checked on 14 September”. The hero reads the status registry,
          which is checked against the boards’ own sites.
        */}
            <div className="mt-8">
              <BoardStatusHero board={board} />
            </div>

            {/*
          THE COMMAND CENTRE IS GONE FROM THIS PAGE, not disabled.

          It rendered a card headed “Check on the board’s own portal” with the
          same explanation, the same security-check line and a second button to
          the same URL — directly under a hero that had just said all of it.
          Two calls to action to one destination is not emphasis, it is a
          reader wondering which one is the real one. Its one unique part, the
          fallback to the board’s main site, moved into the hero.
        */}

            {board.studentCautions?.length ? (
              <section className="mt-10">
                <h2 className="text-xl font-bold tracking-tight">Before you start</h2>
                <ul className="mt-4 space-y-3 text-[var(--text-body)]">
                  {board.studentCautions.map((caution) => (
                    <li key={caution} className="flex gap-3">
                      <span aria-hidden="true" className="text-accent-600">
                        !
                      </span>
                      <span>{caution}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/*
          SHOWN FOR EVERY BOARD, not only those with a dataset.

          The form used to appear only where a gazette was loaded, and it was
          hard-wired to that gazette’s year — so Lahore’s page offered a box
          headed “First Annual 2025” on the morning the 2026 result was due.
          The session is now chosen here and validated on the server, and a
          session with no gazette answers plainly and links the board’s portal,
          which is a better answer than no box at all.
        */}
            <RollNumberLookup boardSlug={board.slug} boardName={board.shortName} />

            <PerGroupStatus board={board} year={year} />

            <SourceObservations board={board} />

            <section className="mt-10">
              <h2 className="text-2xl font-bold tracking-tight">What this board’s portal offers</h2>
              <div className="table-responsive-wrapper mt-6">
                <table className="w-full min-w-[42rem] border-collapse text-sm">
                  <caption className="sr-only">
                    Verified capabilities of {board.shortName} official sources
                  </caption>
                  <thead>
                    <tr className="border-b border-[var(--border-card)] text-left">
                      <th scope="col" className="py-3 pr-4 font-semibold">
                        Official source
                      </th>
                      <th scope="col" className="py-3 pr-4 font-semibold">
                        Roll number
                      </th>
                      <th scope="col" className="py-3 pr-4 font-semibold">
                        Name search
                      </th>
                      <th scope="col" className="py-3 pr-4 font-semibold">
                        Security check
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map((source) => (
                      <tr key={source.id} className="border-b border-[var(--border-subtle)]">
                        <th scope="row" className="py-3 pr-4 text-left font-medium">
                          <a
                            href={source.url}
                            rel="noopener nofollow"
                            className="text-primary-700 underline underline-offset-4"
                          >
                            {source.name}
                          </a>
                        </th>
                        {/*
                      Every cell goes through `capabilityLabel`. There is no
                      boolean coercion anywhere here, which is what stops an
                      unverified capability rendering as a flat "No".
                    */}
                        <td className="py-3 pr-4">{capabilityLabel(source.supportsRollNumber)}</td>
                        <td className="py-3 pr-4">{capabilityLabel(source.supportsName)}</td>
                        <td className="py-3 pr-4">{capabilityLabel(source.hasCaptcha)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 max-w-3xl text-sm text-[var(--text-muted)]">
                “Not verified” means exactly that — not that the board lacks the feature. Where a
                board’s site refused an automated check, nothing is claimed about it either way.
              </p>
            </section>

            {/*
          THE “WHERE THIS CAME FROM” BLOCK IS GONE, not moved.

          It rendered `board.resultDate`, which is `unknown` for every board
          except Quetta, so it printed “Status: Not announced · Source: No
          source · Last checked: Not yet checked” directly beneath a hero that
          had just named a date, a source and a check date. Two provenance
          claims on one page, disagreeing, is worse than one.

          The hero carries its own sources and links the methodology page.
        */}
          </div>

          <div className="lg:pt-8">
            <BoardSidebar board={board} />
          </div>
        </div>

        <p className="mt-10">
          <Link
            href="/results/12th-class"
            className="text-primary-700 text-sm font-semibold underline underline-offset-4"
          >
            Back to the 12th class result hub
          </Link>
        </p>
      </div>
    </>
  )
}

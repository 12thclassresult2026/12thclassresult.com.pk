import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ResultCommandCenter } from '@/components/result/command-center'
import { RollNumberLookup } from '@/components/result/roll-number-lookup'
import { SourceObservations } from '@/components/result/source-observations'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { PerGroupStatus } from '@/components/result/per-group-status'
import { ProvenanceBlock } from '@/components/result/provenance-block'
import { StatusSentence } from '@/components/result/status-sentence'
import { CURRENT_RESULT_YEAR, getBoardBySlug, routedBoards } from '@/lib/board/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { capabilityLabel } from '@/lib/result/capability'
import { getPageByPath } from '@/lib/content/registry'
import { datasetForBoard } from '@/lib/gazettes/datasets'
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
  const dataset = datasetForBoard(board.slug)

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

        {/* The extractable sentence comes FIRST, before any narrative. */}
        <div className="mt-8 max-w-3xl">
          <StatusSentence board={board} year={year} />
        </div>

        <div className="mt-8 max-w-3xl">
          <ResultCommandCenter board={board} />
        </div>

        {board.studentCautions?.length ? (
          <section className="mt-10 max-w-3xl">
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

        {dataset ? (
          <RollNumberLookup
            boardSlug={board.slug}
            boardName={board.shortName}
            year={dataset.year}
            examinationLabel={dataset.examinationLabel}
            gazetteSourceUrl={dataset.sourceUrl}
            gazetteCheckedOn={dataset.checkedAt}
          />
        ) : null}

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

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight">Where this came from</h2>
          <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-sunken)] p-5">
            <ProvenanceBlock fact={board.resultDate} />
          </div>
        </section>

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

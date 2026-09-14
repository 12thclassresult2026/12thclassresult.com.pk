import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLdScript } from '@/components/seo/json-ld'
import { PROVINCE_LABELS } from '@/lib/board/types'
import { boardsInRegion, coverageFor, nationalRegions } from '@/lib/gazettes/coverage'
import { COVERAGE_LABELS } from '@/lib/gazettes/types'
import { requirePage } from '@/lib/content/registry'
import { identifierRequirementSentence } from '@/lib/result/capability'
import { linkableSources } from '@/lib/result-sources/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('boards-directory')

export const metadata: Metadata = metadataForPage(PAGE)

/*
 * THE REGION LIST IS DERIVED, NOT HAND-WRITTEN.
 *
 * This page previously rendered a literal `['punjab', 'federal']`, which hid
 * eighteen boards across Sindh, Khyber Pakhtunkhwa, Balochistan and AJK — four
 * entire regions absent from a directory claiming to cover Pakistan.
 *
 * `nationalRegions()` reads the registry, so a board in a new region appears
 * automatically and there is no second list to forget.
 */

export default function BoardsDirectory() {
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
        <p className="mt-5 max-w-3xl text-lg text-[var(--text-body)]">
          Boards currently registered on this site, with the official website for each and the
          sources that were verified by loading them.
        </p>

        {nationalRegions().map((province) => {
          const boards = boardsInRegion(province)
          if (boards.length === 0) return null

          return (
            <section key={province} className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight">
                {PROVINCE_LABELS[province]}{' '}
                <span className="text-lg font-normal text-[var(--text-muted)]">
                  ({boards.length} {boards.length === 1 ? 'board' : 'boards'})
                </span>
              </h2>
              <ul className="mt-6 grid gap-4 lg:grid-cols-2">
                {boards.map((board) => {
                  const sources = linkableSources(board.id)
                  const requirement = identifierRequirementSentence({
                    requiresAdditionalIdentifier:
                      sources.find((s) => s.requiresAdditionalIdentifier !== 'unknown')
                        ?.requiresAdditionalIdentifier ?? 'unknown',
                    hasCaptcha:
                      sources.find((s) => s.hasCaptcha !== 'unknown')?.hasCaptcha ?? 'unknown',
                  })

                  return (
                    <li
                      key={board.id}
                      className="rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
                    >
                      <h3 className="font-semibold text-[var(--text-strong)]">
                        {board.officialName}
                      </h3>
                      {/*
                        What a student can actually do at this board today.
                        Never "lookup available" until a gazette dataset is
                        genuinely serving — finding a board's gazette page is
                        not the same as being able to search it.
                      */}
                      <p className="mt-2 text-xs font-medium text-[var(--text-muted)]">
                        {COVERAGE_LABELS[coverageFor(board)]}
                      </p>
                      <p className="mt-2 text-sm">
                        <a
                          href={board.officialWebsite}
                          rel="noopener nofollow"
                          className="text-primary-700 underline underline-offset-4"
                        >
                          Official website
                        </a>
                      </p>

                      {requirement ? (
                        <p className="mt-3 text-sm text-[var(--text-body)]">{requirement}</p>
                      ) : null}

                      {board.studentCautions?.length ? (
                        <ul className="mt-3 space-y-2 text-sm text-[var(--text-body)]">
                          {board.studentCautions.map((caution) => (
                            <li key={caution} className="flex gap-2">
                              <span aria-hidden="true">•</span>
                              <span>{caution}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}

        <p className="mt-12">
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

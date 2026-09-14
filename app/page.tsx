import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLdScript } from '@/components/seo/json-ld'
import { BOARDS } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('home')

export const metadata: Metadata = metadataForPage(PAGE)

export default function HomePage() {
  const verifiedPortalCount = BOARDS.filter((b) =>
    b.sourceIds.some((id) => id.includes('result') || id.includes('directory')),
  ).length

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

      <section className="bg-[var(--surface-hero)] py-16 sm:py-20">
        <div className="container-wide">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {PAGE.h1}
          </h1>
          <p className="text-primary-100 mt-5 max-w-2xl text-lg">
            Your result is published by your education board, not by us. This site tells you which
            board portal actually serves the HSSC Part-II result, what it will ask you for, and what
            has genuinely been announced.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/results/12th-class"
              className="bg-accent-500 text-ink-950 hover:bg-accent-600 inline-flex min-h-12 items-center rounded-[var(--radius-button)] px-6 text-sm font-semibold"
            >
              Check your result
            </Link>
            <Link
              href="/boards"
              className="border-primary-400 hover:bg-primary-800 inline-flex min-h-12 items-center rounded-[var(--radius-button)] border px-6 text-sm font-semibold text-white"
            >
              Find your board
            </Link>
          </div>
        </div>
      </section>

      {/*
        THE STATUS SECTION STATES WHAT IS NOT KNOWN.

        Every competitor in this market currently shows a confident 2026 result
        date; the live search results carry three different ones for the same
        Punjab result and not one cites a board notification. Saying plainly
        that nothing has been announced is both the accurate answer and the
        thing no rival offers.
      */}
      <section className="py-14">
        <div className="container-wide">
          <h2 className="text-2xl font-bold tracking-tight">What has actually been announced</h2>
          <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--color-status-unknown-bg)] p-6">
            <p className="text-sm font-semibold text-[var(--text-strong)]">
              No HSSC Part-II 2026 result date has been confirmed by any board we track.
            </p>
            <p className="mt-3 max-w-3xl text-sm text-[var(--text-body)]">
              Checked on 14 September 2026 against the boards’ own websites. Dates circulating
              elsewhere for this session are not carried here, because none of them could be traced
              to a board notification. When a board publishes one, it will appear here with a link
              to the notification itself and the date it was checked.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-wide">
          <h2 className="text-2xl font-bold tracking-tight">Boards covered</h2>
          <p className="mt-3 max-w-2xl text-[var(--text-body)]">
            {BOARDS.length} boards are registered, {verifiedPortalCount} with an official result
            portal confirmed by loading it.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BOARDS.map((board) => (
              <li
                key={board.id}
                className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
              >
                <p className="font-semibold text-[var(--text-strong)]">{board.shortName}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{board.officialName}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link
              href="/boards"
              className="text-primary-700 text-sm font-semibold underline underline-offset-4"
            >
              See every board and its official portal
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

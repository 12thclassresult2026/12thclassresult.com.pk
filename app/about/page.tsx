import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { BOARDS } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'
import { boardsWithObservedResultPortal } from '@/lib/result-sources/registry'

const PAGE = requirePage('about')

export const metadata: Metadata = metadataForPage(PAGE)

/**
 * The about page.
 *
 * It exists because the footer already asserts independence, and an assertion
 * with no page behind it is worth little. A reader — or a journalist deciding
 * whether to cite something here — needs to be able to establish what this site
 * is, what it deliberately is not, and who is accountable for it.
 *
 * Everything on it is a statement about this project. No claim is made about
 * any board, and no affiliation is implied with any.
 */
export default function AboutPage() {
  const verifiedPortals = boardsWithObservedResultPortal().length

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

      <div className="container-wide py-8">
        <Breadcrumbs trail={PAGE.breadcrumb} />

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{PAGE.h1}</h1>

        <p className="mt-6 max-w-3xl text-lg text-[var(--text-body)]">
          12thClassResult.com.pk helps students in Pakistan find the official source for their Class
          12 (HSSC Part-II) result, and tells them plainly what that source actually offers.
        </p>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">What this site is not</h2>
          <ul className="mt-4 space-y-3 text-[var(--text-body)]">
            <li>
              <strong>Not an education board.</strong> Results are produced and published by the
              boards. Nothing here is official by virtue of being here.
            </li>
            <li>
              <strong>Not affiliated with, endorsed by, or acting for any board</strong> or
              government body.
            </li>
            <li>
              <strong>Not a result checker.</strong> No board in Pakistan currently publishes an API
              or permits automated lookup, so this site does not hold anyone’s result and cannot
              retrieve one on their behalf. Every “checker” in this market is a router to the
              board’s own portal; this one says so instead of pretending otherwise.
            </li>
          </ul>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">What it does</h2>
          <p className="mt-3 text-[var(--text-body)]">
            {BOARDS.length} boards are registered, {verifiedPortals} of them with an official result
            portal confirmed by loading it. For each, the site records where the result is
            published, what the portal asks a candidate for, and what has genuinely been announced —
            each with the date it was checked and a link to the board’s own page.
          </p>
          <p className="mt-4 text-[var(--text-body)]">
            Where a board has no online result checker at all, the site says so rather than showing
            a roll-number box a reader cannot use. Where something could not be verified, it says
            that too.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Why it exists</h2>
          <p className="mt-3 text-[var(--text-body)]">
            The existing answers for these questions are often confidently wrong. Result dates
            circulate that no board has published and that contradict each other. SMS shortcodes are
            printed that cannot be traced to any board — and an SMS is charged, so a wrong one costs
            a student money and returns nothing. Questions about Pakistani rechecking are answered
            with another country’s rules.
          </p>
          <p className="mt-4 text-[var(--text-body)]">
            This site publishes less as a result. That is the point: a fact that cannot be traced to
            a board’s own page is not published here, and the gap is stated rather than filled in.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Independence</h2>
          <p className="mt-3 text-[var(--text-body)]">
            This site is operated independently of every board. It receives no funding, data or
            direction from any board or government body, and it does not sell placement — no board
            or portal appears here, or ranks above another, because of any commercial relationship.
          </p>
          <p className="mt-4 text-[var(--text-body)]">
            Links to board websites are ordinary outbound links. They pass no endorsement in either
            direction.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Your data</h2>
          <p className="mt-3 text-[var(--text-body)]">
            This site holds no student’s result and asks for no identifying information. There is no
            roll-number lookup here, no personal result page, and no analytics of any kind
            installed. Nothing you would type into a board’s portal is entered on this site, logged
            by it, or shared with anyone.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Getting something corrected</h2>
          <p className="mt-3 text-[var(--text-body)]">
            If something here is wrong, it should be corrected rather than defended. Facts are
            stored with the source and date they came from, so a correction updates every page that
            uses that fact rather than being patched in one place.
          </p>
          <p className="mt-4">
            <Link
              href="/methodology"
              className="text-primary-700 font-semibold underline underline-offset-4"
            >
              How a fact gets verified here, and what is never published
            </Link>
          </p>
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

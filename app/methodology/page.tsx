import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'
import { factQualifier } from '@/lib/result/verified-fact'

const PAGE = requirePage('methodology')

export const metadata: Metadata = metadataForPage(PAGE)

/**
 * The methodology page — the public half of `docs/editorial-policy.md`.
 *
 * This is the page that makes the site citable. A journalist or educator
 * deciding whether to reference a figure here needs to be able to answer three
 * questions without asking anyone: where did this number come from, when was it
 * checked, and what does it actually represent.
 *
 * The confidence table is rendered from the SAME constant the rest of the site
 * uses, so the published explanation cannot drift from the behaviour.
 */
export default function MethodologyPage() {
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
          Every changeable claim on this site carries three things: where it came from, when it was
          read, and how confident we are. If a claim cannot carry all three, it is not published as
          a fact.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">The five confidence states</h2>
          <p className="mt-3 max-w-3xl text-[var(--text-body)]">
            Wording on the site follows the state. Nothing is ever promoted from one state to a
            stronger one without a new source.
          </p>
          <div className="table-responsive-wrapper mt-6">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
              <caption className="sr-only">Confidence states used across this site</caption>
              <thead>
                <tr className="border-b border-[var(--border-card)] text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    State
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Shown as
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Means
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    [
                      'confirmed',
                      'Read from the board’s own source, for this exact exam and session.',
                    ],
                    ['tentative', 'The board itself calls it provisional.'],
                    ['expected', 'Our inference from a historical pattern, labelled as such.'],
                    ['historical', 'True of a past session. Not asserted for the current one.'],
                    ['unknown', 'Not verified. This is not the same as “no”.'],
                  ] as const
                ).map(([status, meaning]) => (
                  <tr key={status} className="border-b border-[var(--border-subtle)]">
                    <th scope="row" className="py-3 pr-4 text-left font-medium">
                      {status}
                    </th>
                    <td className="py-3 pr-4 text-[var(--text-muted)]">{factQualifier(status)}</td>
                    <td className="py-3 pr-4">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-sm text-[var(--text-muted)]">
            “Not verified” never becomes “No”. A board whose site refused an automated check is very
            likely working perfectly in an ordinary browser, and saying otherwise would misrepresent
            the board.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Which sources count</h2>
          <ol className="mt-4 space-y-2 text-[var(--text-body)]">
            <li>1. The education board itself — notification, portal, gazette or rulebook</li>
            <li>2. A government or education-department publication</li>
            <li>3. An official inter-board body</li>
            <li>4. Reporting that quotes a board document</li>
          </ol>
          <p className="mt-4 text-[var(--text-body)]">
            Other result websites are not a source. They may show that a question exists; they are
            never the authority for a result date, a shortcode, a fee, a deadline or a board
            procedure. If the only source for a claim is another result site, the claim is not
            published.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">A fact applies to one thing only</h2>
          <p className="mt-3 text-[var(--text-body)]">
            A fact is true of one examination, one session, one year — and where a board declares
            group by group, one group. It is never carried sideways. Three consequences a reader
            will actually notice:
          </p>
          <ul className="mt-4 space-y-3 text-[var(--text-body)]">
            <li>
              A rechecking fee read from a board’s matric portal is not presented as a 12th-class
              fee, because it is not one.
            </li>
            <li>
              Where a board declares one group at a time, a board-level “announced” is never shown
              to a candidate in a group that has not been declared.
            </li>
            <li>
              Punjab boards share an examination calendar. They do not share fee schedules, rules or
              portals, so one board’s figure is never generalised across the province.
            </li>
          </ul>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">When a board’s own sources disagree</h2>
          <p className="mt-3 text-[var(--text-body)]">
            It happens. One board publishes three different rechecking fees across its rulebook, its
            fee table and its live portal — all three genuinely official.
          </p>
          <p className="mt-4 text-[var(--text-body)]">
            The disagreement is shown, not resolved. The figure that actually charges a student
            today is identified as such, and the others are shown beside it. Silently picking one
            would mean publishing an answer the board has not given.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">What is never published here</h2>
          <ul className="mt-4 space-y-3 text-[var(--text-body)]">
            <li>
              A result date, time or SMS shortcode that cannot be traced to a board’s own source. No
              shortcode is listed on this site at present, because none could be found published on
              any board’s own domain.
            </li>
            <li>A “live” badge or countdown that is not backed by a confirmed date.</li>
            <li>Student results copied from another site.</li>
            <li>Position holders or toppers, for which no official source exists.</li>
            <li>
              Any personal result at an indexable address. There is no page on this site at which an
              individual’s result can be looked up, and there never will be.
            </li>
            <li>Fabricated ratings, reviews, statistics, credentials or partnerships.</li>
          </ul>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">How often things are re-checked</h2>
          <p className="mt-3 text-[var(--text-body)]">
            Review frequency follows how quickly a fact goes out of date: live result status every
            few days during a season, dates and fees monthly, board procedure quarterly, and
            evergreen explanation annually.
          </p>
          <p className="mt-4 text-[var(--text-body)]">
            The dates shown on a page are not build timestamps. Nothing here is re-stamped because a
            deployment ran or a file was reformatted — a verification date moves only when someone
            has actually re-read the source.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Corrections</h2>
          <p className="mt-3 text-[var(--text-body)]">
            If something here is wrong, it gets corrected rather than defended. Facts are stored
            once, with their source and date, so a correction propagates to every page that uses
            that fact instead of being patched on the page somebody happened to notice.
          </p>
        </section>

        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/about"
            className="text-primary-700 text-sm font-semibold underline underline-offset-4"
          >
            About this site
          </Link>
          <Link
            href="/boards"
            className="text-primary-700 text-sm font-semibold underline underline-offset-4"
          >
            Every board and its official source
          </Link>
        </p>
      </div>
    </>
  )
}

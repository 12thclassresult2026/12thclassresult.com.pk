import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'
import { COMMON_HSSC_TOTAL, PERCENTAGE_FORMULA, calculatePercentage } from '@/lib/marks/percentage'

const PAGE = requirePage('guide-percentage')

export const metadata: Metadata = metadataForPage(PAGE)

/**
 * The percentage explainer.
 *
 * Evidence G6c, verified: the answer currently ranking for this query applies
 * CBSE's `CGPA x 9.5`. That is an Indian formula for a grading system Pakistan
 * does not use, and a student who follows it gets a number that means nothing.
 *
 * Correcting it is the entire point of the page, so the correction is stated
 * plainly rather than buried under a general explanation.
 */

/* A worked example, computed rather than typed, so the prose cannot drift from
   the arithmetic the calculator actually performs. */
const EXAMPLE = calculatePercentage({ obtained: 842, total: COMMON_HSSC_TOTAL })

export default function PercentageGuidePage() {
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

        {/* The direct answer, above everything else. */}
        <div className="mt-6 max-w-3xl rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--color-status-unknown-bg)] p-6">
          <p className="font-semibold text-[var(--text-strong)]">
            Percentage = {PERCENTAGE_FORMULA.pakistan}
          </p>
          <p className="mt-3 text-[var(--text-body)]">
            Pakistani boards report an HSSC result as marks out of a total — most commonly{' '}
            {COMMON_HSSC_TOTAL} for Part-I and Part-II together. There is no grade-point conversion
            step, because there is no grade point to convert.
          </p>
          {EXAMPLE.kind === 'ok' ? (
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Worked example: {EXAMPLE.obtained} out of {EXAMPLE.total} is{' '}
              {EXAMPLE.percentage.toFixed(2)}%.
            </p>
          ) : null}
        </div>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">
            The CGPA × 9.5 formula does not apply in Pakistan
          </h2>
          <p className="mt-3 text-[var(--text-body)]">
            This is the most common wrong answer for this question, and it is easy to find. It comes
            from {PERCENTAGE_FORMULA.foreignOrigin}, where results are issued as a cumulative grade
            point average and that multiplier converts a CGPA into an approximate percentage.
          </p>
          <p className="mt-4 text-[var(--text-body)]">
            {PERCENTAGE_FORMULA.whyForeignIsWrong} Applying it to a Pakistani result card means
            multiplying a number that is not a CGPA by a constant that was never meant for it. The
            result is meaningless — not slightly off.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">
            What counts toward the total: both years
          </h2>
          <p className="mt-3 text-[var(--text-body)]">
            An HSSC qualification is decided on Part-I and Part-II together. Pass or fail is
            determined on the aggregate of the two years, not on the final year alone.
          </p>
          <p className="mt-4 text-[var(--text-body)]">
            So a percentage worked out from a Part-II result card by itself is a percentage for that
            year — useful to know, but it is not the figure that appears on the certificate and it
            is not what an admissions office asks for. Use the combined obtained marks and the
            combined total.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Why no grade is shown here</h2>
          <p className="mt-3 text-[var(--text-body)]">
            A percentage is arithmetic and cannot be wrong. A grade is a board rule, and the grade
            bands in circulation disagree with each other — several variants are published across
            result sites and none could be traced to a board’s own source.
          </p>
          <p className="mt-4 text-[var(--text-body)]">
            Your grade and your division are printed on your own result card and gazette entry,
            which are authoritative. A table assembled from unverified sources would not be, and the
            grade is exactly the figure a student is most likely to act on.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">
            A board percentage is not an admission aggregate
          </h2>
          <p className="mt-3 text-[var(--text-body)]">
            Universities in Pakistan rarely admit on HSSC percentage alone. They combine it with an
            entry test — and sometimes with matric marks — under a weighting the institution sets,
            which differs between institutions and changes between admission cycles.
          </p>
          <p className="mt-4 text-[var(--text-body)]">
            No aggregate formula is published here for that reason. A weighting copied from a
            previous cycle would look authoritative and quietly mislead someone choosing where to
            apply. Take the formula from the institution’s own current prospectus.
          </p>
        </section>

        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/tools/percentage-calculator"
            className="text-primary-700 text-sm font-semibold underline underline-offset-4"
          >
            Work out your percentage
          </Link>
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

import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { PercentageCalculator } from '@/components/tools/percentage-calculator'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'
import { COMMON_HSSC_TOTAL, PERCENTAGE_FORMULA } from '@/lib/marks/percentage'

const PAGE = requirePage('tool-percentage')

export const metadata: Metadata = metadataForPage(PAGE)

/**
 * The calculator page.
 *
 * The tool is first and the explanation is short — a reader arriving on
 * "percentage calculator" wants a number, not an article. The longer treatment
 * lives on the explainer, which this links to.
 */
export default function PercentageCalculatorPage() {
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
        <p className="mt-3 max-w-2xl text-[var(--text-body)]">
          Enter your marks. The formula is {PERCENTAGE_FORMULA.pakistan} — nothing more complicated
          than that.
        </p>

        {/* The tool, immediately. No content wall above it. */}
        <div className="mt-6 max-w-2xl">
          <PercentageCalculator />
        </div>

        <section className="mt-10 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight">What this does not do</h2>
          <ul className="mt-4 space-y-3 text-[var(--text-body)]">
            <li>
              <strong>It does not give you a grade or a division.</strong> Boards publish different
              grade bands, and none could be verified from a board’s own source, so a grade here
              would be a guess at the figure you are most likely to act on.
            </li>
            <li>
              <strong>It does not assume your total is {COMMON_HSSC_TOTAL}.</strong> That is the
              usual HSSC total, so it is pre-filled, but the field is yours to change. Check your
              own result card.
            </li>
            <li>
              <strong>It is not an admission aggregate.</strong> Universities weight HSSC marks
              against an entry test using their own formula, which changes by institution and by
              year. This is your board percentage only.
            </li>
          </ul>
        </section>

        <section className="mt-10 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight">
            Why the formula you may have seen is wrong
          </h2>
          <p className="mt-3 text-[var(--text-body)]">
            Search for this and you will often be told to multiply your CGPA by 9.5. That is{' '}
            {PERCENTAGE_FORMULA.foreignOrigin}’s formula. {PERCENTAGE_FORMULA.whyForeignIsWrong}
          </p>
          <p className="mt-4">
            <Link
              href="/guides/how-percentage-is-calculated"
              className="text-primary-700 text-sm font-semibold underline underline-offset-4"
            >
              How the percentage is actually calculated, in full
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

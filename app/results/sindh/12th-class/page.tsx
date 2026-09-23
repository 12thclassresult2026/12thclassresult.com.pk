import type { Metadata } from 'next'

import { RegionHub } from '@/components/region/region-hub'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { BOARDS } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('sindh-12th-class')

export const metadata: Metadata = metadataForPage(PAGE)

const SINDH_BOARDS = BOARDS.filter((board) => board.province === 'sindh')

/**
 * Sindh HSSC Part-II hub.
 *
 * THE THIRD DECLARATION MODEL ON THIS SITE, and the reason a region is a page
 * rather than a filter.
 *
 * Punjab's nine boards declare together on one committee calendar. KPK's eight
 * declare on their own dates. Sindh does neither: BISE Hyderabad published
 * HSC-II Annual 2026 group by group — Commerce, Home Economics and Medical
 * each separately — while BIEK Karachi has announced nothing for 2026 at all.
 *
 * So a Sindh student's question is not "is the Sindh result out". It is "is MY
 * board's result out, and has MY group gone yet". A single regional headline
 * cannot answer that, and this page does not try: it reports each board, and
 * for Hyderabad it says which groups have been published so far.
 */
export default function SindhResultHubPage() {
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

          <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {PAGE.h1}
          </h1>

          <div className="mt-6">
            <RegionHub
              regionLabel="Sindh"
              boards={SINDH_BOARDS}
              intro="Sindh boards do not declare on a shared date, and some do not declare the whole board at once. BISE Hyderabad has published its HSC-II Annual 2026 result group by group — Commerce, Home Economics and Medical so far — while BIEK Karachi, which is the intermediate board for Karachi, has announced nothing for 2026 yet. Check the row for your own board, and if your board declares by group, check whether your group has gone."
            />
          </div>
        </div>
      </div>
    </>
  )
}

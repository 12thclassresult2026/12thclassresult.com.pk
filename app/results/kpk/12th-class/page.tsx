import type { Metadata } from 'next'

import { RegionHub } from '@/components/region/region-hub'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { BOARDS } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('kpk-12th-class')

export const metadata: Metadata = metadataForPage(PAGE)

const KPK_BOARDS = BOARDS.filter((board) => board.province === 'khyber-pakhtunkhwa')

/**
 * KPK HSSC Part-II hub.
 *
 * THIS REGION IS THE REASON REGION HUBS EXIST. Punjab's nine boards share one
 * committee calendar and declare together, so a single date serves all of
 * them. KPK's eight do not: Peshawar declared on 21 September at 3 PM, several
 * others afterwards on their own dates, and Swat is not confirmed at all.
 *
 * Until this page existed, a student searching "KPK 12th class result" got
 * either a national list of twenty-eight boards or a `?region=` filter on one
 * — a control, not a destination, and not something a search engine can rank.
 *
 * The page makes no blanket claim. It reports how many of the eight have
 * declared and names which, because "KPK results are out" is true for seven
 * boards and false for the student whose board is the eighth.
 */
export default function KpkResultHubPage() {
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
              regionLabel="KPK"
              boards={KPK_BOARDS}
              intro="Khyber Pakhtunkhwa's boards announce the HSSC Annual-I result on their own dates, not together. BISE Peshawar declared first, and the others followed separately — so the date for your board is the only one that matters. Each row below was read from that board's own website, and the check button opens the board's portal rather than a copy of it."
            />
          </div>
        </div>
      </div>
    </>
  )
}

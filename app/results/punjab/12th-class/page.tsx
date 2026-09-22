import type { Metadata } from 'next'

import { RegionHub } from '@/components/region/region-hub'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { BOARDS } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('punjab-12th-class')

export const metadata: Metadata = metadataForPage(PAGE)

const PUNJAB_BOARDS = BOARDS.filter((board) => board.province === 'punjab')

/**
 * Punjab HSSC Part-II hub.
 *
 * The opposite case from KPK, and that is what makes both worth having. Punjab's
 * nine boards declare on one calendar circulated by the Punjab Boards Committee
 * of Chairmen, so a single date genuinely applies to all of them — which is
 * exactly the claim that must not be copied onto any other region.
 *
 * That date is carried as `scheduled` with `reported` confidence, not as
 * official: it comes from press reporting of the committee's calendar, and BISE
 * Lahore's own site had published no HSSC Part-II 2026 notification when it was
 * checked. The status flips to announced per board, from that board's own
 * source — never from a clock reaching the scheduled time.
 */
export default function PunjabResultHubPage() {
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
              regionLabel="Punjab"
              boards={PUNJAB_BOARDS}
              intro="All nine Punjab boards declare the HSSC Part-II result on a single calendar circulated by the Punjab Boards Committee of Chairmen, so one date covers Lahore, Gujranwala, Faisalabad, Multan, Rawalpindi, Sargodha, Bahawalpur, D.G. Khan and Sahiwal together. That date is reported by press citing the committee; each board's row moves to announced only when that board's own site says so."
            />
          </div>
        </div>
      </div>
    </>
  )
}

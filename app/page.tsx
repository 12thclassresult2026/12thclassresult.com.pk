import type { Metadata } from 'next'

import type { BoardOption } from '@/components/result/board-finder'
import type { FaqItem } from '@/components/ui/faq-accordion'

import { AfterResultSection } from '@/components/home/after-result-section'
import { BoardCardsGrid } from '@/components/home/board-cards-grid'
import { CurrentStatusSection } from '@/components/home/current-status-section'
import { FaqShowcaseSection } from '@/components/home/faq-showcase-section'
import { GazetteLookupExplainerSection } from '@/components/home/gazette-lookup-explainer-section'
import { GazetteSection } from '@/components/home/gazette-section'
import { HeroSection } from '@/components/home/hero-section'
import { ResultInformationSection } from '@/components/home/result-information-section'
import { ResultMethodsSection } from '@/components/home/result-methods-section'
import { ResultScheduleSection } from '@/components/home/result-schedule-section'
import { ResultTroubleshootingSection } from '@/components/home/result-troubleshooting-section'
import { SemanticContentSections } from '@/components/home/semantic-content-sections'
import { StepProcessSection } from '@/components/home/step-process-section'
import { TrustVerificationSection } from '@/components/home/trust-verification-section'
import { UnderstandResultSection } from '@/components/home/understand-result-section'
import { JsonLdScript } from '@/components/seo/json-ld'
import { BOARDS, routedBoards } from '@/lib/board/registry'
import { PROVINCE_LABELS } from '@/lib/board/types'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('home')

export const metadata: Metadata = metadataForPage(PAGE)

const FAQS: FaqItem[] = [
  {
    question: 'How can I check my 12th Class Result 2026 by roll number?',
    answer:
      'Select your education board, choose the correct year and examination, and enter your roll number. Where a validated Gazette dataset is available, the system can search for the matching result record. Otherwise, use the verified result method provided for your board.',
  },
  {
    question: 'Is 12th Class Result the same as 2nd Year or HSSC Part-II?',
    answer:
      'Yes. In many Pakistani education systems, 12th Class, 2nd Year, HSSC Part-II and Intermediate Part-II describe the same stage of education. The exact terminology can vary between boards.',
  },
  {
    question: 'Can I check results for all Pakistan education boards?',
    answer:
      'The platform is designed for Pakistan-wide board coverage, but result functionality depends on verified board sources and available Gazette datasets. Some boards may provide local lookup while others currently use an official portal or another verified fallback.',
  },
  {
    question: 'Can I check my result using a Gazette?',
    answer:
      'Yes, where a validated Gazette dataset is available. The lookup uses the selected board, year, examination and roll number to find the corresponding Gazette record.',
  },
  {
    question: 'Can I check the 12th Class Result by name?',
    answer:
      'Name search is only appropriate when the board or Gazette legitimately supports it. Roll-number search is usually more precise because multiple candidates may share the same or similar names.',
  },
  {
    question: 'Can I check my 2nd Year Result by SMS?',
    answer:
      'Some education boards provide an SMS result service. SMS codes and formats can differ between boards, so only use a code that has been verified for your board and result cycle.',
  },
  {
    question: 'Why is my roll number not showing a result?',
    answer:
      'Check your board, year, examination and roll number first. The result may also be unavailable because it has not been announced, the Gazette dataset is still processing, or the board currently supports another result method.',
  },
  {
    question: 'Are result dates the same for every board in Pakistan?',
    answer:
      'No. Result schedules can differ between boards, provinces, regions and examination sessions. Board-specific result status should be checked separately.',
  },
  {
    question: 'Is a Gazette result an official DMC?',
    answer:
      'No. A Gazette-derived result record is not automatically an official Detailed Marks Certificate. Official DMCs and certificates are issued according to the procedures of the relevant education board.',
  },
  {
    question: 'Is 12thClassResult.com.pk an official board website?',
    answer:
      'No. 12thClassResult.com.pk is an independent education result platform. It is not an official government or education board website.',
  },
]

export default function HomePage() {
  const routed = new Set(routedBoards().map((board) => board.slug))

  const boardOptions: BoardOption[] = BOARDS.map((board) => ({
    slug: board.slug,
    shortName: board.shortName,
    region: PROVINCE_LABELS[board.province],
    hasPage: routed.has(board.slug),
  }))

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLdScript
        nodes={[
          webPageSchema({
            path: PAGE.path,
            name: PAGE.title,
            description: PAGE.description,
            dateModified: PAGE.contentUpdatedAt,
          }),
          breadcrumbSchema(PAGE.breadcrumb),
          faqSchema(FAQS),
        ]}
      />

      {/* 1. HERO SECTION (Daylight Pakistan Campus Theme) */}
      <HeroSection boards={boardOptions} />

      {/* 2. CURRENT RESULT STATUS SECTION */}
      <CurrentStatusSection lastVerifiedAt={PAGE.lastVerifiedAt} />

      {/* 3. BOARD SELECTION GRID (4 Columns with official logos) */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/60 bg-white py-16 sm:py-20">
        <div className="container-wide relative">
          <BoardCardsGrid />
        </div>
      </section>

      {/* 4. UNDERSTAND YOUR RESULT (Semantic Editorial Section) */}
      <UnderstandResultSection />

      {/* 5. 4-STEP PROCESS GUIDE */}
      <section className="w-full border-b border-[#B4D5CC]/50 bg-[#F3F8F7] py-16 sm:py-20">
        <div className="container-wide">
          <StepProcessSection />
        </div>
      </section>

      {/* 6. RESULT METHODS (Ways to Check 2nd Year Result) */}
      <ResultMethodsSection />

      {/* 7. VERIFIED GAZETTE LOOKUP EXPLAINER */}
      <GazetteLookupExplainerSection />

      {/* 8. GAZETTE SECTION */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-[#F9FBFA] via-white to-[#F2FAF7] py-16 sm:py-20">
        <div className="container-wide relative">
          <GazetteSection />
        </div>
      </section>

      {/* 9. RESULT SCHEDULE (When Will 12th Class Result Be Announced?) */}
      <ResultScheduleSection />

      {/* 10. RESULT INFORMATION & DMC COMPARISON */}
      <ResultInformationSection />

      {/* 11. COMPACT TROUBLESHOOTING SECTION */}
      <ResultTroubleshootingSection />

      {/* 12. AFTER YOUR RESULT (Actionable Post-Result Steps & University Pathways) */}
      <AfterResultSection />

      {/* 13. 5 SEMANTIC CONTENT SECTIONS (AEO / Comprehensive Topical Authority) */}
      <SemanticContentSections />

      {/* 14. SOURCE TRANSPARENCY & TRUST VERIFICATION */}
      <TrustVerificationSection />

      {/* 15. FREQUENTLY ASKED QUESTIONS (Showcase Design) */}
      <FaqShowcaseSection />
    </div>
  )
}

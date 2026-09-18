import type { Metadata } from 'next'

import type { BoardOption } from '@/components/result/board-finder'
import type { FaqItem } from '@/components/ui/faq-accordion'

import { BoardCardsGrid } from '@/components/home/board-cards-grid'
import { CurrentStatusSection } from '@/components/home/current-status-section'
import { FaqShowcaseSection } from '@/components/home/faq-showcase-section'
import { GazetteLookupExplainerSection } from '@/components/home/gazette-lookup-explainer-section'
import { GazetteSection } from '@/components/home/gazette-section'
import { HeroSection } from '@/components/home/hero-section'
import { ResultInformationSection } from '@/components/home/result-information-section'
import { ResultMethodsSection } from '@/components/home/result-methods-section'
import { ResultScheduleSection } from '@/components/home/result-schedule-section'
import { SemanticContentSections } from '@/components/home/semantic-content-sections'
import { StepProcessSection } from '@/components/home/step-process-section'
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
      'Select your education board, choose the correct year and examination, and enter your roll number in the result checker. Where a verified Gazette dataset is available, the system can search the matching Gazette record. If local lookup is unavailable, use the verified official board result method shown on the page.',
  },
  {
    question: 'Is 12th Class Result the same as 2nd Year Result or HSSC Part-II Result?',
    answer:
      'Yes. In Pakistan, 12th Class Result, 2nd Year Result, HSSC Part-II Result, Inter Part-II Result, and Second Year Result commonly refer to the final year of Intermediate education. The exact terminology may differ slightly between education boards.',
  },
  {
    question: 'Can I check the 12th Class Result 2026 for all Pakistan boards?',
    answer:
      '12thClassResult.com.pk is designed for Pakistan-wide HSSC Part-II result coverage. Board availability varies according to verified result sources, Gazettes, official portals, and board-specific result methods. Check the board directory to see the current status of your board.',
  },
  {
    question: 'Can I check my result from the 12th Class Result Gazette?',
    answer:
      'Yes, where a verified board Gazette is available and supported. Gazette-based lookup searches the relevant board, year, examination, and roll number to find the corresponding result record. The information displayed depends on what the original Gazette contains.',
  },
  {
    question: 'Does a Gazette result show subject-wise marks?',
    answer:
      'Not always. Some Gazettes may contain detailed marks, while others may only include a roll number, candidate name, total marks, result status, or limited information. We only display fields supported by the verified source and do not invent missing marks or details.',
  },
  {
    question: 'Can I check my 12th Class Result 2026 by name?',
    answer:
      'Name-based result search is only available where the relevant board or verified Gazette legitimately supports it. Roll-number lookup is generally more precise because multiple candidates can have the same or similar names.',
  },
  {
    question: 'Can I check the 2nd Year Result 2026 by SMS?',
    answer:
      'Some education boards provide an SMS result service. SMS availability, codes, and message formats can differ by board and result cycle. Use only the SMS method shown as verified for your board rather than assuming one code works across Pakistan.',
  },
  {
    question: 'Why is my roll number not showing a result?',
    answer:
      'First check that you selected the correct board, year, examination, and roll number. A record may also be unavailable if the result has not been announced, the Gazette has not yet been processed, or that board currently supports only an official-portal fallback. A missing record should not automatically be interpreted as a failed result.',
  },
  {
    question: 'Are 12th Class result dates the same for every board in Pakistan?',
    answer:
      'No. Result schedules can vary by board, province, region, examination, and session. For this reason, board-specific confirmed, tentative, expected, and announced statuses should be checked separately rather than applying one date to every Pakistan board.',
  },
  {
    question: 'Is the result shown on this website an official DMC?',
    answer:
      'No. A result generated from Gazette data should be treated as a Gazette result record, not automatically as an official Detailed Marks Certificate (DMC). For an official DMC, result card, or certificate, follow the procedure provided by the relevant education board.',
  },
  {
    question: 'What should I do after checking my 12th Class Result?',
    answer:
      'Depending on your result and board rules, your next step may involve rechecking, second annual examinations, improvement, calculating your percentage, or preparing for university admissions and entry tests. Board-specific guidance should always be checked against current official information.',
  },
  {
    question: 'Where does 12thClassResult.com.pk get result information from?',
    answer:
      'The platform prioritizes verified board Gazettes, official board websites, official result portals, notifications, and other approved primary sources. Source status and verification information should be shown wherever it materially affects the result or guidance.',
  },
  {
    question: 'Is 12thClassResult.com.pk an official education board website?',
    answer:
      'No. 12thClassResult.com.pk is an independent education result platform. It is not a government department or an official education board website. Official board sources are used for verification and are linked where appropriate.',
  },
  {
    question: 'What if the official board website is not working on result day?',
    answer:
      "If a verified Gazette dataset is already available on the platform, Gazette-based lookup may still work independently of the board's overloaded website. Where local lookup is unavailable, the page should provide other verified options such as the official portal, SMS method, Gazette source, or retry guidance.",
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

      {/* 11. 5 SEMANTIC CONTENT SECTIONS (AEO / Comprehensive Topical Authority) */}
      <SemanticContentSections />

      {/* 12. FREQUENTLY ASKED QUESTIONS (Showcase Design) */}
      <FaqShowcaseSection />
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

import type { BoardOption } from '@/components/result/board-finder'
import type { FaqItem } from '@/components/ui/faq-accordion'

import { BoardCardsGrid } from '@/components/home/board-cards-grid'
import { HeroSection } from '@/components/home/hero-section'
import { GazetteSection } from '@/components/home/gazette-section'
import { StepProcessSection } from '@/components/home/step-process-section'
import { JsonLdScript } from '@/components/seo/json-ld'
import { FaqAccordion } from '@/components/ui/faq-accordion'
import { BOARDS, routedBoards } from '@/lib/board/registry'
import { PROVINCE_LABELS } from '@/lib/board/types'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('home')

export const metadata: Metadata = metadataForPage(PAGE)

const FAQS: FaqItem[] = [
  {
    question: 'When will the 12th class result 2026 be announced?',
    answer:
      'No board has published an HSSC Part-II 2026 result date at the time of the last check. Dates circulating elsewhere for this session could not be traced to any board notification, so they are not repeated here. When a board issues one, it appears on that board’s page with a link to the notification and the date it was checked.',
  },
  {
    question: 'Can I check my result on this site?',
    answer:
      'No, and no site can. No education board in Pakistan publishes a result API or permits automated lookup, so every "result checker" in this market is really a link to the board’s own portal. This one says so, and sends you to the official source with the information you need before you get there.',
  },
  {
    question: 'Why does my board have no roll number box?',
    answer:
      'Because it does not have one. Karachi, Hyderabad, Sukkur, Larkana and several others publish the result as a gazette rather than through a roll-number form. Showing a roll-number box for those boards would be an instruction you cannot follow.',
  },
  {
    question: 'What is HSSC Part-II, and is it the same as 12th class?',
    answer:
      'Yes. HSSC Part-II, Second Year, Intermediate Part-II and 12th class all name the same examination. Boards use different wording for it, and each board page shows the wording that board’s own portal uses, so you can recognise the screen in front of you.',
  },
  {
    question: 'Is this an education board or an official site?',
    answer:
      'No. This is an independent information service, not a board, and not affiliated with any board. Every board’s own official website is linked so that anything you read here can be confirmed at its source.',
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

      {/* 2. THE STATUS STRIP (Latest Update) */}
      <section className="border-y border-emerald-100 bg-[#EDF8F5] py-5">
        <div className="container-wide">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-[#007054] px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
              Latest update
            </span>
            <p className="text-sm font-bold text-slate-900">
              No HSSC Part-II 2026 result date has been confirmed by any board we track.
            </p>
          </div>
          <p className="mt-2 text-xs text-slate-600 sm:text-sm">
            Checked on 14 September 2026 against the boards’ own websites. When a board publishes an
            official notification, it will appear here with a verified link.{' '}
            <Link
              href="/methodology"
              className="font-bold text-[#007054] underline underline-offset-4"
            >
              How we verify
            </Link>
          </p>
        </div>
      </section>

      {/* 3. BOARD SELECTION GRID (4 Columns with official logos) */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/60 bg-white py-16 sm:py-20">
        <div className="container-wide relative">
          <BoardCardsGrid />
        </div>
      </section>

      {/* 4. 4-STEP PROCESS GUIDE */}
      <section className="w-full border-b border-[#B4D5CC]/50 bg-[#F3F8F7] py-16 sm:py-20">
        <div className="container-wide">
          <StepProcessSection />
        </div>
      </section>

      {/* 5. GAZETTE DOWNLOAD SECTION */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-[#F9FBFA] via-white to-[#F2FAF7] py-16 sm:py-20">
        <div className="container-wide relative">
          <GazetteSection />
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="w-full bg-white py-16 sm:py-20">
        <div className="container-wide max-w-4xl">
          <div className="mx-auto text-center">
            <span className="rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-[#007054]">
              HELP &amp; INFORMATION
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Common questions about 12th class results, dates, roll numbers and verification.
            </p>
          </div>

          <div className="mt-10">
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>
    </div>
  )
}

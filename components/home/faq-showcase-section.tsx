'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  BookOpenIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  FileTextIcon,
  GraduationCapIcon,
  GridIcon,
  HeadphonesIcon,
  HelpCircleIcon,
  LandmarkIcon,
  MailIcon,
  MessageSquareIcon,
  SearchIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons'

export interface FaqShowcaseItem {
  id: number
  question: string
  answer: string
  category: 'checking' | 'dates' | 'gazette' | 'sms' | 'boards' | 'general'
  tip?: string
}

export const FAQ_DATA: FaqShowcaseItem[] = [
  {
    id: 1,
    category: 'checking',
    question: 'How can I check my 12th Class Result 2026 by roll number?',
    answer:
      'Select your education board, choose the correct year and examination, and enter your roll number in the result checker. Where a verified Gazette dataset is available, the system can search the matching Gazette record. If local lookup is unavailable, use the verified official board result method shown on the page.',
    tip: 'Make sure to enter your correct roll number as mentioned on your admit card.',
  },
  {
    id: 2,
    category: 'general',
    question: 'Is 12th Class Result the same as 2nd Year Result or HSSC Part-II Result?',
    answer:
      'Yes. In Pakistan, 12th Class Result, 2nd Year Result, HSSC Part-II Result, Inter Part-II Result, and Second Year Result commonly refer to the final year of Intermediate education. The exact terminology may differ slightly between education boards.',
    tip: 'Different boards use different names on their portals, but they all refer to the same 12th grade examination.',
  },
  {
    id: 3,
    category: 'boards',
    question: 'Can I check the 12th Class Result 2026 for all Pakistan boards?',
    answer:
      '12thClassResult.com.pk is designed for Pakistan-wide HSSC Part-II result coverage. Board availability varies according to verified result sources, Gazettes, official portals, and board-specific result methods. Check the board directory to see the current status of your board.',
    tip: 'Visit the Boards directory to view Punjab, KPK, Sindh, Balochistan, and Federal board hubs.',
  },
  {
    id: 4,
    category: 'gazette',
    question: 'Can I check my result from the 12th Class Result Gazette?',
    answer:
      'Yes, where a verified board Gazette is available and supported. Gazette-based lookup searches the relevant board, year, examination, and roll number to find the corresponding result record. The information displayed depends on what the original Gazette contains.',
    tip: 'Gazettes are official comprehensive PDFs published directly by each education board on result day.',
  },
  {
    id: 5,
    category: 'gazette',
    question: 'Does a Gazette result show subject-wise marks?',
    answer:
      'Not always. Some Gazettes may contain detailed marks, while others may only include a roll number, candidate name, total marks, result status, or limited information. We only display fields supported by the verified source and do not invent missing marks or details.',
    tip: 'Detailed subject marks are available on the official board DMC / result portal.',
  },
  {
    id: 6,
    category: 'checking',
    question: 'Can I check my 12th Class Result 2026 by name?',
    answer:
      'Name-based result search is only available where the relevant board or verified Gazette legitimately supports it. Roll-number lookup is generally more precise because multiple candidates can have the same or similar names.',
    tip: 'Searching by roll number gives an exact, unambiguous result instantly.',
  },
  {
    id: 7,
    category: 'sms',
    question: 'Can I check the 2nd Year Result 2026 by SMS?',
    answer:
      'Some education boards provide an SMS result service. SMS availability, codes, and message formats can differ by board and result cycle. Use only the SMS method shown as verified for your board rather than assuming one code works across Pakistan.',
    tip: 'Wait for the official notification on result morning to verify the active telecom shortcode.',
  },
  {
    id: 8,
    category: 'checking',
    question: 'Why is my roll number not showing a result?',
    answer:
      'First check that you selected the correct board, year, examination, and roll number. A record may also be unavailable if the result has not been announced, the Gazette has not yet been processed, or that board currently supports only an official-portal fallback. A missing record should not automatically be interpreted as a failed result.',
    tip: 'Double-check that you have selected the right board and examination session.',
  },
  {
    id: 9,
    category: 'dates',
    question: 'Are 12th Class result dates the same for every board in Pakistan?',
    answer:
      'No. Result schedules can vary by board, province, region, examination, and session. For this reason, board-specific confirmed, tentative, expected, and announced statuses should be checked separately rather than applying one date to every Pakistan board.',
    tip: 'Always verify announcements through official board notifications rather than social media rumors.',
  },
  {
    id: 10,
    category: 'checking',
    question: 'Is the result shown on this website an official DMC?',
    answer:
      'No. A result generated from Gazette data should be treated as a Gazette result record, not automatically as an official Detailed Marks Certificate (DMC). For an official DMC, result card, or certificate, follow the procedure provided by the relevant education board.',
    tip: 'Official original DMCs are issued by schools, colleges, or board offices.',
  },
  {
    id: 11,
    category: 'dates',
    question: 'What should I do after checking my 12th Class Result?',
    answer:
      'Depending on your result and board rules, your next step may involve rechecking, second annual examinations, improvement, calculating your percentage, or preparing for university admissions and entry tests. Board-specific guidance should always be checked against current official information.',
    tip: 'Use our free Percentage Calculator to calculate your exact merit score for university admissions.',
  },
  {
    id: 12,
    category: 'general',
    question: 'Where does 12thClassResult.com.pk get result information from?',
    answer:
      'The platform prioritizes verified board Gazettes, official board websites, official result portals, notifications, and other approved primary sources. Source status and verification information should be shown wherever it materially affects the result or guidance.',
    tip: 'We maintain strict provenance and only link directly to verified official sources.',
  },
  {
    id: 13,
    category: 'general',
    question: 'Is 12thClassResult.com.pk an official education board website?',
    answer:
      'No. 12thClassResult.com.pk is an independent education result platform. It is not a government department or an official education board website. Official board sources are used for verification and are linked where appropriate.',
    tip: 'Independent, student-first platform designed to simplify result checking nationwide.',
  },
  {
    id: 14,
    category: 'boards',
    question: 'What if the official board website is not working on result day?',
    answer:
      "If a verified Gazette dataset is already available on the platform, Gazette-based lookup may still work independently of the board's overloaded website. Where local lookup is unavailable, the page should provide other verified options such as the official portal, SMS method, Gazette source, or retry guidance.",
    tip: 'Board servers often face heavy traffic on result morning; alternate options and Gazettes help avoid downtime.',
  },
]

const CATEGORY_TABS = [
  { id: 'all', label: 'All Questions', icon: GridIcon },
  { id: 'checking', label: 'Result Checking', icon: FileTextIcon },
  { id: 'dates', label: 'Dates & Schedule', icon: CalendarIcon },
  { id: 'gazette', label: 'Gazette', icon: BookOpenIcon },
  { id: 'sms', label: 'SMS Codes', icon: MessageSquareIcon },
  { id: 'boards', label: 'Boards', icon: LandmarkIcon },
  { id: 'general', label: 'General', icon: HelpCircleIcon },
] as const

export function FaqShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIds, setOpenIds] = useState<number[]>([1])

  function toggleFaq(id: number) {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const filteredFaqs = useMemo(() => {
    let list = FAQ_DATA
    if (activeCategory !== 'all') {
      list = list.filter((item) => item.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          (item.tip && item.tip.toLowerCase().includes(q)),
      )
    }
    return list
  }, [activeCategory, searchQuery])

  return (
    <section
      id="faq-section"
      className="relative w-full overflow-hidden border-t border-slate-200/60 bg-[#FAFCFB] py-16 sm:py-20"
    >
      {/* Decorative Question Mark Watermark (Top Right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-8 font-serif text-[180px] leading-none font-black text-emerald-900/[0.04] select-none sm:text-[260px] lg:text-[340px]"
      >
        ?
      </div>

      <div className="container-wide relative z-10">
        {/* -- 1. Section Header -- */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1 text-xs font-bold tracking-wide text-[#007054]">
            <HelpCircleIcon width={13} height={13} />
            <span>HELP &amp; SUPPORT</span>
          </span>

          <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl">
            Frequently Asked <span className="text-[#007054]">Questions</span>
          </h2>

          <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
            Get quick answers to common questions about 12th Class Result 2026, dates, roll numbers,
            gazette, SMS codes and board verification.
          </p>
        </div>

        {/* -- 2. Search Box -- */}
        <div className="mx-auto mt-7 max-w-2xl">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-sm transition-all focus-within:border-[#007054] focus-within:ring-2 focus-within:ring-[#007054]/20"
          >
            <div className="pointer-events-none pr-2 pl-3.5 text-slate-400">
              <SearchIcon width={18} height={18} />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your question here..."
              className="w-full bg-transparent py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none sm:text-sm"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mr-2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              className="rounded-xl bg-[#007054] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#005B44] active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* -- 3. Category Filter Tabs -- */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeCategory === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#007054] text-white shadow-sm'
                    : 'border border-slate-200/80 bg-white text-slate-600 hover:border-emerald-200 hover:bg-slate-50'
                }`}
              >
                <Icon
                  width={13}
                  height={13}
                  className={isActive ? 'text-white' : 'text-slate-500'}
                />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* -- 4. Two-Column Main Content (Sidebar + Accordion) -- */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Still Have a Question & Quick Help Sidebar */}
          <div className="space-y-5 lg:col-span-4">
            {/* Card 1: Still Have a Question? */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-[#007054]">
                <GraduationCapIcon width={22} height={22} />
              </div>

              <h3 className="mt-3 text-base font-extrabold text-slate-900 sm:text-lg">
                Still Have a Question?
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                We&apos;re here to help! Find quick answers or get in touch with our support team.
              </p>

              <div className="mt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/80 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs transition-all hover:border-[#007054] hover:bg-emerald-50/50 hover:text-[#007054]"
                >
                  <MailIcon width={14} height={14} />
                  <span>Contact Us &rarr;</span>
                </Link>
              </div>

              {/* Graduation Cap Photo */}
              <div className="relative mt-5 aspect-square w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-inner">
                <Image
                  src="/images/faq-books.jpg"
                  alt="Academic books with graduation cap"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Card 2: Quick Help Checklist */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <span className="text-base">💡</span>
                <span>Quick Help</span>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2Icon width={16} height={16} className="shrink-0 text-[#007054]" />
                  <span>100% Free Information</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2Icon width={16} height={16} className="shrink-0 text-[#007054]" />
                  <span>Official Board Links</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2Icon width={16} height={16} className="shrink-0 text-[#007054]" />
                  <span>Regular Updates</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2Icon width={16} height={16} className="shrink-0 text-[#007054]" />
                  <span>Accurate &amp; Verified Data</span>
                </div>
              </div>
            </div>

            {/* Card 3: Inspirational Quote */}
            <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 p-5">
              <div className="font-serif text-2xl leading-none text-[#007054]">“</div>
              <p className="mt-1 text-xs leading-relaxed font-medium text-slate-700 italic">
                Education is the key to a brighter tomorrow. Keep going!
              </p>
              <div className="mt-2.5 h-1 w-8 rounded-full bg-[#007054]" />
            </div>
          </div>

          {/* Right Column: Numbered Accordion List */}
          <div className="space-y-3.5 lg:col-span-8">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <p className="text-sm font-bold text-slate-700">No questions match your search.</p>
                <p className="mt-1 text-xs text-slate-500">
                  Try searching with different words or reset the category filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('all')
                  }}
                  className="mt-4 rounded-xl bg-[#007054] px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              filteredFaqs.map((item) => {
                const isOpen = openIds.includes(item.id)
                const numStr = item.id < 10 ? `0${item.id}` : `${item.id}`

                return (
                  <div
                    key={item.id}
                    className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                      isOpen
                        ? 'border-emerald-200/90 bg-white shadow-sm ring-1 ring-emerald-500/10'
                        : 'border-slate-200/80 bg-white hover:border-emerald-200 hover:shadow-xs'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left sm:p-4.5"
                      aria-expanded={isOpen}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-colors ${
                            isOpen
                              ? 'bg-[#007054] text-white shadow-xs'
                              : 'border border-emerald-100 bg-emerald-50 text-[#007054]'
                          }`}
                        >
                          {numStr}
                        </div>
                        <h4 className="text-xs leading-snug font-bold text-slate-900 sm:text-[14px]">
                          {item.question}
                        </h4>
                      </div>

                      <div
                        className={`shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#007054]' : 'text-slate-400'
                        }`}
                      >
                        <ChevronDownIcon width={16} height={16} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4.5 pl-14 sm:px-5 sm:pl-16">
                        <p className="text-xs leading-relaxed text-slate-600">{item.answer}</p>

                        {item.tip && (
                          <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
                            <CheckCircleIcon
                              width={15}
                              height={15}
                              className="mt-0.5 shrink-0 text-[#007054]"
                            />
                            <span>
                              <strong className="font-bold">Tip:</strong> {item.tip}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* -- 5. Bottom Trust Value Strip (3 Columns) -- */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Feature 1 */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-[#007054]">
              <ShieldCheckIcon width={20} height={20} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 sm:text-sm">Reliable Information</h5>
              <p className="text-[11px] text-slate-500">Based on official board sources</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-[#007054]">
              <ClockIcon width={20} height={20} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 sm:text-sm">Regular Updates</h5>
              <p className="text-[11px] text-slate-500">Get the latest news and announcements</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-[#007054]">
              <HeadphonesIcon width={20} height={20} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 sm:text-sm">Need More Help?</h5>
              <p className="text-[11px] text-slate-500">Contact our support team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

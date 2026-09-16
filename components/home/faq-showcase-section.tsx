'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { HeadphonesIcon } from '@/components/ui/icons'

interface FaqItem {
  id: number
  num: string
  question: string
  answer: string
}

const FAQ_COL_1: FaqItem[] = [
  {
    id: 1,
    num: '01',
    question: 'How can I check my 12th Class Result 2026 by roll number?',
    answer:
      'Select your education board, choose the correct year and examination, and enter your roll number in the result checker. Where a verified Gazette dataset is available, the system can search the matching Gazette record. If local lookup is unavailable, use the verified official board result method shown on the page.',
  },
  {
    id: 2,
    num: '02',
    question: 'Is 12th Class Result 2026 the same as 2nd Year Result?',
    answer:
      'Yes. In Pakistan, 12th Class Result, 2nd Year Result, HSSC Part-II Result, Inter Part-II Result, and Second Year Result commonly refer to the final year of Intermediate education. The exact terminology may differ slightly between education boards.',
  },
  {
    id: 3,
    num: '03',
    question: 'Can I check the result by name?',
    answer:
      'Name-based result search is only available where the relevant board or verified Gazette legitimately supports it. Roll-number lookup is generally more precise because multiple candidates can have the same or similar names.',
  },
  {
    id: 4,
    num: '04',
    question: 'Can I check the result through SMS?',
    answer:
      'Some education boards provide an SMS result service. SMS availability, codes, and message formats can differ by board and result cycle. Use only the SMS method shown as verified for your board rather than assuming one code works across Pakistan.',
  },
  {
    id: 5,
    num: '05',
    question: 'When will 12th class result 2026 be announced?',
    answer:
      'Education boards across Punjab, KPK, Sindh, Balochistan, and Federal schedule their HSSC Part-II announcements following paper checking. Exact dates are published via official board notifications and updated live on our platform as soon as they are confirmed.',
  },
  {
    id: 6,
    num: '06',
    question: 'Are the result dates the same for all boards in Pakistan?',
    answer:
      'No. Result schedules can vary by board, province, region, examination, and session. For this reason, board-specific confirmed, tentative, expected, and announced statuses should be checked separately rather than applying one date to every Pakistan board.',
  },
  {
    id: 7,
    num: '07',
    question: 'Can I download the 12th class result gazette?',
    answer:
      'Yes, where a verified board Gazette is available and supported. Gazette-based lookup searches the relevant board, year, examination, and roll number to find the corresponding result record. You can also download official board Gazette PDFs directly from our Gazette section.',
  },
]

const FAQ_COL_2: FaqItem[] = [
  {
    id: 8,
    num: '08',
    question: 'Does the gazette show subject-wise marks?',
    answer:
      'Not always. Some Gazettes may contain detailed marks, while others may only include a roll number, candidate name, total marks, result status, or limited information. We only display fields supported by the verified source and do not invent missing marks or details.',
  },
  {
    id: 9,
    num: '09',
    question: 'Can I check the result for all Punjab boards?',
    answer:
      'Yes. We provide full coverage for all 9 Punjab boards (Lahore, Gujranwala, Faisalabad, Multan, Rawalpindi, Sargodha, Sahiwal, Bahawalpur, and DG Khan) as well as Federal, KPK, Sindh, and Balochistan boards.',
  },
  {
    id: 10,
    num: '10',
    question: 'Is this an official website?',
    answer:
      'No. 12thClassResult.com.pk is an independent education result platform. It is not a government department or an official education board website. Official board sources are used for verification and are linked where appropriate.',
  },
  {
    id: 11,
    num: '11',
    question: 'What if the official board website is not working?',
    answer:
      "If a verified Gazette dataset is already available on the platform, Gazette-based lookup may still work independently of the board's overloaded website. Where local lookup is unavailable, the page provides verified options such as the official portal, SMS method, Gazette source, or retry guidance.",
  },
  {
    id: 12,
    num: '12',
    question: 'Where does 12thClassResult.com.pk get its information from?',
    answer:
      'The platform prioritizes verified board Gazettes, official board websites, official result portals, notifications, and other approved primary sources. Source status and verification information are shown wherever it materially affects the result or guidance.',
  },
  {
    id: 13,
    num: '13',
    question: 'Do I need my roll number to check the result?',
    answer:
      'Yes, your roll number is the primary identifier used by education boards to locate your individual result record. Make sure to enter the exact roll number printed on your official roll number slip or admit card.',
  },
  {
    id: 14,
    num: '14',
    question: 'How can I contact support if I still have a problem?',
    answer:
      'If you encounter any issues finding your result, checking gazettes, or accessing board links, you can reach out through our contact page or support email. Our team is dedicated to guiding students through result day.',
  },
]

export function FaqShowcaseSection() {
  const [openIds, setOpenIds] = useState<number[]>([1])

  function toggle(id: number) {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  return (
    <section
      id="faq-section"
      className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container-wide relative">
        {/* -- Header Section with Calligraphy and Decorative Watermark -- */}
        <div className="relative mb-12 text-center">
          {/* Left Decorative Calligraphy: Your Questions Our Support */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 left-2 hidden select-none lg:block"
          >
            <div className="-rotate-10 transform text-left">
              <span className="block font-serif text-xl font-bold tracking-tight text-[#007054]/90 italic sm:text-2xl">
                Your
              </span>
              <span className="block font-serif text-xl font-bold tracking-tight text-[#007054]/90 italic sm:text-2xl">
                Questions
              </span>
              <span className="block font-serif text-xl font-bold tracking-tight text-[#007054]/90 italic sm:text-2xl">
                Our Support
              </span>
              <svg className="mt-1 h-3 w-28 text-[#007054]/80" viewBox="0 0 120 12" fill="none">
                <path
                  d="M2 9C30 3 70 3 118 9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Right Decorative Chat Bubble Watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 right-2 hidden select-none lg:block"
          >
            <div className="relative flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100/60 shadow-xs">
                <span className="font-serif text-5xl font-black text-[#007054]/70">?</span>
              </div>
              <div className="absolute -right-3 -bottom-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-200/80 shadow-xs">
                <span className="text-sm font-black tracking-widest text-[#007054]">•••</span>
              </div>
            </div>
          </div>

          {/* Centered Pill Badge */}
          <div className="inline-flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-[#007054]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#007054] text-[10px] text-white">
                ?
              </span>
              <span>FAQ</span>
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[42px]">
            Frequently Asked <span className="text-[#007054]">Questions</span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
            Find quick answers to common questions about 12th class result 2026, dates, roll
            numbers, gazette, SMS codes and board information.
          </p>

          {/* Underline Bar */}
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-[#007054]" />
        </div>

        {/* -- 2-Column Accordion Grid (7 items Left, 7 items Right) -- */}
        <div className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-2 lg:gap-5">
          {/* Column 1: Items 01 - 07 */}
          <div className="space-y-3.5 sm:space-y-4">
            {FAQ_COL_1.map((item) => {
              const isOpen = openIds.includes(item.id)
              return (
                <div
                  key={item.id}
                  className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? 'border-emerald-200 bg-white shadow-xs'
                      : 'border-slate-200/85 bg-white hover:border-emerald-200/80 hover:shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 p-3.5 text-left sm:p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-[11px] font-black text-[#007054] sm:h-8 sm:w-8 sm:text-xs">
                        {item.num}
                      </span>
                      <span className="text-xs leading-snug font-bold text-slate-900 sm:text-[13.5px]">
                        {item.question}
                      </span>
                    </div>

                    <span
                      className={`shrink-0 text-xl font-light transition-transform duration-200 ${
                        isOpen ? 'rotate-45 font-bold text-[#007054]' : 'text-[#007054]'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-4 pt-2.5 pb-4 pl-13 text-xs leading-relaxed text-slate-600 sm:pl-14">
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Column 2: Items 08 - 14 */}
          <div className="space-y-3.5 sm:space-y-4">
            {FAQ_COL_2.map((item) => {
              const isOpen = openIds.includes(item.id)
              return (
                <div
                  key={item.id}
                  className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? 'border-emerald-200 bg-white shadow-xs'
                      : 'border-slate-200/85 bg-white hover:border-emerald-200/80 hover:shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 p-3.5 text-left sm:p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-[11px] font-black text-[#007054] sm:h-8 sm:w-8 sm:text-xs">
                        {item.num}
                      </span>
                      <span className="text-xs leading-snug font-bold text-slate-900 sm:text-[13.5px]">
                        {item.question}
                      </span>
                    </div>

                    <span
                      className={`shrink-0 text-xl font-light transition-transform duration-200 ${
                        isOpen ? 'rotate-45 font-bold text-[#007054]' : 'text-[#007054]'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-4 pt-2.5 pb-4 pl-13 text-xs leading-relaxed text-slate-600 sm:pl-14">
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* -- Bottom "We're here to help!" Full-width Banner -- */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-emerald-100/90 bg-gradient-to-r from-[#EEF8F5] via-[#EAF6F2] to-[#EEF8F5] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Left Info with Headset Icon */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/80 text-[#007054] shadow-xs sm:h-16 sm:w-16">
                <HeadphonesIcon width={28} height={28} />
              </div>

              <div>
                <span className="block text-[11px] font-black tracking-wider text-[#007054] uppercase">
                  STILL HAVE A QUESTION?
                </span>
                <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                  We&apos;re here to help!
                </h3>
                <p className="mt-0.5 text-xs text-slate-600">
                  Can&apos;t find what you&apos;re looking for? Our support team is ready to assist
                  you.
                </p>
              </div>
            </div>

            {/* Middle Button */}
            <div className="shrink-0">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#007054] px-7 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#005842] hover:shadow-lg active:scale-95 sm:text-sm"
              >
                <span>Contact Support</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Right Books with Graduation Cap Photo */}
            <div className="relative hidden h-28 w-36 shrink-0 overflow-hidden rounded-2xl md:block lg:h-32 lg:w-44">
              <Image
                src="/images/faq-books.jpg"
                alt="Support and study resources"
                fill
                sizes="(max-width: 768px) 100vw, 180px"
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

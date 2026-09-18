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
      'Select your education board, choose the correct year and examination, and enter your roll number. Where a validated Gazette dataset is available, the system can search for the matching result record. Otherwise, use the verified result method provided for your board.',
  },
  {
    id: 2,
    num: '02',
    question: 'Is 12th Class Result the same as 2nd Year or HSSC Part-II?',
    answer:
      'Yes. In many Pakistani education systems, 12th Class, 2nd Year, HSSC Part-II and Intermediate Part-II describe the same stage of education. The exact terminology can vary between boards.',
  },
  {
    id: 3,
    num: '03',
    question: 'Can I check results for all Pakistan education boards?',
    answer:
      'The platform is designed for Pakistan-wide board coverage, but result functionality depends on verified board sources and available Gazette datasets. Some boards may provide local lookup while others currently use an official portal or another verified fallback.',
  },
  {
    id: 4,
    num: '04',
    question: 'Can I check my result using a Gazette?',
    answer:
      'Yes, where a validated Gazette dataset is available. The lookup uses the selected board, year, examination and roll number to find the corresponding Gazette record.',
  },
  {
    id: 5,
    num: '05',
    question: 'Can I check the 12th Class Result by name?',
    answer:
      'Name search is only appropriate when the board or Gazette legitimately supports it. Roll-number search is usually more precise because multiple candidates may share the same or similar names.',
  },
]

const FAQ_COL_2: FaqItem[] = [
  {
    id: 6,
    num: '06',
    question: 'Can I check my 2nd Year Result by SMS?',
    answer:
      'Some education boards provide an SMS result service. SMS codes and formats can differ between boards, so only use a code that has been verified for your board and result cycle.',
  },
  {
    id: 7,
    num: '07',
    question: 'Why is my roll number not showing a result?',
    answer:
      'Check your board, year, examination and roll number first. The result may also be unavailable because it has not been announced, the Gazette dataset is still processing, or the board currently supports another result method.',
  },
  {
    id: 8,
    num: '08',
    question: 'Are result dates the same for every board in Pakistan?',
    answer:
      'No. Result schedules can differ between boards, provinces, regions and examination sessions. Board-specific result status should be checked separately.',
  },
  {
    id: 9,
    num: '09',
    question: 'Is a Gazette result an official DMC?',
    answer:
      'No. A Gazette-derived result record is not automatically an official Detailed Marks Certificate. Official DMCs and certificates are issued according to the procedures of the relevant education board.',
  },
  {
    id: 10,
    num: '10',
    question: 'Is 12thClassResult.com.pk an official board website?',
    answer:
      'No. 12thClassResult.com.pk is an independent education result platform. It is not an official government or education board website.',
  },
]

export function FaqShowcaseSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  function toggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="faq-section"
      aria-labelledby="faq-main-heading"
      className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container-wide relative">
        {/* Header Section */}
        <div className="relative mb-12 text-center">
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
          <h2
            id="faq-main-heading"
            className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[42px]"
          >
            Frequently Asked Questions About{' '}
            <span className="text-[#007054]">12th Class Result 2026</span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
            Find quick answers to common questions about 12th class result 2026, dates, roll
            numbers, gazette, SMS codes and board information.
          </p>

          {/* Underline Bar */}
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-[#007054]" />
        </div>

        {/* 2-Column Accordion Grid (5 items Left, 5 items Right) */}
        <div className="grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-2 lg:gap-5">
          {/* Column 1: Items 01 - 05 */}
          <div className="space-y-3.5 sm:space-y-4">
            {FAQ_COL_1.map((item) => {
              const isOpen = openId === item.id
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
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-question-${item.id}`}
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
                      aria-hidden="true"
                      className={`shrink-0 text-xl font-light transition-transform duration-200 ${
                        isOpen ? 'rotate-45 font-bold text-[#007054]' : 'text-[#007054]'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${item.id}`}
                      className="border-t border-slate-100 px-4 pt-2.5 pb-4 pl-13 text-xs leading-relaxed text-slate-600 sm:pl-14"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Column 2: Items 06 - 10 */}
          <div className="space-y-3.5 sm:space-y-4">
            {FAQ_COL_2.map((item) => {
              const isOpen = openId === item.id
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
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-question-${item.id}`}
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
                      aria-hidden="true"
                      className={`shrink-0 text-xl font-light transition-transform duration-200 ${
                        isOpen ? 'rotate-45 font-bold text-[#007054]' : 'text-[#007054]'
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${item.id}`}
                      className="border-t border-slate-100 px-4 pt-2.5 pb-4 pl-13 text-xs leading-relaxed text-slate-600 sm:pl-14"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom "We're here to help!" Full-width Banner */}
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

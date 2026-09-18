import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowRightIcon,
  BarChartIcon,
  ClockIcon,
  FileTextIcon,
  LandmarkIcon,
  LayersIcon,
} from '@/components/ui/icons'

export function AfterResultSection() {
  return (
    <section
      aria-labelledby="after-result-heading"
      className="relative border-b border-slate-200/80 bg-[#FAFCFB] py-16 sm:py-20"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
            <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
              AFTER YOUR RESULT
            </span>
          </div>

          {/* Heading */}
          <h2
            id="after-result-heading"
            className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
          >
            What to Do After Your 12th Class Result
          </h2>

          {/* Intro */}
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">
            Receiving your HSSC Part-II result is only one part of the next academic step. Depending
            on your marks, result status and future plans, you may need to calculate your
            percentage, apply for rechecking, appear in a Second Annual examination, improve your
            marks or prepare for university admission.
          </p>

          {/* Main Grid: Cards + Campus Visual */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
            {/* Left 7 Cols: The 5 Cards */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-7">
              {/* Row 1: Actionable Cards (Percentage & Rechecking) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* CARD 1: Calculate Your Percentage */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-emerald-200 hover:shadow-xs">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                      <BarChartIcon width={18} height={18} />
                    </div>
                    <h3 className="mt-3 text-base font-extrabold text-slate-900">
                      Calculate Your Percentage
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      Use your obtained marks and total marks to calculate your percentage
                      accurately.
                    </p>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <Link
                      href="/tools/percentage-calculator"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-colors hover:text-[#005a43] hover:underline"
                    >
                      <span>Percentage Calculator</span>
                      <ArrowRightIcon width={12} height={12} />
                    </Link>
                  </div>
                </div>

                {/* CARD 2: Apply for Rechecking */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-emerald-200 hover:shadow-xs">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                      <FileTextIcon width={18} height={18} />
                    </div>
                    <h3 className="mt-3 text-base font-extrabold text-slate-900">
                      Apply for Rechecking
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      Check the current board-specific rechecking procedure, fee and deadline before
                      applying.
                    </p>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <Link
                      href="/guides/rechecking"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-colors hover:text-[#005a43] hover:underline"
                    >
                      <span>Rechecking Guide</span>
                      <ArrowRightIcon width={12} height={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* CARD 3: Second Annual Examination */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all hover:border-emerald-200 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
                    <ClockIcon width={16} height={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                      Second Annual Examination
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      Students who need another examination opportunity should follow the rules
                      published by their own board.
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 4: Improvement of Marks */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all hover:border-emerald-200 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
                    <LayersIcon width={16} height={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                      Improvement of Marks
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      Improvement eligibility and application rules vary between education boards.
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 5: University Admissions */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all hover:border-emerald-200 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
                    <LandmarkIcon width={16} height={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                      University Admissions
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                      Your Intermediate result may be used together with entry tests, merit formulas
                      and programme-specific admission requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Premium University / Future Education Visual */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs lg:col-span-5">
              <div className="relative h-64 w-full sm:h-72 lg:h-full lg:min-h-[360px]">
                <Image
                  src="/images/future-campus.jpg"
                  alt="Modern higher education university campus architecture and academic library"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
                  <span className="text-[11px] font-black tracking-wider text-[#007054] uppercase">
                    ACADEMIC HORIZON
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-snug font-bold text-slate-900 sm:text-sm">
                  Preparing for Higher Education &amp; University Merit
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  Intermediate results form the core qualification for undergraduate programs,
                  engineering, medical, and general university degrees across Pakistan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

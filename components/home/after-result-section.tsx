import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowRightIcon,
  BarChartIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  LandmarkIcon,
  LayersIcon,
} from '@/components/ui/icons'

function GraduationCapIcon({
  width = 20,
  height = 20,
  className = '',
}: {
  width?: number
  height?: number
  className?: string
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

export function AfterResultSection() {
  return (
    <section
      aria-labelledby="after-result-heading"
      className="relative overflow-hidden bg-[#FAFCFB] py-16 sm:py-20 lg:py-24"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-10 h-72 w-72 rounded-full bg-teal-100/30 blur-3xl"
      />

      <div className="container-wide relative z-10">
        <div className="mx-auto max-w-6xl">
          {/* Header Row: Title & Intro (Left) + Editorial Cursive & Dots (Right) */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="max-w-2xl text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1">
                <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
                <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
                  AFTER YOUR RESULT
                </span>
              </div>

              {/* Heading H2 */}
              <h2
                id="after-result-heading"
                className="mt-3.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[36px] lg:leading-tight"
              >
                What to Do After Your 12th Class Result
              </h2>

              {/* Intro */}
              <p className="mt-3.5 text-xs leading-relaxed text-slate-600 sm:text-sm md:text-base">
                Receiving your HSSC Part-II result is only one part of the next academic step.
                Depending on your marks, result status and future plans, you may need to calculate
                your percentage, apply for rechecking, appear in a Second Annual examination,
                improve your marks or prepare for university admission.
              </p>
            </div>

            {/* Top Right: Editorial Handwriting & Dot Matrix Motif */}
            <div className="hidden shrink-0 items-center gap-4 text-right md:flex">
              {/* Tilted Cursive Text */}
              <div className="pr-1 text-right select-none">
                <span
                  className="inline-block -rotate-6 text-xl font-bold text-emerald-700 sm:text-2xl"
                  style={{ fontFamily: 'var(--font-caveat), cursive' }}
                >
                  Higher
                  <br />
                  Possibilities
                </span>
                <svg
                  className="mt-0.5 ml-auto h-1.5 w-20 text-emerald-500/60"
                  viewBox="0 0 80 6"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 4 C25 1 55 1 78 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Dot pattern + Motto */}
              <div className="flex items-center gap-2.5 border-l border-slate-200/70 pl-3">
                <div
                  aria-hidden="true"
                  className="grid grid-cols-3 gap-1.5 text-emerald-300/40 select-none"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400/30" />
                  ))}
                </div>
                <div className="text-left text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase select-none">
                  EDUCATION
                  <br />
                  BUILDS
                  <br />
                  BRIGHTER
                  <br />
                  TOMORROWS
                  <div className="mt-1 h-0.5 w-4 rounded-full bg-[#007054]" />
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-7">
            {/* Left 7 Columns: Action Cards */}
            <div className="flex flex-col justify-between gap-3.5 lg:col-span-7">
              {/* Top Row: 2 Big Action Cards (Percentage & Rechecking) */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {/* CARD 1: Calculate Your Percentage */}
                <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-emerald-300 hover:shadow-xs sm:p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#007054] shadow-2xs">
                        <BarChartIcon width={22} height={22} />
                      </div>
                      <Link
                        href="/tools/percentage-calculator"
                        aria-label="Go to percentage calculator"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100"
                      >
                        <ArrowRightIcon width={13} height={13} />
                      </Link>
                    </div>

                    <h3 className="mt-4 text-base font-extrabold text-slate-900 sm:text-lg">
                      Calculate Your Percentage
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Use your obtained marks and total marks to calculate your percentage
                      accurately.
                    </p>
                  </div>

                  <div className="mt-5">
                    <Link
                      href="/tools/percentage-calculator"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#007054] px-4.5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#005842] active:scale-95"
                    >
                      <span>Percentage Calculator</span>
                      <ArrowRightIcon width={12} height={12} />
                    </Link>
                  </div>
                </div>

                {/* CARD 2: Apply for Rechecking */}
                <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-emerald-300 hover:shadow-xs sm:p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#007054] shadow-2xs">
                        <FileTextIcon width={22} height={22} />
                      </div>
                      <Link
                        href="/guides/rechecking"
                        aria-label="Go to rechecking guide"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100"
                      >
                        <ArrowRightIcon width={13} height={13} />
                      </Link>
                    </div>

                    <h3 className="mt-4 text-base font-extrabold text-slate-900 sm:text-lg">
                      Apply for Rechecking
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Check the current board-specific rechecking procedure, fee and deadline before
                      applying.
                    </p>
                  </div>

                  <div className="mt-5">
                    <Link
                      href="/guides/rechecking"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#007054] px-4.5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#005842] active:scale-95"
                    >
                      <span>Rechecking Guide</span>
                      <ArrowRightIcon width={12} height={12} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* CARD 3: Second Annual Examination */}
              <div className="group flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-xs sm:p-4.5">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                    <ClockIcon width={20} height={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs font-extrabold text-slate-900 sm:text-sm">
                      Second Annual Examination
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                      Students who need another examination opportunity should follow the rules
                      published by their own board.
                    </p>
                  </div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
                  <ChevronRightIcon width={15} height={15} />
                </div>
              </div>

              {/* CARD 4: Improvement of Marks */}
              <div className="group flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-xs sm:p-4.5">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                    <LayersIcon width={20} height={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs font-extrabold text-slate-900 sm:text-sm">
                      Improvement of Marks
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                      Improvement eligibility and application rules vary between education boards.
                    </p>
                  </div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
                  <ChevronRightIcon width={15} height={15} />
                </div>
              </div>

              {/* CARD 5: University Admissions */}
              <div className="group flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-xs sm:p-4.5">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                    <LandmarkIcon width={20} height={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs font-extrabold text-slate-900 sm:text-sm">
                      University Admissions
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                      Your Intermediate result may be used together with entry tests, merit formulas
                      and programme-specific admission requirements.
                    </p>
                  </div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
                  <ChevronRightIcon width={15} height={15} />
                </div>
              </div>

              {/* Bottom Watermark */}
              <div className="mt-1 flex items-center gap-2.5 text-left select-none">
                <span className="h-0.5 w-6 rounded-full bg-[#007054]/70" />
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  SAME RESULTS. BRIGHTER FUTURES.
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Campus Showcase Card */}
            <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs lg:col-span-5">
              {/* Top Image Portion with Overlay */}
              <div className="relative h-64 w-full sm:h-72 lg:h-full lg:min-h-[290px]">
                <Image
                  src="/images/future-campus.jpg"
                  alt="Modern higher education university campus architecture and academic grounds"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Left Top Campus Overlay Typography */}
                <div className="absolute top-5 left-5 z-10 text-left drop-shadow-md select-none">
                  <span className="block text-[10px] font-black tracking-[0.25em] text-white uppercase">
                    BETTER
                  </span>
                  <span className="block text-[10px] font-black tracking-[0.25em] text-white uppercase">
                    EDUCATION
                  </span>
                  <span className="block text-[10px] font-black tracking-[0.25em] text-white uppercase">
                    BRIGHTER
                  </span>
                  <span className="block text-[10px] font-black tracking-[0.25em] text-white uppercase">
                    PAKISTAN
                  </span>
                </div>
              </div>

              {/* Bottom White Panel Portion */}
              <div className="border-t border-slate-100 bg-white p-5 text-left sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
                      <span className="text-[11px] font-black tracking-wider text-[#007054] uppercase">
                        ACADEMIC HORIZON
                      </span>
                    </div>

                    <h3 className="mt-1.5 text-xs font-black text-slate-900 sm:text-sm">
                      Preparing for Higher Education &amp; University Merit
                    </h3>

                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 sm:text-xs">
                      Intermediate results form the core qualification for undergraduate programs,
                      engineering, medical, and general university degrees across Pakistan.
                    </p>
                  </div>

                  {/* Right Side Cap Icon & Badge */}
                  <div className="flex shrink-0 flex-col items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#007054] shadow-2xs">
                      <GraduationCapIcon width={22} height={22} />
                    </div>
                    <span className="mt-1.5 block text-center text-[8px] leading-tight font-black tracking-widest text-slate-400 uppercase">
                      A BRIGHTER
                      <br />
                      TOMORROW
                      <br />
                      AWAITS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

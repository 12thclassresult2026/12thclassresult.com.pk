import { ChevronRightIcon } from '@/components/ui/icons'

export function UnderstandResultSection() {
  return (
    <section
      id="understand-result"
      aria-labelledby="understand-result-heading"
      className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-[#F6FBF9] via-[#EFF8F4] to-[#F7FCFA] py-16 sm:py-20 lg:py-24"
    >
      {/* Decorative Background Elements */}
      {/* 1. Top-Right Ambient Curve & Handwritten Slogan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-80 w-80 rounded-full bg-[#34D399]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-6 right-6 z-10 hidden -rotate-6 select-none sm:block lg:top-8 lg:right-16"
      >
        <span
          className="block text-right text-base leading-tight font-bold text-[#007054]/70 italic sm:text-lg lg:text-xl"
          style={{ fontFamily: 'var(--font-caveat), cursive' }}
        >
          Education
          <br />
          Builds Brighter
          <br />
          Futures
        </span>
      </div>

      {/* 2. Bottom-Right Concentric Arcs & Text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full border border-[#007054]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-10 h-52 w-52 rounded-full border border-[#007054]/15"
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* -- Left Column: Editorial Headline & Explanatory Copy -- */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Eyebrow with green dot and extension rule */}
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#007054]" />
              <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
                UNDERSTAND YOUR RESULT
              </span>
              <span className="h-px w-12 bg-[#007054]/30" />
            </div>

            {/* Main H2 Heading */}
            <h2
              id="understand-result-heading"
              className="mt-4 text-3xl font-black tracking-tight text-[#0F1736] sm:text-4xl lg:text-[42px] lg:leading-[1.15]"
            >
              What Is the 12th Class Result in Pakistan?
            </h2>

            {/* Explanatory Paragraphs */}
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px] sm:leading-relaxed">
              <p>
                The 12th Class Result is the examination result for the final year of Intermediate
                education under Pakistan&apos;s relevant education boards and examining authorities.
                Students may see the same stage described as 2nd Year, Second Year, HSSC Part-II or
                Intermediate Part-II, depending on the board or education system.
              </p>
              <p>
                Students in streams such as FA, FSc, ICS and ICom commonly receive their final
                Intermediate result after completing Part-II examinations. The exact subjects, marks
                structure, result format and terminology can differ between boards.
              </p>
            </div>

            {/* Bottom Accent Rule & Slogan */}
            <div className="mt-7 flex items-center gap-3">
              <span className="h-0.5 w-10 bg-[#007054]" />
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase sm:text-[11px]">
                SAME EDUCATION, BRIGHTER TOMORROWS.
              </span>
            </div>
          </div>

          {/* -- Right Column: Two Premium Floating Guidance Cards -- */}
          <div className="flex flex-col gap-5 lg:col-span-6 xl:col-span-6">
            {/* Card 1: Is 12th Class the Same as 2nd Year? */}
            <div className="group flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-emerald-200 hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:gap-5 sm:p-6">
              {/* Left Squircle Icon Container: Graduation Cap */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E8F6F1] text-[#007054] transition-colors group-hover:bg-[#007054] group-hover:text-white sm:h-20 sm:w-20">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-9 w-9 sm:h-10 sm:w-10"
                  aria-hidden="true"
                >
                  <path d="M22 10v6" />
                  <path d="M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12.5v5c0 2 3 3.5 6 3.5s6-1.5 6-3.5v-5" />
                </svg>
              </div>

              {/* Text Block */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  Is 12th Class the Same as 2nd Year?
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  Yes. In most Pakistani board systems, 12th Class and 2nd Year refer to the second
                  year of Intermediate education. The same result may also be described as the HSSC
                  Part-II Result or Inter Part-II Result.
                </p>
              </div>

              {/* Circular Action Pill */}
              <div
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F6F1] text-[#007054] transition-all group-hover:translate-x-1 group-hover:bg-[#007054] group-hover:text-white"
              >
                <ChevronRightIcon width={16} height={16} />
              </div>
            </div>

            {/* Card 2: What Does HSSC Part-II Mean? */}
            <div className="group flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-emerald-200 hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:gap-5 sm:p-6">
              {/* Left Squircle Icon Container: Document with 'II' Badge */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E8F6F1] text-[#007054] transition-colors group-hover:bg-[#007054] group-hover:text-white sm:h-20 sm:w-20">
                <div className="relative">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 sm:h-9 sm:w-9"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="13" y2="17" />
                  </svg>
                  {/* Small 'II' Badge */}
                  <span className="absolute -right-2.5 -bottom-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#007054] text-[9px] font-black text-white shadow-xs group-hover:bg-white group-hover:text-[#007054]">
                    II
                  </span>
                </div>
              </div>

              {/* Text Block */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  What Does HSSC Part-II Mean?
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  HSSC stands for Higher Secondary School Certificate. Part-II refers to the second
                  and final stage of the HSSC examination cycle under boards that use this
                  terminology.
                </p>
              </div>

              {/* Circular Action Pill */}
              <div
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F6F1] text-[#007054] transition-all group-hover:translate-x-1 group-hover:bg-[#007054] group-hover:text-white"
              >
                <ChevronRightIcon width={16} height={16} />
              </div>
            </div>
          </div>
        </div>

        {/* -- Bottom Watermarks Bar: Dot Matrix + Open Book + Pakistan Education -- */}
        <div className="mt-14 flex items-center justify-between border-t border-[#007054]/10 pt-6 sm:mt-16">
          {/* Bottom-Left: Dot Grid + Open Book Line-Art + RESULTS TODAY */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* 4x4 Dot Matrix */}
            <div aria-hidden="true" className="hidden grid-cols-4 gap-1.5 opacity-40 sm:grid">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-[#007054]" />
              ))}
            </div>

            {/* Open Book Vector */}
            <div className="flex items-center gap-3">
              <svg
                width="36"
                height="24"
                viewBox="0 0 40 28"
                fill="none"
                stroke="#007054"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-9 opacity-70"
                aria-hidden="true"
              >
                <path d="M2 4C8 1 15 2 20 6C25 2 32 1 38 4V24C32 21 25 22 20 26C15 22 8 21 2 24V4Z" />
                <path d="M20 6V26" />
              </svg>
              <div className="text-[10px] font-black tracking-widest text-[#007054]/75 uppercase">
                <span className="block leading-tight">RESULTS TODAY</span>
                <span className="block leading-tight text-[#007054]/55">A BRIGHTER TOMORROW</span>
              </div>
            </div>
          </div>

          {/* Bottom-Right: PAKISTAN EDUCATION Watermark */}
          <div className="text-right">
            <div className="text-[10px] font-black tracking-widest text-[#007054]/75 uppercase">
              <span className="block leading-tight">PAKISTAN</span>
              <span className="block leading-tight text-[#007054]/55">EDUCATION</span>
            </div>
            <div
              aria-hidden="true"
              className="mt-1 ml-auto h-0.5 w-12 rounded-full bg-[#007054]/30"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

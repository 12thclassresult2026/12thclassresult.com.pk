export function UnderstandResultSection() {
  return (
    <section
      aria-labelledby="understand-result-heading"
      className="relative border-b border-slate-200/80 bg-[#FAFCFB] py-14 sm:py-18"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
            <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
              UNDERSTAND YOUR RESULT
            </span>
          </div>

          {/* Heading */}
          <h2
            id="understand-result-heading"
            className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
          >
            What Is the 12th Class Result in Pakistan?
          </h2>

          {/* Editorial Grid: Main Text Block + Two Supporting Cards */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
            {/* Main Content (Large Text Block) */}
            <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg sm:leading-relaxed lg:col-span-7">
              <p>
                The 12th Class Result is the examination result for the final year of Intermediate
                education under Pakistan’s relevant education boards and examining authorities.
                Students may see the same stage described as 2nd Year, Second Year, HSSC Part-II or
                Intermediate Part-II, depending on the board or education system.
              </p>
              <p>
                Students in streams such as FA, FSc, ICS and ICom commonly receive their final
                Intermediate result after completing Part-II examinations. The exact subjects, marks
                structure, result format and terminology can differ between boards.
              </p>
            </div>

            {/* Supporting Content Blocks (Two Cards) */}
            <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-5">
              {/* Supporting Block 1 */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all hover:border-emerald-200 sm:p-6">
                <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  Is 12th Class the Same as 2nd Year?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Yes. In most Pakistani board systems, 12th Class and 2nd Year refer to the second
                  year of Intermediate education. The same result may also be described as the HSSC
                  Part-II Result or Inter Part-II Result.
                </p>
              </div>

              {/* Supporting Block 2 */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all hover:border-emerald-200 sm:p-6">
                <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  What Does HSSC Part-II Mean?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  HSSC stands for Higher Secondary School Certificate. Part-II refers to the second
                  and final stage of the HSSC examination cycle under boards that use this
                  terminology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import {
  ArrowRightIcon,
  CheckCircle2Icon,
  FileTextIcon,
  LayersIcon,
  SearchIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons'

export function GazetteLookupExplainerSection() {
  const pipelineStages = [
    { label: 'Gazette Document', subtext: 'Official PDF Source', icon: FileTextIcon },
    { label: 'Parse', subtext: 'Extract Text & Rows', icon: LayersIcon },
    { label: 'Validate', subtext: 'Integrity Checksum', icon: ShieldCheckIcon },
    { label: 'Search', subtext: 'Roll Number Match', icon: SearchIcon },
    { label: 'Result Card', subtext: 'Verified Display', icon: CheckCircle2Icon, isFinal: true },
  ]

  const processFlowSteps = [
    'Verified Gazette',
    'Source Preserved',
    'Records Parsed',
    'Data Validated',
    'Exact Roll Number Lookup',
    'Source-Transparent Result',
  ]

  return (
    <section
      aria-labelledby="gazette-lookup-heading"
      className="relative border-b border-slate-200/80 bg-[#FAFCFB] py-14 sm:py-18"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
            <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
              VERIFIED GAZETTE LOOKUP
            </span>
          </div>

          {/* Heading */}
          <h2
            id="gazette-lookup-heading"
            className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
          >
            How Our Gazette-Based Result Lookup Works
          </h2>

          {/* Main Content */}
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            <p>
              A Gazette should not simply be uploaded and treated as searchable result data. Before
              a Gazette can support result lookup, its records need to be extracted, normalized and
              checked against the original source.
            </p>
            <p>
              Where Gazette lookup is active, the system follows a structured process so that a roll
              number is matched against the correct board, year and examination dataset.
            </p>
          </div>

          {/* Custom Clean Infographic Process Illustration */}
          <div className="mt-8 rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-2">
              {pipelineStages.map((stage, idx) => {
                const Icon = stage.icon
                return (
                  <div key={stage.label} className="flex flex-col items-center md:contents">
                    {/* Stage Card */}
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border shadow-2xs transition-transform hover:scale-105 ${
                          stage.isFinal
                            ? 'border-[#007054] bg-[#007054] text-white'
                            : 'border-slate-200/90 bg-[#F9FBFA] text-[#007054]'
                        }`}
                      >
                        <Icon width={24} height={24} />
                      </div>
                      <span className="mt-2.5 text-xs font-black text-slate-900 sm:text-sm">
                        {stage.label}
                      </span>
                      <span className="text-[11px] text-slate-500">{stage.subtext}</span>
                    </div>

                    {/* Directional Arrow between stages */}
                    {idx < pipelineStages.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="shrink-0 rotate-90 text-emerald-600/60 md:rotate-0"
                      >
                        <ArrowRightIcon width={18} height={18} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Visual Process Flow (6 Steps) */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {processFlowSteps.map((stepName, idx) => (
              <div
                key={stepName}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-3.5 text-center shadow-2xs transition-all hover:border-emerald-200 sm:p-4"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-black text-[#007054]">
                  {idx + 1}
                </span>
                <span className="mt-2 text-xs leading-snug font-bold text-slate-900 sm:text-[13px]">
                  {stepName}
                </span>
              </div>
            ))}
          </div>

          {/* Two Short Supporting Blocks */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {/* Block 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <ShieldCheckIcon width={18} height={18} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  Why Gazette Verification Matters
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                A parsing or formatting error can attach the wrong name, marks or result status to a
                roll number. A dataset should therefore be validated against the original Gazette
                before it becomes active.
              </p>
            </div>

            {/* Block 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <CheckCircle2Icon width={18} height={18} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  What We Do Not Add to Your Result
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                We do not create marks, grades, subject details, candidate information or result
                statuses that are missing from the source. If a Gazette contains limited
                information, the result display remains limited to those supported fields.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

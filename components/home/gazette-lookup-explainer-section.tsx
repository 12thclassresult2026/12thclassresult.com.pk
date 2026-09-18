import {
  ArrowRightIcon,
  CheckCircle2Icon,
  FileTextIcon,
  InfoIcon,
  LayersIcon,
  SearchIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons'

export function GazetteLookupExplainerSection() {
  const pipelineStages = [
    {
      num: '01',
      label: 'Gazette Document',
      subtext: 'Official PDF Source',
      description: 'We use the official Gazette provided by the relevant board or authority.',
      icon: FileTextIcon,
      highlighted: false,
    },
    {
      num: '02',
      label: 'Parse',
      subtext: 'Extract Text & Rows',
      description:
        'The Gazette is processed using secure extraction methods to read and structure the records.',
      icon: LayersIcon,
      highlighted: false,
    },
    {
      num: '03',
      label: 'Validate',
      subtext: 'Integrity Checksum',
      description:
        'Extracted data is verified, cleaned and matched against the original source to ensure accuracy.',
      icon: ShieldCheckIcon,
      highlighted: false,
    },
    {
      num: '04',
      label: 'Search',
      subtext: 'Roll Number Match',
      description:
        'Your roll number is matched against the correct board, year and examination dataset.',
      icon: SearchIcon,
      highlighted: false,
    },
    {
      num: '05',
      label: 'Result Card',
      subtext: 'Verified Display',
      description:
        'A verified result is displayed using data directly from the Gazette, with only the fields available in the source.',
      icon: function ResultCardIcon(props: {
        className?: string
        width?: number
        height?: number
      }) {
        return (
          <svg
            width={props.width ?? 22}
            height={props.height ?? 22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
          >
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <line x1="7" y1="9" x2="11" y2="9" />
            <line x1="7" y1="13" x2="11" y2="13" />
            <line x1="15" y1="9" x2="17" y2="9" />
            <line x1="15" y1="13" x2="17" y2="13" />
          </svg>
        )
      },
      highlighted: true,
    },
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
      id="gazette-lookup"
      aria-labelledby="gazette-lookup-heading"
      className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-[#F6FBF9] via-[#EFF8F4] to-[#F7FCFA] py-16 sm:py-20 lg:py-24"
    >
      {/* Ambient background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 h-80 w-80 rounded-full bg-[#34D399]/10 blur-3xl"
      />

      <div className="container-wide relative z-10">
        {/* Header: Centered Eyebrow, H2, and Intro Paragraphs */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#007054]" />
            <span className="text-xs font-black tracking-widest text-[#007054] uppercase">
              VERIFIED GAZETTE LOOKUP
            </span>
          </div>

          {/* Heading */}
          <h2
            id="gazette-lookup-heading"
            className="mt-3.5 text-3xl font-black tracking-tight text-[#0F1736] sm:text-4xl lg:text-[42px] lg:leading-[1.15]"
          >
            How Our Gazette-Based Result Lookup Works
          </h2>

          {/* Explanatory Intro */}
          <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
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
        </div>

        {/* Top 5 Step Flow Cards with Directional Connectors */}
        <div className="mt-12 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon
            return (
              <div key={stage.label} className="relative flex flex-col">
                <div
                  className={`flex h-full flex-col justify-between rounded-3xl bg-white p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-6 ${
                    stage.highlighted
                      ? 'border-2 border-emerald-400 ring-4 ring-emerald-500/10'
                      : 'border border-slate-200/70 hover:border-emerald-200'
                  }`}
                >
                  {/* Top row: Number badge & Verified pill */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-black text-[#007054]">
                      {stage.num}
                    </span>
                    {stage.highlighted && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-black text-[#007054] uppercase">
                        <CheckCircle2Icon width={11} height={11} />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Center: Squircle Icon + Titles */}
                  <div className="my-4 flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F6F1] text-[#007054] shadow-2xs">
                      <Icon width={24} height={24} />
                    </div>
                    <h3 className="mt-3.5 text-base font-bold text-slate-900 sm:text-lg">
                      {stage.label}
                    </h3>
                    <span className="mt-0.5 text-[11px] font-bold text-slate-400">
                      {stage.subtext}
                    </span>
                  </div>

                  {/* Body text */}
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-[12.5px]">
                    {stage.description}
                  </p>
                </div>

                {/* Circular Arrow between cards (visible on desktop) */}
                {idx < pipelineStages.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-1/2 -right-3.5 z-20 hidden -translate-y-1/2 lg:flex"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-white text-[#007054] shadow-xs">
                      <ArrowRightIcon width={12} height={12} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 6 Numbered Process Flow Badges */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {processFlowSteps.map((stepName, idx) => (
            <div
              key={stepName}
              className="flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white px-3.5 py-3 shadow-2xs transition-all hover:border-emerald-200 sm:px-4 sm:py-3.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100/90 text-xs font-black text-[#007054]">
                {idx + 1}
              </span>
              <span className="text-xs font-bold text-slate-900">{stepName}</span>
            </div>
          ))}
        </div>

        {/* Two Supporting Blocks */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card 1: Why Gazette Verification Matters */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xs sm:p-7">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                  <ShieldCheckIcon width={22} height={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  Why Gazette Verification Matters
                </h3>
              </div>
              <p className="mt-3.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                A parsing or formatting error can attach the wrong name, marks or result status to a
                roll number. A dataset should therefore be validated against the original Gazette
                before it becomes active.
              </p>
            </div>

            {/* Bottom green-tinted banner */}
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-emerald-200/60 bg-emerald-50/70 px-4 py-2.5 text-xs font-semibold text-[#007054]">
              <CheckCircle2Icon width={15} height={15} className="shrink-0" />
              <span>
                Our process helps ensure that the information you see is accurate and trustworthy.
              </span>
            </div>
          </div>

          {/* Card 2: What We Do Not Add to Your Result */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xs sm:p-7">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <FileTextIcon width={22} height={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  What We Do Not Add to Your Result
                </h3>
              </div>
              <p className="mt-3.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                We do not create marks, grades, subject details, candidate information or result
                statuses that are missing from the source. If a Gazette contains limited
                information, the result display remains limited to those supported fields.
              </p>
            </div>

            {/* Bottom slate/blue-tinted banner */}
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700">
              <InfoIcon width={15} height={15} className="shrink-0" />
              <span>We only show what is available in the official Gazette.</span>
            </div>
          </div>
        </div>

        {/* Bottom Corner Watermark */}
        <div className="mt-8 text-right">
          <span className="text-[10px] font-black tracking-widest text-[#007054]/40 uppercase">
            SAME SOURCES / HIGHER TRUST
          </span>
        </div>
      </div>
    </section>
  )
}

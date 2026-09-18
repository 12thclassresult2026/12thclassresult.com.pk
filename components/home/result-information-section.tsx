import {
  BarChartIcon,
  FileTextIcon,
  HashIcon,
  InfoIcon,
  LandmarkIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
} from '@/components/ui/icons'

function IdCardIcon({
  width = 18,
  height = 18,
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
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <line x1="13" y1="9" x2="18" y2="9" />
      <line x1="13" y1="13" x2="18" y2="13" />
    </svg>
  )
}

export function ResultInformationSection() {
  const resultFields = [
    {
      name: 'Roll Number',
      icon: IdCardIcon,
      isConditional: false,
    },
    {
      name: 'Candidate Name',
      icon: UserIcon,
      isConditional: false,
    },
    {
      name: 'Obtained Marks',
      icon: StarIcon,
      isConditional: false,
    },
    {
      name: 'Total Marks',
      icon: HashIcon,
      isConditional: false,
    },
    {
      name: 'Result Status',
      icon: BarChartIcon,
      isConditional: false,
    },
    {
      name: 'Group',
      icon: UsersIcon,
      isConditional: false,
    },
    {
      name: 'Institution',
      icon: LandmarkIcon,
      isConditional: false,
    },
    {
      name: 'Subject-Wise Marks',
      icon: FileTextIcon,
      isConditional: true,
    },
    {
      name: 'Remarks',
      icon: MessageSquareIcon,
      isConditional: true,
    },
  ]

  return (
    <section
      aria-labelledby="result-info-heading"
      className="relative overflow-hidden bg-[#FAFCFB] py-16 sm:py-20 lg:py-24"
    >
      {/* Soft mint ambient glow decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl"
      />

      <div className="container-wide relative z-10">
        <div className="mx-auto max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-left">
            <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
            <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
              RESULT RECORD FIELDS &amp; CREDENTIALS
            </span>
          </div>

          {/* Heading */}
          <h2
            id="result-info-heading"
            className="mt-3 text-left text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
          >
            What Information Is Shown in a 12th Class Result?
          </h2>

          {/* Underline bar */}
          <div className="mt-3.5 h-1 w-12 rounded-full bg-[#007054]" />

          {/* Content Intro */}
          <p className="mt-4 max-w-3xl text-left text-sm leading-relaxed text-slate-600 sm:text-base">
            The information available in a result record depends on the board and the source used
            for that examination.
          </p>

          {/* 3x3 Grid of 9 Cards */}
          <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {resultFields.map((field) => {
              const Icon = field.icon
              return (
                <div
                  key={field.name}
                  className="flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-xs sm:p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                    <Icon width={19} height={19} />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-xs font-bold text-slate-900 sm:text-sm">
                      {field.name}
                    </span>
                    {field.isConditional && (
                      <span className="text-xs font-normal text-slate-400 italic">
                        {' '}
                        &mdash; where available
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Middle Alert Banner */}
          <div className="mt-6 flex items-center gap-3.5 rounded-2xl border border-emerald-200/90 bg-[#EAF7F1]/80 p-4 text-left shadow-2xs sm:p-4.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white">
              <InfoIcon width={15} height={15} />
            </div>
            <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
              <strong className="font-extrabold text-[#007054]">Important:</strong> Not every
              Gazette contains all of these fields. We only display information supported by the
              relevant Gazette or verified result source.
            </p>
          </div>

          {/* Bottom Card: Gazette VS Official DMC */}
          <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_1.4fr]">
              {/* Left Column: Explanatory text */}
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-[#007054]">
                    <FileTextIcon width={14} height={14} />
                  </div>
                  <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
                    GAZETTE VS OFFICIAL DMC
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  Is a Gazette Result the Same as an Official DMC?
                </h3>

                <div className="mt-3.5">
                  <span className="inline-flex items-center rounded-full border border-rose-200/80 bg-rose-50 px-3.5 py-1 text-xs font-black text-rose-600">
                    Answer: No.
                  </span>
                </div>

                <p className="mt-3.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  A Gazette result record should not automatically be treated as an official
                  Detailed Marks Certificate (DMC). Official DMCs, result cards and certificates are
                  issued according to the procedures of the relevant education board.
                </p>
              </div>

              {/* Right Column: Visual Diagram & Editorial Slogan */}
              <div className="flex flex-col items-center justify-center lg:items-end">
                {/* Comparison Row */}
                <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
                  {/* Card 1: Gazette Result Record */}
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-emerald-100 bg-[#EFF9F4] p-3.5 text-left shadow-2xs sm:p-4.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#007054] shadow-xs">
                      <FileTextIcon width={22} height={22} />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-black text-slate-900 sm:text-sm">
                        Gazette Result Record
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-tight font-medium text-slate-500">
                        Online result information from gazette/source
                      </span>
                    </div>
                  </div>

                  {/* Divider with ≠ */}
                  <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                    <span className="h-px w-2 border-t border-dashed border-slate-300 sm:w-4" />
                    <div
                      aria-label="Not Equal To"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 font-sans text-base font-black text-rose-500 shadow-2xs ring-4 ring-rose-50/60 sm:h-10 sm:w-10 sm:text-lg"
                    >
                      &ne;
                    </div>
                    <span className="h-px w-2 border-t border-dashed border-slate-300 sm:w-4" />
                  </div>

                  {/* Card 2: Official DMC */}
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-blue-100 bg-[#F0F6FF] p-3.5 text-left shadow-2xs sm:p-4.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-xs">
                      <ShieldCheckIcon width={22} height={22} />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-black text-slate-900 sm:text-sm">
                        Official DMC
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-tight font-medium text-slate-500">
                        Issued by the relevant education board
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editorial Handwriting slogan in bottom right */}
                <div className="mt-5 flex flex-col items-end pr-2">
                  <span
                    className="text-base font-bold text-emerald-700 sm:text-lg"
                    style={{ fontFamily: 'var(--font-caveat), cursive' }}
                  >
                    Different Purposes. Different Documents.
                  </span>
                  <svg
                    className="-mt-1 h-2 w-36 text-emerald-500/60"
                    viewBox="0 0 120 8"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6C35 2 85 2 118 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

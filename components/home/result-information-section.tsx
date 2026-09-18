import { CheckCircle2Icon, FileTextIcon, InfoIcon, ShieldCheckIcon } from '@/components/ui/icons'

export function ResultInformationSection() {
  const supportedFields = [
    { name: 'Roll Number', isConditional: false },
    { name: 'Candidate Name', isConditional: false },
    { name: 'Obtained Marks', isConditional: false },
    { name: 'Total Marks', isConditional: false },
    { name: 'Result Status', isConditional: false },
    { name: 'Group', isConditional: false },
    { name: 'Institution', isConditional: false },
    { name: 'Subject-Wise Marks', isConditional: true },
    { name: 'Remarks', isConditional: true },
  ]

  return (
    <section
      aria-labelledby="result-info-heading"
      className="relative border-b border-slate-200/80 bg-white py-16 sm:py-20"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
            <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
              RESULT RECORD FIELDS &amp; CREDENTIALS
            </span>
          </div>

          {/* Heading */}
          <h2
            id="result-info-heading"
            className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
          >
            What Information Is Shown in a 12th Class Result?
          </h2>

          {/* Content */}
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">
            The information available in a result record depends on the board and the source used
            for that examination.
          </p>

          {/* Compact List of Possible Source-Supported Fields */}
          <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {supportedFields.map((field) => (
              <div
                key={field.name}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-[#F9FBFA] px-3.5 py-2.5 text-xs sm:text-sm"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#007054]">
                  <CheckCircle2Icon width={14} height={14} />
                </div>
                <span className="font-bold text-slate-800">
                  {field.name}
                  {field.isConditional && (
                    <span className="ml-1 text-[11px] font-medium text-slate-500">
                      — where available
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Important Statement */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-[#EBF7F3]/60 p-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white">
              <InfoIcon width={14} height={14} />
            </div>
            <p>
              <strong className="font-bold text-slate-900">Important: </strong>
              Not every Gazette contains all of these fields. We only display information supported
              by the relevant Gazette or verified result source.
            </p>
          </div>

          {/* Highlighted Comparison Block: Gazette Result Record ≠ Official DMC */}
          <div className="mt-8 rounded-3xl border border-slate-200/90 bg-[#F8FAF9] p-6 sm:p-8">
            {/* Visual: Gazette Result Record ≠ Official DMC */}
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:gap-6 sm:p-5">
              <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-black text-slate-800 sm:text-sm">
                <FileTextIcon width={16} height={16} className="text-[#007054]" />
                <span>Gazette Result Record</span>
              </div>

              <div
                aria-label="does not equal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-base font-black text-rose-600 shadow-2xs ring-4 ring-rose-50/50"
              >
                ≠
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-black text-[#007054] sm:text-sm">
                <ShieldCheckIcon width={16} height={16} className="text-[#007054]" />
                <span>Official DMC</span>
              </div>
            </div>

            {/* H3 and Content */}
            <div className="mt-6">
              <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                Is a Gazette Result the Same as an Official DMC?
              </h3>

              <div className="mt-3">
                <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-800">
                  Answer: No.
                </span>
              </div>

              <div className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                <strong className="font-bold text-slate-800">Explanation: </strong>A Gazette result
                record should not automatically be treated as an official Detailed Marks Certificate
                (DMC). Official DMCs, result cards and certificates are issued according to the
                procedures of the relevant education board.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'

import { ArrowRightIcon, CheckCircle2Icon } from '@/components/ui/icons'

export function ResultTroubleshootingSection() {
  const checkItems = ['Board', 'Year', 'Examination', 'Roll Number']

  return (
    <section
      aria-labelledby="troubleshooting-heading"
      className="relative border-b border-slate-200/80 bg-[#FAFCFB] py-12 sm:py-16"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-4xl">
          {/* Compact Light Troubleshooting Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
              <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
                LOOKUP HELP &amp; TROUBLESHOOTING
              </span>
            </div>

            {/* H2 */}
            <h2
              id="troubleshooting-heading"
              className="mt-3 text-xl font-black tracking-tight text-slate-900 sm:text-2xl lg:text-[28px] lg:leading-tight"
            >
              Why Is My Roll Number Not Showing a Result?
            </h2>

            {/* Core Reassurance */}
            <p className="mt-3 text-sm font-semibold text-slate-800 sm:text-base">
              If your roll number does not return a result, it does not automatically mean that you
              failed the examination.
            </p>

            {/* Checklist */}
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-600 sm:text-sm">
                First check that you selected the correct:
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {checkItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3 py-1.5 text-xs font-bold text-[#007054]"
                  >
                    <CheckCircle2Icon width={13} height={13} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Explanation of Unavailable Records */}
            <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
              A result may also be unavailable because the board has not announced it yet, the
              Gazette dataset is still being processed, or the board currently supports only an
              official-portal result method.
            </p>

            {/* Callout action for verified alternative */}
            <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-[#F8FAF9] p-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:text-sm">
              <span>
                If local Gazette lookup is unavailable, follow the verified alternative shown for
                your board.
              </span>
              <Link
                href="#boards"
                className="inline-flex shrink-0 items-center gap-1 font-bold text-[#007054] transition-colors hover:text-[#005a43] hover:underline"
              >
                <span>Check Board Directory</span>
                <ArrowRightIcon width={12} height={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

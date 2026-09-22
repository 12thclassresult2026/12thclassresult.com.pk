import Link from 'next/link'

import {
  ArrowRightIcon,
  ChevronRightIcon,
  FileTextIcon,
  LandmarkIcon,
  MessageSquareIcon,
  SearchIcon,
} from '@/components/ui/icons'

export function ResultMethodsSection() {
  const methods = [
    {
      id: 'roll-number',
      num: '01',
      heading: 'Check by Roll Number',
      text: 'Select the correct board, year and examination before entering your roll number. Where a validated Gazette dataset is active, the lookup searches only within that exact dataset.',
      ctaText: 'Check by Roll Number',
      ctaHref: '/#check-result',
      icon: SearchIcon,
      highlighted: true,
    },
    {
      id: 'gazette',
      num: '02',
      heading: 'Check from Gazette',
      text: 'A result Gazette contains examination records published or provided through an approved source. Where supported, Gazette data can be processed into a searchable result dataset.',
      ctaText: 'Browse Gazettes',
      ctaHref: '/gazette',
      icon: FileTextIcon,
      highlighted: false,
    },
    {
      id: 'official-website',
      num: '03',
      heading: 'Official Board Website',
      text: 'Where local lookup is unavailable, use the official board result portal or the verified result method listed on the relevant board page.',
      ctaText: 'Find Your Board',
      ctaHref: '/boards',
      icon: LandmarkIcon,
      highlighted: false,
    },
    {
      id: 'sms',
      num: '04',
      heading: 'Check by SMS',
      text: 'Some boards provide an SMS result service. SMS codes and formats can differ by board and examination cycle, so only show a code when it has been verified.',
      ctaText: 'Board-specific channel',
      ctaHref: '/#check-result',
      icon: MessageSquareIcon,
      highlighted: false,
    },
  ]

  return (
    <section
      id="result-methods"
      aria-labelledby="result-methods-heading"
      className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-[#F6FBF9] via-[#EFF8F4] to-[#F7FCFA] py-16 sm:py-20 lg:py-24"
    >
      {/* Ambient background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-80 w-80 rounded-full bg-[#34D399]/10 blur-3xl"
      />

      <div className="container-wide relative z-10">
        {/* Header with Eyebrow, Title, Intro & Document Art */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#007054]" />
              <span className="text-xs font-black tracking-widest text-[#007054] uppercase">
                RESULT METHODS
              </span>
            </div>

            {/* Heading */}
            <h2
              id="result-methods-heading"
              className="mt-3.5 text-3xl font-black tracking-tight text-[#0F1736] sm:text-4xl lg:text-[42px] lg:leading-[1.15]"
            >
              Ways to Check the 2nd Year Result 2026
            </h2>

            {/* Intro */}
            <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Different education boards provide different ways to access HSSC Part-II results.
              Roll-number search is usually the most precise method, while Gazettes and official
              board portals can provide useful alternatives.
            </p>
          </div>

          {/* Top-Right Floating Document & Mortarboard Graphic */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden shrink-0 select-none sm:block lg:mt-2"
          >
            <div className="relative flex h-28 w-44 rotate-3 items-center justify-center rounded-2xl border border-emerald-100/80 bg-white/90 p-3.5 shadow-sm">
              <div className="flex w-full items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F1] text-[#007054]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10v6" />
                    <path d="M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12.5v5c0 2 3 3.5 6 3.5s6-1.5 6-3.5v-5" />
                  </svg>
                </div>
                <div>
                  <span className="inline-block rounded-full bg-[#E8F6F1] px-2 py-0.5 text-[9px] font-black tracking-wide text-[#007054] uppercase">
                    2nd Year
                  </span>
                  <p className="text-[11px] font-bold text-slate-700">Results 2026</p>
                </div>
              </div>
              {/* Document subtle lines */}
              <div className="absolute right-4 bottom-3 left-4 space-y-1.5 opacity-30">
                <div className="h-1 w-full rounded-full bg-slate-300" />
                <div className="h-1 w-3/4 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Method Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {methods.map((method) => {
            const Icon = method.icon
            return (
              <div
                key={method.id}
                className={`group flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-6 ${
                  method.highlighted
                    ? 'border-2 border-emerald-300 ring-4 ring-emerald-500/5'
                    : 'border border-slate-200/70 hover:border-emerald-200'
                }`}
              >
                <div>
                  {/* Top Row: Icon Squircle + Number Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F6F1] text-[#007054] transition-colors group-hover:bg-[#007054] group-hover:text-white">
                      <Icon width={22} height={22} />
                    </div>
                    <span className="text-xs font-black text-emerald-900/30 sm:text-sm">
                      {method.num}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 sm:text-lg">
                    {method.heading}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                    {method.text}
                  </p>
                </div>

                {/* Bottom Row: CTA Text + Circular Arrow Button */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  {method.ctaHref ? (
                    <Link
                      href={method.ctaHref}
                      className="group/link flex w-full items-center justify-between text-xs font-bold text-[#007054] transition-colors hover:text-[#005a43]"
                    >
                      <span>{method.ctaText}</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F6F1] text-[#007054] transition-all group-hover/link:translate-x-0.5 group-hover/link:bg-[#007054] group-hover/link:text-white">
                        <ArrowRightIcon width={14} height={14} />
                      </div>
                    </Link>
                  ) : (
                    <div className="flex w-full items-center justify-between text-xs font-bold text-slate-500">
                      <span>{method.ctaText}</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <ChevronRightIcon width={14} height={14} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Callout Bar: Can I check the result by name? */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-xs sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-center gap-4">
            {/* Lightbulb Icon in Mint Squircle */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F1] text-[#007054]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            </div>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div>
              <h4 className="text-sm font-bold text-slate-900 sm:text-[15px]">
                Can I check the result by name?
              </h4>
              <p className="mt-0.5 text-xs text-slate-600 sm:text-[13px]">
                Name search is only appropriate where the board or Gazette legitimately supports it.
                Roll-number search is generally more precise because candidates may share similar
                names.
              </p>
            </div>
          </div>

          {/* Right Cursive: Good to know with bursts */}
          <div className="hidden shrink-0 pr-2 select-none sm:block">
            <div className="-rotate-6 text-right">
              <span
                className="text-base font-bold text-[#007054]/75 italic sm:text-lg"
                style={{ fontFamily: 'var(--font-caveat), cursive' }}
              >
                Good
                <br />
                to know
              </span>
              <svg
                width="20"
                height="10"
                viewBox="0 0 20 10"
                fill="none"
                className="mt-0.5 ml-auto text-[#007054]/50"
              >
                <path
                  d="M2 8L6 2M10 9L10 1M18 8L14 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

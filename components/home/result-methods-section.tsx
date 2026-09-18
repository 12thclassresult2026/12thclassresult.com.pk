import Link from 'next/link'

import {
  ArrowRightIcon,
  FileTextIcon,
  LandmarkIcon,
  MessageSquareIcon,
  SearchIcon,
} from '@/components/ui/icons'

export function ResultMethodsSection() {
  const methods = [
    {
      id: 'roll-number',
      heading: 'Check by Roll Number',
      text: 'Select the correct board, year and examination before entering your roll number. Where a validated Gazette dataset is active, the lookup searches only within that exact dataset.',
      ctaText: 'Check by Roll Number',
      ctaHref: '/#check-result',
      icon: SearchIcon,
    },
    {
      id: 'gazette',
      heading: 'Check from Gazette',
      text: 'A result Gazette contains examination records published or provided through an approved source. Where supported, Gazette data can be processed into a searchable result dataset.',
      ctaText: 'Browse Gazettes',
      ctaHref: '/#gazette',
      icon: FileTextIcon,
    },
    {
      id: 'official-website',
      heading: 'Official Board Website',
      text: 'Where local lookup is unavailable, use the official board result portal or the verified result method listed on the relevant board page.',
      ctaText: 'Find Your Board',
      ctaHref: '/boards',
      icon: LandmarkIcon,
    },
    {
      id: 'sms',
      heading: 'Check by SMS',
      text: 'Some boards provide an SMS result service. SMS codes and formats can differ by board and examination cycle, so only show a code when it has been verified.',
      ctaText: null,
      ctaHref: null,
      icon: MessageSquareIcon,
    },
  ]

  return (
    <section
      aria-labelledby="result-methods-heading"
      className="relative border-b border-slate-200/80 bg-white py-14 sm:py-18"
    >
      <div className="container-wide">
        <div className="mx-auto max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
            <span className="text-[11px] font-black tracking-widest text-[#007054] uppercase">
              RESULT METHODS
            </span>
          </div>

          {/* Heading */}
          <h2
            id="result-methods-heading"
            className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
          >
            Ways to Check the 2nd Year Result 2026
          </h2>

          {/* Intro */}
          <p className="mt-3.5 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Different education boards provide different ways to access HSSC Part-II results.
            Roll-number search is usually the most precise method, while Gazettes and official board
            portals can provide useful alternatives.
          </p>

          {/* 4 Compact Method Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {methods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-[#FAFCFB] p-5 shadow-2xs transition-all hover:border-emerald-300 hover:bg-white sm:p-5"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#007054]">
                      <Icon width={18} height={18} />
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-slate-900">
                      {method.heading}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{method.text}</p>
                  </div>

                  {method.ctaText && method.ctaHref ? (
                    <div className="mt-5 border-t border-slate-100 pt-3">
                      <Link
                        href={method.ctaHref}
                        className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-colors hover:text-[#005a43]"
                      >
                        <span>{method.ctaText}</span>
                        <ArrowRightIcon
                          width={13}
                          height={13}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-5 border-t border-slate-100 pt-3">
                      <span className="text-[11px] font-medium text-slate-500">
                        Board-specific channel
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Below cards: small text link/block */}
          <div className="mt-8 rounded-2xl border border-slate-200/80 bg-[#F8FAF9] p-4 sm:p-5">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
              <span className="shrink-0 text-xs font-black text-slate-900 sm:text-sm">
                Can I check the result by name?
              </span>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                Name search is only appropriate where the board or Gazette legitimately supports it.
                Roll-number search is generally more precise because candidates may share similar
                names.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

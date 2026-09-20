import Link from 'next/link'

/**
 * Premium Slim "Latest Result Update" Scrolling Ticker for 12th Class.
 * Seamless, hardware-accelerated infinite marquee with hover-pause.
 */
export function ResultUpdateTicker() {
  const dateFormatted = '22 October 2026'

  const tickerItem = (
    <div className="inline-flex items-center gap-2.5 text-xs font-medium text-slate-800 sm:text-[13px]">
      <span className="font-semibold text-slate-900">
        Punjab 12th Class (HSSC Part-II) Result 2026
      </span>
      <span className="font-bold text-slate-400" aria-hidden="true">
        ✦
      </span>
      <span className="text-slate-700">Tentative Date:</span>
      <Link
        href="/results/12th-class"
        className="inline-flex items-center rounded-sm bg-emerald-50 px-2 py-0.5 font-bold text-[#005B4C] ring-1 ring-emerald-300/70 transition-colors hover:bg-emerald-100 hover:text-[#00473B]"
      >
        {dateFormatted}
      </Link>
      <span className="font-bold text-emerald-500" aria-hidden="true">
        ✦
      </span>
      <span className="text-slate-600">
        Check board-wise result status,{' '}
        <Link
          href="/boards"
          className="font-semibold text-[#0069D9] underline-offset-2 hover:underline"
        >
          All Boards
        </Link>
        ,{' '}
        <Link
          href="/results/12th-class"
          className="font-semibold text-[#0069D9] underline-offset-2 hover:underline"
        >
          Roll Number
        </Link>{' '}
        &amp;{' '}
        <Link
          href="/#check-result"
          className="font-semibold text-[#0069D9] underline-offset-2 hover:underline"
        >
          SMS methods
        </Link>
        .
      </span>
      <span className="mx-4 font-bold text-slate-300" aria-hidden="true">
        ✦
      </span>
    </div>
  )

  return (
    <aside
      aria-label="Latest Result Update Ticker"
      className="relative z-10 border-b border-slate-200/90 bg-white/95 shadow-[0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-xs"
    >
      <div className="container-wide flex h-9 items-center overflow-hidden sm:h-10">
        {/* Fixed "LATEST UPDATE" Badge on Left */}
        <div className="relative z-20 flex shrink-0 items-center bg-gradient-to-r from-white via-white to-transparent pr-3 sm:pr-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#005B4C] via-[#006655] to-[#0069D9] px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-xs sm:px-3 sm:py-1 sm:text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            <span className="font-bold whitespace-nowrap">Latest Update</span>
          </div>
        </div>

        {/* Scrolling Track with Pause on Hover */}
        <div className="group relative flex-1 overflow-hidden">
          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-4 bg-gradient-to-r from-white to-transparent sm:w-8" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-12" />

          {/* Infinite smooth looping track (Track A + Track B for seamless translateX(-50%)) */}
          <div className="animate-ticker flex w-max items-center whitespace-nowrap">
            {/* Primary Track */}
            <div className="flex shrink-0 items-center">
              {tickerItem}
              {tickerItem}
            </div>
            {/* Duplicate Cloned Track for Perfect Seamless Loop */}
            <div className="flex shrink-0 items-center" aria-hidden="true">
              {tickerItem}
              {tickerItem}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

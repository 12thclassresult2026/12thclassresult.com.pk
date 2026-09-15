import Link from 'next/link'

/**
 * Premium Slim "Latest Result Update" Scrolling Ticker for 12th Class.
 */
export function ResultUpdateTicker() {
  const dateFormatted = '22 October 2026'

  const tickerMessage = (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-800 sm:text-[13px]">
      <span className="font-semibold text-slate-900">
        Punjab 12th Class (HSSC Part-II) Result 2026
      </span>
      <span className="text-slate-400">�</span>
      <span className="text-slate-700">Tentative Date: </span>
      <Link
        href="/results/12th-class"
        className="inline-flex items-center rounded-sm bg-emerald-50 px-2 py-0.5 font-bold text-[#005B4C] ring-1 ring-emerald-300/60 transition-colors hover:bg-emerald-100 hover:text-[#00473B]"
      >
        {dateFormatted}
      </Link>
      <span className="text-emerald-500">�</span>
      <span className="text-slate-600">
        Check board-wise result status,{' '}
        <Link
          href="/boards"
          className="font-medium text-[#0069D9] underline-offset-2 hover:underline"
        >
          All Boards
        </Link>
        ,{' '}
        <Link
          href="/results/12th-class"
          className="font-medium text-[#0069D9] underline-offset-2 hover:underline"
        >
          Roll Number
        </Link>{' '}
        &amp;{' '}
        <Link
          href="/#check-result"
          className="font-medium text-[#0069D9] underline-offset-2 hover:underline"
        >
          SMS methods
        </Link>
        .
      </span>
      <span className="mx-4 text-slate-300">�</span>
    </span>
  )

  return (
    <aside
      aria-label="Latest Result Update Ticker"
      className="relative z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs"
    >
      <div className="container-wide flex h-9 items-center overflow-hidden sm:h-10">
        {/* Fixed "LATEST UPDATE" Badge on Left */}
        <div className="relative z-10 flex shrink-0 items-center bg-gradient-to-r from-white via-white to-transparent pr-3 sm:pr-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#005B4C] to-[#0069D9] px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-xs sm:px-3 sm:text-[11px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="whitespace-nowrap">Latest Update</span>
          </div>
        </div>

        {/* Scrolling Track with Pause on Hover */}
        <div className="relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-4 bg-gradient-to-r from-white to-transparent sm:w-6" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-12" />

          <div className="animate-ticker flex items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
            <div className="flex shrink-0 items-center pr-6">{tickerMessage}</div>
            <div className="flex shrink-0 items-center pr-6">{tickerMessage}</div>
            <div className="flex shrink-0 items-center pr-6">{tickerMessage}</div>
            <div className="flex shrink-0 items-center pr-6">{tickerMessage}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

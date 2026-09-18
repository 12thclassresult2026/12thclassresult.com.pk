import type { Metadata } from 'next'
import Link from 'next/link'

import { BoardPortalsTable, type BoardPortalRow } from '@/components/result/board-portals-table'
import { JsonLdScript } from '@/components/seo/json-ld'
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  FileSearchIcon,
  FileTextIcon,
  LandmarkIcon,
  LockIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  UsersIcon,
  ZapIcon,
} from '@/components/ui/icons'
import { BOARDS } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import { capabilityLabel } from '@/lib/result/capability'
import { rollNumberSources } from '@/lib/result-sources/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('result-evergreen')

export const metadata: Metadata = metadataForPage(PAGE)

function MinarMonumentIllustration() {
  return (
    <div className="relative h-28 w-36 select-none sm:h-32 sm:w-40">
      <svg viewBox="0 0 160 120" fill="none" className="h-full w-full" aria-hidden="true">
        {/* Soft background clouds */}
        <path
          d="M20 50 Q 30 35, 45 42 Q 60 30, 75 42 Q 85 45, 90 55 Z"
          fill="#e0f2fe"
          opacity="0.6"
        />
        <path d="M90 40 Q 105 28, 120 35 Q 135 25, 150 38 Z" fill="#e0f2fe" opacity="0.5" />

        {/* Flying birds */}
        <path
          d="M35 25 Q 40 20, 45 25 Q 50 20, 55 25"
          stroke="#94a3b8"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M125 18 Q 128 14, 132 18 Q 136 14, 140 18"
          stroke="#94a3b8"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Grassy ground base */}
        <ellipse cx="80" cy="115" rx="75" ry="12" fill="#dcfce7" />
        <ellipse cx="80" cy="114" rx="60" ry="8" fill="#bbf7d0" />

        {/* Trees on sides */}
        <circle cx="28" cy="98" r="14" fill="#15803d" />
        <circle cx="40" cy="102" r="11" fill="#16a34a" />
        <circle cx="132" cy="98" r="14" fill="#15803d" />
        <circle cx="120" cy="102" r="11" fill="#16a34a" />

        {/* Minar-e-Pakistan Base Podium */}
        <polygon points="62,110 98,110 94,100 66,100" fill="#cbd5e1" />
        <polygon points="65,100 95,100 91,92 69,92" fill="#e2e8f0" />

        {/* Minar Tower Shaft */}
        <path d="M74 92 L77 26 L83 26 L86 92 Z" fill="url(#minar-grad)" />

        {/* Tower Balconies / Ribs */}
        <line x1="73" y1="72" x2="87" y2="72" stroke="#00473B" strokeWidth="2" />
        <line x1="75" y1="52" x2="85" y2="52" stroke="#00473B" strokeWidth="2" />
        <line x1="76" y1="36" x2="84" y2="36" stroke="#00473B" strokeWidth="2" />

        {/* Dome & Spire Pinnacle */}
        <path d="M77 26 Q 80 16, 83 26 Z" fill="#00473B" />
        <line
          x1="80"
          y1="16"
          x2="80"
          y2="6"
          stroke="#007054"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="80" cy="5" r="1.5" fill="#f59e0b" />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="minar-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#007054" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#00473B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function CurvedUnderline() {
  return (
    <svg
      width="55"
      height="12"
      viewBox="0 0 60 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="mt-0.5 text-emerald-600/70"
      aria-hidden="true"
    >
      <path d="M3 5 C 22 13, 42 13, 57 4" />
    </svg>
  )
}

function PhoneHandsetIcon({
  width = 22,
  height = 22,
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export default function TwelfthClassResultHub() {
  // Precompute row data for the 25 boards to match the mockup
  const tableRows: BoardPortalRow[] = BOARDS.map((board, i) => {
    const sources = rollNumberSources(board.id)
    const portal = sources[0]
    const rollNumberLookup = capabilityLabel(portal?.supportsRollNumber ?? 'unknown')
    const securityCheck = capabilityLabel(portal?.hasCaptcha ?? 'unknown')

    let status: 'Verified' | 'Available' | 'Not Verified' = 'Not Verified'
    if (portal) {
      if (rollNumberLookup === 'Yes' && securityCheck === 'Yes') {
        status = 'Verified'
      } else {
        status = 'Available'
      }
    }

    return {
      index: i + 1,
      id: board.id,
      name: board.officialName,
      shortName: board.shortName,
      portalUrl: portal?.url ?? null,
      portalName: portal?.name ?? null,
      rollNumberLookup,
      securityCheck,
      status,
    }
  })

  return (
    <>
      <JsonLdScript
        nodes={[
          webPageSchema({
            path: PAGE.path,
            name: PAGE.title,
            description: PAGE.description,
            dateModified: PAGE.contentUpdatedAt,
          }),
          breadcrumbSchema(PAGE.breadcrumb),
        ]}
      />

      <main className="container-wide py-6 sm:py-8">
        {/* Breadcrumb matching mockup */}
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-500">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-[#007054]">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">
              ›
            </li>
            <li className="font-semibold text-slate-700">12th Class Result</li>
          </ol>
        </nav>

        {/* Hero Section with Minar-e-Pakistan artwork */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl flex-1">
            <h1 className="text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[40px]">
              12th Class Result <span className="text-[#007054]">(HSSC Part-II)</span>
            </h1>

            <p className="mt-3.5 text-xs leading-relaxed text-slate-600 sm:text-sm md:text-[14.5px]">
              12th class, 2nd year, Intermediate Part-II and HSSC Part-II all name the same
              examination — the final year of Intermediate. Boards differ in which wording they
              print, so your result may appear under a heading you were not expecting.
            </p>
          </div>

          {/* Minar-e-Pakistan Monument with Trees, Clouds & Tilted Cursive Motto */}
          <div className="relative flex shrink-0 items-center justify-center self-center pr-2 select-none lg:self-center">
            <div className="relative flex items-center justify-center">
              <MinarMonumentIllustration />
              <div className="pointer-events-none absolute top-2 -right-2 hidden flex-col items-start sm:flex">
                <span
                  className="inline-block -rotate-12 text-sm leading-tight font-bold text-emerald-700/85 sm:text-base"
                  style={{ fontFamily: 'var(--font-caveat), cursive' }}
                >
                  Education
                  <br />
                  Builds a Stronger
                  <br />
                  Pakistan
                </span>
                <CurvedUnderline />
              </div>
            </div>
          </div>
        </div>

        {/* Top 4 Highlights / Stat Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: All Boards */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#007054] text-white shadow-xs">
              <LandmarkIcon width={22} height={22} />
            </div>
            <div>
              <span className="block text-xs font-bold tracking-wide text-slate-500 uppercase">
                All Boards
              </span>
              <span className="block text-2xl leading-tight font-black text-slate-900">25+</span>
              <span className="text-[11px] font-medium text-slate-500">Boards across Pakistan</span>
            </div>
          </div>

          {/* Card 2: Official Portals */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#007054] text-white shadow-xs">
              <ExternalLinkIcon width={22} height={22} />
            </div>
            <div>
              <span className="block text-xs font-bold tracking-wide text-slate-500 uppercase">
                Official Portals
              </span>
              <span className="block text-2xl leading-tight font-black text-slate-900">20+</span>
              <span className="text-[11px] font-medium text-slate-500">Direct result links</span>
            </div>
          </div>

          {/* Card 3: Roll Number Lookup */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#007054] text-white shadow-xs">
              <FileSearchIcon width={22} height={22} />
            </div>
            <div>
              <span className="block text-xs font-bold tracking-wide text-slate-500 uppercase">
                Roll Number
              </span>
              <span className="block text-xl leading-tight font-black text-slate-900 sm:text-2xl">
                Check Online
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Find your result by roll number
              </span>
            </div>
          </div>

          {/* Card 4: SMS / Gazette */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#007054] text-white shadow-xs">
              <MessageSquareIcon width={22} height={22} />
            </div>
            <div>
              <span className="block text-xs font-bold tracking-wide text-slate-500 uppercase">
                SMS / Gazette
              </span>
              <span className="block text-xl leading-tight font-black text-slate-900 sm:text-2xl">
                Also Available
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Check via SMS &amp; gazette
              </span>
            </div>
          </div>
        </div>

        {/* Main Table: Where to check, board by board (Interactive Filterable Table) */}
        <BoardPortalsTable rows={tableRows} />

        {/* Two Mid Feature Cards */}
        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Card 1: Checking by SMS */}
          <div className="rounded-3xl border border-emerald-100/90 bg-[#f4faf7] p-6 shadow-2xs sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#007054] text-white shadow-xs">
                <PhoneHandsetIcon width={22} height={22} />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">Checking by SMS</h2>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-[13.5px]">
              No SMS shortcode is listed on this site, because none could be found published on any
              board&apos;s own website. Codes circulating elsewhere contradict each other, and an
              SMS is charged — texting a wrong shortcode costs money and returns nothing. A code
              will be published here only with a link to the board page that prints it.
            </p>
          </div>

          {/* Card 2: After your result */}
          <div className="flex flex-col justify-between rounded-3xl border border-blue-100/90 bg-[#f0f7ff] p-6 shadow-2xs sm:p-7">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-xs">
                  <FileTextIcon width={22} height={22} />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  After your result
                </h2>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-[13.5px]">
                If your marks look wrong, the process you are looking for is{' '}
                <Link
                  href="/guides/rechecking"
                  className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
                >
                  rechecking
                </Link>
                . It is worth knowing before you pay that no board re-marks a paper; a recheck
                confirms the totals add up and were copied correctly, and nothing more.
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500 sm:text-xs">
                To turn your marks into a percentage, the rule is simply obtained ÷ total — see{' '}
                <Link
                  href="/guides/how-percentage-is-calculated"
                  className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
                >
                  how the percentage is calculated
                </Link>
                . The CGPA × 9.5 formula widely suggested is not applicable in Pakistan.
              </p>
            </div>

            <div className="mt-5">
              <Link
                href="/guides/rechecking"
                className="inline-flex items-center gap-2 rounded-xl bg-[#007054] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#005a43]"
              >
                <span>Learn About Rechecking</span>
                <ArrowRightIcon width={13} height={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Helpful Guides & Tools Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f6f0] text-[#007054]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Helpful Guides &amp; Tools
              </h2>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-[13px]">
            More resources to help you after the results are announced.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Guide 1: Rechecking */}
            <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-xs">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f6f0] text-[#007054]">
                  <FileTextIcon width={22} height={22} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-slate-900 sm:text-lg">
                  Rechecking Guide
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  Learn the rechecking process, rules and important deadlines.
                </p>
              </div>
              <div className="mt-5 pt-1">
                <Link
                  href="/guides/rechecking"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-all group-hover:gap-2 hover:underline"
                >
                  <span>Read Full Guide</span>
                  <ArrowRightIcon width={13} height={13} />
                </Link>
              </div>
            </div>

            {/* Guide 2: Percentage Calculator */}
            <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-xs">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f6f0] text-[#007054]">
                  <SmartphoneIcon width={22} height={22} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-slate-900 sm:text-lg">
                  Percentage Calculator
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  Easily calculate your total marks percentage for 12th class.
                </p>
              </div>
              <div className="mt-5 pt-1">
                <Link
                  href="/tools/percentage-calculator"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-all group-hover:gap-2 hover:underline"
                >
                  <span>Open Calculator</span>
                  <ArrowRightIcon width={13} height={13} />
                </Link>
              </div>
            </div>

            {/* Guide 3: Board Directory */}
            <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-xs">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f6f0] text-[#007054]">
                  <LandmarkIcon width={22} height={22} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-slate-900 sm:text-lg">
                  Board Directory
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  View official websites of all educational boards in Pakistan.
                </p>
              </div>
              <div className="mt-5 pt-1">
                <Link
                  href="/boards"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007054] transition-all group-hover:gap-2 hover:underline"
                >
                  <span>View All Boards</span>
                  <ArrowRightIcon width={13} height={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

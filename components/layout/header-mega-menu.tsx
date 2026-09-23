'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  BookOpenIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  GridIcon,
  LandmarkIcon,
  MessageSquareIcon,
  SearchIcon,
  UserIcon,
} from '@/components/ui/icons'
import { routedBoards } from '@/lib/board/registry'

interface BoardLink {
  name: string
  href: string
}

interface ProvinceData {
  id: string
  title: string
  subtitle: string
  iconBg: string
  iconColor: string
  boards: BoardLink[]
  allLink: string
  allLabel: string
}

const PROVINCES: ProvinceData[] = [
  {
    id: 'all',
    title: 'All Provinces',
    subtitle: 'View all education boards',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
    allLink: '/boards',
    allLabel: 'View All Pakistan Boards',
    boards: [
      { name: 'BISE Lahore', href: '/results/lahore-board/12th-class' },
      { name: 'BISE Karachi', href: '/results/karachi-board/12th-class' },
      { name: 'BISE Peshawar', href: '/results/peshawar-board/12th-class' },
      { name: 'BISE Rawalpindi', href: '/results/rawalpindi-board/12th-class' },
      { name: 'BISE Multan', href: '/results/multan-board/12th-class' },
      { name: 'BISE Quetta', href: '/results/quetta-board/12th-class' },
      { name: 'BISE Gujranwala', href: '/results/gujranwala-board/12th-class' },
      { name: 'BISE Hyderabad', href: '/results/hyderabad-board/12th-class' },
      { name: 'BISE Sargodha', href: '/results/sargodha-board/12th-class' },
      { name: 'BISE Mirpur AJK', href: '/results/mirpur-board/12th-class' },
    ],
  },
  {
    id: 'punjab',
    title: 'Punjab Boards',
    subtitle: 'All Punjab education boards',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-[#007054]',
    allLink: '/boards#punjab',
    allLabel: 'View All Punjab Boards',
    boards: [
      { name: 'BISE Lahore', href: '/results/lahore-board/12th-class' },
      { name: 'BISE Multan', href: '/results/multan-board/12th-class' },
      { name: 'BISE Faisalabad', href: '/results/faisalabad-board/12th-class' },
      { name: 'BISE Gujranwala', href: '/results/gujranwala-board/12th-class' },
      { name: 'BISE Rawalpindi', href: '/results/rawalpindi-board/12th-class' },
      { name: 'BISE Sargodha', href: '/results/sargodha-board/12th-class' },
      { name: 'BISE Bahawalpur', href: '/results/bahawalpur-board/12th-class' },
      { name: 'BISE Sahiwal', href: '/results/sahiwal-board/12th-class' },
      { name: 'BISE DG Khan', href: '/results/dg-khan-board/12th-class' },
    ],
  },
  {
    id: 'kpk',
    title: 'KPK Boards',
    subtitle: 'All KPK education boards',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    allLink: '/boards#khyber-pakhtunkhwa',
    allLabel: 'View All KPK Boards',
    boards: [
      { name: 'BISE Peshawar', href: '/results/peshawar-board/12th-class' },
      { name: 'BISE Mardan', href: '/results/mardan-board/12th-class' },
      { name: 'BISE Abbottabad', href: '/results/abbottabad-board/12th-class' },
      { name: 'BISE Swat', href: '/results/swat-board/12th-class' },
      { name: 'BISE Kohat', href: '/results/kohat-board/12th-class' },
      { name: 'BISE Bannu', href: '/results/bannu-board/12th-class' },
      { name: 'BISE Malakand', href: '/results/malakand-board/12th-class' },
      { name: 'BISE DI Khan', href: '/results/dera-ismail-khan-board/12th-class' },
    ],
  },
  {
    id: 'sindh',
    title: 'Sindh Boards',
    subtitle: 'All Sindh education boards',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    allLink: '/boards#sindh',
    allLabel: 'View All Sindh Boards',
    boards: [
      { name: 'BIEK Karachi', href: '/results/karachi-board/12th-class' },
      { name: 'BISE Hyderabad', href: '/results/hyderabad-board/12th-class' },
      { name: 'BISE Larkana', href: '/results/larkana-board/12th-class' },
      /*
        A NATIONAL PRIVATE BOARD, registered under Sindh because it is based in
        Karachi. It is listed here rather than left out: a candidate sitting
        AKU-EB has a page on this site, and a menu that hides it sends them to
        a BISE they do not belong to.
      */
      { name: 'AKU-EB', href: '/results/aku-eb/12th-class' },
    ],
  },
  {
    id: 'balochistan',
    title: 'Balochistan Board',
    subtitle: 'All Balochistan education boards',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-700',
    allLink: '/boards#balochistan',
    allLabel: 'View Balochistan Board',
    boards: [{ name: 'BISE Quetta', href: '/results/quetta-board/12th-class' }],
  },
  {
    id: 'federal',
    title: 'Federal Board',
    subtitle: 'FBISE Islamabad',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-800',
    allLink: '/boards#federal',
    allLabel: 'View Federal Board',
    boards: [],
  },
  {
    id: 'ajk',
    title: 'AJK Board',
    subtitle: 'Azad Jammu & Kashmir',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-700',
    allLink: '/boards#azad-jammu-kashmir',
    allLabel: 'View AJK Board',
    boards: [{ name: 'BISE Mirpur AJK', href: '/results/mirpur-board/12th-class' }],
  },
]

const QUICK_LINKS = [
  {
    title: '12th Result 2026',
    subtitle: 'Check result by roll number',
    href: '/results/12th-class',
    icon: SearchIcon,
    bgColor: 'bg-emerald-50 text-[#007054]',
  },
  {
    title: 'Date Schedule',
    subtitle: 'Board-wise tentative dates',
    href: '/results/12th-class',
    icon: CalendarIcon,
    bgColor: 'bg-amber-50 text-amber-700',
  },
  {
    title: 'Gazette',
    subtitle: 'Download official gazettes',
    href: '/gazette',
    icon: BookOpenIcon,
    bgColor: 'bg-blue-50 text-blue-700',
  },
  {
    title: 'SMS Codes',
    subtitle: 'Get result via SMS',
    href: '/#check-result',
    icon: MessageSquareIcon,
    bgColor: 'bg-cyan-50 text-cyan-700',
  },
  {
    title: 'Lost Your Roll Number?',
    subtitle: 'How to recover it from your board',
    href: '/#check-result',
    icon: UserIcon,
    bgColor: 'bg-emerald-50 text-emerald-800',
  },
  {
    title: 'Previous Year Results',
    subtitle: "View past years' results",
    href: '/boards',
    icon: ClockIcon,
    bgColor: 'bg-orange-50 text-orange-700',
  },
]

export function HeaderMegaMenu({
  onClose,
  initialProvince = 'punjab',
  showProvinceSwitcher = true,
}: {
  onClose: () => void
  initialProvince?: string
  /**
   * FALSE WHEN THE HEADER ITEM ALREADY NAMED THE REGION.
   *
   * "Punjab Boards" opening a menu whose first column offers Punjab, KPK,
   * Sindh, Balochistan and AJK asks the reader to choose something they just
   * chose, and pushes the boards they actually came for into a narrow middle
   * column. The switcher belongs to "All Boards", which is the item that has
   * not named a region.
   */
  showProvinceSwitcher?: boolean
}) {
  /*
   * A board appears in this menu only if it has a page.
   *
   * The lists above were hand-written and six of them pointed at boards that
   * are deliberately unpublished — faisalabad, federal, kohat, sukkur,
   * mirpurkhas and shaheed-benazirabad. That was twelve links to a 404 in the
   * site-wide navigation, on every page, for a reader and for a crawler alike.
   *
   * Filtering against the registry means a board can never be advertised here
   * before it earns a page, and appears automatically once it does.
   */
  const routedHrefs = useMemo(
    () => new Set(routedBoards().map((board) => `/results/${board.slug}/12th-class`)),
    [],
  )
  const provinces = useMemo(
    () =>
      PROVINCES.map((province) => ({
        ...province,
        boards: province.boards.filter((board) => routedHrefs.has(board.href.split('#')[0] ?? '')),
      })).filter((province) => province.boards.length > 0),
    [routedHrefs],
  )

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(initialProvince)

  /*
   * Follow the prop when the parent changes it, WITHOUT an effect.
   *
   * This was `useEffect(() => setSelectedProvinceId(initialProvince), [...])`,
   * which renders the menu once with the stale province, commits, then sets
   * state and renders again — a visible flash on open and a lint error
   * (react-hooks/set-state-in-effect).
   *
   * Adjusting state during render is the documented pattern for a value that
   * must track a prop while still being user-settable: React discards the
   * in-progress render and retries immediately, so the wrong province is never
   * committed to the DOM.
   */
  const [lastInitialProvince, setLastInitialProvince] = useState<string>(initialProvince)
  if (initialProvince !== lastInitialProvince) {
    setLastInitialProvince(initialProvince)
    setSelectedProvinceId(initialProvince)
  }

  const activeProvince = (provinces.find((p) => p.id === selectedProvinceId) ??
    provinces[0]) as ProvinceData

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-1/2 z-50 w-[96vw] max-w-6xl -translate-x-1/2 pt-1.5 transition-all"
    >
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/*
            Panel 1: the province switcher, shown only when the header item
            did NOT already name a region. See `showProvinceSwitcher`.
          */}
          {showProvinceSwitcher ? (
            <div className="space-y-1.5 border-slate-200/70 pr-2 lg:col-span-3 lg:border-r">
              {provinces.map((prov) => {
                const isSelected = prov.id === selectedProvinceId
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setSelectedProvinceId(prov.id)}
                    onMouseEnter={() => setSelectedProvinceId(prov.id)}
                    className={`flex w-full items-center justify-between rounded-2xl p-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-l-4 border-[#007054] bg-emerald-50 text-[#007054] shadow-xs'
                        : 'border-l-4 border-transparent text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${prov.iconBg} ${prov.iconColor}`}
                      >
                        {prov.id === 'all' ? (
                          <GridIcon width={16} height={16} />
                        ) : (
                          <LandmarkIcon width={16} height={16} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`block truncate text-xs font-bold ${
                            isSelected ? 'text-[#007054]' : 'text-slate-900'
                          }`}
                        >
                          {prov.title}
                        </span>
                        <span className="block truncate text-[10px] text-slate-500">
                          {prov.subtitle}
                        </span>
                      </div>
                    </div>

                    <ChevronRightIcon
                      width={14}
                      height={14}
                      className={`shrink-0 ${isSelected ? 'text-[#007054]' : 'text-slate-400'}`}
                    />
                  </button>
                )
              })}
            </div>
          ) : null}

          {/*
            Panel 2: the boards themselves. It takes the switcher’s three
            columns when there is no switcher, so a region opened by name gets
            a wide grid instead of the narrow one it used to share.
          */}
          <div
            className={`flex flex-col justify-between border-slate-200/70 pr-2 lg:border-r ${
              showProvinceSwitcher ? 'lg:col-span-4' : 'lg:col-span-7'
            }`}
          >
            <div>
              {/* Province Header */}
              <div className="mb-3.5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100/80 text-[#007054]">
                  <LandmarkIcon width={17} height={17} />
                </div>
                <div>
                  <h4 className="text-sm leading-none font-extrabold text-slate-900">
                    {activeProvince.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Select your board to view result, date, gazette and more.
                  </p>
                </div>
              </div>

              {/* 2-Column Grid of Boards */}
              <div className="grid grid-cols-2 gap-2">
                {activeProvince.boards.map((b) => (
                  <Link
                    key={b.name}
                    href={b.href}
                    onClick={onClose}
                    className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-2.5 text-xs font-bold text-slate-800 shadow-2xs transition-all hover:border-emerald-300 hover:bg-slate-50 hover:text-[#007054]"
                  >
                    <span className="truncate">{b.name}</span>
                    <ChevronRightIcon
                      width={12}
                      height={12}
                      className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#007054]"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom View All Button */}
            <div className="mt-4 pt-2">
              <Link
                href={activeProvince.allLink}
                onClick={onClose}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 py-2.5 text-xs font-bold text-[#007054] transition-all hover:bg-emerald-100 hover:shadow-xs"
              >
                <span>{activeProvince.allLabel}</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* -- Panel 3: Quick Links List (Cols 8-10) -- */}
          <div className="flex flex-col justify-between border-slate-200/70 pr-2 lg:col-span-3 lg:border-r">
            <div>
              {/* Header */}
              <div className="mb-3.5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100/80 text-[#007054]">
                  <GridIcon width={16} height={16} />
                </div>
                <div>
                  <h4 className="text-sm leading-none font-extrabold text-slate-900">
                    Quick Links
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Access important sections quickly.
                  </p>
                </div>
              </div>

              {/* 6 Quick Link Rows */}
              <div className="space-y-2">
                {QUICK_LINKS.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-xl p-2 transition-all hover:bg-slate-50"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bgColor}`}
                        >
                          <Icon width={15} height={15} />
                        </div>
                        <div className="min-w-0 text-left">
                          <span className="block truncate text-xs font-bold text-slate-800 transition-colors group-hover:text-[#007054]">
                            {item.title}
                          </span>
                          <span className="block truncate text-[10px] text-slate-500">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <ChevronRightIcon
                        width={13}
                        height={13}
                        className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#007054]"
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* -- Panel 4: Right Promotion Feature Card (Cols 11-12) -- */}
          <div className="flex flex-col items-center justify-between rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-[#EBF6F2] via-[#E6F3EE] to-[#DCEDE7] p-4 text-center lg:col-span-2">
            {/* Top Illustration: Books & Graduation Cap */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/40 shadow-inner">
              <Image
                src="/images/faq-books.jpg"
                alt="Higher Education Pakistan"
                fill
                sizes="(max-width: 768px) 100vw, 180px"
                className="rounded-xl object-cover"
              />
            </div>

            {/* Middle Message */}
            <div className="mt-3">
              <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                Higher Education
              </span>
              <h5 className="mt-0.5 text-xs font-black tracking-tight text-[#005B44]">
                A Brighter Pakistan
              </h5>
              <div className="mx-auto mt-1.5 h-0.5 w-8 rounded-full bg-[#007054]" />

              <p className="mt-2 text-[10.5px] leading-snug text-slate-600 italic">
                &ldquo;Education today,
                <br />a stronger tomorrow.&rdquo;
              </p>
            </div>

            {/* Bottom Button */}
            <div className="mt-3.5 w-full">
              <Link
                href="/#check-result"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#007054] py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#005842] active:scale-95"
              >
                <span>Check Your Result</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

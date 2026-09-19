'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'

import { ChevronRightIcon, MenuIcon, XIcon } from '@/components/ui/icons'
import { routedBoards } from '@/lib/board/registry'

/**
 * The navigation a phone actually gets.
 *
 * WHY THIS EXISTS. The primary nav was `hidden ... lg:flex` — invisible below
 * 1024px — and nothing replaced it. On every phone and most tablets the header
 * offered one button, "Check Result", and no route to /boards, the result hub,
 * the guides or the trust pages at all.
 *
 * That is not a cosmetic gap. Most of this site's audience is on a phone, and
 * Google indexes mobile-first: a header that renders no internal links on a
 * small screen is a header that passes none.
 *
 * Board links come from `routedBoards()`, so an unpublished board can never be
 * advertised here — the same rule the mega menu and footer now follow after a
 * hand-written list sent twelve links to 404s.
 */

const SECTIONS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Results',
    links: [
      { label: '12th Class Result 2026', href: '/results/12th-class' },
      { label: 'Check your result', href: '/#check-result' },
      { label: 'Gazette lookup', href: '/#gazette' },
    ],
  },
  {
    title: 'Boards',
    links: [{ label: 'All Pakistan boards', href: '/boards' }],
  },
  {
    title: 'Guides & tools',
    links: [
      { label: 'Rechecking', href: '/guides/rechecking' },
      { label: 'How percentage is calculated', href: '/guides/how-percentage-is-calculated' },
      { label: 'Percentage calculator', href: '/tools/percentage-calculator' },
    ],
  },
  {
    title: 'Trust & info',
    links: [
      { label: 'How we verify', href: '/methodology' },
      { label: 'About', href: '/about' },
      { label: 'FAQs', href: '/#faq-section' },
    ],
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  /*
   * Escape closes, and focus returns to the button that opened it. Without the
   * second half a keyboard or screen-reader user is dropped at the top of the
   * document every time they dismiss the menu.
   */
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // The panel covers the page; letting the body scroll underneath it is the
  // commonest mobile-menu bug.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const boards = routedBoards()

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#007054] hover:text-[#007054] active:scale-95 lg:hidden"
      >
        {open ? <XIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
      </button>

      {open ? (
        <div
          id={panelId}
          className="fixed inset-x-0 top-0 bottom-0 z-50 overflow-y-auto bg-white lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <span className="text-sm font-black text-slate-900">Menu</span>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
              }}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 active:scale-95"
            >
              <XIcon width={20} height={20} />
            </button>
          </div>

          <nav aria-label="Mobile" className="px-4 py-4">
            <Link
              href="/#check-result"
              onClick={() => setOpen(false)}
              className="mb-5 flex items-center justify-center gap-1.5 rounded-xl bg-[#005B4C] px-4 py-3 text-sm font-bold text-white active:scale-95"
            >
              Check Result <span aria-hidden="true">&rarr;</span>
            </Link>

            {SECTIONS.map((section) => (
              <div key={section.title} className="mb-5">
                <h2 className="mb-1.5 text-[11px] font-black tracking-wider text-slate-400 uppercase">
                  {section.title}
                </h2>
                <ul>
                  {section.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between border-b border-slate-100 py-3 text-sm font-semibold text-slate-800 active:text-[#007054]"
                      >
                        {link.label}
                        <ChevronRightIcon width={15} height={15} className="text-slate-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="mb-8">
              <h2 className="mb-1.5 text-[11px] font-black tracking-wider text-slate-400 uppercase">
                Board pages ({boards.length})
              </h2>
              <ul className="grid grid-cols-2 gap-x-3">
                {boards.map((board) => (
                  <li key={board.id}>
                    <Link
                      href={`/results/${board.slug}/12th-class`}
                      onClick={() => setOpen(false)}
                      className="block border-b border-slate-100 py-2.5 text-[13px] font-medium text-slate-700 active:text-[#007054]"
                    >
                      {board.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}

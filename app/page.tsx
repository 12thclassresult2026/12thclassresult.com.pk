import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'

import type { BoardOption } from '@/components/result/board-finder'
import type { FaqItem } from '@/components/ui/faq-accordion'

import { BoardFinder } from '@/components/result/board-finder'
import { JsonLdScript } from '@/components/seo/json-ld'
import { FaqAccordion } from '@/components/ui/faq-accordion'
import { BOARDS, routedBoards } from '@/lib/board/registry'
import { ACCESS_MODEL_LABELS, PROVINCE_LABELS } from '@/lib/board/types'
import { boardsInRegion, nationalRegions } from '@/lib/gazettes/coverage'
import { boardsWithObservedResultPortal } from '@/lib/result-sources/registry'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'

const PAGE = requirePage('home')

export const metadata: Metadata = metadataForPage(PAGE)

/**
 * The four steps. Written as what a reader actually has to do, which is why
 * step 2 is "read what your board's route is" rather than "enter your roll
 * number" — for a gazette-only board there is no roll number to enter, and a
 * generic four-step graphic is exactly how the rest of this market gets a fifth
 * of the country wrong.
 */
const STEPS: { title: string; body: string }[] = [
  {
    title: 'Find your board',
    body: 'Your result is published by the board you sat the examination under, and only by that board. Pick it above, or open the directory.',
  },
  {
    title: 'Check what its route is',
    body: 'Not every board has a roll-number portal. Some publish a gazette instead, and some show one examination session at a time. Your board’s page says which.',
  },
  {
    title: 'See what has been announced',
    body: 'Every board page states whether a result has actually been declared, and the date that was last checked against the board’s own website.',
  },
  {
    title: 'Go to the official source',
    body: 'The link out goes to the board’s own portal. Nothing on this site is a result checker, and no result is stored here.',
  },
]

/** Same array feeds the accordion and the FAQ schema, so they cannot drift. */
const FAQS: FaqItem[] = [
  {
    question: 'When will the 12th class result 2026 be announced?',
    answer:
      'No board has published an HSSC Part-II 2026 result date at the time of the last check. Dates circulating elsewhere for this session could not be traced to any board notification, so they are not repeated here. When a board issues one, it appears on that board’s page with a link to the notification and the date it was checked.',
  },
  {
    question: 'Can I check my result on this site?',
    answer:
      'No, and no site can. No education board in Pakistan publishes a result API or permits automated lookup, so every "result checker" in this market is really a link to the board’s own portal. This one says so, and sends you to the official source with the information you need before you get there.',
  },
  {
    question: 'Why does my board have no roll number box?',
    answer:
      'Because it does not have one. Karachi, Hyderabad, Sukkur, Larkana and several others publish the result as a gazette rather than through a roll-number form. Showing a roll-number box for those boards would be an instruction you cannot follow.',
  },
  {
    question: 'What is HSSC Part-II, and is it the same as 12th class?',
    answer:
      'Yes. HSSC Part-II, Second Year, Intermediate Part-II and 12th class all name the same examination. Boards use different wording for it, and each board page shows the wording that board’s own portal uses, so you can recognise the screen in front of you.',
  },
  {
    question: 'Is this an education board or an official site?',
    answer:
      'No. This is an independent information service, not a board, and not affiliated with any board. Every board’s own official website is linked so that anything you read here can be confirmed at its source.',
  },
]

export default function HomePage() {
  /*
   * Derived from the source registry, not from a string match on source ids.
   * The sentence below claims a portal was "confirmed by loading it", so the
   * count must actually mean that: official, a result source rather than a
   * homepage, and genuinely fetched.
   */
  const verifiedPortalCount = boardsWithObservedResultPortal().length
  const routed = new Set(routedBoards().map((board) => board.slug))
  const regions = nationalRegions()

  const boardOptions: BoardOption[] = BOARDS.map((board) => ({
    slug: board.slug,
    shortName: board.shortName,
    region: PROVINCE_LABELS[board.province],
    hasPage: routed.has(board.slug),
  }))

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
          faqSchema(FAQS),
        ]}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="on-dark relative overflow-hidden bg-[var(--surface-hero)] py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 z-0 select-none">
          <Image
            src="/images/hero-bg-campus.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1533]/95 via-[#0b1533]/85 to-[#0b1533]/90" />
        </div>
        <div className="container-wide relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-accent-300 text-xs font-semibold tracking-[0.08em] uppercase">
              HSSC Part-II · Second Year · Intermediate Part-II
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {PAGE.h1}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[var(--text-on-dark-muted)]">
              Your result is published by your education board, not by us. This site tells you which
              board portal actually serves the HSSC Part-II result, what it will ask you for, and
              what has genuinely been announced.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/results/12th-class"
                className="bg-accent-600 hover:bg-accent-700 inline-flex min-h-12 items-center rounded-[var(--radius-button)] px-6 text-sm font-semibold text-white transition-colors"
              >
                Check your result
              </Link>
              <Link
                href="/boards"
                className="hover:bg-primary-800 inline-flex min-h-12 items-center rounded-[var(--radius-button)] border border-[var(--border-on-dark)] px-6 text-sm font-semibold text-white transition-colors"
              >
                Find your board
              </Link>
            </div>

            {/* Real counts, all three derived from the registry. */}
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--border-on-dark)] pt-6">
              {[
                { value: BOARDS.length, label: 'Boards registered' },
                { value: regions.length, label: 'Regions covered' },
                { value: verifiedPortalCount, label: 'Portals confirmed' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-2xl font-bold text-white sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs text-[var(--text-on-dark-muted)]">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <BoardFinder boards={boardOptions} />
        </div>
      </section>

      {/*
        ── THE STATUS STRIP ───────────────────────────────────────────────
        The sibling site puts a scrolling "Tentative Date: 23 September 2026"
        banner in this slot. The equivalent here states what is true, in the
        same position and with the same weight, because it is the one thing
        every visitor arrives wanting and the one thing no rival gets right:
        the live search results carry three different dates for the same Punjab
        result and not one cites a board notification.
      */}
      <section className="border-y border-[var(--border-card)] bg-[var(--color-status-unknown-bg)]">
        <div className="container-wide py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <span className="text-primary-800 bg-primary-100 inline-flex w-fit shrink-0 items-center rounded-[var(--radius-badge)] px-2.5 py-1 text-xs font-semibold tracking-wide uppercase">
              Latest update
            </span>
            <p className="text-sm font-semibold text-[var(--text-strong)]">
              No HSSC Part-II 2026 result date has been confirmed by any board we track.
            </p>
          </div>
          <p className="mt-3 max-w-4xl text-sm text-[var(--text-body)]">
            Checked on 14 September 2026 against the boards’ own websites. Dates circulating
            elsewhere for this session are not carried here, because none of them could be traced to
            a board notification. When a board publishes one, it will appear here with a link to the
            notification itself and the date it was checked.{' '}
            <Link
              href="/methodology"
              className="text-primary-700 font-semibold underline underline-offset-4"
            >
              How we verify
            </Link>
          </p>
        </div>
      </section>

      {/* ── FOUR STEPS ───────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="container-wide">
          <p className="eyebrow">Step by step</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            How to check your 12th class result
          </h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
              >
                <span
                  aria-hidden="true"
                  className="text-accent-600 block text-2xl font-bold tabular-nums"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-semibold text-[var(--text-strong)]">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-body)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/*
        ── EVERY BOARD, GROUPED BY REGION ─────────────────────────────────
        ONE listing, not two. The first draft of this redesign had a full
        28-row table AND a 28-card regional grid below it, which put every
        board on the page twice and ran the mobile page to 11,689px. Grouping
        the table by region gets both jobs done once: the regional structure
        that makes the site visibly national, and the model columns that are
        the actual differentiator.
      */}
      <section className="bg-[var(--surface-sunken)] py-14">
        <div className="container-wide">
          <p className="eyebrow">Every board</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            How each board publishes its result
          </h2>
          <p className="mt-3 max-w-3xl text-[var(--text-body)]">
            There is not one board model in Pakistan, there are four. A board that publishes a
            gazette has no roll-number portal to send you to, and a board that serves one session at
            a time can quietly show you the wrong class. That column is the difference — and it is
            the one thing the rest of this market gets wrong about roughly a fifth of the country.
          </p>
          <p className="mt-3 max-w-3xl text-sm text-[var(--text-muted)]">
            {BOARDS.length} boards in {regions.length} regions are registered, {verifiedPortalCount}{' '}
            with an official result portal confirmed by loading it. A board links only where its
            page actually serves; the rest are named rather than hidden, so a reader looking for
            Sukkur can see that we know it exists and have not yet verified enough to publish.
          </p>

          <div className="table-responsive-wrapper mt-8 rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface)]">
            <table className="w-full min-w-[48rem] text-sm">
              <caption className="sr-only">
                Every registered education board, grouped by region, showing how it publishes the
                HSSC Part-II result, whether it declares groups together, and a link to its page
                where one exists
              </caption>
              <thead>
                <tr className="border-b border-[var(--border-card)] text-left">
                  <th scope="col" className="px-4 py-3 font-semibold text-[var(--text-strong)]">
                    Board
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-[var(--text-strong)]">
                    How the result is published
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-[var(--text-strong)]">
                    Declares
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-[var(--text-strong)]">
                    Page
                  </th>
                </tr>
              </thead>
              {regions.map((province) => (
                <tbody key={province} className="divide-y divide-[var(--border-subtle)]">
                  {/*
                    A region header row rather than a Region column. It repeats
                    the province once per group instead of 28 times, and gives
                    the table the scannable rhythm the card grid was there for.
                  */}
                  <tr className="bg-[var(--surface-sunken)]">
                    <th
                      scope="rowgroup"
                      colSpan={4}
                      className="px-4 py-2.5 text-left text-xs font-semibold tracking-[0.08em] text-[var(--text-muted)] uppercase"
                    >
                      {PROVINCE_LABELS[province]}
                    </th>
                  </tr>
                  {boardsInRegion(province).map((board) => {
                    const hasPage = routed.has(board.slug)
                    return (
                      <tr key={board.id}>
                        <th
                          scope="row"
                          className="px-4 py-3 text-left font-semibold text-[var(--text-strong)]"
                        >
                          {board.shortName}
                          <span className="mt-0.5 block text-xs font-normal text-[var(--text-muted)]">
                            {board.officialName}
                          </span>
                        </th>
                        <td className="px-4 py-3">
                          <span className="text-primary-700 bg-primary-50 inline-flex rounded-[var(--radius-badge)] px-2 py-0.5 text-xs font-medium">
                            {ACCESS_MODEL_LABELS[board.accessModel]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-body)]">
                          {board.declarationModel === 'per-group'
                            ? 'Each group separately'
                            : board.declarationModel === 'whole-board'
                              ? 'All groups together'
                              : 'Not verified'}
                        </td>
                        <td className="px-4 py-3">
                          {hasPage ? (
                            <Link
                              href={`/results/${board.slug}/12th-class`}
                              className="text-primary-700 font-semibold whitespace-nowrap underline underline-offset-4"
                            >
                              Open
                            </Link>
                          ) : (
                            <span className="whitespace-nowrap text-[var(--text-muted)]">
                              Not yet published
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              ))}
            </table>
          </div>

          <p className="mt-6">
            <Link
              href="/boards"
              className="text-primary-700 text-sm font-semibold underline underline-offset-4"
            >
              See every board and its official portal
            </Link>
          </p>
        </div>
      </section>

      {/* ── GUIDES & TOOLS ───────────────────────────────────────────────── */}
      <section className="bg-[var(--surface-sunken)] py-14">
        <div className="container-wide">
          <p className="eyebrow">After the result</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Guides and tools</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: '/tools/percentage-calculator',
                title: 'Percentage calculator',
                body: 'Work out your percentage from your marks. It runs in your browser and nothing you type is sent anywhere.',
              },
              {
                href: '/guides/how-percentage-is-calculated',
                title: 'How percentage is calculated',
                body: 'What the total actually is, why Part-I and Part-II are added together, and where the common mistakes come from.',
              },
              {
                href: '/guides/rechecking',
                title: 'Rechecking, and what it is not',
                body: 'Rechecking does not mean your paper is marked again. What boards actually do, what it costs, and the deadline.',
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="hover:border-primary-300 group block rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]"
              >
                <h3 className="group-hover:text-primary-800 font-semibold text-[var(--text-strong)]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-body)]">{card.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="container-wide max-w-4xl">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-8">
            <FaqAccordion items={FAQS} headingId="faq-heading" />
          </div>
        </div>
      </section>
    </>
  )
}

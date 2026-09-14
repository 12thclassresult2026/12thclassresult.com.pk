import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLdScript } from '@/components/seo/json-ld'
import { getBoardById } from '@/lib/board/registry'
import { requirePage } from '@/lib/content/registry'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema/json-ld'
import { metadataForPage } from '@/lib/seo/metadata'
import {
  BOARD_RECHECKING,
  NOT_RE_MARKING_QUOTE,
  RECHECKING_CHECKPOINTS,
  boardsWithFeeConflicts,
  hasAnyHsscFee,
} from '@/lib/rechecking/registry'
import {
  FEE_OBSERVED_LABELS,
  RECHECKING_MODE_LABELS,
  type BoardRechecking,
} from '@/lib/rechecking/types'

const PAGE = requirePage('guide-rechecking')

export const metadata: Metadata = metadataForPage(PAGE)

function rupees(amount: number): string {
  return `Rs ${amount.toLocaleString('en-PK')}`
}

function boardName(boardId: string): string {
  return getBoardById(boardId)?.shortName ?? boardId
}

export default function RecheckingGuidePage() {
  const conflicted = boardsWithFeeConflicts()
  const hsscFeePublished = hasAnyHsscFee()

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

      <div className="container-wide py-8">
        <Breadcrumbs trail={PAGE.breadcrumb} />

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{PAGE.h1}</h1>

        {/*
          THE DIRECT ANSWER, FIRST.

          This is the single most consequential misunderstanding in the topic: a
          candidate who pays Rs 1,300 expecting their paper to be marked again
          has bought something else entirely. Every board that publishes rules
          at all says this, and no competitor leads with it.
        */}
        <div className="mt-6 max-w-3xl rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--color-status-unknown-bg)] p-6">
          <p className="font-semibold text-[var(--text-strong)]">
            Rechecking does not mean your paper is marked again.
          </p>
          <p className="mt-3 text-[var(--text-body)]">
            It is an arithmetic and completeness check: that nothing was left unmarked, that the
            totals add up, and that they were copied correctly onto your result card. Your answers
            are not re-assessed and your grade is not reconsidered.
          </p>
          <blockquote className="mt-4 border-l-2 border-[var(--border-card)] pl-4 text-sm text-[var(--text-body)] italic">
            “{NOT_RE_MARKING_QUOTE.text}”
            <footer className="mt-2 text-xs text-[var(--text-muted)] not-italic">
              {NOT_RE_MARKING_QUOTE.attributedTo}, attributing the rule to{' '}
              {NOT_RE_MARKING_QUOTE.basis}.
            </footer>
          </blockquote>
        </div>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">What a recheck actually verifies</h2>
          <p className="mt-3 text-[var(--text-body)]">
            Where a board publishes its rules, the list is the same and it is short. A recheck
            confirms four things:
          </p>
          <ol className="mt-4 space-y-3">
            {RECHECKING_CHECKPOINTS.map((checkpoint, index) => (
              <li key={checkpoint.claim} className="flex gap-3 text-[var(--text-body)]">
                <span
                  aria-hidden="true"
                  className="bg-primary-700 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                >
                  {index + 1}
                </span>
                <span>{checkpoint.claim}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Published by BISE Rawalpindi and in Rule 11 of BISE Gujranwala’s regulations. Boards
            that publish nothing are not listed here as agreeing.
          </p>
        </section>

        {/*
          THE CAVEAT THAT MAKES THIS PAGE HONEST.

          Every figure below was read from an SSC portal or an undated rulebook,
          because no board has deployed an HSSC Part-II rechecking route. The
          condition is computed from the data, so if a board ever publishes an
          HSSC fee this block stops rendering rather than going stale.
        */}
        {!hsscFeePublished ? (
          <section className="mt-10 max-w-3xl">
            <div className="rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface-sunken)] p-6">
              <h2 className="text-xl font-bold tracking-tight">
                No board has published a 12th class rechecking fee
              </h2>
              <p className="mt-3 text-[var(--text-body)]">
                Every figure on this page was read from a board’s matric (SSC) rechecking route or
                from an undated rulebook. Checked on 14 September 2026, not one board had a working
                HSSC Part-II rechecking page:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-body)]">
                <li>
                  Gujranwala’s portal offers 10th Annual, while its 11th and 12th options are
                  commented out of the page’s own HTML.
                </li>
                <li>Lahore’s HSSC rechecking subdomain returns a 404.</li>
                <li>Rawalpindi’s portal was serving 9th class.</li>
              </ul>
              <p className="mt-4 text-[var(--text-body)]">
                So treat these as the best available indication of scale, not as the price you will
                pay. Anywhere quoting a confident “HSSC rechecking fee” for this session is not
                reading it from a board.
              </p>
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">
            What each board publishes, board by board
          </h2>
          <p className="mt-3 max-w-3xl text-[var(--text-body)]">
            Six boards publish enough to report. The rest publish nothing at this level, and are
            left out rather than filled in from a neighbouring board — Punjab boards share an
            examination calendar, not a fee schedule.
          </p>

          <div className="table-responsive-wrapper mt-6">
            <table className="w-full min-w-[52rem] border-collapse text-sm">
              <caption className="sr-only">
                Published rechecking fees, deadlines and process by board
              </caption>
              <thead>
                <tr className="border-b border-[var(--border-card)] text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Board
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Published fee
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Read from
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Deadline
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    How you apply
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Refund if an error is found
                  </th>
                </tr>
              </thead>
              <tbody>
                {BOARD_RECHECKING.map((entry) => (
                  <BoardRow key={entry.boardId} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-sm text-[var(--text-muted)]">
            “Not published” means the board does not state it — not that the answer is no. Where a
            board is silent on refunds or on re-marking, nothing is claimed in either direction.
          </p>
        </section>

        {conflicted.length > 0 ? (
          <section className="mt-10 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight">
              Where a board’s own sources disagree
            </h2>
            {conflicted.map((entry) => (
              <div key={entry.boardId} className="mt-4">
                <p className="text-[var(--text-body)]">
                  <strong>{boardName(entry.boardId)}</strong> publishes {entry.fees.length}{' '}
                  different rechecking fees. All {entry.fees.length} are genuine board sources, so
                  none of them is simply wrong:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-body)]">
                  {entry.fees.map((fee) => (
                    <li key={`${fee.amount}-${fee.readFrom}`}>
                      <strong>{rupees(fee.amount)}</strong>
                      {fee.formFee ? ` + ${rupees(fee.formFee)} form fee` : ''} — from{' '}
                      {fee.readFrom}.{fee.note ? ` ${fee.note}` : ''}
                    </li>
                  ))}
                </ul>
                {/*
                  Shown, not silently resolved. Picking one and presenting it as
                  the answer would be inventing a figure the board has not given.
                */}
                <p className="mt-3 text-sm text-[var(--text-muted)]">
                  The live portal is what actually charges you, so that is the figure to budget for.
                  The discrepancy is shown rather than resolved, because resolving it would mean
                  overruling one of the board’s own documents.
                </p>
              </div>
            ))}
          </section>
        ) : null}

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Things worth knowing before you pay</h2>
          <dl className="mt-4 space-y-5">
            <div>
              <dt className="font-semibold text-[var(--text-strong)]">
                The deadline runs from the result, not from when you see it
              </dt>
              <dd className="mt-1 text-[var(--text-body)]">
                Where a deadline is published it is 15 days from the declaration of the result. At
                DG Khan there is no online route at all, so the form has to be delivered manually
                inside that window.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--text-strong)]">
                An online form is not always the whole application
              </dt>
              <dd className="mt-1 text-[var(--text-body)]">
                Rawalpindi’s process is hybrid: an online form, a bank challan, and a printed hard
                copy delivered by hand or by post. Sahiwal also requires a posted hard copy.
                Stopping after the online step means no application has been made.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--text-strong)]">
                You may be able to see your answer book — in person, yourself
              </dt>
              <dd className="mt-1 text-[var(--text-body)]">
                Gujranwala’s Rule 11 entitles a candidate to see the answer book in the presence of
                an authorised board officer. Rawalpindi, Sahiwal and DG Khan all record that only
                the candidate personally may view the script — not a parent, and not an agent.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--text-strong)]">
                If your script has been lost
              </dt>
              <dd className="mt-1 text-[var(--text-body)]">
                Sahiwal and DG Khan both publish the same remedy: the candidate receives either the
                marks from the award list or a re-sit of that paper.
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Where this came from</h2>
          <p className="mt-3 text-[var(--text-body)]">
            Every figure above was read from a board’s own portal, fee table or published
            regulations on 14 September 2026. Nothing here is taken from another result site.
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {BOARD_RECHECKING.map((entry) => (
              <li key={entry.boardId}>
                <a
                  href={entry.sourceUrl}
                  rel="noopener nofollow"
                  className="text-primary-700 font-medium underline underline-offset-4"
                >
                  {boardName(entry.boardId)} — {entry.boardTerm.toLowerCase()} source
                </a>
                <p className="mt-1 text-[var(--text-muted)]">{entry.provenanceNote}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10">
          <Link
            href="/results/12th-class"
            className="text-primary-700 text-sm font-semibold underline underline-offset-4"
          >
            Back to the 12th class result hub
          </Link>
        </p>
      </div>
    </>
  )
}

function BoardRow({ entry }: { entry: BoardRechecking }) {
  // The figure a student actually pays is the first listed, which is the live
  // portal wherever one exists.
  const headline = entry.fees[0]

  return (
    <tr className="border-b border-[var(--border-subtle)] align-top">
      <th scope="row" className="py-3 pr-4 text-left font-medium">
        {boardName(entry.boardId)}
        {entry.boardTerm !== 'Rechecking' ? (
          <span className="block text-xs font-normal text-[var(--text-muted)]">
            calls it “{entry.boardTerm}”
          </span>
        ) : null}
      </th>
      <td className="py-3 pr-4">
        {headline ? (
          <>
            {rupees(headline.amount)}
            {headline.formFee ? ` + ${rupees(headline.formFee)}` : ''}
            {entry.fees.length > 1 ? (
              <span className="block text-xs text-[var(--text-muted)]">
                and {entry.fees.length - 1} other official figures
              </span>
            ) : null}
          </>
        ) : (
          'Not published'
        )}
      </td>
      <td className="py-3 pr-4 text-[var(--text-muted)]">
        {headline ? FEE_OBSERVED_LABELS[headline.observedFor] : '—'}
      </td>
      <td className="py-3 pr-4">
        {entry.deadlineDays.value !== null ? (
          `${entry.deadlineDays.value} days from the result`
        ) : (
          <span className="text-[var(--text-muted)]">Not published</span>
        )}
      </td>
      <td className="py-3 pr-4">
        {RECHECKING_MODE_LABELS[entry.mode]}
        <span className="block text-xs text-[var(--text-muted)]">{entry.modeNote}</span>
      </td>
      <td className="py-3 pr-4">
        {entry.refundIfErrorFound.value === true ? (
          'Yes'
        ) : (
          <span className="text-[var(--text-muted)]">Not published</span>
        )}
      </td>
    </tr>
  )
}

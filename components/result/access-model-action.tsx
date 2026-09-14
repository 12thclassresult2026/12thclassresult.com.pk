import type { Board } from '@/lib/board/types'

import { identifierRequirementSentence } from '@/lib/result/capability'
import { primarySourceFor } from '@/lib/result/fallback'

/**
 * The primary call to action for a board.
 *
 * THIS COMPONENT IS THE CORRECTNESS BOUNDARY OF THE WHOLE SITE.
 *
 * Every competitor in this market shows one thing — a roll-number prompt — for
 * every board. That is wrong for roughly a fifth of the country:
 *
 *  - Karachi and Hyderabad have NO lookup form at all. The gazette is the only
 *    route, so a roll-number prompt is an instruction a reader cannot follow.
 *  - AJK's online form is unreachable; its gazette is the verified route.
 *  - Peshawar and Mardan expose one session at a time, so a deep link built
 *    today points at a different class next month.
 *
 * Switching on `accessModel` in exactly one place means a new board model is a
 * TypeScript exhaustiveness error here rather than a silently wrong page
 * everywhere. A validation gate asserts the same invariant from the data side.
 */
export function AccessModelAction({ board }: { board: Board }) {
  switch (board.accessModel) {
    case 'roll-number-portal':
      return <RollNumberAction board={board} />
    case 'gazette-only':
      return <GazetteAction board={board} />
    case 'session-rotating-portal':
      return <RotatingPortalAction board={board} />
    case 'unverified':
      return <UnverifiedAction board={board} />
    default: {
      // Exhaustiveness: adding a model without handling it fails the build.
      const exhaustive: never = board.accessModel
      return exhaustive
    }
  }
}

function ActionShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface-raised)] p-5">
      <h3 className="font-semibold text-[var(--text-strong)]">{title}</h3>
      <div className="mt-3 space-y-3 text-sm text-[var(--text-body)]">{children}</div>
    </div>
  )
}

function OfficialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      rel="noopener nofollow"
      className="bg-primary-700 hover:bg-primary-800 inline-flex min-h-11 items-center rounded-[var(--radius-button)] px-5 text-sm font-semibold text-white"
    >
      {children}
    </a>
  )
}

function RollNumberAction({ board }: { board: Board }) {
  const portal = primarySourceFor(board)
  if (!portal) return <UnverifiedAction board={board} />

  const requirement = identifierRequirementSentence({
    requiresAdditionalIdentifier: portal.requiresAdditionalIdentifier,
    hasCaptcha: portal.hasCaptcha,
  })

  return (
    <ActionShell title="Check on the board’s own portal">
      <p>
        {board.shortName} publishes its result through its own portal. You will need your roll
        number.
      </p>
      {requirement ? <p className="font-medium">{requirement}</p> : null}
      <p>
        <OfficialLink href={portal.url}>Open {portal.name}</OfficialLink>
      </p>
    </ActionShell>
  )
}

function GazetteAction({ board }: { board: Board }) {
  const gazette = primarySourceFor(board)

  return (
    <ActionShell title="Find your result in the board’s gazette">
      {/*
        Stated plainly rather than buried. A reader who has been told elsewhere
        to "enter your roll number" needs to know why there is no box here.
      */}
      <p className="font-medium text-[var(--text-strong)]">
        {board.shortName} does not have an online roll-number result checker.
      </p>
      <p>
        It publishes results as gazette files instead. Open the gazette for your group, then search
        it for your roll number.
      </p>
      {gazette ? (
        <p>
          <OfficialLink href={gazette.url}>Open {gazette.name}</OfficialLink>
        </p>
      ) : null}
    </ActionShell>
  )
}

function RotatingPortalAction({ board }: { board: Board }) {
  const portal = primarySourceFor(board)

  return (
    <ActionShell title="Check on the board’s own portal">
      <p>{board.shortName} publishes its result through its own portal, using your roll number.</p>
      {/*
        The link-rot hazard, encoded as data rather than remembered. These
        portals expose one examination at a time, so a bookmark can silently
        become a different class.
      */}
      <p className="font-medium">
        This board’s portal shows one examination session at a time. If it is currently serving a
        different class, that is the portal rotating — not your result being missing.
      </p>
      {portal ? (
        <p>
          <OfficialLink href={portal.url}>Open {portal.name}</OfficialLink>
        </p>
      ) : null}
    </ActionShell>
  )
}

function UnverifiedAction({ board }: { board: Board }) {
  return (
    <ActionShell title="Open the board’s own website">
      {/*
        No capability is claimed here, in either direction. "We could not check"
        is not "it does not work" — several of these sites refuse automated
        requests and are very likely fine in an ordinary browser.
      */}
      <p>
        We could not confirm how {board.shortName} publishes its HSSC Part-II result. Its site
        refused automated checks, which is not the same as the site being down.
      </p>
      <p>Open the board’s own website directly rather than trusting a third-party link.</p>
      <p>
        <OfficialLink href={board.officialWebsite}>Open the {board.shortName} website</OfficialLink>
      </p>
    </ActionShell>
  )
}

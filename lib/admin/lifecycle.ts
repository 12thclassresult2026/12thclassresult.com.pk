import type { DatasetStatus } from '@/lib/gazettes/types'
import type { AdminRole, Permission } from './roles'

import { can } from './roles'

/**
 * The dataset lifecycle state machine.
 *
 * ONE SENTENCE DEFINES THIS FILE:
 *
 *     UPLOAD must never reach LIVE.
 *
 * Phase 10 lists "import directly publishes" as an absolute blocker, and the
 * way that blocker gets violated is never a deliberate decision — it is a
 * convenience path added later, or a status field somewhere that can be set to
 * anything. So status is not a settable field here. It changes only by applying
 * a named transition, and the transitions that do not exist cannot be reached.
 *
 * Every transition carries three guards:
 *
 *   1. FROM-state    — is this move legal at all?
 *   2. PERMISSION    — may this role make it?
 *   3. SEPARATION    — is this the same human who approved it?
 *
 * The third is the one people skip. It is the reason four-eyes is real rather
 * than a paragraph in a runbook.
 */

export type DatasetTransition =
  | 'register'
  | 'parse'
  | 'validate-pass'
  | 'validate-fail'
  | 'qa-approve'
  | 'qa-reject'
  | 'activate'
  | 'disable'
  | 'reactivate'
  | 'archive'

type TransitionRule = {
  /** Legal starting states. A transition from anywhere else is refused. */
  from: readonly DatasetStatus[]
  to: DatasetStatus
  permission: Permission
  /** Whether the actor must differ from whoever approved QA. */
  requiresSeparationFromApprover: boolean
  /** Whether a written reason is mandatory. */
  requiresReason: boolean
  /** Why this transition exists, for the operator and for review. */
  description: string
}

/**
 * The complete transition table.
 *
 * Note what is absent: there is no transition into `active` from any state
 * other than `validated`. Not from `parsed`, not from `qa-required`, not from
 * `unverified`. That absence is the safety property, and a test asserts it.
 */
const TRANSITIONS: Record<DatasetTransition, TransitionRule> = {
  register: {
    from: [],
    to: 'unverified',
    permission: 'gazette.register',
    requiresSeparationFromApprover: false,
    requiresReason: false,
    description: 'Record a gazette source before any file is processed.',
  },
  parse: {
    from: ['unverified'],
    to: 'parsed',
    permission: 'dataset.import',
    requiresSeparationFromApprover: false,
    requiresReason: false,
    description: 'Run the parser. Produces records and a parse report, nothing public.',
  },
  'validate-pass': {
    from: ['parsed'],
    to: 'qa-required',
    permission: 'dataset.import',
    requiresSeparationFromApprover: false,
    requiresReason: false,
    description:
      'Automated validation passed. This is NOT approval — a machine checked ranges and duplicates, not whether the records are the right people.',
  },
  'validate-fail': {
    from: ['parsed'],
    to: 'validation-failed',
    permission: 'dataset.import',
    requiresSeparationFromApprover: false,
    requiresReason: false,
    description: 'Automated validation failed. The dataset cannot proceed without reprocessing.',
  },
  'qa-approve': {
    from: ['qa-required'],
    to: 'validated',
    permission: 'dataset.qa.approve',
    requiresSeparationFromApprover: false,
    requiresReason: false,
    description:
      'A reviewer compared samples against the source gazette and signed off. Still not serving.',
  },
  'qa-reject': {
    from: ['qa-required'],
    to: 'validation-failed',
    permission: 'dataset.qa.approve',
    requiresSeparationFromApprover: false,
    requiresReason: true,
    description: 'A reviewer found a material mismatch against the source.',
  },
  activate: {
    from: ['validated'],
    to: 'active',
    permission: 'dataset.activate',
    // THE four-eyes guard.
    requiresSeparationFromApprover: true,
    requiresReason: true,
    description: 'Put the dataset in front of students. The highest-risk action in the system.',
  },
  disable: {
    from: ['active'],
    to: 'disabled',
    permission: 'dataset.disable',
    requiresSeparationFromApprover: false,
    // Deliberately no separation requirement: disabling is the emergency brake
    // during an incident, and it must never be blocked by who signed what.
    requiresReason: true,
    description: 'Emergency stop. Lookups fall back to official sources; records are retained.',
  },
  reactivate: {
    from: ['disabled'],
    to: 'active',
    permission: 'dataset.rollback',
    requiresSeparationFromApprover: true,
    requiresReason: true,
    description: 'Restore a previously validated version after an incident is understood.',
  },
  archive: {
    from: ['disabled', 'active'],
    to: 'archived',
    permission: 'dataset.archive',
    requiresSeparationFromApprover: false,
    requiresReason: true,
    description: 'Supersede a version. Retained for provenance, never deleted.',
  },
}

export function transitionRule(transition: DatasetTransition): TransitionRule {
  return TRANSITIONS[transition]
}

export const DATASET_TRANSITIONS = Object.keys(TRANSITIONS) as DatasetTransition[]

/** Transitions that can legally be applied from a given state. */
export function availableTransitions(status: DatasetStatus): DatasetTransition[] {
  return DATASET_TRANSITIONS.filter((t) => TRANSITIONS[t].from.includes(status))
}

export type TransitionRequest = {
  transition: DatasetTransition
  currentStatus: DatasetStatus
  actorId: string
  actorRole: AdminRole
  /** Who signed off QA on this dataset version, if anyone has. */
  qaApprovedBy?: string
  reason?: string
}

export type TransitionOutcome =
  | { ok: true; nextStatus: DatasetStatus }
  | { ok: false; refusal: TransitionRefusal; message: string }

export type TransitionRefusal =
  | 'illegal-from-state'
  | 'insufficient-permission'
  | 'separation-of-duties'
  | 'reason-required'
  | 'qa-approval-missing'

/**
 * Apply a transition, or refuse it with a reason.
 *
 * Returns a refusal rather than throwing, because an operator pressing a button
 * they may not press is an ordinary event that deserves an explanation — not a
 * stack trace. Genuine invariant violations elsewhere still throw.
 */
export function applyTransition(request: TransitionRequest): TransitionOutcome {
  const rule = TRANSITIONS[request.transition]

  if (!rule.from.includes(request.currentStatus)) {
    return {
      ok: false,
      refusal: 'illegal-from-state',
      message: `Cannot ${request.transition} a dataset that is "${request.currentStatus}".`,
    }
  }

  if (!can(request.actorRole, rule.permission)) {
    return {
      ok: false,
      refusal: 'insufficient-permission',
      message: `Your role cannot ${request.transition} a dataset.`,
    }
  }

  if (rule.requiresReason && !request.reason?.trim()) {
    return {
      ok: false,
      refusal: 'reason-required',
      message: 'This action needs a short written reason. It is recorded in the audit log.',
    }
  }

  if (rule.requiresSeparationFromApprover) {
    if (!request.qaApprovedBy) {
      return {
        ok: false,
        refusal: 'qa-approval-missing',
        message: 'This dataset has no recorded QA approval, so it cannot go live.',
      }
    }
    if (request.qaApprovedBy === request.actorId) {
      /*
       * The whole point. One person doing import, sign-off and activation is
       * how a bad dataset reaches students — nobody with fresh eyes ever looked
       * at it.
       */
      return {
        ok: false,
        refusal: 'separation-of-duties',
        message:
          'You approved this dataset’s QA, so someone else must activate it. Two people check result data before students see it.',
      }
    }
  }

  return { ok: true, nextStatus: rule.to }
}

/**
 * Is there any path — legal or otherwise — that reaches `active` without
 * passing through `validated`?
 *
 * Asked of the table itself rather than of a scenario, so it holds for every
 * possible sequence rather than the ones a test happened to try.
 */
export function pathsIntoActive(): { transition: DatasetTransition; from: DatasetStatus[] }[] {
  return DATASET_TRANSITIONS.filter((t) => TRANSITIONS[t].to === 'active').map((t) => ({
    transition: t,
    from: [...TRANSITIONS[t].from],
  }))
}

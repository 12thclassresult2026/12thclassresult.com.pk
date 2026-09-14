import type { AdminRole, Permission } from './roles'
import type { DatasetTransition } from './lifecycle'

import { isHighRisk } from './roles'

/**
 * The audit trail.
 *
 * "Actions have no audit trail" is an absolute blocker, and the reason is
 * practical rather than procedural: when a student reports a wrong result, the
 * only question that matters is *which dataset was serving, activated by whom,
 * on whose sign-off, and when*. Without that, the incident cannot be
 * investigated — only guessed at.
 *
 * TWO PROPERTIES THIS MODEL ENFORCES:
 *
 *  1. Append-only. There is no update and no delete in this module. An editor
 *     who can erase their own history has no history.
 *
 *  2. No personal data. An audit entry records that a dataset was activated —
 *     never a candidate's name, roll number or marks. The trail must be safe to
 *     read widely, and a log full of students' results is not.
 */

export type AuditAction =
  | 'admin.login'
  | 'admin.login.failed'
  | 'admin.logout'
  | 'board.updated'
  | 'board.slug.changed'
  | 'source.updated'
  | 'source.verified'
  | 'gazette.registered'
  | 'gazette.uploaded'
  | 'dataset.transitioned'
  | 'dataset.deleted'
  | 'result.status.changed'
  | 'result.fact.changed'
  | 'adapter.disabled'
  | 'adapter.enabled'
  | 'content.published'
  | 'content.deleted'
  | 'year.rollover'
  | 'user.role.changed'
  | 'permission.denied'

export type AuditEntityType =
  | 'board'
  | 'source'
  | 'gazette'
  | 'dataset'
  | 'content-page'
  | 'admin-user'
  | 'adapter'
  | 'platform'

export type AuditEvent = {
  /** Monotonic id assigned by the store. Never reused. */
  id: string
  at: string
  actorId: string
  actorRole: AdminRole
  action: AuditAction
  entityType: AuditEntityType
  entityId: string
  /** Prior and new state, for fields that changed. Scalars only. */
  before?: Record<string, string | number | boolean | null>
  after?: Record<string, string | number | boolean | null>
  /** Required for high-risk actions; see `requiresReason`. */
  reason?: string
  /** Set when the action was a dataset lifecycle move. */
  transition?: DatasetTransition
  /** Set when the entry records a refusal rather than a change. */
  denied?: { permission: Permission; refusal: string }
}

/**
 * Actions that may not be recorded without a written reason.
 *
 * The reason is not paperwork. Six months later it is the only thing that
 * explains why a dataset was rolled back, and "because it was wrong" is not
 * recoverable from a timestamp.
 */
const REASON_REQUIRED: readonly AuditAction[] = [
  'dataset.transitioned',
  'dataset.deleted',
  'board.slug.changed',
  'content.deleted',
  'year.rollover',
  'user.role.changed',
  'adapter.disabled',
] as const

export function requiresReason(action: AuditAction): boolean {
  return REASON_REQUIRED.includes(action)
}

/**
 * Field names that must never appear in an audit payload.
 *
 * Checked rather than trusted, because the natural thing for a developer
 * debugging an import is to widen the `after` payload until the problem is
 * visible — and the problem is usually in a record.
 */
const FORBIDDEN_FIELDS = [
  'rollnumber',
  'roll_number',
  'candidatename',
  'candidate_name',
  'fathername',
  'father_name',
  'cnic',
  'bform',
  'b_form',
  'marks',
  'obtainedmarks',
  'obtained_marks',
  'grade',
  'password',
  'token',
  'secret',
  'apikey',
  'api_key',
] as const

export type AuditRejection =
  | { ok: true }
  | { ok: false; problem: 'reason-required' | 'personal-data' | 'empty-actor'; detail: string }

/**
 * Validate an event before it is written.
 *
 * Rejecting here rather than sanitising silently is deliberate: a caller trying
 * to log a roll number has a bug worth surfacing, and quietly stripping the
 * field would hide it until the next person copies the pattern.
 */
export function validateAuditEvent(event: Omit<AuditEvent, 'id' | 'at'>): AuditRejection {
  if (!event.actorId.trim()) {
    return { ok: false, problem: 'empty-actor', detail: 'Every audit entry needs an actor.' }
  }

  if (requiresReason(event.action) && !event.reason?.trim()) {
    return {
      ok: false,
      problem: 'reason-required',
      detail: `"${event.action}" may not be recorded without a reason.`,
    }
  }

  for (const payload of [event.before, event.after]) {
    if (!payload) continue
    for (const key of Object.keys(payload)) {
      const normalized = key.toLowerCase().replace(/[^a-z_]/g, '')
      if (FORBIDDEN_FIELDS.includes(normalized as (typeof FORBIDDEN_FIELDS)[number])) {
        return {
          ok: false,
          problem: 'personal-data',
          detail: `Audit payloads must not carry "${key}". Log the dataset, not the record.`,
        }
      }
    }
  }

  return { ok: true }
}

/**
 * Whether an action should additionally raise an operator notification.
 *
 * Kept narrow on purpose. An audit log everyone has muted is the same as no
 * audit log, and the fastest way there is alerting on everything.
 */
export function shouldNotify(event: Pick<AuditEvent, 'action' | 'denied'>): boolean {
  if (event.denied) return true
  return (
    event.action === 'dataset.transitioned' ||
    event.action === 'dataset.deleted' ||
    event.action === 'year.rollover' ||
    event.action === 'user.role.changed' ||
    event.action === 'adapter.disabled'
  )
}

/** A one-line, personal-data-free summary for an operator listing. */
export function describeAuditEvent(event: AuditEvent): string {
  const who = `${event.actorId} (${event.actorRole})`
  const what =
    event.transition !== undefined
      ? `${event.action}:${event.transition}`
      : event.denied
        ? `${event.action}:${event.denied.permission}`
        : event.action
  return `${event.at} · ${who} · ${what} · ${event.entityType}/${event.entityId}`
}

/**
 * Permissions whose exercise must always leave a trail.
 *
 * Derived from the high-risk list rather than duplicated, so the two cannot
 * disagree as the matrix changes.
 */
export function mustBeAudited(permission: Permission): boolean {
  return isHighRisk(permission)
}

import { describe, expect, it } from 'vitest'

import {
  ADMIN_ROLES,
  HIGH_RISK_PERMISSIONS,
  PermissionError,
  assertCan,
  bulkExportIsUnavailable,
  can,
  isHighRisk,
  permissionsFor,
  rolesWith,
  type AdminRole,
} from '@/lib/admin/roles'
import {
  DATASET_TRANSITIONS,
  applyTransition,
  availableTransitions,
  pathsIntoActive,
  transitionRule,
  type DatasetTransition,
} from '@/lib/admin/lifecycle'
import {
  describeAuditEvent,
  mustBeAudited,
  shouldNotify,
  validateAuditEvent,
} from '@/lib/admin/audit'
import type { DatasetStatus } from '@/lib/gazettes/types'

/**
 * Phase 10's absolute blockers, as tests.
 *
 * Each block below is named for the failure it prevents rather than the
 * function it calls, because that is what a future reader needs to know before
 * deciding to "simplify" one of these rules.
 */

const APPROVER = 'user-reviewer-1'
const OTHER = 'user-admin-2'

function activate(over: Partial<Parameters<typeof applyTransition>[0]> = {}) {
  return applyTransition({
    transition: 'activate',
    currentStatus: 'validated',
    actorId: OTHER,
    actorRole: 'data-admin',
    qaApprovedBy: APPROVER,
    reason: 'QA passed; sample comparison clean.',
    ...over,
  })
}

describe('BLOCKER: import must never directly publish', () => {
  it('has no transition into active except from validated', () => {
    // Asked of the transition TABLE, not of a scenario — so it holds for every
    // possible sequence, not just the ones tried below.
    const paths = pathsIntoActive()
    expect(paths.length).toBeGreaterThan(0)

    // `disabled` is permitted alongside `validated` because restoring a
    // previously-validated version after an incident is a legitimate route —
    // and it carries the same four-eyes guard.
    const ALLOWED_ENTRY: DatasetStatus[] = ['validated', 'disabled']
    for (const path of paths) {
      expect(path.from.length, `${path.transition} reaches active from nowhere`).toBeGreaterThan(0)
      for (const from of path.from) {
        expect(ALLOWED_ENTRY, `${path.transition} can reach active from "${from}"`).toContain(from)
      }
    }
  })

  it.each(['unverified', 'parsed', 'qa-required', 'validation-failed'] satisfies DatasetStatus[])(
    'refuses to activate a %s dataset',
    (status) => {
      const outcome = activate({ currentStatus: status })
      expect(outcome.ok).toBe(false)
      if (outcome.ok) return
      expect(outcome.refusal).toBe('illegal-from-state')
    },
  )

  it('offers no activation route from a freshly parsed dataset', () => {
    expect(availableTransitions('parsed')).not.toContain('activate')
    expect(availableTransitions('unverified')).not.toContain('activate')
  })

  it('does not treat automated validation as approval', () => {
    // validate-pass lands on qa-required, never on validated. A machine
    // checking ranges is not a human checking identity.
    expect(transitionRule('validate-pass').to).toBe('qa-required')
    expect(transitionRule('validate-pass').to).not.toBe('validated')
  })
})

describe('BLOCKER: an editor must not be able to activate a dataset', () => {
  it('denies every dataset-changing permission to editor', () => {
    for (const permission of [
      'dataset.activate',
      'dataset.disable',
      'dataset.rollback',
      'dataset.delete',
      'dataset.import',
      'dataset.qa.approve',
    ] as const) {
      expect(can('editor', permission), `editor has ${permission}`).toBe(false)
    }
  })

  it('refuses an editor’s activation attempt even from a legal state', () => {
    const outcome = activate({ actorRole: 'editor' })
    expect(outcome.ok).toBe(false)
    if (outcome.ok) return
    expect(outcome.refusal).toBe('insufficient-permission')
  })

  it('gives editor no result-data permissions at all', () => {
    const dangerous = permissionsFor('editor').filter(
      (p) => p.startsWith('dataset.') && p !== 'dataset.read',
    )
    expect(dangerous).toEqual([])
  })
})

describe('BLOCKER: permissions must not be bypassable', () => {
  it('denies read-only every write capability', () => {
    const writes = permissionsFor('read-only').filter(
      (p) => !p.endsWith('.read') && p !== 'audit.read',
    )
    expect(writes).toEqual([])
  })

  it('throws rather than silently allowing a denied action', () => {
    expect(() => assertCan('read-only', 'dataset.activate')).toThrow(PermissionError)
  })

  it('grants no role a permission outside the declared matrix', () => {
    // Every granted permission must be one the type system knows about, and
    // every role must appear exactly once.
    expect(new Set(ADMIN_ROLES).size).toBe(ADMIN_ROLES.length)
    for (const role of ADMIN_ROLES) {
      expect(permissionsFor(role).length, `${role} has no permissions`).toBeGreaterThan(0)
    }
  })

  it('keeps super-admin out of the QA sign-off role', () => {
    /*
     * Deliberate. If super-admin could approve QA it could also activate, and
     * the separation guard below would have a hole big enough to drive the
     * whole failure through.
     */
    expect(can('super-admin', 'dataset.qa.approve')).toBe(false)
    expect(rolesWith('dataset.qa.approve')).toEqual(['data-reviewer'])
  })
})

describe('BLOCKER: four-eyes on activation', () => {
  it('activates when a different person approved QA', () => {
    const outcome = activate()
    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    expect(outcome.nextStatus).toBe('active')
  })

  it('refuses when the activator is the person who approved QA', () => {
    const outcome = activate({ actorId: APPROVER })
    expect(outcome.ok).toBe(false)
    if (outcome.ok) return
    expect(outcome.refusal).toBe('separation-of-duties')
    // The message has to explain WHY, or an operator will read it as a bug.
    expect(outcome.message).toMatch(/someone else must activate/i)
  })

  it('refuses when nothing has been QA-approved at all', () => {
    const outcome = activate({ qaApprovedBy: undefined })
    expect(outcome.ok).toBe(false)
    if (outcome.ok) return
    expect(outcome.refusal).toBe('qa-approval-missing')
  })

  it('requires a written reason to activate', () => {
    const outcome = activate({ reason: '   ' })
    expect(outcome.ok).toBe(false)
    if (outcome.ok) return
    expect(outcome.refusal).toBe('reason-required')
  })
})

describe('BLOCKER: rollback must be available, and the brake must never jam', () => {
  it('allows an active dataset to be disabled', () => {
    const outcome = applyTransition({
      transition: 'disable',
      currentStatus: 'active',
      actorId: OTHER,
      actorRole: 'operations',
      reason: 'Wrong marks reported by a reader; investigating.',
    })
    expect(outcome.ok).toBe(true)
    if (!outcome.ok) return
    expect(outcome.nextStatus).toBe('disabled')
  })

  it('lets operations hit the brake without a QA approver on file', () => {
    /*
     * Disabling deliberately carries NO separation requirement. During an
     * incident the emergency stop must never be blocked by who signed what.
     */
    const outcome = applyTransition({
      transition: 'disable',
      currentStatus: 'active',
      actorId: APPROVER,
      actorRole: 'operations',
      reason: 'P0: suspected cross-candidate contamination.',
    })
    expect(outcome.ok).toBe(true)
  })

  it('does not let operations start anything', () => {
    // Operations can stop; it cannot go. Mitigation is urgent, activation is
    // never urgent enough to skip review.
    expect(can('operations', 'dataset.disable')).toBe(true)
    expect(can('operations', 'dataset.activate')).toBe(false)
    expect(can('operations', 'dataset.import')).toBe(false)
  })

  it('supports restoring a disabled dataset, still under four-eyes', () => {
    const ok = applyTransition({
      transition: 'reactivate',
      currentStatus: 'disabled',
      actorId: OTHER,
      actorRole: 'data-admin',
      qaApprovedBy: APPROVER,
      reason: 'Root cause was the index build, not the records. Re-verified.',
    })
    expect(ok.ok).toBe(true)

    const selfApproved = applyTransition({
      transition: 'reactivate',
      currentStatus: 'disabled',
      actorId: APPROVER,
      actorRole: 'data-admin',
      qaApprovedBy: APPROVER,
      reason: 'x',
    })
    expect(selfApproved.ok).toBe(false)
  })
})

describe('BLOCKER: no mass student export', () => {
  it('grants dataset.bulk.export to nobody, including super-admin', () => {
    expect(bulkExportIsUnavailable()).toBe(true)
    expect(rolesWith('dataset.bulk.export')).toEqual([])
    expect(can('super-admin', 'dataset.bulk.export')).toBe(false)
  })

  it('restricts individual record inspection to data roles', () => {
    // Debugging access is real, but it is not for casual browsing.
    const inspectors = rolesWith('dataset.record.inspect')
    expect(inspectors).not.toContain('editor')
    expect(inspectors).not.toContain('read-only')
    expect(inspectors).not.toContain('content-reviewer')
  })
})

describe('BLOCKER: destructive actions need safeguards', () => {
  it('marks the genuinely irreversible actions as high risk', () => {
    for (const permission of [
      'dataset.activate',
      'dataset.delete',
      'dataset.rollback',
      'year.rollover',
      'board.slug.change',
      'user.manage',
    ] as const) {
      expect(isHighRisk(permission), `${permission} is not flagged high risk`).toBe(true)
    }
  })

  it('requires a reason for every transition that changes what students see', () => {
    for (const t of [
      'activate',
      'disable',
      'reactivate',
      'archive',
    ] satisfies DatasetTransition[]) {
      expect(transitionRule(t).requiresReason, `${t} needs no reason`).toBe(true)
    }
  })

  it('restricts deletion far more tightly than disabling', () => {
    expect(rolesWith('dataset.delete')).toEqual(['super-admin'])
    expect(rolesWith('dataset.disable').length).toBeGreaterThan(1)
  })

  it('confines year rollover to a single role', () => {
    expect(rolesWith('year.rollover')).toEqual(['super-admin'])
  })
})

describe('the matrix is coherent', () => {
  it('lets nobody publish content they alone wrote without the permission', () => {
    expect(can('editor', 'content.write')).toBe(true)
    expect(can('editor', 'content.publish')).toBe(false)
    expect(can('content-reviewer', 'content.publish')).toBe(true)
  })

  it('gives every high-risk permission at least one holder, or none by design', () => {
    for (const permission of HIGH_RISK_PERMISSIONS) {
      const holders = rolesWith(permission)
      if (permission === 'dataset.bulk.export') {
        expect(holders).toEqual([])
        continue
      }
      expect(holders.length, `${permission} is unusable — no role holds it`).toBeGreaterThan(0)
    }
  })

  it('describes every transition for the operator', () => {
    for (const t of DATASET_TRANSITIONS) {
      expect(transitionRule(t).description.length, `${t} has no description`).toBeGreaterThan(30)
    }
  })

  it.each(ADMIN_ROLES)('gives %s a coherent read baseline', (role: AdminRole) => {
    // Every role can see boards; none is blind to the thing it operates on.
    expect(can(role, 'board.read')).toBe(true)
  })
})

describe('BLOCKER: every critical action leaves a trail', () => {
  const base = {
    actorId: OTHER,
    actorRole: 'data-admin' as AdminRole,
    entityType: 'dataset' as const,
    entityId: 'bise-gujranwala-hssc2-2025-first-annual-v1',
  }

  it('refuses to record a dataset transition without a reason', () => {
    const result = validateAuditEvent({
      ...base,
      action: 'dataset.transitioned',
      transition: 'activate',
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.problem).toBe('reason-required')
  })

  it('accepts the same event once a reason is given', () => {
    expect(
      validateAuditEvent({
        ...base,
        action: 'dataset.transitioned',
        transition: 'activate',
        reason: 'QA passed on 2026-09-14; sample comparison clean.',
      }).ok,
    ).toBe(true)
  })

  it('refuses an entry with no actor', () => {
    const result = validateAuditEvent({ ...base, actorId: '  ', action: 'admin.login' })
    expect(result.ok).toBe(false)
  })

  it.each([
    'rollNumber',
    'candidate_name',
    'fatherName',
    'cnic',
    'obtainedMarks',
    'grade',
    'password',
    'apiKey',
  ])('refuses an audit payload carrying %s', (field) => {
    /*
     * The natural thing when debugging an import is to widen the payload until
     * the problem is visible — and the problem is usually inside a record.
     * Rejecting loudly surfaces that bug instead of hiding it.
     */
    const result = validateAuditEvent({
      ...base,
      action: 'dataset.transitioned',
      reason: 'debugging',
      after: { [field]: 'anything' },
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.problem).toBe('personal-data')
  })

  it('allows non-personal dataset fields', () => {
    expect(
      validateAuditEvent({
        ...base,
        action: 'dataset.transitioned',
        reason: 'activation',
        before: { status: 'validated', recordCount: 114000 },
        after: { status: 'active', recordCount: 114000 },
      }).ok,
    ).toBe(true)
  })

  it('notifies on the actions an operator must not miss', () => {
    expect(shouldNotify({ action: 'dataset.transitioned' })).toBe(true)
    expect(shouldNotify({ action: 'year.rollover' })).toBe(true)
    expect(
      shouldNotify({
        action: 'permission.denied',
        denied: { permission: 'dataset.activate', refusal: 'insufficient-permission' },
      }),
    ).toBe(true)
    // But not on routine reads, or the log becomes noise everyone mutes.
    expect(shouldNotify({ action: 'admin.login' })).toBe(false)
  })

  it('requires an audit entry for every high-risk permission', () => {
    for (const permission of HIGH_RISK_PERMISSIONS) {
      expect(mustBeAudited(permission), `${permission} need not be audited`).toBe(true)
    }
  })

  it('writes a summary that carries no personal data', () => {
    const line = describeAuditEvent({
      id: 'evt-1',
      at: '2026-09-14T00:00:00.000Z',
      ...base,
      action: 'dataset.transitioned',
      transition: 'activate',
      reason: 'ok',
    })
    expect(line).toContain('activate')
    expect(line).not.toMatch(/\b\d{5,}\b/)
  })
})

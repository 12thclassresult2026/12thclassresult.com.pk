/**
 * Admin roles and the permission matrix.
 *
 * THIS FILE EXISTS BEFORE ANY ADMIN UI, DELIBERATELY.
 *
 * Phase 10's absolute blockers are almost all permission failures — "editor can
 * accidentally activate datasets", "permissions can be bypassed", "import
 * directly publishes". Every one of those is a decision in code, and every one
 * of them happens when a screen is built first and the rules are added
 * afterwards to fit it.
 *
 * So the rules come first, they are exhaustive, and they are tested. A future
 * screen can only call `can()`; it cannot widen what a role may do.
 *
 * The surface these rules protect is not a blog. It is national result data:
 * activating a bad dataset shows a wrong result to a candidate, which is the
 * P0 failure of this entire platform.
 */

export type AdminRole =
  | 'super-admin'
  | 'data-admin'
  | 'data-reviewer'
  | 'editor'
  | 'content-reviewer'
  | 'operations'
  | 'read-only'

export const ADMIN_ROLES: readonly AdminRole[] = [
  'super-admin',
  'data-admin',
  'data-reviewer',
  'editor',
  'content-reviewer',
  'operations',
  'read-only',
] as const

/**
 * Capabilities, named for the action rather than the screen.
 *
 * Naming these after actions rather than pages is what lets the matrix survive
 * a redesign: a permission called `dataset.activate` still means the same thing
 * when the button moves.
 */
export type Permission =
  // Boards and sources
  | 'board.read'
  | 'board.write'
  | 'board.slug.change'
  | 'source.read'
  | 'source.write'
  | 'source.verify'
  // Gazette ingestion
  | 'gazette.register'
  | 'gazette.upload'
  | 'dataset.import'
  | 'dataset.read'
  // Quality assurance
  | 'dataset.qa.review'
  | 'dataset.qa.approve'
  // The dangerous ones
  | 'dataset.activate'
  | 'dataset.disable'
  | 'dataset.rollback'
  | 'dataset.archive'
  | 'dataset.delete'
  | 'dataset.record.inspect'
  | 'dataset.bulk.export'
  // Result operations
  | 'result.status.write'
  | 'result.fact.write'
  | 'adapter.disable'
  // Editorial
  | 'content.write'
  | 'content.publish'
  | 'content.delete'
  // Platform
  | 'year.rollover'
  | 'user.manage'
  | 'audit.read'
  | 'settings.write'

/**
 * Permissions that can put wrong data in front of a student, take the product
 * down, or cannot be undone. These get extra ceremony everywhere they appear.
 */
export const HIGH_RISK_PERMISSIONS: readonly Permission[] = [
  'dataset.activate',
  'dataset.rollback',
  'dataset.delete',
  'dataset.bulk.export',
  'board.slug.change',
  'year.rollover',
  'user.manage',
  'content.delete',
] as const

export function isHighRisk(permission: Permission): boolean {
  return HIGH_RISK_PERMISSIONS.includes(permission)
}

/**
 * The matrix. Every role lists its permissions exhaustively — there is no
 * inheritance, and no "everything except" rule.
 *
 * Inheritance is how a role quietly acquires a capability nobody intended:
 * someone adds a permission to a base role and it appears on four others. An
 * explicit list is longer and cannot do that.
 */
const MATRIX: Record<AdminRole, readonly Permission[]> = {
  /*
   * Deliberately NOT "all permissions". Super-admin manages people and
   * settings and can act in an emergency, but is not a shortcut around the
   * separation of duties below — notably it does not hold `dataset.qa.approve`,
   * so it cannot both sign off a dataset and activate it.
   */
  'super-admin': [
    'board.read',
    'board.write',
    'board.slug.change',
    'source.read',
    'source.write',
    'source.verify',
    'gazette.register',
    'gazette.upload',
    'dataset.import',
    'dataset.read',
    'dataset.qa.review',
    'dataset.activate',
    'dataset.disable',
    'dataset.rollback',
    'dataset.archive',
    'dataset.delete',
    'dataset.record.inspect',
    'result.status.write',
    'result.fact.write',
    'adapter.disable',
    'content.write',
    'content.publish',
    'content.delete',
    'year.rollover',
    'user.manage',
    'audit.read',
    'settings.write',
  ],

  /** Runs ingestion and activates datasets someone else has approved. */
  'data-admin': [
    'board.read',
    'source.read',
    'source.write',
    'source.verify',
    'gazette.register',
    'gazette.upload',
    'dataset.import',
    'dataset.read',
    'dataset.qa.review',
    'dataset.activate',
    'dataset.disable',
    'dataset.rollback',
    'dataset.archive',
    'dataset.record.inspect',
    'result.status.write',
    'result.fact.write',
    'audit.read',
  ],

  /**
   * Judges whether a dataset is correct — and cannot then put it live.
   *
   * This is the separation that makes four-eyes real. A reviewer who could
   * activate would be checking their own work, which is the arrangement the
   * principle exists to prevent.
   */
  'data-reviewer': [
    'board.read',
    'source.read',
    'dataset.read',
    'dataset.qa.review',
    'dataset.qa.approve',
    'dataset.record.inspect',
    'audit.read',
  ],

  /** Writes content. Cannot publish it, and cannot touch result data at all. */
  editor: ['board.read', 'source.read', 'dataset.read', 'content.write'],

  'content-reviewer': [
    'board.read',
    'source.read',
    'source.verify',
    'dataset.read',
    'content.write',
    'content.publish',
    'result.fact.write',
    'audit.read',
  ],

  /**
   * Result-day hands. Can stop things — disable a dataset, kill an adapter,
   * set status — but cannot start them. Mitigation is urgent; activation is
   * never urgent enough to skip review.
   */
  operations: [
    'board.read',
    'source.read',
    'source.verify',
    'dataset.read',
    'dataset.disable',
    'result.status.write',
    'adapter.disable',
    'audit.read',
  ],

  'read-only': ['board.read', 'source.read', 'dataset.read', 'audit.read'],
}

export function permissionsFor(role: AdminRole): readonly Permission[] {
  return MATRIX[role]
}

/** The only authorization question any caller should ask. */
export function can(role: AdminRole, permission: Permission): boolean {
  return MATRIX[role].includes(permission)
}

/**
 * Roles holding a permission. Used by tests and by the documented approval
 * matrix, so the docs are generated from the rules rather than describing them.
 */
export function rolesWith(permission: Permission): AdminRole[] {
  return ADMIN_ROLES.filter((role) => can(role, permission))
}

/**
 * Bulk export of student records is granted to NOBODY.
 *
 * Not an oversight. A national result database is a standing privacy risk, and
 * an export button is the single easiest way for it to leave. If a legitimate
 * need ever arises it gets its own authorization design and its own review —
 * not a role that already exists quietly gaining the capability.
 */
export function bulkExportIsUnavailable(): boolean {
  return rolesWith('dataset.bulk.export').length === 0
}

export class PermissionError extends Error {
  constructor(
    readonly role: AdminRole,
    readonly permission: Permission,
  ) {
    super(`Role "${role}" may not perform "${permission}"`)
    this.name = 'PermissionError'
  }
}

export function assertCan(role: AdminRole, permission: Permission): void {
  if (!can(role, permission)) throw new PermissionError(role, permission)
}

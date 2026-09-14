# Roles and Permissions

**Generated from `lib/admin/roles.ts`** — do not hand-edit. The matrix below is produced from
the same constant the application enforces, so the documentation cannot drift from the rules.

| Code | Role               | Purpose                                                     |
| ---- | ------------------ | ----------------------------------------------------------- |
| SA   | `super-admin`      | People, settings, emergencies. Deliberately not omnipotent. |
| DA   | `data-admin`       | Runs ingestion; activates datasets others approved.         |
| DR   | `data-reviewer`    | Judges dataset correctness. **Cannot activate.**            |
| ED   | `editor`           | Writes content. No result-data access, no publishing.       |
| CR   | `content-reviewer` | Approves and publishes content.                             |
| OP   | `operations`       | Result-day hands. Can stop things; cannot start them.       |
| RO   | `read-only`        | Audit without modify.                                       |

---

## The matrix

| Permission               | SA  | DA  | DR  | ED  | CR  | OP  | RO  |   Risk   |
| ------------------------ | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :------: |
| `board.read`             | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |          |
| `board.write`            | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |  ·  |          |
| `board.slug.change`      | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |  ·  | **HIGH** |
| `source.read`            | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |          |
| `source.write`           | ✅  | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |          |
| `source.verify`          | ✅  | ✅  |  ·  |  ·  | ✅  | ✅  |  ·  |          |
| `gazette.register`       | ✅  | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |          |
| `gazette.upload`         | ✅  | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |          |
| `dataset.import`         | ✅  | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |          |
| `dataset.read`           | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |          |
| `dataset.qa.review`      | ✅  | ✅  | ✅  |  ·  |  ·  |  ·  |  ·  |          |
| `dataset.qa.approve`     |  ·  |  ·  | ✅  |  ·  |  ·  |  ·  |  ·  |          |
| `dataset.activate`       | ✅  | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  | **HIGH** |
| `dataset.disable`        | ✅  | ✅  |  ·  |  ·  |  ·  | ✅  |  ·  |          |
| `dataset.rollback`       | ✅  | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  | **HIGH** |
| `dataset.archive`        | ✅  | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |          |
| `dataset.delete`         | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |  ·  | **HIGH** |
| `dataset.record.inspect` | ✅  | ✅  | ✅  |  ·  |  ·  |  ·  |  ·  |          |
| `dataset.bulk.export`    |  ·  |  ·  |  ·  |  ·  |  ·  |  ·  |  ·  | **HIGH** |
| `result.status.write`    | ✅  | ✅  |  ·  |  ·  |  ·  | ✅  |  ·  |          |
| `result.fact.write`      | ✅  | ✅  |  ·  |  ·  | ✅  |  ·  |  ·  |          |
| `adapter.disable`        | ✅  |  ·  |  ·  |  ·  |  ·  | ✅  |  ·  |          |
| `content.write`          | ✅  |  ·  |  ·  | ✅  | ✅  |  ·  |  ·  |          |
| `content.publish`        | ✅  |  ·  |  ·  |  ·  | ✅  |  ·  |  ·  |          |
| `content.delete`         | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |  ·  | **HIGH** |
| `year.rollover`          | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |  ·  | **HIGH** |
| `user.manage`            | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |  ·  | **HIGH** |
| `audit.read`             | ✅  | ✅  | ✅  |  ·  | ✅  | ✅  | ✅  |          |
| `settings.write`         | ✅  |  ·  |  ·  |  ·  |  ·  |  ·  |  ·  |          |

---

## The three separations that matter

### 1. A reviewer cannot activate what they approved

`data-reviewer` holds `dataset.qa.approve` and **not** `dataset.activate`. Beyond the role
split, `applyTransition` refuses an activation where `actorId === qaApprovedBy` — so even a
user holding both roles cannot sign off and publish the same dataset.

This is what makes four-eyes real rather than procedural.

### 2. Super-admin is not a way around it

`super-admin` deliberately does **not** hold `dataset.qa.approve`. If it did, one account
could approve and activate, and the separation above would have a hole in it.

### 3. Operations can stop, not start

`operations` holds `dataset.disable` and `adapter.disable` but neither `dataset.activate`
nor `dataset.import`. Mitigation during an incident is urgent; activation never is.

Correspondingly, `disable` carries **no** separation requirement — an emergency brake must
never be blocked by who signed what.

---

## Granted to nobody

`dataset.bulk.export` appears in the permission type and is held by **no role, including
super-admin**.

That is not an oversight. A national result database is a standing privacy risk and an export
button is the easiest way for it to leave. If a legitimate need arises it gets its own
authorization design and its own review — rather than an existing role quietly acquiring it.

A test asserts the holder list stays empty.

# Admin Architecture

**Phase:** 10 · **Date:** 2026-09-14 · **Status:** safety core built; no admin UI, and deliberately so

---

## 1. What exists to operate — the audit that shaped this phase

| Component              | State                                                 |
| ---------------------- | ----------------------------------------------------- |
| Gazette parser         | **Not built**                                         |
| Ingestion pipeline     | **Not built**                                         |
| Storage (D1 / KV / R2) | **No binding declared**                               |
| Dataset service        | **Not built**                                         |
| Any activated dataset  | **None**                                              |
| Auth library           | **None installed**                                    |
| Production site        | **Not deployed** — zone on another Cloudflare account |

An admin UI built now would be a control panel for an engine that does not exist, needing auth
infrastructure that does not exist, on a site that does not serve.

**So no admin route was created.** "Public can access admin" is Phase 10's first absolute
blocker, and an admin route without authentication is exactly that. There is no `/admin` in this
repository.

---

## 2. What was built instead, and why it comes first

Read Phase 10's absolute blockers again and notice what kind of failures they are:

> permissions can be bypassed · editor can accidentally activate datasets · import directly
> publishes · dataset rollback unavailable · actions have no audit trail · mass student export
> publicly exposed · destructive actions have no safeguards

**Not one of those is a UI defect.** Every one is a decision in logic — and every one happens
when a screen is built first and the rules are fitted around it afterwards.

So the rules exist first, exhaustively, and tested:

| Module                   | Enforces                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `lib/admin/roles.ts`     | Seven roles, 29 permissions, an explicit matrix with no inheritance                  |
| `lib/admin/lifecycle.ts` | The dataset state machine — status changes only via guarded transitions              |
| `lib/admin/audit.ts`     | Append-only event model that refuses personal data and reason-less high-risk entries |

53 tests, each named for the blocker it prevents. A future screen can only call `can()` and
`applyTransition()`; it cannot widen what a role may do or invent a status change.

---

## 3. The state machine is the product safety property

```
              register            parse           validate-pass
        (none) ────────▶ unverified ──▶ parsed ──────────────▶ qa-required
                                          │                        │
                              validate-fail│              qa-approve│  qa-reject
                                          ▼                        ▼      │
                                  validation-failed ◀───────────────┘      │
                                                                  validated
                                                                       │
                                                        activate  ◀────┘  (four-eyes)
                                                             │
                                                           active
                                                          ╱      ╲
                                              disable    ╱        ╲  archive
                                                        ▼          ▼
                                                   disabled ──▶ archived
                                                        │
                                            reactivate  │  (four-eyes)
                                                        ▼
                                                     active
```

**Status is not a settable field.** It changes only by applying a named transition, so the
transitions that do not exist cannot be reached. There is no route into `active` from
`unverified`, `parsed`, `qa-required` or `validation-failed` — which is the machine-checked form
of "upload must never reach live".

A mutation test confirms this has teeth: adding `parsed` to the activation's legal from-states
fails three tests immediately.

### Three guards on every transition

1. **From-state** — is this move legal at all?
2. **Permission** — may this role make it?
3. **Separation** — is this the same human who approved it?

The third is the one that gets skipped, and it is the one that makes four-eyes real.

### Automated validation is not approval

`validate-pass` lands on `qa-required`, never on `validated`. A machine checked ranges and
duplicates; it did not check whether these records are the right people. Only a human comparing
samples against the source gazette can do that, and only `data-reviewer` may record it.

---

## 4. Threat model

| #   | Threat                                        | Consequence                                                   | Control                                                                                                               |
| --- | --------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| T1  | A bad dataset is activated                    | **A student reads someone else's result.** The platform's P0. | Four-eyes on activation; QA approval required; separation enforced in code, not policy                                |
| T2  | An operator activates their own import        | No fresh eyes ever see it                                     | `actorId !== qaApprovedBy`, checked on every activation and reactivation                                              |
| T3  | An editor reaches result data                 | Content role mutates national records                         | `editor` holds no `dataset.*` permission except `dataset.read`                                                        |
| T4  | Bulk export of student records                | Mass privacy breach                                           | `dataset.bulk.export` granted to **no role**; asserted by test                                                        |
| T5  | Admin surface publicly reachable              | Total compromise                                              | **No admin route exists.** None ships before authentication                                                           |
| T6  | Audit trail erased or absent                  | Incident becomes unreconstructable                            | Append-only model; no update or delete in the module; reasons mandatory on high-risk actions                          |
| T7  | Personal data leaks into logs                 | Privacy breach via the safety system itself                   | `validateAuditEvent` **rejects** payloads containing roll numbers, names, marks or secrets                            |
| T8  | SSRF via an operator-supplied source URL      | Server fetches internal addresses                             | `assertAllowedUrl` already exists; source URLs must pass the same guard                                               |
| T9  | Malicious gazette upload                      | Code execution during parsing                                 | Parsing must treat files as untrusted; no macro or embedded-code execution. **Unbuilt — a requirement on the parser** |
| T10 | Blind year rollover                           | Previous cycle destroyed                                      | `year.rollover` restricted to one role and high-risk; `docs/year-rollover.md` forbids global replacement              |
| T11 | Concurrent activation of conflicting versions | Two datasets serving one board-year                           | **Unbuilt.** Requires an import lock at the storage layer                                                             |
| T12 | Compromised admin account                     | Everything above                                              | MFA, session expiry, re-auth on high-risk actions. **Unbuilt — requires an auth library**                             |

T9, T11 and T12 are open and named rather than quietly omitted. Each is blocked on infrastructure
that does not exist yet.

---

## 5. Why `super-admin` is not omnipotent

It deliberately does **not** hold `dataset.qa.approve`.

If it did, one account could approve a dataset and then activate it, and the separation in T2
would have a hole large enough to drive the entire P0 failure through. Super-admin manages people
and settings and can act in an emergency; it is not a bypass around review.

---

## 6. What must exist before any admin UI ships

In this order:

1. **The gazette parser and ingestion pipeline.** There is nothing to administer until there is.
2. **A storage binding**, chosen against the benchmark in `gazette-result-engine.md` — the
   national dataset exceeds D1's 10 GB limit at a five-year horizon with subject detail.
3. **Authentication**, with MFA and session expiry. No admin route before this.
4. **An import lock**, so two operators cannot activate conflicting versions of one board-year.
5. **Untrusted-file handling** in the parser.

Only then does a screen make sense — and when it is built, it wires to the functions already
here rather than re-implementing the rules.

---

## 7. Emergency actions, available without a deployment

When something goes wrong on result day, the smallest safe actions must not require shipping
code:

| Action               | Role                                      | Separation required?              |
| -------------------- | ----------------------------------------- | --------------------------------- |
| Disable a dataset    | `operations`, `data-admin`, `super-admin` | **No** — the brake must never jam |
| Disable an adapter   | `operations`, `super-admin`               | No                                |
| Change result status | `operations`, `data-admin`, `super-admin` | No                                |
| Reactivate a dataset | `data-admin`, `super-admin`               | **Yes**                           |

Stopping is fast and broadly permitted. Starting is slow and narrowly permitted. That asymmetry
is deliberate.

---

## 8. Documentation

| File                     | Covers                                             |
| ------------------------ | -------------------------------------------------- |
| `admin-architecture.md`  | This document — audit, state machine, threat model |
| `roles-permissions.md`   | The matrix, generated from `lib/admin/roles.ts`    |
| `activation-rollback.md` | The runbook for the highest-risk operations        |

`gazette-import-workflow.md`, `dataset-qa-workflow.md` and the remaining §145 documents are
deferred until the pipeline they would describe exists. Writing a runbook for an unbuilt import
would be describing an imagined system.

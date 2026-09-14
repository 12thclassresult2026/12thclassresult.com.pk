# Data Storage Decision

**Phase:** 2 — Architecture
**Date:** 2026-09-14

---

## Decision

> **No D1. No KV. No R2. Not yet.**
> All data is typed TypeScript in the repository, prerendered at build.
> The only Cloudflare binding is `ASSETS`, which the adapter requires.

This is a deliberate architectural position, not an unfinished step.

---

## 1. What data this system actually holds

| Data                                   | Volume       | Mutation rate         | Who changes it                              |
| -------------------------------------- | ------------ | --------------------- | ------------------------------------------- |
| Board registry                         | 28 rows      | A few times a year    | A human, after verifying a source           |
| Source registry                        | ~40 rows     | When a portal changes | A human, after loading the page             |
| Result datasets (board × year × group) | ~50 rows now | Per session           | A human, after reading a board notification |
| Page registry                          | ~100 rows    | Per page shipped      | A human, in a pull request                  |
| Rechecking figures                     | ~6 boards    | Annually              | A human, from a board PDF                   |
| Gazette references                     | ~30 links    | Per session           | A human                                     |
| **Individual student results**         | **none**     | **never**             | **not held**                                |

Every row changes because **a person verified something**. None changes from user
traffic, and none is generated at runtime.

---

## 2. Why a database would be the wrong answer here

| Argument for D1                     | Why it fails on this data                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| "Result data is relational"         | We hold **no** student results, and the feasibility study says we cannot legitimately obtain any                     |
| "Boards and sources are relational" | 28 rows joined to 40 rows. A `Map` lookup is faster and needs no migration, no binding, no backup and no outage mode |
| "Status changes frequently"         | It changes when a human verifies it — which is a commit                                                              |
| "It will scale"                     | The inventory is ~80–110 URLs, gated on evidence. Scale is not the binding constraint; verification effort is        |

Typed data in the repository gives properties a database would have to reimplement:
**code review on every fact change, git history as an audit trail of provenance, type
safety at the boundary, and no runtime dependency that can be down on result morning.**

That last point matters most. A database is one more thing that can fail at 10:00 AM
while nine boards announce simultaneously.

---

## 3. KV — evaluated and declined, with a clear trigger

KV would be the right store for **source-health snapshots**: read-heavy, non-authoritative,
eventually consistent, exactly its shape.

It is declined because **the thing it would store does not exist yet.** There is no
automated source-health checker, and Phase 1 explicitly warns against building one that
polls government servers aggressively.

**Trigger to adopt KV** — all three must hold:

1. A scheduled source-health checker exists (Cron Triggers, conservative intervals).
2. Its output genuinely changes faster than the deploy cadence.
3. The checking itself has been reviewed for load on the upstream boards.

Until then, adding KV would mean provisioning a binding to hold data nothing produces.

---

## 4. R2 — evaluated and declined

R2 would store gazette PDFs. Four questions must be answered **before** storage, not
after:

| Question                                  | Current answer                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| Are we permitted to redistribute?         | **Unresolved.** No board publishes terms; absence of a prohibition is not permission   |
| Should we store, or link?                 | **Link.** The board's own copy is authoritative and cannot go stale relative to itself |
| How is provenance shown?                  | Source URL, checked date — which linking preserves naturally                           |
| How are duplicates and retention handled? | Unsolved, and unnecessary while linking                                                |

One observed gazette file is 9.4 MB of scanned images; mirroring a national archive is a
meaningful storage and rights commitment for no reader benefit over a link.

**Trigger to adopt R2:** a board grants explicit redistribution permission, **or** a
board's own hosting proves unreliable enough that readers cannot reach documents — and
even then, mirroring would be scoped to that board with the permission recorded.

---

## 5. What lives where

| Data                                  | Location                                         | Format                        |
| ------------------------------------- | ------------------------------------------------ | ----------------------------- |
| Boards, sources, datasets             | `lib/board/`, `lib/result-sources/`              | frozen typed arrays           |
| Page registry, intents                | `lib/content/`                                   | frozen typed arrays           |
| Verified facts + provenance           | inline on the records                            | `VerifiedFact<T>`             |
| Long-form guide prose                 | route components (see `content-architecture.md`) | TSX                           |
| Research evidence                     | `docs/research/`                                 | Markdown                      |
| Owner private exports                 | `research/private/`                              | gitignored                    |
| Images, icons, any future data shards | `public/`                                        | static assets, fetched by URL |

**Data shards are fetched over HTTP, never read with `fs`.** Workers have no filesystem;
the sibling project shipped 499 files into a deployment bundle and still failed in
production because the syscall did not exist. Recorded here so it is not re-learned.

---

## 6. Consistency, privacy and scaling

**Consistency:** every fact is immutable between deploys, so there is no read-your-writes
problem, no cache-invalidation problem, and no partial-update window.

**Privacy:** no personal data is stored at all — which is the strongest possible privacy
posture and the reason `privacy-architecture.md` is short.

**Scaling:** static assets on Cloudflare's edge. Traffic scales without a database
connection pool, a query planner, or a rate limit shared with a storage tier. Result-day
load is served by the CDN.

---

## 7. Revisit conditions

| Condition                                             | Store    | Why                                                |
| ----------------------------------------------------- | -------- | -------------------------------------------------- |
| Automated source-health checking ships                | **KV**   | Genuinely dynamic, non-authoritative, read-heavy   |
| A board grants API access or a data-sharing agreement | **D1**   | Real relational result records with a lawful basis |
| Gazette redistribution permission is granted          | **R2**   | Large files with a rights basis                    |
| Contact forms or submissions are enabled              | **D1**   | Durable writes with retention rules                |
| A page needs true ISR                                 | KV or R2 | The static-assets cache cannot write               |

Each requires its own decision record. **None is pre-provisioned**, and no placeholder id
exists anywhere in the repository.

# Activation and Rollback

The two highest-risk operations in the platform. Activation puts result data in front of
students; rollback is what you reach for when it was wrong.

---

## Before activating anything

The dataset must already be `validated`, which means a **reviewer** compared samples against the
source gazette and signed off. Automated validation does not get you here — it lands on
`qa-required`, because a machine checking ranges has not checked whether these records are the
right people.

Confirm all of it on one screen before pressing anything:

- [ ] Board, year and examination match the source document's own front matter
- [ ] Checksum recorded; the original is preserved unmodified
- [ ] Record count is plausible for that board
- [ ] Rejected records reviewed — not merely counted
- [ ] Duplicate composite keys reviewed and explained
- [ ] Sample QA passed, including page boundaries, first and last records, and unusual statuses
- [ ] The previously active version is identified, so rollback has a target

---

## Activating

```
transition: activate
from:       validated
requires:   dataset.activate
            qaApprovedBy present
            actorId !== qaApprovedBy
            a written reason
```

**You cannot activate a dataset whose QA you approved.** This is enforced in
`applyTransition`, not by policy, and it holds even for a user with both roles. If you hit it,
the fix is another person — not a workaround.

The reason you type is recorded in the audit log. Six months later it is the only thing that
explains the decision, so write what you verified rather than "activating".

---

## When something is wrong — disable first

Do not investigate a live wrong dataset. Stop it, then investigate.

```
transition: disable
from:       active
requires:   dataset.disable + a reason
separation: NONE — deliberately
```

Disabling carries no separation requirement because an emergency brake must never be blocked by
who signed what. `operations` can do it without `data-admin` present.

Lookups fall back to the official portal, SMS and gazette routes. The board page keeps working.
Records are retained — disabling is not deletion.

**A confirmed wrong result shown to any candidate is P0**, regardless of how few saw it. Open an
incident under `docs/incidents/` the moment the dataset is stopped.

---

## Restoring

```
transition: reactivate
from:       disabled
requires:   dataset.rollback + a reason
separation: YES — four-eyes applies again
```

Restoring is an activation and carries the same guard. Understand the root cause before
reactivating: if the fault was in the records rather than the index, reactivating serves the same
wrong data again.

Where a corrected gazette exists, prefer a new version over restoring the old one:

```
register v2 → parse → validate → QA → activate v2 → archive v1
```

`v1` is archived, never deleted.

---

## What is never done

- **No editing individual records to fix a parse.** If the parser produced wrong data, fix the
  parser and reprocess as a new version. A hand-edited record is unreproducible and unauditable,
  and the next import silently overwrites it.
- **No deleting a dataset to make a problem go away.** Disable, archive, supersede. Deletion is
  restricted to a single role and should be genuinely rare.
- **No activation without a reason.** The transition refuses it.

---

## After activating

Watch the not-found rate. If it was ~8% and becomes ~90% after a version switch, that is a parser
or index problem, not a sudden epidemic of mistyped roll numbers. Disable and investigate.

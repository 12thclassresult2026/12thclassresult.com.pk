# Incident Log

One file per meaningful incident, named `YYYY-MM-DD-short-slug.md`.

**No student data, ever.** Not a roll number, not a name, not a father's name, not a CNIC or
B-Form, not marks, not a result payload — not even in a "redacted" example. If an incident
cannot be described without one, describe the shape of the problem instead.

---

## Severity

| Level  | Means                                                                   | Response                         |
| ------ | ----------------------------------------------------------------------- | -------------------------------- |
| **P0** | Personal data exposed · site down · a wrong result shown to a candidate | Immediate mitigation or rollback |
| **P1** | Result flow unavailable · adapter broken · site-wide indexing failure   | Fix immediately                  |
| **P2** | One page or feature affected                                            | Fix promptly                     |
| **P3** | Minor polish or copy                                                    | Schedule normally                |

A board's own portal being down is **not** an incident here. That is expected, it is not ours to
fix, and the fallback ladder exists precisely for it. It becomes an incident only if our site
fails because of it.

---

## Template

```markdown
# <title>

**Date:** YYYY-MM-DD · **Severity:** P0–P3 · **Status:** open / mitigated / closed

## Impact

Who was affected and how. If nobody was, say so plainly.

## Timeline

- HH:MM — what was observed
- HH:MM — what was done

## Root cause

The actual cause, not the symptom. "The parser broke" is a symptom; "the board changed its
table markup and our selector matched nothing, which the parser treated as zero rows" is a
cause.

## Mitigation

What stopped the bleeding — kill switch, rollback, cache, disabling a source.

## Permanent fix

The change that means this cannot recur, plus the test that proves it.

## Preventive action

What else shares this failure mode and has not been fixed yet.
```

---

## The failure mode worth writing up every time

If a lookup ever returns a **wrong or empty result that a reader could believe**, that is P0
regardless of how few people saw it. The engine is built so a parser failure degrades to the
official link rather than to "not found" (ADR-013), so any occurrence means an invariant broke
and the test that should have caught it does not exist yet.

Write that one up in full, and add the test.

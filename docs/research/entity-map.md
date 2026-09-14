# Entity Map — 12th Class / HSSC Part-II

**Phase:** 1 — Research
**Date:** 2026-09-14

Search engines and answer engines resolve this topic as a graph of entities, not as a
bag of keywords. This document models that graph. It is the basis for canonical
ownership, internal linking and schema selection in later phases.

---

## 1. The core spine

```
Class 12  ≡  2nd Year  ≡  Intermediate Part-II  ≡  HSSC Part-II
                        │
                        ▼
                   Examination
        (Annual / Second Annual / Supplementary)
                        │
                        ▼
                      Board ──────── Province / Region
                        │
                        ▼
                       Year
                        │
                        ▼
                     Result
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
    Result Method   Result Date   Result Status
          │
    ┌─────┼─────┬──────────┬─────────┐
    ▼     ▼     ▼          ▼         ▼
 Roll No  Name  SMS    Gazette   Official Portal
```

**The top line is the single most important modelling decision in this project.**
Those four names are one entity, not four. They are naming conventions that differ by
board, province and generation — a Punjab college says "2nd year", a board notification
says "HSSC Part-II", a student's parent says "12th class". Live search confirms the
same URLs rank across all of them.

Consequence: **one canonical owner, synonyms as query variants.** Never four pages.

---

## 2. Post-result branch — what makes this a 12th-class platform

This branch barely exists for 11th class and is the structural reason a 12th-class
site is a different product rather than a word-swap.

```
Result (final HSSC)
   │
   ├── Interpretation ── DMC / result card ── duplicate DMC
   │                  └─ combined Part-I + Part-II marks
   │                  └─ grade / division / percentage
   │
   ├── Dispute & retry ── Rechecking / re-evaluation
   │                   ├─ Second Annual / Supplementary
   │                   └─ Improvement of marks
   │
   ├── Documents ── Certificate ── Verification ── IBCC attestation
   │             └─ Migration certificate / NOC
   │             └─ Corrections (name, father's name, date of birth)
   │
   └── Transition ── Aggregate / merit calculation
                  ├─ University admission
                  ├─ Entry tests (medical, engineering, computing, business)
                  └─ Scholarships
```

**Boundary rule.** Every node here must stay tethered to the HSSC Part-II result
event. The moment content drifts into general career advice with no connection to a
result, a DMC or an aggregate, it stops being this site's topic and starts diluting it.

---

## 3. Academic-resource branch

```
Class 12
   ├── Group ── FA · FSc Pre-Medical · FSc Pre-Engineering · ICS · ICom
   │              │
   │              └── Subject ── Chapter
   │                               │
   │                               └── Resource Type
   │                                     (notes · past papers · pairing scheme ·
   │                                      model paper · guess paper · MCQs ·
   │                                      textbook · syllabus)
   │
   └── Exam Documents ── Date Sheet · Roll Number Slip · Paper Pattern
```

**Group is a real entity, not a synonym.** FA / FSc / ICS / ICom determine subject
sets, marks distribution and admission eligibility. Whether they deserve their own
result pages is a separate question — under research — but they are genuine entities
in the graph regardless.

---

## 4. Entity attributes worth modelling

### Board

Official name · abbreviation · province · official website · result portal ·
jurisdiction/districts · supported examinations · supported methods · gazette
availability · SMS method · contact · verification timestamp

### Examination session

Exam level (HSSC Part-I / Part-II) · session (annual / second annual / supplementary) ·
year · declaration state · declaration date · gazette

### Result method

Requires roll number? · requires an additional identifier (B-Form / CNIC)? ·
presents a CAPTCHA? · official URL · verification status

### Result record

Board · roll number · candidate · group · subjects · marks · grade · status ·
declaration date · **source and fetch time**

---

## 5. Relationships that drive internal linking

```
Board            ─ conducts →        Examination
Examination      ─ produces →        Result
Result           ─ checked via →     Result Method
Result Method    ─ hosted at →       Official Source
Board            ─ publishes →       Gazette · Date Sheet · Notification
Result           ─ disputed via →    Rechecking
Result           ─ retried via →     Second Annual · Improvement
Result           ─ evidenced by →    DMC / Result Card
DMC              ─ required for →    Admission
Result           ─ converted via →   Aggregate formula → Merit
Group            ─ contains →        Subject → Chapter → Resource
Board + Year     ─ has →             Result Status (a VerifiedFact, not a string)
```

These relationships — not keyword similarity — are what should generate internal
links. A board result page links to that board's gazette because the board publishes
it, not because both pages contain the word "gazette".

---

## 6. Entity disambiguation hazards

Recording these because each one, left unhandled, sends a reader to a confidently
wrong page.

| Hazard                                   | Why it matters                                                           | Handling                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Dera Ghazi Khan vs Dera Ismail Khan**  | Different boards, different provinces, near-identical names              | Spell both in full; never abbreviate D.I. Khan to a slug one character from DG Khan. Already enforced by a test. |
| **Karachi intermediate vs matric board** | Distinct entities; one does not award HSSC                               | Never route a 12th-class reader to a matric-only board                                                           |
| **Part-I vs Part-II**                    | A date attached to the wrong part is confidently wrong, not merely stale | Model exam level explicitly; distinguish supersession from mis-assignment                                        |
| **Board vs lookalike domain**            | Lookalike domains present as boards                                      | Ownership must be positively verified; a plausible domain is not evidence                                        |
| **Gazette vs statistics sheet**          | A statistics sheet is not a per-candidate gazette                        | Distinct resource kinds                                                                                          |
| **Result archive vs announcement**       | An archive proves history, never the current session                     | Never infer declaration from a year appearing in a dropdown                                                      |
| **Engine vs dataset**                    | A form offering "12th" and "2026" is a cross-product of options          | Capability flags kept on separate axes                                                                           |

---

## 7. How this maps to schema

Detail in `schema-opportunity-map.md`. In summary: `Organization` and `WebSite` for the
site entity, `WebPage` + `BreadcrumbList` per page, `Article` for genuine editorial
guides, `FAQPage` only where real questions are answered in visible copy.

**Boards are real-world organizations but this site is not them** — so board entities
are described in content and linked to their official sites, never marked up in a way
that implies this site speaks for them.

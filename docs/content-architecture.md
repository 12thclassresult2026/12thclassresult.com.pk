# Content Architecture

**Phase:** 2 — Architecture
**Date:** 2026-09-14

---

## 1. The separation that governs everything

> **Facts are data. Prose is presentation. A fact never appears as a literal in prose.**

| Kind        | Example                                                       | Lives in                      | Changes via                |
| ----------- | ------------------------------------------------------------- | ----------------------------- | -------------------------- |
| **Fact**    | a result date, a rechecking fee, a portal URL, a CAPTCHA flag | typed registries              | verification + code review |
| **Prose**   | explanation, guidance, context                                | route components              | editorial review           |
| **Derived** | a status sentence, a capability table                         | components reading registries | neither — it recomputes    |

A page that hard-codes "Rs 1,300" in a sentence has created a second source of truth that
no gate can check and no re-verification will find. Fees, dates, codes and URLs render
**from the registry or not at all** — which is what `sourceRequirementMode: 'derived'`
already means in the page registry, and it is enforced.

---

## 2. Storage format decision

**Typed TypeScript for facts. TSX for prose. No MDX, no CMS — for now.**

| Option            | Verdict                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Typed TS/JSON     | **Chosen for facts.** Type-safe, reviewable, git-audited, zero runtime cost                      |
| TSX components    | **Chosen for prose.** No new dependency; prose sits next to the data it renders                  |
| MDX               | **Deferred.** Real benefits for long-form authoring, but it is a build-pipeline dependency       |
| Markdown + parser | Deferred, same reasoning                                                                         |
| Headless CMS      | **Rejected.** A network dependency and an unreviewable edit path for facts that must be verified |

**Trigger to adopt MDX:** more than ~10 long-form guides exist, **or** a non-engineer
needs to edit prose. Both are plausible; neither is true at three guides. Adopting it
then is a contained change because prose is already separated from facts.

---

## 3. Content directory shape

```
lib/
├── board/            board registry + types
├── result-sources/   source registry + types
├── result/           result contract, VerifiedFact, capability wording
└── content/
    ├── types.ts      PageEntry, SeoTarget, FreshnessClass
    ├── registry.ts   the page registry
    ├── intents.ts    NEW — canonical intent registry
    └── rechecking.ts NEW — per-board rechecking facts
```

`rechecking.ts` is the pattern for every future fact set: a typed array of records, each
carrying `VerifiedFact` values and provenance, consumed by one component. It is **not**
prose with numbers in it.

```ts
type BoardRechecking = {
  boardId: string
  feePerPaper: VerifiedFact<number>
  processingFee: VerifiedFact<number>
  deadlineDays: VerifiedFact<number>
  mode: VerifiedFact<'online' | 'hybrid' | 'manual'>
  refundIfErrorFound: VerifiedFact<boolean>
  remarkingExcludedStatedByBoard: VerifiedFact<boolean>
  conflictingOfficialFigures?: { value: number; source: string; note: string }[]
}
```

`conflictingOfficialFigures` exists because one board publishes **three different
official rechecking fees** — a statutory rulebook, a fee table and a live portal, all
genuine. The model must represent a real conflict rather than force a choice, and the
page shows the conflict rather than silently picking one.

---

## 4. Freshness fields

Five timestamps, never merged (rationale in `research/freshness-policy.md`):

| Field                          | Question                                              |
| ------------------------------ | ----------------------------------------------------- |
| `contentUpdatedAt`             | When did the content change? Drives sitemap `lastmod` |
| `lastVerifiedAt`               | When were the facts last checked against sources?     |
| `lastReviewedAt`               | When did a human last look at this page?              |
| `sourcePublishedAt` (per fact) | When did the **source** publish this claim?           |
| `checkedAt` (per fact)         | When did we last read that source?                    |

**A build must never move a visible date.** Dates change when facts change or a human
reviews — never because a deployment happened. The observed market practice of stamping
today's date on every page is the anti-pattern this rule exists to prevent.

Class A and B pages **may not publish without `lastReviewedAt`**. A page making volatile
claims with no record of when anyone last verified them is the exact failure this
architecture is built against.

---

## 5. Provenance is structural, not prose

Every volatile fact carries `sourceId`, `sourceUrl`, `sourcePublishedAt`, `checkedAt` and
a status. The `ProvenanceBlock` component renders them uniformly.

This is deliberately _not_ academic citation formatting. The reader needs: **what is the
status, who says so, when did you check.** Three things, one compact module.

It is also what makes correction tractable — when a source changes, the fact is found by
`sourceId`, not by grepping prose.

---

## 6. Content contracts by family

Each page family declares required modules. Full specifications are in
`page-family-specifications.md`; the shape is:

| Family       | Required modules                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| Board result | status sentence · access-model action · capability table · cautions · provenance · per-group status (if applicable) |
| Result hub   | terminology explainer · national board table · method sections · what is not announced                              |
| Gazette      | board/session/year navigation · file offer with source · definition line                                            |
| Rechecking   | what it is and is not · per-board figures · deadline · refund rule · provenance                                     |
| Guide        | direct answer first · numbered procedure · entity definitions                                                       |
| Tool         | the working tool · the rule it implements · worked example                                                          |

**No family requires a fixed word count.** A 700-word page that answers the question beats
a 3,000-word page that buries it — and the AEO research shows the buried version loses
the snippet too.

---

## 7. Editorial rules carried from research

1. **Lead with the fact.** Every page and board section opens with one self-contained,
   entity-qualified sentence. No narrative lede before it.
2. **State volatile facts twice** — as an extractable sentence and in the maintained
   table. Sentences get quoted; tables get scanned.
3. **Qualify the entity** — "HSSC Part-II (12th class), `<Board>`, Pakistan" — because
   the head term is contested by another country's board content.
4. **Never collapse fact status.** Official, tentative, expected, historical and not
   announced are five different sentences.
5. **Say what is not known**, with the date checked. This is the differentiator, not a gap.
6. **No competitor wording, ever.** Structure and topics were researched; expression is
   original.

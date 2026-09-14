# UX Architecture

**Phase:** 2 — Architecture (blueprint; not implemented)
**Date:** 2026-09-14

Design target: **Result Command Center** — a task-first education utility, not a blog and
not a link farm.

---

## 1. The positioning decision

Phase 1 established that **no first-party result checker is possible** — four confirmed
CAPTCHAs, no board API, no permission. Every "checker" in this market, including the best
one, is a router.

The design consequence is decisive:

> **We route honestly, and we make the routing better than anyone else's.**
> We never render a form that cannot work.

That turns the constraint into the product. A reader arrives knowing nothing about their
board's access model; they leave knowing exactly where to go, what it will ask for, and
whether the result even exists yet.

---

## 2. Core journeys

### Journey A — Check my result

```
Landing → Board → [access-model branch] → Result or honest fallback
```

The branch is the architecture. Three genuinely different journeys:

| Access model              | The journey                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `roll-number-portal`      | Status → "what the portal asks for" → outbound link                      |
| `gazette-only`            | Status → **group selection** → the right gazette file → how to search it |
| `session-rotating-portal` | Status → portal **root** + "the session shown rotates"                   |

Every competitor ships only the first. A Karachi reader on a competitor site is offered a
roll-number box for a board that has no roll-number lookup at all.

### Journey B — When is it out?

```
Landing/search → status sentence → confirmed / tentative / expected / not announced
                → source link + last checked
```

Today the honest answer for most boards is "not announced, checked on `<date>`". That is
a better answer than three contradictory dates.

### Journey C — Gazette

```
Result page → gazette → board → session/year → file + how to search it
```

For gazette-only boards this **is** Journey A, not a fallback.

### Journey D — Something went wrong

```
Failure → what kind of failure → the right next step
```

Distinguishing portal-down from result-not-announced from roll-number-not-found is the
whole value. "Try again later" is not an answer.

### Journey E — After the result

```
Result → percentage → rechecking → second annual / improvement → DMC → admissions
```

The decision path, in the order a student actually faces it.

---

## 3. Homepage architecture

The homepage's job, in priority order:

1. **Route to the task** — board selection reachable without scrolling
2. **State the current national position honestly** — including what is _not_ announced
3. **Board discovery**
4. **Say what this site is** — an independent information service, not a board
5. **Route to the Tier-0 guides**

**Not** a 5,000-word SEO article. **Not** the owner of the head result term — that is the
hub's job, and a homepage competing with its own hub splits the signal.

---

## 4. The Result Command Center module

Adapts to board capability rather than showing one fixed form.

| Element             | Behaviour                                                                        |
| ------------------- | -------------------------------------------------------------------------------- |
| Board selector      | 28 boards; grouped by province; searchable when the list grows                   |
| Status chip         | **Text + icon**, never colour alone. Five fact states → five distinct treatments |
| Status sentence     | The extractable AEO unit                                                         |
| Primary action      | Driven by `accessModel` — link, gazette navigation, or portal root               |
| Requirements notice | Only where verified: extra identifier, security check                            |
| Fallback ladder     | Ordered by that board's real capabilities                                        |
| Provenance          | Source link + last checked                                                       |

**Forbidden:** a roll-number input where no lookup exists · a countdown on an
unconfirmed date · "LIVE" without verification · a synthetic verification delay · a
progress animation that represents no work.

The last three were all observed live in this market.

---

## 5. The 28-board selector problem

Nobody in the market has solved this — every implementation is a long dropdown or a
repeated list, and most ship the same board list two or three times per page.

**Approach:** province-grouped cards at rest; type-ahead filter once the count justifies
it; the selector appears **once** per page. Planned boards are shown with their status —
honest coverage beats a shorter list.

---

## 6. Status vocabulary

Fact status maps to fixed wording. The interface may never smooth these together:

| Status       | Wording                                                           |
| ------------ | ----------------------------------------------------------------- |
| `confirmed`  | "Official result date: …"                                         |
| `tentative`  | "Tentative date, per the board's own provisional notification: …" |
| `expected`   | "Expected — our inference, not a board announcement"              |
| `historical` | "In 2025 the result was declared on …"                            |
| `unknown`    | "The board has not published a confirmed date yet."               |

Capability status uses its own vocabulary — and `unknown` never renders as "No".

---

## 7. Mobile architecture

Mobile is the default, not a breakpoint. Test widths: 320 · 360 · 390 · 430 · tablet ·
desktop.

| Requirement                         | Implementation                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| No horizontal overflow at any width | `overflow-x: hidden` on root, plus `.table-responsive-wrapper` on every wide table |
| Touch targets                       | `min-h-11` (44px); submit `min-h-12`                                               |
| Result tables readable              | Horizontal scroll inside the table's own container — never the page                |
| Zoom                                | Never disabled; `maximumScale: 5`                                                  |
| Navigation                          | Accessible disclosure, focus managed, no giant desktop tree dumped onto mobile     |
| No layout shift                     | Reserved dimensions for any future ad or media slot                                |

Wide tables with no scroll container were the single most common mobile defect observed
across competitors.

---

## 8. Accessibility architecture — WCAG 2.2 AA

Structural, not a QA patch at the end.

| Requirement    | Implementation                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Skip link      | First tab stop, visible on focus (built)                                                        |
| Landmarks      | `header` / `main#main` / `footer` (built)                                                       |
| Heading order  | Never skipped — a competitor's H2→H4 jump is the anti-pattern                                   |
| Form labels    | **Visible `<label>`**, never placeholder-only — the market-leading task page fails exactly here |
| Errors         | Associated via `aria-describedby`, `aria-invalid`, and described in text                        |
| Status updates | `aria-live="polite"` on result status                                                           |
| Focus          | 3px visible ring, never removed (built)                                                         |
| Colour         | Never the only signal — every status has icon + text                                            |
| Reduced motion | Honoured globally (built)                                                                       |
| 200% zoom      | Usable without horizontal scrolling                                                             |
| Tables         | Real `th` with scope; `caption` where needed                                                    |

No competitor evidenced focus styling or accessible status. This is a differentiator, not
just compliance.

---

## 9. Performance architecture

Targets: **LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1**.

| Strategy                           | Status                                                      |
| ---------------------------------- | ----------------------------------------------------------- |
| Server Components by default       | Built — zero client JS beyond the error boundary            |
| Static prerendering                | Built                                                       |
| Prerender cache staged into assets | Built — the Error 1102 guard                                |
| Minimal hydration                  | Small islands only                                          |
| Fonts                              | `next/font`, `display: swap`, subset                        |
| Images                             | Sized for display, served from assets with security headers |
| Third parties                      | **None today.** CSP admits none                             |
| DOM size                           | Kept small; no 100+ link footers                            |
| CLS                                | Reserved dimensions; no late-injected banners               |

The market's Core Web Vitals problems come from ad injection, link farms and heavy
client rendering. Avoiding all three is most of the work.

---

## 10. Trust surface

Trust is earned structurally, not with badges:

1. **Provenance on every volatile fact** — source, link, checked date
2. **A plain disclaimer** — independent service, not a board, verify at the source
3. **Outbound official links** treated as the product, not a leak
4. **Honest absence** — "not verified" stated, with the date
5. **No board impersonation** — never a board-like subdomain, crest or name

The market's contradictions — three dates for one result, four shortcodes for one board —
mean an accurate, dated, sourced page is itself the differentiator.

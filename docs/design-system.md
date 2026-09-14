# Design System

**Phase:** 3 — as implemented
**Date:** 2026-09-14
**Tokens:** `app/globals.css` · **Primitives:** `components/ui/` · **Domain components:** `components/result/`

Documents what exists. Nothing here describes a component that has not been built.

---

## 1. Tokens

Tailwind v4 — there is no `tailwind.config.js`. `@theme` generates utility classes;
`:root` carries semantic aliases that components reference directly.

### Colour

| Scale            | Role                                                            |
| ---------------- | --------------------------------------------------------------- |
| `ink-50…950`     | Neutral, slightly cool so it sits under indigo without muddying |
| `primary-50…950` | Indigo. Structure, links, trusted signals                       |
| `accent-100…700` | Amber. Reserved for the primary task; never decorative          |
| `status-*`       | One per fact state, each with a `-bg` pair                      |

Deliberately **not** the sibling 11th-class project's teal. A 12th-class platform is its
own product; indigo reads as academic authority, and the single warm accent marks the one
thing that should draw the eye.

### Status colours map 1:1 onto fact states

`confirmed` · `tentative` · `expected` · `unknown` · `danger`

There is a distinct token for `tentative` precisely so it can never be rendered with the
same treatment as `confirmed`. A board calling its own date provisional is a different
claim from a board stating it as fact, and the interface must not blur them.

### Semantic aliases

`--surface` · `--surface-raised` · `--surface-sunken` · `--surface-hero` ·
`--border-subtle` · `--border-card` · `--text-strong` · `--text-body` · `--text-muted` ·
`--text-on-dark` · `--shadow-card` · `--shadow-card-hover` · `--shadow-elevated`

### Radii and type

`--radius-card` 0.75rem · `--radius-badge` 0.375rem · `--radius-button` 0.5rem.
One family: Inter via `next/font`, `display: swap`, variable `--font-inter`.

---

## 2. Components as built

### `StatusChip` — `components/ui/status-chip.tsx`

Five states, each with **its own glyph, its own words and its own colour**.

> **Colour is never the only signal.** The chip is readable in monochrome, by a screen
> reader, and by someone who cannot distinguish the colours.

There is deliberately no generic variant: a status the model cannot express is a status
we should not show.

### `AccessModelAction` — `components/result/access-model-action.tsx`

**The correctness boundary of the site.** Switches on `board.accessModel` to choose the
primary call to action:

| Model                     | Action                                                      | Never renders          |
| ------------------------- | ----------------------------------------------------------- | ---------------------- |
| `roll-number-portal`      | Portal link + what it asks for                              | —                      |
| `gazette-only`            | Gazette navigation, and says plainly that no checker exists | Any roll-number prompt |
| `session-rotating-portal` | Portal root + rotation warning                              | A deep session link    |
| `unverified`              | Board homepage + what is unverified                         | Any capability claim   |

The `default` branch assigns to `never`, so adding a board model without handling it is a
build failure rather than a silently wrong page.

### `StatusSentence` — `components/result/status-sentence.tsx`

One self-contained, entity-qualified sentence — board, examination, class, session,
country, status, date — rendered **before any narrative**. Answer engines quote a
sentence; they do not quote a table.

Carries `aria-live="polite"` so a future status refresh is announced rather than silently
swapped.

### `PerGroupStatus` — `components/result/per-group-status.tsx`

One row per group, because "one board, one date" is false. Karachi declared its 2026
groups across four weeks with one still outstanding; a single board-level banner would be
wrong for that group's candidates.

### `ProvenanceBlock` — `components/result/provenance-block.tsx`

Status · source link · published date · last checked. Compact, not academic citation
formatting. A fact with no source says so in words.

Dates are formatted by hand rather than through `Date`, because timezone parsing can slip
a day — and on a result-date page a day is a factual error.

### `Breadcrumbs` — `components/seo/breadcrumbs.tsx`

Rendered from the same registry array that feeds `breadcrumbSchema`, so visible and
structured-data breadcrumbs cannot disagree.

---

## 3. Accessibility conventions

| Convention                                       | Where                          |
| ------------------------------------------------ | ------------------------------ |
| Skip link, first tab stop, visible on focus      | `app/layout.tsx`               |
| Landmarks: `header` / `main#main` / `footer`     | `app/layout.tsx`               |
| Visible focus ring, 3px, never removed           | `globals.css` `:focus-visible` |
| Touch targets ≥ 44px                             | `min-h-11`; submit `min-h-12`  |
| Zoom never disabled                              | `viewport.maximumScale: 5`     |
| Reduced motion honoured                          | `globals.css` media query      |
| Status never colour-only                         | `StatusChip` glyph + text      |
| Real `th` with `scope`, `caption` on every table | result and capability tables   |
| Wide tables scroll in their own box              | `.table-responsive-wrapper`    |

The market-leading competitor's task page uses placeholder-only inputs with no visible
labels. Any form this project builds uses real `<label>` elements.

---

## 4. Responsive rules

Mobile is the default, not a breakpoint. `.container-wide` is the single page container —
one definition, so gutters cannot drift.

`overflow-x: hidden` on both `html` and `body`, plus a scroll wrapper on every wide
table. Wide tables with no scroll container were the most common mobile defect observed
across competitors.

---

## 5. What is deliberately absent

No countdown timer · no "LIVE" badge · no synthetic progress or verification delay ·
no ad slots · no board logos or crests · no icon library · no animation library ·
no UI framework beyond Tailwind.

Each of the first three was observed live in this market. The site must never look like
it is doing work it is not doing.

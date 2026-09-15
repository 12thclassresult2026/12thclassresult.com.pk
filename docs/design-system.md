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

| Scale            | Role                                                          |
| ---------------- | ------------------------------------------------------------- |
| `ink-50…950`     | Neutral, slightly cool so it sits under navy without muddying |
| `primary-50…950` | Deep navy. Structure, header and hero grounds, links          |
| `accent-50…700`  | Emerald. Reserved for the primary action; never decorative    |
| `status-*`       | One per fact state, each with a `-bg` pair                    |

**Changed 2026-09-15.** This was indigo + amber, chosen to look deliberately unlike the
sibling 11th-class site. The owner of both sites asked for one house style across the
family, so the palette is now the sibling's navy + emerald and the old rationale is gone
rather than left here to mislead.

Only `accent-600` and `accent-700` may carry white text — both were set by contrast, not
by eye (~4.9:1 and ~6.8:1). `accent-500` is a fill for dark text only; white on it lands
near 3.6:1 and fails.

`status-confirmed` is held at a green distinct from the emerald accent. If the two ever
converge, an accent button starts reading as a confirmed fact.

### What did not come across from the sibling's design

Three of its sections would break invariants here, so they are styled to match and filled
only with what this project has verified:

| Sibling section              | Why it could not be copied                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| SMS shortcode cards          | No shortcode is verified here, and an E2E test asserts the circulating ones never render |
| Roll-number box in the hero  | `BOARD_ADAPTERS` is empty by policy, and a gazette-only board has no lookup to route to  |
| Star ratings on gazette PDFs | Fabricated rating data, and fabricated review structured data with it                    |

The hero control is a **board picker** instead: the honest version of the same job, since
the first real step for every visitor is finding which board publishes their result.

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
Inter via `next/font`, `display: swap`, variable `--font-inter`.

A second face, **Noto Nastaliq Urdu** (`--font-nastaliq`), exists for one purpose: the Urdu
tagline in the header and footer. Inter has no Arabic-script coverage, so without it the
line falls back to whatever the device has — usually a Naskh face, which renders the words
correctly but not in the style the writing is read in. Scoped to one weight and the Arabic
subset, applied to eight words in total, `display: swap` so it never blocks paint.

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

### `BoardFinder` — `components/result/board-finder.tsx`

The hero's primary control, and **the only client component on the homepage**.

It is a board picker, not a roll-number box. Behind every competitor's roll-number hero
there is no lookup: no board publishes an API or permits automation, and `BOARD_ADAPTERS`
is empty here by policy. A box that takes a roll number and cannot answer is a promise the
page cannot keep — and on a gazette-only board there is no roll-number route to send the
reader to at all.

Boards without a page appear in their own `<optgroup>` rather than being dropped, and
selecting one explains why and routes to the directory. The explanatory line is
`aria-live="polite"` and changes with the selection, so a reader who picked a published
board is never warned about a limitation that does not apply to them.

### `FaqAccordion` — `components/ui/faq-accordion.tsx`

Native `<details>`: no state, no JavaScript, works unhydrated.

Items are passed as plain strings because **the same array feeds `faqSchema()`**. A
rich-result answer that does not appear on the page is a structured-data violation, and it
is the easy mistake to make when the two are maintained separately.

### `SiteHeader` / `SiteFooter` — `components/layout/`

Both server components. The mobile menu is a `<details>`, so the header stays operable if
hydration never happens — it is the one component that must never depend on it.

**Navigation rule:** every entry points at a page that exists. The sibling's menu carries
"Date Schedule", "Gazette 2026" and "SMS Codes"; those pages are not built here, and
advertising them would put a 404 behind the most-clicked element on the site. A link is
added in the same commit as its page.

The footer omits the sibling's contact address and social icons for the same reason: no
mailbox and no accounts exist yet. A printed `contact@…` would sit on every page and
silently swallow every correction a reader tried to send.

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

**All of it survived the 2026-09-15 redesign**, which is the point of writing it down. The
sibling layout that was adopted has a board-logo grid and a scrolling "Latest Update"
banner carrying a tentative date. The logo grid was not copied — board crests are a
board's marks, and a site that is not a board should not wear them. The banner slot was
kept, in the same position and with the same weight, and states what is actually true:
that no 2026 date has been confirmed.

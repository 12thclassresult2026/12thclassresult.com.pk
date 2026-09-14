# Competitor Design & UX Audit

**Phase:** 1 — Research
**Date:** 2026-09-14
**Method:** served HTML/markdown, not rendered pixels. No headless browser was
available, so mobile and advertising findings are **inferred from markup** and flagged
where uncertain — JavaScript-injected ad units can be invisible to this method.

> Structure is described. **No competitor CSS, markup, wording or visual identity is
> reproduced anywhere in this project.**

---

## 1. Per-site signature

| Site                           | What it is                                 | Defining trait                                                                                                                               |
| ------------------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **punjabresults.pk**           | The only site where the task _is_ the page | Form in the first content block: board + session + roll number, one button. Ad-free. Clean heading order. Breadcrumb.                        |
| **12thclassresult2026.com.pk** | Landing page with the task buried          | **Best-labelled form** in the market (real labels, required markers) and the best sourcing sentence — but it sits 2–3 screens under SEO copy |
| **2ndyearresult2026.pk**       | Procedure written as prose                 | **No result form at all.** But the clearest status label and a real source sentence naming the schedule-issuing committee                    |
| **result.pk**                  | Link soup                                  | 200+ internal links, **no H1**, no disclaimer, board-impersonating subdomains                                                                |
| **ilmkidunya**                 | Link index + per-board pages               | 5+ house banners **above** the content; the board "form" has **no roll-number field** — it is a router to the official portal                |
| **taleem360**                  | Faceted document archive                   | Best breadcrumb; **the only published + last-updated pair** in the market; download states file size with no gate                            |
| **biseresults.com**            | Long-form guide                            | **23 board tiles all link to `#`** — the navigation is decorative                                                                            |

---

## 2. Findings by dimension

### Task placement

Only **one** site puts the result task above the fold. Two bury it under prose and
banners; four have **no working lookup at all** and describe the steps in paragraphs.

### Board selector

Four patterns observed: a single `<select>` (10–22 options), a logo/SMS-code card grid,
region-grouped link lists, and faceted dropdowns. **Nobody offers type-ahead search**,
and most sites ship the same board list two or three times on one page.

### Status and countdowns

Best practice observed: a **text** status chip plus date, time and **timezone**.
Two countdowns exist and **both serialise as all-zeros in the HTML** — they are
decoration that depends entirely on client script. Two sites name the committee that
issues the schedule; **neither links the document**.

### Trust signals

Disclaimers on three of seven. Real outbound board links on two. **One** honest
updated stamp. One site stamps _today's date_ as "Updated on" — on every page.

### Mobile (inferred from markup)

The recurring hazard is **wide tables with no overflow container** — a 6-column subject
table, a 4-column grade table, a grading table. A 100+ link footer and a bottom
WhatsApp modal are the worst narrow-screen offenders.

### Advertising

Two genuinely clean sites. One runs house banners **above the form**. The worst is an
overlay plus banner. **The deceptive patterns here are not ad units** — they are
look-alike official links and fake verification delays (see §4).

### Tables, FAQ, navigation

Useful table headers exist in the market (`Board | Official website | SMS code`;
`Percentage | Marks (out of 1100) | Grade | Meaning`). **None is responsive-hardened.**
Every site renders FAQs as plain expanded headings — **not one accordion** — running
from 4 to 21 questions. Breadcrumbs on two of seven; the rest substitute footer link
farms.

### Empty and error states

Almost entirely absent. Three honest exceptions worth stealing as _concepts_:
placeholder dashes until a statistic exists; a "if you cannot find your result,
download the gazette" fallback; and an explanation that a slow page means traffic, not
failure.

### Accessibility

The market-leading task page uses **placeholder-only inputs with no visible labels**.
The counter-example is a site with real labels and required markers. One site skips
from H2 to H4. **No focus styling and no JSON-LD was evidenced anywhere.**

---

## 3. Patterns worth adopting — as concepts, not copies

1. **Task first**: board + session + roll number, three fields, one button, above the fold, with nothing competing around it.
2. **A text status chip**, never colour alone, paired with date + time + **timezone**.
3. **Name the source of a date in a sentence and link the document**, and say plainly that it can change.
4. **One canonical board table**: board, official portal, SMS code — with the official link genuinely outbound.
5. **The honest router pattern**: where the board is the authority, hand the reader off cleanly and say so. Pretending to be the checker is the market's core dishonesty.
6. **Published _and_ last-verified dates as a pair**, per fact block.
7. **Faceted filtering for gazettes** (board / session / year) with breadcrumbs.
8. **Downloads that state file size**, with no interstitial or countdown gate.
9. **Honest empty states** — a dash until data exists; explain a slow page; explain what to do when a roll number returns nothing.
10. **Procedures as numbered steps**, and a marks/grading table, instead of prose.
11. **A visible unofficial-site disclaimer** plus "verify on your board's own site".

---

## 4. Anti-patterns — each observed live in this market

| Anti-pattern                                                      | Why it is disqualifying                                                             |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Countdowns that ship as zeros**                                 | Decoration masquerading as data                                                     |
| **Countdowns to a date with no cited source**                     | The whole market does this; no board has announced a Punjab 2026 date at all        |
| **"Updated on: [today]" auto-stamps**                             | Freshness theatre. Directly contradicts our four-timestamp policy                   |
| **Fake "Verifying details… ready in 10" delays**                  | A synthetic wait before an outbound link. Manufactures the appearance of doing work |
| **Board-impersonating subdomains and names**                      | Readers cannot tell an aggregator from the board                                    |
| **House banners above the result task**                           | The task is the product; anything above it competes with it                         |
| **Join-our-channel overlays on a task page**                      | Interrupts the one thing the reader came for                                        |
| **Board lists repeated three times per page**                     | Length as a substitute for structure                                                |
| **100+ link footers as navigation**                               | Crawl noise, not wayfinding                                                         |
| **Result pages with no form**, describing steps in paragraphs     | Claims a task it does not perform                                                   |
| **Navigation tiles linking to `#`**                               | Decorative navigation; 23 dead tiles on one page                                    |
| **Wide tables with no scroll container**                          | Guaranteed horizontal overflow on a phone                                           |
| **Placeholder-only form fields**                                  | The label disappears the moment typing starts                                       |
| **Skipped heading levels**                                        | Breaks assistive-technology navigation                                              |
| **21-question FAQ walls**                                         | Volume in place of answering the question                                           |
| **Fees and deadlines as vague ranges with no source and no date** | The specific failure our provenance model exists to prevent                         |

---

## 5. What this means for our design

The market's weaknesses are **structural and honest-to-fix**, not aesthetic:

- Nobody combines a genuine above-the-fold task **with** real provenance. One site has the task; another has the sourcing sentence; no site has both.
- Nobody has solved the **30-board selector** problem — every pattern is a long dropdown or a repeated list.
- Nobody handles **gazette-only boards** (Karachi, Hyderabad, AJK) as a distinct journey, though for those boards the gazette is the _only_ official route.
- Nobody models **group-wise staggered declarations**, so every site is structurally wrong about Sindh.
- Accessibility is uniformly weak — which means a genuinely accessible result form is a differentiator, not just compliance.

The design target follows directly: **task first, provenance visible, honest about what we are, and correct about the boards that do not fit the Punjab model.**

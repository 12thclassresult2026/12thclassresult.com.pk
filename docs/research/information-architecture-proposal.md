# Information Architecture Proposal

**Phase:** 1 — Research (**recommendation only — nothing here is implemented**)
**Date:** 2026-09-14

Derived from `entity-map.md`, `keyword-cluster-map.md`, `board-capability-matrix.md`
and `../seo/cannibalization-map.csv`.

---

## 1. Three structural decisions that drive everything

### 1.1 One canonical owner for the head intent

"12th class result", "2nd year result", "HSSC Part-II result" and "inter part 2 result"
return the same domains and frequently the same URLs. **One page owns this**; the
synonyms are query variants. No synonym URLs, ever.

### 1.2 The evergreen hub is the durable asset, not the year page

No competitor maintains year-stamped archive URLs — their year-stamped equivalents
**404** while the yearless page resolves and carries the year in its title. Sites that
bake the year into the _domain_ have a one-season architecture.

So `/results/12th-class` is the permanent canonical owner, and the year page is a
**status surface** hanging off it — valuable in season, never the primary asset.

### 1.3 Boards do not share one model — the IA must express that

| Board model                   | Boards                           | Journey                                                          |
| ----------------------------- | -------------------------------- | ---------------------------------------------------------------- |
| **Roll-number portal**        | Most of Punjab, KPK, Balochistan | Select board → go to official portal → check                     |
| **Gazette-only**              | Karachi, Hyderabad, AJK          | Select board → **find the right gazette file** → search it       |
| **Group-staggered**           | Karachi, Hyderabad               | Select board → **select group** → each has its own date and file |
| **Session-at-a-time portal**  | Peshawar, Mardan                 | The portal exposes one exam at a time; deep links rot            |
| **Extra identifier required** | Sargodha, Bahawalpur             | Warn before the reader leaves                                    |

**Every competitor encodes only the first model.** An IA that assumes "board → roll
number" is structurally wrong for roughly a fifth of the country.

---

## 2. Proposed hierarchy

```
/                                     Home — navigational, does NOT own the head term
│
├── /results/12th-class               ★ CANONICAL OWNER of the head intent
│   ├── /2026                         Current-session status, board by board
│   └── /<board-slug>/12th-class/<year>   Board result pages
│
├── /boards                           Board directory — all 26 + 2 private
│   └── /boards/<board-slug>          Board hub (institutional) — CONDITIONAL
│
├── /gazettes/12th-class              Gazette hub — board × session × year
│   ├── /<board-slug>                 Per-board gazette listing
│   └── /archive                      Historical gazettes
│
├── /guides/
│   ├── rechecking                    ★ Highest-value gap
│   ├── second-annual                 (also owns "supplementary")
│   ├── improvement
│   ├── lost-roll-number              ★ Weakest surface in the market
│   ├── result-card-dmc
│   ├── how-percentage-is-calculated
│   └── after-12th-admissions         CONDITIONAL
│
├── /tools/
│   └── percentage-calculator         ★ Currently answered with the wrong methodology
│
└── /updates/                         Board notifications — CONDITIONAL, source-gated
```

### Slug conventions

`<board-slug>` is `{city}-board` throughout: `lahore-board`, `multan-board`,
`karachi-board`, `federal-board`, `quetta-board`, `mirpur-board`.

**Two mandatory safety rules:**

1. **`dg-khan-board`** (Punjab) and **`dera-ismail-khan-board`** (KPK) — D.I. Khan is
   _never_ abbreviated. A reader landing on the wrong one gets a plausible page for the
   wrong province. Already enforced by a test.
2. **`karachi-board` means the intermediate board.** The Karachi _secondary_ board is
   matric-only and must never receive a 12th-class reader.

---

## 3. Page families — decisions

| Family                            | Decision                            | Justification                                                                                                                                                                       |
| --------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage                          | **APPROVE**                         | Navigational; owns the brand, not the head term                                                                                                                                     |
| Evergreen result hub              | **APPROVE**                         | One canonical owner; durable across years                                                                                                                                           |
| Year result hub                   | **APPROVE**                         | Distinct status intent                                                                                                                                                              |
| Board result page                 | **APPROVE**, per board, on evidence | Distinct entity: own portal, own requirements, own status                                                                                                                           |
| Board hub (institutional)         | **CONDITIONAL**                     | Only if it carries value the result page does not — jurisdiction, contact, notifications. Otherwise merge                                                                           |
| Province hub                      | **CONDITIONAL**                     | Only where a province genuinely shares something (e.g. a single committee schedule across nine boards). **No hub for a single-board region** — it would duplicate that board's page |
| Result date page                  | **MERGE** into the year hub         | One question; and no board-sourced date exists yet                                                                                                                                  |
| Roll-number method                | **MERGE** as a hub section          | One competitor serves all four methods from one page and ranks for each                                                                                                             |
| Name method                       | **REJECT**                          | Most boards do not offer it; where it exists it is an enumeration risk, not a feature                                                                                               |
| SMS method                        | **NOINDEX / BLOCKED**               | Zero verified shortcodes nationally                                                                                                                                                 |
| Gazette hub + per board           | **APPROVE**                         | Distinct task; **for gazette-only boards it is the only official route**                                                                                                            |
| Gazette archive                   | **APPROVE**                         | Separate archival intent; the one gazette surface where boards themselves rank                                                                                                      |
| Group pages (Punjab model)        | **CONDITIONAL**                     | Only with genuine group-specific content — see `keyword-cluster-map.md` §3                                                                                                          |
| Group results (Sindh model)       | **APPROVE**                         | Separate declarations up to four weeks apart, separate gazettes                                                                                                                     |
| Rechecking                        | **APPROVE**                         | Total vacuum; we hold real board-published fees                                                                                                                                     |
| Second annual (+ supplementary)   | **APPROVE**                         | One page, both vocabularies                                                                                                                                                         |
| Improvement                       | **APPROVE**                         | Distinct eligibility; actively confused with second annual                                                                                                                          |
| Lost roll number                  | **APPROVE**                         | Weakest surface observed                                                                                                                                                            |
| DMC / result card                 | **APPROVE**                         | Near-zero legitimate coverage                                                                                                                                                       |
| Percentage calculator + explainer | **APPROVE**                         | Existing answers use a foreign, wrong methodology                                                                                                                                   |
| Position holders                  | **REJECT**                          | No official source                                                                                                                                                                  |
| Certificate verification          | **REJECT**                          | The official body owns its own intent                                                                                                                                               |
| Entry-test aggregate calculators  | **REJECT**                          | Crowded, settled, established incumbents                                                                                                                                            |
| Admissions guidance               | **CONDITIONAL**                     | Must stay tethered to result/DMC/aggregate or it becomes a careers blog                                                                                                             |
| Academic resources                | **NEEDS EVIDENCE**                  | Scope and maintainability question                                                                                                                                                  |
| Internal search / filters         | **NOINDEX**                         | Never indexable                                                                                                                                                                     |
| Personal result responses         | **NEVER A URL**                     | No `/result/<roll-number>`, ever                                                                                                                                                    |

---

## 4. The board page content contract

A board page ships **only** if it carries board-specific verified facts. Minimum:

1. **The status sentence** — board + exam + session + status + date + time + timezone, self-contained and extractable.
2. **The official portal link**, with what it actually asks for (extra identifier? security check?).
3. **The right journey for that board's model** — roll-number portal, or gazette, or group selection.
4. **Board-specific cautions** — expired certificates, portals serving one session at a time, dead links the board itself publishes.
5. **Provenance** — source link, and the date we last checked.

**A board page that is the year hub with a name swapped must not ship.** That is the
single most common failure in this market.

---

## 5. Indexation recommendations

| Surface                                        | Index?                            | In sitemap?         |
| ---------------------------------------------- | --------------------------------- | ------------------- |
| Home, evergreen hub, year hub, board directory | Yes                               | Yes                 |
| Board result pages                             | Yes, **after publication review** | Yes, once published |
| Gazette hub, per-board gazette, archive        | Yes                               | Yes                 |
| Guides, tools                                  | Yes                               | Yes                 |
| Board hubs                                     | Only if approved as distinct      | If indexed          |
| Planned boards (registered, no page)           | **No page exists**                | No                  |
| SMS pages                                      | Not built                         | No                  |
| Internal search, filters, sort params          | **noindex**                       | No                  |
| Personal result responses                      | **No URL exists**                 | No                  |

---

## 6. Internal linking

Rules are in `internal-link-graph.md`. The IA-specific additions:

- The evergreen hub links **down** to the year hub and **across** to the board directory.
- Board result pages link **up** to the hub, **across** to that board's gazette, and **out** to the board's own site.
- Gazette-only boards link to the gazette **as the primary action**, not as a fallback.
- Post-result guides cross-link along the real decision path: rechecking → second annual → improvement.
- **No board links to another board.** A Lahore reader has no interest in Peshawar.

---

## 7. Build order

1. **Phase 2a** — evergreen hub, year hub, board directory (built), plus the rechecking, lost-roll-number and percentage guides. These are the vacuums, and none depends on an unannounced result.
2. **Phase 2b** — board pages one at a time, each through a publication review, starting with boards whose evidence is strongest.
3. **Phase 2c** — the gazette system, starting with boards where the gazette is the _only_ route.
4. **Phase 2d** — group handling: Sindh first (real events), Punjab group pages only if genuine group content exists.
5. **Phase 2e** — Urdu surface; DMC and document admin; admissions guidance if it stays tethered.

**Registry-first throughout:** a board is registered — and therefore nameable in the
directory with its official source — long before it has a page.

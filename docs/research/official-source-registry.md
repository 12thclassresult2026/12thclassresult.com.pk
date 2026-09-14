# Official Source Registry — National Evidence Record

**Phase:** 1 — Research
**Date:** 2026-09-14
**Machine-readable counterpart (Punjab + Federal only, so far):** `lib/result-sources/registry.ts`

This document records _how_ each source was verified. It now covers the full national
board universe; the code registry currently covers Punjab and Federal only, and
expanding it is a Phase 2 task.

---

## 1. The evidence standard

A domain is treated as **officially owned by a board** only when identifying details
were observed on the live page that a squatter or aggregator would not carry — the
board's formal name, a government affiliation line, a physical address, its own
copyright line, and a `.edu.pk` registration where applicable.

**Search listings and competitor sites were used ONLY to discover candidate domains —
never as evidence of a fact.**

Enforced corollaries: `isOfficial: true` requires verified ownership; a source with
`observedVia: 'not-observed'` may claim no capabilities, no exam levels, no years and no
successful check; every source carries a provenance note recording what was seen **and
what was not**.

### Government sources that resolved the board universe

Three authoritative listings were located and used to settle scope — a significant
upgrade on guessing:

| Authority                                                             | What it settled                                                                   |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| The federal inter-board body's member directory                       | National board membership; absence of any GB board                                |
| The KP elementary & secondary education department's own BISE listing | **Exactly 8** KPK boards; no Swabi/Nowshera/Charsadda/Dir/Haripur board exists    |
| The Government of Sindh Universities & Boards Department listing      | **Exactly 8** Sindh entries, distinguishing intermediate, secondary and technical |

---

## 2. Access policy

`AUTOMATED_FETCH_POLICY = 'do-not-bypass'`.

During this research: no user agent was spoofed, no browser emulated, no CAPTCHA
touched, no form submitted, no candidate identifier entered, and **no URL constructed
by editing a year token in someone else's address** — every gazette and result URL
cited was read from a link the board itself published.

Blocked hosts are recorded as `blocked` with `observedVia: 'not-observed'`. **A 403 is
never recorded as an outage** — it is a WAF user-agent block, and those sites are very
likely fine in an ordinary browser.

---

## 3. Registered and candidate sources by region

### Punjab + Federal — in the code registry

See `result-source-risk-register.md` for the technical detail on each.

| id                                                 | Board      | Type             | Observed         | Status          |
| -------------------------------------------------- | ---------- | ---------------- | ---------------- | --------------- |
| `lahore-result-portal`                             | Lahore     | result           | automated-fetch  | online          |
| `gujranwala-result-portal` / `gujranwala-gazette`  | Gujranwala | result / gazette | automated-fetch  | online          |
| `faisalabad-official-base`                         | Faisalabad | homepage         | **not-observed** | blocked         |
| `multan-result-archive` / `multan-gazette`         | Multan     | result / gazette | automated-fetch  | online          |
| `rawalpindi-result-portal`                         | Rawalpindi | result           | automated-fetch  | online          |
| `sargodha-result-portal`                           | Sargodha   | result           | automated-fetch  | online          |
| `bahawalpur-result-portal` (+ second-annual route) | Bahawalpur | result           | automated-fetch  | online          |
| `sahiwal-result-portal` / `sahiwal-gazette`        | Sahiwal    | result / gazette | automated-fetch  | online          |
| `dg-khan-result-directory`                         | DG Khan    | result           | automated-fetch  | **conflicting** |
| `fbise-result-portal`                              | FBISE      | result           | **not-observed** | blocked         |

### Khyber Pakhtunkhwa — verified, not yet in the code registry

| Board      | Verified host         | Result route                                          | Status                      |
| ---------- | --------------------- | ----------------------------------------------------- | --------------------------- |
| Abbottabad | `biseatd.edu.pk`      | `/all_results.php` — Class + Year + Session + Roll No | online                      |
| Swat       | `bisess.edu.pk`       | `/site/home/results-section`                          | online                      |
| D.I. Khan  | `bisedik.edu.pk`      | `/results` — Class + Year + Exam code + Roll No       | online                      |
| Malakand   | `bisemalakand.edu.pk` | `/result/latest-supply`                               | online                      |
| Bannu      | `biseb.edu.pk`        | `/result-search.php` — **CAPTCHA observed**           | online                      |
| Mardan     | `web.bisemdn.edu.pk`  | `result.bisemdn.edu.pk`                               | online                      |
| Peshawar   | `bisep.edu.pk`        | `cloud.bisep.edu.pk` (301 from `/results/`)           | online                      |
| **Kohat**  | `bisekt.edu.pk`       | **not confirmed**                                     | **blocked (403 all paths)** |

Peshawar's ownership is chained through a government department page that links to it —
first-class evidence. Kohat's ownership is corroborated by the federal directory and by
_another board's_ links page, but **there is zero first-party on-page evidence**, so it
remains `candidate`, not `verified`.

### Sindh — verified, not yet in the code registry

| Board               | Verified host              | Result route                                 | Note                                                        |
| ------------------- | -------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| **Karachi (BIEK)**  | `biek.edu.pk`              | **No lookup form** — per-group gazette PDFs  | Statutory remit confirmed on its own history page           |
| Hyderabad           | `biseh.edu.pk`             | **No lookup** — per-group result files       | Controlling authority named on its own governance page      |
| Larkana             | `biselrk.edu.pk` → `.com`  | `results.biselrk.edu.pk`                     | **Fully chained**: homepage → results page → portal         |
| Mirpurkhas          | `bisempk.edu.pk`           | result page **exposes no form**              | Working portal was pattern-probed, **not board-linked**     |
| Shaheed Benazirabad | `bisesba.edu.pk`           | **site 503**                                 | Identity confirmed only via its online sub-portal           |
| Sukkur              | `bisesuksindh.edu.pk`      | **placeholder page; no result route exists** | Weakest evidence in the country                             |
| AKU-EB (private)    | `examinationboard.aku.edu` | Exam dropdown + Date of Birth                | Ordinance basis stated on its own about page                |
| ZUEB (private)      | `zueb.edu.pk`              | Stream-wise gazette PDFs                     | "Approved board of the Government of Sindh" on its own page |

### Balochistan and AJK

| Board          | Verified host  | Result route                                               | Note                                                  |
| -------------- | -------------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| Quetta (BBISE) | `bbise.edu.pk` | `result.bbise.edu.pk/Results/HSSC`                         | **Gazettes + 2026 result notification on own domain** |
| AJK Mirpur     | `ajkbise.net`  | HSSC form **403**; **gazette PDFs are the verified route** | Statutory identity **unverified**                     |

---

## 4. Ownership hazards recorded

These are the reasons a plausible domain is never accepted as evidence.

| Hazard                                          | Instance                                                                                                                                                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A resolving host that is not a result route** | `hsscresult.ajkbise.net` serves a bare hosting-panel default page. **Must never be presented as a result URL.**                                                                                                               |
| **Official directories carrying wrong domains** | The federal directory renders one Sindh board's host as a non-existent domain; the Sindh government list gives another board a host that 403s while the working host is different                                             |
| **Expired certificates on "official" domains**  | The federally-listed Hyderabad domain, one AJK variant, and one Karachi sub-portal all fail TLS                                                                                                                               |
| **Pattern-probed portals**                      | Two Sindh boards' working result apps were reached by guessing a subdomain; they print **no board name** and are not linked from any loadable board page. Ownership is inferred from the domain only — **below our standard** |
| **A stale link on a board's own site**          | One KPK board's links page points at a wrong `.com.pk` variant for a neighbouring board                                                                                                                                       |
| **Impersonating aggregator subdomains**         | Competitor networks run `<board>.<aggregator>.tld` subdomains that read as official                                                                                                                                           |
| **Parasite domains**                            | A lookalike of the federal verification body ranks alongside it                                                                                                                                                               |

---

## 5. Distinctions kept deliberately apart

**Engine capability is not dataset capability.** A portal offering "12th" in one
dropdown and "2026" in another has described a cross-product of form options, not
confirmed a dataset exists behind them.

**A gazette is not a statistics sheet.** One Punjab board's "gazette" entry for 2026 is
a statistics sheet; it is not described as a per-candidate gazette.

**A result archive is not an announcement.** Several portals expose past sessions. An
archive proves history; it never confirms the current session.

**A "latest result" slug is not a stable link.** Several KPK boards expose one session
at a time, so a link built today against a latest-result path may serve a different
class tomorrow.

---

## 6. Source hierarchy applied

1. Official education board — **the only accepted authority for every fact here**
2. Official government/education department — used to settle board scope
3. Official result portal
4. Official gazette/document
5. Reputable primary reporting — used only for the outage record
6. Reliable secondary reporting
7. Competitors — **discovery only**

No capability, date, shortcode or status in this registry rests on tier 5, 6 or 7.

---

## 7. Phase 2 registry expansion tasks

1. Add the 16 verified non-Punjab boards with full provenance notes.
2. Apply the corrections in `result-source-risk-register.md` §6.
3. Model **gazette-only boards** (Karachi, Hyderabad, AJK) as a distinct source shape —
   they have no lookup form, so a roll-number call to action would be wrong for them.
4. Model **per-group datasets** for Sindh, since one board declares one group at a time.
5. Record Kohat, Sukkur and Shaheed Benazirabad as `planned` with `candidate`
   ownership — registered honestly, with no page and no claimed capability.

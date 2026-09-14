# Board Capability Matrix — HSSC Part-II (12th Class), National

**Research date:** 2026-09-14
**Scope:** every board in Pakistan and AJK that awards HSSC / Intermediate
**Method:** each URL loaded live. No competitor site was used as evidence of any fact.
No access control was evaded, no user agent spoofed, no form submitted.

---

## How to read this

| Value       | Meaning                                                                                |
| ----------- | -------------------------------------------------------------------------------------- |
| **Yes**     | Directly observed on the board's own live page.                                        |
| **No**      | Verified absent on pages actually fetched.                                             |
| **Unknown** | Not checked, or not establishable. **Absence of evidence is not evidence of absence.** |
| **Blocked** | The host answered 403/500/503 — a block or outage, **not** a finding about capability. |

The interface advertises a method **only** where the value is _Yes_.

---

## 1. The board universe — resolved

| Region               | HSSC-awarding boards | Notes                                                               |
| -------------------- | -------------------- | ------------------------------------------------------------------- |
| Punjab               | **9**                | All verified                                                        |
| Federal              | **1** (FBISE)        | WAF-blocked; jurisdiction includes Gilgit-Baltistan                 |
| Khyber Pakhtunkhwa   | **8**                | Confirmed against the provincial education department's own listing |
| Sindh (public)       | **6**                | Excludes the Karachi _secondary_ board and the technical board      |
| Balochistan          | **1**                | See §5 — the "three boards" claim does not survive checking         |
| Azad Jammu & Kashmir | **1**                |                                                                     |
| Gilgit-Baltistan     | **0**                | See §6                                                              |
| Private (recognised) | **2**                | AKU-EB and ZUEB                                                     |

**Total: 26 public HSSC-awarding boards + 2 recognised private boards.**

### Entities that must be excluded — each would misroute a 12th-class reader

| Entity                                     | Why excluded                                                                                                                  |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Board of Secondary Education Karachi       | **Matric only.** The 1972 Sindh ordinance split the old combined board; intermediate went to the Karachi _intermediate_ board |
| KP Board of Technical & Commerce Education | Regulates education **below degree level** — DAE/DIT/D.Com. No HSSC                                                           |
| Balochistan Board of Technical Education   | Awards DAE/DIT; its DIT is merely _equivalent_ to HSSC                                                                        |
| Sindh Board of Technical Education         | Technical, not HSSC                                                                                                           |
| The GB elementary examination body         | Grades 5 and 8 only                                                                                                           |

### Boards that do **not** exist, despite being widely listed

Swabi, Nowshera, Charsadda, Dir, Haripur (KP — Haripur falls under Abbottabad,
Charsadda under Peshawar, Dir under Malakand); Khuzdar and Turbat (Balochistan — see
§5). **Guessing a board domain is not research**: `bisesukkur.edu.pk`,
`biselarkana.edu.pk`, `bisemirpurkhas.edu.pk`, `bisekhuzdar.edu.pk`,
`biseturbat.edu.pk` are all NXDOMAIN.

---

## 2. Punjab + Federal

| Board      | Official portal                         |     Roll No |    Name |          Extra ID |             CAPTCHA |           Gazette | 2026 Part-II result        |
| ---------- | --------------------------------------- | ----------: | ------: | ----------------: | ------------------: | ----------------: | -------------------------- |
| Lahore     | `result.biselahore.com`                 |         Yes | Unknown |           Unknown |             **Yes** |           Unknown | **Not announced**          |
| Gujranwala | `bisegrw.edu.pk`                        |         Yes | Unknown |           Unknown |             **Yes** | **Yes** (to 2025) | **Not announced**          |
| Faisalabad | **NOT CONFIRMED**                       |     Unknown | Unknown |           Unknown |             Unknown |           Unknown | **Not announced**          |
| Multan     | `results.bisemultan.edu.pk/archive`     |         Yes | Unknown |           Unknown | **Yes (reCAPTCHA)** |   Historical only | **Not announced**          |
| Rawalpindi | `results.biserawalpindi.edu.pk`         |         Yes | **Yes** |           Unknown |             Unknown |           Unknown | **Not announced**          |
| Sargodha   | `results.bisesargodha.edu.pk`           |         Yes | Unknown |        **B-Form** |             Unknown |           Unknown | **Not announced**          |
| Bahawalpur | `results.bisebwp.pk/indexHSSC_PII.aspx` |         Yes | Unknown | **B-Form / CNIC** |             **Yes** |           Unknown | **Not announced**          |
| Sahiwal    | `bisesahiwal.edu.pk/allresult/`         |         Yes | Unknown |           Unknown |             Unknown |   **Yes** (stats) | **Not announced**          |
| DG Khan    | `bisedgkhan.edu.pk/results-hssc.php`    | Conflicting | Unknown |           Unknown |             Unknown |           Unknown | **Not announced**          |
| FBISE      | `portal.fbise.edu.pk/…/result/`         |     Unknown | Unknown |           Unknown |             Unknown |           Unknown | **Blocked — unverifiable** |

---

## 3. Khyber Pakhtunkhwa — 8 boards

Confirmed against the provincial elementary & secondary education department's own
listing of BISEs, which enumerates exactly these eight.

| Board          | Official portal                            | HSSC-II route quality                                                              | Roll No |                    Name |            CAPTCHA | Gazette |
| -------------- | ------------------------------------------ | ---------------------------------------------------------------------------------- | ------: | ----------------------: | -----------------: | ------: |
| **Abbottabad** | `biseatd.edu.pk/all_results.php`           | **Best in KP** — Class + Year (2026→2012) + Session + Roll No                      |     Yes |                      No |            Unknown |      No |
| **Swat**       | `bisess.edu.pk/site/home/results-section`  | **Strong** — Class + Exam (9th–12th, Annual-I/II) + Roll No + Year (2026→2005)     |     Yes |  Yes (on latest-result) |            Unknown |      No |
| **D.I. Khan**  | `bisedik.edu.pk/results`                   | **Strong** — Class + Year (2016–2026) + Exam code incl. HSSC Annual-I/II + Roll No |     Yes |                      No |            Unknown |      No |
| **Malakand**   | `bisemalakand.edu.pk/result/latest-supply` | Class (11th/12th) + Roll No                                                        |     Yes |                      No |            Unknown |      No |
| **Bannu**      | `biseb.edu.pk/result-search.php`           | Archive to 2017; two search methods                                                |     Yes | **Yes** (+ father name) | **YES — observed** |      No |
| **Mardan**     | `result.bisemdn.edu.pk`                    | Roll No only; one session at a time                                                |     Yes |                      No |            Unknown |      No |
| **Peshawar**   | `cloud.bisep.edu.pk`                       | Roll No only; **one session at a time**                                            |     Yes |                      No |            Unknown |      No |
| **Kohat**      | **NOT CONFIRMED**                          | All paths 403; `results.` subdomain NXDOMAIN                                       | Unknown |                 Unknown |            Unknown | Unknown |

**Bannu is the only KPK board where a CAPTCHA was positively established** (two
separate CAPTCHA images, one guarding each search method).

### The KPK finding that matters most

**Not one KPK board's own site announces an HSSC 2026 result.** Every live portal is
currently serving **SSC Annual-I 2026** (9th/10th). The most recent _HSSC_ result any
KPK board published is **HSSC Annual-II 2025**, declared by Mardan on 5 February 2026.

Third-party sites claiming a KPK HSSC 2026 result on **30 August 2026** are
**contradicted by the boards' own homepages**. Not carried.

**Portal design note:** Peshawar and Mardan expose **one examination session at a
time**, so there is currently no HSSC entry point at all on those portals. A link built
today against a "latest result" slug would point at a 9th/10th result tomorrow —
Malakand's `/result/latest-annual` demonstrates exactly this hazard.

### Rechecking — KPK is the best-documented region, and the only source of real figures

| Board      | Rechecking facility                    | Detail observed                                                                                                                                           |
| ---------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mardan     | `retotalling.bisemdn.edu.pk`           | **Retotalling PKR 1,500 normal / 3,000 late per paper; Show of Paper PKR 2,500 / 5,000 per paper.** Closed 11-08-2026 for HSSC. Requires a bank receipt   |
| Bannu      | `portal.biseb.edu.pk/retotaling/`      | Three-step flow, paid by a 19-digit consumer number. _"Show Of Papers is a separate service and may be requested without retotalling."_ No fees published |
| Swat       | `/site/retotaling-result/hssc`         | A published **results table**, not an application form                                                                                                    |
| Malakand   | `/result/hssc/retotalling`             | Single roll-number field                                                                                                                                  |
| Abbottabad | notification published **as an image** | Rules and fees **not extractable**                                                                                                                        |
| Peshawar   | FAQ only                               | _"priority in disposal is given to 10th & 12th Classes"_ — no portal, fee or deadline                                                                     |
| D.I. Khan  | none found                             | Unverified                                                                                                                                                |

---

## 4. Sindh — the group-wise model

Confirmed against the Government of Sindh Universities & Boards Department listing.

| Board                   | Official portal            | Lookup model                                                                      | 2026 Part-II status                                                        |
| ----------------------- | -------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Karachi (BIEK)**      | `biek.edu.pk`              | **NO roll-number lookup at all** — gazette PDFs per group                         | **Partially declared** — see below                                         |
| **Hyderabad**           | `biseh.edu.pk`             | **No lookup** — per-group result files                                            | Commerce, Home Economics, Medical published; **no dates printed**          |
| **Larkana**             | `results.biselrk.edu.pk`   | Class (SSC-I/II, HSC-I/II) + **Group** (Science/General) + roll/name/institute    | Unverified — notifications JS-driven, returned empty                       |
| **Mirpurkhas**          | `bisempk.edu.pk`           | Result page loads but **exposes no form**                                         | **Notifications stale at 2023**                                            |
| **Sukkur**              | `bisesuksindh.edu.pk`      | **Placeholder page only** — no result route exists                                | **NOT CONFIRMED**                                                          |
| **Shaheed Benazirabad** | `bisesba.edu.pk`           | **Site returns 503**                                                              | **NOT CONFIRMED**                                                          |
| **AKU-EB** (private)    | `examinationboard.aku.edu` | **Exam dropdown + Date of Birth** — the only genuine online lookup found in Sindh | "HSSC Part II Annual Examinations 2026" **is listed in the live dropdown** |
| **ZUEB** (private)      | `zueb.edu.pk`              | Stream-wise gazette PDFs, split Regular/Private                                   | Runs HSSC Annual-I / Annual-II 2026                                        |

### ⭐ BIEK group-wise Part-II 2026 declarations — from the board's own site

| Group                                   | Declared                              |
| --------------------------------------- | ------------------------------------- |
| Science Pre-Medical                     | **31-07-2026**                        |
| Humanities Private                      | **31-07-2026**                        |
| Home Economics                          | **31-07-2026**                        |
| Special Candidates (Humanities Regular) | **31-07-2026**                        |
| Humanities Regular                      | **07-08-2026**                        |
| Science Pre-Engineering                 | **17-08-2026**                        |
| Science General                         | **27-08-2026**                        |
| **Commerce Regular / Commerce Private** | **NOT YET DECLARED** as of 2026-09-14 |

A **four-week spread within one board**, with one group still outstanding. This is
primary-source refutation of the "one board = one date" model that every Punjab-centric
competitor encodes.

Hyderabad corroborates the pattern structurally — separate per-group result files for
Commerce, Home Economics and Medical, with Pre-Engineering, Science General and
Humanities still absent — but **publishes no declaration dates at all**. A third-party
claim that all Hyderabad groups drop together on one September date is contradicted by
the board's own staggered publication.

### Sindh domain hazards

- `bisehyd.edu.pk` (the federally-listed Hyderabad domain) — **expired TLS certificate**. The working host is `biseh.edu.pk`.
- `bisemirpurkhas.com` (the provincially-listed domain) — **403**. The working host is `bisempk.edu.pk`.
- `biselrka.edu.pk` (as rendered in the federal directory) — **NXDOMAIN**. Correct host is `biselrk.edu.pk`, which redirects to a `.com`.
- `online.biek.edu.pk` — expired certificate.
- Larkana, Mirpurkhas and Shaheed Benazirabad share a generic result application; for the latter two it was **pattern-probed, not board-linked**, and prints no board name — ownership is inferred from the domain only and is therefore **not** verified to this project's standard.

---

## 5. Balochistan — ONE board, not three

**BISE Quetta (BBISE)** — `bbise.edu.pk`, established under the 1976 Ordinance,
jurisdiction province-wide except cantonment institutions.

- **Portal:** `result.bbise.edu.pk/Results/HSSC` — Roll No + Year (2025–2027) + Session (Annual/Supplementary) + Class (11th/12th).
- **Gazette: YES**, on its own domain — `GAZ_PART_II_HSSC_ANN_2026` and `GAZ_PART_I_HSSC_ANN_2026`, both dated 20 Jul 2026. Scanned images, so contents are not machine-readable.
- **⭐ 2026 RESULT IS DECLARED** — notifications titled **"HSSC ANNUAL RESULT 2026 ANNOUNCED"** and **"HSSC RESULT 2026 NOTIFICATION"**, both 20 Jul 2026. **This is the only board in the country verified as having declared its HSSC 2026 result.**
- **Second annual:** notification 22 Jul 2026; date sheet 11 Sep 2026; **exams from 13-10-2026**.
- **Rechecking:** `/Service/rechecking` exists; fee/deadline stated only as "As notified in result schedule".

### The Khuzdar / Turbat claim — REJECTED on evidence

Widely listed as boards established in 2020. Against that:

| Check                                                 | Result                                      |
| ----------------------------------------------------- | ------------------------------------------- |
| Standalone reference articles                         | **404**                                     |
| The listing's own citations                           | **empty brackets — uncited**                |
| Federal inter-board member directory                  | **not listed** — Balochistan is Quetta only |
| Government of Balochistan education-management source | **no mention**                              |
| BBISE's own jurisdiction statement                    | province-wide, **no mention**               |
| Domain probes (4 variants)                            | **all NXDOMAIN**                            |

**Treat as UNVERIFIED with no confirmed official result route. Do not build pages for
them.** Caveat recorded honestly: absence of a website is not proof a board was never
legislated, and primary Balochistan law could not be reached.

---

## 6. Gilgit-Baltistan — no board, and this is a trap in the brief

**GB has no board of its own awarding HSSC.**

- The federal inter-board body's member directory lists no GB board.
- The Federal board's jurisdiction **names Gilgit-Baltistan explicitly** (AJK is named separately and has its own board).
- The one GB examination body that exists is **elementary-only** — grades 5 and 8.
- A GB board has reportedly been _proposed_, not established — **UNVERIFIED**.

**The correct destination for a GB reader is FBISE.** That is a routing rule to
implement in the board directory, not a page to write.

---

## 7. Azad Jammu & Kashmir

**AJK BISE Mirpur** — `ajkbise.net`.

- **HSSC Part-II online form: 403** (`hssc.ajkboard.net`). Not evaded.
- **The verified HSSC-II route on AJK's own domain is the gazette PDF**, not an online form — `/results.php` carries Part-II gazettes for 2018, 2019 (original + supply), special 2020, and 2024 (1st and 2nd annual).
- ⚠️ **`hsscresult.ajkbise.net` resolves but serves a bare hosting-panel default page. It must never be presented as a result URL.**
- **No 2026 HSSC-II result notice** on the board's own site; the latest items are HSSC-II 2nd Annual **2025** (Feb 2026).
- The board's **statutory name and establishing instrument are UNVERIFIED** — the site has no About page, and no Government of AJK affiliation line appears anywhere loadable.

---

## 8. National findings

### 8.1 Result status

| Region            | HSSC Part-II 2026 declared?                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| Balochistan       | **YES — 20 Jul 2026** (only confirmed declaration nationally)               |
| Sindh (Karachi)   | **PARTIALLY** — six groups declared 31 Jul–27 Aug; **Commerce outstanding** |
| Sindh (Hyderabad) | **PARTIALLY** — three groups published, **no dates given**                  |
| Private (AKU-EB)  | Listed in the live results dropdown; **no announcement, no date**           |
| Punjab (9 boards) | **NO**                                                                      |
| KPK (8 boards)    | **NO** — all portals still on SSC 2026                                      |
| Federal           | **Unverifiable** — blocked                                                  |
| AJK               | **NO**                                                                      |

### 8.2 SMS — still zero verified, nationally

Not one board in Pakistan or AJK was observed publishing an SMS shortcode on its own
domain. Codes circulating on third-party sites now include, in addition to the Punjab
set: **9818** and **8583** (KPK), **8583** (Karachi, Hyderabad, Mirpurkhas, Aga Khan),
**5050** and **8583** (Balochistan), **80029** and **8009** (interior Sindh).

They contradict each other, and several are attributed to multiple different boards.
**None is published by this project.**

### 8.3 Gazette is the national bulk channel

Verified board-hosted gazettes: Gujranwala, Multan (historical), Sahiwal (statistics),
**Quetta** (Part-I and Part-II 2026), **AJK** (Part-II archive), **BIEK** (per group),
**Hyderabad** (per group), **ZUEB** (stream-wise). **No KPK board publishes one.**

Where a board has no lookup form at all — BIEK, Hyderabad, AJK — **the gazette is the
only official Part-II route**, which makes gazette navigation a core product surface
rather than a nice-to-have.

### 8.4 Portal patterns worth designing around

1. **Session-at-a-time portals** (Peshawar, Mardan, Malakand's "latest" slugs) mean a link built today may point at a different class tomorrow.
2. **Class + year + session selectors** (Abbottabad, Swat, D.I. Khan, Quetta) are the most durable and deep-linkable.
3. **Gazette-only boards** (BIEK, Hyderabad, AJK) need an entirely different user journey from roll-number boards.
4. **Name search exists** on Rawalpindi, Bannu, Swat and Larkana — an enumeration and privacy concern, not a feature to promote.

---

## 9. Open items

1. **Kohat** (403), **Faisalabad** (403), **FBISE** (403) — need a human with an ordinary browser.
2. **Sukkur** — no result route exists on the official domain at all.
3. **Shaheed Benazirabad** — public site 503.
4. **BSEK** — every content path 500s; its matric-only scope rests on the Karachi intermediate board's own statutory history page, not on BSEK's own words.
5. **CAPTCHA** — positively established on only five boards nationally. Everywhere else it stays `unknown`, and no board is integration-eligible on that basis.
6. **Balochistan and AJK 2026 gazette contents** — scanned images, not machine-readable.
7. **AJK statutory identity** — unverified.

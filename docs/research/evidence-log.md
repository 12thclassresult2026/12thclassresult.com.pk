# Research Evidence Log

**Phase:** 1 — Research
**Opened:** 2026-09-14

Every material conclusion in the Phase 1 package traces to an entry here, so that any
claim can be re-checked later against what was actually observed.

## Status vocabulary (section 32)

| Label                  | Meaning                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `VERIFIED`             | Directly observed on the authoritative source, on the date recorded.                                  |
| `OFFICIAL-BUT-BLOCKED` | The source is official, but access was refused (HTTP 403 WAF block). Not an outage, and never evaded. |
| `TENTATIVE`            | An official source states it and labels it provisional.                                               |
| `EXPECTED`             | Our inference from pattern or secondary reporting. Not stated by any board.                           |
| `HISTORICAL`           | True for a past session; recorded as history.                                                         |
| `SECONDARY-ONLY`       | Only non-official sources carry it.                                                                   |
| `CONFLICTING`          | Sources disagree; unresolved.                                                                         |
| `UNVERIFIED`           | Not checked, or not establishable from what was fetched.                                              |

Availability: `ONLINE` · `DEGRADED` · `OFFLINE` · `BLOCKED` · `UNKNOWN`

---

## A. Board and official-source evidence

All checked **2026-09-14** by loading the URL as an ordinary reader. No access control
was evaded; no form was submitted; no identifier was entered.

| #   | Claim                                                                                                                                                                                                                 | Source                                        | Status                                                          |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| A1  | BISE Lahore serves HSSC results at `result.biselahore.com`, with roll number, an exam-type dropdown offering Part-I/Part-II/Supplementary, and a year dropdown 2026→2007                                              | `result.biselahore.com`                       | `VERIFIED` / `ONLINE`                                           |
| A2  | BISE Lahore's result portal presents a CAPTCHA                                                                                                                                                                        | same                                          | `VERIFIED`                                                      |
| A3  | `biselahore.com` (main site) refuses automated requests                                                                                                                                                               | `biselahore.com`                              | `OFFICIAL-BUT-BLOCKED`                                          |
| A4  | BISE Gujranwala's checker renders via JavaScript; the same form is served statically at `prev-years-result.html` with roll number, year and a class dropdown (12th Annual / Supplementary / Special)                  | `bisegrw.edu.pk`                              | `VERIFIED` / `ONLINE`                                           |
| A5  | BISE Gujranwala publishes HSSC Part-II annual gazettes through 2025; no 2026 gazette listed                                                                                                                           | `bisegrw.edu.pk/result-gazatte.html`          | `VERIFIED`                                                      |
| A6  | BISE Faisalabad's HSSC Part-II route could NOT be confirmed. Seven hosts tried; all 403 except `results.bisefsd.edu.pk` (NXDOMAIN). `result.bisefsd.edu.pk` returning 403 rather than NXDOMAIN proves the host exists | `bisefsd.edu.pk`                              | `OFFICIAL-BUT-BLOCKED`                                          |
| A7  | `bisefsd.edu.pk/InterResults.aspx` is the _suspected_ Part-II portal                                                                                                                                                  | search listings only                          | `UNVERIFIED` — deliberately NOT registered as a source          |
| A8  | BISE Multan's `web.bisemultan.edu.pk/results-12/` now 301-redirects to `results.bisemultan.edu.pk/archive`                                                                                                            | both URLs                                     | `VERIFIED`                                                      |
| A9  | BISE Multan's archive offers roll number plus an exam-session dropdown including "Part-II / Combined Results"                                                                                                         | `results.bisemultan.edu.pk/archive`           | `VERIFIED` / `ONLINE`                                           |
| A10 | BISE Multan's `trace-12/` dropdown lists "HSSC (P-II/Combined) 1st Annual 2026" — proving the session exists **administratively**. It is an admission-status tool, NOT evidence a result is declared                  | `web.bisemultan.edu.pk`                       | `VERIFIED` (scope strictly limited)                             |
| A11 | BISE Multan's Part-II gazette content appears only inside combined 2017 and 2018 gazettes                                                                                                                             | `web.bisemultan.edu.pk/result-gazette-inter/` | `HISTORICAL`                                                    |
| A12 | BISE Rawalpindi offers roll number, a class dropdown (12th, HSSC Second Annual, Inter Supplementary, HSSC Special) and years 2026→2015                                                                                | `results.biserawalpindi.edu.pk`               | `VERIFIED` / `ONLINE`                                           |
| A13 | BISE Sargodha requires a **B-Form number** in addition to a roll number; sessions offered are 1st Annual and 2nd Annual–Supplementary                                                                                 | `results.bisesargodha.edu.pk`                 | `VERIFIED` / `ONLINE`                                           |
| A14 | BISE Bahawalpur publishes separate Part-II routes per session (`indexHSSC_PII.aspx`, `indexHSSC_PIIs.aspx`), requires B-Form/CNIC, and presents a CAPTCHA                                                             | `results.bisebwp.pk`                          | `VERIFIED` / `ONLINE`                                           |
| A15 | Both Bahawalpur Part-II pages were still headed **2025** on the check date                                                                                                                                            | same                                          | `VERIFIED`                                                      |
| A16 | Bahawalpur's `www` host serves a certificate that does not match it                                                                                                                                                   | `www.bisebwp.edu.pk`                          | `VERIFIED`                                                      |
| A17 | BISE Sahiwal offers class (9/10/11/12), years 2026→2012 and sessions Annual / 2nd Annual                                                                                                                              | `bisesahiwal.edu.pk/allresult/`               | `VERIFIED` / `ONLINE`                                           |
| A18 | BISE Sahiwal's gazette page carries an entry labelled "Stats Inter 2nd Annual 2026" — a **statistics sheet**, not a per-candidate gazette                                                                             | `bisesahiwal.edu.pk/result-stats-gazzet.php`  | `VERIFIED` (scope limited)                                      |
| A19 | BISE DG Khan publishes per-session result links; the most recent Part-II entry is 2025, roll number only. **No 2026 link existed**                                                                                    | `bisedgkhan.edu.pk/results-hssc.php`          | `VERIFIED`                                                      |
| A20 | FBISE's `result.fbise.edu.pk` 301-redirects to `portal.fbise.edu.pk/fbise-conduct/result/`, establishing the portal's location; the destination and `fbise.edu.pk` (six paths) returned 403                           | FBISE domains                                 | `OFFICIAL-BUT-BLOCKED`                                          |
| A21 | An FBISE `name=` parameter appears in search-engine index entries                                                                                                                                                     | search listings only                          | `UNVERIFIED` — NOT treated as evidence name lookup is supported |

### A22 — The single most consequential negative finding

**No HSSC Part-II 2026 result announcement exists on any board domain checked.**
Every board-owned page reached still showed 2025 as the most recent Part-II session.
Status: `VERIFIED` (as an absence, across the ten boards checked on 2026-09-14).

### A23 — No SMS shortcode is verified anywhere

No SMS shortcode was found published on **any** official board domain.
Status: `VERIFIED` as an absence across the boards checked.

---

## B. Conflicting claims — recorded, not resolved by preference

### B1 — HSSC Part-II 2026 result date: `CONFLICTING` / `SECONDARY-ONLY`

| Source type                       | Claim                            |
| --------------------------------- | -------------------------------- |
| Non-official result sites         | 23 September 2026                |
| Non-official result sites         | 18 September 2026                |
| Non-official result sites         | 13 September 2026                |
| Non-official result sites (FBISE) | 9 September 2026                 |
| **Official board sources**        | **No announcement found at all** |

**Assessment:** these are mutually inconsistent, none cites a board notification, and
the official tier carries nothing. Per the source hierarchy, Tier 3 cannot establish a
volatile fact. **No date is carried into the project.** Resolution requires a board
notification, not a tie-break between aggregators.

### B2 — SMS shortcodes: `CONFLICTING` / `SECONDARY-ONLY`

Values circulating for the same boards include `5050`, `80029`, `800291`, `80092`,
`8583`, `800293`, `800290`, `8002`. One competitor prints a code while a note beside
it states a different code is correct. Another publishes an entirely different flat
scheme contradicting everyone.

**Assessment:** an SMS is charged. A wrong shortcode costs a student money and returns
nothing. **No shortcode is published**, and a regression test asserts none of these
strings appears in rendered output.

### B3 — A transposition risk specific to this project

On the sibling 11th-class project, two independent secondary sources placed one date
on Part-II and another on Part-I, and the owner resolved it only by reading the
originating notification directly.

**Assessment:** this matters more here than there. A transposed date is not stale — it
is confidently wrong, and the exam most likely to be mis-attributed is _ours_. Any
future Part-II date must be read from the notification itself, and the record must
distinguish **supersession** (a newer notice replaced this one) from **assignment**
(the date was attached to the wrong examination).

---

## C. Search-market evidence

| #   | Claim                                                                                                                                                              | Basis                 | Status                                                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------------- |
| C1  | "12th class result", "2nd year result", "HSSC part 2 result" and "inter part 2 result" return the same domains and frequently the same URLs — one intent, not four | live search results   | `VERIFIED`                                                                                          |
| C2  | No first-party result checker exists in this market; every "checker" routes to an official board portal                                                            | competitor inspection | `VERIFIED`                                                                                          |
| C3  | `ilmkidunya.com` is the structural market leader and was absent from the supplied competitor set                                                                   | live search results   | `VERIFIED`                                                                                          |
| C4  | Result statistics (pass rates, group/gender splits) are carried by news outlets on announcement day and by no result portal                                        | live search results   | `VERIFIED`                                                                                          |
| C5  | Five competitor hosts refuse automated requests (403)                                                                                                              | direct attempts       | `OFFICIAL-BUT-BLOCKED` equivalent — structure reconstructed from listings only and labelled as such |
| C6  | Post-result document admin (duplicate DMC, corrections, migration, attestation) is essentially uncovered by result portals                                         | live search results   | `VERIFIED`                                                                                          |

---

## D. Technical / platform evidence

| #   | Claim                                                                                                                                                          | Basis                                                             | Status       |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------ |
| D1  | Cloudflare recommends `vinext` for new Next.js apps, but it publishes only as `1.0.0-beta.9`                                                                   | npm registry + Cloudflare docs                                    | `VERIFIED`   |
| D2  | `@opennextjs/cloudflare@1.20.6` peers `next: ">=15.5.24 <16 \|\| >=16.3.3"`                                                                                    | npm registry                                                      | `VERIFIED`   |
| D3  | `typescript-eslint` peers `typescript: ">=4.8.4 <6.1.0"`, so TypeScript 7 breaks `eslint-config-next`                                                          | npm registry                                                      | `VERIFIED`   |
| D4  | `12thclassresult.com.pk` delegates to Cloudflare nameservers and publishes no address record                                                                   | live DNS                                                          | `VERIFIED`   |
| D5  | The Cloudflare zone's owning account is **not** established                                                                                                    | zone enumeration was blocked by local policy and not circumvented | `UNVERIFIED` |
| D6  | Whether `12thclassresult-sys/12thclassresult.com.pk` exists on GitHub is **not** established — an unauthenticated 404 does not distinguish absent from private | direct attempt                                                    | `UNVERIFIED` |

---

## E. Result-source technical evidence

Checked **2026-09-14**, served HTML only, at most two requests per host, default
headers. No form submitted, no CAPTCHA probed, no 403 retried. Detail in
`result-source-risk-register.md`.

| #   | Claim                                                                                                                                                                        | Source                               | Status                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------ |
| E1  | Lahore's portal serves a per-session server-generated CAPTCHA image (`/Captcha.aspx`) referenced from its VIEWSTATE                                                          | `result.biselahore.com`              | `VERIFIED`                                                                     |
| E2  | **Multan's portal loads Google reCAPTCHA** from `google.com/recaptcha/api.js`                                                                                                | `results.bisemultan.edu.pk`          | `VERIFIED` — **corrects an earlier `null`**                                    |
| E3  | **Rawalpindi supports search by candidate NAME** (`txtName` with a `rb_searchby` radio)                                                                                      | `results.biserawalpindi.edu.pk`      | `VERIFIED` — **corrects an earlier `null`**                                    |
| E4  | Rawalpindi, Lahore and Bahawalpur use `__VIEWSTATE` / `__EVENTVALIDATION`, which structurally rejects posts the server did not itself render                                 | respective portals                   | `VERIFIED`                                                                     |
| E5  | Bahawalpur's name field placeholder reads "Enter Bay-Form/CNIC No" — the portal accepts a national identity document number                                                  | `results.bisebwp.pk`                 | `VERIFIED`                                                                     |
| E6  | Sargodha runs ASP.NET Core MVC with AJAX-loaded results; its selects carry `id` but no `name`, proving there is no plain form POST                                           | `results.bisesargodha.edu.pk`        | `VERIFIED`                                                                     |
| E7  | Sahiwal posts to `route.php` with stable field names and a per-session CSRF token, and is the only one of the eight publishing a permissive `robots.txt` (`Disallow:` empty) | `bisesahiwal.edu.pk`                 | `VERIFIED`                                                                     |
| E8  | Whether Sahiwal's `route.php` imposes a CAPTCHA downstream                                                                                                                   | not observed                         | `UNKNOWN`                                                                      |
| E9  | DG Khan's results page returned `200` with no form, input, select or script markup                                                                                           | `bisedgkhan.edu.pk/results-hssc.php` | `CONFLICTING` — an earlier pass observed a per-year link directory; unresolved |
| E10 | Four hosts serve Cloudflare's **default** Content Signals Policy block; this is auto-injected into free zones, not a board policy decision                                   | four board hosts                     | `VERIFIED`                                                                     |
| E11 | Four hosts return 404 for `robots.txt`; no board of the eight publishes terms of use, a privacy policy, or an API                                                            | all eight                            | `VERIFIED`                                                                     |

### E12 — Result-day outage record

| Date        | Event                                                                                                               | Status                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 24 Jul 2025 | Punjab boards' sites melted down under result traffic; **Bahawalpur inaccessible over an hour**; Faisalabad crashed | `VERIFIED` (news reporting) |
| 6 Aug 2026  | BISE Gujranwala's portal down on 10th-class result day                                                              | `VERIFIED` (news reporting) |
| 2025        | BISE Mardan's site crashed during Matric results                                                                    | `VERIFIED` (news reporting) |

All nine Punjab boards announce **simultaneously at 10:00 AM**, producing a
synchronized load spike rather than spread demand. Status: `VERIFIED`.

### E13 — More unverified SMS codes

News coverage of the above outages referenced `800240` and `8583`. Source is news, not
any board page. Status: `SECONDARY-ONLY` / `UNVERIFIED`. Joins the conflicting set in
B2. **Not published.**

---

## G. Search-market evidence — second pass

**Standing caveat on every row in this section:** the search index used is US-anchored,
not Pakistan-localised. Indian results are therefore over-represented. This is read as
a **directional signal about how ambiguous a term is**, never as a measurement of
Pakistani ranking. No search-volume data was available and none is asserted anywhere.

### G1 — Group/qualification terms are NOT simple synonyms

| #   | Claim                                                                                                                                                                                                                                   | Status     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| G1a | Generic and group queries share **zero identical URLs**. Domain overlap is high; URL overlap is nil                                                                                                                                     | `VERIFIED` |
| G1b | Market leaders serve group terms from separate URLs (e.g. a generic `12th-class-result` page alongside distinct `fa-part-1-2-result`, `fsc-result`, `ics-part-1-2-result`, `icom-part-1-2-result` pages, plus a per-board group matrix) | `VERIFIED` |
| G1c | Those group pages are **template-swapped and decaying** — one carries title "FSc Result 2026" over H1 "FSc Result 2025"; another is 2025 throughout with an update block about a different exam entirely                                | `VERIFIED` |
| G1d | **"FA result" and "ICS result" as bare terms are unusable** — 0/10 Pakistani results (Fanconi Anemia, the FA Cup; ICSE India, inhaled corticosteroids)                                                                                  | `VERIFIED` |
| G1e | "FSc result" / "FSc part 2 result" are the cleanest group terms — the abbreviation is effectively unique to Pakistan                                                                                                                    | `VERIFIED` |
| G1f | Adding a year to an ambiguous group term makes it **worse**, not better                                                                                                                                                                 | `VERIFIED` |

### G2 — Boards differ fundamentally on whether group is a dimension

| #   | Claim                                                                                                                                                                                                                              | Source                    | Status     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------- |
| G2a | **Punjab / KPK / Federal: group is NOT a field.** Rawalpindi offers Class + Year + Roll Number; Gujranwala offers Year + Class + search-by; Peshawar (`cloud.bisep.edu.pk`) is roll number only                                    | board portals             | `VERIFIED` |
| G2b | Punjab declares all groups in a **single simultaneous event** — identical declaration timestamps across FA, FSc and ICS                                                                                                            | news + aggregators        | `VERIFIED` |
| G2c | **Karachi (BIEK) has NO roll-number search at all** and publishes one gazette PDF per group                                                                                                                                        | `biek.edu.pk/results.asp` | `VERIFIED` |
| G2d | BIEK's 2026 group declarations are staggered across nearly a month: Science Pre-Medical 31-07; Humanities Private / Home Economics / Special 31-07; Humanities Regular 07-08; Science Pre-Engineering 17-08; Science General 27-08 | `biek.edu.pk`             | `VERIFIED` |

**Consequence:** "one board = one result date" is false nationally. Every Punjab-centric
competitor encodes it and is therefore structurally wrong about Sindh.

### G3 — The date evidence contradicts itself across the market

| Claim                                                     | Source tier               | Status                           |
| --------------------------------------------------------- | ------------------------- | -------------------------------- |
| Punjab-wide 12th result 23 Sept 2026, 10:00 AM            | aggregators               | `SECONDARY-ONLY`                 |
| BISE Lahore 12th result 15 October 2026                   | aggregators               | `SECONDARY-ONLY` / `CONFLICTING` |
| The same 15 Oct date assigned elsewhere to **11th** class | same aggregator           | `CONFLICTING`                    |
| FBISE 9 Sept 2026, 11:30 AM                               | aggregators, consistently | `SECONDARY-ONLY`                 |
| FBISE also quoted as "expected 23 August 2026"            | aggregators               | `CONFLICTING`                    |

This is the **transposition hazard** from B3 appearing live in the market: the same date
attached to different examinations by different publishers. No board source confirms
any of it. **Nothing is carried.**

### G4 — SMS shortcodes: a fuller conflicting set

Competitor and news sources publish, for Punjab boards: Gujranwala `800299`, Multan
`800293`, Rawalpindi `800296`, Faisalabad `800240`, Sargodha `800290`, Sahiwal
`800292`, Bahawalpur `800298`, DG Khan `800295`, Lahore rendered as a truncated
`80029`; and FBISE as `FB <space> roll number` to `5050`.

A separate source asserts Punjab students generally text `800292` — which is Sahiwal's
code in the list above.

Status: `SECONDARY-ONLY` / `CONFLICTING`. **No board domain has been observed printing
any of these.** They are recorded only so that if one ever appears in our content it is
identifiable as unsourced. **Nothing is published.**

### G5 — Post-result intents: three, not four

| #   | Claim                                                                                                                                                              | Status                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| G5a | **Second annual ≡ supplementary** — the same examination under two vocabularies; Punjab boards increasingly use the formal "Second Annual"                         | `VERIFIED`                                             |
| G5b | Historically they were **separate categories** — a board gazette archive still lists "Second Annual" and "Supplementary" as distinct rows                          | `VERIFIED`                                             |
| G5c | **Improvement is a distinct intent delivered through the same sitting** — the candidate has already passed and wants a better grade, not another attempt at a fail | `VERIFIED`                                             |
| G5d | **Rechecking is entirely separate** — challenging marks already awarded; no re-examination, different form, fee and deadline                                       | `VERIFIED`                                             |
| G5e | Punjab second-annual cycle quoted as: admissions 24 Sept–17 Oct 2026, exams from 3 Nov 2026, result expected 12 Jan 2027                                           | `SECONDARY-ONLY` — competitor-sourced, **not carried** |

### G6 — Vacuums and hazards observed

| #   | Finding                                                                                                                                                                                                                               | Status                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| G6a | **Pakistani HSSC rechecking is a total vacuum** — results are 100% Indian boards, despite at least one Pakistani board carrying a "Rechecking Application" in its own navigation                                                      | `VERIFIED`                                                                             |
| G6b | **Improvement exam** results are entirely Indian CBSE content                                                                                                                                                                         | `VERIFIED`                                                                             |
| G6c | **12th class percentage calculation is answered with the wrong methodology** — the ranking advice is CBSE's CGPA × 9.5, which is wrong for Pakistan, where HSSC marks are out of 1100                                                 | `VERIFIED`                                                                             |
| G6d | The DMC search surface contains **"DMC generator" tools that fabricate result cards**, and document-sharing sites hosting **individual students' scanned real result cards**                                                          | `VERIFIED` — a privacy and integrity hazard, and a line this project will not approach |
| G6e | IBCC dominates its own verification and equivalence intents; a **lookalike parasite domain** also ranks there                                                                                                                         | `VERIFIED`                                                                             |
| G6f | Official board sites are **absent from the high-traffic result, date and method intents**, while winning the bureaucratic ones (verification, duplicate DMC, gazette-by-roll-number, second annual)                                   | `VERIFIED`                                                                             |
| G6g | Gazette intent is a **PDF-delivery task wrapped in an HTML page** — the wrapper ranks, the PDF is the payload, and readers are told to use Ctrl+F                                                                                     | `VERIFIED`                                                                             |
| G6h | Boards publish **deep gazette archives** (one covers HSSC Part-I and Part-II 2012–2025; another Inter Part-I and Part-II ~2014–2025) but rank only on archival phrasing                                                               | `VERIFIED`                                                                             |
| G6i | Current-year gazette queries for a major Punjab board and for FBISE returned **mostly 9th/10th/11th material, not 12th**                                                                                                              | `VERIFIED`                                                                             |
| G6j | `12th class result without roll number` is the weakest surface observed — video, Q&A and short-form UGC only, with no authoritative answer                                                                                            | `VERIFIED`                                                                             |
| G6k | No competitor maintains **year-stamped archive URLs**; year-stamped equivalents 404 while yearless URLs resolve and carry the year in the title. The exceptions bake the year into the **domain**, which is a one-season architecture | `VERIFIED`                                                                             |

### G7 — Urdu and Roman-Urdu

| #   | Claim                                                                                                                                    | Status     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| G7a | **Urdu script is genuinely Pakistani and served almost entirely by newspapers** — one query returned 9/9 Pakistani results, all news     | `VERIFIED` |
| G7b | **Zero aggregators, zero lookup tools and zero official boards** appear in Urdu-script results                                           | `VERIFIED` |
| G7c | **No English result aggregator has any Urdu-script presence whatsoever** — English content is not capturing these queries                | `VERIFIED` |
| G7d | Every ranking Urdu "check result by roll number" how-to is for **matric / 9th / 10th** — not one intermediate equivalent ranks           | `VERIFIED` |
| G7e | Urdu-script intent skews to **announcement and statistics** rather than lookup                                                           | `VERIFIED` |
| G7f | **Roman-Urdu is India-dominated and video-first** — "kab aayega" is identical in Hindi and Urdu, and the Indian corpus is far larger     | `VERIFIED` |
| G7g | The acronym "HSSC" collides with an Indian state recruitment commission, and one Indian board genuinely uses "HSSC" for its own Class 12 | `VERIFIED` |

### G8 — Non-Punjab board scope

| #   | Claim                                                                                                                                                                                                                | Status                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| G8a | **Gilgit-Baltistan has no board of its own awarding HSSC.** The statutory inter-board body's member directory lists none; GB candidates fall under the Federal board, whose jurisdiction names GB explicitly         | `VERIFIED`                              |
| G8b | The one GB examination body that exists is **elementary-only** (grades 5 and 8) and is not an HSSC route                                                                                                             | `VERIFIED`                              |
| G8c | A GB board has reportedly been _proposed_, not established                                                                                                                                                           | `UNVERIFIED` — secondary reporting only |
| G8d | **Ziauddin University Examination Board (ZUEB)** is a second private Karachi HSSC board alongside AKU-EB, established by government gazette in 2018; it publishes **stream-wise gazette PDFs** split Regular/Private | `VERIFIED`                              |
| G8e | Balochistan may have **three** boards (Quetta, Khuzdar, Turbat), not one — the statutory directory lists only Quetta                                                                                                 | `CONFLICTING` — unresolved              |
| G8f | Domain corrections banked, each refuting an "obvious" guess: Larkana is `biselrk.edu.pk`, Mirpurkhas `bisempk.edu.pk`, Bannu `biseb.edu.pk`, Shaheed Benazirabad `bisesba.edu.pk`                                    | `VERIFIED`                              |

---

## H. Post-result workflow evidence — primary sources

This is the strongest primary-source evidence gathered in Phase 1, and it underpins the
rechecking opportunity.

### H1 — The 2026 Part-II result is undeclared, proven from the boards' own systems

| #   | Claim                                                                                                                                                                                           | Source                                                          | Status     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------- |
| H1a | Gujranwala's rechecking portal offers `10th Annual` **active** while `9th`, `11th`, `12th Annual` and `12th Supplementary` are **HTML-commented out**; its HSSC rechecking path is not deployed | `services.bisegrw.edu.pk/Rechecking/`                           | `VERIFIED` |
| H1b | Lahore's rechecking portals are live **for SSC only**; the HSSC rechecking subdomain returns **404**                                                                                            | `sscrechecking.biselahore.com`, `hsscrechecking.biselahore.com` | `VERIFIED` |
| H1c | Rawalpindi's rechecking portal currently serves **"SSC PART-I (9TH) ANNUAL, 2026"**                                                                                                             | `rechecking.biserawalpindi.edu.pk`                              | `VERIFIED` |

**Interpretation:** three boards' own live systems independently corroborate that the
HSSC Part-II 2026 result has not been declared. Any "HSSC 2026 rechecking last date" or
"2nd annual 2026 fee" circulating now is **not** sourced from these boards.

### H2 — Rechecking: what it actually is

| #   | Claim                                                                                                                                                                          | Source                                      | Status                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- | ---------------------------------- |
| H2a | **"re-marking of the answer book cannot be done under any circumstances"**, attributed to board rules **and the decisions of the superior courts**                             | Rawalpindi's own instruction document       | `VERIFIED` — quoted from the board |
| H2b | Rechecking verifies only: nothing left unmarked or replaced; per-question totals correct; totals correctly carried to the title page; title-page total matches the result card | Rawalpindi instructions; Gujranwala Rule 11 | `VERIFIED`                         |
| H2c | Gujranwala Rule 11: apply **within 15 days of the declaration of result**, fee **Rs 600 per paper** (statutory text)                                                           | the board's published regulations           | `VERIFIED`                         |
| H2d | **The fee is refunded if a mistake is found** — stated by both boards                                                                                                          | Gujranwala Rule 11; Rawalpindi clause 9     | `VERIFIED`                         |
| H2e | A candidate may **see the answer book** in the presence of an authorised board officer                                                                                         | Gujranwala Rule 11                          | `VERIFIED`                         |
| H2f | Rawalpindi's process is **hybrid, not fully online** — online form, bank challan, **and a hard copy delivered by hand or post**                                                | Rawalpindi instructions                     | `VERIFIED`                         |
| H2g | Only the candidate personally may view the answer book                                                                                                                         | Rawalpindi instructions                     | `VERIFIED`                         |

### H3 — Rechecking fees, and a three-way official conflict

| Board          | Figure                                                                              | Source                            |
| -------------- | ----------------------------------------------------------------------------------- | --------------------------------- |
| **Gujranwala** | **Rs 600/paper**                                                                    | statutory rulebook                |
| **Gujranwala** | **Rs 1,000** (+Rs 100 form)                                                         | the board's published fee table   |
| **Gujranwala** | **Rs 1,500/subject + Rs 100 form**, plus **Rs 2,000 late fine** after a stated date | the live portal's own calculation |
| **Rawalpindi** | **Rs 1,300/subject**, no processing fee                                             | the live portal's own fields      |
| **Lahore**     | **Rs 1,200/subject + Rs 100 processing**                                            | the live portal's own fields      |

Status: `CONFLICTING` at Gujranwala — **all three figures are genuine official
sources.** Assessment: the live portal governs what a student actually pays today; the
discrepancy must be **shown, not silently resolved**. All three rates were read from
**SSC** portals; the **HSSC rates are UNVERIFIED** because no HSSC portal is deployed.

### H4 — Lahore is the thinnest, and its key documents are unreadable

Lahore publishes its improvement policy, passing criteria and second-annual schedules
as **PDFs on a host that refuses non-browser requests**. The documents were located by
title and URL but **could not be read**, so every figure inside them is `UNVERIFIED`.

Also: the widely-repeated "15 days" rechecking deadline for Lahore appears **only on
SEO sites** and could not be verified on the board's own site. It must not be
attributed to Lahore. Lahore's old fee-schedule PDF now **404s** after a site rebuild.

### H5 — Second annual and compartment rules

| #   | Claim                                                                                                                                                        | Status                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| H5a | **There is no supplementary session for Part-I** — second annual is a 12th-class matter                                                                      | `VERIFIED`                            |
| H5b | Pass/fail is decided on the **aggregate of Part-I + Part-II**                                                                                                | `VERIFIED`                            |
| H5c | Failing **at most two subjects** places a candidate "under compartment" with re-appearance in those papers only; **more than two** is a failure "as a whole" | `VERIFIED`                            |
| H5d | Compartment candidates get a **maximum of three consecutive examination opportunities**                                                                      | `VERIFIED`                            |
| H5e | Compartment candidates **may not change subjects**                                                                                                           | `VERIFIED`                            |
| H5f | Whether practicals must be repeated                                                                                                                          | `UNVERIFIED` — no explicit rule found |
| H5g | Whether second-annual marks are capped                                                                                                                       | `UNVERIFIED` — no capping rule found  |

### H6 — Improvement of marks

| #   | Claim                                                                                                                                                                                     | Status                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| H6a | One opportunity **within one year** of passing, in the same subjects/group                                                                                                                | `VERIFIED` (but see H6e)                                |
| H6b | **If the candidate fails to improve, the previous result stands** — the better of the two survives                                                                                        | `VERIFIED`                                              |
| H6c | Improvement candidates are **not entitled to grace marks, scholarships or academic distinctions**                                                                                         | `VERIFIED`                                              |
| H6d | Improvement must be taken **before appearing in any higher examination** at any board or university; a fresh certificate is issued **on surrendering the previous one**                   | `VERIFIED`                                              |
| H6e | The "one chance within one year" rule **may have been superseded** by a later inter-board policy amendment, published by another board as an "Amended Policy regarding Marks Improvement" | `CONFLICTING` — the amending document could not be read |

**This is a supersession problem, not a stale-date problem.** The rule must not be
presented as the current national position until the amending policy is read.

### H7 — Rechecking across six Punjab boards

| Board      | Fee per paper              | Deadline     | Mode                                         | "Not re-marking" stated?        | Refund if error?             |
| ---------- | -------------------------- | ------------ | -------------------------------------------- | ------------------------------- | ---------------------------- |
| Lahore     | Rs 1,200 + Rs 100          | `UNVERIFIED` | Online + in-person viewing                   | Not stated officially           | `UNVERIFIED`                 |
| Gujranwala | Rs 1,500 + Rs 100 _(live)_ | **15 days**  | Fully online                                 | **Yes**                         | **Yes**                      |
| Rawalpindi | Rs 1,300                   | `UNVERIFIED` | Hybrid — online + challan + posted hard copy | **Yes, citing superior courts** | **Yes**                      |
| Sahiwal    | Rs 1,300 + Rs 100          | **15 days**  | Hybrid — online + posted hard copy           | **Yes, emphatically**           | Not published                |
| DG Khan    | Rs 750 + Rs 50 form        | **15 days**  | **Manual only**                              | **Yes** — four-point rule       | **Yes — that subject's fee** |
| Bahawalpur | Rs 1,300                   | `UNVERIFIED` | Dedicated online portal                      | **Not published at all**        | Not published                |

**Every rate above was read from an SSC portal or an undated document. No board has
published an HSSC 2026 rechecking fee — all HSSC rates are `UNVERIFIED`.**

Sahiwal states the bar most plainly, in the board's own words: _rechecking absolutely
does not mean re-marking of the paper_, and marked scripts _cannot under any
circumstances be re-evaluated or re-marked_. DG Khan uses the term **"re-tallying"**
rather than rechecking, and restricts it to four verification points.

Both Sahiwal and DG Khan additionally record that **only the candidate personally** may
view the script, and that a lost script entitles the candidate to either the award-list
marks or a re-sit of that paper.

### H8 — Two traps that would each produce a confidently wrong page

| #   | Trap                                                                                                                                                                                                                                                                                                                                                                  | Status                                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| H8a | **Bahawalpur's Rule 35** — _"No candidate will be allowed to appear for improvement of marks after passing the examination"_ — reads as a categorical ban on improvement. It sits under the chapter heading **"RULES FOR PROFESSIONAL EXAMINATIONS"**, governing PTC, CT, OT and Art & Crafts. Its neighbouring rules confirm the context. **It is NOT an HSSC rule** | `VERIFIED` — citing it as an Intermediate rule would be a factual error |
| H8b | **DG Khan's Rs 50 form fee** may be superseded by a revised-fee notification dated 28-08-2026 introducing a **Rs 100 "Various Form Fee"**. The Rs 750 per-script fee is unaffected                                                                                                                                                                                    | `CONFLICTING` — flag the form-fee component, not the script fee         |

### H9 — PBCC synchronisation confirmed

Multiple boards publish **identical** second-annual admission windows, traceable to one
inter-board notification reference dated 16-01-2026: single fee 07-08 → 19-08-2026,
double 20-08 → 25-08-2026, triple 26-08 → 29-08-2026, with second-annual examinations
commencing 06-10-2026. Status: `VERIFIED` (for SSC; the HSSC equivalent is not yet
published by any board).

This explains the market's "one date for all Punjab boards" assumption — it is true for
_scheduling_, which is centrally synchronised, and false for everything outside Punjab.

### H10 — Documentation quality varies enormously, and that is itself the opportunity

| Quality                                                                 | Boards                                                                                                            |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Good** — statutory text or clear public instructions published        | Gujranwala (full 180-page regulations), Rawalpindi (rechecking), Sahiwal (rechecking), DG Khan (rechecking rules) |
| **Thin** — a portal and a fee, but no rules, no deadline, no definition | Bahawalpur, Lahore                                                                                                |
| **Nothing** — no improvement rules published at HSSC level              | Sahiwal, Bahawalpur; DG Khan prices it but publishes no rules                                                     |

Boards bury this in PDFs, Urdu instruction images and undated rule books. **That is
precisely why every answer engine returns another country's content for this topic.**

---

## F. Open evidence gaps carried into the Phase 1 gate

1. Faisalabad Part-II route — needs a human with an ordinary browser.
2. FBISE Part-II route and form fields — same.
3. CAPTCHA presence/absence on five Punjab portals — needs each form read as served
   HTML rather than converted markdown. Until then every one stays `UNKNOWN`.
4. Any board page printing an SMS shortcode.
5. Any board notification carrying an HSSC Part-II 2026 date.
6. Non-Punjab board ecosystems (KPK, Sindh, Balochistan, AJK) — under research.

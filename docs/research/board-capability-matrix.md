# Board Capability Matrix — HSSC Part-II (12th Class)

**Research date:** 2026-09-14
**Scope:** Punjab (9 boards) + Federal (FBISE)
**Method:** every URL loaded live on the date above. No competitor site was used as
evidence of any fact.

---

## How to read this table

| Value            | Meaning                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| **Yes**          | Directly observed on the board's own live page.                                                              |
| **No**           | Verified absent on the pages actually fetched.                                                               |
| **Not verified** | NOT checked, or not establishable from what was fetched. **Absence of evidence is not evidence of absence.** |

The UI advertises a method **only** where the value is _Yes_. Everything else renders
as "Not verified" — never as "No" (`lib/result/capability-label.ts`).

### Why so many cells say "Not verified"

The research pipeline converts pages to markdown, which **drops `<script>` tags and
form controls**. So "no CAPTCHA appeared in the fetched text" is weak evidence, not
proof of absence. Per section 144, `hasCaptcha` is recorded as `true` or `null` and
**never** `false` unless absence was positively established.

This has a direct consequence: **no board qualifies for server integration**, and
`serverIntegrableSources()` returns an empty array, enforced by a test.

---

## Matrix

| Board           | Official portal (verified)              |      Roll No |         Name |          Extra ID |      CAPTCHA |         Gazette | Last verified |
| --------------- | --------------------------------------- | -----------: | -----------: | ----------------: | -----------: | --------------: | ------------- |
| BISE Lahore     | `result.biselahore.com`                 |          Yes | Not verified |      Not verified |      **Yes** |    Not verified | 2026-09-14    |
| BISE Gujranwala | `bisegrw.edu.pk/prev-years-result.html` |          Yes | Not verified |      Not verified |      **Yes** |         **Yes** | 2026-09-14    |
| BISE Faisalabad | **NOT CONFIRMED**                       | Not verified | Not verified |      Not verified | Not verified |    Not verified | 2026-09-14    |
| BISE Multan     | `results.bisemultan.edu.pk/archive`     |          Yes | Not verified |      Not verified | Not verified | Historical only | 2026-09-14    |
| BISE Rawalpindi | `results.biserawalpindi.edu.pk`         |          Yes | Not verified |      Not verified | Not verified |    Not verified | 2026-09-14    |
| BISE Sargodha   | `results.bisesargodha.edu.pk`           |          Yes | Not verified |        **B-Form** | Not verified |    Not verified | 2026-09-14    |
| BISE Bahawalpur | `results.bisebwp.pk/indexHSSC_PII.aspx` |          Yes | Not verified | **B-Form / CNIC** |      **Yes** |    Not verified | 2026-09-14    |
| BISE Sahiwal    | `bisesahiwal.edu.pk/allresult/`         |          Yes | Not verified |      Not verified | Not verified | **Yes** (stats) | 2026-09-14    |
| BISE DG Khan    | `bisedgkhan.edu.pk/results-hssc.php`    |          Yes | Not verified |      Not verified | Not verified |    Not verified | 2026-09-14    |
| FBISE           | **NOT CONFIRMED**                       | Not verified | Not verified |      Not verified | Not verified |    Not verified | 2026-09-14    |

---

## Integration mode per board

Every board is **`official-link`** or weaker. Nothing is server-integrated.

| Mode                       | Boards                                         | Reason                                                                                          |
| -------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `official-link`            | Lahore, Gujranwala, Bahawalpur                 | CAPTCHA confirmed present — automation is foreclosed permanently.                               |
| `official-link`            | Multan, Rawalpindi, Sargodha, Sahiwal, DG Khan | CAPTCHA absence not established. Section 144 permits server integration only where it has been. |
| `manual-verification-only` | Faisalabad, FBISE                              | Portal route could not be confirmed at all.                                                     |
| `gazette-guidance`         | Gujranwala, Multan, Sahiwal                    | Gazette route verified on the board's own domain.                                               |
| `sms-guidance`             | **none**                                       | No shortcode is published on any board domain.                                                  |

---

## Findings that change what may be published

### 1. No HSSC Part-II 2026 result is announced anywhere

No board domain carried an HSSC Part-II 2026 result announcement. Every board-owned
page reached still shows **2025** as the most recent Part-II session.

The one adjacent data point from an official host: BISE Multan's `trace-12/`
exam-session dropdown lists _"HSSC (P-II/Combined) 1st Annual 2026"_. That confirms
the 2026 session exists **administratively**. It is an admission-status dropdown and
is **not** evidence that a result is declared.

Dates circulating on non-official sites for this session — **18 September**,
**23 September** and **13 September 2026** — are mutually inconsistent and none was
traceable to a board notification. **None is carried in the registry.**

### 2. No SMS shortcode is verified for any board

No SMS shortcode was found published on **any** official board domain. Codes in
circulation on aggregator sites include `5050`, `80029`, `800291`, `80092`, `8583`,
`800293`, `800290` and `8002` — mutually contradictory, for the same boards.

An SMS is charged. A student texting a wrong shortcode on result morning pays for
nothing and receives nothing. A regression test asserts that none of these strings
appears anywhere in rendered output.

### 3. Two boards could not be verified at all

- **BISE Faisalabad** — seven hosts tried (`www`, apex, `result.`, `results.`,
  `slip.`, `duty.`, `iradmission.`) plus static `.pdf` and `.html` assets. All
  returned 403 except `results.bisefsd.edu.pk`, which is NXDOMAIN. That
  `result.bisefsd.edu.pk` answers 403 rather than NXDOMAIN proves the host exists.
  `InterResults.aspx` is the likely Part-II route but is **unverified** and is
  therefore **not** registered as a result source.
- **FBISE** — `result.fbise.edu.pk` issues a 301 to
  `portal.fbise.edu.pk/fbise-conduct/result/`, which establishes where the portal
  lives; the destination itself returned 403, as did `fbise.edu.pk` across six paths.
  A `name=` parameter appears in search-engine index entries for the board — that was
  never seen live and is **not** treated as evidence that name lookup is supported.

Both are **WAF user-agent blocks, not outages**. Those sites very likely work
normally in an ordinary browser. **No block was evaded** (`AUTOMATED_FETCH_POLICY =
do-not-bypass`). Closing these two gaps requires a human with a real browser.

### 4. Seed URL corrections

- `web.bisemultan.edu.pk/results-12/` now **301-redirects** to
  `results.bisemultan.edu.pk/archive`. The old path must not be published as the portal.
- Both Bahawalpur seeds remain valid, and the board publishes **separate routes per
  session** (`indexHSSC_PII.aspx` first annual, `indexHSSC_PIIs.aspx` second annual).
  Both were still headed **2025**.
- `result.biselahore.com` is unchanged and live.
- Bahawalpur's `www` host serves a **certificate that does not match it** — the
  non-`www` form is the usable one. Recorded as a student-facing caution.

---

## Open items for the next research pass

1. Confirm the Faisalabad Part-II route from a real browser.
2. Confirm the FBISE Part-II route and its form fields from a real browser.
3. Re-check every board for a 2026 Part-II announcement; this matrix is class A
   (3-day review cadence) for the duration of the result season.
4. Find any board page that prints an SMS shortcode, and register it with that page
   as the source — or continue to publish none.
5. Establish CAPTCHA presence or absence properly by reading each form as **served
   HTML** rather than converted markdown.

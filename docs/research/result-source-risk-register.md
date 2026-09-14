# Result Source Risk Register

**Phase:** 1 — Research (feasibility study; nothing is being integrated)
**Date:** 2026-09-14
**Scope:** the eight Punjab HSSC Part-II result portals verified as official

---

## Compliance statement

No form was submitted. No roll number or identifier was entered. No CAPTCHA was
probed, solved or bypassed. No user agent was spoofed. No 403 was retried with
different headers. No private or internal endpoint was sought. Each host received **at
most two requests** (the page plus `robots.txt`) with default client headers.

All observations come from **served HTML only**. No actual result response was ever
seen, so every privacy finding below is inferred from field names and labels, and is
flagged as such.

---

## 1. Register

| Board                    | Method                        | CAPTCHA                                | Anti-bot layer                                             | HTML stability                      | Privacy exposure             | Outage risk | robots.txt     | Recommendation                                          |
| ------------------------ | ----------------------------- | -------------------------------------- | ---------------------------------------------------------- | ----------------------------------- | ---------------------------- | ----------- | -------------- | ------------------------------------------------------- |
| **Lahore**               | POST, WebForms                | **Yes** — server image `/Captcha.aspx` | IIS, session, `__VIEWSTATE`                                | Brittle                             | Name/father/marks (inferred) | High        | 404            | outbound official link                                  |
| **Gujranwala** (archive) | POST                          | **Yes**                                | Cloudflare, `PHPSESSID`                                    | Clean                               | PDF card, client-rendered    | High        | CF default     | gazette workflow                                        |
| **Gujranwala** (live)    | JS/XHR, no form served        | unknown                                | Cloudflare                                                 | No parseable markup                 | unknown                      | High        | CF default     | outbound official link                                  |
| **Multan**               | JS/XHR                        | **Yes — Google reCAPTCHA**             | Cloudflare + CSRF cookie                                   | Rendered by script                  | unknown                      | Medium      | CF default     | outbound official link                                  |
| **Rawalpindi**           | POST, WebForms                | unknown                                | `__VIEWSTATE` + `__EVENTVALIDATION` + Rocket Loader        | Very brittle                        | **Name search enabled**      | Medium      | CF default     | outbound official link                                  |
| **Sargodha**             | JS/XHR, ASP.NET Core MVC      | unknown                                | IIS, MVC cookies                                           | Selects have `id` but no `name`     | unknown                      | Medium      | 404            | **official API candidate**                              |
| **Bahawalpur**           | POST, WebForms                | **Yes** — 3-char image                 | `__VIEWSTATE`, `__VIEWSTATEENCRYPTED`, `__EVENTVALIDATION` | **Worst** — generated control names | **Accepts B-Form/CNIC**      | **Highest** | 404            | outbound link + SMS guidance                            |
| **Sahiwal**              | POST → `route.php`, plain PHP | unknown downstream                     | Cloudflare + per-session CSRF                              | **Best** — clean stable names       | Result card (inferred)       | Medium      | **permissive** | direct integration candidate _(permission-conditional)_ |
| **DG Khan**              | unknown                       | unknown                                | LiteSpeed                                                  | unknown                             | unknown                      | unknown     | 404            | manual verification                                     |

---

## 2. Why seven of eight are not viable

| Blocker                                                                  | Boards affected                                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Confirmed CAPTCHA                                                        | Lahore, Gujranwala, Multan (reCAPTCHA), Bahawalpur, Bannu (added Phase 3) |
| Requires JavaScript to produce any result                                | Gujranwala (live), Multan, Sargodha                                       |
| `__VIEWSTATE` / `__EVENTVALIDATION` structurally rejects synthetic posts | Lahore, Rawalpindi, Bahawalpur                                            |
| No API and no published permission to automate                           | **all eight**                                                             |

**Sahiwal alone** combines a real form POST, stable markup and an explicitly permissive
`robots.txt`. Even there, integration is **permission-conditional** — see §5.

---

## 3. The robots.txt nuance that must not be misread

Four hosts serve an identical block beginning _"As a condition of accessing this
website, you agree to abide by the following content signals"_, asserting reservations
under EU Directive 2019/790.

**This is not a board policy decision.** It is Cloudflare's Content Signals Policy
default, injected automatically into free zones that had no `robots.txt` of their own.
Cloudflare states plainly that these signals _express preferences; they are not
technical countermeasures_.

Four other hosts return **404** for `robots.txt` — no crawl directives exist at all.

**Absence of a prohibition is not a grant of permission.** None of the eight boards
publishes terms of use, a privacy policy, or an API offering.

---

## 4. Result-day load — the finding that shapes the architecture

**All nine Punjab boards announce simultaneously at 10:00 AM**, producing a
synchronized national thundering herd rather than spread load.

Publicly reported failures:

| Date        | Event                                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 24 Jul 2025 | Punjab boards' websites suffered a technical meltdown under result-day traffic; **BISE Bahawalpur was inaccessible for over an hour**; Faisalabad crashed and was later restored |
| 6 Aug 2026  | BISE Gujranwala's portal went down on 10th-class result day — loading errors, timeouts, login failures                                                                           |
| 2025        | BISE Mardan's site crashed during Matric results                                                                                                                                 |

### The design implication

> On announcement day the upstream boards are **least** available exactly when our
> traffic peaks.

Two consequences follow directly:

1. **Any architecture whose critical path depends on a live upstream call fails
   concurrently with the boards** — precisely when readers need it most.
2. **Retrying into a struggling government server makes their outage worse.** Never
   auto-retry into a degrading portal.

**Recommended system-wide result-day posture: cached availability/status only.** Show
per-board up/down status from our own store, the official deep link, and the gazette
route — and never let a visitor's page load trigger an upstream request.

---

## 5. The legitimate path forward

Ranked, and none of it involves defeating a control:

1. **Official API request** — Sargodha's modern ASP.NET Core stack is the most likely
   to be able to grant one.
2. **Written data-sharing agreement** with a board.
3. **Gazette ingestion**, where a board publishes gazettes and rights permit.
4. **Outbound official links** — the default, and what carries the product today.
5. **SMS guidance** — only once a shortcode is verified on a board's own page.

### The line that is not crossed

A permissive `robots.txt` is **not** consent to re-publish candidates' names, fathers'
names and marks. Even for Sahiwal, written board permission should precede a single
automated request.

Circumventing a CAPTCHA on a government education portal to obtain minors' personal
data is not a technical problem to be solved. It is the reason to choose a different
architecture.

---

## 6. Corrections this study forces on the source registry

To be applied in Phase 2 — Phase 1 is research-only and does not modify code.

| Source                     | Current value                      | Evidence                                                   | Correction                                                                                                                                                           |
| -------------------------- | ---------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `multan-result-archive`    | `hasCaptcha: null`                 | Google reCAPTCHA loaded from `google.com/recaptcha/api.js` | → `true`                                                                                                                                                             |
| `rawalpindi-result-portal` | `supportsName: null`               | `txtName` field with `rb_searchby` radio                   | → `true`, plus a privacy note on enumeration risk                                                                                                                    |
| `sargodha-result-portal`   | `integrationMode: 'official-link'` | ASP.NET Core MVC, AJAX-loaded                              | add note: best official-API candidate                                                                                                                                |
| `sahiwal-result-portal`    | `integrationMode: 'official-link'` | clean POST, stable names, permissive robots.txt            | note as the only direct-integration candidate, **permission-conditional**                                                                                            |
| `dg-khan-result-directory` | `supportsRollNumber: true`         | this study saw `200` with **no form markup**               | **flag for re-verification** — the earlier observation was of a per-year link directory, this of a page with no form. Not necessarily contradictory, but unresolved. |

**No correction makes the live site wrong today**, because every one of these currently
reads `null` and renders as "Not verified" rather than as a false claim. That is the
tri-state doing its job.

---

## 7. Unverified SMS codes seen in secondary reporting — DO NOT PUBLISH

News coverage of the outages referenced shortcodes (including `800240` and `8583`).

**Status: SECONDARY-ONLY / UNVERIFIED.** These came from news articles, not from any
board's own page. They join the already-conflicting set (`5050`, `80029`, `800291`,
`80092`, `800293`, `800290`, `8002`) and are recorded here solely so that if any of
them ever appears in our content, it is identifiable as unsourced.

An SMS is charged. No shortcode ships without the board page that prints it.

---

## 8. Open items

1. **DG Khan** — a human should open `bisedgkhan.edu.pk/results-hssc.php` once in a
   browser and record what is actually there.
2. **Faisalabad** and **FBISE** — routes still unconfirmed (WAF-blocked).
3. **CAPTCHA status** for Rawalpindi, Sargodha and Sahiwal's `route.php` — still
   `unknown`, and each stays ineligible for integration until positively established.
4. **Gazette availability** should be re-surveyed as the primary bulk-data route, since
   it is the sanctioned channel and the one that survives result-day load.

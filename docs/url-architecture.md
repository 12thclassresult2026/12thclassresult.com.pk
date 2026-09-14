# URL Architecture

**Phase:** 2 — Architecture (blueprint; not implemented)
**Date:** 2026-09-14

---

## 1. Global policy

| Rule                    | Value                                         | Enforcement                              |
| ----------------------- | --------------------------------------------- | ---------------------------------------- |
| Origin                  | `https://12thclassresult.com.pk` (apex)       | `SITE_ORIGIN`, one definition            |
| `www`                   | 308 → apex, **two rules** (`/` and `/:path+`) | `next.config.ts`, unit-tested            |
| Protocol                | HTTPS only; HSTS                              | headers                                  |
| Trailing slash          | **never** (root excepted)                     | `trailingSlash: false` + `normalizePath` |
| Case                    | lowercase only                                | `normalizePath`                          |
| Duplicate slashes       | collapsed                                     | `normalizePath`                          |
| Query/hash in canonical | stripped                                      | `normalizePath`                          |
| Word separator          | hyphen                                        | convention + slug validation             |
| Non-production hosts    | `X-Robots-Tag: noindex, nofollow`             | `headers()` `missing` rule               |

Every canonical, sitemap entry and internal link passes through `normalizePath`, which
is why case, trailing-slash and parameter variants cannot become separate URLs.

---

## 2. Slug vocabulary — locked

**Board slug = `{city}-board`.** One vocabulary, everywhere. The sibling project's
mistake was running two slug shapes simultaneously; this project will not.

| Region      | Slugs                                                                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Punjab      | `lahore-board` `gujranwala-board` `faisalabad-board` `multan-board` `rawalpindi-board` `sargodha-board` `bahawalpur-board` `sahiwal-board` `dg-khan-board` |
| Federal     | `federal-board`                                                                                                                                            |
| KPK         | `peshawar-board` `mardan-board` `abbottabad-board` `swat-board` `kohat-board` `bannu-board` `malakand-board` `dera-ismail-khan-board`                      |
| Sindh       | `karachi-board` `hyderabad-board` `sukkur-board` `larkana-board` `mirpurkhas-board` `shaheed-benazirabad-board`                                            |
| Balochistan | `quetta-board`                                                                                                                                             |
| AJK         | `mirpur-board`                                                                                                                                             |
| Private     | `aku-eb` `zueb`                                                                                                                                            |

### Two locked safety rules

1. **`dg-khan-board` (Punjab) vs `dera-ismail-khan-board` (KPK).** D.I. Khan is _never_
   abbreviated. A validation gate asserts no board slug is a substring of another.
2. **`karachi-board` is the intermediate board.** The Karachi _secondary_ board is
   matric-only and is not registered at all — a 12th-class reader must never reach it.

`id` and `slug` are separate fields. `id` is stable and internal (`bise-lahore`); `slug`
is the URL. They may diverge; only `slug` ever appears in a URL.

---

## 3. Route patterns

| Family          | Pattern                                   | Canonical | Parent       | Year     | Index                  |
| --------------- | ----------------------------------------- | --------- | ------------ | -------- | ---------------------- |
| Home            | `/`                                       | self      | —            | n/a      | yes                    |
| Result hub      | `/results/12th-class`                     | self      | `/`          | none     | yes                    |
| Session hub     | `/results/12th-class/<year>`              | self      | hub          | explicit | conditional            |
| Board result    | `/results/<board-slug>/12th-class`        | self      | hub          | **none** | after review           |
| Board session   | `/results/<board-slug>/12th-class/<year>` | self      | board result | explicit | durable value only     |
| Board directory | `/boards`                                 | self      | `/`          | n/a      | yes                    |
| Board hub       | `/boards/<board-slug>`                    | self      | `/boards`    | n/a      | conditional            |
| Gazette hub     | `/gazettes/12th-class`                    | self      | `/`          | none     | yes                    |
| Gazette board   | `/gazettes/<board-slug>`                  | self      | gazette hub  | none     | yes                    |
| Gazette archive | `/gazettes/12th-class/archive`            | self      | gazette hub  | none     | yes                    |
| Guide           | `/guides/<topic>`                         | self      | `/`          | none     | yes                    |
| Guide board     | `/guides/rechecking/<board-slug>`         | self      | guide        | none     | yes                    |
| Tool            | `/tools/<tool>`                           | self      | `/`          | n/a      | yes                    |
| Updates         | `/updates`                                | self      | `/`          | n/a      | conditional            |
| Search          | `/search`                                 | —         | —            | n/a      | **noindex + disallow** |
| Result lookup   | `POST /api/result`                        | —         | —            | n/a      | **no URL, never**      |

### Why `/results/<board>/12th-class` and not `/results/12th-class/<board>`

The board is the stronger entity and the more stable one. Boards persist; class scoping
is fixed for this site. Putting the board first also keeps a future `/results/<board>/`
hub coherent, and prevents the hub path from accumulating an unbounded child set.

---

## 4. Year handling

| Case                               | Behaviour                                                            |
| ---------------------------------- | -------------------------------------------------------------------- |
| Current session                    | Rendered **on the yearless page**, with the year in title/H1/content |
| Past session with durable value    | Its own URL; freshness class drops to D; status becomes `archived`   |
| Past session without durable value | **No URL.** A section on the yearless page at most                   |
| Future year                        | **No URL, ever**, until the session has real content                 |
| Unknown/no-data year               | 404. Not a soft 404, not a redirect to the hub                       |

**Durable value** means at least two of: a verified declared date, a board-published
gazette for that session, verified statistics, or a session-specific method that differed.

Year is validated as an integer in `[2000, currentYear + 1]`. A well-formed but
unregistered year 404s — it is not silently coerced to the current year.

---

## 5. Parameters

No indexable URL carries a query parameter. Parameters are permitted only for
client-side UI state that is reconstructible and never canonical:

| Parameter                    | Use                             | Canonical effect                            |
| ---------------------------- | ------------------------------- | ------------------------------------------- |
| `?q=`                        | internal search                 | page is noindex; canonical is the bare path |
| `?board=`                    | pre-selecting a board in a form | **stripped from canonical**                 |
| tracking (`utm_*`, `fbclid`) | inbound campaigns               | stripped by `normalizePath`                 |

Faceted gazette filtering (board / session / year) resolves to **curated paths**, not
query permutations, so there is no infinite crawl space to control.

---

## 6. Redirects

| From          | To                 | Type         |
| ------------- | ------------------ | ------------ |
| `www.*`       | apex               | 308          |
| `http://*`    | https              | 308          |
| `/index`      | `/`                | 308          |
| Obsolete slug | current equivalent | 308, one hop |

Rules: no redirect chains; no unrelated URL redirected to the homepage; a removed page
returns **410**, not a redirect to a parent. Redirects are declared in `next.config.ts`,
not middleware — OpenNext flags Node middleware on Cloudflare as experimental, and these
rules are static and unit-testable.

---

## 7. Scale check

Approved families at full national coverage:

| Family                                                    | Count                                                    |
| --------------------------------------------------------- | -------------------------------------------------------- |
| Core (home, hub, directory, gazette hub, archive, search) | ~6                                                       |
| Board result pages                                        | ≤ 28                                                     |
| Board session archives                                    | only with durable value — expect single digits initially |
| Session hubs                                              | 1 per real session                                       |
| Gazette board pages                                       | ≤ 28, only where a gazette exists (currently 8 verified) |
| Guides                                                    | ~7                                                       |
| Per-board rechecking                                      | ≤ 28, currently 6 have real figures                      |
| Tools                                                     | 1–2                                                      |

**Order of magnitude: ~80–110 indexable URLs**, not thousands. Every one traces to a real
entity with verified source data. The architecture scales further — segmented sitemaps,
registry-driven generation — but the inventory is deliberately gated on evidence rather
than on permutation.

The theoretical Cartesian product (28 boards × years × groups × artifacts) is tens of
thousands. **It is not published.** The publish gate is in
`page-family-specifications.md`.

/**
 * Single source of truth for site identity and canonical origin (section 21).
 * Never hard-code the origin anywhere else.
 */

export const SITE_ORIGIN = 'https://12thclassresult.com.pk' as const

export const SITE_HOST = '12thclassresult.com.pk' as const

export const SITE_NAME = '12thClassResult.com.pk' as const

export const SITE_SHORT_NAME = '12th Class Result' as const

export const SITE_LOCALE = 'en_PK' as const

export const SITE_DESCRIPTION =
  'Check 12th class (HSSC Part-II / Second Year) results for Pakistani education boards, with official board sources, verified result status and result-day fallback methods.' as const

/**
 * Hosts that must never be indexed and must never emit production canonicals
 * (section 42). Anything that is not exactly SITE_HOST is treated as preview.
 *
 * This returns false for `www.` deliberately. If `www` is ever routed to this
 * Worker, it exists only so the permanent www -> apex redirect has a hostname
 * that resolves. Should that redirect ever fail open, `www` must emit noindex
 * and an apex canonical rather than silently duplicating the whole site.
 */
export function isProductionHost(host: string | null | undefined): boolean {
  if (!host) return false
  const normalized = host.toLowerCase().split(':')[0]
  return normalized === SITE_HOST
}

/**
 * Normalizes a route path into the canonical shape used across metadata,
 * sitemaps and internal links:
 *  - always leading slash
 *  - no trailing slash (except the root)
 *  - lowercase
 *  - no duplicate slashes
 *  - query and hash stripped
 *
 * This is the single duplicate-URL defence (section 21): every canonical,
 * sitemap entry and internal link passes through it, so case variants,
 * trailing-slash variants and parameter variants cannot become separate URLs.
 */
export function normalizePath(path: string): string {
  if (!path) return '/'
  let p = path.trim()
  // Strip origin if a full URL was passed.
  if (/^https?:\/\//i.test(p)) {
    try {
      p = new URL(p).pathname
    } catch {
      return '/'
    }
  }
  // Drop query/hash.
  p = p.split('?')[0] ?? ''
  p = p.split('#')[0] ?? ''
  if (!p.startsWith('/')) p = `/${p}`
  p = p.replace(/\/{2,}/g, '/')
  p = p.toLowerCase()
  if (p.length > 1) p = p.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

/**
 * Builds an absolute canonical URL on the production origin.
 * Always returns the production origin so preview deployments cannot emit
 * self-referencing canonicals (section 42).
 */
export function canonicalUrl(path: string): string {
  return `${SITE_ORIGIN}${normalizePath(path)}`
}

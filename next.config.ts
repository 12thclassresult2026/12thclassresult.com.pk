import type { NextConfig } from 'next'

// Imported relatively, NOT via `@/`: next.config.ts is loaded before the
// TypeScript path aliases exist.
import { SITE_HOST, SITE_ORIGIN } from './lib/seo/site'

/**
 * Content Security Policy — enforced, not decorative (section 37).
 *
 * Right now this site loads NOTHING from a third party, and the policy says so.
 * `'unsafe-inline'` remains on style-src because Next.js injects inline styles
 * for streaming and RSC.
 *
 * When Turnstile or analytics are actually configured, their origins are added
 * here deliberately and nowhere else. A policy that is constantly violated
 * teaches everyone to ignore it, so it must never be widened speculatively.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // https: because ad creatives are served from hosts nobody can list in
  // advance. An image cannot execute, so this is the cheapest of the
  // concessions below; script-src is where the real line is held.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  /*
   * GA4 needs three origins and gets exactly three.
   *
   * This policy was 'self' only, which is why Cloudflare's auto-injected Web
   * Analytics beacon was silently blocked. Opening it is a real decision, not
   * a formality: every origin named here can execute script on a page that
   * renders students' results.
   *
   * What is NOT added for GA: no tag-manager container, no ad or remarketing
   * origin. The ad-network origins below are a separate, later decision with
   * its own reasoning — they are not GA's, and neither list should be used
   * to justify widening the other.
   */
  /*
   * ADSTERRA (publisher site 6067805, four units).
   *
   * This is the largest concession this policy makes, and it is worth being
   * plain about what it costs. Popunder and Social Bar run as script in the
   * top-level document: they can read the DOM, which on this site can include
   * a rendered result card. That is inherent to running an ad network, not a
   * mistake in how they are mounted, and it is the reason nothing here sends
   * a roll number, name or marks anywhere — those stay in a Server Action
   * response and are never put in a URL an ad script could read.
   *
   * The 300x250 is contained, though not by this policy: its loader builds a
   * cross-origin iframe on an Adsterra delivery host, so whatever runs inside
   * answers to that host's CSP. The Native Banner is contained by this
   * project's own arrangement — it is framed from /ads/native.html, a static
   * file with no data in it that public/_headers gives a policy of its own.
   *
   * script-src IS OPEN TO https:, AND THAT IS A REAL LOSS. It was a named
   * list. Two things decided against keeping it.
   *
   * The first is that the Social Bar cannot be contained the way the other
   * units can. It docks itself to the viewport, so it has to run in the page,
   * and live testing showed it reaching for portalfluently.com — refused, and
   * the unit rendered nothing.
   *
   * The second is the shape of the failure. Adsterra rotates its delivery
   * domains on purpose to stay ahead of blocklists; one page load reached for
   * portalfluently.com, spendsdetachment.com, zoologyfibre.com,
   * fizzyacerbitymellow.com and workdeadlinededicate.com. A named list does
   * not fail loudly when they rotate — the tags stay in the markup, the
   * requests stay 200, and the ads simply stop earning until someone opens a
   * console. The site owner's original complaint was ads that "stop on some
   * weekends" with no explanation, which is exactly what a named list would
   * produce here, forever.
   *
   * WHAT THIS COSTS: any https host can now execute script on these pages. The
   * honest accounting is that this was already most of the way true — Popunder
   * and Social Bar run in this document by the owner's deliberate choice and
   * can read the DOM, a rendered result card included. What the named list
   * still bought was that those scripts could not pull further code from
   * anywhere, and that is what has been given up.
   *
   * WHAT STILL HOLDS, and why this is not the same as having no policy:
   *   object-src 'none'       no plugin content
   *   base-uri 'self'         a <base> tag cannot re-point every relative URL
   *   form-action 'self'      a form cannot be made to POST to another origin
   *   frame-ancestors 'none'  the site cannot be framed, so the result lookup
   *                           cannot be clickjacked
   *   no 'unsafe-eval'        string-to-code is still refused
   *
   * And the protection that actually guards students is not in this header at
   * all: the roll number travels in a Server Action body and never enters a
   * URL, so there is no identifier in the page address for any of this code to
   * read, and no per-student page for it to be loaded onto.
   *
   * TO REVERT: restore the named list from git history for this file, and
   * expect the Social Bar to stop rendering.
   */
  "script-src 'self' 'unsafe-inline' https:",
  "frame-src 'self' https:",
  /*
   * connect-src IS open to https:, and that is a smaller decision than it
   * looks. The same page load showed five different Adsterra hosts refused
   * here, which is what degrades Popunder and Social Bar — they run in this
   * document and cannot report back.
   *
   * A fetch cannot execute code, and img-src already allows any https host,
   * so anything that could be exfiltrated through a connection could already
   * be exfiltrated through an image URL. This closes a gap that was costing
   * two working units while giving up almost nothing that was still held.
   */
  "connect-src 'self' https:",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
  },
  // A page opened from this one (or opening it) gets no handle on its window.
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // Refuses Flash/PDF-plugin cross-domain policy files outright.
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Apex domain is canonical (section 21). Trailing slashes are not used.
  trailingSlash: false,
  images: {
    /*
     * OFF deliberately. OpenNext on Cloudflare resizes only through an IMAGES
     * binding, and none is configured — so `/_next/image` would answer every
     * width with the untouched original, through a Worker invocation, WITHOUT
     * the static-asset security headers in `public/_headers`. Serving the files
     * directly is the same bytes from the asset CDN with the headers applied.
     * Turn this back on only together with an IMAGES binding.
     */
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    // No remote source is allowed until a real, rights-cleared one exists
    // (sections 19 and 34). Never add a competitor or board-logo host casually.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Result lookup is personal data: never shared-cached (sections 52, 79).
        // Declared here as well as in the route handler so the header exists
        // even on a path the handler never reaches.
        source: '/api/result/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        /*
         * Preview isolation (section 42), and the whole strategy in one rule:
         * any host that is not the production apex — workers.dev, a branch
         * preview, localhost, www — is served noindex, so it can never compete
         * as a duplicate copy in search.
         */
        source: '/:path*',
        missing: [{ type: 'host', value: SITE_HOST }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
  async redirects() {
    return [
      /*
       * Canonical host enforcement (section 21). Declared here rather than in
       * middleware: OpenNext flags Node.js middleware on Cloudflare as
       * experimental and unmaintained, and these rules are static, so they
       * belong in config where they are also unit-testable.
       *
       * TWO RULES, NOT ONE. `/:path*` matches the bare root with an EMPTY
       * capture, and the substitution then leaves the literal `:path*` in the
       * Location header — so `https://www.<site>/` sends a reader to
       * `https://<site>/:path*`, which is a 404. The status is a correct 308
       * the whole time, which is exactly why a status-only check calls it
       * green. `/:path+` requires at least one segment, so the root gets its
       * own rule and can never fall into the placeholder case.
       */
      {
        source: '/',
        has: [{ type: 'host', value: `www.${SITE_HOST}` }],
        destination: SITE_ORIGIN,
        permanent: true,
      },
      {
        source: '/:path+',
        has: [{ type: 'host', value: `www.${SITE_HOST}` }],
        destination: `${SITE_ORIGIN}/:path+`,
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ]
  },
  env: {
    NEXT_PUBLIC_SITE_ORIGIN: SITE_ORIGIN,
  },
}

export default nextConfig

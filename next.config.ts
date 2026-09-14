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
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "frame-src 'self'",
  "connect-src 'self'",
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

'use client'

import { usePathname } from 'next/navigation'

import { AdBanner } from './ad-banner'

/**
 * The every-page 300x250, mounted once in the root layout.
 *
 * Declaring it in the layout rather than on each page means a route added
 * later inherits the slot instead of being forgotten — every new page is a
 * paid page without anyone having to remember.
 *
 * IT SKIPS THE HOMEPAGE, and that is the whole reason this component exists
 * rather than an `<AdBanner>` in the layout directly. Adsterra's banner loader
 * reads a global `atOptions`, so a second 300x250 in the same document is a
 * second script racing over one variable and the usual result is one blank
 * box. The homepage places its own banner directly under the roll-number tool,
 * where it is worth more than it would be above the footer, so the shared slot
 * stands aside there.
 *
 * If a future page also wants its own banner, add its path here — do not add a
 * second `<AdBanner>` and hope.
 */

/** Paths that render their own 300x250 and must not get the shared one. */
const PLACES_ITS_OWN = new Set(['/'])

export function LayoutAdBanner() {
  const pathname = usePathname()
  if (PLACES_ITS_OWN.has(pathname)) return null

  return <AdBanner slot="site-footer-banner" className="py-8" />
}

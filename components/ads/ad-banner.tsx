'use client'

import { useEffect, useRef } from 'react'

import { AdSlot } from './ad-slot'
import { BANNER_HEIGHT, BANNER_KEY, BANNER_SRC, BANNER_WIDTH } from './adsterra'

/**
 * Adsterra 300x250 banner.
 *
 * ONE PER PAGE. Adsterra's loader reads a GLOBAL `atOptions` when it
 * evaluates, so two of these in one document are two scripts racing over one
 * variable. The layout therefore skips this slot on the homepage, which places
 * its own below the hero — see `layout-ad-banner.tsx`.
 *
 * WHY THIS IS NOT IN AN IFRAME, THOUGH IT WAS AT FIRST.
 *
 * A `srcdoc` iframe looked like a free win: a private `window` per banner, so
 * any number could share a page, and CSS that physically cannot reach the
 * page. It renders nothing. Inside `srcdoc` the document's location is
 * `about:srcdoc` and, sandboxed without `allow-same-origin`, its origin is
 * opaque — so a loader that checks which publisher domain it is running on
 * finds no answer it can use.
 *
 * Serving the same markup from a real file under `/ads/` was the obvious next
 * move and is also a dead end here: `public/_headers` gives every static asset
 * `X-Frame-Options: DENY` and `default-src 'none'`, so the file could neither
 * be framed nor run a script, and loosening that rule would loosen it for
 * every asset on the site.
 *
 * So the unit is mounted the way Adsterra documents it — in the page, on the
 * real hostname. Containment comes from `AdSlot` instead of from an origin
 * boundary: `isolation` and `contain` stop the creative reflowing or painting
 * outside its box, and the box reserves its height so nothing below it shifts.
 */

declare global {
  interface Window {
    atOptions?: Record<string, unknown>
  }
}

export function AdBanner({
  /** Names the placement, so slots can be told apart when debugging. */
  slot,
  className = '',
}: {
  slot: string
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = host.current
    if (!container) return
    // React strict mode runs effects twice in development, and a second loader
    // would render a second creative into the same box.
    if (container.childElementCount > 0) return

    window.atOptions = {
      key: BANNER_KEY,
      format: 'iframe',
      height: BANNER_HEIGHT,
      width: BANNER_WIDTH,
      params: {},
    }

    const script = document.createElement('script')
    script.src = BANNER_SRC
    script.async = true
    script.dataset.adUnit = `banner-${slot}`
    container.appendChild(script)
  }, [slot])

  return (
    <AdSlot minHeight={BANNER_HEIGHT} className={className}>
      <div
        ref={host}
        data-ad-slot={slot}
        className="overflow-hidden"
        style={{ width: BANNER_WIDTH, minHeight: BANNER_HEIGHT }}
      />
    </AdSlot>
  )
}

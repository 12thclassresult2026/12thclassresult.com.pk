'use client'

import { useEffect, useRef, useState } from 'react'

import { AdSlot } from './ad-slot'
import { NATIVE_BANNER_FRAME } from './adsterra'

/**
 * Adsterra Native Banner, served from a document of its own.
 *
 * WHY IT IS FRAMED RATHER THAN MOUNTED IN THE PAGE.
 *
 * Mounted in the page, this unit renders nothing under the site's policy: its
 * loader reaches for domains Adsterra rotates on purpose to stay ahead of
 * blocklists, and script-src here is a named list. Making it work in-page
 * would mean opening script-src to https: on every page of the site, including
 * the homepage, which renders a student's result.
 *
 * A CSP applies per document. `/ads/native.html` is a static file that holds
 * no data, and `public/_headers` gives it a policy of its own where the ad
 * scripts are allowed. The site's pages keep their named list. That is the
 * whole trick, and it is the reason this component looks more complicated than
 * pasting a script tag would have been.
 *
 * THE FRAME IS SAME-ORIGIN, DELIBERATELY. An earlier attempt used a `srcdoc`
 * iframe, where the document location is `about:srcdoc` and — sandboxed
 * without `allow-same-origin` — the origin is opaque. Nothing rendered: a
 * loader that checks which publisher domain it is running on had no answer it
 * could use. Served from a real path on the real host, that check passes.
 *
 * Being same-origin also means the height can simply be read, with no
 * postMessage protocol: a native unit's height depends on how many items it
 * fills with, so the frame is measured and resized rather than guessed at.
 */

/** Reserved before the ad arrives, so nothing below the slot jumps. */
const MIN_HEIGHT = 260
/** A native unit that reports something absurd is capped rather than trusted. */
const MAX_HEIGHT = 900

export function AdNativeBanner({ className = '' }: { className?: string }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(MIN_HEIGHT)

  useEffect(() => {
    const el = frame.current
    if (!el) return

    let observer: ResizeObserver | undefined

    const measure = () => {
      /*
       * Same-origin, so this is a plain read. It can still throw — a browser
       * with third-party restrictions, or a frame swapped to a cross-origin
       * document by the ad — and a throw here must not break the page, so the
       * slot simply keeps its reserved height.
       */
      try {
        const body = el.contentDocument?.body
        if (!body) return
        const next = Math.min(Math.max(body.scrollHeight, MIN_HEIGHT), MAX_HEIGHT)
        setHeight(next)

        if (!observer) {
          observer = new ResizeObserver(() => {
            try {
              const h = el.contentDocument?.body?.scrollHeight
              if (h) setHeight(Math.min(Math.max(h, MIN_HEIGHT), MAX_HEIGHT))
            } catch {
              /* frame became unreadable; keep the last known height */
            }
          })
          observer.observe(body)
        }
      } catch {
        /* keep the reserved height */
      }
    }

    el.addEventListener('load', measure)
    // The creative arrives after load, so measure again once it has had time.
    const timers = [1500, 4000, 8000].map((ms) => window.setTimeout(measure, ms))

    return () => {
      el.removeEventListener('load', measure)
      for (const t of timers) window.clearTimeout(t)
      observer?.disconnect()
    }
  }, [])

  return (
    <AdSlot minHeight={MIN_HEIGHT} className={className}>
      <div className="w-full max-w-3xl" data-ad-slot="native-banner">
        <iframe
          ref={frame}
          title="Advertisement"
          src={NATIVE_BANNER_FRAME}
          loading="lazy"
          scrolling="no"
          /*
           * `allow-same-origin` is required — without it the loader cannot tell
           * which publisher domain it is on. What the sandbox still buys is the
           * absence of `allow-top-navigation`: a creative cannot navigate the
           * page out from under a reader without a click of their own.
           */
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          style={{ width: '100%', height, border: 0, display: 'block' }}
        />
      </div>
    </AdSlot>
  )
}

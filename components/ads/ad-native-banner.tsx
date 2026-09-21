'use client'

import { useEffect, useRef, useState } from 'react'

import { AdSlot } from './ad-slot'
import { NATIVE_BANNER_FRAME } from './adsterra'

/**
 * Adsterra Native Banner, served from a document of its own.
 *
 * WHY IT IS FRAMED RATHER THAN MOUNTED IN THE PAGE.
 *
 * The frame was built when the site's script-src was a named list and this
 * unit could not run under it — its loader reaches for domains Adsterra
 * rotates on purpose to stay ahead of blocklists. A CSP applies per document,
 * so framing it from `/ads/native.html`, a static file with its own policy in
 * `public/_headers`, let it run without opening the pages that render results.
 *
 * script-src has since had to open anyway, for the Social Bar, which docks to
 * the viewport and cannot be framed at all. So this frame is no longer the
 * only thing standing between an ad script and the site's pages.
 *
 * IT IS KEPT ANYWAY, for two reasons that survive that change. This unit's
 * code still runs in a document holding no data rather than beside a result
 * card — less exposure for no cost. And if script-src is ever tightened again,
 * the Native Banner goes on working instead of quietly going blank.
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

    /*
     * POLLED, NOT JUST OBSERVED, and the first version was wrong about this.
     *
     * A ResizeObserver on `body` fires when the body BOX changes. A native
     * unit fills its container with absolutely positioned and floated items,
     * so `scrollHeight` grew to 329px while the observed box never moved —
     * the frame stayed at its reserved 260 and the ad was clipped.
     *
     * A short poll costs nothing for the seconds an ad takes to arrive, and it
     * stops once the height has held still, so it does not idle forever on a
     * phone.
     */
    let lastHeight = 0
    let settled = 0
    const poll = window.setInterval(() => {
      const before = lastHeight
      measure()
      try {
        lastHeight = el.contentDocument?.body?.scrollHeight ?? lastHeight
      } catch {
        /* unreadable; let the settle counter end the poll */
      }
      settled = lastHeight === before ? settled + 1 : 0
      // Roughly three seconds of no change, or twenty seconds in total.
      if (settled >= 6) window.clearInterval(poll)
    }, 500)
    const stopPolling = window.setTimeout(() => window.clearInterval(poll), 20_000)

    return () => {
      el.removeEventListener('load', measure)
      window.clearInterval(poll)
      window.clearTimeout(stopPolling)
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

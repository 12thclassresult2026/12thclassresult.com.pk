'use client'

import { useEffect, useRef } from 'react'

import { AdSlot } from './ad-slot'
import { NATIVE_BANNER_CONTAINER, NATIVE_BANNER_SRC } from './adsterra'

/**
 * Adsterra Native Banner.
 *
 * ONE PER PAGE. The container id is fixed by Adsterra, so a second copy would
 * put a duplicate id in the document and the loader would fill only the first.
 * It is mounted on the homepage only; other pages carry the 300x250 instead.
 *
 * Unlike the 300x250 this one CANNOT be iframed — the loader looks up its
 * container by id in the host document and renders into it. So it runs in the
 * page and brings its own stylesheet. `AdSlot` contains that: `isolation`
 * keeps its stacking context local and `contain` stops it reflowing anything
 * around it.
 *
 * The script is appended by hand rather than through `next/script` for the
 * same reason as the site-wide units: this component owns the node, so it can
 * tell whether the node is still there.
 */
export function AdNativeBanner({ className = '' }: { className?: string }) {
  const started = useRef(false)

  useEffect(() => {
    // React strict mode invokes effects twice in development, and a second
    // loader would race the first over the same container.
    if (started.current) return
    started.current = true

    if (document.querySelector('script[data-ad-unit="native-banner"]')) return

    const script = document.createElement('script')
    script.src = NATIVE_BANNER_SRC
    script.async = true
    script.dataset.cfasync = 'false'
    script.dataset.adUnit = 'native-banner'
    document.body.appendChild(script)
  }, [])

  return (
    <AdSlot minHeight={250} className={className}>
      <div className="w-full max-w-3xl">
        <div id={NATIVE_BANNER_CONTAINER} />
      </div>
    </AdSlot>
  )
}

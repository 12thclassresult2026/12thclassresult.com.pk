'use client'

import { useEffect } from 'react'

import { POPUNDER_SRC, SOCIAL_BAR_SRC } from './adsterra'

/**
 * The two site-wide Adsterra units: Popunder and Social Bar.
 *
 * Mounted once in the root layout, so every page carries them exactly once.
 * Neither renders anything of its own in the page flow — the Social Bar
 * positions itself, the Popunder has no visible element at all — so there is
 * nothing here that can disturb the layout.
 *
 * WHY THESE ARE INJECTED BY HAND INSTEAD OF `next/script`:
 *
 * The site owner reports the tags going missing. `next/script` is the wrong
 * tool for defending against that — it dedupes by id and, once it believes a
 * script has loaded, will not add it again, so a node removed from the DOM
 * afterwards is never restored. The plain injector below owns its own nodes
 * and can therefore check they are still there.
 *
 * THE WATCHDOG, AND ITS LIMITS. A MutationObserver re-adds a tag that is
 * removed from the document after load. That covers a browser extension, a
 * third-party script, or a stray `remove()` — not a network block, an ad
 * blocker refusing the request, or Adsterra itself serving nothing; none of
 * those are removals and none of them can be fixed from here.
 *
 * Re-injection is capped. An extension that strips the tag on sight would
 * otherwise loop forever, burning battery on a phone to lose the same race.
 */

/** Enough to survive a one-off strip; low enough that a determined blocker wins quickly. */
const MAX_REINJECTIONS = 3

function mount(src: string, marker: string): HTMLScriptElement {
  const script = document.createElement('script')
  script.src = src
  script.async = true
  script.dataset.adUnit = marker
  document.body.appendChild(script)
  return script
}

export function AdsterraSiteScripts() {
  useEffect(() => {
    const units: { src: string; marker: string }[] = [
      { src: POPUNDER_SRC, marker: 'popunder' },
      { src: SOCIAL_BAR_SRC, marker: 'social-bar' },
    ]

    const reinjections = new Map<string, number>()
    const nodes = new Map<string, HTMLScriptElement>()

    for (const unit of units) {
      // A tag may already be present from a previous mount in the same
      // document (React strict mode double-invokes effects in development).
      const existing = document.querySelector<HTMLScriptElement>(
        `script[data-ad-unit="${unit.marker}"]`,
      )
      nodes.set(unit.marker, existing ?? mount(unit.src, unit.marker))
    }

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const removed of record.removedNodes) {
          if (!(removed instanceof HTMLScriptElement)) continue
          const marker = removed.dataset.adUnit
          if (!marker) continue

          const unit = units.find((candidate) => candidate.marker === marker)
          if (!unit) continue

          const count = reinjections.get(marker) ?? 0
          if (count >= MAX_REINJECTIONS) continue
          reinjections.set(marker, count + 1)
          nodes.set(marker, mount(unit.src, marker))
        }
      }
    })
    observer.observe(document.documentElement, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}

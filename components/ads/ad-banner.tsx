import { AdSlot } from './ad-slot'
import { BANNER_HEIGHT, BANNER_KEY, BANNER_SRC, BANNER_WIDTH } from './adsterra'

/**
 * Adsterra 300x250 banner, isolated in its own document.
 *
 * TWO PROBLEMS, ONE SOLUTION.
 *
 * 1. Adsterra's loader reads a GLOBAL `atOptions` when it evaluates. Put two
 *    banners on one page and they race over one variable; the usual outcome is
 *    a blank second slot. Inside an iframe each banner gets its own `window`,
 *    so there is no shared variable to race over and a page can carry as many
 *    as it likes — which is what makes the three homepage placements possible.
 *
 * 2. Ad creatives ship their own CSS. A `srcdoc` document cannot style, reflow
 *    or overflow its parent, and the page's stylesheet cannot reach in and
 *    resize the creative.
 *
 * NOTE ON CSP: a `srcdoc` iframe INHERITS the parent document's policy, so
 * `www.highrevenueformat.com` has to be named in `script-src` in
 * next.config.ts for this to render at all. It is, deliberately and by name.
 */

const SRC_DOC = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;overflow:hidden;background:transparent}
</style>
</head>
<body>
<script type="text/javascript">
  atOptions = {
    'key' : '${BANNER_KEY}',
    'format' : 'iframe',
    'height' : ${BANNER_HEIGHT},
    'width' : ${BANNER_WIDTH},
    'params' : {}
  };
</script>
<script type="text/javascript" src="${BANNER_SRC}"></script>
</body>
</html>`

export function AdBanner({
  /** Names the placement, so slots can be told apart when debugging. */
  slot,
  /** Below-the-fold slots defer the request until the reader nears them. */
  lazy = true,
  className = '',
}: {
  slot: string
  lazy?: boolean
  className?: string
}) {
  return (
    <AdSlot minHeight={BANNER_HEIGHT} className={className}>
      <div
        className="overflow-hidden rounded-xl"
        data-ad-slot={slot}
        style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT }}
      >
        <iframe
          title="Advertisement"
          srcDoc={SRC_DOC}
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          loading={lazy ? 'lazy' : 'eager'}
          scrolling="no"
          /*
           * No `allow-same-origin`. With it, this frame would be same-origin
           * with the page and its script could read the document — including a
           * result card showing a named student's marks. Without it the frame
           * gets an opaque origin and can render an ad and nothing else.
           */
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
          style={{ border: 0, display: 'block' }}
        />
      </div>
    </AdSlot>
  )
}

/**
 * The frame every visible ad sits in.
 *
 * WHY THERE IS A LABEL. This site's whole product is a result a student
 * believes. An unlabelled banner placed under the lookup tool is a box of
 * someone else's content in the exact spot a student is looking for their own
 * marks — and ad creatives in this market are frequently styled to look like
 * result notifications. The label is small and grey, but it is the line
 * between an ad slot and a dark pattern, and Adsterra's own publisher terms
 * require ads to be distinguishable from site content.
 *
 * WHY THE BOX IS SIZED BEFORE THE AD ARRIVES. Reserving the height means the
 * page does not jump when a creative loads. An unreserved slot is the single
 * most common cause of a bad Cumulative Layout Shift score, and this site's
 * mobile Performance score has already been fought for once.
 */
export function AdSlot({
  children,
  /** Reserved height, so nothing below moves when the creative arrives. */
  minHeight,
  className = '',
}: {
  children: React.ReactNode
  minHeight: number
  className?: string
}) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center px-4 ${className}`}
      /*
       * `isolation` keeps a creative's z-index inside this box, and `contain`
       * stops it influencing the layout of anything around it. Between them,
       * an ad stylesheet cannot reach the page and the page cannot reflow the
       * ad — the "no CSS conflict" requirement, enforced by the browser.
       */
      style={{ isolation: 'isolate', contain: 'layout paint' }}
    >
      <span className="mb-1.5 text-[10px] font-medium tracking-[0.18em] text-slate-400 uppercase select-none">
        Advertisement
      </span>
      <div className="flex w-full justify-center" style={{ minHeight }}>
        {children}
      </div>
    </div>
  )
}

import { type JsonLd, jsonLdGraph } from '@/lib/schema/json-ld'

/**
 * Renders structured data as a single `@graph` script.
 *
 * `jsonLdGraph` escapes `<` before it reaches the DOM, so a board name or a
 * quoted notice containing `</script>` cannot close this element early.
 */
export function JsonLdScript({ nodes }: { nodes: JsonLd[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdGraph(nodes) }} />
  )
}

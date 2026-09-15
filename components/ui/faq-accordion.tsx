/**
 * FAQ accordion, built on native `<details>` — no state, no JavaScript, and it
 * still works if hydration never happens.
 *
 * The answers are passed in as plain strings on purpose: the same array feeds
 * `faqSchema()`, so what a search engine is told and what a reader sees cannot
 * drift apart. A rich-results answer that does not appear on the page is a
 * structured-data violation, and it is the easy mistake to make when the two
 * are maintained separately.
 */
export type FaqItem = { question: string; answer: string }

export function FaqAccordion({ items, headingId }: { items: FaqItem[]; headingId?: string }) {
  return (
    <div
      className="divide-y divide-[var(--border-subtle)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-card)] bg-[var(--surface)]"
      aria-labelledby={headingId}
    >
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[var(--text-strong)] hover:bg-[var(--surface-raised)] [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="text-primary-600 h-5 w-5 shrink-0 transition-transform group-open:rotate-45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="px-5 pb-5 text-[var(--text-body)]">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}

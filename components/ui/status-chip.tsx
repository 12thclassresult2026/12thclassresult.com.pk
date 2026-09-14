import type { FactStatus } from '@/lib/result/verified-fact'

/**
 * A status chip.
 *
 * COLOUR IS NEVER THE ONLY SIGNAL. Every state carries its own glyph and its
 * own words, so the chip is readable in monochrome, by a screen reader, and by
 * someone who cannot distinguish the colours.
 *
 * The five states map 1:1 onto `FactStatus`. There is deliberately no "generic"
 * variant: a status the model cannot express is a status we should not show.
 */

type ChipConfig = {
  label: string
  glyph: string
  className: string
}

const CONFIG: Record<FactStatus, ChipConfig> = {
  confirmed: {
    label: 'Official',
    glyph: '✓',
    className:
      'bg-[var(--color-status-confirmed-bg)] text-[var(--color-status-confirmed)] ring-[var(--color-status-confirmed)]/30',
  },
  tentative: {
    label: 'Tentative',
    glyph: '≈',
    className:
      'bg-[var(--color-status-tentative-bg)] text-[var(--color-status-tentative)] ring-[var(--color-status-tentative)]/30',
  },
  expected: {
    label: 'Expected',
    glyph: '~',
    className:
      'bg-[var(--color-status-expected-bg)] text-[var(--color-status-expected)] ring-[var(--color-status-expected)]/30',
  },
  historical: {
    label: 'Historical',
    glyph: '◷',
    className:
      'bg-[var(--color-status-unknown-bg)] text-[var(--color-status-unknown)] ring-[var(--color-status-unknown)]/30',
  },
  unknown: {
    label: 'Not announced',
    glyph: '–',
    className:
      'bg-[var(--color-status-unknown-bg)] text-[var(--color-status-unknown)] ring-[var(--color-status-unknown)]/30',
  },
}

export function StatusChip({ status, children }: { status: FactStatus; children?: string }) {
  const config = CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-badge)] px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      <span aria-hidden="true">{config.glyph}</span>
      {children ?? config.label}
    </span>
  )
}

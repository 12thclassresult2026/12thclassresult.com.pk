import type { Word } from './types'

/**
 * pdf.js text items -> positioned words.
 *
 * TWO CONVERSIONS HAPPEN HERE, both of which the geometry depends on.
 *
 * 1. pdf.js reports y in PDF space, which grows UPWARD from the bottom-left.
 *    Every tolerance in the parser is written the way a person reads a page,
 *    so y is flipped once, here, and never again.
 *
 * 2. A text item is one show-text operation, which is usually a single word but
 *    is sometimes a run ("1982 with"). The parser aligns on the x of a roll
 *    number and measures name and result fields against it, so a run has to be
 *    split or a two-word item would be placed entirely at the x of its first
 *    character. Widths inside a run are apportioned by character count — an
 *    approximation, but only ever used to separate words that pdf.js already
 *    told us share one horizontal advance.
 */
export type PdfTextItem = {
  str: string
  width: number
  height: number
  transform: number[]
}

export function wordsFromItems(items: PdfTextItem[], pageHeight: number): Word[] {
  const words: Word[] = []

  for (const item of items) {
    const raw = item.str
    if (raw.trim() === '') continue

    const x0 = item.transform[4]
    const y0 = item.transform[5]
    if (x0 === undefined || y0 === undefined) continue

    const y = pageHeight - y0
    const height = item.height || 0
    const width = item.width || 0

    if (!/\s/.test(raw.trim())) {
      words.push({ x: x0, y, w: width, h: height, text: raw.trim() })
      continue
    }

    // A run: apportion the measured advance across its characters so each word
    // keeps a usable x. Leading/trailing space is preserved in the offset.
    const perChar = raw.length > 0 ? width / raw.length : 0
    let offset = 0
    for (const piece of raw.split(/(\s+)/)) {
      if (piece === '') continue
      if (/^\s+$/.test(piece)) {
        offset += piece.length * perChar
        continue
      }
      words.push({
        x: x0 + offset,
        y,
        w: piece.length * perChar,
        h: height,
        text: piece,
      })
      offset += piece.length * perChar
    }
  }

  return words
}

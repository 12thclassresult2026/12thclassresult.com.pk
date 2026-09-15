/**
 * Gazette parser types.
 *
 * The parser is deliberately separate from the result contract: it describes
 * what was READ OFF A PAGE, with the coordinates it was read from. Turning that
 * into a result record is a later, explicit step, so a parsing assumption can
 * never quietly become a published fact.
 */

/** A single positioned word. Coordinates are PDF points, y increasing DOWN. */
export type Word = {
  x: number
  y: number
  /** Advance width of the word. */
  w: number
  /** Glyph height, used as the font-size proxy for all tolerances. */
  h: number
  text: string
}

/** One inferred column on one page. */
export type Column = {
  /** Inclusive left edge in points. */
  left: number
  /** Exclusive right edge in points. */
  right: number
  /** y below which body rows start — the underside of the column headings. */
  bodyTop: number
  /** x the roll-number field is aligned on, from the data, not the heading. */
  rollX: number
  /** x the candidate name starts at. */
  nameX: number
  /**
   * x at or beyond which text is the result field. Backed off from the
   * "Result-I / Result-II" heading because the printed `PI:` / `PII:` labels
   * sit to the LEFT of the heading's own x.
   */
  resultX: number
}

/** The geometry of one page, inferred from that page alone. */
export type PageGeometry = {
  /** x of the gutter between the two columns. */
  split: number
  /** Font-size proxy driving every tolerance on this page. */
  font: number
  columns: Column[]
}

/**
 * Why a page could not be parsed as a candidate page.
 *
 * `not-a-candidate-page` is an ordinary outcome — most gazettes open with a
 * cover, an introduction and statistics. The others are refusals: the page
 * looks like candidate data but not in a shape this parser family understands,
 * and guessing is what produces wrong-candidate mappings.
 */
export type GeometryRefusal =
  | 'not-a-candidate-page'
  | 'unexpected-column-count'
  | 'missing-column-headings'
  | 'heading-rows-disagree'

/** A row the parser refused to accept, kept with everything needed to audit it. */
export type ParseProblem = {
  page: number
  column?: number
  kind:
    | GeometryRefusal
    | 'malformed-roll-number'
    | 'malformed-name'
    | 'missing-result'
    | 'marks-out-of-range'
    | 'unclassified-heading'
    | 'empty-heading'
    | 'unassigned-text'
    | 'duplicate-key'
  /** Verbatim text, so a human can compare against the page. */
  raw: string
  bbox?: [number, number, number, number]
}

/** What one candidate row actually said, before any interpretation. */
export type RawRecord = {
  rollNumber: string
  candidateName: string
  /** The result cell exactly as printed. Never normalised away. */
  rawResultStatus: string
  institution: string | null
  page: number
  column: number
  bbox: [number, number, number, number]
  /** Full verbatim text of the row's bounding box, for traceability. */
  raw: string
}

export type PageResult = {
  records: RawRecord[]
  problems: ParseProblem[]
  /** Institution heading still in force when the page ended. */
  institution: string | null
  geometry: PageGeometry | null
}

import { describe, expect, it } from 'vitest'

import { getBoardById } from '@/lib/board/registry'
import {
  BOARD_RECHECKING,
  NOT_RE_MARKING_QUOTE,
  RECHECKING_CHECKPOINTS,
  boardsWithFeeConflicts,
  feeRange,
  hasAnyHsscFee,
  recheckingFor,
} from '@/lib/rechecking/registry'
import { isHsscFee } from '@/lib/rechecking/types'

/**
 * The rechecking content gate.
 *
 * Phase 1 research flagged two traps that would each produce a confidently
 * wrong page, and one systematic error the whole market makes. These tests
 * exist so that none of the three can be introduced by a later edit.
 */

describe('registry integrity', () => {
  it('references only boards that exist', () => {
    for (const entry of BOARD_RECHECKING) {
      expect(getBoardById(entry.boardId), `unknown board ${entry.boardId}`).toBeDefined()
    }
  })

  it('lists each board once', () => {
    const ids = BOARD_RECHECKING.map((e) => e.boardId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every fee a source document and an examination', () => {
    for (const entry of BOARD_RECHECKING) {
      for (const fee of entry.fees) {
        expect(fee.readFrom.length, `${entry.boardId} fee has no source`).toBeGreaterThan(10)
        expect(fee.observedFor, `${entry.boardId} fee has no examination`).toBeTruthy()
        expect(fee.amount).toBeGreaterThan(0)
      }
    }
  })

  it('carries a provenance note and a source URL for every board', () => {
    for (const entry of BOARD_RECHECKING) {
      expect(entry.provenanceNote.length, `${entry.boardId}`).toBeGreaterThan(60)
      expect(entry.sourceUrl).toMatch(/^https:\/\//)
      expect(entry.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}/)
    }
  })
})

describe('the systematic error this page exists to avoid', () => {
  it('claims no HSSC rechecking fee, because no board publishes one', () => {
    /*
     * THE CENTRAL INVARIANT.
     *
     * Every figure was read from a matric portal or an undated rulebook. No
     * board had deployed an HSSC Part-II rechecking route: Gujranwala's 11th
     * and 12th options are commented out of its own HTML, Lahore's HSSC
     * subdomain 404s, Rawalpindi's portal was serving 9th class.
     *
     * If this ever fails, a board has genuinely published an HSSC fee — update
     * the page's caveat deliberately rather than deleting this test.
     */
    for (const entry of BOARD_RECHECKING) {
      for (const fee of entry.fees) {
        expect(
          isHsscFee(fee.observedFor),
          `${entry.boardId} presents ${fee.amount} as an HSSC fee`,
        ).toBe(false)
      }
    }
    expect(hasAnyHsscFee()).toBe(false)
  })

  it('never attributes a deadline to Lahore', () => {
    // The widely repeated "15 days" for Lahore appears only on third-party
    // sites and could not be found on the board's own. Carrying it would
    // launder an aggregator's guess into an apparently sourced fact.
    const lahore = recheckingFor('bise-lahore')
    expect(lahore).toBeDefined()
    expect(lahore!.deadlineDays.value).toBeNull()
    expect(lahore!.deadlineDays.status).toBe('unknown')
  })

  it('does not treat Punjab boards as sharing one fee', () => {
    // They share an examination calendar, not a fee schedule. A page that
    // generalises one board's figure across the province would be wrong.
    const headlineFees = BOARD_RECHECKING.map((e) => e.fees[0]?.amount).filter(Boolean)
    expect(new Set(headlineFees).size).toBeGreaterThan(1)
  })
})

describe('conflicting official sources are shown, not resolved', () => {
  it('keeps all three of Gujranwala’s published figures', () => {
    const gujranwala = recheckingFor('bise-gujranwala')
    expect(gujranwala).toBeDefined()
    expect(gujranwala!.fees.length).toBe(3)

    // All three are genuine board publications, so none may be silently dropped.
    const amounts = gujranwala!.fees.map((f) => f.amount).sort((a, b) => a - b)
    expect(amounts).toEqual([600, 1000, 1500])
  })

  it('orders a conflicted board so the live portal figure leads', () => {
    for (const entry of boardsWithFeeConflicts()) {
      expect(entry.fees[0]?.readFrom, `${entry.boardId}`).toMatch(/live|portal/i)
    }
  })

  it('flags the DG Khan form fee as possibly superseded, not the script fee', () => {
    const dgKhan = recheckingFor('bise-dg-khan')
    expect(dgKhan).toBeDefined()
    const fee = dgKhan!.fees[0]
    expect(fee?.amount).toBe(750)
    expect(fee?.formFee).toBe(50)
    expect(fee?.note).toMatch(/supersed/i)
    // The per-script charge is unaffected and must not be hedged.
    expect(fee?.note).toMatch(/750 per-script charge is unaffected/i)
  })
})

describe('the traps', () => {
  it('records the Bahawalpur Rule 35 trap without applying it to HSSC', () => {
    /*
     * Rule 35 — "No candidate will be allowed to appear for improvement of
     * marks after passing the examination" — reads as a categorical ban. It
     * sits under "RULES FOR PROFESSIONAL EXAMINATIONS" and governs PTC, CT, OT
     * and Art & Crafts. Citing it as an Intermediate rule is a factual error.
     */
    const bwp = recheckingFor('bise-bahawalpur')
    expect(bwp).toBeDefined()
    expect(bwp!.provenanceNote).toMatch(/PROFESSIONAL EXAMINATIONS/i)
    expect(bwp!.provenanceNote).toMatch(/NOT an Intermediate rule/i)
  })

  it('does not claim a board permits re-marking when it is merely silent', () => {
    // `statesNotReMarking: false` means the board does not publish the rule.
    // Two boards are in that state and neither may be described either way.
    const silent = BOARD_RECHECKING.filter((e) => !e.statesNotReMarking)
    expect(silent.length).toBeGreaterThan(0)
    for (const entry of silent) {
      expect(entry.provenanceNote).not.toMatch(/permits re-marking|allows re-marking/i)
    }
  })

  it('keeps a board’s own terminology rather than normalising it', () => {
    // DG Khan says "re-tallying", which describes the process more accurately
    // than "rechecking" does.
    expect(recheckingFor('bise-dg-khan')?.boardTerm).toBe('Re-tallying')
  })
})

describe('the leading claim', () => {
  it('quotes the re-marking prohibition from a board, with its basis', () => {
    expect(NOT_RE_MARKING_QUOTE.text).toMatch(/cannot be done under any circumstances/i)
    expect(NOT_RE_MARKING_QUOTE.attributedTo).toMatch(/Rawalpindi/i)
    expect(NOT_RE_MARKING_QUOTE.basis).toMatch(/superior courts/i)
  })

  it('lists exactly the four published verification points', () => {
    expect(RECHECKING_CHECKPOINTS).toHaveLength(4)
    for (const checkpoint of RECHECKING_CHECKPOINTS) {
      expect(checkpoint.attributedTo.length).toBeGreaterThan(10)
    }
  })

  it('reports a fee range spanning the real published spread', () => {
    const range = feeRange()
    expect(range).not.toBeNull()
    expect(range!.min).toBe(600)
    expect(range!.max).toBe(1500)
  })
})

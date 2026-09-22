import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  CURRENT_SESSION,
  datasetFor,
  LOADED_DATASETS,
  RESULT_SESSIONS,
  resolveSession,
} from '@/lib/gazettes/datasets'

/**
 * A 2025 DATASET MUST NEVER ANSWER A 2026 QUESTION.
 *
 * This is the defect these rules were written for, and it was live. The server
 * action read `year: 2025, examination: 'first-annual'` as literals while every
 * heading around the form said "12th Class Result 2026", and the form itself
 * named no year at all.
 *
 * On result morning that produces one of two answers, and neither looks wrong
 * on screen: the roll number matches a different candidate who held it in the
 * 2025 cohort, so a stranger's marks are shown as yours — or it matches nobody,
 * so a result that has just been declared is reported as not found.
 *
 * Every rule below guards one link in the chain that stops that.
 */

const REPO_ROOT = process.cwd()
const read = (path: string) => readFileSync(join(REPO_ROOT, path), 'utf8')

describe('the examination session is asked for, not assumed', () => {
  it('takes the session from the request rather than a literal', () => {
    const action = read('app/results/[board]/12th-class/lookup-action.ts')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')

    expect(action, 'the session is hard-coded in the lookup again').not.toMatch(/year:\s*\d{4}/)
    expect(action, 'the lookup no longer reads the session from the form').toContain(
      'resolveSession(',
    )
    expect(action).toContain('year: session.year')
    expect(action).toContain('examination: session.examination')
  })

  it('refuses a session this site does not offer', () => {
    // A crafted form must not be able to ask for an arbitrary year.
    expect(resolveSession(2099, 'first-annual')).toBeNull()
    expect(resolveSession(2026, 'made-up-session')).toBeNull()
    expect(resolveSession('', '')).toBeNull()
    expect(resolveSession(2026, 'first-annual')).not.toBeNull()
  })

  it('offers a session the student can see and change', () => {
    const hero = read('components/home/hero-section.tsx')
    expect(hero, 'the form no longer lets a student choose the session').toContain(
      'RESULT_SESSIONS.map',
    )
    expect(hero, 'the chosen session is not sent with the lookup').toContain("form.set('year'")
    expect(hero).toContain("form.set('examination'")
  })

  it('states back the session that actually answered', () => {
    /*
     * The card must report the session the SERVER searched, not the one the
     * form happens to be showing now — a student can change the dropdown while
     * a request is in flight.
     */
    const hero = read('components/home/hero-section.tsx')
    expect(hero, 'the result card is not told which session answered').toContain(
      'year={lookup.session.year}',
    )
  })
})

describe('the current session is honest about having no data', () => {
  it('lists the current session even though nothing is loaded for it', () => {
    expect(CURRENT_SESSION.year).toBe(2026)
    expect(CURRENT_SESSION.isCurrent).toBe(true)
  })

  it('holds no dataset for the current session, and says so by having none', () => {
    /*
     * When a 2026 gazette is genuinely parsed and loaded, this rule flips and
     * should be updated deliberately — that is the point of it failing loudly
     * rather than a 2026 lookup quietly starting to answer from 2025 rows.
     */
    const loadedForCurrent = LOADED_DATASETS.filter(
      (d) => d.year === CURRENT_SESSION.year && d.examination === CURRENT_SESSION.examination,
    )
    expect(
      loadedForCurrent,
      'a 2026 dataset appeared: confirm it was parsed from a 2026 gazette, then update this rule',
    ).toEqual([])
  })

  it('returns nothing for a current-session lookup on every board', () => {
    // Which is what makes the answer "we have not published this yet" plus the
    // board's own portal, rather than a record from another year.
    for (const dataset of LOADED_DATASETS) {
      expect(
        datasetFor(dataset.boardSlug, CURRENT_SESSION),
        `${dataset.boardSlug} resolves a dataset for the current session`,
      ).toBeNull()
    }
  })

  it('marks every archive session as an archive in its own label', () => {
    // A student picking a past year must be able to see that is what they did.
    for (const session of RESULT_SESSIONS.filter((s) => !s.isCurrent)) {
      expect(
        session.label.toLowerCase(),
        `${session.year} is offered without being labelled an archive`,
      ).toContain('archive')
    }
  })

  it('finds every loaded dataset through its own session', () => {
    // Guards the opposite mistake: a session list that drifts away from the
    // data would make working archives unreachable.
    for (const dataset of LOADED_DATASETS) {
      const session = resolveSession(dataset.year, dataset.examination)
      expect(
        session,
        `${dataset.boardSlug} ${dataset.year} is loaded but not offered as a session`,
      ).not.toBeNull()
      expect(datasetFor(dataset.boardSlug, session!)).not.toBeNull()
    }
  })
})

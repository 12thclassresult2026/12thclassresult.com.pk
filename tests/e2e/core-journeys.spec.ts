import { expect, test } from '@playwright/test'

/**
 * Representative end-to-end coverage for the Phase 3 foundation.
 *
 * The assertions that matter most here are not "the page loads" — they are the
 * honesty invariants, checked against rendered output rather than against the
 * data that produced it. A defect invisible in the registry can be obvious on
 * the page.
 */

test.describe('core pages', () => {
  test('homepage states plainly what has not been announced', async ({ page }) => {
    await page.goto('/')
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    await expect(h1).toContainText(/12th Class Result/i)
    /*
     * The differentiator: no competitor says this, and three of them publish
     * mutually contradictory dates instead.
     *
     * The wording is now generated from the registry, so this matches the claim
     * rather than one sentence. A redesign once dropped the statement entirely
     * and put five invented "Tentative: <month> 2026" dates on the page in its
     * place; this is the assertion that catches that happening again.
     */
    await expect(
      page.getByText(/HSSC Part-II 2026 result date backed by an official notification/i),
    ).toBeVisible()
    await expect(page.getByText(/could be traced to a board notification/i)).toBeVisible()
  })

  test('result hub owns the head term and lists boards', async ({ page }) => {
    await page.goto('/results/12th-class')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('12th Class Result')
    await expect(page.locator('table')).toBeVisible()
  })

  test('board directory renders', async ({ page }) => {
    await page.goto('/boards')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Education Boards')
  })

  test('an unknown route returns a real 404, not a redirect', async ({ page }) => {
    const response = await page.goto('/no-such-page-exists')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Page not found')
  })

  test('an unregistered board returns a real 404', async ({ page }) => {
    // dynamicParams = false, so the parameter space is closed.
    const response = await page.goto('/results/not-a-board/12th-class')
    expect(response?.status()).toBe(404)
  })
})

test.describe('the gazette-only board — the correctness rule', () => {
  test('renders NO roll-number input, and says why', async ({ page }) => {
    await page.goto('/results/karachi-board/12th-class')

    // Karachi has no lookup form at all. Every competitor shows a roll-number
    // box for every board; doing that here would be an instruction a reader
    // cannot follow.
    await expect(page.locator('main input')).toHaveCount(0)
    await expect(
      page.getByText(/does not have an online roll-number result checker/i).first(),
    ).toBeVisible()
  })

  test('shows each group separately, including one not yet declared', async ({ page }) => {
    await page.goto('/results/karachi-board/12th-class')
    await expect(page.getByRole('heading', { name: /Result status by group/i })).toBeVisible()
    for (const group of ['Pre-Medical', 'Pre-Engineering', 'Science General', 'Commerce']) {
      await expect(page.getByRole('rowheader', { name: group })).toBeVisible()
    }
    // The undeclared group must not inherit a board-level "announced".
    await expect(page.getByText('Not announced').first()).toBeVisible()
  })

  test('carries visible provenance', async ({ page }) => {
    await page.goto('/results/karachi-board/12th-class')
    await expect(page.getByText('Last checked').first()).toBeVisible()
  })
})

test.describe('the fallback ladder', () => {
  test('offers a second route, and never the same link twice', async ({ page }) => {
    await page.goto('/results/karachi-board/12th-class')
    await expect(page.getByRole('heading', { name: /If that does not work/i })).toBeVisible()

    // The board's own domain is the last rung on every board, because the
    // commonest way a student is misled here is an aggregator that looks
    // official.
    const ladder = page.getByRole('heading', { name: /If that does not work/i }).locator('..')
    await expect(ladder.getByRole('link', { name: /official website/i })).toBeVisible()
  })

  test('states availability without implying a result has been declared', async ({ page }) => {
    await page.goto('/results/karachi-board/12th-class')
    // The qualifier is the point: a reachable portal says nothing about
    // whether a result exists, and a reader can easily read it as if it did.
    await expect(
      page.getByText(/availability when it was checked, not whether a result has been announced/i),
    ).toBeVisible()
  })

  test('every outbound board link is https and not followed', async ({ page }) => {
    await page.goto('/results/karachi-board/12th-class')
    const links = page.locator('a[href^="http"]')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i += 1) {
      const link = links.nth(i)
      expect(await link.getAttribute('href')).toMatch(/^https:\/\//)
      // Outbound links to boards must not pass authority, and must not leak a
      // referrer chain back through our pages.
      expect(await link.getAttribute('rel')).toContain('noopener')
    }
  })
})

test.describe('no fabricated data reaches the page', () => {
  const CIRCULATING_SHORTCODES = ['5050', '800291', '800299', '8583', '800296']

  for (const path of [
    '/',
    '/results/12th-class',
    '/boards',
    '/results/karachi-board/12th-class',
    '/guides/rechecking',
    '/guides/how-percentage-is-calculated',
    '/tools/percentage-calculator',
    '/about',
    '/methodology',
  ]) {
    test(`no unverified SMS shortcode on ${path}`, async ({ page }) => {
      await page.goto(path)
      const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
      for (const code of CIRCULATING_SHORTCODES) {
        expect(body, `${path} shows unverified shortcode ${code}`).not.toContain(code)
      }
      // No countdown, and no unverified liveness claim.
      expect(body).not.toMatch(/\bLIVE\b/)
    })
  }
})

test.describe('the rechecking guide — the market gap', () => {
  test('leads with what rechecking is NOT', async ({ page }) => {
    await page.goto('/guides/rechecking')
    // The most consequential misunderstanding in the topic, and the thing a
    // student needs before they spend money. It must be above every fee.
    const answer = page.getByText(/Rechecking does not mean your paper is marked again/i)
    await expect(answer).toBeVisible()

    const answerBox = await answer.boundingBox()
    const table = await page.locator('table').first().boundingBox()
    expect(answerBox!.y, 'fees appear before the direct answer').toBeLessThan(table!.y)
  })

  test('never presents a fee as a 12th class fee', async ({ page }) => {
    await page.goto('/guides/rechecking')
    // Every figure was read from a matric portal or an undated rulebook. The
    // caveat is what separates this page from every competitor.
    await expect(
      page.getByRole('heading', { name: /No board has published a 12th class rechecking fee/i }),
    ).toBeVisible()

    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    expect(body).toMatch(/an SSC \(matric\) portal/i)
    expect(body).not.toMatch(/HSSC Part-II \(12th class\)\s*<\/td>/i)
  })

  test('shows the conflicting official figures rather than picking one', async ({ page }) => {
    await page.goto('/guides/rechecking')
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    // All three of Gujranwala's genuine published figures.
    for (const amount of ['Rs 1,500', 'Rs 1,000', 'Rs 600']) {
      expect(body, `missing official figure ${amount}`).toContain(amount)
    }
    expect(body).toMatch(/shown rather than resolved/i)
  })

  test('keeps a board’s own terminology', async ({ page }) => {
    await page.goto('/guides/rechecking')
    await expect(page.getByText(/calls it “Re-tallying”/i)).toBeVisible()
  })

  test('is reachable from the result hub', async ({ page }) => {
    await page.goto('/results/12th-class')
    // Scoped to `main`. The header and footer now link the guide too, and an
    // unscoped lookup would pass on a chrome link while the hub's own body had
    // lost its route to the guide — the exact thing this test exists to catch.
    const link = page.locator('main').getByRole('link', { name: /^rechecking$/i })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/\/guides\/rechecking$/)
  })
})

test.describe('the percentage calculator — correcting a wrong market answer', () => {
  test('computes a percentage from marks', async ({ page }) => {
    await page.goto('/tools/percentage-calculator')
    await page.getByLabel('Marks you obtained').fill('842')
    // 1100 is pre-filled as the usual HSSC total.
    await expect(page.getByLabel('Total marks')).toHaveValue('1100')
    await expect(page.getByText('76.55%')).toBeVisible()
  })

  test('never shows a grade or a division', async ({ page }) => {
    /*
     * The central constraint. Grade bands came back from research as
     * "several variants — unverified, not carried", and the grade is the
     * figure a student is most likely to act on.
     */
    await page.goto('/tools/percentage-calculator')
    await page.getByLabel('Marks you obtained').fill('900')

    // Scoped to the calculator's own output. The surrounding copy legitimately
    // discusses grades in order to explain why none is given.
    const output = page.locator('[aria-live="polite"]')
    await expect(output).toContainText('81.82%')

    const outputText = (await output.innerText()).replace(/\s+/g, ' ')
    expect(outputText, 'calculator emitted a letter grade').not.toMatch(
      /\bgrade\s*[:=]\s*[A-F]|\b[A-F][+-]?1?\s+grade\b|\bA-?one\b/i,
    )
    expect(outputText, 'calculator emitted a division').not.toMatch(
      /\b(first|second|third)\s+division\b/i,
    )
    await expect(page.getByText(/No grade or division is shown here/i)).toBeVisible()
  })

  test('refuses marks above the total instead of printing nonsense', async ({ page }) => {
    await page.goto('/tools/percentage-calculator')
    await page.getByLabel('Marks you obtained').fill('1200')
    // Scoped to the calculator: Next injects its own route-announcer alert.
    const alert = page.locator('[aria-live="polite"]').getByRole('alert')
    await expect(alert).toBeVisible()
    // Carried in text, not by colour alone.
    await expect(alert).toHaveText(/cannot be higher than the total/i)
    // And critically: no percentage is offered alongside the refusal.
    await expect(page.getByText('Your percentage')).toHaveCount(0)
  })

  test('accepts a total that is not 1100', async ({ page }) => {
    // The total is a scheme fact, not a safe default — the field is editable.
    await page.goto('/tools/percentage-calculator')
    await page.getByLabel('Total marks').fill('550')
    await page.getByLabel('Marks you obtained').fill('400')
    await expect(page.getByText('72.73%')).toBeVisible()
  })

  test('the guide names the wrong formula and why it does not apply', async ({ page }) => {
    await page.goto('/guides/how-percentage-is-calculated')
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    expect(body).toMatch(/CGPA × 9\.5/)
    expect(body).toMatch(/CBSE/)
    expect(body).toMatch(/Part-I and Part-II together/i)
  })

  test('is reachable from the result hub', async ({ page }) => {
    await page.goto('/results/12th-class')
    const link = page.getByRole('link', { name: /how the percentage is calculated/i })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/how-percentage-is-calculated$/)
  })
})

test.describe('the trust layer — what makes the site citable', () => {
  test('states plainly that it is not a board and not a checker', async ({ page }) => {
    await page.goto('/about')
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    expect(body).toMatch(/Not an education board/i)
    expect(body).toMatch(/Not affiliated with, endorsed by, or acting for any board/i)
    expect(body).toMatch(/Not a result checker/i)
  })

  test('claims no official status for itself', async ({ page }) => {
    // Several sites in this market use board-like naming. Anything here that
    // read as an official endorsement would be the same deception.
    for (const path of ['/about', '/methodology']) {
      await page.goto(path)
      const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
      expect(body, `${path} implies official status`).not.toMatch(
        /\bwe are (an? )?official\b|\bofficially endorsed\b|\bgovernment approved\b|\bin partnership with\b/i,
      )
    }
  })

  test('publishes the confidence states a reader can check a claim against', async ({ page }) => {
    await page.goto('/methodology')
    for (const state of ['confirmed', 'tentative', 'expected', 'historical', 'unknown']) {
      await expect(page.getByRole('rowheader', { name: state, exact: true })).toBeVisible()
    }
    // The distinction the whole capability model rests on.
    await expect(page.getByText(/“Not verified” never becomes “No”/i)).toBeVisible()
  })

  test('says what is never published, including personal results', async ({ page }) => {
    await page.goto('/methodology')
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    expect(body).toMatch(/no page on this site at which an individual’s result can be looked up/i)
    expect(body).toMatch(/Position holders or toppers/i)
  })

  test('is reachable from every page via the footer', async ({ page }) => {
    // Scoped to the footer, which is what the test is named for. The header
    // also carries "How we verify" now, and an unscoped lookup would both
    // break on the duplicate and stop proving the footer claim.
    /*
     * Assert REACHABILITY, not wording.
     *
     * This matched the exact labels "How we verify" and "About". A redesign
     * renamed them — the methodology link now reads "Read Our Full Verification
     * Methodology" — and the test failed even though both pages were still one
     * click away from every page. The claim in this test's own name is that a
     * reader can get there, so pin the destination and let the label move.
     */
    for (const path of ['/', '/results/12th-class', '/guides/rechecking']) {
      await page.goto(path)
      const footer = page.locator('footer')
      for (const destination of ['/methodology', '/about']) {
        await expect(
          footer.locator(`a[href="${destination}"]`).first(),
          `${path} does not link to ${destination} from the footer`,
        ).toBeVisible()
      }
    }
  })
})

test.describe('accessibility and layout', () => {
  test('skip link is the first tab stop and targets main', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toHaveText(/Skip to main content/i)
    await expect(focused).toHaveAttribute('href', '#main')
  })

  test('has exactly one h1 and a main landmark', async ({ page }) => {
    for (const path of [
      '/',
      '/results/12th-class',
      '/boards',
      '/results/karachi-board/12th-class',
      '/guides/rechecking',
      '/guides/how-percentage-is-calculated',
      '/tools/percentage-calculator',
      '/about',
      '/methodology',
    ]) {
      await page.goto(path)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('main#main')).toHaveCount(1)
    }
  })

  test('never overflows horizontally', async ({ page }) => {
    for (const path of [
      '/',
      '/results/12th-class',
      '/boards',
      '/results/karachi-board/12th-class',
      '/guides/rechecking',
      '/guides/how-percentage-is-calculated',
      '/tools/percentage-calculator',
      '/about',
      '/methodology',
    ]) {
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(1)
    }
  })

  test('logs no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.goto('/results/karachi-board/12th-class')
    expect(errors).toEqual([])
  })
})

test.describe('crawl surface', () => {
  test('robots.txt resolves and references the sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('sitemap')
    expect(body).toContain('12thclassresult.com.pk')
  })

  test('sitemap index resolves', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('sitemapindex')
  })

  /*
   * This used to assert `not.toContain('karachi-board')` against /sitemap.xml
   * and passed for the wrong reason: that file is an INDEX listing five segment
   * URLs, so no page URL appears in it and the assertion could never fail. The
   * check has to read the segment that actually carries board pages.
   */
  test('the sitemap segment lists published boards and no held one', async ({ request }) => {
    const response = await request.get('/sitemaps/results.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()

    expect(body, 'a published board is missing from the sitemap').toContain(
      '/results/karachi-board/12th-class',
    )
    // Held boards have no page at all, so they must not be advertised.
    for (const slug of ['federal-board', 'zueb']) {
      expect(body, `${slug} is held but appears in the sitemap`).not.toContain(`/${slug}/`)
    }
  })

  /*
   * Replaces "a held board page is noindex". Karachi was the draft example
   * when only one board page existed; it is published now, so that test was
   * asserting the opposite of the intended rule against a stale subject.
   *
   * The rule itself still needs covering, and it is stronger than it was: a
   * held board no longer renders a noindex page, it has no page. Nothing can
   * leak, because nothing is built.
   */
  test('a held board has no page, and a published one is indexable', async ({ page }) => {
    const held = await page.goto('/results/federal-board/12th-class')
    expect(held?.status(), 'a held board is serving a page').toBe(404)

    await page.goto('/results/karachi-board/12th-class')
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).not.toContain('noindex')
    expect(robots).not.toContain('nofollow')
  })
})

test.describe('board pages carry board-specific verified content', () => {
  test('shows each board the portal wording it will actually see', async ({ page }) => {
    /*
     * The anti-doorway check. A similarity pass found some board pages 73%
     * alike before the observations section was added — near-copies with a name
     * swapped. These assertions pin the facts that make each page genuinely
     * different, and they come from the board's own screen.
     */
    await page.goto('/results/rawalpindi-board/12th-class')
    const rawalpindi = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    expect(rawalpindi).toMatch(/HSSC Second Annual Examination/i)
    expect(rawalpindi).toMatch(/2015/)

    await page.goto('/results/larkana-board/12th-class')
    const larkana = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    expect(larkana).toMatch(/HSC-II/)
    // Larkana asks for a group; Rawalpindi does not. Different screens.
    expect(larkana).not.toMatch(/HSSC Second Annual Examination/i)
  })

  test('warns before a reader leaves, where the portal needs an extra document', async ({
    page,
  }) => {
    // Sargodha asks for a B-Form. Finding that out on the board's site, without
    // the document to hand, is a wasted trip.
    await page.goto('/results/sargodha-board/12th-class')
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
    expect(body).toMatch(/Also asks for/i)
    expect(body).toMatch(/Have this ready before you open the portal/i)
  })

  test('a gazette-only board still renders no roll-number input', async ({ page }) => {
    // The correctness rule has to survive publishing 21 pages at once.
    for (const slug of ['karachi-board', 'hyderabad-board', 'mirpur-board']) {
      await page.goto(`/results/${slug}/12th-class`)
      await expect(page.locator('main input'), `${slug} rendered an input`).toHaveCount(0)
    }
  })

  test('published board pages are indexable, held ones do not exist', async ({ page }) => {
    const published = await page.goto('/results/quetta-board/12th-class')
    expect(published?.status()).toBe(200)
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).not.toContain('noindex')

    // FBISE is deliberately unpublished — nothing verified enough to say.
    const held = await page.goto('/results/federal-board/12th-class')
    expect(held?.status()).toBe(404)
  })

  test('every published board page names its own board in the H1', async ({ page }) => {
    for (const slug of ['lahore-board', 'quetta-board', 'aku-eb', 'mirpur-board']) {
      await page.goto(`/results/${slug}/12th-class`)
      await expect(page.locator('h1')).toHaveCount(1)
      const h1 = await page.locator('h1').innerText()
      expect(h1.length, `${slug} has an empty h1`).toBeGreaterThan(8)
    }
  })
})

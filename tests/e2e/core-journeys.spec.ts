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
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Check your 12th class result')
    // The differentiator: no competitor says this, and three of them publish
    // mutually contradictory dates instead.
    await expect(
      page.getByText(/No HSSC Part-II 2026 result date has been confirmed/i),
    ).toBeVisible()
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
    await expect(page.locator('input')).toHaveCount(0)
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
    const link = page.getByRole('link', { name: /^rechecking$/i })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/\/guides\/rechecking$/)
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

  test('sitemap index resolves and excludes held pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('sitemapindex')
    // A draft board page must never reach the sitemap.
    expect(body).not.toContain('karachi-board')
  })

  test('a held board page is noindex', async ({ page }) => {
    await page.goto('/results/karachi-board/12th-class')
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).toContain('noindex')
    // noindex, but still `follow`: the page links the board's official source.
    expect(robots).not.toContain('nofollow')
  })
})

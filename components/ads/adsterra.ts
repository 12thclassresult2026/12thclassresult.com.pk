/**
 * Adsterra ad units for 12thclassresult.com.pk (publisher site 6067805).
 *
 * THE FOUR UNIT IDs LIVE HERE AND NOWHERE ELSE. They are not secrets — every
 * visitor's browser downloads them — but they are easy to mistype and
 * impossible to notice when wrong: a bad key renders an empty box, not an
 * error. Keeping them in one file means the validation suite can check the
 * live markup against this list rather than against a copy of a copy.
 *
 * WHY A TEST GUARDS THESE (tests/validation/ad-units.test.ts):
 * The site owner reports ad tags disappearing from the head on some weekends.
 * In this codebase nothing removes them on a timer — the tags are source code,
 * committed and deployed. What CAN remove them is an edit: a redesign that
 * rewrites the layout, or an agent that "cleans up" scripts it does not
 * recognise. The test fails the build if any of the four stops being mounted,
 * so a removal cannot reach production silently.
 *
 * NEVER pass a roll number, candidate name, institution or marks to any of
 * these. They are third-party ad scripts and must stay on pages, never on
 * data: see components/ads/README rules mirrored in the privacy suite.
 */

/** Popunder — site-wide, one per page, no visible element. */
export const POPUNDER_SRC =
  'https://pl31446134.profitableratecpmnetwork.com/c2/11/4f/c2114f49261fceebffaad59b8cea9cc2.js'

/** Social Bar — site-wide, one per page, positions itself. */
export const SOCIAL_BAR_SRC =
  'https://pl31446135.profitableratecpmnetwork.com/fe/e0/e9/fee0e9ef585a7d784eae0a822fcd8126.js'

/**
 * Banner 300x250.
 *
 * Adsterra's banner loader reads a GLOBAL `atOptions` at script-evaluation
 * time. Two banners on one page therefore race over one variable, and the
 * usual result is that the second slot stays blank. Every banner here is
 * rendered inside its own `srcdoc` iframe, which gives each one a private
 * `window` — and, as a side effect, makes it impossible for ad CSS to leak
 * into the page or for page CSS to reflow the creative.
 */
export const BANNER_KEY = '39443b44123048a657629c63f017ef58'
export const BANNER_SRC = `https://www.highrevenueformat.com/${BANNER_KEY}/invoke.js`
export const BANNER_WIDTH = 300
export const BANNER_HEIGHT = 250

/**
 * Native Banner — ONE PER PAGE, because the container id below is fixed by
 * Adsterra. A second copy on the same page would give two elements the same
 * id and the loader would fill only the first.
 */
export const NATIVE_BANNER_ID = '50156e7baa67ad87f69475093bc71a7f'
export const NATIVE_BANNER_SRC = `https://pl31446137.profitableratecpmnetwork.com/${NATIVE_BANNER_ID}/invoke.js`
export const NATIVE_BANNER_CONTAINER = `container-${NATIVE_BANNER_ID}`

/** Every remote origin the four units load from, for the CSP allow-list. */
export const AD_ORIGINS = [
  'https://pl31446134.profitableratecpmnetwork.com',
  'https://pl31446135.profitableratecpmnetwork.com',
  'https://pl31446137.profitableratecpmnetwork.com',
  'https://www.highrevenueformat.com',
] as const

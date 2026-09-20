import Script from 'next/script'

/**
 * Google Analytics 4.
 *
 * WHY THIS IS SAFE ON A SITE HOLDING 138,617 STUDENTS' RESULTS, and what makes
 * it stay safe:
 *
 *  - A roll number is POSTed in a Server Action body and never enters a URL.
 *    GA reads `page_location`, so there is nothing there to read. Verified
 *    live: searching on the homepage leaves the URL as `/`.
 *  - The result card renders without a navigation, so GA never sees a page
 *    view tied to a lookup at all.
 *  - GA is mounted HERE, in the layout, and nowhere near the result path.
 *    `tests/validation/gazette-privacy.test.ts` fails the build if `gtag(` or
 *    `dataLayer.` appears in any file that handles a `GazetteRecord`.
 *
 * What that leaves is ordinary page analytics, which is what was asked for.
 *
 * NEVER pass a roll number, candidate name, institution or marks to `gtag` —
 * not as an event parameter, not as a custom dimension, not hashed. Google's
 * own terms forbid sending personally identifiable information, and this site
 * has a stricter rule of its own: personal result data leaves the database only
 * to be rendered for the person who asked for it.
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  if (!measurementId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  )
}

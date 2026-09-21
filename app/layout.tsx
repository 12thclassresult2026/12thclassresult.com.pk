import type { Metadata, Viewport } from 'next'
import { Caveat, Inter, Noto_Nastaliq_Urdu } from 'next/font/google'

import './globals.css'

import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { FloatingSocialBar } from '@/components/layout/floating-social-bar'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { JsonLdScript } from '@/components/seo/json-ld'
import { LayoutAdBanner } from '@/components/ads/layout-ad-banner'
import { AdsterraSiteScripts } from '@/components/ads/adsterra-site-scripts'
import { organizationSchema, webSiteSchema } from '@/lib/schema/json-ld'
import { rootMetadata } from '@/lib/seo/metadata'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
})

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: '400',
  display: 'swap',
  variable: '--font-nastaliq',
})

export const metadata: Metadata = rootMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
  themeColor: '#00473B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK" className={`${inter.variable} ${nastaliq.variable} ${caveat.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#main"
          className="bg-primary-700 sr-only rounded-[var(--radius-button)] px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        {/*
          One 300x250 on every page, between the content and the footer.
          Declared here so a route added later inherits it. It stands aside on
          the homepage, which places its own under the lookup tool — only one
          banner may run per document, see layout-ad-banner.tsx.
        */}
        <LayoutAdBanner />
        <SiteFooter />
        {/*
          Mounted in the layout and nowhere near the result path. A roll number
          is POSTed in a Server Action body and never reaches a URL, so there is
          no identifier for GA to read; the privacy suite fails the build if
          `gtag(` ever appears in a file that handles a GazetteRecord.
        */}
        <GoogleAnalytics measurementId="G-JQS6JC9MZ1" />
        {/*
          Popunder and Social Bar: site-wide, one each per page, neither
          taking space in the layout. Kept out of every component that can
          hold a student record — the privacy suite enforces that.
        */}
        <AdsterraSiteScripts />
        <FloatingSocialBar />
        <JsonLdScript nodes={[organizationSchema(), webSiteSchema()]} />
      </body>
    </html>
  )
}

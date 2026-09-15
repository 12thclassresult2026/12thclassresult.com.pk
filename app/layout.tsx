import type { Metadata, Viewport } from 'next'
import { Caveat, Inter, Noto_Nastaliq_Urdu } from 'next/font/google'

import './globals.css'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { JsonLdScript } from '@/components/seo/json-ld'
import { organizationSchema, webSiteSchema } from '@/lib/schema/json-ld'
import { rootMetadata } from '@/lib/seo/metadata'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

/*
 * The Urdu tagline only. Inter has no Arabic-script coverage, so without this
 * the line falls back to whatever the device happens to have — on most Windows
 * machines a Naskh face that renders the words correctly but not in the
 * Nastaliq style the writing is read in.
 *
 * Scoped hard to keep the cost honest: one weight, the Arabic subset, and it
 * is applied to four words in the header and four in the footer. `swap` means
 * it never blocks paint.
 */
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
  // Zoom is never disabled: pinch-zoom to 200% is an accessibility requirement
  // (section 35), and result tables are exactly what people zoom into.
  maximumScale: 5,
  colorScheme: 'light',
  // Matches --surface-header, so the browser chrome continues the navy band
  // rather than cutting a white line above it.
  themeColor: '#0b1533',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK" className={`${inter.variable} ${nastaliq.variable} ${caveat.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        {/* First tab stop on every page (section 35). */}
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
        <SiteFooter />
        <JsonLdScript nodes={[organizationSchema(), webSiteSchema()]} />
      </body>
    </html>
  )
}

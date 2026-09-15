import type { Metadata, Viewport } from 'next'
import { Caveat, Inter, Noto_Nastaliq_Urdu } from 'next/font/google'

import './globals.css'

import { FloatingSocialBar } from '@/components/layout/floating-social-bar'
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
        <SiteFooter />
        <FloatingSocialBar />
        <JsonLdScript nodes={[organizationSchema(), webSiteSchema()]} />
      </body>
    </html>
  )
}

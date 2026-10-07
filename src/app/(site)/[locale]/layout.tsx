import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { isLocale, LOCALES } from '@/lib/locales'
import '@/styles/legacy'
import '@/styles/site.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3084'
const GA_ID = process.env.GA_MEASUREMENT_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // SITE_NOINDEX=true (préproduction) : pages exclues des moteurs de recherche.
  robots:
    process.env.SITE_NOINDEX === 'true' ? { index: false, follow: false } : { 'max-image-preview': 'large' },
  icons: {
    icon: [
      { url: '/wp-content/uploads/2025/02/cropped-logo-capitello-black-big-32x32.png', sizes: '32x32' },
      { url: '/wp-content/uploads/2025/02/cropped-logo-capitello-black-big-192x192.png', sizes: '192x192' },
    ],
    apple: '/wp-content/uploads/2025/02/cropped-logo-capitello-black-big-180x180.png',
  },
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale === 'fr' ? 'fr-FR' : locale} translate={locale === 'fr' ? undefined : 'no'}>
      {/* Classes du thème d'origine : `elementor-kit-6` porte les variables globales d'Elementor. */}
      <body className="wp-embed-responsive elementor-default elementor-template-full-width elementor-kit-6 elementor-page">
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { isLocale, localizePath, LOCALES } from '@/lib/locales'
import { COOKIE_TEXTS } from '@/i18n/ui'
import { COOKIES } from '@/content/legal'
import { CookieBanner } from '@/components/CookieBanner'
import { AnalyticsScripts } from '@/components/AnalyticsScripts'
import '@/styles/legacy'
import '@/styles/site.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3084'
const GA_ID = process.env.GA_MEASUREMENT_ID
const COOKIES_PATH = COOKIES.path

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: { 'max-image-preview': 'large' },
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
        {/* Sans identifiant GA : ni bandeau, ni Google Analytics — aucun cookie facultatif. Avec lui,
            GA ne se charge qu'après « Accepter » (src/components/CookieBanner.tsx, AnalyticsScripts.tsx). */}
        {GA_ID && (
          <>
            <CookieBanner t={COOKIE_TEXTS[locale]} policyHref={localizePath(locale, COOKIES_PATH)} />
            <AnalyticsScripts gaId={GA_ID} />
          </>
        )}
      </body>
    </html>
  )
}

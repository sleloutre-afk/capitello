import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import { UI } from '@/i18n/ui'
import { localizePath, type Locale } from '@/lib/locales'
import { pageMetadata } from '@/lib/seo'
import { PageShell } from '@/components/PageShell'
import { HomeContent } from '@/components/sections/HomeContent'

// Régénérée au plus toutes les 60 s (le pied de page affiche les dernières publications du BO).
export const revalidate = 60

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale
  return pageMetadata(locale, '/', UI[locale].siteName)
}

export default async function Page({ params }: Props) {
  const locale = (await params).locale as Locale
  const dict = getDictionary(locale)
  const l = (path: string) => localizePath(locale, path)

  return (
    <PageShell locale={locale} path="/" header="home">
      <HomeContent t={dict.home} l={l} />
    </PageShell>
  )
}

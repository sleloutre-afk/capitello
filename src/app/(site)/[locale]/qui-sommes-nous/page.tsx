import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import { UI } from '@/i18n/ui'
import { localizePath, requireLocale } from '@/lib/locales'
import { pageMetadata } from '@/lib/seo'
import { PageShell } from '@/components/PageShell'
import { AboutContent } from '@/components/sections/AboutContent'

// Régénérée au plus toutes les 60 s (le pied de page affiche les dernières publications du BO).
export const revalidate = 60

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale)
  return pageMetadata(locale, '/qui-sommes-nous', UI[locale].titles.about)
}

export default async function Page({ params }: Props) {
  const locale = requireLocale((await params).locale)
  const dict = getDictionary(locale)
  const l = (path: string) => localizePath(locale, path)

  return (
    <PageShell locale={locale} path="/qui-sommes-nous" header="inner">
      <AboutContent t={dict.about} l={l} />
    </PageShell>
  )
}

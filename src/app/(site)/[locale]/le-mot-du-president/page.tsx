import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import { UI } from '@/i18n/ui'
import { localizePath, requireLocale } from '@/lib/locales'
import { pageMetadata } from '@/lib/seo'
import { PageShell } from '@/components/PageShell'
import { PresidentContent } from '@/components/sections/PresidentContent'

// Régénérée au plus toutes les 60 s (le pied de page affiche les dernières publications du BO).
export const revalidate = 60

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale)
  return pageMetadata(locale, '/le-mot-du-president', UI[locale].titles.president)
}

export default async function Page({ params }: Props) {
  const locale = requireLocale((await params).locale)
  const dict = getDictionary(locale)
  const l = (path: string) => localizePath(locale, path)

  return (
    <PageShell locale={locale} path="/le-mot-du-president" header="inner">
      <PresidentContent t={dict.president} l={l} />
    </PageShell>
  )
}

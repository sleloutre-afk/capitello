import type { Metadata } from 'next'
import { MENTIONS_LEGALES } from '@/content/legal'
import { localizePath, requireLocale } from '@/lib/locales'
import { legalMetadata } from '@/lib/seo'
import { PageShell } from '@/components/PageShell'
import { LegalPage } from '@/components/LegalPage'

// Régénérée au plus toutes les 60 s (le pied de page affiche les dernières publications du BO).
export const revalidate = 60

type Props = { params: Promise<{ locale: string }> }

export function generateMetadata(): Metadata {
  return legalMetadata(MENTIONS_LEGALES)
}

export default async function Page({ params }: Props) {
  const locale = requireLocale((await params).locale)

  return (
    <PageShell locale={locale} path={MENTIONS_LEGALES.path} header="inner">
      <LegalPage document={MENTIONS_LEGALES} l={(path) => localizePath(locale, path)} />
    </PageShell>
  )
}

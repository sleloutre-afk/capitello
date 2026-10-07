import type { Metadata } from 'next'
import { DONNEES_PERSONNELLES } from '@/content/legal'
import { localizePath, type Locale } from '@/lib/locales'
import { legalMetadata } from '@/lib/seo'
import { PageShell } from '@/components/PageShell'
import { LegalPage } from '@/components/LegalPage'

// Régénérée au plus toutes les 60 s (le pied de page affiche les dernières publications du BO).
export const revalidate = 60

type Props = { params: Promise<{ locale: string }> }

export function generateMetadata(): Metadata {
  return legalMetadata(DONNEES_PERSONNELLES)
}

export default async function Page({ params }: Props) {
  const locale = (await params).locale as Locale

  return (
    <PageShell locale={locale} path={DONNEES_PERSONNELLES.path} header="inner">
      <LegalPage document={DONNEES_PERSONNELLES} l={(path) => localizePath(locale, path)} />
    </PageShell>
  )
}

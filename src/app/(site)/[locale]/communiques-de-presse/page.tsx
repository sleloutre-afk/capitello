import type { Metadata } from 'next'
import { UI } from '@/i18n/ui'
import { requireLocale } from '@/lib/locales'
import { pageMetadata } from '@/lib/seo'
import { PageShell } from '@/components/PageShell'
import { PublicationList } from '@/components/PublicationList'
import { CommuniquesContent } from '@/components/sections/CommuniquesContent'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ search?: string; communique_year?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale)
  return pageMetadata(locale, '/communiques-de-presse', UI[locale].titles.communiques)
}

export default async function Page({ params, searchParams }: Props) {
  const locale = requireLocale((await params).locale)
  const query = await searchParams

  return (
    <PageShell locale={locale} path="/communiques-de-presse" header="inner">
      <CommuniquesContent title={UI[locale].headings.communiques}>
        <PublicationList type="communique" locale={locale} search={query.search || ''} year={query.communique_year || ''} />
      </CommuniquesContent>
    </PageShell>
  )
}

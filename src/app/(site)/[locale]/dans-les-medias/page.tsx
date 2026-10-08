import type { Metadata } from 'next'
import { UI } from '@/i18n/ui'
import { requireLocale } from '@/lib/locales'
import { pageMetadata } from '@/lib/seo'
import { PageShell } from '@/components/PageShell'
import { PublicationList } from '@/components/PublicationList'
import { MediasContent } from '@/components/sections/MediasContent'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ search?: string; medias_year?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale)
  return pageMetadata(locale, '/dans-les-medias', UI[locale].titles.medias)
}

export default async function Page({ params, searchParams }: Props) {
  const locale = requireLocale((await params).locale)
  const query = await searchParams

  return (
    <PageShell locale={locale} path="/dans-les-medias" header="inner">
      <MediasContent title={UI[locale].headings.medias}>
        <PublicationList type="media" locale={locale} search={query.search || ''} year={query.medias_year || ''} />
      </MediasContent>
    </PageShell>
  )
}

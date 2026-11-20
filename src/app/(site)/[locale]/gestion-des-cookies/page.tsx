import type { Metadata } from 'next'
import { COOKIES } from '@/content/legal'
import { localizePath, requireLocale } from '@/lib/locales'
import { legalMetadata } from '@/lib/seo'
import { PageShell } from '@/components/PageShell'
import { LegalPage } from '@/components/LegalPage'
import { CookieSettingsButton } from '@/components/CookieBanner'
import { COOKIE_TEXTS } from '@/i18n/ui'

// Régénérée au plus toutes les 60 s (le pied de page affiche les dernières publications du BO).
export const revalidate = 60

type Props = { params: Promise<{ locale: string }> }

export function generateMetadata(): Metadata {
  return legalMetadata(COOKIES)
}

export default async function Page({ params }: Props) {
  const locale = requireLocale((await params).locale)

  return (
    <PageShell locale={locale} path={COOKIES.path} header="inner">
      <LegalPage
        document={COOKIES}
        l={(path) => localizePath(locale, path)}
        // Rouvre le bandeau pour modifier ou retirer son choix (seulement si GA est configuré).
        intro={
          process.env.GA_MEASUREMENT_ID ? (
            <div className="legal-page__cookie-settings" lang={locale}>
              <CookieSettingsButton label={COOKIE_TEXTS[locale].settings} />
            </div>
          ) : undefined
        }
      />
    </PageShell>
  )
}

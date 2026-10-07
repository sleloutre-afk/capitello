import type { ReactNode } from 'react'
import { getDictionary } from '@/i18n'
import { localizePath, type Locale } from '@/lib/locales'
import { getFooterPublications } from '@/lib/publications'
import { HeaderHome } from './sections/HeaderHome'
import { HeaderInner } from './sections/HeaderInner'
import { Footer } from './sections/Footer'
import { LanguageSwitcher } from './LanguageSwitcher'
import { SiteBehaviors } from './SiteBehaviors'

/** Habillage commun : en-tête (variante accueil ou pages intérieures), pied de page, sélecteur de langue. */
export async function PageShell({
  locale,
  path,
  header,
  children,
}: {
  locale: Locale
  /** Chemin de la page sans préfixe de langue (ex. « /qui-sommes-nous »). */
  path: string
  header: 'home' | 'inner'
  children: ReactNode
}) {
  const dict = getDictionary(locale)
  const l = (target: string) => localizePath(locale, target)
  const latest = await getFooterPublications(locale)

  return (
    <>
      {header === 'home' ? <HeaderHome t={dict.headerHome} l={l} /> : <HeaderInner t={dict.headerInner} l={l} />}
      {children}
      <Footer t={dict.footer} l={l} latest={latest} />
      <LanguageSwitcher locale={locale} path={path} />
      <SiteBehaviors header={header} />
    </>
  )
}

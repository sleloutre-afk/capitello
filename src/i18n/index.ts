import type { Locale } from '@/lib/locales'
import fr from './dictionaries/fr.json'
import en from './dictionaries/en.json'
import es from './dictionaries/es.json'
import zh from './dictionaries/zh.json'

/**
 * Textes des pages, par langue. Les clés reprennent l'identifiant du bloc
 * Elementor d'origine (classe `elementor-element-<id>` dans le composant) ;
 * certaines valeurs contiennent du HTML en ligne (<br>, <strong>, liens).
 */
export type Dictionary = typeof fr
const dictionaries: Record<Locale, Dictionary> = { fr, en, es, zh }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export type SectionProps = {
  /** Textes de la section dans la langue courante. */
  t: Record<string, string>
  /** Préfixe un lien interne avec la langue courante. */
  l: (path: string) => string
}

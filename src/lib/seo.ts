import type { Metadata } from 'next'
import { LOCALES, localizePath, type Locale } from './locales'

/** Balises canonical + hreflang d'une page, comme sur le site d'origine. */
export function pageMetadata(locale: Locale, path: string, title: string): Metadata {
  return {
    title,
    alternates: {
      canonical: localizePath(locale, path),
      languages: Object.fromEntries(LOCALES.map((l) => [l, localizePath(l, path)])),
    },
  }
}

/**
 * Pages légales : le texte est en français dans toutes les langues du site,
 * l'adresse française est donc la seule référence pour les moteurs de recherche.
 */
export function legalMetadata(document: { path: string; title: string }): Metadata {
  return { title: `${document.title} – Capitello`, alternates: { canonical: document.path } }
}

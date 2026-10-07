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

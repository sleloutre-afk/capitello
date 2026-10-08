import { notFound } from 'next/navigation'

export const LOCALES = ['fr', 'en', 'es', 'zh'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'fr'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** Préfixe une URL interne avec la langue courante (le français n'a pas de préfixe). */
export function localizePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/**
 * Langue de la page à partir du segment d'URL. Toute autre valeur — une
 * adresse inconnue arrivée jusqu'ici, comme /favicon.ico ou /wp-login.php
 * (non réécrites par le middleware) — donne une page 404.
 */
export function requireLocale(value: string): Locale {
  if (!isLocale(value)) notFound()
  return value
}

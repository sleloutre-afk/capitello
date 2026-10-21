import type { Locale } from './locales'

const INTL_LOCALE: Record<Locale, string> = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', zh: 'zh-CN' }

/**
 * Les dates de publication sont des instants UTC (date et heure saisies
 * dans le BO) ; le jour affiché sur le site est celui de Paris.
 */
const TIME_ZONE = 'Europe/Paris'

/** « 10 juin 2026 », « June 10, 2026 », « 10 de junio de 2026 », « 2026年6月10日 ». */
export function formatLongDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).format(new Date(iso))
}

/** Jour, mois et année à Paris. */
function parisParts(iso: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).formatToParts(new Date(iso))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return { day: get('day'), month: get('month'), year: get('year') }
}

/** « 10.06.26 » (pied de page). */
export function formatShortDate(iso: string): string {
  const { day, month, year } = parisParts(iso)
  return `${day}.${month}.${year.slice(-2)}`
}

/** Année de publication à Paris (filtre par année). */
export function publicationYear(iso: string): string {
  return parisParts(iso).year
}

/**
 * « 2025-12-08T23:49:00 » (heure de Paris, sans fuseau, comme dans l'export
 * WordPress) → instant UTC ISO.
 */
export function parisWallClockToUtc(local: string): string {
  const asUtc = new Date(`${local}Z`)
  const shown = new Date(asUtc.toLocaleString('en-US', { timeZone: TIME_ZONE }))
  const utcShown = new Date(asUtc.toLocaleString('en-US', { timeZone: 'UTC' }))
  return new Date(asUtc.getTime() - (shown.getTime() - utcShown.getTime())).toISOString()
}

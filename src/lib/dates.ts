import type { Locale } from './locales'

const INTL_LOCALE: Record<Locale, string> = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', zh: 'zh-CN' }

/** « 10 juin 2026 », « June 10, 2026 », « 10 de junio de 2026 », « 2026年6月10日 ». */
export function formatLongDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/** « 10.06.26 » (pied de page). */
export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${String(d.getUTCFullYear()).slice(-2)}`
}

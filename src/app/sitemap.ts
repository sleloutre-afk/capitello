import type { MetadataRoute } from 'next'
import { LEGAL_DOCUMENTS } from '@/content/legal'
import { LOCALES, localizePath } from '@/lib/locales'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3084'
const PATHS = ['/', '/le-mot-du-president', '/qui-sommes-nous', '/communiques-de-presse', '/dans-les-medias']

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages légales : en français uniquement.
  const legal = LEGAL_DOCUMENTS.map((document) => ({ url: SITE_URL + document.path }))
  const pages = PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: SITE_URL + localizePath(locale, path).replace(/\/$/, ''),
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, SITE_URL + localizePath(l, path).replace(/\/$/, '')])),
      },
    })),
  )
  return [...pages, ...legal]
}

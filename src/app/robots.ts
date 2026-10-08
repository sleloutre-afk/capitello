import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3084'

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Sous une autre adresse que l'adresse officielle (l'adresse technique
  // *.cleverapps.io de Clever Cloud, par exemple), rien ne doit être indexé.
  const host = (await headers()).get('host')
  if (host !== new URL(SITE_URL).host) return { rules: [{ userAgent: '*', disallow: '/' }] }

  return {
    rules: [{ userAgent: '*', disallow: ['/BO', '/api'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

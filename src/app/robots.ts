import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3084'

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Sous une autre adresse que l'adresse officielle (l'adresse technique
  // *.cleverapps.io de Clever Cloud, par exemple), rien ne doit être indexé.
  const host = (await headers()).get('host')
  if (host !== new URL(SITE_URL).host) return { rules: [{ userAgent: '*', disallow: '/' }] }

  return {
    // Les fichiers envoyés depuis le BO (PDF des communiqués, visuels, logos des médias) sont servis
    // sous /api/media/file/ : ils doivent rester indexables, comme les anciens /wp-content/uploads.
    // Le reste de /api et le BO restent interdits ; Google applique la règle la plus précise.
    rules: [{ userAgent: '*', allow: '/api/media/file/', disallow: ['/BO', '/api'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

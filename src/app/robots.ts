import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3084'

export default function robots(): MetadataRoute.Robots {
  // Préproduction : rien ne doit être indexé tant que le site n'est pas sur son domaine définitif.
  if (process.env.SITE_NOINDEX === 'true') return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [{ userAgent: '*', disallow: ['/BO', '/api'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

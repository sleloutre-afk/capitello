import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import { LEGACY_POST_REDIRECTS } from './src/lib/legacyRedirects'

const nextConfig: NextConfig = {
  // Les anciennes URL WordPress se terminaient par « / » : Next redirige
  // /qui-sommes-nous/ vers /qui-sommes-nous (308), les liens existants
  // restent donc valides.
  async redirects() {
    return LEGACY_POST_REDIRECTS
  },
  async headers() {
    return [
      {
        source: '/wp-content/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Fichiers de la bibliothèque du BO (visuels, PDF, vidéos), servis par
        // l'application depuis le stockage S3 : mis en cache par le navigateur.
        source: '/api/media/file/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' }],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default withPayload(nextConfig)

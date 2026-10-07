import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Anciennes adresses WordPress des fichiers de publications
 * (/wp-content/uploads/2026/06/CP-10-juin-26.pdf…) : ces fichiers vivent
 * désormais dans la bibliothèque du BO, on y redirige pour que les liens
 * existants (moteurs de recherche, sites tiers, e-mails) restent valides.
 * Les fichiers encore présents dans public/wp-content sont servis
 * directement par Next, sans passer ici.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const legacyPath = `/wp-content/uploads/${path.map(decodeURIComponent).join('/')}`
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'media',
    // Certains noms de fichiers d'origine contiennent des accents décomposés.
    where: { legacyPath: { in: [...new Set([legacyPath, legacyPath.normalize('NFC'), legacyPath.normalize('NFD')])] } },
    limit: 1,
    depth: 0,
  })
  const url = docs[0]?.url
  if (!url) return new NextResponse('Not found', { status: 404 })
  return NextResponse.redirect(new URL(url, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3084'), 308)
}

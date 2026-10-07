import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from './locales'

export type PublicationType = 'communique' | 'media'

/** Collection du BO correspondant à chaque rubrique. */
const COLLECTION = { communique: 'communiques', media: 'news' } as const

/** Une publication telle qu'affichée sur le site, dans la langue demandée. */
export type PublicationView = {
  id: string | number
  type: PublicationType
  /** Date ISO (jour de publication). */
  date: string
  /** Libellé de date repris tel quel du site d'origine, s'il diffère du format standard. */
  dateLabel: string | null
  title: string
  summary: string | null
  tags: string[]
  isVideo: boolean
  thumbnail: { src: string; width?: number | null; height?: number | null } | null
  /** Fichier ou lien ouvert par le bouton. */
  href: string | null
  /** Adresse prise en compte par la recherche : celle d'origine pour les publications importées. */
  searchLink: string | null
}

type UploadDoc = { url?: string | null; width?: number | null; height?: number | null }
const asUpload = (value: unknown): UploadDoc | null =>
  value && typeof value === 'object' ? (value as UploadDoc) : null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toView(doc: any, type: PublicationType, locale: Locale): PublicationView {
  const thumbnail = asUpload(doc.thumbnail)
  const file = asUpload(doc.file)
  return {
    id: doc.id,
    type,
    date: doc.date,
    dateLabel: locale === 'zh' && doc.legacyZhDateLabel && doc.legacyDate === doc.date ? doc.legacyZhDateLabel : null,
    title: doc.title,
    summary: doc.summary || null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: (doc.tags || []).map((tag: any) => (typeof tag === 'object' ? tag.name : null)).filter(Boolean),
    isVideo: Boolean(doc.isVideo),
    thumbnail: thumbnail?.url
      ? { src: thumbnail.url, width: thumbnail.width, height: thumbnail.height }
      : doc.legacyThumbnail
        ? { src: doc.legacyThumbnail, width: doc.legacyThumbnailWidth, height: doc.legacyThumbnailHeight }
        : null,
    href: file?.url || doc.externalUrl || doc.legacyFile || null,
    searchLink: doc.legacyFile || file?.url || doc.externalUrl || null,
  }
}

/** Toutes les publications publiées d'une rubrique, de la plus récente à la plus ancienne. */
export async function getPublications(type: PublicationType, locale: Locale): Promise<PublicationView[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: COLLECTION[type],
    where: { _status: { equals: 'published' } },
    sort: ['-date', '-createdAt'],
    locale,
    fallbackLocale: 'fr',
    depth: 1,
    pagination: false,
  })
  return docs.map((doc) => toView(doc, type, locale))
}

/** Les deux communiqués mis en avant dans le pied de page (« Dernières publications »). */
export async function getFooterPublications(locale: Locale): Promise<PublicationView[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'communiques',
    where: { and: [{ showInFooter: { equals: true } }, { _status: { equals: 'published' } }] },
    sort: ['-date', '-createdAt'],
    locale,
    fallbackLocale: 'fr',
    depth: 1,
    limit: 2,
  })
  return docs.map((doc) => toView(doc, 'communique', locale))
}

/**
 * Charge dans le BO les publications reprises du site WordPress
 * (scripts/seed-data/publications.json : 36 communiqués + 90 retombées
 * médias, titres dans les 4 langues).
 *
 * Idempotent : une publication déjà importée (même identifiant WordPress)
 * est laissée telle quelle, on peut donc relancer sans risque d'écraser
 * des modifications faites depuis le BO.
 *
 *   npm run seed
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const LOCALES = ['en', 'es', 'zh'] as const
// Les traductions existantes sont reprises telles quelles : aucune traduction
// automatique pendant l'import (voir autoTranslate dans publicationFields.ts).
const NO_TRANSLATION = { skipAutoTranslate: true }
type Localized = { fr: string; en?: string; es?: string; zh?: string }
type SeedPublication = {
  wpId: number
  type: 'communique' | 'media'
  date: string
  title: Localized
  summary: Partial<Localized>
  tags: string[]
  isVideo: boolean
  thumbnail: string
  thumbnailWidth: number | null
  thumbnailHeight: number | null
  href: string
  showInFooter: boolean
  zhDateLabel?: string
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(readFileSync(path.join(dirname, 'seed-data/publications.json'), 'utf8')) as {
  tags: Record<string, Localized>
  publications: SeedPublication[]
}

async function main() {
  const payload = await getPayload({ config })

  const tagIds: Record<string, string | number> = {}
  for (const [key, names] of Object.entries(data.tags)) {
    const existing = await payload.find({
      collection: 'tags',
      locale: 'fr',
      where: { name: { equals: names.fr } },
      limit: 1,
    })
    let tag = existing.docs[0]
    if (!tag) {
      tag = await payload.create({ collection: 'tags', locale: 'fr', data: { name: names.fr } })
      for (const locale of LOCALES) {
        const name = names[locale]
        if (name) await payload.update({ collection: 'tags', id: tag.id, locale, data: { name } })
      }
    }
    tagIds[key] = tag.id
  }

  let created = 0
  for (const item of data.publications) {
    const collection = item.type === 'communique' ? 'communiques' : 'news'
    const existing = await payload.find({ collection, where: { wpId: { equals: item.wpId } }, limit: 1, depth: 0 })
    if (existing.docs[0]) continue

    const isExternal = /^https?:\/\//.test(item.href)
    const common = {
      // Heure locale WordPress enregistrée telle quelle en UTC : le jour affiché
      // ne dépend pas du fuseau du serveur, et l'heure conserve l'ordre d'origine.
      date: `${item.date}.000Z`,
      title: item.title.fr,
      legacyFile: isExternal ? undefined : item.href,
      legacyThumbnail: item.thumbnail,
      legacyThumbnailWidth: item.thumbnailWidth,
      legacyThumbnailHeight: item.thumbnailHeight,
      wpId: item.wpId,
      legacyDate: `${item.date}.000Z`,
      legacyZhDateLabel: item.zhDateLabel,
      _status: 'published' as const,
    }
    const doc =
      item.type === 'communique'
        ? await payload.create({
            collection: 'communiques',
            locale: 'fr',
            context: NO_TRANSLATION,
            data: {
              ...common,
              summary: item.summary.fr,
              tags: item.tags.map((key) => tagIds[key] as number),
              showInFooter: item.showInFooter,
            },
          })
        : await payload.create({
            collection: 'news',
            locale: 'fr',
            context: NO_TRANSLATION,
            data: { ...common, isVideo: item.isVideo, externalUrl: isExternal ? item.href : undefined },
          })
    for (const locale of LOCALES) {
      const title = item.title[locale]
      if (!title) continue
      if (item.type === 'communique') {
        await payload.update({
          collection: 'communiques',
          id: doc.id,
          locale,
          data: { title, summary: item.summary[locale], _status: 'published' },
          context: NO_TRANSLATION,
        })
      } else {
        await payload.update({
          collection: 'news',
          id: doc.id,
          locale,
          data: { title, _status: 'published' },
          context: NO_TRANSLATION,
        })
      }
    }
    created += 1
  }

  payload.logger.info(`Import terminé : ${created} publications créées, ${data.publications.length - created} déjà présentes.`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

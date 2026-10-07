/**
 * Importe dans la bibliothèque du BO les fichiers des publications reprises
 * de WordPress (visuels, PDF, vidéos, sons) et y rattache chaque
 * publication : champs « Visuel » et « Fichier » au lieu des adresses
 * d'origine.
 *
 * À lancer après `npm run seed`. Les fichiers sont lus dans
 * ./import-files/wp-content/uploads ; au premier passage ils y sont
 * déplacés depuis ./public (ils n'ont plus à être servis en statique : les
 * anciennes adresses sont redirigées vers la bibliothèque).
 *
 * Les PDF, vidéos et sons de l'ancienne médiathèque qu'aucune publication
 * n'utilise sont importés eux aussi (sans rattachement).
 *
 * Idempotent : un fichier déjà importé (même adresse d'origine) est
 * réutilisé, une publication déjà rattachée est laissée telle quelle.
 *
 *   npm run import-library
 */
import { existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const STORE = path.join(ROOT, 'import-files')
const PUBLIC = path.join(ROOT, 'public')
const NO_TRANSLATION = { skipAutoTranslate: true }

// PDF légaux liés depuis le pied de page : ils restent servis en statique.
const KEEP_STATIC = new Set([
  '/wp-content/uploads/2025/03/V2-Mentions-legales-Capitello.pdf',
  '/wp-content/uploads/2025/02/Politique-RGPD-Capitello-Group.pdf',
  '/wp-content/uploads/2025/02/Politique-en-matieEre-de-cookies-Capitello-Group.pdf',
])

/** Documents (PDF, vidéos, sons) présents sous <base>/wp-content/uploads, en chemins « /wp-content/… ». */
function documentsIn(base: string): string[] {
  const found: string[] = []
  const walk = (dir: string) => {
    if (!existsSync(dir)) return
    for (const name of readdirSync(dir)) {
      if (name.startsWith('._')) continue
      const full = path.join(dir, name)
      if (statSync(full).isDirectory()) walk(full)
      else if (/\.(pdf|mp4|mp3)$/i.test(name)) found.push('/' + path.relative(base, full).split(path.sep).join('/'))
    }
  }
  walk(path.join(base, 'wp-content/uploads'))
  return found
}

/** Chemin local du fichier d'origine (déplacé hors de ./public au passage). */
function sourceFile(legacyPath: string): string | null {
  const stored = path.join(STORE, legacyPath)
  if (existsSync(stored)) return stored
  const served = path.join(PUBLIC, legacyPath)
  if (!existsSync(served)) return null
  mkdirSync(path.dirname(stored), { recursive: true })
  renameSync(served, stored)
  return stored
}

async function main() {
  const payload = await getPayload({ config })
  const cache = new Map<string, number | null>()
  let files = 0
  let linked = 0
  const missing: string[] = []

  async function mediaFor(legacyPath: unknown, alt: string): Promise<number | null> {
    if (typeof legacyPath !== 'string' || !legacyPath.startsWith('/wp-content/')) return null
    if (cache.has(legacyPath)) return cache.get(legacyPath)!
    const existing = await payload.find({
      collection: 'media',
      where: { legacyPath: { equals: legacyPath } },
      limit: 1,
      depth: 0,
    })
    let id = (existing.docs[0]?.id as number | undefined) ?? null
    if (id === null) {
      const filePath = sourceFile(legacyPath)
      if (!filePath) {
        missing.push(legacyPath)
      } else {
        const created = await payload.create({ collection: 'media', data: { alt, legacyPath }, filePath })
        id = created.id as number
        files += 1
      }
    }
    cache.set(legacyPath, id)
    return id
  }

  for (const collection of ['communiques', 'news'] as const) {
    const { docs } = await payload.find({ collection, locale: 'fr', depth: 0, pagination: false, sort: '-date' })
    for (const doc of docs) {
      const data: { thumbnail?: number; file?: number } = {}
      if (!doc.thumbnail) {
        const id = await mediaFor(doc.legacyThumbnail, doc.title)
        if (id) data.thumbnail = id
      }
      if (!doc.file) {
        const id = await mediaFor(doc.legacyFile, doc.title)
        if (id) data.file = id
      }
      if (Object.keys(data).length === 0) continue
      await payload.update({ collection, id: doc.id, locale: 'fr', data, context: NO_TRANSLATION })
      linked += 1
    }
  }

  // Documents de l'ancienne médiathèque WordPress qu'aucune publication
  // n'utilise : importés aussi, pour pouvoir les réutiliser depuis le BO et
  // garder leurs anciennes adresses valides.
  const attached = files
  for (const legacyPath of new Set([...documentsIn(STORE), ...documentsIn(PUBLIC)])) {
    if (KEEP_STATIC.has(legacyPath)) continue
    await mediaFor(legacyPath, path.basename(legacyPath))
  }

  payload.logger.info(
    `Bibliothèque : ${files} fichiers importés (dont ${files - attached} sans publication), ${linked} publications rattachées.`,
  )
  if (missing.length) payload.logger.warn(`Fichiers introuvables :\n  ${missing.join('\n  ')}`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

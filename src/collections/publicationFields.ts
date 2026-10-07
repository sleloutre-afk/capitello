import type { CollectionAfterChangeHook, CollectionConfig, Field } from 'payload'
import { revalidateSite } from '../lib/revalidate'
import { translatePublication, type TargetLocale } from '../lib/translate'

/**
 * Éléments communs aux deux rubriques du BO — « Communiqués de presse »
 * (Communiques.ts) et « Dans les médias » (News.ts) : champs partagés,
 * droits d'accès et traduction automatique.
 *
 * Les publications reprises du site WordPress pointent vers leurs fichiers
 * d'origine (champs « legacy », servis depuis /public/wp-content pour que
 * les anciennes URL restent valides) ; les nouvelles utilisent les champs
 * d'upload.
 */
export type PublicationSlug = 'communiques' | 'news'

type Localized = Partial<Record<'fr' | TargetLocale, string | null>>

export const isURL = (value?: string | null) => {
  if (!value) return true
  try {
    new URL(value)
    return true
  } catch {
    return 'Merci de saisir une URL valide (ex. https://exemple.com/...)'
  }
}

/** Visible de tous une fois publié ; brouillons réservés aux comptes du BO. */
export const publicationAccess: CollectionConfig['access'] = {
  read: ({ req }) => {
    if (req.user) return true
    return { _status: { equals: 'published' } }
  },
  create: ({ req }) => Boolean(req.user),
  update: ({ req }) => Boolean(req.user),
  delete: ({ req }) => Boolean(req.user),
}

export const dateField: Field = {
  name: 'date',
  type: 'date',
  label: 'Date',
  required: true,
  defaultValue: () => new Date().toISOString(),
  admin: {
    position: 'sidebar',
    date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
    description: 'Date affichée sur le site ; sert aussi au tri et au filtre par année.',
  },
}

export const titleField: Field = {
  name: 'title',
  type: 'text',
  label: 'Titre',
  required: true,
  localized: true,
  admin: {
    description:
      'Saisir le titre en français. Les versions anglaise, espagnole et chinoise sont traduites automatiquement à l’enregistrement si elles sont vides ; elles se relisent et se corrigent via le sélecteur de langue en haut de page.',
  },
}

export const thumbnailField = (description: string): Field => ({
  name: 'thumbnail',
  type: 'upload',
  relationTo: 'media',
  label: 'Visuel',
  filterOptions: { mimeType: { contains: 'image' } },
  admin: { description },
})

export const fileField = (label: string, description: string): Field => ({
  name: 'file',
  type: 'upload',
  relationTo: 'media',
  label,
  admin: { description },
})

/** Fichiers d'origine des publications importées de WordPress (lecture seule). */
export const legacyFields: Field = {
  type: 'collapsible',
  label: 'Fichiers d’origine (import WordPress)',
  admin: {
    initCollapsed: true,
    condition: (data) => Boolean(data?.legacyThumbnail || data?.legacyFile),
  },
  fields: [
    { name: 'legacyThumbnail', type: 'text', label: 'Visuel d’origine', admin: { readOnly: true } },
    { name: 'legacyThumbnailWidth', type: 'number', admin: { hidden: true } },
    { name: 'legacyThumbnailHeight', type: 'number', admin: { hidden: true } },
    { name: 'legacyFile', type: 'text', label: 'Fichier ou lien d’origine', admin: { readOnly: true } },
    { name: 'wpId', type: 'number', admin: { hidden: true }, index: true },
    // Libellé de date chinois tel qu'affiché par le site d'origine (avec
    // espaces) ; utilisé tant que la date n'a pas été modifiée dans le BO.
    { name: 'legacyDate', type: 'date', admin: { hidden: true } },
    { name: 'legacyZhDateLabel', type: 'text', admin: { hidden: true } },
  ],
}

/**
 * À l'enregistrement, complète les titres (et chapôs) anglais, espagnol et
 * chinois encore vides par une traduction automatique du français — comme
 * le faisait Weglot sur le site WordPress. Une traduction saisie ou
 * corrigée à la main dans le BO n'est jamais écrasée. Sans clé
 * ANTHROPIC_API_KEY, rien n'est traduit : le site affiche le français.
 */
const autoTranslate: CollectionAfterChangeHook = async ({ collection, doc, req, context }) => {
  if (context.skipAutoTranslate || !process.env.ANTHROPIC_API_KEY) return doc
  const slug = collection.slug as PublicationSlug

  const full = (await req.payload.findByID({
    collection: slug,
    id: doc.id,
    locale: 'all',
    depth: 0,
    draft: true,
    req,
  })) as unknown as { title?: Localized; summary?: Localized; _status?: string }
  const title = full.title || {}
  const summary = full.summary || {}
  if (!title.fr) return doc

  const targets: TargetLocale[] = ['en', 'es', 'zh']
  const missing = targets.filter((locale) => !title[locale] || (summary.fr && !summary[locale]))
  if (missing.length === 0) return doc

  const translations = await translatePublication({ title: title.fr, summary: summary.fr })
  if (!translations) return doc

  for (const locale of missing) {
    await req.payload.update({
      collection: slug,
      id: doc.id,
      locale,
      draft: full._status === 'draft',
      data: {
        title: title[locale] || translations[locale].title,
        ...(slug === 'communiques' ? { summary: summary[locale] || translations[locale].summary || undefined } : {}),
      },
      context: { skipAutoTranslate: true },
      req,
    })
  }
  return doc
}

export const publicationHooks: CollectionConfig['hooks'] = {
  afterChange: [autoTranslate, () => revalidateSite()],
  afterDelete: [() => revalidateSite()],
}

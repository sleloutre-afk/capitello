import type { CollectionConfig } from 'payload'
import {
  dateField,
  isURL,
  legacyFields,
  publicationAccess,
  publicationHooks,
  thumbnailField,
  titleField,
} from './publicationFields'

/** Rubrique « Dans les médias » du site : articles, passages radio et télé. */
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News', plural: 'Dans les médias' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', '_status'],
    group: 'Publications',
    listSearchableFields: ['title'],
    description: 'Retombées médias affichées sur le site, de la plus récente à la plus ancienne (champ « Date »).',
  },
  defaultSort: '-date',
  versions: { drafts: true },
  access: publicationAccess,
  fields: [
    dateField,
    titleField,
    thumbnailField('Logo du média. Remplace le visuel d’origine s’il y en a un.'),
    {
      name: 'isVideo',
      type: 'checkbox',
      label: 'Vidéo',
      defaultValue: false,
      admin: {
        description: 'Affiche l’étiquette « Vidéo » et le bouton « Voir la vidéo » au lieu de « En savoir plus ».',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'Fichier à ouvrir (PDF, vidéo, image…)',
      // Description avec lien vers le mode d'emploi de compression des vidéos.
      admin: { components: { Description: '/src/components/admin/VideoFileHelp#VideoFileHelp' } },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Ou lien externe',
      validate: isURL,
      admin: { description: 'Adresse de l’article ou de la vidéo sur le site du média.' },
    },
    legacyFields,
  ],
  hooks: publicationHooks,
}

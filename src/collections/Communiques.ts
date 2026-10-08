import type { CollectionConfig } from 'payload'
import {
  dateField,
  fileField,
  legacyFields,
  publicationAccess,
  publicationHooks,
  thumbnailField,
  titleField,
} from './publicationFields'

/** Rubrique « Communiqués de presse » du site. */
export const Communiques: CollectionConfig = {
  slug: 'communiques',
  labels: { singular: 'Communiqué de presse', plural: 'Communiqués de presse' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', '_status'],
    group: 'Publications',
    listSearchableFields: ['title'],
    description: 'Communiqués affichés sur le site, du plus récent au plus ancien (champ « Date »).',
  },
  defaultSort: '-date',
  versions: { drafts: true },
  access: publicationAccess,
  fields: [
    dateField,
    titleField,
    {
      name: 'summary',
      type: 'textarea',
      label: 'Chapô (facultatif)',
      localized: true,
      admin: { description: 'Court texte affiché sous le titre du communiqué.' },
    },
    thumbnailField('Visuel d’illustration du communiqué. Remplace le visuel d’origine s’il y en a un.'),
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Étiquettes',
      admin: { description: 'Affichées en haut à droite du visuel (Capitello Group, Doxamed…).' },
    },
    fileField('Communiqué (PDF)', 'Fichier ouvert par le bouton « Lire le communiqué de presse ». Poids maximum : 200 Mo.'),
    {
      name: 'showInFooter',
      type: 'checkbox',
      label: 'Afficher dans « Dernières publications » (pied de page)',
      defaultValue: false,
      admin: { description: 'Le pied de page affiche les deux communiqués cochés les plus récents.' },
    },
    legacyFields,
  ],
  hooks: publicationHooks,
}

import type { CollectionConfig } from 'payload'
import { revalidateSite } from '../lib/revalidate'

/** Étiquettes affichées sur le visuel des communiqués (Doxamed, Capitello Group…). */
export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Étiquette', plural: 'Étiquettes' },
  admin: {
    useAsTitle: 'name',
    group: 'Publications',
    description: 'Étiquettes affichées en haut à droite du visuel des communiqués de presse.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
      required: true,
      localized: true,
      admin: { description: 'Sans traduction, le nom français est affiché dans les autres langues.' },
    },
  ],
  hooks: {
    afterChange: [() => revalidateSite()],
    afterDelete: [() => revalidateSite()],
  },
}

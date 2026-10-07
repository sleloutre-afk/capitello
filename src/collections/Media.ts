import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Fichiers uploadés depuis le BO : visuels des publications, PDF des
 * communiqués et articles, vidéos/sons des passages médias.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Fichier', plural: 'Bibliothèque' },
  admin: {
    useAsTitle: 'filename',
    group: 'Fichiers',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
    description:
      "Images, PDF, vidéos et sons utilisés par les publications. Un fichier y est ajouté automatiquement quand vous l'envoyez depuis une publication.",
  },
  access: {
    read: ({ req, id, isReadingStaticFile }) =>
      req.payloadAPI === 'local' || Boolean(isReadingStaticFile) || Boolean(id) || Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    // En local : <projet>/media (ignoré par git). En production : stockage S3.
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4', 'audio/mpeg'],
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Texte alternatif' },
    {
      // Adresse du fichier sur l'ancien site WordPress (/wp-content/uploads/…) :
      // les anciens liens y sont redirigés vers le fichier de la bibliothèque
      // (src/app/wp-content/uploads/[...path]/route.ts).
      name: 'legacyPath',
      type: 'text',
      label: 'Adresse d’origine (import WordPress)',
      index: true,
      admin: { readOnly: true, condition: (data) => Boolean(data?.legacyPath) },
    },
  ],
}

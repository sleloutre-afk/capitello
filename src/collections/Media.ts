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
    // Un fichier se lit par son adresse (/api/media/file/<nom>) ou sa fiche
    // par son identifiant — nécessaire au site public. En revanche, lister
    // toute la bibliothèque par l'API reste réservé aux comptes du BO.
    // `routeParams.filename` : le stockage S3 de Payload refait, pour servir
    // un fichier, une recherche par nom soumise à ce contrôle d'accès.
    read: ({ req, id, isReadingStaticFile }) =>
      req.payloadAPI === 'local' ||
      Boolean(isReadingStaticFile) ||
      typeof req.routeParams?.filename === 'string' ||
      Boolean(id) ||
      Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    // En local : <projet>/media (ignoré par git). Avec le stockage S3
    // (production), rien n'est écrit sur disque, mais Payload y cherche
    // quand même les doublons de nom : on pointe alors vers un dossier
    // inexistant, sinon un import lancé depuis ce poste renomme chaque
    // fichier déjà présent dans ./media (« nom-1.pdf »).
    staticDir: path.resolve(dirname, process.env.S3_BUCKET ? '../../.media-s3' : '../../media'),
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

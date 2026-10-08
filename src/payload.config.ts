import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Communiques } from './collections/Communiques'
import { News } from './collections/News'
import { resendEmailAdapter } from './lib/payloadEmailAdapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** Taille maximale d'un fichier envoyé depuis le BO. */
const MAX_UPLOAD_BYTES = 200 * 1024 * 1024

const databaseURI = process.env.DATABASE_URI || ''
// Production : Postgres. Local : SQLite (fichier hors du disque externe,
// voir .env.example).
const usePostgres = databaseURI.startsWith('postgres')

export default buildConfig({
  // Back-office : https://<domaine>/BO — doit correspondre au dossier
  // src/app/(payload)/BO.
  routes: { admin: '/BO' },
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Capitello BO',
      icons: [{ rel: 'icon', type: 'image/png', url: '/wp-content/uploads/2025/02/cropped-logo-capitello-black-big-32x32.png' }],
    },
    components: {
      graphics: {
        Icon: '/src/components/admin/AdminIcon#AdminIcon',
        Logo: '/src/components/admin/AdminLogo#AdminLogo',
      },
      beforeNavLinks: [
        // Lien de retour au tableau de bord, en haut de la nav latérale.
        '/src/components/admin/DashboardLink#DashboardLink',
        // Barre latérale ouverte par défaut (Payload la referme sinon sur tout écran ≤ 1440px).
        '/src/components/admin/DefaultOpenNav#DefaultOpenNav',
      ],
    },
    // Tableau de bord : un seul bloc pleine largeur qui dispose lui-même
    // ses trois cartes — Communiqués de presse et Dans les médias à gauche,
    // Bibliothèque sur toute la hauteur à droite.
    dashboard: {
      widgets: [
        {
          slug: 'capitello-dashboard',
          Component: '/src/components/admin/DashboardWidget#DashboardWidget',
          minWidth: 'full',
        },
      ],
      defaultLayout: [{ widgetSlug: 'capitello-dashboard', width: 'full' }],
    },
  },
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
    // La même page sert à la première connexion d'un compte invité et au
    // mot de passe oublié : le titre par défaut ne convenait qu'au second cas.
    translations: {
      fr: { authentication: { resetPassword: 'Créez ou réinitialisez votre mot de passe' } },
    },
  },
  // Langues du site public. Les champs « localized » (titre, chapô) se
  // saisissent par langue ; sans traduction, le français est affiché.
  localization: {
    locales: [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
      { code: 'zh', label: '中文' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  // Ordre = ordre des entrées dans la nav latérale.
  collections: [Communiques, News, Tags, Media, Users],
  editor: lexicalEditor(),
  // Envoi de fichiers depuis le BO : jusqu'à 200 Mo (vidéos des passages
  // médias), au lieu des 20 Mo par défaut de Payload. Les fichiers passent
  // par un dossier temporaire plutôt que par la mémoire du serveur.
  upload: {
    limits: { fileSize: MAX_UPLOAD_BYTES },
    requestSizeLimit: MAX_UPLOAD_BYTES + 5 * 1024 * 1024,
    useTempFiles: true,
    tempFileDir: path.join(os.tmpdir(), 'capitello-uploads'),
  },
  // E-mails du BO (invitation, mot de passe oublié) envoyés via Resend.
  email: resendEmailAdapter,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: usePostgres
    ? postgresAdapter({
        pool: { connectionString: databaseURI, max: 3 },
        // Les changements de schéma passent par des migrations versionnées
        // (src/migrations), jamais par le « push » interactif de Payload.
        push: false,
        migrationDir: path.resolve(dirname, 'migrations'),
      })
    : sqliteAdapter({ client: { url: databaseURI } }),
  sharp,
  cors: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3084'].filter(Boolean),
  plugins: [
    // En production, les fichiers uploadés partent sur un bucket S3 ;
    // sans configuration S3 (local), ils restent dans ./media.
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})

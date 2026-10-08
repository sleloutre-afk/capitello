import crypto from 'crypto'
import type { CollectionConfig } from 'payload'

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3084'

/**
 * Comptes du back-office (email + mot de passe, géré par Payload).
 * - `super-admin` : tout, y compris la gestion des comptes.
 * - `editor` : publication des contenus uniquement.
 * Le tout premier compte créé (écran d'accueil du BO) est super-admin.
 *
 * Invitation : un super-admin crée le compte (nom, e-mail, rôle) ; la
 * personne reçoit un e-mail avec un lien à usage unique, valable 1 heure,
 * pour définir elle-même son mot de passe. Le même lien sert au « mot de
 * passe oublié ». Règle de mot de passe : voir src/lib/validation.ts.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  auth: {
    // 10 échecs de connexion verrouillent le compte 10 minutes.
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
    // Même e-mail pour l'invitation d'un nouveau compte et pour un vrai
    // « mot de passe oublié » : un lien sécurisé, à usage unique.
    forgotPassword: {
      generateEmailSubject: () => 'Accès au back-office Capitello',
      generateEmailHTML: ({ token } = {}) => {
        const url = `${SITE_ORIGIN}/BO/reset/${token}`
        return `
          <p>Bonjour,</p>
          <p>Vous êtes invité(e) à vous connecter au back-office du site Capitello. Cliquez sur le lien ci-dessous pour définir votre mot de passe&nbsp;:</p>
          <p><a href="${url}">${url}</a></p>
          <p>Le mot de passe doit compter au moins 10 caractères, dont une majuscule, un chiffre et un caractère spécial.</p>
          <p>Ce lien est valable 1 heure. Passé ce délai, utilisez «&nbsp;Mot de passe oublié&nbsp;» sur la page de connexion pour en recevoir un nouveau. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
        `
      },
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
    hidden: ({ user }) => user?.role !== 'super-admin',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'super-admin') return true
      if (req.user) return { id: { equals: req.user.id } }
      return false
    },
    create: ({ req }) => req.user?.role === 'super-admin',
    update: ({ req }) => {
      if (req.user?.role === 'super-admin') return true
      if (req.user) return { id: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
      required: true,
      admin: {
        description:
          'À la création d’un compte, les champs de mot de passe ci-dessus sont provisoires : la personne invitée définit le sien via le lien reçu par e-mail.',
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rôle',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super administrateur', value: 'super-admin' },
        { label: 'Éditeur', value: 'editor' },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'super-admin',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      // Le super-admin qui crée le compte d'un collègue ne choisit pas son
      // mot de passe : ce que le formulaire envoie est remplacé par une
      // valeur aléatoire que personne ne connaît. Le compte n'est accessible
      // que par le lien d'invitation envoyé ci-dessous. (Sauf pour le tout
      // premier compte, créé sur l'écran d'accueil avec un vrai mot de passe.)
      async ({ operation, data, req }) => {
        if (operation === 'create' && data) {
          const { totalDocs } = await req.payload.count({ collection: 'users' })
          if (totalDocs > 0) data.password = crypto.randomBytes(32).toString('hex')
        }
        return data
      },
    ],
    beforeChange: [
      // Le premier compte créé devient super-admin, pour pouvoir ensuite
      // inviter les autres.
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users' })
          if (totalDocs === 0) data.role = 'super-admin'
        }
        return data
      },
    ],
    afterChange: [
      // Envoie l'e-mail d'invitation dès qu'un super-admin crée un compte.
      async ({ operation, doc, req }) => {
        if (operation !== 'create') return
        const { totalDocs } = await req.payload.count({ collection: 'users' })
        if (totalDocs <= 1) return
        await req.payload.forgotPassword({ collection: 'users', data: { email: doc.email }, req })
      },
    ],
  },
}

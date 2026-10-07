import type { CollectionConfig } from 'payload'

/**
 * Comptes du back-office (email + mot de passe, géré par Payload).
 * - `super-admin` : tout, y compris la gestion des comptes.
 * - `editor` : publication des contenus uniquement.
 * Le tout premier compte créé (écran d'accueil du BO) est super-admin.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  auth: {
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
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
    { name: 'name', type: 'text', label: 'Nom', required: true },
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
  },
}

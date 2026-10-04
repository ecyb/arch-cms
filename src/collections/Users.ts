import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'customType', 'updatedAt'],
    group: 'Administration',
    hidden: ({ user }: any) => user?.role !== 'admin',
  },
  auth: true,
  access: {
    read: ({ req }) => {
      if ((req.user as any)?.role === 'admin') return true
      if (req.user) {
        return {
          id: {
            equals: req.user.id,
          },
        }
      }
      return false
    },
    create: isAdmin,
    update: ({ req }) => {
      if ((req.user as any)?.role === 'admin') return true
      if (req.user) {
        return {
          id: {
            equals: req.user.id,
          },
        }
      }
      return false
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role & Access Level',
      defaultValue: 'admin',
      required: true,
      options: [
        {
          label: '👑 Administrator (Full Access to CMS & User Management)',
          value: 'admin',
        },
        {
          label: '✍️ Moderator (Content & Publishing Management)',
          value: 'moderator',
        },
        {
          label: '⚙️ Custom User Type (Granular Permissions)',
          value: 'custom',
        },
      ],
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'customType',
      type: 'relationship',
      relationTo: 'user-types',
      label: 'Assigned Custom User Type',
      admin: {
        condition: (data) => data?.role === 'custom',
        description: 'Select the custom role with customized permissions',
      },
      access: {
        update: isAdmin,
      },
    },
  ],
  versions: false,
}

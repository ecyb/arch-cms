import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'

export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
    group: 'Studio & Practice',
  },
  access: {
    read: () => true,
    create: hasPermission('manageStudio'),
    update: hasPermission('manageStudio'),
    delete: hasPermission('manageStudio'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Role / Title',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo',
    },
    {
      name: 'sort',
      type: 'number',
      label: 'Sort Order',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

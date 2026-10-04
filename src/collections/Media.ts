import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media & Library',
  },
  access: {
    read: () => true,
    create: hasPermission('manageMedia'),
    update: hasPermission('manageMedia'),
    delete: hasPermission('manageMedia'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}

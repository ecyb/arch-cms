import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'

export const DFPublications: CollectionConfig = {
  slug: 'df-publications',
  labels: {
    singular: 'Publication / News',
    plural: 'Publications',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'date', 'latest'],
    group: 'Davud Farzulla Website',
    description: 'Davud Farzulla news, press features, and monograph publications.',
  },
  access: {
    read: () => true,
    create: hasPermission('managePublications'),
    update: hasPermission('managePublications'),
    delete: hasPermission('managePublications'),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Title',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'date',
              type: 'date',
              label: 'Date',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'latest',
              type: 'checkbox',
              label: 'Featured / Latest Article',
              defaultValue: false,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle / Excerpt',
            },
            {
              name: 'body',
              type: 'textarea',
              label: 'Body / Content',
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover Image',
            },
          ],
        },
      ],
    },
  ],
}

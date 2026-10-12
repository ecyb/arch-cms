import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'
import { withSeoTab } from '../fields/seo'
import { websitesField } from '../fields/websites'
import { richBodyFields, syncBodyHtml } from '../fields/richBody'

export const DFPublications: CollectionConfig = {
  slug: 'df-publications',
  labels: {
    singular: 'Publication / News',
    plural: 'Publications',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'websites', 'date', 'latest'],
    group: 'Davud Farzulla Website',
    description: 'Davud Farzulla news, press features, and monograph publications.',
  },
  access: {
    read: () => true,
    create: hasPermission('managePublications'),
    update: hasPermission('managePublications'),
    delete: hasPermission('managePublications'),
  },
  hooks: { beforeChange: [syncBodyHtml] },
  fields: withSeoTab([
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
            },
            websitesField('DF'),
            {
              name: 'date',
              type: 'date',
              label: 'Date',
            },
            {
              name: 'latest',
              type: 'checkbox',
              label: 'Featured / Latest Article',
              defaultValue: false,
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle / Excerpt',
            },
            ...richBodyFields(),
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
  ]),
}

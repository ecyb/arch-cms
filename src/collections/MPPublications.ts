import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'
import { withSeoTab } from '../fields/seo'
import { websitesField } from '../fields/websites'
import { richBodyFields, syncBodyHtml } from '../fields/richBody'

export const MPPublications: CollectionConfig = {
  slug: 'mp-publications',
  labels: {
    singular: 'Publication / News',
    plural: 'Publications',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'date', 'latest'],
    group: 'Magnum Projects Website',
    description: 'Magnum Projects development updates, construction news, and regulatory insights.',
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
            websitesField('Magnum Projects'),
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
            ...richBodyFields(),
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover Image',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'SEO Settings',
              fields: [
                {
                  name: 'page_title',
                  type: 'text',
                  label: 'Page Title',
                  admin: {
                    description: 'Ideal length 45-60 characters recommended.',
                  },
                },
                {
                  name: 'meta_description',
                  type: 'textarea',
                  label: 'Meta Description',
                  admin: {
                    description: 'Ideal length 130-160 characters recommended.',
                  },
                },
                {
                  name: 'social_image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Social Image Preview',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'directusId',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ]),
}

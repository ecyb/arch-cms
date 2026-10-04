import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'date', 'latest'],
    group: 'Archia Website',
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
              label: 'Name',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug',
            },
            {
              name: 'website',
              type: 'select',
              label: 'Website Destination',
              defaultValue: 'Archia',
              options: [
                { label: 'None', value: 'None' },
                { label: 'Archia', value: 'Archia' },
                { label: 'Magnum Projects', value: 'Magnum Projects' },
                { label: 'DF (Davud Farzulla)', value: 'DF' },
                { label: 'All Websites', value: 'All' },
              ],
            },
            {
              name: 'date',
              type: 'date',
              label: 'Date',
            },
            {
              name: 'latest',
              type: 'checkbox',
              label: 'Latest Article',
              defaultValue: false,
            },
            {
              name: 'body',
              type: 'textarea',
              label: 'Body',
              admin: {
                description: 'Article content / HTML markup',
              },
            },
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
  ],
}

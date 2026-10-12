import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'
import { withSeoTab } from '../fields/seo'
import { websitesField } from '../fields/websites'

export const MPProjects: CollectionConfig = {
  slug: 'mp-projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'category', 'year', 'location', 'featured_mp'],
    group: 'Magnum Projects Website',
    description: 'Magnum Projects luxury development & construction projects.',
  },
  access: {
    read: () => true,
    create: hasPermission('manageProjects'),
    update: hasPermission('manageProjects'),
    delete: hasPermission('manageProjects'),
  },
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
              label: 'Name',
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
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'client',
                  type: 'text',
                  label: 'Client',
                  admin: { width: '50%' },
                },
                {
                  name: 'location',
                  type: 'text',
                  label: 'Location',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'area',
                  type: 'text',
                  label: 'Area',
                  admin: { width: '33%' },
                },
                {
                  name: 'year',
                  type: 'number',
                  label: 'Year',
                  admin: { width: '33%' },
                },
                {
                  name: 'category',
                  type: 'text',
                  label: 'Category',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'text',
                  label: 'Status',
                  admin: { width: '50%' },
                },
                {
                  name: 'budget',
                  type: 'text',
                  label: 'Budget',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'sort',
              type: 'number',
              label: 'Sort Order',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Images',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
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
                  label: 'Social Image Preview (1200 x 630 recommended)',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'featured_mp',
      type: 'checkbox',
      label: 'Featured on Magnum Projects',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show / feature this project on Magnum Projects',
      },
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

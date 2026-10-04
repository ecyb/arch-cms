import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'

export const DFProjects: CollectionConfig = {
  slug: 'df-projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'category', 'year', 'location'],
    group: 'Davud Farzulla Website',
    description: 'Davud Farzulla architecture & interior design projects.',
  },
  access: {
    read: () => true,
    create: hasPermission('manageProjects'),
    update: hasPermission('manageProjects'),
    delete: hasPermission('manageProjects'),
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
              admin: {
                position: 'sidebar',
              },
            },
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
                  type: 'select',
                  label: 'Category',
                  defaultValue: 'Interior',
                  options: [
                    { label: 'Architecture', value: 'Architecture' },
                    { label: 'Interior', value: 'Interior' },
                    { label: 'Product', value: 'Product' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover Image',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Gallery Images',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption',
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
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Meta Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Meta Description',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

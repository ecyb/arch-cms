import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'category', 'year', 'location', 'featured_archia'],
    group: 'Archia Website',
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
                  name: 'website',
                  type: 'select',
                  label: 'Website',
                  defaultValue: 'All',
                  options: [
                    { label: 'None', value: 'None' },
                    { label: 'Archia', value: 'Archia' },
                    { label: 'Magnum Projects', value: 'Magnum Projects' },
                    { label: 'DF', value: 'DF' },
                    { label: 'All', value: 'All' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'status',
                  type: 'text',
                  label: 'Status',
                  admin: { width: '33%' },
                },
                {
                  name: 'budget',
                  type: 'text',
                  label: 'Budget',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'featured_archia',
                  type: 'checkbox',
                  label: 'Featured Archia',
                  defaultValue: false,
                  admin: { width: '33%' },
                },
                {
                  name: 'featured_mp',
                  type: 'checkbox',
                  label: 'Featured MP',
                  defaultValue: false,
                  admin: { width: '33%' },
                },
                {
                  name: 'sort',
                  type: 'number',
                  label: 'Sort Order',
                  admin: { width: '33%' },
                },
              ],
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
      name: 'directusId',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}

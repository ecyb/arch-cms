import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'
import { withSeoTab } from '../fields/seo'
import { websitesField } from '../fields/websites'

export const DFProjects: CollectionConfig = {
  slug: 'df-projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'category', 'typology', 'websites', 'year'],
    group: 'Davud Farzulla Website',
    description: 'Davud Farzulla architecture & interior design projects.',
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
            websitesField('DF'),
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
                  admin: { width: '50%' },
                },
                {
                  name: 'year',
                  type: 'number',
                  label: 'Year',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'select',
                  label: 'Category',
                  defaultValue: 'Interior',
                  options: [
                    { label: 'Interior', value: 'Interior' },
                    { label: 'Architecture', value: 'Architecture' },
                    { label: 'Product', value: 'Product' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'typology',
                  type: 'select',
                  label: 'Section / Typology',
                  defaultValue: 'Residential',
                  options: [
                    { label: 'Residential', value: 'Residential' },
                    { label: 'Hospitality', value: 'Hospitality' },
                    { label: 'Offices', value: 'Offices' },
                    { label: 'Retail', value: 'Retail' },
                    { label: 'Other', value: 'Other' },
                  ],
                  admin: { width: '50%' },
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
  ], { titleName: 'title', descriptionName: 'description' }),
}

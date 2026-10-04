import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'

export const DFPages: CollectionConfig = {
  slug: 'df-pages',
  labels: {
    singular: 'Davud Farzulla Section',
    plural: 'Davud Farzulla Sections',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Davud Farzulla Website',
    description: 'Davud Farzulla website sections (automatically populated).',
  },
  access: {
    read: () => true,
    create: hasPermission('managePages'),
    update: hasPermission('managePages'),
    delete: hasPermission('managePages'),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Section Title',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Subtitle / Tagline',
    },
    {
      type: 'row',
      admin: {
        condition: (data) => !data?.contentSource || data?.contentSource === 'projects',
      },
      fields: [
        {
          name: 'categoryFilter',
          type: 'select',
          label: 'Filter: Category',
          defaultValue: 'Interior',
          options: [
            { label: 'Interior', value: 'Interior' },
            { label: 'Architecture', value: 'Architecture' },
            { label: 'All Categories', value: 'All' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'typologyFilter',
          type: 'select',
          label: 'Filter: Typology',
          defaultValue: 'Residential',
          options: [
            { label: 'Residential', value: 'Residential' },
            { label: 'Hospitality', value: 'Hospitality' },
            { label: 'Offices', value: 'Offices' },
            { label: 'All Typologies', value: 'All' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description / Biography Text',
      admin: {
        rows: 14,
        condition: (data) => data?.contentSource === 'info',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo / Lead Image',
      admin: {
        condition: (data) => data?.contentSource === 'info',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Route',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'contentSource',
      type: 'select',
      label: 'Section Type',
      defaultValue: 'projects',
      options: [
        { label: 'Automatic Projects Filter', value: 'projects' },
        { label: 'Automatic News Feed', value: 'news' },
        { label: 'Studio Info & Biography', value: 'info' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}

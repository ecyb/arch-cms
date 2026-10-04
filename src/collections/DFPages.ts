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
    defaultColumns: ['title', 'slug', 'contentSource', 'categoryFilter', 'typologyFilter', 'updatedAt'],
    group: 'Davud Farzulla Website',
    description: 'Dynamic website sections filtered automatically by Category, Typology, and Website.',
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Route Slug',
      admin: {
        position: 'sidebar',
        description: 'e.g. projects/interior/residential, projects/interior/hospitality, projects/architecture/residential, news, davud-farzulla',
      },
    },
    {
      name: 'contentSource',
      type: 'select',
      label: 'Content Source (Automatic)',
      defaultValue: 'projects',
      required: true,
      options: [
        { label: 'Automatic Projects Filter (By Category & Typology)', value: 'projects' },
        { label: 'Automatic News & Publications Feed', value: 'news' },
        { label: 'Studio Info & Founder Biography', value: 'info' },
      ],
      admin: {
        position: 'sidebar',
      },
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
      name: 'tagline',
      type: 'text',
      label: 'Subtitle / Tagline',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description / Curatorial Text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero / Lead Section Image',
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Extended Biography & Credentials',
      admin: {
        condition: (data) => data?.contentSource === 'info',
      },
    },
  ],
}

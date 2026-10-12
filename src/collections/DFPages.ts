import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'

export const DFPages: CollectionConfig = {
  slug: 'df-pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isVisible', 'contentSource', 'order', 'updatedAt'],
    group: 'Davud Farzulla Website',
    description: 'Davud Farzulla website sections (add, re-order, edit, or remove sections to control navigation).',
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
      label: 'Route / Slug',
      admin: {
        position: 'sidebar',
        description: 'URL route (e.g. projects/interior/residential, news, or info/davud-farzulla)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      label: 'Show Page (Visible on Website)',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Toggle on to show, or uncheck to hide this section on the website',
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
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first in navigation',
      },
    },
  ],
}

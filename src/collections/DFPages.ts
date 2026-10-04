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
    description: 'Manage Interior, Architecture, Info, and News sections.',
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
      label: 'Page Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle / Tagline',
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      labels: {
        singular: 'Section Block',
        plural: 'Section Blocks',
      },
      blocks: [
        // 1. Founder Biography & Portrait
        {
          slug: 'dfBiography',
          labels: {
            singular: 'Biography & Founder Profile',
            plural: 'Biographies',
          },
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              defaultValue: 'FOUNDER & PRINCIPAL ARCHITECT',
            },
            {
              name: 'quote',
              type: 'textarea',
              defaultValue:
                'Architecture begins with attentive listening. We translate each client distinct rhythm of life into structures of timeless proportion, warmth, and permanence.',
            },
            {
              name: 'bio',
              type: 'richText',
              label: 'Extended Biography',
            },
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              label: 'Portrait Photo',
            },
          ],
        },

        // 2. Featured Projects / Monograph Showcase
        {
          slug: 'dfProjects',
          labels: {
            singular: 'Selected Works Showcase',
            plural: 'Selected Works Showcases',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
              defaultValue: '01 / ARCHITECTURAL COMMISSIONS',
            },
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Selected Commissions',
            },
            {
              name: 'projects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              label: 'Projects',
            },
          ],
        },

        // 3. Full Width Media / Cinematic Video
        {
          slug: 'dfMedia',
          labels: {
            singular: 'Full Width Cinematic Media',
            plural: 'Media Blocks',
          },
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'image',
              options: [
                { label: 'Image', value: 'image' },
                { label: 'Video URL', value: 'video' },
              ],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'image',
              },
            },
            {
              name: 'videoUrl',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'video',
              },
            },
            {
              name: 'caption',
              type: 'text',
              defaultValue: 'Architectural Composition & Material Permanence',
            },
          ],
        },

        // 4. Rich Text Statement / Essays
        {
          slug: 'dfContent',
          labels: {
            singular: 'Editorial & Text Essay',
            plural: 'Text Essays',
          },
          fields: [
            {
              name: 'richText',
              type: 'richText',
            },
          ],
        },

        // 5. Contact & Studio Inquiries
        {
          slug: 'dfContact',
          labels: {
            singular: 'Studio Briefing & Contact',
            plural: 'Contact Blocks',
          },
          fields: [
            {
              name: 'headline',
              type: 'text',
              defaultValue: 'Private Commission Briefing',
            },
            {
              name: 'email',
              type: 'text',
              defaultValue: 'davud@archia.com',
            },
            {
              name: 'phone',
              type: 'text',
              defaultValue: '+44 (0) 20 7946 0928',
            },
            {
              name: 'office',
              type: 'text',
              defaultValue: 'Fitzrovia, Central London',
            },
          ],
        },
      ],
    },
  ],
}

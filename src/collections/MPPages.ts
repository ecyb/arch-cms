import type { CollectionConfig } from 'payload'
import { hasPermission } from '../access/roles'

export const MPPages: CollectionConfig = {
  slug: 'mp-pages',
  labels: {
    singular: 'Magnum Projects Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isVisible', 'updatedAt'],
    group: 'Magnum Projects Website',
    description: 'Magnum Projects website pages and section layouts.',
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
      label: 'Route / Slug',
      admin: {
        position: 'sidebar',
        description: 'e.g. index, home, about-us, projects, services, contact-us',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      label: 'Show Page (Visible on Website)',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Toggle on to show, or uncheck to hide this page on the website',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page Sections & Blocks',
      blocks: [
        // 1. Hero Slider / Banner
        {
          slug: 'mpHeroSlider',
          labels: {
            singular: 'Hero Slider',
            plural: 'Hero Sliders',
          },
          fields: [
            {
              name: 'headline',
              type: 'text',
              defaultValue: 'MAGNUM PROJECTS',
            },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'High-End Project Management & Architectural Development',
            },
            {
              name: 'slides',
              type: 'array',
              label: 'Slide Images',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'caption',
                  type: 'text',
                },
                {
                  name: 'linkUrl',
                  type: 'text',
                },
              ],
            },
          ],
        },

        // 2. About Summary Section
        {
          slug: 'mpAboutSection',
          labels: {
            singular: 'About Section',
            plural: 'About Sections',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
              defaultValue: 'About Magnum Projects',
            },
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Dedicated to Exceptional Craftsmanship & Management',
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                'Magnum Projects is an elite property development and project management consultancy delivering prime architectural projects across London and internationally.',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Key Metrics / Bullet Points',
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  label: 'Value / Stat (e.g. 50+)',
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label (e.g. Delivered Projects)',
                },
              ],
            },
          ],
        },

        // 3. Services Section
        {
          slug: 'mpServicesSection',
          labels: {
            singular: 'Services Section',
            plural: 'Services Sections',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
              defaultValue: 'Our Expertise',
            },
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Comprehensive Project Services',
            },
            {
              name: 'services',
              type: 'array',
              label: 'Services List',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'slug',
                  type: 'text',
                  label: 'Link / Detail URL',
                },
              ],
            },
          ],
        },

        // 4. Featured Projects Showcase
        {
          slug: 'mpFeaturedProjects',
          labels: {
            singular: 'Featured Projects Showcase',
            plural: 'Featured Projects Showcases',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
              defaultValue: 'Selected Works',
            },
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Signature Developments',
            },
            {
              name: 'projects',
              type: 'relationship',
              relationTo: 'mp-projects',
              hasMany: true,
              label: 'Selected Projects',
            },
          ],
        },

        // 5. Contact Section
        {
          slug: 'mpContactSection',
          labels: {
            singular: 'Contact Section',
            plural: 'Contact Sections',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Get in Touch',
            },
            {
              name: 'subtitle',
              type: 'textarea',
              defaultValue: 'Contact our London office to discuss your project requirements.',
            },
            {
              name: 'email',
              type: 'text',
              defaultValue: 'info@magnumprojects.co.uk',
            },
            {
              name: 'phone',
              type: 'text',
              defaultValue: '+44 (0) 20 7000 0000',
            },
            {
              name: 'address',
              type: 'textarea',
              defaultValue: 'London, United Kingdom',
            },
          ],
        },

        // 6. Generic Content / Text Block
        {
          slug: 'mpContentBlock',
          labels: {
            singular: 'Custom Content Block',
            plural: 'Custom Content Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'body',
              type: 'textarea',
              admin: {
                rows: 10,
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO / Meta Information',
      admin: {
        position: 'sidebar',
      },
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
}

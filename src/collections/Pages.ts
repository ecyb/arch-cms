import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [
        // 1. Home Video & Slideshow Hero
        {
          slug: 'homeHero',
          imageURL: '/blocks/home-hero.jpg',
          imageAltText: 'Home Hero (Video Slideshow)',
          admin: {
            images: {
              thumbnail: '/blocks/home-hero.jpg',
            },
          },
          labels: {
            singular: 'Home Hero (Video Slideshow)',
            plural: 'Home Heroes',
          },
          fields: [
            {
              name: 'headline',
              type: 'text',
              defaultValue: 'ARCHIA',
            },
            {
              name: 'subtitle',
              type: 'text',
              defaultValue: 'Multidisciplinary Architecture & Interiors • London',
            },
            {
              name: 'videoUrls',
              type: 'array',
              label: 'Background Video Sources',
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  defaultValue: '/videos/2.mp4',
                },
              ],
            },
          ],
        },

        // 2. Featured Projects Grid / Slider
        {
          slug: 'featuredProjects',
          imageURL: '/blocks/featured-projects.jpg',
          imageAltText: 'Featured Projects Showcase',
          admin: {
            images: {
              thumbnail: '/blocks/featured-projects.jpg',
            },
          },
          labels: {
            singular: 'Featured Projects Showcase',
            plural: 'Featured Projects Showcases',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
              defaultValue: '02 / Architectural Commissions',
            },
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Selected Works',
            },
            {
              name: 'projects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
            },
          ],
        },

        // 3. Studio Manifesto & Intro
        {
          slug: 'studioIntro',
          imageURL: '/blocks/studio-intro.jpg',
          imageAltText: 'Studio Intro & Manifesto',
          admin: {
            images: {
              thumbnail: '/blocks/studio-intro.jpg',
            },
          },
          labels: {
            singular: 'Studio Intro & Manifesto',
            plural: 'Studio Intros',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Studio',
            },
            {
              name: 'badge',
              type: 'text',
              defaultValue: 'London Practice',
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                'We are a multidisciplinary design studio delivering unique architectural commissions of any scale. Our works range from bespoke residential architecture, commercial interiors, and sports infrastructure to urban masterplanning.',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },

        // 4. Founder & Leadership Profile (Davud Farzulla)
        {
          slug: 'founderProfile',
          imageURL: '/blocks/founder-profile.jpg',
          imageAltText: 'Founder Profile (Davud Farzulla)',
          admin: {
            images: {
              thumbnail: '/blocks/founder-profile.jpg',
            },
          },
          labels: {
            singular: 'Founder Profile (Davud Farzulla)',
            plural: 'Founder Profiles',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              defaultValue: 'Davud Farzulla',
            },
            {
              name: 'role',
              type: 'text',
              defaultValue: 'Founder & RIBA Chartered Architect',
            },
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'portraitCaption',
              type: 'text',
              defaultValue: 'Davud Farzulla — Founder & Principal',
            },
            {
              name: 'bio',
              type: 'textarea',
              defaultValue:
                'Davud Farzulla is a RIBA Chartered Architect and Interior Designer with over 20 years’ experience in the UK construction industry. In 2020, Davud founded Archia to provide a fully integrated design and management service tailored specifically to private clients.',
            },
          ],
        },

        // 4b. About Us Section (Home Page)
        {
          slug: 'aboutSection',
          imageURL: '/blocks/about-section.jpg',
          imageAltText: 'About Us Section',
          admin: {
            images: {
              thumbnail: '/blocks/about-section.jpg',
            },
          },
          labels: {
            singular: 'About Us Section',
            plural: 'About Us Sections',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'About us',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Lead Paragraph',
              defaultValue:
                'Our experienced team brings together strong design expertise with extensive project management experience across commercial and high-end residential sectors. This combined knowledge allows us to approach each project with both creative clarity and technical precision.',
            },
            {
              name: 'subtext',
              type: 'textarea',
              label: 'Secondary Paragraph',
              defaultValue:
                'We work closely with a trusted network of consultants, specialists, and suppliers, drawing on a well-established supply chain to ensure the highest standards of quality at every stage. Through collaboration, coordination, and attention to detail, we deliver well-resolved spaces that meet the practical, aesthetic, and long-term requirements of each project.',
            },
            {
              name: 'ctaLabel',
              type: 'text',
              defaultValue: 'Learn more',
            },
            {
              name: 'ctaLink',
              type: 'text',
              defaultValue: '/contact',
            },
          ],
        },

        // 5. Studio Disciplines & Pillars
        {
          slug: 'studioPillars',
          imageURL: '/blocks/studio-pillars.jpg',
          imageAltText: 'Studio Pillars / Disciplines',
          admin: {
            images: {
              thumbnail: '/blocks/studio-pillars.jpg',
            },
          },
          labels: {
            singular: 'Studio Pillars / Disciplines',
            plural: 'Studio Pillars',
          },
          fields: [
            {
              name: 'pillars',
              type: 'array',
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  defaultValue: '01 / Architecture',
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Residential & Masterplanning',
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
          ],
        },

        // 6. Journal & Press Highlights
        {
          slug: 'journalFeed',
          imageURL: '/blocks/journal-feed.jpg',
          imageAltText: 'Journal / Articles Feed',
          admin: {
            images: {
              thumbnail: '/blocks/journal-feed.jpg',
            },
          },
          labels: {
            singular: 'Journal / Articles Feed',
            plural: 'Journal Feeds',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
              defaultValue: '04 / Insights & Essays',
            },
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Journal',
            },
            {
              name: 'articles',
              type: 'relationship',
              relationTo: 'publications',
              hasMany: true,
            },
          ],
        },

        // 7. Contact Hero Block
        {
          slug: 'contactHero',
          imageURL: '/blocks/contact-hero.jpg',
          imageAltText: 'Contact Hero Header',
          admin: {
            images: {
              thumbnail: '/blocks/contact-hero.jpg',
            },
          },
          labels: {
            singular: 'Contact Hero Header',
            plural: 'Contact Hero Headers',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Start a Conversation',
            },
            {
              name: 'description',
              type: 'textarea',
              defaultValue:
                'ARCHIA collaborates with private clients, visionary developers, and cultural institutions globally. We approach each commission with architectural rigor, bespoke craftsmanship, and an unwavering commitment to enduring quality.',
            },
            {
              name: 'email',
              type: 'text',
              defaultValue: 'info@archia.com',
            },
            {
              name: 'statusText',
              type: 'text',
              defaultValue: 'London Practice • Available for commissions',
            },
            {
              name: 'mapLink',
              type: 'text',
              defaultValue: 'https://maps.google.com/?q=167-169+Great+Portland+Street+London+W1W+5PF',
            },
          ],
        },

        // 8. Studio Locations & Office Cards
        {
          slug: 'contactLocations',
          imageURL: '/blocks/contact-locations.jpg',
          imageAltText: 'Studio Office Cards',
          admin: {
            images: {
              thumbnail: '/blocks/contact-locations.jpg',
            },
          },
          labels: {
            singular: 'Studio Office Cards',
            plural: 'Studio Office Cards',
          },
          fields: [
            {
              name: 'locations',
              type: 'array',
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  defaultValue: '01 / Practice Headquarters',
                },
                {
                  name: 'studioName',
                  type: 'text',
                  defaultValue: 'London Studio',
                },
                {
                  name: 'address',
                  type: 'textarea',
                  defaultValue:
                    'ARCHIA Studio\n167–169 Great Portland Street\n5th Floor, Fitzrovia\nLondon W1W 5PF\nUnited Kingdom',
                },
                {
                  name: 'hours',
                  type: 'text',
                  defaultValue: 'Monday – Friday, 09:00 – 18:00 GMT',
                },
                {
                  name: 'transit',
                  type: 'text',
                  defaultValue: "Great Portland St • Oxford Circus • Regent's Park",
                },
                {
                  name: 'mapUrl',
                  type: 'text',
                  defaultValue: 'https://maps.google.com/?q=167-169+Great+Portland+Street+London+W1W+5PF',
                },
              ],
            },
          ],
        },

        // 9. Full-Bleed Atmosphere Photography
        {
          slug: 'fullWidthMedia',
          imageURL: '/blocks/full-width-media.jpg',
          imageAltText: 'Full-Bleed Atmosphere Photo',
          admin: {
            images: {
              thumbnail: '/blocks/full-width-media.jpg',
            },
          },
          labels: {
            singular: 'Full-Bleed Atmosphere Photo',
            plural: 'Full-Bleed Photos',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'caption',
              type: 'text',
              defaultValue: 'Archia Architectural Studio Environment',
            },
          ],
        },

        // 10. General Rich Text Content Block
        {
          slug: 'contentBlock',
          imageURL: '/blocks/content-block.jpg',
          imageAltText: 'Rich Text Content Block',
          admin: {
            images: {
              thumbnail: '/blocks/content-block.jpg',
            },
          },
          labels: {
            singular: 'Rich Text Content Block',
            plural: 'Rich Text Content Blocks',
          },
          fields: [
            {
              name: 'richText',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}

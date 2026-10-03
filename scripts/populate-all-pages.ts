import { getPayload } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from '../src/collections/Users'
import { Media } from '../src/collections/Media'
import { Pages } from '../src/collections/Pages'
import { Projects } from '../src/collections/Projects'
import { Publications } from '../src/collections/Publications'
import { Members } from '../src/collections/Members'
import { ContactInfoItems } from '../src/collections/ContactInfoItems'

const RAILWAY_DB_URL = 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@66.33.22.221:45248/railway'

async function populateAllPages() {
  console.log('Connecting to Railway Postgres...')
  const config = buildConfig({
    collections: [Users, Media, Pages, Projects, Publications, Members, ContactInfoItems],
    editor: lexicalEditor(),
    secret: 'archia-payload-secret-key-987654321',
    db: postgresAdapter({
      pool: {
        connectionString: RAILWAY_DB_URL,
      },
    }),
    sharp,
  })

  const payload = await getPayload({ config })

  const pagesToEnsure = [
    {
      title: 'Archia - Projects',
      slug: '/projects',
      layout: [
        {
          blockType: 'featuredProjects',
          tag: '02 / Architectural Commissions',
          title: 'All Works',
          limit: 20,
        },
      ],
    },
    {
      title: 'Archia - Studio',
      slug: '/studio',
      layout: [
        {
          blockType: 'studioIntro',
          title: 'Studio',
          badge: 'London Practice',
          description:
            'We are a multidisciplinary design studio delivering unique architectural commissions of any scale. Our works range from bespoke residential architecture, commercial interiors, and sports infrastructure to urban masterplanning.',
        },
        {
          blockType: 'fullWidthMedia',
          caption: 'London Architectural Practice Environment',
        },
        {
          blockType: 'founderProfile',
          tag: '03 / Leadership',
          name: 'Davud Farzulla',
          role: 'Founder & RIBA Chartered Architect',
          bio: 'Davud Farzulla is a RIBA Chartered Architect and Interior Designer with over 20 years’ experience in the UK construction industry. Davud obtained his education in the Midlands before moving to London to study Architecture. After receiving a degree in Architecture, he went on to complete a Master’s in History and Theory of Architecture.\n\nDuring his studies, Davud worked for a contractor, spending most of his time on construction sites, gaining first-hand experience in how buildings are constructed and managed. He later progressed into a design coordinator role on site, working closely with multiple trades. In his early career, Davud’s experience spanned both public and residential sectors.\n\nAfter obtaining RIBA Part III status, Davud moved into the ultra high-end residential sector, working directly for private clients as a project manager at a specialist family office consultancy. In this role, he delivered bespoke homes across London and the Home Counties for some of the country’s wealthiest families.',
        },
        {
          blockType: 'aboutSection',
          tag: '01 / Practice & Values',
          title: 'Enduring Architecture',
          pillars: [
            {
              number: '01',
              title: 'Philosophy',
              description: 'Architecture designed to withstand the test of time through thoughtful materiality and contextual sensitivity.',
            },
            {
              number: '02',
              title: 'Craft & Precision',
              description: 'Meticulous detailing and execution across ultra-prime residential and landmark civic structures.',
            },
          ],
        },
      ],
    },
    {
      title: 'Archia - Journal',
      slug: '/journal',
      layout: [
        {
          blockType: 'journalFeed',
          tag: '04 / Insights & Essays',
          title: 'Publications',
          limit: 20,
        },
      ],
    },
    {
      title: 'Archia - Contact',
      slug: '/contact',
      layout: [
        {
          blockType: 'contactHero',
          heading: 'Start a Conversation',
          subheading:
            'ARCHIA collaborates with private clients, visionary developers, and cultural institutions globally. We approach each commission with architectural rigor, bespoke craftsmanship, and an unwavering commitment to enduring quality.',
        },
        {
          blockType: 'contactLocations',
        },
      ],
    },
  ]

  for (const pageDef of pagesToEnsure) {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        or: [
          { slug: { equals: pageDef.slug } },
          { slug: { equals: pageDef.slug.replace(/^\//, '') } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Page already exists for ${pageDef.slug} (ID: ${existing.docs[0].id}), updating...`)
      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          title: pageDef.title,
          layout: pageDef.layout as any,
        },
      })
    } else {
      console.log(`Creating new page for ${pageDef.slug}...`)
      await payload.create({
        collection: 'pages',
        data: {
          title: pageDef.title,
          slug: pageDef.slug,
          layout: pageDef.layout as any,
        },
      })
    }
  }

  console.log('✅ Successfully synced all pages (/projects, /studio, /journal, /contact) in Payload CMS!')
  process.exit(0)
}

populateAllPages().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})

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

async function populateHomePage() {
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

  const existingPages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: '/' } },
    limit: 1,
  })

  if (existingPages.docs.length > 0) {
    const page = existingPages.docs[0]
    console.log('Found homepage:', page.title, 'ID:', page.id)

    const updatedLayout = [
      {
        blockType: 'homeHero',
        headline: 'ARCHIA',
        subtitle: 'Multidisciplinary Architecture & Interiors • London',
        videoUrls: [],
      },
      {
        blockType: 'studioIntro',
        title: 'Studio',
        badge: 'London Practice',
        description:
          'We are a multidisciplinary design studio delivering unique projects across all scales. Our work spans architectural masterplanning, sports infrastructure, and refined residential and commercial interiors. Based in London, we collaborate with clients worldwide to create enduring, transformative spaces.',
      },
      {
        blockType: 'studioPillars',
        pillars: [
          {
            number: '01 / About us',
            title: 'About us',
            description:
              'Our experienced team brings together strong design expertise with extensive project management experience across commercial and high-end residential sectors. This combined knowledge allows us to approach each project with both creative clarity and technical precision.',
          },
        ],
      },
      {
        blockType: 'featuredProjects',
        tag: '02 / Architectural Commissions',
        title: 'Featured projects',
      },
      {
        blockType: 'journalFeed',
        tag: '04 / Insights & Essays',
        title: 'Journal',
      },
    ]

    await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        layout: updatedLayout as any,
      },
    })

    console.log('✅ Successfully updated Home Page with all 5 Archia section blocks!')
  }

  process.exit(0)
}

populateHomePage().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})

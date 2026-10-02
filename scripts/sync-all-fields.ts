import { getPayload } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import fs from 'fs'

import { Users } from '../src/collections/Users'
import { Media } from '../src/collections/Media'
import { Pages } from '../src/collections/Pages'
import { Projects } from '../src/collections/Projects'
import { Publications } from '../src/collections/Publications'
import { Members } from '../src/collections/Members'
import { ContactInfoItems } from '../src/collections/ContactInfoItems'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const RAILWAY_DB_URL = 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@sakura.proxy.rlwy.net:45248/railway'

const projectsPath = path.resolve(__dirname, '../../seidler-group-website/lib/projects-data.json')
const publicationsPath = path.resolve(__dirname, '../../seidler-group-website/lib/publications-data.json')

const rawProjects = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'))
const rawPublications = JSON.parse(fs.readFileSync(publicationsPath, 'utf-8'))

async function syncAllFields() {
  console.log('🔄 Initializing Payload with Railway PostgreSQL...')
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

  // 1. UPDATE ALL PROJECTS
  console.log(`\n📦 Updating ${rawProjects.length} Projects with full Directus metadata...`)
  for (const item of rawProjects) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]
      await payload.update({
        collection: 'projects',
        id: doc.id,
        data: {
          client: item.Client || null,
          location: item.Location || null,
          area: item.Area || null,
          year: item.Year ? Number(item.Year) : undefined,
          category: item.Category || null,
          website: item.Website || null,
          status: item.Status || null,
          budget: item.Budget ? String(item.Budget) : null,
          featured_archia: Boolean(item.Featured_Archia),
          featured_mp: Boolean(item.Featured_MP),
          sort: item.sort ? Number(item.sort) : undefined,
          seo: {
            page_title: item.SEO?.title || item.Name,
            meta_description: item.SEO?.meta_description || item.Description?.slice(0, 160) || '',
          },
        },
      })
      console.log(`  ✅ Updated project: ${item.Name} (SEO: ${item.SEO?.title ? 'Yes' : 'Auto'}, Client: ${item.Client || 'N/A'})`)
    }
  }

  // 2. UPDATE ALL PUBLICATIONS
  console.log(`\n📰 Updating ${rawPublications.length} Publications with full Directus metadata...`)
  for (const item of rawPublications) {
    const existing = await payload.find({
      collection: 'publications',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]
      await payload.update({
        collection: 'publications',
        id: doc.id,
        data: {
          website: item.Website || null,
          latest: Boolean(item.Latest),
          seo: {
            page_title: item.SEO?.title || item.Name,
            meta_description: item.SEO?.meta_description || '',
          },
        },
      })
      console.log(`  ✅ Updated publication: ${item.Name} (Latest: ${item.Latest ? 'Yes' : 'No'})`)
    }
  }

  // 3. SEED CONTACT INFO ITEMS
  console.log('\n📞 Seeding Contact Info Items...')
  const existingContacts = await payload.find({
    collection: 'contact_info_items',
    limit: 1,
  })

  if (existingContacts.docs.length === 0) {
    await payload.create({
      collection: 'contact_info_items',
      data: {
        contact_item_1_label: 'Social',
        contact_item_1_content: '[Instagram](https://www.instagram.com/archia_com/)\n[LinkedIn](https://www.linkedin.com/company/archiadesign/)',
        contact_item_2_label: 'Career',
        contact_item_2_content: '[info@archia.com](mailto:info@archia.com)',
        contact_item_3_label: 'London Office',
        contact_item_3_content: '167-169 Great Portland Street, \n5th Floor, London UK, \nW1W 5PF\n',
        contact_item_4_label: 'Dubai Office',
        contact_item_4_content: 'Dubai Marina, UAE',
      },
    })
    console.log('  ✅ Created Contact Info Item with authentic data.')
  } else {
    console.log('  ℹ️ Contact info items already exist.')
  }

  console.log('\n🎉 ALL DIRECTUS FIELDS SYNCHRONIZED SUCCESSFULLY!')
  process.exit(0)
}

syncAllFields().catch((err) => {
  console.error('❌ Error during sync:', err)
  process.exit(1)
})

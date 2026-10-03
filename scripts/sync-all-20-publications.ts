import { getPayload } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from '../src/collections/Users'
import { Media } from '../src/collections/Media'
import { Pages } from '../src/collections/Pages'
import { Projects } from '../src/collections/Projects'
import { Publications } from '../src/collections/Publications'
import { Members } from '../src/collections/Members'
import { ContactInfoItems } from '../src/collections/ContactInfoItems'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DIRECTUS_URL = 'https://directus-production-6feb.up.railway.app'
const RAILWAY_DB_URL = 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@66.33.22.221:45248/railway'

function normalizeWebsite(website: string | undefined | null): 'None' | 'Archia' | 'Magnum Projects' | 'DF' | 'All' {
  if (!website) return 'Archia'
  const lower = website.toLowerCase()
  if (lower === 'mp' || lower.includes('magnum')) return 'Magnum Projects'
  if (lower === 'archia') return 'Archia'
  if (lower === 'df') return 'DF'
  if (lower === 'all') return 'All'
  return 'Archia'
}

async function downloadFile(directusFileId: string): Promise<{ buffer: Buffer; filename: string; mimetype: string } | null> {
  try {
    const url = `${DIRECTUS_URL}/assets/${directusFileId}?width=1600`
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`Failed to fetch file ${directusFileId}: status ${res.status}`)
      return null
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const contentDisposition = res.headers.get('content-disposition') || ''
    let filename = `${directusFileId}.jpg`
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1]
    }

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return { buffer, filename, mimetype: contentType }
  } catch (err) {
    console.error(`Error downloading file ${directusFileId}:`, err)
    return null
  }
}

async function run() {
  console.log('Fetching all publications from Directus...')
  const directusRes = await fetch(`${DIRECTUS_URL}/items/Publications?limit=-1`)
  const directusJson = await directusRes.json()
  const directusPubs = directusJson.data || []
  console.log(`Found ${directusPubs.length} publications in Directus.\n`)

  // Save full snapshot to seidler-group-website/lib/publications-data.json
  const publicationsJsonPath = path.resolve(__dirname, '../../seidler-group-website/lib/publications-data.json')
  fs.writeFileSync(publicationsJsonPath, JSON.stringify(directusPubs, null, 2), 'utf-8')
  console.log(`✅ Saved all ${directusPubs.length} publications to publications-data.json`)

  console.log('🚀 Initializing Payload...')
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
  console.log('✅ Payload connected to PostgreSQL.\n')

  const mediaCache = new Map<string, number | string>()

  async function getOrCreateMedia(directusId: string): Promise<number | string | null> {
    if (mediaCache.has(directusId)) return mediaCache.get(directusId)!

    const existing = await payload.find({
      collection: 'media',
      where: { alt: { equals: directusId } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      mediaCache.set(directusId, existing.docs[0].id)
      return existing.docs[0].id
    }

    const file = await downloadFile(directusId)
    if (!file) return null

    try {
      const created = await payload.create({
        collection: 'media',
        data: { alt: directusId },
        file: {
          data: file.buffer,
          name: file.filename,
          mimetype: file.mimetype,
          size: file.buffer.length,
        },
      })
      mediaCache.set(directusId, created.id)
      return created.id
    } catch (e: any) {
      console.warn(`Media creation error for ${directusId}:`, e.message)
      return null
    }
  }

  console.log(`--- SYNCING ALL ${directusPubs.length} PUBLICATIONS ---`)
  for (let i = 0; i < directusPubs.length; i++) {
    const item = directusPubs[i]
    console.log(`[${i + 1}/${directusPubs.length}] Processing "${item.Name}" (Directus ID: ${item.id})...`)

    let coverMediaId: number | string | undefined = undefined
    if (item.Cover_Image) {
      const mediaId = await getOrCreateMedia(item.Cover_Image)
      if (mediaId) coverMediaId = mediaId
    }

    let seoImageId: number | string | undefined = undefined
    if (item.SEO?.og_image) {
      const mediaId = await getOrCreateMedia(item.SEO.og_image)
      if (mediaId) seoImageId = mediaId
    }

    const websiteVal = normalizeWebsite(item.Website)
    const isLatest = String(item.Latest).toLowerCase() === 'yes' || item.Latest === true

    // Check if publication already exists by slug or directusId
    const existing = await payload.find({
      collection: 'publications',
      where: {
        or: [
          { slug: { equals: item.slug } },
          { directusId: { equals: item.id } },
        ],
      },
      limit: 1,
    })

    const pubData: any = {
      name: item.Name || 'Untitled Publication',
      slug: item.slug || `pub-${item.id}`,
      date: item.Date ? new Date(item.Date).toISOString() : undefined,
      body: item.Body || undefined,
      coverImage: coverMediaId as any,
      directusId: item.id,
      website: websiteVal,
      latest: isLatest,
      seo: {
        page_title: item.SEO?.title || undefined,
        meta_description: item.SEO?.meta_description || undefined,
        social_image: seoImageId as any,
      },
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'publications',
        id: existing.docs[0].id,
        data: pubData,
      })
      console.log(`  🔄 Updated publication (Payload ID: ${existing.docs[0].id})`)
    } else {
      const created = await payload.create({
        collection: 'publications',
        data: pubData,
      })
      console.log(`  ✨ Created publication (Payload ID: ${created.id})`)
    }
  }

  const finalCheck = await payload.find({
    collection: 'publications',
    limit: 100,
  })
  console.log(`\n🎉 DONE! Payload now has ${finalCheck.totalDocs} publications!`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Fatal sync error:', err)
  process.exit(1)
})

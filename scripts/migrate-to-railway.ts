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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const RAILWAY_DB_URL = 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@sakura.proxy.rlwy.net:45248/railway'
const DIRECTUS_URL = 'https://directus-production-6feb.up.railway.app'

const projectsPath = path.resolve(__dirname, '../../seidler-group-website/lib/projects-data.json')
const publicationsPath = path.resolve(__dirname, '../../seidler-group-website/lib/publications-data.json')

const rawProjects = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'))
const rawPublications = JSON.parse(fs.readFileSync(publicationsPath, 'utf-8'))

async function downloadFile(directusFileId: string): Promise<{ buffer: Buffer; filename: string; mimetype: string } | null> {
  try {
    const url = `${DIRECTUS_URL}/assets/${directusFileId}?width=1600`
    const res = await fetch(url)
    if (!res.ok) return null

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
    return null
  }
}

async function run() {
  console.log('🚀 Connecting Payload directly to Railway PostgreSQL...')

  const config = buildConfig({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: path.resolve(__dirname, '../src'),
      },
    },
    collections: [Users, Media, Pages, Projects, Publications],
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
  console.log('✅ Connected to Railway PostgreSQL successfully!\n')

  // Check if admin user exists, create if not
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs === 0) {
    console.log('👤 Creating default admin user (admin@archia.com / password123)...')
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@archia.com',
        password: 'password123',
      },
    })
    console.log('✅ Admin user created!')
  }

  const mediaCache = new Map<string, number | string>()

  async function getOrCreateMedia(directusId: string): Promise<number | string | null> {
    if (mediaCache.has(directusId)) {
      return mediaCache.get(directusId)!
    }

    const existing = await payload.find({
      collection: 'media',
      where: { alt: { equals: directusId } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      mediaCache.set(directusId, existing.docs[0].id)
      return existing.docs[0].id
    }

    console.log(`  📥 Downloading image ${directusId}...`)
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
    } catch {
      return null
    }
  }

  // 1. MIGRATE PROJECTS
  console.log(`\n📦 --- MIGRATING ${rawProjects.length} PROJECTS TO RAILWAY ---`)
  for (let i = 0; i < rawProjects.length; i++) {
    const item = rawProjects[i]
    console.log(`[${i + 1}/${rawProjects.length}] Project: ${item.Name} (${item.slug})`)

    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ℹ️ Already exists on Railway, skipping.`)
      continue
    }

    const imagesToUpload = (item.Images || []).slice(0, 3)
    const galleryItems: { image: number | string }[] = []

    for (const img of imagesToUpload) {
      if (img.directus_files_id) {
        const mediaId = await getOrCreateMedia(img.directus_files_id)
        if (mediaId) galleryItems.push({ image: mediaId })
      }
    }

    const newProject = await payload.create({
      collection: 'projects',
      data: {
        name: item.Name || 'Untitled Project',
        slug: item.slug || `project-${item.id}`,
        year: item.Year ? Number(item.Year) : undefined,
        category: item.Category || undefined,
        location: item.Location || undefined,
        description: item.Description || undefined,
        directusId: item.id,
        gallery: galleryItems,
      },
    })
    console.log(`  ✨ Migrated! Railway ID: ${newProject.id}`)
  }

  // 2. MIGRATE PUBLICATIONS
  console.log(`\n📰 --- MIGRATING ${rawPublications.length} PUBLICATIONS TO RAILWAY ---`)
  for (let i = 0; i < rawPublications.length; i++) {
    const item = rawPublications[i]
    console.log(`[${i + 1}/${rawPublications.length}] Publication: ${item.Name}`)

    const existing = await payload.find({
      collection: 'publications',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ℹ️ Already exists on Railway, skipping.`)
      continue
    }

    let coverMediaId: number | string | undefined = undefined
    if (item.Cover_Image) {
      const mediaId = await getOrCreateMedia(item.Cover_Image)
      if (mediaId) coverMediaId = mediaId
    }

    const newPub = await payload.create({
      collection: 'publications',
      data: {
        name: item.Name || 'Untitled Publication',
        slug: item.slug || `pub-${item.id}`,
        date: item.Date ? new Date(item.Date).toISOString() : undefined,
        body: item.Body || undefined,
        coverImage: coverMediaId,
        directusId: item.id,
      },
    })
    console.log(`  ✨ Migrated! Railway ID: ${newPub.id}`)
  }

  console.log('\n🎉 ALL ARCHIA DATA SUCCESSFULLY MIGRATED TO RAILWAY POSTGRESQL!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Fatal migration error:', err)
  process.exit(1)
})

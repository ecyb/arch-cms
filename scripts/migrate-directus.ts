import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DIRECTUS_URL = 'https://directus-production-6feb.up.railway.app'

// Load cached JSON snapshots
const projectsPath = path.resolve(__dirname, '../../seidler-group-website/lib/projects-data.json')
const publicationsPath = path.resolve(__dirname, '../../seidler-group-website/lib/publications-data.json')

const rawProjects = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'))
const rawPublications = JSON.parse(fs.readFileSync(publicationsPath, 'utf-8'))

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
  console.log('🚀 Initializing Payload...')
  const payload = await getPayload({ config })
  console.log('✅ Payload ready. Beginning migration from Directus...\n')

  const mediaCache = new Map<string, number | string>()

  // Helper to get or upload media
  async function getOrCreateMedia(directusId: string, altText: string): Promise<number | string | null> {
    if (mediaCache.has(directusId)) {
      return mediaCache.get(directusId)!
    }

    // Check if media already exists in Payload
    const existing = await payload.find({
      collection: 'media',
      where: {
        alt: { equals: directusId },
      },
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
        data: {
          alt: directusId,
        },
        file: {
          data: file.buffer,
          name: file.filename,
          mimetype: file.mimetype,
          size: file.buffer.length,
        },
      })
      mediaCache.set(directusId, created.id)
      return created.id
    } catch (uploadErr) {
      console.error(`  ❌ Failed to save media ${directusId}:`, uploadErr)
      return null
    }
  }

  // 1. MIGRATE PROJECTS
  console.log(`📦 --- MIGRATING ${rawProjects.length} PROJECTS ---`)
  for (let i = 0; i < rawProjects.length; i++) {
    const item = rawProjects[i]
    console.log(`\n[${i + 1}/${rawProjects.length}] Processing project: ${item.Name} (${item.slug})`)

    const existing = await payload.find({
      collection: 'projects',
      where: {
        slug: { equals: item.slug },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ℹ️ Project already exists in Payload (id: ${existing.docs[0].id}), skipping.`)
      continue
    }

    // Process first 3 gallery images per project for high-speed initial migration
    const imagesToUpload = (item.Images || []).slice(0, 3)
    const galleryItems: { image: number | string }[] = []

    for (const img of imagesToUpload) {
      if (img.directus_files_id) {
        const mediaId = await getOrCreateMedia(img.directus_files_id, item.Name)
        if (mediaId) {
          galleryItems.push({ image: mediaId })
        }
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

    console.log(`  ✨ Successfully migrated project! Payload ID: ${newProject.id}`)
  }

  // 2. MIGRATE PUBLICATIONS
  console.log(`\n📰 --- MIGRATING ${rawPublications.length} PUBLICATIONS ---`)
  for (let i = 0; i < rawPublications.length; i++) {
    const item = rawPublications[i]
    console.log(`\n[${i + 1}/${rawPublications.length}] Processing publication: ${item.Name} (${item.slug})`)

    const existing = await payload.find({
      collection: 'publications',
      where: {
        slug: { equals: item.slug },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ℹ️ Publication already exists in Payload (id: ${existing.docs[0].id}), skipping.`)
      continue
    }

    let coverMediaId: number | string | undefined = undefined
    if (item.Cover_Image) {
      const mediaId = await getOrCreateMedia(item.Cover_Image, item.Name)
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

    console.log(`  ✨ Successfully migrated publication! Payload ID: ${newPub.id}`)
  }

  console.log('\n🎉 ALL DATA MIGRATION FINISHED SUCCESSFULLY!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Fatal migration error:', err)
  process.exit(1)
})

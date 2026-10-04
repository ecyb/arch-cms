import pg from 'pg'
import fs from 'fs'

const DB_URL =
  process.env.DATABASE_URI ||
  process.env.DATABASE_URL ||
  'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@66.33.22.221:45248/railway'

const client = new pg.Client({ connectionString: DB_URL })

const DF_PROJECT_DEFS = [
  { name: 'Prince of Wales Terrace', slug: 'prince-of-wales', category: 'Interior', location: 'London, UK' },
  { name: 'Dubai Penthouse', slug: 'dubai-penthouse', category: 'Interior', location: 'Dubai, UAE' },
  { name: 'Kensington Residence', slug: 'kensington-residence', category: 'Interior', location: 'London, UK' },
  { name: 'Felden Street', slug: 'felden-street', category: 'Interior', location: 'Fulham, London' },
  { name: 'Xatai Residence', slug: 'xatai-residence', category: 'Interior', location: 'Baku, Azerbaijan' },
  { name: 'House in Fulham', slug: 'house-fulham', category: 'Interior', location: 'London, UK' },
  { name: 'Olympus Residence', slug: 'olympus-residence', category: 'Interior', location: 'Baku, Azerbaijan' },
  { name: 'Bahar Residence', slug: 'bahar-residence', category: 'Interior', location: 'Baku, Azerbaijan' },
  { name: 'Spa & Treatment Centre', slug: 'spa-treatment-centre', category: 'Interior', location: 'London, UK' },
  { name: 'North Gate Residence', slug: 'north-gate-residence', category: 'Architecture', location: 'London, UK' },
  { name: 'Square House', slug: 'square-house', category: 'Architecture', location: 'Surrey, UK' },
]

async function seed() {
  await client.connect()
  console.log('Connected to DB!')

  // 1. Seed DF Projects
  for (const def of DF_PROJECT_DEFS) {
    const existing = await client.query('SELECT id FROM df_projects WHERE slug = $1', [def.slug])
    if (existing.rows.length === 0) {
      // Find data from projects table if available
      const orig = await client.query(
        'SELECT description, client, location, area, year FROM projects WHERE slug = $1',
        [def.slug]
      )
      const src = orig.rows[0] || {}

      await client.query(
        `INSERT INTO df_projects 
         (name, slug, description, client, location, area, year, category, cover_image_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [
          def.name,
          def.slug,
          src.description || `${def.name} bespoke architectural design by Davud Farzulla.`,
          src.client || 'Private Client',
          src.location || def.location,
          src.area || null,
          src.year || 2024,
          def.category,
          src.cover_image_id || src.hero_image_id || null,
        ]
      )
      console.log(`Created DF Project: ${def.name} (${def.category})`)
    } else {
      console.log(`DF Project already exists: ${def.name}`)
    }
  }

  // 2. Seed DF Publications / News
  const newsPath =
    '/Users/eldar/Documents/WEB/CLIENTS/Vincent/ai-website-cloner-template-master/src/data/sites/vincentvanduysen-com-83e9ed5e/news.json'
  if (fs.existsSync(newsPath)) {
    const newsItems = JSON.parse(fs.readFileSync(newsPath, 'utf8'))
    for (const item of newsItems.slice(0, 10)) {
      const slug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const existing = await client.query('SELECT id FROM df_publications WHERE slug = $1', [slug])
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO df_publications 
           (name, slug, date, latest, subtitle, body, created_at, updated_at)
           VALUES ($1, $2, NOW(), false, $3, $4, NOW(), NOW())`,
          [
            item.title,
            slug,
            item.subtitle || null,
            item.subtitle ? `${item.subtitle}\n\nPublished in Davud Farzulla studio archive.` : 'Editorial publication.',
          ]
        )
        console.log(`Created DF Publication: ${item.title}`)
      }
    }
  }

  const projCount = await client.query('SELECT COUNT(*) FROM df_projects')
  const pubCount = await client.query('SELECT COUNT(*) FROM df_publications')
  console.log(`\n✅ Finished: ${projCount.rows[0].count} DF Projects, ${pubCount.rows[0].count} DF Publications`)

  await client.end()
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seeding error:', err)
  process.exit(1)
})

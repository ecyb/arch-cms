// Adds the SEO columns used by src/fields/seo.ts to the live Postgres DB.
// The Payload config uses `push: false`, so schema changes must be applied manually.
// Idempotent (IF NOT EXISTS) - safe to run more than once.
//   DATABASE_URI=postgres://... node scripts/add-seo-columns.mjs
import pg from 'pg'

// table -> [group prefix, title col, description col]
const tables = {
  pages: ['seo', 'page_title', 'meta_description'],
  df_pages: ['seo', 'page_title', 'meta_description'],
  mp_pages: ['meta', 'title', 'description'],
  projects: ['seo', 'page_title', 'meta_description'],
  df_projects: ['seo', 'title', 'description'],
  mp_projects: ['seo', 'page_title', 'meta_description'],
  publications: ['seo', 'page_title', 'meta_description'],
  df_publications: ['seo', 'page_title', 'meta_description'],
  mp_publications: ['seo', 'page_title', 'meta_description'],
}

const uri = process.env.DATABASE_URI || process.env.DATABASE_URL
if (!uri) throw new Error('Set DATABASE_URI')
const client = new pg.Client({ connectionString: uri })
await client.connect()
for (const [t, [g, title, desc]] of Object.entries(tables)) {
  const stmts = [
    `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "${g}_${title}" varchar`,
    `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "${g}_${desc}" varchar`,
    `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "${g}_social_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL`,
    `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "${g}_canonical_url" varchar`,
    `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "${g}_no_index" boolean DEFAULT false`,
  ]
  for (const s of stmts) await client.query(s)
  console.log('ok', t)
}
await client.end()

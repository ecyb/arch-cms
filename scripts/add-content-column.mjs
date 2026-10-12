// Adds the rich text `content` column to the three publication tables. Idempotent.
import 'dotenv/config'
import pg from 'pg'
const c = new pg.Client({ connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL })
await c.connect()
for (const t of ['publications', 'df_publications', 'mp_publications']) {
  await c.query(`alter table "${t}" add column if not exists "content" jsonb`)
  console.log('ok', t)
}
await c.end()

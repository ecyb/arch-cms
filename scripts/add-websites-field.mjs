// Converts the old single `website` select into the multi-select `websites` field.
//   node scripts/add-websites-field.mjs        (reads DATABASE_URI from .env)
// Idempotent. The old `website` column is left in place (unused) as a safety net.
import 'dotenv/config'
import pg from 'pg'

const tables = ['projects', 'publications', 'df_projects', 'df_publications', 'mp_projects', 'mp_publications']
const SITES = ['Archia', 'Magnum Projects', 'DF']

const c = new pg.Client({ connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  for (const t of tables) {
    const en = `enum_${t}_websites`
    const tbl = `${t}_websites`
    await c.query(`do $$ begin create type "${en}" as enum (${SITES.map((s) => `'${s}'`).join(',')}); exception when duplicate_object then null; end $$`)
    await c.query(`create table if not exists "${tbl}" (
      "order" integer not null,
      "parent_id" integer not null references "${t}"("id") on delete cascade,
      "value" "${en}",
      "id" serial primary key
    )`)
    await c.query(`create index if not exists "${tbl}_order_idx" on "${tbl}" ("order")`)
    await c.query(`create index if not exists "${tbl}_parent_idx" on "${tbl}" ("parent_id")`)

    const already = (await c.query(`select count(*)::int n from "${tbl}"`)).rows[0].n
    if (already === 0) {
      // old value -> list of sites: All -> every site, None -> nothing
      await c.query(`
        insert into "${tbl}" ("order", "parent_id", "value")
        select s.ord, p.id, s.site::"${en}"
        from "${t}" p
        cross join lateral (
          select row_number() over () as ord, site from unnest(
            case p.website::text
              when 'All' then array['Archia','Magnum Projects','DF']
              when 'None' then array[]::text[]
              when 'Magnum Projects' then array['Magnum Projects']
              when 'DF' then array['DF']
              else array['Archia']
            end) as site
        ) s`)
    }
    const r = await c.query(`select count(*)::int n from "${tbl}"`)
    console.log(t, '->', r.rows[0].n, 'site assignments')
  }
  await c.query('commit')
} catch (e) {
  await c.query('rollback')
  console.error('Rolled back:', e.message)
  process.exit(1)
}
await c.end()

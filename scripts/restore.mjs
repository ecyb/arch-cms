// Restores a backup made by backup.mjs. DESTRUCTIVE: replaces table contents.
//   node scripts/restore.mjs backups/<timestamp> --yes [table1 table2 ...]
import 'dotenv/config'
import pg from 'pg'
import fs from 'fs'
import path from 'path'

const [dir, ...rest] = process.argv.slice(2)
if (!dir || !rest.includes('--yes')) { console.log('Usage: node scripts/restore.mjs backups/<timestamp> --yes [tables...]'); process.exit(1) }
const only = rest.filter((a) => a !== '--yes')
const files = fs.readdirSync(path.join(dir, 'db')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5))
const tables = only.length ? files.filter((t) => only.includes(t)) : files

const c = new pg.Client({ connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  await c.query(`set local session_replication_role = replica`) // skip FK checks during load
  for (const t of tables) {
    const rows = JSON.parse(fs.readFileSync(path.join(dir, 'db', `${t}.json`), 'utf8'))
    await c.query(`truncate "${t}" cascade`)
    if (rows.length) await c.query(`insert into "${t}" select * from json_populate_recordset(null::"${t}", $1::json)`, [JSON.stringify(rows)])
    console.log('restored', t, rows.length)
  }
  await c.query('commit')
} catch (e) { await c.query('rollback'); console.error('Rolled back:', e.message); process.exit(1) }
await c.end()

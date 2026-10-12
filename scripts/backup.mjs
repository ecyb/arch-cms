// Full backup: every table in the database -> JSON, plus a zip of the source code.
//   node scripts/backup.mjs
// Output: backups/<timestamp>/db/*.json, backups/<timestamp>/code.zip
import 'dotenv/config'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const uri = process.env.DATABASE_URI || process.env.DATABASE_URL
if (!uri) throw new Error('DATABASE_URI missing in .env')

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const dir = path.join('backups', stamp)
fs.mkdirSync(path.join(dir, 'db'), { recursive: true })

const c = new pg.Client({ connectionString: uri })
await c.connect()
const { rows: tables } = await c.query(
  `select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE' order by 1`,
)
const manifest = {}
for (const { table_name: t } of tables) {
  const { rows } = await c.query(`select * from "${t}"`)
  fs.writeFileSync(path.join(dir, 'db', `${t}.json`), JSON.stringify(rows))
  manifest[t] = rows.length
  console.log(String(rows.length).padStart(6), t)
}
await c.end()
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ createdAt: new Date().toISOString(), tables: manifest }, null, 2))

try {
  execSync(`zip -rq - . -x "node_modules/*" ".next/*" "backups/*" ".git/*" > "${dir}/code.zip"`, { shell: "/bin/bash" })
} catch { console.log('zip not available, skipped code zip') }
console.log('\nBackup saved to', dir)

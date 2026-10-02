import pg from 'pg'

const client = new pg.Client({
  connectionString: 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@sakura.proxy.rlwy.net:45248/railway',
})

async function run() {
  await client.connect()
  const res = await client.query('SELECT id, email, salt, hash FROM users')
  console.log('Users in Railway DB:', res.rows)
  const tables = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
  console.log('Public tables:', tables.rows.map((r) => r.tablename))
  await client.end()
}

run().catch(console.error)

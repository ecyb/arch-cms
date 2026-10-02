import pg from 'pg'

const client = new pg.Client({
  connectionString: 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@sakura.proxy.rlwy.net:45248/railway',
})

async function run() {
  await client.connect()
  const res = await client.query('DELETE FROM users')
  console.log('Cleared users table, deleted:', res.rowCount)
  await client.end()
}

run().catch(console.error)

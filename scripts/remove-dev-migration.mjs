import pg from 'pg'

const client = new pg.Client({
  connectionString: 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@sakura.proxy.rlwy.net:45248/railway',
})

async function run() {
  await client.connect()
  const res = await client.query("DELETE FROM payload_migrations WHERE name = 'dev'")
  console.log('Deleted dev record from payload_migrations, count:', res.rowCount)
  await client.end()
}

run().catch(console.error)

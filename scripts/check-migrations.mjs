import pg from 'pg'

const client = new pg.Client({
  connectionString: 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@sakura.proxy.rlwy.net:45248/railway',
})

async function run() {
  await client.connect()
  const res = await client.query('SELECT * FROM payload_migrations').catch((e) => ({ rows: e.message }))
  console.log('payload_migrations:', res.rows)
  const drizzle = await client.query('SELECT * FROM "__drizzle_migrations"').catch((e) => ({ rows: e.message }))
  console.log('drizzle_migrations:', drizzle.rows)
  await client.end()
}

run().catch(console.error)

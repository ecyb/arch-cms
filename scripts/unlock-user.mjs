import pg from 'pg'

const client = new pg.Client({
  connectionString: 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@sakura.proxy.rlwy.net:45248/railway',
})

async function run() {
  await client.connect()
  const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'")
  console.log('Columns in users:', cols.rows.map(r => r.column_name))
  
  // Reset lock and login attempts
  await client.query(`
    UPDATE users 
    SET "loginAttempts" = 0, "lockUntil" = NULL
  `).catch(async () => {
    await client.query(`
      UPDATE users 
      SET login_attempts = 0, lock_until = NULL
    `)
  })
  
  const user = await client.query('SELECT id, email, "loginAttempts", "lockUntil" FROM users')
  console.log('Updated user:', user.rows)
  await client.end()
}

run().catch(console.error)

import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  console.log('Initializing payload...')
  const payload = await getPayload({ config })
  console.log('Payload initialized!')
  const users = await payload.find({ collection: 'users' })
  console.log('Users count:', users.totalDocs)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

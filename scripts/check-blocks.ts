import { getPayload } from 'payload'
import { createClientBlocks } from 'payload'
import config from '../src/payload.config'

async function check() {
  const payload = await getPayload({ config })
  const pagesCollection = payload.config.collections.find((c) => c.slug === 'pages')!
  const layoutField: any = pagesCollection.fields.find((f: any) => f.name === 'layout')!
  const clientBlocks = createClientBlocks({
    blocks: layoutField.blocks,
    defaultIDType: 'text',
    i18n: {} as any,
    importMap: {},
  })
  console.log('Client block[0]:', JSON.stringify(clientBlocks[0], null, 2))
  process.exit(0)
}

check().catch(console.error)

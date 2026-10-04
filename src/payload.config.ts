import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { UserTypes } from './collections/UserTypes'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { DFPages } from './collections/DFPages'
import { DFProjects } from './collections/DFProjects'
import { DFPublications } from './collections/DFPublications'
import { Projects } from './collections/Projects'
import { Publications } from './collections/Publications'
import { Members } from './collections/Members'
import { ContactInfoItems } from './collections/ContactInfoItems'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const rawDbUri =
  process.env.DATABASE_URI ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  ''

const dbUri = rawDbUri.startsWith('postgres')
  ? rawDbUri
  : 'postgresql://postgres:ZvklpXUioEItvGdWTQGPGzASFtrLganU@sakura.proxy.rlwy.net:45248/railway'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— ARCHIA Studio CMS',
      favicon: '/favicon.svg',
    },
    components: {
      graphics: {
        Logo: '/components/Logo#Logo',
        Icon: '/components/Icon#Icon',
      },
    },
  },
  collections: [
    Pages,
    Projects,
    Publications,
    DFPages,
    DFProjects,
    DFPublications,
    Media,
    Members,
    ContactInfoItems,
    Users,
    UserTypes,
  ],
  cors: ['*'],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'archia-payload-secret-key-987654321',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: dbUri,
    },
    push: true,
  }),
  sharp,
})

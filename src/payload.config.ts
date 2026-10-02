import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { Publications } from './collections/Publications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const dbUri = process.env.DATABASE_URI || process.env.DATABASE_URL || 'file:./payload.db'
const isPostgres = dbUri.startsWith('postgres')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Projects, Publications],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'archia-payload-secret-key-987654321',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: dbUri,
        },
      })
    : sqliteAdapter({
        client: {
          url: dbUri,
        },
      }),
  sharp,
})

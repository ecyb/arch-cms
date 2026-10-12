// One-time: fills the new rich text `content` field from each publication's existing HTML `body`.
// `body` itself is NOT touched (websites keep reading exactly what they read before).
//   JSDOM_PATH=/path/to/node_modules/jsdom npx tsx scripts/convert-body-to-editor.ts [--write]
// (needs jsdom: `npm i -D jsdom`, or set JSDOM_PATH)
import 'dotenv/config'
import { createRequire } from 'module'
import { getPayload, buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { editor } from '../src/fields/editor'
import { Users } from '../src/collections/Users'
import { UserTypes } from '../src/collections/UserTypes'
import { Media } from '../src/collections/Media'
import { Publications } from '../src/collections/Publications'
import { DFPublications } from '../src/collections/DFPublications'
import { MPPublications } from '../src/collections/MPPublications'

const { JSDOM } = createRequire(import.meta.url)(process.env.JSDOM_PATH || 'jsdom')
const write = process.argv.includes('--write')
const config = await buildConfig({
  collections: [Publications, DFPublications, MPPublications, Media, Users, UserTypes],
  editor,
  secret: 'x',
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI! }, push: false }),
})
const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })

for (const collection of ['publications', 'df-publications', 'mp-publications'] as const) {
  const { docs } = await payload.find({ collection, limit: 500, depth: 0, pagination: false })
  let n = 0
  for (const d of docs as any[]) {
    if (!d.body || d.content) continue
    // <img> tags become "Image (URL)" blocks; everything around them is converted normally
    const children: any[] = []
    for (const part of String(d.body).split(/(<img\b[^>]*>)/i)) {
      if (!part.trim()) continue
      const img = part.match(/^<img\b[^>]*>$/i)
      if (img) {
        const attr = (n: string) => (part.match(new RegExp(n + '="([^"]*)"', 'i')) || [])[1] || ''
        const dec = (v: string) => v.replace(/&amp;/g, '&').replace(/&quot;/g, '"')
        children.push({ type: 'block', version: 2, format: '', fields: { id: Math.random().toString(36).slice(2, 12), blockType: 'externalImage', url: dec(attr('src')), alt: dec(attr('alt')) } })
      } else {
        const state: any = convertHTMLToLexical({ editorConfig, html: part, JSDOM })
        for (const ch of state.root.children) {
          const empty = ch.type === 'paragraph' && (!ch.children || ch.children.length === 0)
          if (!empty) children.push(ch)
        }
      }
    }
    const content: any = { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } }
    n++
    if (write) await payload.update({ collection, id: d.id, data: { content } as any, depth: 0, context: { skipBodySync: true } })
  }
  console.log(collection, write ? 'converted' : 'would convert', n, 'of', docs.length)
}
process.exit(0)

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

/** Image that lives at a URL (the existing articles use images hosted on the old Directus server). */
export const externalImageBlock: Block = {
  slug: 'externalImage',
  labels: { singular: 'Image (URL)', plural: 'Images (URL)' },
  fields: [
    { name: 'url', type: 'text', required: true, label: 'Image URL' },
    { name: 'alt', type: 'text', label: 'Alt text' },
  ],
}

export const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: [externalImageBlock] })],
})

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Lexical -> HTML converters used to build the `body` string the websites render. */
export const htmlConverters = ({ defaultConverters }: { defaultConverters: any }) => ({
  ...defaultConverters,
  blocks: {
    externalImage: ({ node }: { node: any }) => `<img src="${esc(node.fields?.url)}" alt="${esc(node.fields?.alt)}">`,
  },
})

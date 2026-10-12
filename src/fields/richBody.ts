import type { CollectionBeforeChangeHook, Field } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { htmlConverters } from './editor'

/**
 * Article body: a real rich text editor (`content`) for editors, while the website
 * keeps reading the same HTML string field (`body`), which is generated automatically.
 */
export const richBodyFields = (): Field[] => [
  {
    name: 'content',
    type: 'richText',
    label: 'Body',
    admin: {
      description: 'Write the article here. Headings, bold, lists, links and images are supported.',
    },
  },
  {
    // Kept for the websites (they render this HTML). Filled in automatically from `content`.
    name: 'body',
    type: 'textarea',
    label: 'Body HTML (auto-generated)',
    admin: { hidden: true },
  },
]

export const syncBodyHtml: CollectionBeforeChangeHook = ({ data, originalDoc, context }) => {
  if (context?.skipBodySync) return data
  if (data?.content && JSON.stringify(data.content) !== JSON.stringify(originalDoc?.content)) {
    data.body = convertLexicalToHTML({ data: data.content, converters: htmlConverters as any, disableContainer: true })
  }
  return data
}

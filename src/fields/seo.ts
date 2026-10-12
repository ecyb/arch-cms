import type { Field, Tab } from 'payload'

/**
 * Shared SEO tab for every Pages / Projects / Publications collection.
 *
 * Field names default to the ones already used in the database
 * (seo.page_title, seo.meta_description, seo.social_image) so existing
 * content is preserved. Collections that historically used other names
 * (DF Projects: seo.title/description, MP Pages: meta.title/description)
 * pass `legacy` options so no data is lost.
 */
export type SeoOptions = {
  groupName?: string
  titleName?: string
  descriptionName?: string
  imageName?: string
}

export const seoTab = (o: SeoOptions = {}): Tab => {
  const { groupName = 'seo', titleName = 'page_title', descriptionName = 'meta_description', imageName = 'social_image' } = o

  return {
    label: 'SEO',
    description: 'Controls how this entry appears in Google results and when shared on social media.',
    fields: [
      {
        name: groupName,
        type: 'group',
        label: 'SEO Settings',
        fields: [
          {
            name: titleName,
            type: 'text',
            label: 'Meta Title',
            admin: {
              description: 'Shown as the clickable headline in search results. Ideal length 45-60 characters. Leave empty to fall back to the entry title.',
            },
          },
          {
            name: descriptionName,
            type: 'textarea',
            label: 'Meta Description',
            admin: {
              description: 'Search result snippet. Ideal length 130-160 characters. Leave empty to fall back to the entry description.',
            },
          },
          {
            name: imageName,
            type: 'upload',
            relationTo: 'media',
            label: 'Social Share Image (Open Graph / Twitter)',
            admin: {
              description: 'Recommended 1200 x 630 px. Leave empty to fall back to the cover / first image.',
            },
          },
          {
            type: 'row',
            fields: [
              {
                name: 'canonical_url',
                type: 'text',
                label: 'Canonical URL',
                admin: {
                  width: '70%',
                  description: 'Only set if this content is duplicated elsewhere. Must be a full URL (https://...).',
                },
                validate: (value: unknown) => {
                  if (!value) return true
                  try {
                    const u = new URL(String(value))
                    return u.protocol === 'https:' || u.protocol === 'http:' ? true : 'Must start with http(s)://'
                  } catch {
                    return 'Must be a full URL, e.g. https://example.com/page'
                  }
                },
              },
              {
                name: 'no_index',
                type: 'checkbox',
                label: 'Hide from search engines (noindex)',
                defaultValue: false,
                admin: { width: '30%' },
              },
            ],
          },
        ],
      },
    ],
  }
}

const isSidebar = (f: Field) => 'admin' in f && (f as any).admin?.position === 'sidebar'
const hasName = (f: Field, n: string) => 'name' in f && (f as any).name === n

/**
 * Restructures a collection's fields into `Content | SEO` tabs.
 * - Sidebar fields (slug, visibility, sort order...) stay in the sidebar.
 * - If the collection already has a tabs field, its legacy "SEO" tab is
 *   replaced by the shared one.
 * - A legacy top-level SEO group (e.g. MP Pages `meta`) is moved into the tab.
 */
export const withSeoTab = (fields: Field[], o: SeoOptions = {}): Field[] => {
  const groupName = o.groupName ?? 'seo'
  const rest = fields.filter((f) => !hasName(f, groupName))
  const existingTabs = rest.find((f) => f.type === 'tabs') as any

  if (existingTabs) {
    // Sidebar fields only render in the sidebar at the top level, so hoist them out of the tabs.
    const hoisted: Field[] = []
    const tabs = existingTabs.tabs
      .filter((t: any) => String(t.label).toLowerCase() !== 'seo')
      .map((t: any) => ({
        ...t,
        fields: t.fields.filter((f: Field) => (isSidebar(f) ? (hoisted.push(f), false) : true)),
      }))
    return [
      ...rest.map((f) => (f === existingTabs ? { ...existingTabs, tabs: [...tabs, seoTab(o)] } : f)),
      ...hoisted,
    ]
  }

  const sidebar = rest.filter(isSidebar)
  const main = rest.filter((f) => !isSidebar(f))
  return [{ type: 'tabs', tabs: [{ label: 'Content', fields: main }, seoTab(o)] }, ...sidebar]
}

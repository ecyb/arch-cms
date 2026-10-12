import type { Field } from 'payload'

export const WEBSITE_OPTIONS = [
  { label: 'Archia', value: 'Archia' },
  { label: 'Magnum Projects', value: 'Magnum Projects' },
  { label: 'Davud Farzulla', value: 'DF' },
] as const

export type WebsiteValue = (typeof WEBSITE_OPTIONS)[number]['value']

/**
 * Multi-select dropdown: choose one website, several, or none (hidden everywhere).
 * Replaces the old single `website` select (None / Archia / Magnum Projects / DF / All).
 */
export const websitesField = (defaultSite: WebsiteValue): Field => ({
  name: 'websites',
  type: 'select',
  hasMany: true,
  label: 'Show on Websites',
  defaultValue: [defaultSite],
  options: [...WEBSITE_OPTIONS],
  admin: {
    position: 'sidebar',
    description: 'Pick one or more websites this entry appears on. Leave empty to hide it everywhere.',
  },
})

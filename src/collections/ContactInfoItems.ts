import type { CollectionConfig } from 'payload'

export const ContactInfoItems: CollectionConfig = {
  slug: 'contact_info_items',
  labels: {
    singular: 'Contact Info Item',
    plural: 'Contact Info Items',
  },
  admin: {
    useAsTitle: 'contact_item_1_label',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'contact_item_1_label',
          type: 'text',
          label: 'Item 1 Label (e.g. Phone)',
          admin: { width: '50%' },
        },
        {
          name: 'contact_item_1_content',
          type: 'text',
          label: 'Item 1 Content',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contact_item_2_label',
          type: 'text',
          label: 'Item 2 Label (e.g. Email)',
          admin: { width: '50%' },
        },
        {
          name: 'contact_item_2_content',
          type: 'text',
          label: 'Item 2 Content',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contact_item_3_label',
          type: 'text',
          label: 'Item 3 Label (e.g. London Office)',
          admin: { width: '50%' },
        },
        {
          name: 'contact_item_3_content',
          type: 'text',
          label: 'Item 3 Content',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contact_item_4_label',
          type: 'text',
          label: 'Item 4 Label (e.g. Dubai Office)',
          admin: { width: '50%' },
        },
        {
          name: 'contact_item_4_content',
          type: 'text',
          label: 'Item 4 Content',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}

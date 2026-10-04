import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const UserTypes: CollectionConfig = {
  slug: 'user-types',
  labels: {
    singular: 'User Type',
    plural: 'User Types',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Administration',
    description: 'Create custom roles and manage granular permissions for studio team members.',
    hidden: ({ user }: any) => user?.role !== 'admin',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Role Title (e.g. Senior Copywriter, Junior Architect)',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique identifier, e.g. copywriter, project-reviewer',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description / Purpose',
    },
    {
      name: 'permissions',
      type: 'group',
      label: 'Granular Permissions',
      fields: [
        {
          name: 'managePages',
          type: 'checkbox',
          defaultValue: true,
          label: 'Can manage Site Pages',
        },
        {
          name: 'manageProjects',
          type: 'checkbox',
          defaultValue: true,
          label: 'Can manage Architectural Projects',
        },
        {
          name: 'managePublications',
          type: 'checkbox',
          defaultValue: true,
          label: 'Can manage Journal & Publications',
        },
        {
          name: 'manageMedia',
          type: 'checkbox',
          defaultValue: true,
          label: 'Can manage Media Library (Upload/Delete)',
        },
        {
          name: 'manageStudio',
          type: 'checkbox',
          defaultValue: false,
          label: 'Can manage Studio Team & Contact Details',
        },
      ],
    },
  ],
}

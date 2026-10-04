import type { Access } from 'payload'

export type PermissionKey =
  | 'managePages'
  | 'manageProjects'
  | 'managePublications'
  | 'manageMedia'
  | 'manageStudio'

export const isAdmin: Access = ({ req }) => {
  return (req.user as any)?.role === 'admin'
}

export const isModeratorOrAdmin: Access = ({ req }) => {
  const user = req.user as any
  if (!user) return false
  return user.role === 'admin' || user.role === 'moderator'
}

export const hasPermission = (permissionKey: PermissionKey): Access => {
  return async ({ req }) => {
    const user = req.user as any
    if (!user) return false

    // Admins and Moderators have full content permissions
    if (user.role === 'admin' || user.role === 'moderator') {
      return true
    }

    // Custom user types check granular permissions
    if (user.role === 'custom' && user.customType) {
      if (typeof user.customType === 'object' && user.customType?.permissions) {
        return Boolean(user.customType.permissions[permissionKey])
      }
      try {
        const typeDoc: any = await req.payload.findByID({
          collection: 'user-types' as any,
          id: typeof user.customType === 'object' ? user.customType.id : user.customType,
        })
        return Boolean(typeDoc?.permissions?.[permissionKey])
      } catch {
        return false
      }
    }

    return false
  }
}

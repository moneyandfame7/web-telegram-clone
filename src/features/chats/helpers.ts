import {AdminPermissions, ChatMember} from './types'

export function isAdminPermissionsChanged(
  member: ChatMember,
  rights: AdminPermissions
) {
  const {adminPermissions} = member

  if (!adminPermissions) return true

  return Object.keys(adminPermissions).some((key) => {
    const k = key as keyof AdminPermissions
    return adminPermissions[k] !== rights[k]
  })
}

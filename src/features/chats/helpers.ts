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

export function composeInviteLink(inviteLinkId: string): string {
  return `${window.location.host}/chat-invite/${inviteLinkId}`
}

export function sortByCreatedAtDesc<T extends {createdAt: string}>(
  array: T[]
): T[] {
  return [...array].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

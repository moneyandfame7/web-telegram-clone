import type {ChatColor} from '../../app/types'
import {User} from '../auth/types'
import {Message} from '../messages/types'

export interface Chat {
  id: string
  userId?: string
  type: ChatType
  color: ChatColor
  title: string
  description?: string
  membersCount?: number
  firstMessageSequenceId?: number
  lastMessage?: Message
  myLastReadMessageSequenceId?: number
  theirLastReadMessageSequenceId?: number
  unreadCount: number
  createdAt: Date
  privacyType: ChatPrivacyType
  adminPermissions?: AdminPermissions
  inviteLinkId?: string
  allowSavingContent: boolean
  isSavedMessages: boolean
  isPinned: boolean
  isMuted: boolean
  isArchived: boolean
  isOwner: boolean
}
export interface ChatDetails {
  chatId: string
  members: ChatMember[]
  adminIds: string[]
  kickedIds: string[]
}
export interface ChatInviteLink {
  id: string
  name?: string
  adminApproval: boolean
  limitUserCount?: number
  createdAt: string
  expiresAt?: string
  createdByUserId?: string
  joinedCount: number
}
export interface ChatInviteLinks {
  primary: ChatInviteLink
  additional: ChatInviteLink[]
}
export interface JoinedMemberViaLink {
  userId: string
  joinedAt: Date
}
export interface CreateChatInviteLinkParams {
  chatId: string
  name?: string
  adminApproval: boolean
  limitUserCount?: number
  expiresAt?: string
}
export interface ChatMember {
  userId: string
  chatId: string
  adminPermissions?: AdminPermissions
  isOwner: boolean
}

export interface GetChatsResult {
  chats: Chat[]
  users: User[]
}
export interface CreateChatParams {
  users: string[]
  title: string
  description?: string
  type: ChatType
}

export type ChatType = 'PRIVATE' | 'GROUP' | 'CHANNEL'

export type ChatPrivacyType = 'PRIVATE' | 'PUBLIC'

export interface AdminPermissions {
  changeInfo: boolean
  deleteMessages: boolean
  banUsers: boolean
  pinMessages: boolean
  addNewAdmins: boolean
  customTitle?: string
  promotedByUserId: string
}
export interface ChatInfoUpdateParams {
  chatId: string
  title?: string
  description?: string
}
export interface ChatPrivacyUpdateParams {
  chatId: string
  allowSavingContent?: boolean
  privacyType?: ChatPrivacyType
}
export type ChatUpdateResult = ChatInfoUpdateParams & ChatPrivacyUpdateParams
export interface UpdateAdminParams {
  chatId: string
  userId: string
  adminPermissions: AdminPermissions | undefined
}

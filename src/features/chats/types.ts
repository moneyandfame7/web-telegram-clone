import type {ChatColor} from '../../app/types'
import {User} from '../auth/types'
import {Message} from '../messages/types'

export interface Chat {
  id: string
  userId?: string
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
  adminPermissions?: AdminPermissions
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

export interface ChatMember {
  userId: string
  chatId: string
  adminPermissions?: AdminPermissions | null
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

export interface AdminPermissions {
  changeInfo: boolean
  deleteMessages: boolean
  banUsers: boolean
  pinMessages: boolean
  addNewAdmins: boolean
  customTitle?: string
  promotedByUserId: string
}
export interface UpdateAdminParams {
  chatId: string
  userId: string
  adminPermissions: AdminPermissions | null
}

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
  isSavedMessages: boolean
  isPinned: boolean
  isMuted: boolean
  isArchived: boolean
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

import type {ChatColor} from '../../app/types'

export interface SendMessageParams {
  text: string
  chatId: string
}

export interface Chat {
  id: string
  _realChatId: string
  userId?: string
  color: ChatColor
  title: string
  description?: string
  membersCount?: number
  createdAt: Date
}
export interface CreateChatParams {
  users: string[]
  title: string
  description?: string
  type: ChatType
}

export type ChatType = 'PRIVATE' | 'GROUP' | 'CHANNEL'

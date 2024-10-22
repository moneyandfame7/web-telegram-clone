import type {ChatColor} from '../../app/types'

export interface Chat {
  id: string

  color: ChatColor
  title: string
  description?: string
  createdAt: Date
}
export interface CreateChatPayload {
  users: string[]
  title: string
  description?: string
  type: ChatType
}

export type ChatType = 'PRIVATE' | 'GROUP' | 'CHANNEL'

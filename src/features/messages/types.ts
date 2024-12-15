export interface Message {
  id: string
  sequenceId: number
  chatId: string
  _realChatId: string
  senderId: string
  text?: string
  createdAt: Date
  editedAt?: Date

  isOutgoing: boolean
  isSilent: boolean

  /** client only props */
  isHighlighted?: boolean
}
export enum GetMessagesDirection {
  OLDER = 'OLDER',
  NEWER = 'NEWER',
  AROUND = 'AROUND',
}
export interface GetMessagesParams {
  chatId: string
  sequenceId?: number
  skipCursor?: boolean
  limit?: number
  direction?: GetMessagesDirection
}

export interface ReadHistoryParams {
  chatId: string
  maxId: number
}
export interface ReadMyHistoryResult {
  unreadCount: number
  chatId: string
  _realChatId: string
  maxId: number
}

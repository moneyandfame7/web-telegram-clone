import {Chat} from '../chats/types'

export interface Message {
  id: string
  sequenceId: number
  chatId: string
  senderId: string
  text?: string
  createdAt: string
  editedAt?: string

  replyInfo?: MessageReplyInfo
  forwardInfo?: MessageForwardInfo

  isOutgoing: boolean
  isSilent: boolean

  /** client only props */
  isHighlighted?: boolean
  deleteLocal?: boolean
}
export interface MessageReplyInfo {
  id: string
  sequenceId: number
  text?: string
  senderId: string
}
export type MessageForwardInfo = MessageReplyInfo & {
  fromChatId: string
}
export interface SendMessageParams {
  text: string
  chatId: string
  replyToMsgId?: string
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

  /** client only field */
  signal?: AbortSignal
}

export interface ReadHistoryParams {
  chatId: string
  maxId: number
}
export interface ReadMyHistoryResult {
  unreadCount: number
  chatId: string
  maxId: number
}
export interface EditMessageParams {
  id: string
  chatId: string
  text?: string
  editedAt?: string
}

export type UpdateMessageLocalParams = EditMessageParams & {
  deleteLocal?: boolean
}

export interface DeleteMessagesParams {
  chatId: string
  ids: string[]
  deleteForAll: boolean
}
export interface DeleteMessagesResult {
  requesterId: string
  chat: Chat
  ids: string[]
  deleteForAll: boolean
}

export interface ForwardMessagesParams {
  ids: string[]
  toChatId: string
  fromChatId: string
  noAuthor: boolean
}
export interface ForwardMessagesResult {
  chat: Chat
  messages: Message[]
}

export type EditMessageResult = EditMessageParams & {editedAt: string}

export interface ForwardMessages {
  fromChatId: string
  messageIds: string[]
  noAuthor: boolean
}

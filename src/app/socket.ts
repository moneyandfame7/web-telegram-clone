import {io, Socket} from 'socket.io-client'

import {
  DeleteMessagesParams,
  DeleteMessagesResult,
  EditMessageParams,
  EditMessageResult,
  ForwardMessagesParams,
  Message,
  ReadHistoryParams,
  ReadMyHistoryResult,
  SendMessageParams,
} from '../features/messages/types'

import type {
  Chat,
  ChatInfoUpdateParams,
  ChatPrivacyUpdateParams,
  ChatUpdateResult,
  CreateChatParams,
  UpdateAdminParams,
} from '../features/chats/types'

export interface ListenEvents {
  ['chat:created']: (chat: Chat) => void
  ['chat:updated']: (data: ChatUpdateResult) => void
  ['chat:info-updated']: (data: ChatInfoUpdateParams) => void
  ['chat:privacy-updated']: (data: ChatPrivacyUpdateParams) => void
  ['chat:admin-updated']: (data: UpdateAdminParams) => void
  ['auth:unauthorized']: () => void

  ['message:new']: (message: Message, chat: Chat) => void
  ['message:edited']: (data: EditMessageResult) => void
  ['message:deleted']: (data: DeleteMessagesResult) => void
  ['message:read-by-me']: (data: ReadMyHistoryResult) => void
  ['message:read-by-them']: (
    data: Omit<ReadMyHistoryResult, 'unreadCount'>
  ) => void

  exception: (error: Error) => void
}

type EventWithAck<Params, Result> = (
  params: Params,
  callback: (result: Result) => void
) => void
interface EmitEvents {
  'room:join': (room: string) => void

  /**
   * CHAT
   */
  'chat:create': EventWithAck<CreateChatParams, Chat>
  'chat:update-info': EventWithAck<ChatInfoUpdateParams, boolean>
  'chat:update-privacy': EventWithAck<ChatPrivacyUpdateParams, boolean>
  'chat:update-admin': EventWithAck<UpdateAdminParams, boolean>

  /**
   * MESSAGES
   */
  'message:send': EventWithAck<SendMessageParams, Message>
  'message:edit': EventWithAck<EditMessageParams, boolean>
  'message:delete': EventWithAck<DeleteMessagesParams, boolean>
  'message:forward': EventWithAck<ForwardMessagesParams, boolean>
  'message:read-history': EventWithAck<
    ReadHistoryParams,
    {newUnreadCount: number; chatId: string; maxId: number}
  >
}

export const socket: Socket<ListenEvents, EmitEvents> = io(
  import.meta.env.VITE_API_URL,
  {
    autoConnect: false,
  }
)

export const emitEventWithHandling = async <Params, Result>(
  event: keyof EmitEvents,
  params: Params
): Promise<Result> => {
  return new Promise((resolve, reject) => {
    const exceptionHandler = (error: Error) => {
      console.error(`[Socket Exception]:`, error)
      reject(error as Error)
    }

    socket.once('exception', exceptionHandler)

    // @ts-expect-error idk how to fix this error
    socket.emit(event, params, (response) => {
      resolve(response as Result)
    })
  })
}

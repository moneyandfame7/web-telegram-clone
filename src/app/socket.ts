import {io, Socket} from 'socket.io-client'

import {
  DeleteMessagesParams,
  DeleteMessagesResult,
  EditMessageParams,
  EditMessageResult,
  Message,
  ReadHistoryParams,
  ReadMyHistoryResult,
  SendMessageParams,
} from '../features/messages/types'

import type {Chat, CreateChatParams} from '../features/chats/types'

export interface ListenEvents {
  ['chat:created']: (chat: Chat) => void
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

  /**
   * MESSAGES
   */
  'message:send': EventWithAck<SendMessageParams, Message>
  'message:edit': EventWithAck<EditMessageParams, boolean>
  'message:delete': EventWithAck<DeleteMessagesParams, boolean>
  'message:read-history': EventWithAck<
    ReadHistoryParams,
    {newUnreadCount: number; chatId: string; maxId: number}
  >
}

export const socket: Socket<ListenEvents, EmitEvents> = io(
  'http://localhost:3000',
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

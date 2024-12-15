import {io, Socket} from 'socket.io-client'
import {
  Chat,
  CreateChatParams,
  SendMessageParams,
} from '../features/chats/types'
import {
  Message,
  ReadHistoryParams,
  ReadMyHistoryResult,
} from '../features/messages/types'

export interface ListenEvents {
  ['chat:created']: (chat: Chat) => void
  ['auth:unauthorized']: () => void
  ['onNewMessage']: (message: Message, chat: Chat) => void

  ['message:read-my']: (data: ReadMyHistoryResult) => void
  ['message:read-their']: (
    data: Omit<ReadMyHistoryResult, 'unreadCount'>
  ) => void

  exception: (data: any) => void
}

type EventWithAck<Params, Result> = (
  params: Params,
  callback: (result: Result) => void
) => void
interface EmitEvents {
  join: (room: string) => void

  /**
   * CHAT
   */
  createChat: EventWithAck<CreateChatParams, Chat>

  /**
   * MESSAGES
   */
  sendMessage: EventWithAck<SendMessageParams, Message>

  readHistory: EventWithAck<
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
      reject(error as Error) // Передаємо помилку в `catch` блоку
    }

    socket.once('exception', exceptionHandler)

    // @ts-expect-error idk how to fix this error
    socket.emit(event, params, (response) => {
      resolve(response as any)
    })
  })
}

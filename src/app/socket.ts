import {io, Socket} from 'socket.io-client'
import {Chat, CreateChatParams} from '../features/chats/types'

export interface ListenEvents {
  ['chat:created']: (chat: Chat) => void
  ['auth:unauthorized']: () => void
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
}

export const socket: Socket<ListenEvents, EmitEvents> = io(
  'http://localhost:3000',
  {
    autoConnect: false,
  }
)
export class WsException extends Error {
  private readonly error
  constructor(error: string | object) {
    super(error)
  }
  initMessage(): void
  getError(): string | object
}

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

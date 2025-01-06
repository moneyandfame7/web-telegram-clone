import {ListenEvents, socket} from '../../app/socket'
import {AppDispatch} from '../../app/store'
import {chatsActions} from './state'

export const createChatListeners = (dispatch: AppDispatch) => {
  const chatCreated: ListenEvents['chat:created'] = (chat) => {
    console.log(`New chat added: [${chat.id}]`)

    dispatch(chatsActions.addOne(chat))
    socket.emit('room:join', `chat-${chat.id}`)
  }

  return {
    subscribe() {
      socket.on('chat:created', chatCreated)
    },
    unsubscribe() {
      socket.off('chat:created', chatCreated)
    },
    listeners: {
      chatCreated,
    },
  }
}

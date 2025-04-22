import {ListenEvents, socket} from '../../app/socket'
import {AppDispatch} from '../../app/store'
import {chatsActions} from './state'

export const createChatListeners = (dispatch: AppDispatch) => {
  const chatCreated: ListenEvents['chat:created'] = (chat) => {
    console.log(`New chat added: [${chat.id}]`)

    dispatch(chatsActions.addOne(chat))
    // socket.emit('room:join', `chat-${chat.id}`)
  }

  const adminUpdated: ListenEvents['chat:admin-updated'] = (data) => {
    dispatch(
      chatsActions.updateChatMember({
        userId: data.userId,
        chatId: data.chatId,
        changes: {
          adminPermissions: data.adminPermissions,
        },
      })
    )

    // dispatch(chatsActions.updateOne({
    //   id:data.chatId
    // }))
  }

  return {
    subscribe() {
      socket.on('chat:created', chatCreated)
      socket.on('chat:admin-updated', adminUpdated)
    },
    unsubscribe() {
      socket.off('chat:created', chatCreated)
      socket.off('chat:admin-updated', adminUpdated)
    },
    listeners: {
      chatCreated,
    },
  }
}

import {ListenEvents, socket} from '../../app/socket'
import {AppDispatch, store} from '../../app/store'
import {createChatListeners} from '../chats/listeners'
import {chatsSelectors, chatsActions} from '../chats/state'
import {Chat} from '../chats/types'
import {messagesActions} from './state/messages-slice'

export const createMessageListeners = (
  dispatch: AppDispatch,
  chatListeners: ReturnType<typeof createChatListeners>['listeners']
) => {
  const newMessage: ListenEvents['onNewMessage'] = (message, chat) => {
    console.log(`New message ${message.id} in chat ${chat.id}`)

    const existingChat: Chat | undefined = chatsSelectors.selectById(
      store.getState(),
      chat.id
    )
    if (!existingChat) {
      chatListeners.chatCreated(chat)
    } else {
      dispatch(
        chatsActions.updateOne({
          id: chat.id,
          changes: {
            unreadCount: chat.unreadCount,
            lastMessage: chat.lastMessage,
          },
        })
      )
    }
    dispatch(messagesActions.addMessage({chatId: chat.id, message}))
  }

  const readByMe: ListenEvents['message:read-my'] = (data) => {
    console.log('Я ПРОЧИТАВ ЧИЇСЬ ПОВІДОМЛЕННЯ', data)

    dispatch(
      chatsActions.updateOne({
        id: data.chatId,
        changes: {
          myLastReadMessageSequenceId: data.maxId,
          unreadCount: data.unreadCount,
        },
      })
    )
  }

  const readByThem: ListenEvents['message:read-their'] = (data) => {
    console.log(
      `ХТОСЬ ПРОЧИТАВ ПОВІДОМЛЕННЯ В ЧАТІ! ${data.chatId}`,
      data.maxId
    )

    dispatch(
      chatsActions.updateOne({
        id: data.chatId,
        changes: {
          theirLastReadMessageSequenceId: data.maxId,
        },
      })
    )
  }

  return {
    subscribe() {
      socket.on('onNewMessage', newMessage)
      socket.on('message:read-my', readByMe)
      socket.on('message:read-their', readByThem)
    },
    unsubscribe() {
      socket.off('onNewMessage', newMessage)
      socket.off('message:read-my', readByMe)
      socket.off('message:read-their', readByThem)
    },
    listeners: {
      newMessage,
      readByMe,
      readByThem,
    },
  }
}

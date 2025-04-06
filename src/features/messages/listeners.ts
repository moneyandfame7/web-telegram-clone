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
  const newMessage: ListenEvents['message:new'] = (message, chat) => {
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

  const editedMessage: ListenEvents['message:edited'] = (data) => {
    dispatch(
      messagesActions.updateMessage({
        id: data.id,
        chatId: data.chatId,
        changes: {
          text: data.text,
          editedAt: data.editedAt,
        },
      })
    )
    const state = store.getState()
    const chat = chatsSelectors.selectById(state, data.chatId)

    if (chat.lastMessage?.id === data.id) {
      dispatch(
        chatsActions.updateLastMessage({
          id: chat.id,
          changes: {
            text: data.text,
            editedAt: data.editedAt,
          },
        })
      )
    }
  }

  const deletedMessages: ListenEvents['message:deleted'] = (data) => {
    const state = store.getState()
    const chat = chatsSelectors.selectById(state, data.chat.id)
    dispatch(
      messagesActions.removeManyMessages({chatId: data.chat.id, ids: data.ids})
    )

    if (
      data.chat.lastMessage &&
      data.chat.lastMessage?.id !== chat.lastMessage?.id
    ) {
      dispatch(
        chatsActions.updateLastMessage({
          id: chat.id,
          changes: data.chat.lastMessage,
        })
      )
    }
  }

  const readByMe: ListenEvents['message:read-by-me'] = (data) => {
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

  const readByThem: ListenEvents['message:read-by-them'] = (data) => {
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
      socket.on('message:new', newMessage)
      socket.on('message:edited', editedMessage)
      socket.on('message:deleted', deletedMessages)
      socket.on('message:read-by-me', readByMe)
      socket.on('message:read-by-them', readByThem)
    },
    unsubscribe() {
      socket.off('message:new', newMessage)
      socket.off('message:edited', editedMessage)
      socket.off('message:deleted', deletedMessages)
      socket.off('message:read-by-me', readByMe)
      socket.off('message:read-by-them', readByThem)
    },
    listeners: {
      newMessage,
      editedMessage,
      readByMe,
      readByThem,
    },
  }
}

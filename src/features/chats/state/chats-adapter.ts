import {createEntityAdapter} from '@reduxjs/toolkit'
import {Chat} from '../types'

const chatsSortComparer = (a: Chat, b: Chat) => {
  if (!a.lastMessage || !b.lastMessage) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }

  return (
    new Date(b.lastMessage.createdAt).getTime() -
    new Date(a.lastMessage?.createdAt).getTime()
  )
}

export const chatsAdapter = createEntityAdapter<Chat, string>({
  selectId: (chat) => chat.id,
  sortComparer: chatsSortComparer,
})

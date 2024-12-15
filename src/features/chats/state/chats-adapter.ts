import {createEntityAdapter} from '@reduxjs/toolkit'
import {Chat} from '../types'

export const chatsAdapter = createEntityAdapter<Chat, string>({
  selectId: (chat) => chat._realChatId,
  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
})

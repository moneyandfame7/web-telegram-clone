import {createEntityAdapter} from '@reduxjs/toolkit'
import {Chat} from '../types'

export const chatsAdapter = createEntityAdapter<Chat, string>({
  selectId: (chat) => chat.id,
  sortComparer: (a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
})

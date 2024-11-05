import {createEntityAdapter} from '@reduxjs/toolkit'
import {Message} from '../types'

export const messagesAdapter = createEntityAdapter<Message, string>({
  selectId: (message) => message.id,
  sortComparer: (a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
})

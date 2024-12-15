import {createEntityAdapter} from '@reduxjs/toolkit'
import {Message} from '../types'

export const messagesAdapter = createEntityAdapter<Message, string>({
  selectId: (message) => message.id,
  sortComparer: (a, b) => a.sequenceId - b.sequenceId,
})

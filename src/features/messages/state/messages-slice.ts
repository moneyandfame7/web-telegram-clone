import {createSlice, EntityState, PayloadAction} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import {Message} from '../types'
import {messagesAdapter} from './messages-adapter'

interface MessagesState {
  byChatId: Partial<Record<string, EntityState<Message, string>>>
}
const initialState: MessagesState = {
  byChatId: {},
}
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    /**
     * Додає повідомлення якщо такого ще немає
     */
    addMessage: (
      state,
      action: PayloadAction<{chatId: string; message: Message}>
    ) => {
      const {chatId, message} = action.payload

      if (!state.byChatId[chatId]) {
        state.byChatId[chatId] = messagesAdapter.getInitialState()
      }

      state.byChatId[chatId] = messagesAdapter.addOne(
        state.byChatId[chatId],
        message
      )
    },
    setMessages: (
      state,
      action: PayloadAction<{chatId: string; messages: Message[]}>
    ) => {
      const {chatId, messages} = action.payload

      if (!state.byChatId[chatId]) {
        state.byChatId[chatId] = messagesAdapter.getInitialState()
      }

      state.byChatId[chatId] = messagesAdapter.setAll(
        state.byChatId[chatId],
        messages
      )
    },
    editMessage: (
      state,
      action: PayloadAction<{
        chatId: string
        id: string
        changes: Partial<Message>
      }>
    ) => {
      const {chatId, id, changes} = action.payload

      if (state.byChatId[chatId]) {
        messagesAdapter.updateOne(state.byChatId[chatId], {id, changes})
      }
    },
    removeMessage: (
      state,
      action: PayloadAction<{chatId: string; id: string}>
    ) => {
      const {chatId, id} = action.payload

      if (state.byChatId[chatId]) {
        messagesAdapter.removeOne(state.byChatId[chatId], id)
      }
    },
  },
})

export const messagesActions = messagesSlice.actions
export const persistedMessagesReducer = persistReducer(
  {
    key: 'messages',
    storage: storage,
  },
  messagesSlice.reducer
)

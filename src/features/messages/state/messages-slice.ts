import {createSlice, EntityState, PayloadAction} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import {GetMessagesDirection, Message} from '../types'
import {messagesAdapter} from './messages-adapter'
import {messagesThunks} from '../api'
import {chatsThunks} from '../../chats/api'

interface MessagesList {
  data: EntityState<Message, string>
  isLoading: boolean
}
interface MessagesState {
  byChatId: Partial<Record<string, MessagesList>>
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
        state.byChatId[chatId] = {
          data: messagesAdapter.getInitialState(),
          isLoading: false,
        }
      }

      state.byChatId[chatId].data = messagesAdapter.addOne(
        state.byChatId[chatId].data,
        message
      )
    },
    setMessages: (
      state,
      action: PayloadAction<{chatId: string; messages: Message[]}>
    ) => {
      const {chatId, messages} = action.payload

      if (!state.byChatId[chatId]) {
        state.byChatId[chatId] = {
          data: messagesAdapter.getInitialState(),
          isLoading: false,
        }
      }
      state.byChatId[chatId].data = messagesAdapter.setMany(
        state.byChatId[chatId].data,
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
        messagesAdapter.updateOne(state.byChatId[chatId].data, {id, changes})
      }
    },
    removeMessage: (
      state,
      action: PayloadAction<{chatId: string; id: string}>
    ) => {
      const {chatId, id} = action.payload

      if (state.byChatId[chatId]) {
        messagesAdapter.removeOne(state.byChatId[chatId].data, id)
      }
    },
  },
  extraReducers: (builder) => {
    /** CHATS THUNKS HANDLING */
    builder.addCase(chatsThunks.getChats.fulfilled, (state, action) => {
      action.payload.forEach((chat) => {
        if (!state.byChatId[chat.id]) {
          state.byChatId[chat.id] = {
            data: messagesAdapter.getInitialState(),
            isLoading: false,
          }
        }
      })
    })
    builder.addCase(chatsThunks.getChat.fulfilled, (state, action) => {
      const chatId = action.payload?.id

      if (!chatId) {
        return
      }
      if (!state.byChatId[chatId]) {
        state.byChatId[chatId] = {
          data: messagesAdapter.getInitialState(),
          isLoading: false,
        }
      }
    })
    builder.addCase(chatsThunks.createChat.fulfilled, (state, action) => {
      const chatId = action.payload.id
      state.byChatId[chatId] = {
        data: messagesAdapter.getInitialState(),
        isLoading: false,
      }
    })
    /** MESSAGES THUNKS HANDLING */
    builder.addCase(messagesThunks.getMessages.pending, (state, action) => {
      const {chatId} = action.meta.arg
      if (state.byChatId[chatId]) {
        state.byChatId[chatId].isLoading = true
      }
    })
    builder.addCase(messagesThunks.getMessages.fulfilled, (state, action) => {
      const {chatId} = action.meta.arg

      if (state.byChatId[chatId]) {
        if (action.meta.arg.direction === GetMessagesDirection.AROUND) {
          messagesAdapter.setAll(state.byChatId[chatId].data, action.payload)
        } else {
          messagesAdapter.setMany(state.byChatId[chatId].data, action.payload)
        }
        state.byChatId[chatId].isLoading = false
      }
    })
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

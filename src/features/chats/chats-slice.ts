import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import persistReducer from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage'

import type {Chat} from './types'
import type {RootState} from '../../app/store'
import {chatsThunks} from './api'

interface ChatsState {
  currentChatId?: string
  isMessagesLoading: boolean
}

const chatsAdapter = createEntityAdapter<Chat, string>({
  selectId: (chat) => chat.id,
  sortComparer: (a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
})

const chatsSlice = createSlice({
  name: 'chatsSlice',
  initialState: chatsAdapter.getInitialState<ChatsState>({
    isMessagesLoading: false,
  }),
  reducers: {
    setCurrentChat: (state, action: PayloadAction<string | undefined>) => {
      state.currentChatId = action.payload
    },
    setAllChats: chatsAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder.addCase(chatsThunks.createChat.fulfilled, (state, action) => {
      chatsAdapter.addOne(state, action.payload)
    })

    builder.addCase(chatsThunks.getChats.fulfilled, (state, action) => {
      chatsAdapter.setAll(state, action.payload)
    })
  },
})

export const chatsSelectors = chatsAdapter.getSelectors<RootState>(
  (state) => state.chats
)

export const chatsActions = chatsSlice.actions

export const persistedChatsReducer = persistReducer(
  {
    key: 'chats',
    storage: storage,
    blacklist: ['currentChatId'] as Array<keyof ChatsState>,
  },
  chatsSlice.reducer
)
